// apps/client/src/hooks/useFileUpload.ts
import { useState } from 'react';
import axios from 'axios';

interface UploadResult {
  filePath: string;
  fileName: string;
  fileExtension: string;
  fileSize: number;  // New field for file size in KB
}

interface UseFileUpload {
  uploadFile: (file: File) => Promise<UploadResult>;
  uploading: boolean;
  error: Error | null;
}

const useFileUpload = (): UseFileUpload => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (file: File): Promise<UploadResult> => {
    try {
      setUploading(true);
      setError(null);

      // Step 1: Get the presigned URL from the API
      const data: any = await axios.post<{ presignedUrl: string; filePath: string }>('/transient-files/presigned-url', {
        method: 'PUT',
        fileName: file.name
      });
      const { presignedUrl, filePath } = data;

      // Step 2: Upload the file to the presigned URL
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      // Step 3: Extract file name, extension, and calculate size in KB
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop() || '';
      const fileSize = Math.round(file.size / 1024);  // Convert size to KB

      // Step 4: Return the filePath, fileName, fileExtension, and fileSize
      return { filePath, fileName, fileExtension, fileSize };
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
};

export default useFileUpload;
