import React, { useState, useCallback } from 'react';
import { AppStep } from './types';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import ImageUploader from './components/ImageUploader';
import SceneSelector from './components/SceneSelector';
import FinalizeStep from './components/FinalizeStep';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { removeBackground, generateFinalImageFromPrompt, compositeImages } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [segmentedImage, setSegmentedImage] = useState<string | null>(null);
  const [sceneImage, setSceneImage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleReset = useCallback(() => {
    setStep(AppStep.UPLOAD);
    setOriginalImage(null);
    setSegmentedImage(null);
    setSceneImage(null);
    setFinalImage(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleError = (message: string) => {
    setError(message);
    setIsLoading(false);
  };

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      setOriginalImage(`data:${file.type};base64,${base64Data}`);
      setStep(AppStep.SEGMENTING);
      try {
        const segmented = await removeBackground(base64Data, file.type);
        setSegmentedImage(`data:image/png;base64,${segmented}`);
        setStep(AppStep.CHOOSE_SCENE);
      } catch (e) {
        console.error(e);
        handleError("Falha ao remover o fundo. Por favor, tente outra imagem.");
        setStep(AppStep.UPLOAD);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSceneSelect = useCallback((imageUrl: string) => {
    setSceneImage(imageUrl);
    setStep(AppStep.FINALIZE);
  }, []);

  const handleSceneGenerate = useCallback(async (prompt: string) => {
    if (!segmentedImage) {
      handleError("Imagem do objeto recortado ausente.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setStep(AppStep.COMPOSITING);
    try {
      const objectData = segmentedImage.split(',')[1];
      const result = await generateFinalImageFromPrompt(objectData, prompt);
      setFinalImage(`data:image/png;base64,${result}`);
      setStep(AppStep.RESULT);
    } catch (e) {
      console.error(e);
      handleError("Falha ao gerar a imagem final. Por favor, tente um prompt diferente.");
      setStep(AppStep.CHOOSE_SCENE);
    } finally {
      setIsLoading(false);
    }
  }, [segmentedImage]);

  const handleFinalize = useCallback(async (prompt: string) => {
    if (!segmentedImage || !sceneImage) {
      handleError("Imagem do objeto recortado ou da cena ausente.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setStep(AppStep.COMPOSITING);
    try {
      const objectData = segmentedImage.split(',')[1];
      const sceneData = sceneImage.split(',')[1];
      
      const result = await compositeImages(objectData, sceneData, prompt);
      setFinalImage(`data:image/png;base64,${result}`);
      setStep(AppStep.RESULT);
    } catch (e) {
      console.error(e);
      handleError("Falha ao criar a imagem final. Por favor, tente novamente.");
      setStep(AppStep.FINALIZE);
    } finally {
      setIsLoading(false);
    }
  }, [segmentedImage, sceneImage]);

  const renderStep = () => {
    if (isLoading) {
      let loadingText = 'Processando...';
      switch (step) {
        case AppStep.SEGMENTING: loadingText = 'Removendo o fundo...'; break;
        case AppStep.COMPOSITING: loadingText = 'Criando sua imagem final...'; break;
      }
      return <Loader text={loadingText} />;
    }

    switch (step) {
      case AppStep.UPLOAD:
        return <ImageUploader onImageUpload={handleImageUpload} />;
      case AppStep.CHOOSE_SCENE:
        return (
            <SceneSelector 
                segmentedImage={segmentedImage}
                onSceneSelect={handleSceneSelect}
                onSceneGenerate={handleSceneGenerate}
            />
        );
      case AppStep.FINALIZE:
        return (
            <FinalizeStep 
                objectImage={segmentedImage}
                sceneImage={sceneImage}
                onFinalize={handleFinalize}
            />
        );
      case AppStep.RESULT:
        return <ResultDisplay finalImage={finalImage} onReset={handleReset} />;
      default:
        return null; 
    }
  };

  const getCurrentStepIndex = () => {
    switch(step) {
      case AppStep.UPLOAD:
      case AppStep.SEGMENTING:
        return 0;
      case AppStep.CHOOSE_SCENE:
        return 1;
      case AppStep.FINALIZE:
      case AppStep.COMPOSITING:
        return 2;
      case AppStep.RESULT:
        return 3;
      default:
        return 0;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <Header />
        <main className="mt-8 bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10">
          <StepIndicator currentStep={getCurrentStepIndex()} />
          {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg my-4 text-center">{error}</div>}
          <div className="mt-8">
            {renderStep()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;