import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const imageModel = 'gemini-2.5-flash-image';

const getBase64FromUrl = async (url: string): Promise<{data: string, mimeType: string}> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const mimeType = blob.type;
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = (reader.result as string).split(',')[1];
            resolve({ data: base64data, mimeType });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const extractBase64Data = (response: GenerateContentResponse): string => {
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("No image data found in Gemini response");
};

export const removeBackground = async (imageData: string, mimeType: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: imageModel,
        contents: {
            parts: [
                {
                    inlineData: {
                        data: imageData,
                        mimeType: mimeType,
                    },
                },
                {
                    text: 'Segment the main object from this image, remove the background completely, and return the result as a PNG with a transparent background.',
                },
            ],
        },
    });
    return extractBase64Data(response);
};

export const generateFinalImageFromPrompt = async (objectData: string, prompt: string): Promise<string> => {
    const finalPrompt = `Sua tarefa é posicionar realisticamente o objeto fornecido em uma nova cena.
A nova cena é descrita pelo seguinte texto: "${prompt}".
É crucial que você use o objeto exato da imagem de entrada. Não gere um novo objeto ou um similar. A saída final deve ser uma única imagem mostrando o objeto original perfeitamente integrado na cena gerada.`;

    const response = await ai.models.generateContent({
        model: imageModel,
        contents: {
            parts: [
                {
                    inlineData: {
                        data: objectData,
                        mimeType: 'image/png', // O objeto segmentado é sempre PNG
                    },
                },
                {
                    text: finalPrompt,
                },
            ],
        },
        config: {
            imageConfig: {
                aspectRatio: "1:1"
            }
        }
    });
    return extractBase64Data(response);
};

export const compositeImages = async (objectData: string, sceneDataOrUrl: string, prompt: string): Promise<string> => {
    let scenePart;
    if (sceneDataOrUrl.startsWith('http')) {
        const { data, mimeType } = await getBase64FromUrl(sceneDataOrUrl);
        scenePart = {
            inlineData: {
                data,
                mimeType,
            },
        };
    } else {
        scenePart = {
            inlineData: {
                data: sceneDataOrUrl,
                mimeType: 'image/png', // Assumir que a cena gerada é PNG
            },
        };
    }
    
    const finalPrompt = `Sua tarefa é combinar duas imagens.
Você recebeu uma imagem de um objeto e uma imagem de uma cena.
Posicione o objeto da primeira imagem na cena da segunda imagem.
É crucial que você use o objeto exato da imagem de entrada. Não o altere nem o substitua.
Siga estas instruções do usuário para o posicionamento: "${prompt}".
A saída final deve ser uma única imagem composta de forma realista.`;

    const response = await ai.models.generateContent({
        model: imageModel,
        contents: {
            parts: [
                {
                    inlineData: {
                        data: objectData,
                        mimeType: 'image/png', // O objeto segmentado é sempre PNG
                    },
                },
                scenePart,
                {
                    text: finalPrompt,
                },
            ],
        },
    });

    return extractBase64Data(response);
};
