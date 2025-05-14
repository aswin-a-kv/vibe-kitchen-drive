import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService } from '../../services/file-upload.service';
import { UploadProgress } from '../../models/file.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-notification.component.html',
  styleUrls: ['./upload-notification.component.scss'],
})
export class UploadNotificationComponent implements OnInit, OnDestroy {
  uploads: UploadProgress[] = [];
  showNotification = false;
  completedCount = 0;
  errorCount = 0;
  expanded = true;
  private subscription: Subscription | undefined;

  constructor(private fileUploadService: FileUploadService) {}

  ngOnInit(): void {
    this.subscription = this.fileUploadService.uploadProgress$.subscribe(
      (progress) => {
        this.uploads = progress;
        this.showNotification = progress.length > 0;

        // Count completed and error uploads
        this.completedCount = progress.filter((p) => p.success).length;
        this.errorCount = progress.filter((p) => p.error).length;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Dismisses the notification
   */
  dismiss(): void {
    this.showNotification = false;
  }

  /**
   * Toggles the expanded/collapsed state of the notification
   */
  toggleExpand(): void {
    this.expanded = !this.expanded;
  }

  /**
   * Clears completed uploads from the list
   */
  clearCompleted(): void {
    this.fileUploadService.clearCompletedUploads();
  }

  /**
   * Checks if any uploads are currently in progress
   */
  hasActiveUploads(): boolean {
    return this.uploads.some((upload) => upload.uploading);
  }

  /**
   * Gets the count of active uploads
   */
  getActiveUploadsCount(): number {
    return this.uploads.filter((upload) => upload.uploading).length;
  }

  /**
   * Returns pluralized text based on count
   */
  getPluralSuffix(count: number): string {
    return count > 1 ? 's' : '';
  }
}
