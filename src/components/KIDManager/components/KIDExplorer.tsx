import React, { useState } from 'react';
import { KID } from '../types';

// Fonction pour exporter au format RAG-Ready
const exportToRAGFormat = (kids: KID[]) => {
  const ragReadyData = kids.map(kid => ({
    title: kid.productDetails.productName,
    metadata: {
      isin: kid.productDetails.isin,
      issuer: kid.manufacturerName,
      currency: kid.productDetails.currency,
      productType: kid.productDetails.productType,
      legalForm: kid.productDetails.legalFormOrStructure,
      riskLevel: kid.risks.riskIndicator,
      recommendedHoldingPeriod: kid.redemptionInformation.recommendedHoldingPeriod
    },
    content: JSON.stringify(kid) // Inclut toutes les données pour le traitement RAG
  }));

  const jsonContent = JSON.stringify(ragReadyData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'kids_rag_ready.json');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface KIDExplorerProps {
  kids: KID[];
  onClose: () => void;
}

const KIDExplorer: React.FC<KIDExplorerProps> = ({ kids, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredKids = kids.filter(kid =>
    (kid.productDetails.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (kid.productDetails.isin || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (kid.manufacturerName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Explorer les KIDs</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-2 border border-gray-300 rounded-lg mr-4"
          />
          <div className="flex space-x-2">
            <button
              onClick={() => exportToRAGFormat(filteredKids)}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              Convertir au format RAG
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKids.map((kid) => (
            <div
              key={kid.productDetails?.isin || Math.random().toString()}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold mb-2">{kid.productDetails?.productName || 'Produit sans nom'}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">ISIN:</span> {kid.productDetails?.isin || 'Non spécifié'}</p>
                <p><span className="font-medium">Émetteur:</span> {kid.manufacturerName || 'Non spécifié'}</p>
                <p><span className="font-medium">Type:</span> {kid.productDetails?.productType || 'Non spécifié'}</p>
                <p><span className="font-medium">Devise:</span> {kid.productDetails?.currency || 'EUR'}</p>
                <p><span className="font-medium">Risque:</span> {kid.risks?.riskIndicator ? `${kid.risks.riskIndicator}/7` : 'Non spécifié'}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredKids.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            Aucun KID trouvé pour cette recherche
          </p>
        )}
      </div>
    </div>
  );
};

export default KIDExplorer;
