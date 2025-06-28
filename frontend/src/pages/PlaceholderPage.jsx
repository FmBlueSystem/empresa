import React from 'react';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-dark">{title} - Próximamente</h1>
    </div>
  );
};

export default PlaceholderPage;