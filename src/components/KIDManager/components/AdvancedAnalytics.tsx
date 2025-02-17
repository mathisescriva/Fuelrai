import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { KID } from '../types';

interface AdvancedAnalyticsProps {
  selectedKids: KID[];
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ selectedKids }) => {
  // Fonction pour déterminer le type de scénario
  const getScenarioType = (scenarioName: string): 'favorable' | 'moderate' | 'unfavorable' | 'stress' => {
    const name = scenarioName.toLowerCase();
    if (name.includes('favor') || name.includes('optim')) return 'favorable';
    if (name.includes('moder') || name.includes('inter')) return 'moderate';
    if (name.includes('defav') || name.includes('unfav') || name.includes('pessi')) return 'unfavorable';
    if (name.includes('stress') || name.includes('tens')) return 'stress';
    return 'moderate'; // valeur par défaut
  };

  // Fonction pour normaliser la période
  const normalizePeriod = (period: string): string => {
    const normalized = period.toLowerCase().replace(/\s+/g, '');
    if (normalized.includes('1') || normalized.includes('one') || normalized.includes('un')) return '1year';
    if (normalized.includes('mat')) return 'maturity';
    return normalized;
  };

  // Définition des couleurs professionnelles
  const colors = {
    favorable: '#2E7D32',
    moderate: '#1565C0',
    unfavorable: '#E65100',
    stress: '#C62828'
  };
  // Définition des gradients pour les graphiques
  const gradients = {
    favorable: {
      id: 'colorFavorable',
      colors: ['#4ade8040', '#4ade8001']
    },
    moderate: {
      id: 'colorModerate',
      colors: ['#60a5fa40', '#60a5fa01']
    },
    unfavorable: {
      id: 'colorUnfavorable',
      colors: ['#f9731640', '#f9731601']
    },
    stress: {
      id: 'colorStress',
      colors: ['#ef444440', '#ef444401']
    }
  };
  if (!selectedKids || selectedKids.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Veuillez sélectionner un KID pour voir l'analyse avancée
      </div>
    );
  }

  const kid = selectedKids[0]; // On prend le premier KID pour l'analyse
  
  // Transformation des scénarios de performance
  const initialInvestment = kid.performanceScenarios.initialInvestment;
  const performanceScenarios = kid.performanceScenarios.scenarios.map(scenario => {
    // On prend les deux périodes disponibles
    const period1 = scenario.periods[0];
    const period2 = scenario.periods[1];

    // Convertir les performances en nombres pour les graphiques
    const perf1 = period1.annualPerformance ? 
      (typeof period1.annualPerformance === 'number' ? 
        period1.annualPerformance : 
        parseFloat(period1.annualPerformance.replace(',', '.').replace(' %', '').replace('-', '')) * (period1.annualPerformance.includes('-') ? -1 : 1)) : 0;
    const perf2 = period2.annualPerformance ? 
      (typeof period2.annualPerformance === 'number' ? 
        period2.annualPerformance : 
        parseFloat(period2.annualPerformance.replace(',', '.').replace(' %', '').replace('-', '')) * (period2.annualPerformance.includes('-') ? -1 : 1)) : 0;

    return {
      scenario: scenario.scenarioName,
      [period1.holdingPeriod]: period1.finalAmount,
      [period2.holdingPeriod]: period2.finalAmount,
      [`Performance ${period1.holdingPeriod}`]: perf1,
      [`Performance ${period2.holdingPeriod}`]: perf2,
      [`performance${normalizePeriod(period1.holdingPeriod)}`]: period1.annualPerformance,
      [`performance${normalizePeriod(period2.holdingPeriod)}`]: period2.annualPerformance,
      'Montant investi': initialInvestment
    };
  });

  // Récupérer les périodes du premier scénario
  const periods = kid.performanceScenarios.scenarios[0].periods.map(p => p.holdingPeriod);

  // Calcul de l'évolution des scénarios dans le temps
  const timeEvolution = periods.map(period => {
    const scenarios = performanceScenarios.reduce((acc, s) => {
      acc[getScenarioType(s.scenario)] = s[period] || 0;
      return acc;
    }, {} as Record<string, number>);

    return {
      période: period,
      'Écart favorable/défavorable': (scenarios.favorable || 0) - (scenarios.unfavorable || 0),
      'Potentiel de perte': scenarios.stress || 0,
      'Performance moyenne': scenarios.moderate || 0,
      'Montant investi': kid.performanceScenarios.initialInvestment
    };
  });



  return (
    <div className="space-y-6">
      {/* Graphique de comparaison des scénarios */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-900 mb-6">
          Comparaison des Scénarios de Performance
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={[
                { période: 'Initial', ...Object.fromEntries(performanceScenarios.map(s => [s.scenario, initialInvestment])) },
                ...periods.map(period => ({
                  période: period,
                  ...Object.fromEntries(performanceScenarios.map(s => [s.scenario, s[period]]))
                }))
              ]}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >

              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis 
                dataKey="période" 
                stroke="#424242"
                tick={{ fill: '#424242', fontSize: 12 }}
                axisLine={{ stroke: '#9E9E9E' }}
              />
              <YAxis 
                tickFormatter={(value) => `${value.toLocaleString('fr-FR')}€`}
                stroke="#424242"
                tick={{ fill: '#424242', fontSize: 12 }}
                axisLine={{ stroke: '#9E9E9E' }}
              />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString('fr-FR')}€`, 'Montant']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E0E0E0',
                  fontSize: '12px'
                }}
                labelStyle={{ fontWeight: 500 }}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                iconType="plainline"
              />
              {performanceScenarios.map(scenario => (
                <Area 
                  key={scenario.scenario}
                  type="monotone" 
                  dataKey={scenario.scenario} 
                  stroke={colors[getScenarioType(scenario.scenario)]}
                  strokeWidth={2}
                  fill="none"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphiques individuels des scénarios */}
      <div className="grid grid-cols-2 gap-6">
        {performanceScenarios.map((scenario) => (
          <div 
            key={scenario.scenario} 
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h3 className="text-base font-medium text-gray-900 mb-4">
              Scénario {scenario.scenario}
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={[
                    { période: 'Initial', montant: initialInvestment, performance: 0 },
                    ...periods.map(period => ({
                      période: period,
                      montant: scenario[period],
                      performance: scenario[`Performance ${period}`]
                    }))
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis 
                    dataKey="période" 
                    stroke="#424242"
                    tick={{ fill: '#424242', fontSize: 12 }}
                    axisLine={{ stroke: '#9E9E9E' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value.toLocaleString('fr-FR')}€`}
                    stroke="#424242"
                    tick={{ fill: '#424242', fontSize: 12 }}
                    axisLine={{ stroke: '#9E9E9E' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString('fr-FR')}€`, 'Montant']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E0E0E0',
                      fontSize: '12px'
                    }}
                    labelStyle={{ fontWeight: 500 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="montant" 
                    stroke={colors[getScenarioType(scenario.scenario)]}
                    strokeWidth={2}
                    dot={{ strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, strokeWidth: 1 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-1">Performance à 1 an</p>
                  <p className="text-base font-medium text-gray-900">
                    {scenario[`performance${normalizePeriod(periods[0])}`] || 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-1">Performance à {periods[1]}</p>
                  <p className="text-base font-medium text-gray-900">
                    {scenario[`performance${normalizePeriod(periods[1])}`] || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Analyse des points clés */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Analyse Approfondie</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Profil Rendement/Risque</h4>
            <p className="text-sm text-blue-600">
              Pour un investissement initial de {kid.performanceScenarios.initialInvestment.toLocaleString()} {kid.productDetails.currency}, 
              le produit présente une dispersion de performance entre les scénarios favorable et défavorable sur la durée.
              Le scénario modéré montre une évolution sur la période, 
              avec un montant final de {kid.performanceScenarios.scenarios.find(s => getScenarioType(s.scenarioName) === 'moderate')?.periods.find(p => p.holdingPeriod.toLowerCase().includes('mat'))?.finalAmount?.toLocaleString() || 'N/A'} {kid.productDetails.currency}.
              En cas de scénario de stress, le montant à 1 an serait de {kid.performanceScenarios.scenarios.find(s => getScenarioType(s.scenarioName) === 'stress')?.periods.find(p => /1|one|un/i.test(p.holdingPeriod))?.finalAmount?.toLocaleString() || 'N/A'} {kid.productDetails.currency}.
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Impact des Coûts</h4>
            <p className="text-sm text-yellow-600">
              Les coûts d'entrée sont de {kid.costs.compositionOfCosts.entryCosts || 'N/A'}, 
              les coûts récurrents sont de {typeof kid.costs.compositionOfCosts.ongoingCosts === 'object' ? 
                `${kid.costs.compositionOfCosts.ongoingCosts.otherOngoingCosts || '0'} (autres) et ${kid.costs.compositionOfCosts.ongoingCosts.portfolioTransactionCosts || '0'} (transactions)` : 
                kid.costs.compositionOfCosts.ongoingCosts || 'N/A'}, 
              et les coûts accessoires sont de {typeof kid.costs.compositionOfCosts.incidentalCosts === 'object' ? 
                `${kid.costs.compositionOfCosts.incidentalCosts.performanceFees || '0'} (performance) et ${kid.costs.compositionOfCosts.incidentalCosts.carriedInterests || '0'} (intérêts)` : 
                kid.costs.compositionOfCosts.incidentalCosts || 'N/A'}.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Horizon d'Investissement</h4>
            <p className="text-sm text-green-600">
              La période de détention recommandée est de {kid.redemptionInformation.recommendedHoldingPeriod}. 
              Dans le scénario défavorable, le montant évolue de {kid.performanceScenarios.scenarios.find(s => getScenarioType(s.scenarioName) === 'unfavorable')?.periods.find(p => /1|one|un/i.test(p.holdingPeriod))?.finalAmount?.toLocaleString() || 'N/A'} {kid.productDetails.currency} à 1 an
              à {kid.performanceScenarios.scenarios.find(s => getScenarioType(s.scenarioName) === 'unfavorable')?.periods.find(p => p.holdingPeriod.toLowerCase().includes('mat'))?.finalAmount?.toLocaleString() || 'N/A'} {kid.productDetails.currency} à maturité.
              {kid.redemptionInformation.earlyRedemptionPossible && " Le rachat anticipé est possible."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
