import React from 'react';

const DemoWarning: React.FC = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Version de démonstration
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Cette version est hébergée sur un Mac mini M4, ce qui entraîne des temps d'inférence plus longs (entre 5 et 7 minutes par upload).
            </p>
            <p className="mt-2">
              Le but est de démontrer l'architecture de la solution. Veuillez noter que le LLM et le VLM ne sont pas entraînés sur ce type de document, 
              ce qui peut entraîner des résultats irréguliers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoWarning;
