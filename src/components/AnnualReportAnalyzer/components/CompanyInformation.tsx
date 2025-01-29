import React from 'react';
import { CompanyInfo } from '../types';

interface CompanyInformationProps {
  info: CompanyInfo;
}

const CompanyInformation: React.FC<CompanyInformationProps> = ({ info }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Informations de l'Entreprise</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Nom de l'entreprise</p>
          <p className="text-lg font-medium">{info.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Année fiscale</p>
          <p className="text-lg font-medium">{info.fiscalYear}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Secteur</p>
          <p className="text-lg font-medium">{info.sector}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Symbole boursier</p>
          <p className="text-lg font-medium">{info.stockSymbol}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Date du rapport</p>
          <p className="text-lg font-medium">{info.reportDate}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyInformation;
