import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UploadNotificationComponent } from './components/upload-notification/upload-notification.component';
import { DetailsPanelComponent } from './components/details-panel/details-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    UploadNotificationComponent,
    DetailsPanelComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'drive-clone';
  isPanelCollapsed = false;

  toggleRightPanel(): void {
    this.isPanelCollapsed = !this.isPanelCollapsed;
  }
}
