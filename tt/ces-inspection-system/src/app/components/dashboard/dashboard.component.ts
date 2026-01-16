import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <main class="main-content">
        <section class="dashboard-section">
          <h2>System Overview</h2>
          
          <div class="overview-grid">
            <div class="card">
              <h3>Inspection Jobs</h3>
              <p class="card-value">24</p>
              <p class="card-description">Total Jobs</p>
              <a routerLink="/jobs" class="card-link">View Jobs →</a>
            </div>

            <div class="card">
              <h3>Open Issues</h3>
              <p class="card-value">5</p>
              <p class="card-description">NCR & Defects</p>
              <a routerLink="/jobs" class="card-link">View Issues →</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .header {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: bold;
    }

    .subtitle {
      margin: 5px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }

    .navigation {
      background-color: white;
      border-bottom: 1px solid #ddd;
      padding: 0;
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 0;
    }

    .nav-link {
      display: block;
      padding: 15px 20px;
      color: #333;
      text-decoration: none;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
    }

    .nav-link:hover {
      background-color: #f5f5f5;
      color: #1976d2;
    }

    .nav-link.active {
      border-bottom-color: #1976d2;
      color: #1976d2;
      font-weight: bold;
    }

    .main-content {
      flex: 1;
      padding: 30px 20px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .dashboard-section,
    .features-section,
    .info-section {
      background: white;
      border-radius: 8px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #333;
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 24px;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .card {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
      border-radius: 8px;
      border-left: 5px solid #1976d2;
      transition: transform 0.3s;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .card h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 16px;
    }

    .card-value {
      font-size: 36px;
      font-weight: bold;
      color: #1976d2;
      margin: 10px 0;
    }

    .card-description {
      color: #666;
      font-size: 14px;
      margin: 5px 0 15px 0;
    }

    .card-link {
      color: #1976d2;
      text-decoration: none;
      font-size: 14px;
      font-weight: bold;
      transition: color 0.3s;
    }

    .card-link:hover {
      color: #1565c0;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .feature {
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      border-top: 3px solid #1976d2;
    }

    .feature h4 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .feature p {
      margin: 0;
      color: #666;
      font-size: 14px;
      line-height: 1.6;
    }

    .info-content {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #1976d2;
    }

    .info-content p {
      margin: 10px 0;
      color: #666;
      line-height: 1.8;
    }

    .footer {
      background-color: #333;
      color: white;
      text-align: center;
      padding: 20px;
      font-size: 14px;
      margin-top: 30px;
    }

    .footer p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .header h1 {
        font-size: 24px;
      }

      .nav-list {
        flex-direction: column;
      }

      .overview-grid,
      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {}
