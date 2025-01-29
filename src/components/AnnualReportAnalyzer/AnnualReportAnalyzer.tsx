import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { AnnualReport } from './types';

// Configuration du worker PDF
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AnnualReportAnalyzer: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<AnnualReport | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfError, setPdfError] = useState<string>('');
  const [reports, setReports] = useState<AnnualReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReportIndex, setCurrentReportIndex] = useState(0);

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).slice(0, 5 - reports.length);
      
      const newReports: AnnualReport[] = newFiles.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        url: URL.createObjectURL(file),
        file,
        companyInfo: {
          name: "Exemple Entreprise",
          fiscalYear: "2024",
          sector: "Technologie",
          stockSymbol: "EXE",
          reportDate: "2024-01-29"
        },
        financialMetrics: {
          revenue: 1000000,
          operatingIncome: 200000,
          netIncome: 150000,
          eps: 2.5,
          dividendPerShare: 0.5
        }
      }));

      setReports(prevReports => {
        prevReports.forEach(report => {
          if (report.url.startsWith('blob:')) {
            URL.revokeObjectURL(report.url);
          }
        });
        return [...prevReports, ...newReports];
      });
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError('');
  };

  const onDocumentLoadError = (error: Error) => {
    setPdfError('Erreur lors du chargement du PDF');
    console.error('Erreur PDF:', error);
  };

  const handleNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const handlePrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const handleBrowseReports = () => {
    setIsModalOpen(true);
    setCurrentReportIndex(reports.findIndex(r => r.id === selectedReport?.id) || 0);
  };

  const handlePrevReport = () => {
    setCurrentReportIndex((prev) => (prev > 0 ? prev - 1 : reports.length - 1));
  };

  const handleNextReport = () => {
    setCurrentReportIndex((prev) => (prev < reports.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-6 text-black">Gestionnaire de Rapports Annuels</h2>
        <button
          onClick={() => document.getElementById('file-upload')?.click()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter des rapports
        </button>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne de gauche */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Documents Annuels</h3>
          </div>

          {/* En-tête avec le bouton parcourir */}
          <div className="flex justify-end mb-4">
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
              onClick={handleBrowseReports}
            >
              Parcourir les rapports
            </button>
          </div>

          {/* Liste des documents */}
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-medium">Documents Annuels</h3>
            </div>

            <div className="space-y-2">
              {filteredReports.map(report => (
                <div
                  key={report.id}
                  className={`p-3 rounded-lg border ${
                    selectedReport?.id === report.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  } cursor-pointer`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black">{report.name}</p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prévisualisation dans une box séparée */}
          {selectedReport && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Prévisualisation</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={pageNumber <= 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-sm">
                    Page {pageNumber} sur {numPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={pageNumber >= numPages}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="border rounded-lg overflow-hidden h-[600px] w-[400px]">
                  <Document
                    file={selectedReport.url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                  >
                    {pdfError ? (
                      <div className="p-4 text-red-500">{pdfError}</div>
                    ) : (
                      <Page
                        pageNumber={pageNumber}
                        width={400}
                        height={550}
                        className="mx-auto"
                      />
                    )}
                  </Document>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal de parcours des rapports */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Parcourir les Rapports</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenu du rapport actuel */}
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-medium text-black">{reports[currentReportIndex]?.name}</h4>
                      <p className="text-sm text-gray-500">PDF Document</p>
                    </div>
                  </div>
                </div>

                {/* Informations principales */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm"><span className="font-medium">Date de création:</span> {new Date().toLocaleDateString()}</p>
                  <p className="text-sm"><span className="font-medium">Taille:</span> 2.5 MB</p>
                  <p className="text-sm"><span className="font-medium">Nombre de pages:</span> {numPages}</p>
                </div>
              </div>

              {/* Navigation entre les rapports */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevReport}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm text-gray-500">
                  Rapport {currentReportIndex + 1} sur {reports.length}
                </span>
                <button
                  onClick={handleNextReport}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Colonne de droite */}
        <div className="space-y-6">
          {selectedReport ? (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Analyse du Rapport</h3>
                </div>

                {/* Métriques Financières */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Métriques Clés</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                        <p className="text-lg font-medium">
                          {selectedReport.financialMetrics.revenue.toLocaleString()} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Résultat d'exploitation</p>
                        <p className="text-lg font-medium">
                          {selectedReport.financialMetrics.operatingIncome.toLocaleString()} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Résultat net</p>
                        <p className="text-lg font-medium">
                          {selectedReport.financialMetrics.netIncome.toLocaleString()} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">BPA</p>
                        <p className="text-lg font-medium">
                          {selectedReport.financialMetrics.eps.toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informations de l'entreprise */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Informations de l'entreprise</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Nom</p>
                        <p className="text-base font-medium">{selectedReport.companyInfo.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Secteur</p>
                        <p className="text-base font-medium">{selectedReport.companyInfo.sector}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Symbole</p>
                        <p className="text-base font-medium">{selectedReport.companyInfo.stockSymbol}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Année fiscale</p>
                        <p className="text-base font-medium">{selectedReport.companyInfo.fiscalYear}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">
                Sélectionnez un rapport pour voir l'analyse détaillée
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnualReportAnalyzer;
