import React from 'react';
import { Costs } from '../types';

interface CostBreakdownProps {
  costs: Costs;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ costs }) => {
  const { compositionOfCosts } = costs;

  // Fonction pour formater un coût (nombre ou chaîne)
  const formatCost = (cost: any) => {
    if (cost === undefined || cost === null) return 'N/A';
    if (typeof cost === 'number') return `${cost.toFixed(2)}%`;
    return cost;
  };

  // Fonction pour formater les coûts accessoires
  const formatIncidentalCosts = (incidentalCosts: any) => {
    if (!incidentalCosts) return 'N/A';
    if (typeof incidentalCosts === 'string') return incidentalCosts;
    if (typeof incidentalCosts === 'number') return `${incidentalCosts.toFixed(2)}%`;
    
    const fees = [];
    if (incidentalCosts.performanceFees !== undefined) {
      fees.push(`Performance: ${formatCost(incidentalCosts.performanceFees)}`);
    }
    if (incidentalCosts.carriedInterests !== undefined) {
      fees.push(`Intérêts: ${formatCost(incidentalCosts.carriedInterests)}`);
    }
    return fees.length > 0 ? fees.join(', ') : '0%';
  };

  // Fonction pour formater les coûts récurrents
  const formatOngoingCosts = (ongoingCosts: any) => {
    if (!ongoingCosts) return 'N/A';
    if (typeof ongoingCosts === 'string') return ongoingCosts;
    if (typeof ongoingCosts === 'number') return `${ongoingCosts.toFixed(2)}%`;
    
    const costs = [];
    if (ongoingCosts.portfolioTransactionCosts !== undefined) {
      costs.push(`Transaction: ${formatCost(ongoingCosts.portfolioTransactionCosts)}`);
    }
    if (ongoingCosts.otherOngoingCosts !== undefined) {
      costs.push(`Autres: ${formatCost(ongoingCosts.otherOngoingCosts)}`);
    }
    return costs.length > 0 ? costs.join(', ') : '0%';
  };

  const costItems = [
    { label: "Coûts d'entrée", value: formatCost(compositionOfCosts.entryCosts) },
    { label: "Coûts de sortie", value: formatCost(compositionOfCosts.exitCosts) },
    { label: "Coûts de transaction", value: formatCost(compositionOfCosts.ongoingCosts?.portfolioTransactionCosts) },
    { label: "Coûts récurrents", value: formatCost(compositionOfCosts.ongoingCosts?.otherOngoingCosts) },
    { label: "Coûts accessoires", value: formatIncidentalCosts(compositionOfCosts.incidentalCosts) }
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
