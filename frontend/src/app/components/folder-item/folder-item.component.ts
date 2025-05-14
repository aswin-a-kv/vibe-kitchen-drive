import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-folder-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './folder-item.component.html',
  styleUrls: ['./folder-item.component.scss'],
})
export class FolderItemComponent {
  @Input() name: string = '';
  @Input() location: string = '';
  @Input() iconType: 'folder' | 'shared' | 'document' = 'folder';

  onMenuClick(event: Event): void {
    event.stopPropagation();
    // Handle menu click action
    console.log('Menu clicked for folder:', this.name);
  }
}
