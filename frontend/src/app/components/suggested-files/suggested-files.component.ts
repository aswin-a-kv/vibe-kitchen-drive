import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FileUploadService } from '../../services/file-upload.service';
import { Subscription } from 'rxjs';
import { User } from 'firebase/auth';
import { HttpEventType } from '@angular/common/http';
import { FileItem } from '../../models/file.model';

@Component({
  selector: 'app-suggested-files',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suggested-files.component.html',
  styleUrls: ['./suggested-files.component.scss'],
})
export class SuggestedFilesComponent implements OnInit, OnDestroy {
  isExpanded: boolean = true;
  currentUser: User | null = null;
  profilePhotoUrl: string = '';
  userEmail: string = '';
  isDraggingOver: boolean = false;

  private authSubscription: Subscription | undefined;

  // Files to display
  suggestedFiles: FileItem[] = [
    {
      name: 'presentation_5.pptx',
      fileType: 'document',
      reason: 'You modified',
      date: 'May 14, 2025',
      owner: 'me',
      location: 'Work',
      isShared: true,
    },
    {
      name: 'document_1.txt',
      fileType: 'text',
      reason: 'You opened',
      date: 'May 14, 2025',
      owner: 'me',
      location: 'Work',
      isShared: false,
    },
    {
      name: 'spreadsheet_3.xlsx',
      fileType: 'spreadsheet',
      reason: 'You created',
      date: 'Apr 28, 2025',
      owner: 'me',
      location: 'My Drive',
      isShared: true,
    },
    {
      name: 'project_archive.zip',
      fileType: 'archive',
      reason: 'You uploaded',
      date: 'Apr 15, 2025',
      owner: 'me',
      location: 'Projects',
      isShared: false,
    },
    {
      name: 'product_demo.mp4',
      fileType: 'video',
      reason: 'You opened',
      date: 'Apr 10, 2025',
      owner: 'me',
      location: 'Media',
      isShared: false,
    },
    {
      name: 'budget_2025.xlsx',
      fileType: 'spreadsheet',
      reason: 'You modified',
      date: 'Mar 20, 2025',
      owner: 'me',
      location: 'Finance',
      isShared: true,
    },
    {
      name: 'meeting_notes.txt',
      fileType: 'text',
      reason: 'You created',
      date: 'Mar 15, 2025',
      owner: 'me',
      location: 'Work',
      isShared: false,
    },
    {
      name: 'project_proposal.docx',
      fileType: 'document',
      reason: 'You opened',
      date: 'Feb 28, 2025',
      owner: 'me',
      location: 'Projects',
      isShared: true,
    },
  ];

  constructor(
    private authService: AuthService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    // Subscribe to user authentication changes
    this.authSubscription = this.authService.user$.subscribe((user) => {
      this.currentUser = user;
      this.profilePhotoUrl = user?.photoURL || 'assets/default-avatar.png';
      this.userEmail = user?.email || '';
    });

    // Initially check if user is already logged in
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profilePhotoUrl =
        currentUser.photoURL || 'assets/default-avatar.png';
      this.userEmail = currentUser.email || '';
    }

    // Note: We're using static sample data instead of API calls
    // API endpoint is not accessible due to ngrok's consent page
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  /**
   * Toggles the accordion expansion state
   */
  toggleAccordion(): void {
    this.isExpanded = !this.isExpanded;
  }

  /**
   * Gets the SVG icon for a specific file type
   * @param fileType The type of file
   * @returns SVG markup for the icon
   */
  getFileIcon(fileType: string): string {
    switch (fileType) {
      case 'document':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#4285F4">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
          <path d="M14 3v5h5M16 13H8v-1h8v1zm0 3H8v-1h8v1zm-3 3H8v-1h5v1z" stroke="white" stroke-width="1"/>
        </svg>`;
      case 'spreadsheet':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#0F9D58">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
          <path d="M14 3v5h5M7 13h2v-2h2v2h2v2h-2v2h-2v-2H7v-2z" stroke="white" stroke-width="1"/>
        </svg>`;
      case 'text':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#4285F4">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
          <path d="M14 3v5h5M6 14h12M6 17h12M6 11h12" stroke="white" stroke-width="1"/>
        </svg>`;
      case 'archive':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#A142F4">
          <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2 6h-2v2h-2v-2h-2v-2h2V8h2v2h2v2z"/>
        </svg>`;
      case 'video':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#FF0000">
          <path d="M4 6.47L5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4z"/>
        </svg>`;
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#9AA0A6">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
          <path d="M14 3v5h5" stroke="white" stroke-width="1"/>
        </svg>`;
    }
  }

  /**
   * Handles dragover event for file dropping
   * @param event The drag event
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = true;
  }

  /**
   * Handles dragleave event for file dropping
   * @param event The drag event
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = false;
  }

  /**
   * Handles file drop event
   * @param event The drop event containing files
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = false;

    if (event.dataTransfer?.files) {
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          console.log('File dropped:', {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: new Date(file.lastModified).toLocaleString(),
          });

          // Add a new file to the UI directly since API isn't available
          this.addLocalFile(file);
        }
      }
    }
  }

  /**
   * Adds a locally dropped file to the UI without API upload
   * @param file The file that was dropped
   */
  private addLocalFile(file: File): void {
    // Create a new file item
    const newFile: FileItem = {
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
      isShared: false,
    };

    // Add it to the beginning of the list
    this.suggestedFiles.unshift(newFile);
  }

  /**
   * Determines file type from MIME type
   * @param mimeType The MIME type
   * @returns The file type category
   */
  private getFileTypeFromMimeType(
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
      mimeType.includes('wordprocessingml')
    ) {
      return 'document';
    } else {
      return 'document'; // Default
    }
  }
}
