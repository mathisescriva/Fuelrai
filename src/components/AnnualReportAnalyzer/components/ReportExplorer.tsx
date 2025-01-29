import React from 'react';
import { AnnualReport } from '../types';

interface ReportExplorerProps {
  reports: AnnualReport[];
  onSelect: (report: AnnualReport) => void;
  selectedReport: AnnualReport | null;
}

const ReportExplorer: React.FC<ReportExplorerProps> = ({ reports, onSelect, selectedReport }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Explorateur de Rapports</h2>
      <div className="space-y-2">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`p-4 rounded cursor-pointer transition-colors ${
              selectedReport?.id === report.id
                ? 'bg-blue-100 border-blue-500'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => onSelect(report)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{report.name}</p>
                <p className="text-sm text-gray-600">
                  {report.companyInfo.name} - {report.companyInfo.fiscalYear}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {report.companyInfo.reportDate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportExplorer;
