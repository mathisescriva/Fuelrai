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
  // Définition des couleurs professionnelles
  const colors = {
    favorable: '#2E7D32',
    intermediaire: '#1565C0',
    defavorable: '#E65100',
    tensions: '#C62828'
  };
  // Définition des gradients pour les graphiques
  const gradients = {
    favorable: {
      id: 'colorFavorable',
      colors: ['#4ade8040', '#4ade8001']
    },
    intermediaire: {
      id: 'colorIntermediaire',
      colors: ['#60a5fa40', '#60a5fa01']
    },
    defavorable: {
      id: 'colorDefavorable',
      colors: ['#f9731640', '#f9731601']
    },
    tensions: {
      id: 'colorTensions',
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
    const oneYear = scenario.periods.find(p => p.holdingPeriod === '1 an');
    const fiveYears = scenario.periods.find(p => p.holdingPeriod === '5 ans');
    return {
      scenario: scenario.scenarioName,
      '1 an': oneYear?.finalAmount || 0,
      '5 ans': fiveYears?.finalAmount || 0,
      '1 an %': parseFloat((oneYear?.performance || '0').replace(' %', '').replace(',', '.')),
      '5 ans %': parseFloat((fiveYears?.performance || '0').replace(' %', '').replace(',', '.')),
      'performance1an': oneYear?.performance || '0 %',
      'performance5ans': fiveYears?.performance || '0 %',
      'Montant investi': kid.performanceScenarios.initialInvestment
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
      'Performance moyenne': intermediaire,
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
                { période: '3 mois', ...Object.fromEntries(performanceScenarios.map(s => [s.scenario, 
                  initialInvestment + ((s['1 an'] - initialInvestment) * 0.25)
                ])) },
                { période: '6 mois', ...Object.fromEntries(performanceScenarios.map(s => [s.scenario, 
                  initialInvestment + ((s['1 an'] - initialInvestment) * 0.5)
                ])) },
                { période: '9 mois', ...Object.fromEntries(performanceScenarios.map(s => [s.scenario, 
                  initialInvestment + ((s['1 an'] - initialInvestment) * 0.75)
                ])) },
                { période: '1 an', ...Object.fromEntries(performanceScenarios.map(s => [s.scenario, s['1 an']])) },
                { période: '5 ans', ...Object.fromEntries(performanceScenarios.map(s => [s.scenario, s['5 ans']])) }
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
              <Area 
                type="monotone" 
                dataKey="Favorable" 
                stroke={colors.favorable}
                strokeWidth={2}
                fill="none"
              />
              <Area 
                type="monotone" 
                dataKey="Intermediaire" 
                stroke={colors.intermediaire}
                strokeWidth={2}
                fill="none"
              />
              <Area 
                type="monotone" 
                dataKey="Defavorable" 
                stroke={colors.defavorable}
                strokeWidth={2}
                fill="none"
              />
              <Area 
                type="monotone" 
                dataKey="Tensions" 
                stroke={colors.tensions}
                strokeWidth={2}
                fill="none"
              />
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
                    { période: '3 mois', montant: initialInvestment + ((scenario['1 an'] - initialInvestment) * 0.25), performance: scenario['1 an %'] * 0.25 },
                    { période: '6 mois', montant: initialInvestment + ((scenario['1 an'] - initialInvestment) * 0.5), performance: scenario['1 an %'] * 0.5 },
                    { période: '9 mois', montant: initialInvestment + ((scenario['1 an'] - initialInvestment) * 0.75), performance: scenario['1 an %'] * 0.75 },
                    { période: '1 an', montant: scenario['1 an'], performance: scenario['1 an %'] },
                    { période: '5 ans', montant: scenario['5 ans'], performance: scenario['5 ans %'] }
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
                    stroke={scenario.scenario === 'Favorable' ? colors.favorable :
                           scenario.scenario === 'Intermediaire' ? colors.intermediaire :
                           scenario.scenario === 'Defavorable' ? colors.defavorable :
                           colors.tensions}
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
                  <p className="text-base font-medium text-gray-900">{scenario['1 an %'].toFixed(2)} %</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-1">Performance à 5 ans</p>
                  <p className="text-base font-medium text-gray-900">{scenario['5 ans %'].toFixed(2)} %</p>
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
              Les coûts d'entrée sont de {kid.costs.compositionOfCosts.entryCosts}%, 
              les coûts récurrents de {kid.costs.compositionOfCosts.ongoingCosts}% par an, 
              et les coûts accessoires (commission de performance) de {kid.costs.compositionOfCosts.incidentalCosts}% par an.
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
