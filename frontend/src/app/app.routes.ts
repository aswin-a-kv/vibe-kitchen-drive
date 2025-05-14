import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TrashComponent } from './components/trash/trash.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'trash', component: TrashComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
