
import React, { useState } from 'react';

interface FinalizeStepProps {
    objectImage: string | null;
    sceneImage: string | null;
    onFinalize: (prompt: string) => void;
}

const FinalizeStep: React.FC<FinalizeStepProps> = ({ objectImage, sceneImage, onFinalize }) => {
    const [prompt, setPrompt] = useState('Posicione o objeto de forma realista na cena, combinando iluminação e perspectiva.');

    const handleFinalizeClick = () => {
        if(prompt.trim()) {
            onFinalize(prompt.trim());
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl font-semibold text-gray-200 mb-4 text-center">Combinar e Refinar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Seu Objeto</h3>
                    <div className="w-full aspect-square bg-gray-700/50 rounded-lg flex items-center justify-center p-4">
                        {objectImage && <img src={objectImage} alt="Object" className="max-w-full max-h-full object-contain" />}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Sua Cena</h3>
                     <div className="w-full aspect-square bg-gray-700/50 rounded-lg flex items-center justify-center overflow-hidden">
                        {sceneImage && <img src={sceneImage} alt="Scene" className="w-full h-full object-cover" />}
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="finalize-prompt" className="block text-lg font-medium text-gray-300 mb-2">Prompt de Refinamento</label>
                <p className="text-gray-400 mb-3 text-sm">Descreva como você quer que o objeto seja posicionado. Seja específico para melhores resultados!</p>
                <textarea
                    id="finalize-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    rows={4}
                />
            </div>

            <button
                onClick={handleFinalizeClick}
                disabled={!prompt.trim()}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg"
            >
                Criar Imagem Final
            </button>
        </div>
    );
};

export default FinalizeStep;