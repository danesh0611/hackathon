import { useState, useRef } from "react";
import { UploadCloud, X, FileAudio, FileVideo } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  type?: "image" | "audio" | "video";
  label?: string;
}

export function FileDropzone({
  onFileSelect,
  accept = "image/*",
  maxSizeMB = 5,
  type = "image",
  label = "Upload file",
}: FileDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setFile(selectedFile);
    onFileSelect(selectedFile);

    if (type === "image") {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium">{label}</label>
      {!file ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Click or drag file to upload</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {accept.replace(/\//g, " files, ")} up to {maxSizeMB}MB
          </p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-border bg-card">
          <button
            type="button"
            onClick={removeFile}
            className="absolute right-2 top-2 z-10 rounded-full bg-background/80 p-1 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground backdrop-blur-sm transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex flex-col">
            {type === "image" && preview && (
              <img src={preview} alt="Preview" className="h-48 w-full object-cover" />
            )}
            {type === "audio" && (
              <div className="flex h-32 items-center justify-center bg-muted/50">
                <FileAudio className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            {type === "video" && (
              <div className="flex h-48 items-center justify-center bg-black">
                <FileVideo className="h-12 w-12 text-white/50" />
              </div>
            )}
            <div className="flex items-center gap-2 p-3 text-sm">
              <span className="truncate font-medium">{file.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
        </div>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
        }}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
