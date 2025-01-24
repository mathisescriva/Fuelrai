import React from 'react';

interface KeyInfo {
  isin: string;
  issuer: string;
  guarantor: string;
  authority: string;
  issueDate: string;
  maturityDate: string;
  currency: string;
  nominalAmount: string;
}

interface KeyInformationProps {
  info: KeyInfo;
}

const KeyInformation: React.FC<KeyInformationProps> = ({ info }) => {
  const infoItems = [
    { label: 'ISIN', value: info.isin },
    { label: 'Émetteur', value: info.issuer },
    { label: 'Garant', value: info.guarantor },
    { label: 'Autorité compétente', value: info.authority },
    { label: "Date d'émission", value: info.issueDate },
    { label: "Date d'échéance", value: info.maturityDate },
    { label: 'Devise', value: info.currency },
    { label: 'Montant nominal', value: info.nominalAmount },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Informations clés</h3>
      <div className="grid grid-cols-2 gap-4">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="bg-gray-50 p-3 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
          >
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className="font-medium text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyInformation;
