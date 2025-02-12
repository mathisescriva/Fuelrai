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
    // Document
    { 
      label: 'Titre du document', 
      value: getDefaultValue(info.documentTitle),
      category: 'Document'
    },
    { 
      label: 'Langue', 
      value: getDefaultValue(info.documentLanguage),
      category: 'Document'
    },
    { 
      label: 'Date du document', 
      value: getDefaultValue(info.documentDate),
      category: 'Document'
    },
    { 
      label: 'Fabricant', 
      value: getDefaultValue(info.manufacturerName),
      category: 'Document'
    },

    // Produit
    { 
      label: 'Nom du produit', 
      value: getDefaultValue(info.productDetails?.productName),
      category: 'Produit'
    },
    { 
      label: 'Type', 
      value: getDefaultValue(info.productDetails?.productType),
      category: 'Produit'
    },
    { 
      label: 'ISIN', 
      value: getDefaultValue(info.productDetails?.isin),
      category: 'Produit'
    },
    { 
      label: 'Pays de commercialisation', 
      value: getDefaultValue(info.productDetails?.publicOfferCountries?.join(', ')),
      category: 'Produit'
    },
    { 
      label: 'Forme juridique', 
      value: getDefaultValue(info.productDetails?.legalFormOrStructure),
      category: 'Produit'
    },
    { 
      label: 'Devise', 
      value: getDefaultValue(info.productDetails?.currency),
      category: 'Produit'
    },

    // Objectifs
    { 
      label: 'Objectif principal', 
      value: getDefaultValue(info.purpose),
      category: 'Objectifs'
    },
    { 
      label: 'Détails de la stratégie', 
      value: getDefaultValue(info.objectivesAndStrategy?.objectives),
      category: 'Objectifs'
    },
    { 
      label: 'Horizon recommandé', 
      value: getDefaultValue(info.objectivesAndStrategy?.horizonRecommended),
      category: 'Objectifs'
    },

    // Risques
    { 
      label: 'Indicateur de risque', 
      value: getDefaultValue(info.risks?.riskIndicator),
      category: 'Risques'
    },

    // Rachat
    { 
      label: 'Période de détention recommandée', 
      value: getDefaultValue(info.redemptionInformation?.recommendedHoldingPeriod),
      category: 'Rachat'
    },
    { 
      label: 'Rachat anticipé', 
      value: info.redemptionInformation?.earlyRedemptionPossible ? 'Possible' : 'Non possible',
      category: 'Rachat'
    },
    { 
      label: 'Pénalités de rachat anticipé', 
      value: getDefaultValue(info.redemptionInformation?.earlyRedemptionPenalties, 'Aucune pénalité'),
      category: 'Rachat'
    }
  ];

  const categories = ['Document', 'Produit', 'Objectifs', 'Risques', 'Rachat'];

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Informations clés</h3>
      <div className="space-y-6">
        {categories.map(category => (
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
