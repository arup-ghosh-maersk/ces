import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AssetSpecs } from '../../models';
import { AssetSpecsService } from '../../services/asset-specs.service';

@Component({
  selector: 'app-asset-specs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="specs-container">
      <div class="specs-section">
        <table class="table">
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Lift Capacity (T)</th>
              <th>Max Speed (m/s)</th>
              <th>Operating Pressure (bar)</th>
              <th>Motor Power (kW)</th>
              <th>Cycle Time (s)</th>
              <th>Last Service</th>
              <th>Next Service</th>
              <th>Certifications</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let spec of specs$ | async">
              <td><strong>{{ spec.assetId }}</strong></td>
              <td>{{ spec.liftCapacity }}</td>
              <td>{{ spec.maxSpeed }}</td>
              <td>{{ spec.operatingPressure }}</td>
              <td>{{ spec.motorPower }}</td>
              <td>{{ spec.cycleTime }}</td>
              <td>{{ spec.lastServiceDate | date:'MMM dd, yyyy' }}</td>
              <td>
                <span [ngClass]="isUpcoming(spec.nextServiceDate) ? 'upcoming' : 'normal'">
                  {{ spec.nextServiceDate | date:'MMM dd, yyyy' }}
                </span>
              </td>
              <td>{{ spec.certifications }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="detail-section">
        <h3>Detailed Specifications View</h3>
        <div class="specs-grid">
          <div *ngFor="let spec of specs$ | async" class="spec-card">
            <div class="spec-header">
              <h4>{{ spec.assetId }}</h4>
              <p class="tire-condition" [ngClass]="'condition-' + (spec.tireCondition?.toLowerCase() || 'unknown')">
                Tire: {{ spec.tireCondition }}
              </p>
            </div>
            <div class="spec-details">
              <div class="detail-row">
                <span class="label">Lift Capacity:</span>
                <span class="value">{{ spec.liftCapacity }} tonnes</span>
              </div>
              <div class="detail-row">
                <span class="label">Max Speed:</span>
                <span class="value">{{ spec.maxSpeed }} m/s</span>
              </div>
              <div class="detail-row">
                <span class="label">Operating Pressure:</span>
                <span class="value">{{ spec.operatingPressure }} bar</span>
              </div>
              <div class="detail-row">
                <span class="label">Motor Power:</span>
                <span class="value">{{ spec.motorPower }} kW</span>
              </div>
              <div class="detail-row">
                <span class="label">Cycle Time:</span>
                <span class="value">{{ spec.cycleTime }} seconds</span>
              </div>
              <div class="detail-row">
                <span class="label">Boom Length:</span>
                <span class="value">{{ spec.boomLength }} meters</span>
              </div>
              <div class="detail-row">
                <span class="label">Track Gauge:</span>
                <span class="value">{{ spec.trackGauge }} mm</span>
              </div>
              <div class="detail-row">
                <span class="label">Wheel Diameter:</span>
                <span class="value">{{ spec.wheelDiameter }} mm</span>
              </div>
              <div class="detail-row">
                <span class="label">Maintenance History:</span>
                <span class="value">{{ spec.maintenanceHistory }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Certifications:</span>
                <span class="value">{{ spec.certifications }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Last Service:</span>
                <span class="value">{{ spec.lastServiceDate | date:'MMM dd, yyyy' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Next Service:</span>
                <span class="value" [ngClass]="isUpcoming(spec.nextServiceDate) ? 'upcoming-service' : ''">
                  {{ spec.nextServiceDate | date:'MMM dd, yyyy' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .specs-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
      border-bottom: 3px solid #1976d2;
      padding-bottom: 10px;
    }

    h3 {
      color: #666;
      margin: 30px 0 20px 0;
    }

    .specs-section {
      margin-bottom: 40px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .table thead {
      background-color: #f5f5f5;
      font-weight: bold;
    }

    .table th,
    .table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .table tr:hover {
      background-color: #f9f9f9;
    }

    .upcoming {
      color: #ff9800;
      font-weight: bold;
    }

    .detail-section {
      margin-top: 40px;
    }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
      gap: 20px;
    }

    .spec-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s ease;
    }

    .spec-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .spec-header {
      border-bottom: 2px solid #1976d2;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }

    .spec-header h4 {
      margin: 0;
      color: #1976d2;
    }

    .tire-condition {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
      margin-top: 5px;
      font-weight: bold;
    }

    .condition-good {
      background-color: #c8e6c9;
      color: #2e7d32;
    }

    .condition-excellent {
      background-color: #a5d6a7;
      color: #1b5e20;
    }

    .condition-fair {
      background-color: #fff9c4;
      color: #f57f17;
    }

    .condition-poor {
      background-color: #ffccbc;
      color: #d84315;
    }

    .spec-details {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: bold;
      color: #666;
      min-width: 150px;
    }

    .value {
      color: #333;
      text-align: right;
      flex: 1;
    }

    .upcoming-service {
      color: #ff9800;
      font-weight: bold;
    }
  `]
})
export class AssetSpecsComponent implements OnInit {
  specs$: Observable<AssetSpecs[]>;

  constructor(private assetSpecsService: AssetSpecsService) {
    this.specs$ = this.assetSpecsService.getSpecs();
  }

  ngOnInit(): void {
  }

  isUpcoming(date: Date | undefined): boolean {
    if (!date) return false;
    const today = new Date();
    const daysUntilService = Math.floor((new Date(date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilService <= 30 && daysUntilService >= 0;
  }
}
