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
  if (!selectedKids || selectedKids.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Veuillez sélectionner un KID pour voir l'analyse avancée
      </div>
    );
  }

  const kid = selectedKids[0]; // On prend le premier KID pour l'analyse
  
  // Transformation des scénarios de performance
  const performanceScenarios = kid.performanceScenarios.scenarios.map(scenario => {
    const oneYear = scenario.periods.find(p => p.holdingPeriod === '1 an');
    const fiveYears = scenario.periods.find(p => p.holdingPeriod === '5 ans');
    return {
      scenario: scenario.scenarioName,
      '1 an': parseFloat(oneYear?.performance || '0'),
      '5 ans': parseFloat(fiveYears?.performance || '0')
    };
  });

  // Calcul de l'évolution des scénarios dans le temps
  const timeEvolution = ['1 an', '5 ans'].map(period => {
    const favorable = performanceScenarios.find(s => s.scenario === 'Favorable')?.[period] || 0;
    const defavorable = performanceScenarios.find(s => s.scenario === 'Defavorable')?.[period] || 0;
    const tensions = performanceScenarios.find(s => s.scenario === 'Tensions')?.[period] || 0;
    const intermediaire = performanceScenarios.find(s => s.scenario === 'Intermediaire')?.[period] || 0;

    return {
      période: period,
      'Écart favorable/défavorable': favorable - defavorable,
      'Potentiel de perte': tensions,
      'Performance moyenne': intermediaire
    };
  });

  // Analyse des coûts
  const costs = {
    entry: kid.costs.compositionOfCosts.entryCosts / 100,
    exit: kid.costs.compositionOfCosts.exitCosts / 100,
    ongoing: kid.costs.compositionOfCosts.ongoingCosts / 100,
    transaction: kid.costs.compositionOfCosts.transactionCosts / 100,
    incidental: kid.costs.compositionOfCosts.incidentalCosts / 100
  };

  const cumulativeCosts = Array.from({ length: 6 }, (_, i) => {
    const year = i;
    const entryExitAmortized = (costs.entry + costs.exit) / 5;
    const recurring = costs.ongoing + costs.transaction + costs.incidental;
    const annualCost = entryExitAmortized + recurring;
    return {
      année: year === 0 ? 'Initial' : `Année ${year}`,
      coûts: year === 0 ? costs.entry : annualCost.toFixed(2),
      coûtsCumulés: year === 0 
        ? costs.entry 
        : (costs.entry + annualCost * year).toFixed(2)
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
              Pour un investissement initial de {kid.performanceScenarios.initialInvestment.toLocaleString()} {kid.productDetails.currency}, 
              le produit présente une dispersion de performance de{' '}
              {(performanceScenarios.find(s => s.scenario === 'Favorable')?.['5 ans'] || 0 - 
                performanceScenarios.find(s => s.scenario === 'Defavorable')?.['5 ans'] || 0).toFixed(1)}% 
              sur 5 ans. Le scénario intermédiaire montre un rendement de {performanceScenarios.find(s => s.scenario === 'Intermediaire')?.['5 ans']}% 
              sur 5 ans, soit un montant final de {kid.performanceScenarios.scenarios.find(s => s.scenarioName === 'Intermediaire')?.periods.find(p => p.holdingPeriod === '5 ans')?.finalAmount.toLocaleString()} {kid.productDetails.currency}.
              En cas de scénario de tensions, la perte maximale à 1 an pourrait atteindre {Math.abs(performanceScenarios.find(s => s.scenario === 'Tensions')?.['1 an'] || 0)}%, 
              soit un montant de {kid.performanceScenarios.scenarios.find(s => s.scenarioName === 'Tensions')?.periods.find(p => p.holdingPeriod === '1 an')?.finalAmount.toLocaleString()} {kid.productDetails.currency}.
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Impact des Coûts</h4>
            <p className="text-sm text-yellow-600">
              Les coûts cumulés sur 5 ans représentent {cumulativeCosts[5].coûtsCumulés}% 
              de l'investissement, soit {((Number(cumulativeCosts[5].coûtsCumulés) / 5)).toFixed(2)}% 
              par an en moyenne. Les coûts d'entrée sont de {(costs.entry).toFixed(2)}%, 
              les coûts récurrents de {(costs.ongoing).toFixed(2)}% par an, 
              et les coûts accessoires (commission de performance) de {(costs.incidental).toFixed(2)}% par an.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Horizon d'Investissement</h4>
            <p className="text-sm text-green-600">
              La période de détention recommandée est de {kid.redemptionInformation.recommendedHoldingPeriod}. 
              Dans le scénario défavorable, la performance s'améliore de {performanceScenarios.find(s => s.scenario === 'Defavorable')?.['1 an']}% à 1 an 
              ({kid.performanceScenarios.scenarios.find(s => s.scenarioName === 'Defavorable')?.periods.find(p => p.holdingPeriod === '1 an')?.finalAmount.toLocaleString()} {kid.productDetails.currency}) 
              à {performanceScenarios.find(s => s.scenario === 'Defavorable')?.['5 ans']}% à 5 ans
              ({kid.performanceScenarios.scenarios.find(s => s.scenarioName === 'Defavorable')?.periods.find(p => p.holdingPeriod === '5 ans')?.finalAmount.toLocaleString()} {kid.productDetails.currency}).
              {kid.redemptionInformation.earlyRedemptionPossible && " Le rachat anticipé est possible."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
