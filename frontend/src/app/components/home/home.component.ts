import { Component } from '@angular/core';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { FilterChipsComponent } from '../filter-chips/filter-chips.component';
import { SuggestedFoldersComponent } from '../suggested-folders/suggested-folders.component';
import { SuggestedFilesComponent } from '../suggested-files/suggested-files.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SearchbarComponent,
    FilterChipsComponent,
    SuggestedFoldersComponent,
    SuggestedFilesComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  title = 'Welcome to Drive';
}
