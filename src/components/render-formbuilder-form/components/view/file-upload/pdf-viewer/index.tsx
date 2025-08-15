import React from 'react';
const PDFViewer: React.FC<{ base64Data: string }> = ({ base64Data }) => {
  return (
    <div>
      {base64Data ? (
        <embed src={base64Data} style={{ width: '100%', height: 'calc(100vh - 180px)' }} />
      ) : (
        <p>No PDF selected</p>
      )}
    </div>
  );
};

export default PDFViewer;
