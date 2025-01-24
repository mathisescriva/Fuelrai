import { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configuration du worker PDF
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface KID {
  id: number;
  file: File;
  url: string;
  name: string;
}

interface KIDInfo {
  riskLevel: number;
  oneYearForecast: string;
  fiveYearForecast: string;
}

export const KIDManager = () => {
  const [kids, setKids] = useState<KID[]>([]);
  const [selectedKid, setSelectedKid] = useState<KID | null>(null);
  const [kidInfo, setKidInfo] = useState<KIDInfo | null>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      kids.forEach(kid => URL.revokeObjectURL(kid.url));
    };
  }, [kids]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newKids = Array.from(files)
        .filter(file => file.type === 'application/pdf')
        .map((file, index) => ({
          id: Date.now() + index,
          file,
          url: URL.createObjectURL(file),
          name: file.name,
        }));
      
      if (newKids.length > 0) {
        setKids(prev => [...prev, ...newKids].slice(0, 5));
        setPdfError(null);
      }
    }
  };

  const selectKid = (kid: KID) => {
    setSelectedKid(kid);
    setPageNumber(1);
    setPdfError(null);
    setKidInfo({
      riskLevel: Math.floor(Math.random() * 7) + 1,
      oneYearForecast: '+5.2%',
      fiveYearForecast: '+25.8%',
    });
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Erreur de chargement du PDF:', error);
    setPdfError('Impossible de charger le PDF. Veuillez vérifier que le fichier est valide.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* En-tête avec la zone d'upload */}
      <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Gestionnaire de KIDs</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {5 - kids.length} KID(s) restant(s)
            </span>
            <label className="relative inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white cursor-pointer transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un KID
              <input
                type="file"
                accept=".pdf,application/pdf"
                multiple
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={kids.length >= 5}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Section de gauche : Prévisualisation et liste des KIDs */}
        <div className="w-2/3 space-y-6">
          {/* Prévisualisation du PDF */}
          {selectedKid ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{selectedKid.name}</h2>
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
                  <div className="flex flex-col items-center">
                    <Document
                      file={selectedKid.url}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      loading={
                        <div className="flex items-center justify-center p-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      }
                    >
                      <div className="relative">
                        <Page
                          pageNumber={pageNumber}
                          width={400}
                          loading={
                            <div className="flex items-center justify-center p-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                          }
                        />
                        {numPages > 1 && (
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                            <button
                              onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                              disabled={pageNumber <= 1}
                              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <span className="text-sm">
                              {pageNumber} / {numPages}
                            </span>
                            <button
                              onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                              disabled={pageNumber >= numPages}
                              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </Document>
                    {numPages > 1 && (
                      <div className="w-full px-4 py-3 bg-gray-100 mt-4 rounded-lg">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>Pages totales : {numPages}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setPageNumber(1)}
                              disabled={pageNumber === 1}
                              className="px-2 py-1 text-xs bg-white rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                              Première
                            </button>
                            <button
                              onClick={() => setPageNumber(numPages)}
                              disabled={pageNumber === numPages}
                              className="px-2 py-1 text-xs bg-white rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                              Dernière
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg">Sélectionnez un KID pour voir sa prévisualisation</p>
              </div>
            </div>
          )}

          {/* Liste des KIDs */}
          <div className="grid grid-cols-3 gap-4">
            {kids.map((kid) => (
              <div
                key={kid.id}
                onClick={() => selectKid(kid)}
                className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all hover:shadow-md
                  ${selectedKid?.id === kid.id ? 'ring-2 ring-blue-500' : ''}`}
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
        </div>

        {/* Section de droite : Informations détaillées */}
        <div className="w-1/3">
          {selectedKid && kidInfo ? (
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Niveau de risque</h3>
                <div className="flex gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full ${
                        i + 1 <= kidInfo.riskLevel
                          ? 'bg-gradient-to-r from-yellow-500 to-red-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>Faible</span>
                  <span>Élevé</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Prévisions de performance</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sur 1 an</span>
                      <span className="text-green-600 font-medium">{kidInfo.oneYearForecast}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sur 5 ans</span>
                      <span className="text-green-600 font-medium">{kidInfo.fiveYearForecast}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">Sélectionnez un KID pour voir ses informations détaillées</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
