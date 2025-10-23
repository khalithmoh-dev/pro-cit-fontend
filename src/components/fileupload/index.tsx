import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, Check, AlertCircle, Image, FileText, Music, Video } from "lucide-react";
import Button from "../ButtonMui";
import { Badge } from "../badge";
import { Progress } from "../progress";
import { useTranslation } from "react-i18next";

export interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  onFileSelect?: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  disabled?: boolean;
  className?: string;
  defaultFiles?: string[];
}

interface UploadedFile {
  file: File | string; // can be a File object or a URL string for default files
  id: string;
  status: "uploading" | "success" | "error";
  progress: number;
  error?: string;
  s3Url?: string
}

const getFileIcon = (file: File) => {
  const type = file.type;
  if (type.startsWith("image/")) return Image;
  if (type.startsWith("video/")) return Video;
  if (type.startsWith("audio/")) return Music;
  if (type.includes("pdf") || type.includes("document") || type.includes("text")) return FileText;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  onFileSelect,
  onFileRemove,
  disabled = false,
  className = "",
  defaultFiles = []
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
  if (defaultFiles?.length) {
    const formattedDefaults = defaultFiles.map((url, i) => ({
      id: `default-${i}`,
      status: "success" as "success",
      progress: 100,
      file: url
    }));
    setUploadedFiles(formattedDefaults);
  }
}, [defaultFiles]);

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }

    if (accept) {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const isValidType = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace("*", ".*"));
      });

      if (!isValidType) {
        return `File type not supported. Accepted: ${accept}`;
      }
    }

    return null;
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: "success", progress: 100 } : f))
        );
      } else {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        );
      }
    }, 200);
  };

  const handleFiles = useCallback(
    (files: File[]) => {
      const newFiles: UploadedFile[] = [];

      for (const file of files) {
        const error = validateFile(file);
        const fileId = Math.random().toString(36).substr(2, 9);

        if (error) {
          newFiles.push({
            file,
            id: fileId,
            status: "error",
            progress: 0,
            error,
          });
        } else {
          newFiles.push({
            file,
            id: fileId,
            status: "uploading",
            progress: 0,
          });
          setTimeout(() => simulateUpload(fileId), 100);
        }
      }

      if (multiple) {
        setUploadedFiles((prev) => [...prev, ...newFiles]);
      } else {
        setUploadedFiles(newFiles);
      }

      const validFiles = newFiles.filter((f) => f.status !== "error").map((f) => f.file as File);
      onFileSelect?.(validFiles);
    },
    [accept, maxSize, multiple, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [disabled, handleFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFiles(files);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [handleFiles]
  );

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    onFileRemove?.(index);
  };

  const openFileDialog = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const getFileType = (file: File | string): string | undefined => {
    return file instanceof File ? file.type : undefined;
  };

  return (
    <div className={`w-100 ${className}`}>
      {/* Upload Area */}
    {(multiple || (!multiple && !uploadedFiles.length)) && ( <div
        className={`border border-dashed rounded p-4 text-center ${isDragOver ? "bg-light border-primary" : "border-secondary"} ${disabled ? "opacity-50" : "cursor-pointer"}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="d-none"
          disabled={disabled}
        />

        <Upload size={32} className="mb-2 text-primary" />
        <h6>{isDragOver ? "Drop files here" : "Upload files"}</h6>
        <p className="text-muted small mb-1">Drag & drop or browse</p>
        {accept && <p className="text-muted small mb-1">Accepted: {accept}</p>}
        <p className="text-muted small">Max size: {formatFileSize(maxSize)}</p>
      </div>)}

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h6>Uploaded Files ({uploadedFiles.length})</h6>
          <div className="list-group mt-2">
            {uploadedFiles.map((uploadedFile, index) => {
              let IconComponent;
              let fileName;
              if (uploadedFile.file instanceof File) {
                IconComponent = getFileIcon(uploadedFile.file);
                fileName = uploadedFile.file.name;
              } else {
                IconComponent = File; // generic file icon for URL string
              }
              const isFile = uploadedFile.file instanceof File;
              let fileUrl: string;

              if (uploadedFile?.file instanceof File) {
                fileUrl = URL.createObjectURL(uploadedFile.file);
              } else if (typeof uploadedFile?.file === "string") {
                fileUrl = uploadedFile.file; // already a URL
              } else {
                fileUrl = ""; // fallback
              }
              const fileType = getFileType(uploadedFile.file);
              const fileSize = isFile ? (uploadedFile.file as File).size : 0;
              const isImage = fileType?.startsWith("image/");
              const isPDF = fileType === "application/pdf";

              return (
                <div
                  key={uploadedFile.id}
                  className="list-group-item d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex align-items-center">
                     {/* === File Preview / Icon === */}
                    <div className="me-3" style={{ width: 50, height: 50 }}>
                      {isImage ? (
                        <img
                          src={fileUrl}
                          alt={fileName}
                          className="rounded border"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      ) : isPDF ? (
                        <div className="text-danger">
                          {isFile && <IconComponent size={40} />}
                        </div>
                      ) : (
                        isFile && <IconComponent size={40} className="text-primary" />
                      )}
                    </div>

                    <div className="me-3">
                      {isFile && <IconComponent size={24} className="text-primary" />}
                    </div>
                    <div>
                      
                      <div className="fw-bold">
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                        >
                            {fileName || t('VIEW_FILE')}
                        </a>
                        </div>
                      {isFile && <div className="text-muted small">{formatFileSize(fileSize)}</div>}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {uploadedFile.status !== "uploading" && (
                      <Progress value={uploadedFile.progress} variant="determinate" sx={{ height: '4px', width: '100%' }}  />
                    )}

                    {uploadedFile.status === "success" && (
                      <Badge variant="success">
                        <Check size={14} className="me-1" />
                        Uploaded
                      </Badge>
                    )}

                    {uploadedFile.status === "error" && (
                      <Badge variant="danger">
                        <AlertCircle size={14} className="me-1" />
                        Error
                      </Badge>
                    )}

                    <Button
                      variantType="outline"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default FileUpload;