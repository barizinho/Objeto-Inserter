
import React from 'react';
import IconButton from './IconButton';

interface ResultDisplayProps {
  finalImage: string | null;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ finalImage, onReset }) => {
  const handleDownload = () => {
    if (finalImage) {
      const link = document.createElement('a');
      link.href = finalImage;
      link.download = 'generated-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full text-center">
      <h2 className="text-3xl font-bold text-gray-100 mb-4">Sua Obra-prima está Pronta!</h2>
      <div className="w-full max-w-2xl mx-auto aspect-square bg-gray-700/50 rounded-xl shadow-lg flex items-center justify-center p-4 my-6">
        {finalImage ? (
          <img src={finalImage} alt="Final generated" className="max-w-full max-h-full object-contain rounded-lg" />
        ) : (
          <p className="text-gray-400">Não foi possível carregar a imagem.</p>
        )}
      </div>
      <div className="flex justify-center gap-4">
        <IconButton
          onClick={handleDownload}
          text="Baixar"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          }
          className="bg-green-600 hover:bg-green-700"
        />
        <IconButton
          onClick={onReset}
          text="Começar de Novo"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          }
          className="bg-gray-600 hover:bg-gray-700"
        />
      </div>
    </div>
  );
};

export default ResultDisplay;