import React from 'react';
import { Costs } from '../types';

interface CostBreakdownProps {
  costs: Costs;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ costs }) => {
  const { compositionOfCosts } = costs;

  // Fonction pour formater les coûts
  const formatCost = (cost: number | string) => {
    if (typeof cost === 'string') {
      // Si c'est une chaîne qui se termine par '%', on la convertit en nombre
      if (cost.endsWith('%')) {
        return Number(cost.replace('%', ''));
      }
      return Number(cost);
    }
    return cost;
  };

  // Fonction pour formater l'affichage
  const formatDisplay = (value: number) => {
    if (value === 0) return '0';
    return `${value.toFixed(2)}%`;
  };

  const costItems = [
    { label: "Coûts d'entrée", value: formatCost(compositionOfCosts.entryCosts) },
    { label: "Coûts de sortie", value: formatCost(compositionOfCosts.exitCosts) },
    { label: "Coûts de transaction", value: formatCost(compositionOfCosts.transactionCosts) },
    { label: "Coûts récurrents", value: formatCost(compositionOfCosts.ongoingCosts) },
    { label: "Coûts accessoires", value: formatCost(compositionOfCosts.incidentalCosts) }
  ];


  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Répartition des coûts</h3>
      <div className="space-y-2">
        {costItems.map((cost) => (
          <div
            key={cost.label}
            className="flex justify-between items-center border-b pb-2 hover:bg-gray-50 transition-all duration-200 p-2 rounded-lg cursor-pointer group"
          >
            <span className="text-gray-600 group-hover:text-gray-900">{cost.label}</span>
            <span className="font-medium text-gray-900 group-hover:scale-110 transition-transform duration-200">
              {formatDisplay(cost.value)}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
};

export default CostBreakdown;
