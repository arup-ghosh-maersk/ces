import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-container">
      <nav class="sidebar" [class.open]="sidebarOpen">
        <div class="sidebar-header">
          <h1>CES</h1>
          <button class="hamburger" (click)="toggleSidebar()" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        <ul class="nav-menu">
          <li><a routerLink="/dashboard" routerLinkActive="active" (click)="closeSidebarOnMobile()">
            <span class="icon">📊</span>
            <span class="label">Dashboard</span>
          </a></li>
          <li><a routerLink="/jobs" routerLinkActive="active" (click)="closeSidebarOnMobile()">
            <span class="icon">✅</span>
            <span class="label">Inspection Jobs</span>
          </a></li>
          <li class="admin-settings">
            <div class="admin-header" (click)="adminOpen = !adminOpen">
              <span class="icon">🛠️</span>
              <span class="label">Admin Settings</span>
              <span class="arrow" [class.open]="adminOpen">&#9662;</span>
            </div>
            <ul class="admin-submenu" [class.open]="adminOpen" *ngIf="adminOpen">
              <li><a routerLink="/assets" routerLinkActive="active" (click)="closeSidebarOnMobile()">
                <span class="icon">🏗️</span>
                <span class="label">Assets</span>
              </a></li>
              <li><a routerLink="/components" routerLinkActive="active" (click)="closeSidebarOnMobile()">
                <span class="icon">⚙️</span>
                <span class="label">Components</span>
              </a></li>
              <li><a routerLink="/locations" routerLinkActive="active" (click)="closeSidebarOnMobile()">
                <span class="icon">📍</span>
                <span class="label">Locations</span>
              </a></li>
              <li><a routerLink="/templates" routerLinkActive="active" (click)="closeSidebarOnMobile()">
                <span class="icon">📋</span>
                <span class="label">ITP Templates</span>
              </a></li>
            </ul>
          </li>
        </ul>
      </nav>

      <div class="sidebar-overlay" *ngIf="sidebarOpen" (click)="toggleSidebar()"></div>

      <div class="content-wrapper">
        <header class="top-header">
          <div class="header-left">
            <button class="sidebar-toggle" (click)="toggleSidebar()" aria-label="Toggle menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
            <h2 class="page-title">{{ pageTitle }}</h2>
          </div>
        </header>

        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      background-color: #f5f5f5;
    }

    .sidebar {
      width: 250px;
      background: #003D7A;
      color: white;
      padding: 20px;
      overflow-y: auto;
      transition: all 0.3s ease;
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      z-index: 1000;
    }

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    }

    .sidebar-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 2px;
    }

    .hamburger {
      display: none;
      flex-direction: column;
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
    }

    .hamburger span {
      width: 25px;
      height: 3px;
      background-color: white;
      margin: 4px 0;
      transition: all 0.3s ease;
      border-radius: 2px;
    }

    .nav-menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-menu li {
      margin-bottom: 10px;
    }

    .nav-menu a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 15px;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .nav-menu a:hover {
      background-color: rgba(255, 255, 255, 0.15);
      color: white;
    }

    .nav-menu a.active {
      background-color: rgba(255, 255, 255, 0.25);
      color: white;
      font-weight: bold;
      border-left: 4px solid white;
      padding-left: 11px;
    }

    .nav-menu .icon {
      font-size: 20px;
      min-width: 24px;
    }

    .nav-menu .label {
      font-size: 14px;
    }

    .sidebar-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }

    .content-wrapper {
      flex: 1;
      margin-left: 250px;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .top-header {
      background: white;
      padding: 15px 25px;
      border-bottom: 1px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: fixed;
      top: 0;
      right: 0;
      left: 250px;
      z-index: 500;
      height: 60px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .sidebar-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      flex-direction: column;
      gap: 4px;
    }

    .sidebar-toggle span {
      width: 24px;
      height: 3px;
      background-color: #333;
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .page-title {
      margin: 0;
      color: #333;
      font-size: 22px;
      font-weight: 600;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      margin-top: 60px;
      padding: 20px;
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100%;
        transform: translateX(-100%);
        z-index: 1000;
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .sidebar-overlay {
        display: block;
      }

      .hamburger {
        display: flex;
      }

      .content-wrapper {
        margin-left: 0;
        width: 100%;
      }

      .top-header {
        left: 0;
        right: 0;
      }

      .sidebar-toggle {
        display: flex;
      }

      .main-content {
        padding: 15px;
      }
    }

    @media (max-width: 480px) {
      .sidebar {
        width: 100%;
      }

      .sidebar-header h1 {
        font-size: 24px;
      }

      .nav-menu a {
        padding: 10px 12px;
        font-size: 13px;
      }

      .top-header {
        padding: 12px 15px;
        height: 56px;
      }

      .page-title {
        font-size: 18px;
      }

      .main-content {
        padding: 10px;
        margin-top: 56px;
      }
    }

    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    .admin-settings {
      margin-bottom: 10px;
    }

    .admin-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 15px;
      color: rgba(255, 255, 255, 0.8);
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s;
      font-size: 14px;
      font-weight: 500;
    }

    .admin-header:hover {
      background-color: rgba(255,255,255,0.15);
      color: white;
    }

    .admin-header .arrow {
      margin-left: auto;
      transition: transform 0.2s;
    }

    .admin-header .arrow.open {
      transform: rotate(180deg);
    }

    .admin-submenu {
      list-style: none;
      padding-left: 0;
      margin: 0;
      background: none;
    }

    .admin-submenu li {
      margin-bottom: 0;
      padding-left: 32px;
      display: flex;
      align-items: center;
    }

    .admin-submenu a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      border-radius: 6px;
      font-size: 13px;
      width: 100%;
      transition: background 0.3s;
    }

    .admin-submenu a:hover {
      background-color: rgba(255,255,255,0.10);
      color: white;
    }

    .admin-submenu .icon {
      font-size: 18px;
      min-width: 22px;
    }

    .admin-submenu .label {
      font-size: 13px;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'ces-inspection-system';
  sidebarOpen = false;
  pageTitle = 'Dashboard';
  adminOpen = false;

  private pageNames: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'assets': 'Assets',
    'locations': 'Terminal Locations',
    'templates': 'ITP Templates',
    'jobs': 'Inspection Jobs',
    'components': 'Component Master'
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Update page title on route change
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updatePageTitle(event.url);
        this.sidebarOpen = false;
      });
  }

  private updatePageTitle(url: string): void {
    const route = url.split('/')[1] || 'dashboard';
    this.pageTitle = this.pageNames[route] || 'CES Inspection System';
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth <= 768) {
      this.sidebarOpen = false;
    }
  }
}
