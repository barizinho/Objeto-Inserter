
import React, { useState } from 'react';
import { PREDEFINED_SCENES, PREDEFINED_PROMPTS } from '../constants';

interface SceneSelectorProps {
  segmentedImage: string | null;
  onSceneSelect: (imageUrl: string) => void;
  onSceneGenerate: (prompt: string) => void;
}

const SceneSelector: React.FC<SceneSelectorProps> = ({ segmentedImage, onSceneSelect, onSceneGenerate }) => {
  const [prompt, setPrompt] = useState('');

  const handleGenerateClick = () => {
    if (prompt.trim()) {
      onSceneGenerate(prompt.trim());
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-200 mb-4 text-center">Seu Objeto</h2>
            {segmentedImage && (
                <div className="bg-gray-700/50 p-4 rounded-xl shadow-lg">
                    <img src={segmentedImage} alt="Segmented Object" className="max-w-full max-h-64 object-contain rounded-lg" />
                </div>
            )}
        </div>

        <div className="md:col-span-3">
            <h2 className="text-2xl font-semibold text-gray-200 mb-2">Gerar uma Cena</h2>
            <p className="text-gray-400 mb-4">Descreva a cena onde você quer posicionar seu objeto.</p>
            
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Uma mulher estilosa segurando o objeto em uma praia ensolarada ao pôr do sol."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows={3}
            />
            <div className="flex flex-wrap gap-2 my-3">
              {PREDEFINED_PROMPTS.slice(0, 3).map(p => (
                <button key={p} onClick={() => setPrompt(p)} className="text-xs bg-gray-600 hover:bg-gray-500 text-gray-200 px-2 py-1 rounded-full transition-colors">
                  {p}
                </button>
              ))}
            </div>
            <button
                onClick={handleGenerateClick}
                disabled={!prompt.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
                Gerar Cena
            </button>
            
            <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-500">OU</span>
                <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <h3 className="text-xl font-semibold text-gray-200 mb-4">Selecione uma Cena Pré-definida</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {PREDEFINED_SCENES.map(scene => (
                    <div key={scene.id} onClick={() => onSceneSelect(scene.url)} className="cursor-pointer group">
                        <img src={scene.url} alt={scene.name} className="w-full h-24 object-cover rounded-lg group-hover:ring-2 ring-blue-500 transition-all" />
                        <p className="text-xs text-gray-400 mt-1 group-hover:text-white">{scene.name}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SceneSelector;