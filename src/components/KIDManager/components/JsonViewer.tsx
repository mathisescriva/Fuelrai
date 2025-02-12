import React, { useState } from 'react';
import { KID } from '../types';

interface JsonViewerProps {
  data: KID;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <>
      {isFullScreen ? (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-50 to-white overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">Extract JSON</h2>
            </div>
            <button
              onClick={() => setIsFullScreen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Quitter le plein écran</span>
            </button>
          </div>
          <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-blue-50/50 to-white">
            <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 max-w-full relative border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">Extract JSON</h2>
            </div>
            <button
              onClick={() => setIsFullScreen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>Voir en plein écran</span>
            </button>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 overflow-x-auto border border-blue-100 max-h-[885px] overflow-y-auto">
            <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap" style={{ width: 'max-content', minWidth: '100%' }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </>
  );
};

export default JsonViewer;
