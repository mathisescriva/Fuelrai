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

  // États pour le chatbot
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Bonjour ! Je suis votre assistant d'analyse de rapports annuels. Comment puis-je vous aider ?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Questions prédéfinies et leurs réponses
  const predefinedQA = [
    {
      question: "Quel est le résultat net du groupe ?",
      answer: "Le résultat net part du groupe s'élève à 2 868 M€ au troisième trimestre 2024, en hausse de +5,9% par rapport au T3 2023. Cette performance démontre la solidité du modèle d'affaires diversifié du groupe."
    },
    {
      question: "Comment se portent les activités de CIB ?",
      answer: "Le PNB de Corporate & Institutional Banking (CIB) est en forte progression (+9,0% / 3T23). Cette croissance est portée notamment par les activités de Capital Markets en EMEA (+12,4%), l'Advisory en EMEA et les activités de Transaction Banking en Amériques et APAC."
    },
    {
      question: "Quelle est la structure financière du groupe ?",
      answer: "La structure financière est très solide avec un ratio CET1 de 12,7% au 30 septembre 2024. La consolidation prudentielle d'Arval (30 pb) au 3T24 a été effectuée, avec des titrisations prévues au 4T24."
    },
    {
      question: "Quels sont les coûts du risque ?",
      answer: "Le coût du risque est stable à 32 points de base, démontrant une gestion prudente des risques dans un contexte économique changeant."
    },
    {
      question: "Quelles sont les perspectives pour 2024 ?",
      answer: "BNP Paribas confirme sa trajectoire 2024 avec des revenus en croissance de plus de 2% par rapport à 2023 (46,9 Md€), un effet de ciseaux positif, un coût du risque inférieur à 40 pb et un résultat net part du groupe supérieur au résultat net distribuable 2023 (11,2 Md€)."
    }
  ];

  // Suggestions de questions rapides
  const quickQuestions = [
    "Quel est le résultat net du groupe ?",
    "Comment se portent les activités de CIB ?",
    "Quelle est la structure financière du groupe ?",
    "Quels sont les coûts du risque ?",
    "Quelles sont les perspectives pour 2024 ?"
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    // Ajouter le message de l'utilisateur
    setMessages(prev => [...prev, { text: inputMessage, isUser: true }]);

    // Rechercher une réponse prédéfinie
    const matchingQA = predefinedQA.find(qa => 
      qa.question.toLowerCase().includes(inputMessage.toLowerCase()) ||
      inputMessage.toLowerCase().includes(qa.question.toLowerCase())
    );

    setTimeout(() => {
      let response;
      if (!selectedReport) {
        response = "Je suis désolé, mais je ne peux pas analyser le document sans qu'un rapport soit sélectionné.";
      } else if (matchingQA) {
        response = matchingQA.answer;
      } else {
        response = `Je ne trouve pas de réponse spécifique à votre question. Voici les questions auxquelles je peux répondre concernant le rapport "${selectedReport.name}" :
        
${quickQuestions.map(q => `- ${q}`).join('\n')}`;
      }

      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 1000);

    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
        <h2 className="text-2xl font-bold text-black">Gestionnaire de Rapports Annuels</h2>
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
        <div className="space-y-4">
          {/* En-tête avec le bouton parcourir */}
          <div className="flex justify-end">
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
              onClick={handleBrowseReports}
            >
              Parcourir les rapports
            </button>
          </div>

          {/* Liste des documents */}
          <div className="bg-white rounded-lg shadow p-6">
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

          {/* Prévisualisation */}
          {selectedReport && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-black">Prévisualisation</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-sm text-black">
                    Page {pageNumber} sur {numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
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
                <div className="border rounded-lg overflow-hidden">
                  <Document
                    file={selectedReport.file}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page
                      pageNumber={pageNumber}
                      className="mx-auto"
                    />
                  </Document>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Colonne de droite - Chatbot */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col h-[calc(100vh-12rem)]">
          <h3 className="text-lg font-medium mb-4">Assistant d'Analyse</h3>
          
          {/* Zone des messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Questions rapides */}
          {selectedReport && (
            <div className="mb-4 flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputMessage(question);
                    handleSendMessage();
                  }}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {/* Zone de saisie */}
          <div className="flex items-center space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez une question sur le rapport..."
              className="flex-1 border rounded-lg p-2 resize-none h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
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
    </div>
  );
};

export default AnnualReportAnalyzer;
