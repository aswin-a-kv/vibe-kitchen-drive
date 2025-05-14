import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.scss',
})
export class TrashComponent {
  // No files in trash currently
  trashIsEmpty = true;

  // For filtering
  filterOptions = {
    type: '',
    modified: '',
    source: '',
  };
}
