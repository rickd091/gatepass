import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase";
import { withErrorHandling } from "@/lib/utils/error-handler";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  onUploadComplete?: (url: string) => void;
  onError?: (error: Error) => void;
  maxSize?: number; // in MB
  allowedTypes?: string[];
}

export const FileUpload = ({
  onUploadComplete,
  onError,
  maxSize = 30, // 30MB default
  allowedTypes = [".pdf", ".jpg", ".jpeg", ".png", ".gif"],
  bucketName = "justification-docs",
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Size validation
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Type validation
    const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!allowedTypes.includes(fileExt)) {
      setError(`File type must be: ${allowedTypes.join(", ")}`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      } else {
        e.target.value = "";
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      await withErrorHandling(async () => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `gate-pass-documents/${fileName}`;

        // Create bucket if it doesn't exist
        const { data: buckets } = await supabase.storage.listBuckets();
        if (!buckets?.find((b) => b.name === bucketName)) {
          const { error: createError } = await supabase.storage.createBucket(
            bucketName,
            {
              public: true,
              fileSizeLimit: 10485760, // 10MB
            },
          );
          if (createError) throw createError;
        }

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
            contentType: file.type,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(uploadError.message);
        }

        // Update progress manually since the upload progress callback isn't working
        setUploadProgress(100);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucketName).getPublicUrl(filePath);

        onUploadComplete?.(publicUrl);
        setFile(null);
        setUploadProgress(0);

        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
      }, "Failed to upload file");
    } catch (error) {
      setError("Upload failed. Please try again.");
      onError?.(error as Error);
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="relative overflow-hidden w-full h-24 flex flex-col items-center justify-center border-dashed"
          onClick={() => document.getElementById("file-upload")?.click()}
          disabled={uploading}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept={allowedTypes.join(",")}
            disabled={uploading}
          />
          <Upload className="h-6 w-6 mb-2" />
          <span className="text-sm text-gray-600">
            {file ? file.name : `Click to upload document (max ${maxSize}MB)`}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Allowed types: PDF and images (JPG, PNG, GIF)
          </span>
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {file && (
        <div className="space-y-4">
          {uploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-500 text-center">
                {Math.round(uploadProgress)}% uploaded
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Uploading...
                </>
              ) : (
                "Upload Document"
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={clearFile}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
