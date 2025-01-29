import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen bg-white">
      {/* Header Section */}
      <div className="w-full bg-white shadow-sm py-6 border-b border-gray-100">
        <div className="w-full px-16 py-6 flex items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/images/logo.png"
              alt="Elixir Logo" 
              className="h-12"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-16 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Plateforme d'Analyse Financière</h2>
          <p className="text-xl text-gray-600">
            Optimisez votre analyse financière avec nos outils spécialisés pour les KIDs et les rapports annuels
          </p>
        </div>

        <div className="grid grid-cols-2 gap-16">
          {/* KID Analyzer Card */}
          <div 
            onClick={() => navigate('/kid-analyzer')}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full border border-gray-100">
              <div className="bg-indigo-600 h-2"></div>
              <div className="p-16 flex flex-col items-center">
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100 mb-8">
                  <svg className="h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Analyseur de KIDs</h3>
                <p className="text-xl text-gray-600 text-center mb-8">
                  Analysez et gérez efficacement vos documents KID avec notre outil spécialisé
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center text-lg text-indigo-600 group-hover:text-indigo-700 font-semibold gap-2">
                    Commencer l'analyse
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Annual Reports Card */}
          <div 
            onClick={() => navigate('/annual-reports')}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full border border-gray-100">
              <div className="bg-indigo-600 h-2"></div>
              <div className="p-16 flex flex-col items-center">
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100 mb-8">
                  <svg className="h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Analyseur de Rapports Annuels</h3>
                <p className="text-xl text-gray-600 text-center mb-8">
                  Simplifiez l'analyse de vos rapports annuels avec notre solution intelligente
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center text-lg text-indigo-600 group-hover:text-indigo-700 font-semibold gap-2">
                    Découvrir l'outil
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
