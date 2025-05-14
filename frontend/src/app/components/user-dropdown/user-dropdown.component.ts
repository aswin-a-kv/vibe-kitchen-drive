import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dropdown.component.html',
  styleUrl: './user-dropdown.component.scss',
})
export class UserDropdownComponent implements OnInit {
  user$: Observable<User | null>;
  showDropdown = false;

  constructor(
    private authService: AuthService,
    private elementRef: ElementRef
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  login(): void {
    this.authService.signInWithGoogle();
    this.showDropdown = false;
  }

  logout(): void {
    this.authService.signOut();
    this.showDropdown = false;
  }
}
