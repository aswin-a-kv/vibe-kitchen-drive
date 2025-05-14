import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterChipComponent } from '../filter-chip/filter-chip.component';

@Component({
  selector: 'app-filter-chips',
  standalone: true,
  imports: [CommonModule, FilterChipComponent],
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
})
export class FilterChipsComponent {
  // SVG paths for each chip icon
  readonly typeIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" fill="currentColor"/>
  </svg>`;

  readonly peopleIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" fill="currentColor"/>
  </svg>`;

  readonly modifiedIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" fill="currentColor"/>
  </svg>`;

  readonly locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="currentColor"/>
  </svg>`;

  selectFilter(option: string, chipType: string): void {
    // This will directly handle the click on dropdown items
    this.handleFilterSelected(option, chipType);
  }

  handleFilterSelected(filter: string, chipType: string): void {
    console.log(`Selected ${filter} from ${chipType} chip`);
    // Handle filter selection logic here
  }
}
