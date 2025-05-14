import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-filter-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-chip.component.html',
  styleUrls: ['./filter-chip.component.scss'],
})
export class FilterChipComponent {
  @Input() label: string = '';
  @Input()
  set iconSvgPath(value: string) {
    this._iconSvgPath = value;
    this.safeIconSvgPath = this.sanitizer.bypassSecurityTrustHtml(value);
  }
  get iconSvgPath(): string {
    return this._iconSvgPath;
  }

  private _iconSvgPath: string = '';
  safeIconSvgPath: SafeHtml = '';

  @Output() filterSelected = new EventEmitter<string>();

  isOpen: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this.isOpen) {
      this.isOpen = false;
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  selectFilter(option: string): void {
    this.filterSelected.emit(option);
    this.isOpen = false;
  }
}
