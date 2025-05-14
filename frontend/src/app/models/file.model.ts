export interface FileItem {
  name: string;
  fileType: 'document' | 'spreadsheet' | 'text' | 'archive' | 'video';
  reason: string;
  date: string;
  owner: string;
  location: string;
  isShared?: boolean;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  uploading: boolean;
  error?: string;
  success?: boolean;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  fileId?: string;
  filePath?: string;
}
