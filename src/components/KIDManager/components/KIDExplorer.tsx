import React, { useState } from 'react';
import { KID } from '../types';

// Fonction pour exporter en CSV
const exportToCSV = (kids: KID[]) => {
  const headers = ['Nom', 'ISIN', 'Émetteur', 'Garant', 'Date d\'émission', 'Date de maturité', 'Devise', 'Montant nominal'];
  const rows = kids.map(kid => [
    kid.name,
    kid.keyInfo.isin,
    kid.keyInfo.issuer,
    kid.keyInfo.guarantor,
    kid.keyInfo.issueDate,
    kid.keyInfo.maturityDate,
    kid.keyInfo.currency,
    kid.keyInfo.nominalAmount
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'kids_export.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Fonction pour exporter en JSON
const exportToJSON = (kids: KID[]) => {
  const jsonContent = JSON.stringify(kids, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'kids_export.json');
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
    kid.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              onClick={() => exportToCSV(filteredKids)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Exporter CSV
            </button>
            <button
              onClick={() => exportToJSON(filteredKids)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Exporter JSON
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKids.map((kid) => (
            <div
              key={kid.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold mb-2">{kid.name}</h3>
              <div className="text-sm text-gray-600">
                <p>ISIN: {kid.keyInfo.isin}</p>
                <p>Émetteur: {kid.keyInfo.issuer}</p>
                <p>Date d'émission: {kid.keyInfo.issueDate}</p>
                <p>Date de maturité: {kid.keyInfo.maturityDate}</p>
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
