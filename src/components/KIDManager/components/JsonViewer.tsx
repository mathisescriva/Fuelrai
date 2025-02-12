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
        <div className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-800">JSON Data</h2>
            </div>
            <button
              onClick={() => setIsFullScreen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border border-blue-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Quitter le plein écran</span>
            </button>
          </div>
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap bg-white p-6 rounded-lg shadow-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-full relative">
          <div className="flex items-center justify-between mb-4 border-b pb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-800">JSON Data</h2>
            </div>
            <button
              onClick={() => setIsFullScreen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border border-blue-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>Voir en plein écran</span>
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
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
