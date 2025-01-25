import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import RiskLevel from './components/RiskLevel';
import CostBreakdown from './components/CostBreakdown';
import KeyInformation from './components/KeyInformation';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import KIDExplorer from './components/KIDExplorer';
import { KID, Cost, KeyInfo } from './types';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configuration du worker PDF
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface KIDManagerProps {
  onUpload: (files: FileList) => void;
}

export const KIDManager: React.FC<KIDManagerProps> = ({ onUpload }) => {
  const [selectedKid, setSelectedKid] = useState<KID | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [selectedKidsForComparison, setSelectedKidsForComparison] = useState<KID[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfError, setPdfError] = useState<string>('');
  const [kids, setKids] = useState<KID[]>([]);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [showKIDExplorer, setShowKIDExplorer] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Limiter à 5 fichiers maximum
      const newFiles = Array.from(files).slice(0, 5 - kids.length);
      
      const newKids: KID[] = newFiles.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        url: URL.createObjectURL(file),
        file,
        costs: [
          { label: "Coûts d'entrée", value: 0.36 },
          { label: "Coûts de sortie", value: 0.50 },
          { label: "Coûts de transaction", value: 0.00 },
          { label: "Autres coûts récurrents", value: 0.00 },
          { label: "Commissions de performance", value: 0.00 }
        ],
        keyInfo: {
          isin: "XS1914695009",
          issuer: "BNP Paribas Issuance B.V.",
          guarantor: "BNP Paribas S.A.",
          authority: "AMF",
          issueDate: "03 Mai 2019",
          maturityDate: "03 Mai 2024",
          currency: "EUR",
          nominalAmount: "1,000 EUR"
        }
      }));

      setKids(prevKids => {
        // Révoquer les anciennes URLs avant de les remplacer
        prevKids.forEach(kid => {
          if (kid.url.startsWith('blob:')) {
            URL.revokeObjectURL(kid.url);
          }
        });
        return [...prevKids, ...newKids];
      });

      if (onUpload) {
        onUpload(files);
      }
    }
  };

  const selectKid = (kid: KID) => {
    setSelectedKid(kid);
    setPageNumber(1);
    setPdfError('');
  };

  const selectKidForComparison = (kid: KID) => {
    if (selectedKidsForComparison.some(k => k.id === kid.id)) {
      setSelectedKidsForComparison(prev => prev.filter(k => k.id !== kid.id));
    } else if (selectedKidsForComparison.length < 2) {
      setSelectedKidsForComparison(prev => [...prev, kid]);
    }
  };

  const startComparison = () => {
    setIsComparing(true);
    setSelectedKid(null);
  };

  const exitComparison = () => {
    setIsComparing(false);
    setSelectedKidsForComparison([]);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    setPdfError('Erreur lors du chargement du PDF. Veuillez réessayer.');
    console.error('Erreur PDF:', error);
  };

  useEffect(() => {
    return () => {
      kids.forEach(kid => {
        if (kid.url.startsWith('blob:')) {
          URL.revokeObjectURL(kid.url);
        }
      });
    };
  }, [kids]);

  return (
    <div className="p-6">
      {/* Section upload */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Gestionnaire de KIDs</h1>
            {isComparing && (
              <button
                onClick={exitComparison}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Retour
              </button>
            )}
          </div>
          <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200">
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            Ajouter des KIDs
          </label>
        </div>
      </div>

      {isComparing ? (
        // Interface de comparaison
        <div className="space-y-8">
          {/* Section sélection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Sélection des KIDs à comparer</h2>
              <button
                onClick={() => selectedKidsForComparison.length === 2 && startComparison()}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedKidsForComparison.length === 2
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={selectedKidsForComparison.length !== 2}
              >
                Comparer les KIDs
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {kids.map((kid) => (
                <div
                  key={kid.id}
                  onClick={() => selectKidForComparison(kid)}
                  className={`bg-gray-50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                    selectedKidsForComparison.some(k => k.id === kid.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : selectedKidsForComparison.length === 2
                        ? 'opacity-50 cursor-not-allowed'
                        : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{kid.name}</h3>
                      <p className="text-sm text-gray-500">PDF Document</p>
                    </div>
                    {selectedKidsForComparison.some(k => k.id === kid.id) && (
                      <div className="flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full border-2 border-indigo-500">
                        <span className="text-sm font-medium text-indigo-700">
                          {selectedKidsForComparison.findIndex(k => k.id === kid.id) + 1}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section comparaison */}
          {selectedKidsForComparison.length === 2 && (
            <>
              {/* Prévisualisation côte à côte */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Prévisualisation Comparative</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                      disabled={pageNumber <= 1}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-600 self-center">
                      Page {pageNumber} sur {numPages}
                    </span>
                    <button
                      onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                      disabled={pageNumber >= numPages}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {selectedKidsForComparison.map((kid, index) => (
                    <div key={kid.id} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-800 mb-3">Document {index + 1}</h3>
                      <Document
                        file={kid.url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                          <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        }
                      >
                        <Page
                          pageNumber={pageNumber}
                          width={400}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analyse comparative */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">Analyse Comparative</h2>
                  <button
                    onClick={() => setShowAdvancedAnalytics(prev => !prev)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    {showAdvancedAnalytics ? 'Vue Simple' : 'Analyse Avancée'}
                  </button>
                </div>

                {showAdvancedAnalytics ? (
                  <AdvancedAnalytics selectedKids={selectedKidsForComparison} />
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    {selectedKidsForComparison.map((kid, index) => (
                      <div key={kid.id}>
                        <h3 className="font-medium text-gray-800 mb-4">Document {index + 1}</h3>
                        <div className="space-y-6">
                          <RiskLevel level={index === 0 ? 3 : 4} />
                          <CostBreakdown costs={kid.costs} />
                          <KeyInformation info={kid.keyInfo} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        // Interface normale
        <div className="flex gap-8">
          {/* Section de gauche : Liste des KIDs et Prévisualisation */}
          <div className="w-1/3">
            {/* Liste des KIDs */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Documents KID</h2>
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={startComparison}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={kids.length < 2}
                  >
                    Comparer les KIDs
                  </button>
                  <button
                    onClick={() => setShowKIDExplorer(true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    disabled={kids.length === 0}
                  >
                    Parcourir les KIDs
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {kids.map((kid) => (
                  <div
                    key={kid.id}
                    onClick={() => selectKid(kid)}
                    className={`bg-gray-50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                      selectedKid?.id === kid.id ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-50 rounded-lg">
                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 line-clamp-1">{kid.name}</h3>
                        <p className="text-sm text-gray-500">PDF Document</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {kids.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucun KID uploadé. Utilisez le bouton en haut pour ajouter des documents.</p>
                </div>
              )}
            </div>

            {/* Prévisualisation du PDF */}
            {selectedKid && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Prévisualisation</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                      disabled={pageNumber <= 1}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-600 self-center">
                      Page {pageNumber} sur {numPages}
                    </span>
                    <button
                      onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                      disabled={pageNumber >= numPages}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  {pdfError ? (
                    <div className="text-center p-8 text-red-500">{pdfError}</div>
                  ) : (
                    <div className="flex justify-center">
                      <Document
                        file={selectedKid.url}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        onLoadError={(error) => {
                          console.error('Erreur PDF:', error);
                          setPdfError('Erreur lors du chargement du PDF. Veuillez réessayer.');
                        }}
                        loading={
                          <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        }
                      >
                        <Page
                          pageNumber={pageNumber}
                          width={300}
                          loading={
                            <div className="flex items-center justify-center p-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                          }
                          error={
                            <div className="text-center p-4 text-red-500">
                              Erreur lors du chargement de la page
                            </div>
                          }
                        />
                      </Document>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section de droite : Analyse */}
          <div className="w-2/3">
            {selectedKid ? (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Analyse du KID</h2>
                  <button
                    onClick={() => setShowAdvancedAnalytics(prev => !prev)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    {showAdvancedAnalytics ? 'Vue Simple' : 'Analyse Avancée'}
                  </button>
                </div>

                {showAdvancedAnalytics ? (
                  <AdvancedAnalytics selectedKids={[selectedKid]} />
                ) : (
                  <>
                    <RiskLevel level={3} />
                    <CostBreakdown costs={selectedKid.costs} />
                    <KeyInformation info={selectedKid.keyInfo} />
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg">Sélectionnez un KID pour voir son analyse détaillée</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {showKIDExplorer && (
        <KIDExplorer
          kids={kids}
          onClose={() => setShowKIDExplorer(false)}
        />
      )}
    </div>
  );
};

export default KIDManager;
