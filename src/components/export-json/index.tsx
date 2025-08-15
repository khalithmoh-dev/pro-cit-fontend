import React from 'react';
import Button from '../button';

interface ExportJSONProps {
  data: Record<string, any>; // Input object type
  fileName: string; // File name without extension
}

const ExportJSON: React.FC<ExportJSONProps> = ({ data, fileName }) => {
  const downloadFile = () => {
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button secondary onClick={downloadFile}>
      Export
    </Button>
  );
};

export default ExportJSON;
