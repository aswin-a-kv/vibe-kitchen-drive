import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderItemComponent } from '../folder-item/folder-item.component';

interface FolderItem {
  name: string;
  location: string;
  iconType: 'folder' | 'shared' | 'document';
}

@Component({
  selector: 'app-suggested-folders',
  standalone: true,
  imports: [CommonModule, FolderItemComponent],
  templateUrl: './suggested-folders.component.html',
  styleUrls: ['./suggested-folders.component.scss'],
})
export class SuggestedFoldersComponent {
  isExpanded: boolean = false;

  // Sample folder data - in a real app this would come from a service
  suggestedFolders: FolderItem[] = [
    { name: 'El Camino', location: 'In Shared with me', iconType: 'shared' },
    { name: 'BCS', location: 'In Shared with me', iconType: 'shared' },
    { name: 'media', location: 'In My Drive', iconType: 'folder' },
    { name: 'Tax docs 2024', location: 'In My Drive', iconType: 'folder' },
  ];

  toggleAccordion(): void {
    this.isExpanded = !this.isExpanded;
  }
}
