import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import { KID } from '../types';

interface AdvancedAnalyticsProps {
  selectedKids: KID[];
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ selectedKids }) => {
  // Données des scénarios de performance
  const performanceScenarios = [
    { scenario: 'Scénario de tensions', '1 an': -30, '3 ans': -10, '5 ans': -5 },
    { scenario: 'Scénario défavorable', '1 an': -10, '3 ans': -5, '5 ans': 0 },
    { scenario: 'Scénario intermédiaire', '1 an': 5, '3 ans': 15, '5 ans': 25 },
    { scenario: 'Scénario favorable', '1 an': 20, '3 ans': 35, '5 ans': 50 }
  ];

  // Calcul de l'évolution des scénarios dans le temps
  const timeEvolution = ['1 an', '3 ans', '5 ans'].map(period => ({
    période: period,
    'Écart favorable/défavorable': performanceScenarios[3][period] - performanceScenarios[1][period],
    'Potentiel de perte': performanceScenarios[0][period],
    'Performance moyenne': performanceScenarios[2][period]
  }));

  // Analyse des coûts cumulés
  const costs = {
    entry: 2,
    exit: 1,
    management: 1.5,
    transaction: 0.5,
    performance: 1
  };

  const cumulativeCosts = Array.from({ length: 6 }, (_, i) => {
    const year = i;
    const entryExitAmortized = (costs.entry + costs.exit) / 5;
    const recurring = costs.management + costs.transaction + costs.performance;
    return {
      année: year === 0 ? 'Initial' : `Année ${year}`,
      coûts: year === 0 ? costs.entry : (entryExitAmortized + recurring).toFixed(2),
      coûtsCumulés: year === 0 
        ? costs.entry 
        : (costs.entry + (entryExitAmortized + recurring) * year).toFixed(2)
    };
  });

  return (
    <div className="space-y-6">
      {/* Analyse de la dispersion des performances */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Évolution et Dispersion des Performances</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeEvolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="période" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Écart favorable/défavorable" 
                stroke="#82ca9d" 
                name="Dispersion des scénarios"
              />
              <Line 
                type="monotone" 
                dataKey="Potentiel de perte" 
                stroke="#ff7676" 
                name="Risque maximal"
              />
              <Line 
                type="monotone" 
                dataKey="Performance moyenne" 
                stroke="#8884d8" 
                name="Scénario moyen"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Dispersion maximale à 5 ans</p>
            <p className="font-semibold text-gray-900">
              {(performanceScenarios[3]['5 ans'] - performanceScenarios[1]['5 ans']).toFixed(1)}%
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Perte maximale (stress)</p>
            <p className="font-semibold text-gray-900">{performanceScenarios[0]['1 an']}%</p>
          </div>
        </div>
      </div>

      {/* Impact des coûts dans le temps */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Impact des Coûts dans le Temps</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeCosts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="année" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="coûts" 
                stroke="#82ca9d" 
                name="Coûts annuels"
              />
              <Line 
                type="monotone" 
                dataKey="coûtsCumulés" 
                stroke="#8884d8" 
                name="Coûts cumulés"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Coût total sur 5 ans</p>
            <p className="font-semibold text-gray-900">
              {cumulativeCosts[5].coûtsCumulés}%
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Coût annuel moyen</p>
            <p className="font-semibold text-gray-900">
              {((Number(cumulativeCosts[5].coûtsCumulés) / 5)).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Analyse des points clés */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Analyse Approfondie</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Profil Rendement/Risque</h4>
            <p className="text-sm text-blue-600">
              Le produit présente une dispersion de performance de{' '}
              {(performanceScenarios[3]['5 ans'] - performanceScenarios[1]['5 ans']).toFixed(1)}% 
              sur 5 ans, avec un scénario médian de {performanceScenarios[2]['5 ans']}%.
              La perte maximale en stress est de {Math.abs(performanceScenarios[0]['1 an'])}%.
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Impact des Coûts</h4>
            <p className="text-sm text-yellow-600">
              Les coûts cumulés sur 5 ans représentent {cumulativeCosts[5].coûtsCumulés}% 
              de l'investissement, soit {((Number(cumulativeCosts[5].coûtsCumulés) / 5)).toFixed(2)}% 
              par an en moyenne. Les coûts sont plus élevés la première année 
              ({costs.entry}% de frais d'entrée).
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Horizon d'Investissement</h4>
            <p className="text-sm text-green-600">
              La période de détention recommandée est de 5 ans. 
              Les scénarios montrent une amélioration progressive des performances minimales, 
              passant de {performanceScenarios[1]['1 an']}% à {performanceScenarios[1]['5 ans']}% 
              dans le scénario défavorable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
