import React from 'react';
import { KID } from '../types';

interface KeyInformationProps {
  info: KID;
}

const KeyInformation: React.FC<KeyInformationProps> = ({ info }) => {
  const infoItems = [
    // Informations générales
    { label: 'Nom du produit', value: info.productDetails.productName },
    { label: 'Type de produit', value: info.productDetails.productType },
    { label: 'ISIN', value: info.productDetails.isin },
    { label: 'Émetteur', value: info.manufacturerName },
    { label: 'Forme juridique', value: info.productDetails.legalFormOrStructure },
    { label: 'Pays de commercialisation', value: info.productDetails.publicOfferCountries?.join(', ') || 'N/A' },
    
    // Objectifs et stratégie
    { label: 'Objectif', value: info.objectivesAndStrategy?.objectives || 'N/A' },
    { label: 'But', value: info.purpose || 'N/A' },
    
    // Informations pratiques
    { label: 'Date du document', value: info.documentDate },
    { label: 'Devise', value: info.productDetails.currency },
    { label: 'Période de détention recommandée', value: info.redemptionInformation.recommendedHoldingPeriod },
    { label: 'Rachat anticipé', value: info.redemptionInformation.earlyRedemptionPossible ? 'Possible' : 'Non possible' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Informations clés</h3>
      <div className="grid grid-cols-2 gap-4">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="bg-gray-50 p-3 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
          >
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className="font-medium text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyInformation;
