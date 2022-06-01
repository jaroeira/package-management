import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuItems: MenuItem[] = [
    {
      label: 'View Packages',
      path: 'list-packages',
      icon: 'search',
    },
    {
      label: 'Add New Package',
      path: 'add-package',
      icon: 'post_add',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}

export interface MenuItem {
  label: string;
  path: string;
  icon: string;
}
