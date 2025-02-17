import React from 'react';
import { Costs } from '../types';

interface CostBreakdownProps {
  costs: Costs;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ costs }) => {
  const { compositionOfCosts } = costs;

  const costItems = [
    { label: "Coûts d'entrée", value: compositionOfCosts.entryCosts },
    { label: "Coûts de sortie", value: compositionOfCosts.exitCosts },
    { label: "Coûts de transaction", value: compositionOfCosts.transactionCosts },
    { label: "Coûts récurrents", value: compositionOfCosts.ongoingCosts },
    { label: "Coûts accessoires", value: compositionOfCosts.incidentalCosts }
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
              {cost.value || 'N/A'}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
};

export default CostBreakdown;
