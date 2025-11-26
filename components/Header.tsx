
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
        Inserção Inteligente de Objetos
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Da foto à cena perfeita em segundos.
      </p>
    </header>
  );
};

export default Header;