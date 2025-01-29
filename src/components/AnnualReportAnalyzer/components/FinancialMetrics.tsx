import React from 'react';
import { FinancialMetrics as FinancialMetricsType } from '../types';

interface FinancialMetricsProps {
  metrics: FinancialMetricsType;
}

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ metrics }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Métriques Financières</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Chiffre d'affaires</p>
          <p className="text-lg font-medium">{metrics.revenue.toLocaleString()} €</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Résultat d'exploitation</p>
          <p className="text-lg font-medium">{metrics.operatingIncome.toLocaleString()} €</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Résultat net</p>
          <p className="text-lg font-medium">{metrics.netIncome.toLocaleString()} €</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">BPA</p>
          <p className="text-lg font-medium">{metrics.eps.toFixed(2)} €</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Dividende par action</p>
          <p className="text-lg font-medium">{metrics.dividendPerShare.toFixed(2)} €</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialMetrics;
