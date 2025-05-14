import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, of } from 'rxjs';
import {
  FileItem,
  UploadProgress,
  FileUploadResponse,
} from '../models/file.model';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private readonly API_URL = 'https://d7a0-103-138-236-18.ngrok-free.app/files';
  private readonly AUTO_CLEAR_DELAY = 5000; // 5 seconds

  // Track all uploads
  private uploadProgressSubject = new BehaviorSubject<UploadProgress[]>([]);
  public uploadProgress$ = this.uploadProgressSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Fetches files from the API
   * @param ownerEmail The email of the file owner
   * @returns Observable of the API response
   */
  getFiles(ownerEmail: string): Observable<any[]> {
    return this.http
      .get(`${this.API_URL}?ownerEmail=${ownerEmail}`, {
        responseType: 'text',
      })
      .pipe(
        map((response) => {
          try {
            // Try to parse the response as JSON
            const data = response ? JSON.parse(response) : [];
            console.log('Parsed API response:', data);
            return data;
          } catch (error) {
            // Log the raw response for debugging
            console.error('Failed to parse API response:', response);
            console.error('Parse error:', error);

            // Return empty array to avoid breaking the UI
            return [];
          }
        }),
        catchError((error) => {
          console.error('API request error:', error);
          return of([]);
        })
      );
  }

  /**
   * Uploads a file to the server
   * @param file The file to upload
   * @param ownerEmail The email of the file owner
   * @returns Observable of the upload event
   */
  uploadFile(file: File, ownerEmail: string): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ownerEmail', ownerEmail);

    // Add the file to upload progress tracking
    const progressList = this.uploadProgressSubject.value;
    const progressIndex = progressList.length;

    progressList.push({
      fileName: file.name,
      progress: 0,
      uploading: true,
    });

    this.uploadProgressSubject.next([...progressList]);

    return this.http
      .post(this.API_URL, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event) => {
          // Update progress based on event type
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.updateProgress(
              progressIndex,
              Math.round((100 * event.loaded) / event.total)
            );
          } else if (event.type === HttpEventType.Response) {
            this.markUploadAsComplete(progressIndex);
            // Schedule auto-cleanup for this item after delay
            this.scheduleAutoClear();
          }
          return event;
        })
      );
  }

  /**
   * Updates the progress of a specific upload
   * @param index The index of the upload in the progress array
   * @param progress The current progress percentage
   */
  private updateProgress(index: number, progress: number): void {
    const progressList = this.uploadProgressSubject.value;
    if (index < progressList.length) {
      progressList[index].progress = progress;
      this.uploadProgressSubject.next([...progressList]);
    }
  }

  /**
   * Marks an upload as complete
   * @param index The index of the upload in the progress array
   */
  private markUploadAsComplete(index: number): void {
    const progressList = this.uploadProgressSubject.value;
    if (index < progressList.length) {
      progressList[index].uploading = false;
      progressList[index].success = true;
      this.uploadProgressSubject.next([...progressList]);
    }
  }

  /**
   * Marks an upload as failed
   * @param index The index of the upload in the progress array
   * @param errorMessage The error message
   */
  markUploadAsFailed(index: number, errorMessage: string): void {
    const progressList = this.uploadProgressSubject.value;
    if (index < progressList.length) {
      progressList[index].uploading = false;
      progressList[index].error = errorMessage;
      this.uploadProgressSubject.next([...progressList]);
      // Schedule auto-cleanup for this item after delay
      this.scheduleAutoClear();
    }
  }

  /**
   * Determines the file type based on MIME type
   * @param mimeType The MIME type of the file
   * @returns The file type category
   */
  getFileTypeFromMimeType(
    mimeType: string
  ): 'document' | 'spreadsheet' | 'text' | 'archive' | 'video' {
    if (mimeType.includes('text/')) {
      return 'text';
    } else if (mimeType.includes('video/')) {
      return 'video';
    } else if (
      mimeType.includes('application/zip') ||
      mimeType.includes('application/x-rar')
    ) {
      return 'archive';
    } else if (
      mimeType.includes('application/vnd.ms-excel') ||
      mimeType.includes('spreadsheetml')
    ) {
      return 'spreadsheet';
    } else if (
      mimeType.includes('application/msword') ||
      mimeType.includes(
        'application/vnd.openxmlformats-officedocument.wordprocessingml'
      )
    ) {
      return 'document';
    } else {
      return 'document'; // Default
    }
  }

  /**
   * Creates a FileItem object from an uploaded File
   * @param file The uploaded file
   * @returns FileItem object with metadata
   */
  createFileItemFromUpload(file: File): FileItem {
    return {
      name: file.name,
      fileType: this.getFileTypeFromMimeType(file.type),
      reason: 'You uploaded',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      owner: 'me',
      location: 'My Drive',
    };
  }

  /**
   * Gets the current progress of all uploads
   * @returns Array of upload progress objects
   */
  getUploadProgress(): UploadProgress[] {
    return this.uploadProgressSubject.value;
  }

  /**
   * Clears completed or failed uploads from the progress tracking
   */
  clearCompletedUploads(): void {
    const progressList = this.uploadProgressSubject.value;
    const activeUploads = progressList.filter((upload) => upload.uploading);
    this.uploadProgressSubject.next(activeUploads);
  }

  /**
   * Schedules auto-cleanup of completed uploads after a delay
   */
  private scheduleAutoClear(): void {
    // Check if there are any completed or error uploads
    setTimeout(() => {
      const progressList = this.uploadProgressSubject.value;
      const hasCompletedUploads = progressList.some(
        (upload) => (upload.success || upload.error) && !upload.uploading
      );

      if (hasCompletedUploads) {
        // Keep only the active uploads
        const activeUploads = progressList.filter((upload) => upload.uploading);
        this.uploadProgressSubject.next(activeUploads);
      }
    }, this.AUTO_CLEAR_DELAY);
  }

  /**
   * Formats date to format like "May 7, 2025"
   * @param dateString ISO date string
   * @returns Formatted date string
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  /**
   * Maps an API file object to a FileItem
   * @param file The file object from API
   * @returns FileItem object with formatted data
   */
  mapApiFileToFileItem(file: any): FileItem {
    return {
      name: file.name,
      fileType: this.getFileTypeFromContentType(file.contentType),
      reason: 'You opened',
      date: this.formatDate(file.updatedAt),
      owner: 'me',
      location: file.parent ? file.parent.name : 'My Drive',
    };
  }

  /**
   * Determines the file type based on content type from API
   * @param contentType The content type from API
   * @returns The file type category
   */
  getFileTypeFromContentType(
    contentType: string
  ): 'document' | 'spreadsheet' | 'text' | 'archive' | 'video' {
    if (contentType.includes('text/')) {
      return 'text';
    } else if (contentType.includes('video/')) {
      return 'video';
    } else if (
      contentType.includes('application/zip') ||
      contentType.includes('application/x-rar')
    ) {
      return 'archive';
    } else if (
      contentType.includes('application/vnd.ms-excel') ||
      contentType.includes('spreadsheetml') ||
      contentType.includes('sheet')
    ) {
      return 'spreadsheet';
    } else if (
      contentType.includes('application/msword') ||
      contentType.includes('wordprocessingml') ||
      contentType.includes('document')
    ) {
      return 'document';
    } else if (
      contentType.includes('presentation') ||
      contentType.includes('powerpoint')
    ) {
      return 'document';
    } else {
      return 'document'; // Default
    }
  }
}
