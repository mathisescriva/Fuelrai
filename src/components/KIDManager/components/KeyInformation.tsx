import React from 'react';
import { KID } from '../types';

interface KeyInformationProps {
  info: KID;
}

const KeyInformation: React.FC<KeyInformationProps> = ({ info }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const getDefaultValue = (value: any, defaultText: string = 'Information non disponible') => {
    if (value === undefined || value === null || value === '') {
      return defaultText;
    }
    return value;
  };

  const infoItems = [
    // Informations générales
    { 
      label: 'Nom du produit', 
      value: getDefaultValue(info.productDetails?.productName, 'Nom du produit non spécifié'),
      category: 'Général'
    },
    { 
      label: 'Type de produit', 
      value: getDefaultValue(info.productDetails?.productType, 'Produit financier'),
      category: 'Général'
    },
    { 
      label: 'ISIN', 
      value: getDefaultValue(info.productDetails?.isin, 'ISIN non disponible'),
      category: 'Général'
    },
    { 
      label: 'Émetteur', 
      value: getDefaultValue(info.manufacturerName, 'Émetteur non spécifié'),
      category: 'Général'
    },
    { 
      label: 'Forme juridique', 
      value: getDefaultValue(info.productDetails?.legalFormOrStructure, 'OPCVM'),
      category: 'Général'
    },
    { 
      label: 'Pays de commercialisation', 
      value: getDefaultValue(info.productDetails?.publicOfferCountries?.join(', '), 'France'),
      category: 'Général'
    },
    
    // Objectifs et stratégie
    { 
      label: 'Objectif', 
      value: getDefaultValue(info.objectivesAndStrategy?.objectives, 'L\'objectif est d\'obtenir une performance supérieure à celle de son indice de référence sur la durée de placement recommandée'),
      category: 'Stratégie'
    },
    { 
      label: 'But', 
      value: getDefaultValue(info.purpose, 'Valorisation du capital sur le long terme'),
      category: 'Stratégie'
    },
    
    // Informations pratiques
    { 
      label: 'Date du document', 
      value: getDefaultValue(info.documentDate ? formatDate(info.documentDate) : null, formatDate(new Date().toISOString())),
      category: 'Pratique'
    },
    { 
      label: 'Devise', 
      value: getDefaultValue(info.productDetails?.currency, 'EUR'),
      category: 'Pratique'
    },
    { 
      label: 'Période de détention recommandée', 
      value: getDefaultValue(info.redemptionInformation?.recommendedHoldingPeriod, '5 ans'),
      category: 'Pratique'
    },
    { 
      label: 'Rachat anticipé', 
      value: getDefaultValue(info.redemptionInformation?.earlyRedemptionPossible ? 'Possible' : 'Non possible', 'Possible avec conditions'),
      category: 'Pratique'
    },
    
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Informations clés</h3>
      <div className="space-y-6">
        {['Général', 'Stratégie', 'Pratique'].map(category => (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-medium text-gray-500">{category}</h4>
            <div className="grid grid-cols-2 gap-4">
              {infoItems
                .filter(item => item.category === category)
                .map((item) => (
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
        ))}
      </div>
    </div>
  );
};

export default KeyInformation;
