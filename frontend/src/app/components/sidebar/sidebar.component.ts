import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  expanded?: boolean;
  children?: NavItem[];
  highlighted?: boolean;
  type?: 'folder' | 'item' | 'storage';
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { id: 'new', label: 'New', icon: 'add.svg', type: 'item' },
    {
      id: 'home',
      label: 'Home',
      icon: 'home.svg',
      type: 'item',
      route: '/home',
    },
    {
      id: 'my-drive',
      label: 'My Drive',
      icon: 'my_drive.svg',
      type: 'folder',
      highlighted: true,
      expanded: true,
      children: [
        {
          id: 'documents',
          label: 'Documents',
          icon: 'folder.svg',
          type: 'folder',
        },
        { id: 'dring', label: 'dring', icon: 'folder.svg', type: 'folder' },
        { id: 'media', label: 'media', icon: 'folder.svg', type: 'folder' },
        { id: 'movies', label: 'Movies', icon: 'folder.svg', type: 'folder' },
        {
          id: 'programs',
          label: 'Programs',
          icon: 'folder.svg',
          type: 'folder',
        },
        {
          id: 'tax-docs',
          label: 'Tax docs 2024',
          icon: 'description.svg',
          type: 'folder',
        },
      ],
    },
    {
      id: 'computers',
      label: 'Computers',
      icon: 'computers.svg',
      type: 'item',
    },
    {
      id: 'shared',
      label: 'Shared with me',
      icon: 'shared_with_me.svg',
      type: 'item',
    },
    {
      id: 'recent',
      label: 'Recent',
      icon: 'recents.svg',
      type: 'item',
    },
    {
      id: 'starred',
      label: 'Starred',
      icon: 'starred.svg',
      type: 'item',
    },
    {
      id: 'spam',
      label: 'Spam',
      icon: 'spam.svg',
      type: 'item',
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: 'trash.svg',
      type: 'item',
      route: '/trash',
    },
    {
      id: 'storage',
      label: 'Storage (71% full)',
      icon: 'storage.svg',
      type: 'storage',
    },
  ];

  storageUsed = '10.66 GB of 15 GB used';

  constructor(private router: Router) {}

  toggleFolder(item: NavItem): void {
    item.expanded = !item.expanded;
  }

  isFolder(item: NavItem): boolean {
    return item.children !== undefined && item.children.length > 0;
  }

  navigateTo(item: NavItem): void {
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }
}
