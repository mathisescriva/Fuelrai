import React from 'react';
import { KID } from '../types';

interface JsonViewerProps {
  data: KID;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">JSON Data</h2>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-[500px]">
        <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default JsonViewer;
