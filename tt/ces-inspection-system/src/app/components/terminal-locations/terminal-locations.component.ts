import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TerminalLocation } from '../../models';
import { TerminalLocationService } from '../../services/terminal-location.service';

@Component({
  selector: 'app-terminal-locations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="locations-container">
      <div class="locations-section">
        <h3>Terminal Locations</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Location ID</th>
              <th>Location Name</th>
              <th>Terminal Code</th>
              <th>GPS Coordinates</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let location of locations$ | async" 
                (click)="selectLocation(location)"
                [class.selected]="selectedLocation?.locationId === location.locationId"
                class="clickable-row">
              <td><strong>{{ location.locationId }}</strong></td>
              <td>{{ location.locationName }}</td>
              <td><span class="badge">{{ location.terminalCode }}</span></td>
              <td>{{ location.gpsCoordinates || 'N/A' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="detail-section" *ngIf="selectedLocation">
        <div class="details-header">
          <h3>Location Details</h3>
          <button class="btn-close" (click)="closeDetails()" aria-label="Close details">×</button>
        </div>

        <div class="location-details">
          <div class="info-section">
            <h4>Basic Information</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>Location ID:</label>
                <span>{{ selectedLocation.locationId }}</span>
              </div>
              <div class="info-item">
                <label>Location Name:</label>
                <span>{{ selectedLocation.locationName }}</span>
              </div>
              <div class="info-item">
                <label>Terminal Code:</label>
                <span><span class="badge">{{ selectedLocation.terminalCode }}</span></span>
              </div>
              <div class="info-item" *ngIf="selectedLocation.gpsCoordinates">
                <label>GPS Coordinates:</label>
                <span>{{ selectedLocation.gpsCoordinates }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .locations-container {
      padding: 20px;
      max-width: 1600px;
      margin: 0 auto;
    }

    h3 {
      color: #666;
      margin-bottom: 15px;
    }

    h4 {
      color: #003D7A;
      margin-bottom: 12px;
    }

    .locations-section {
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

    .clickable-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .clickable-row:hover {
      background-color: #f9f9f9;
    }

    .clickable-row.selected {
      background-color: #e3f2fd;
      font-weight: bold;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      display: inline-block;
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .detail-section {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-top: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #eee;
    }

    .details-header h3 {
      margin: 0;
    }

    .btn-close {
      background-color: #f44336;
      color: white;
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      font-size: 18px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .btn-close:hover {
      background-color: #d32f2f;
    }

    .location-details {
      display: grid;
      gap: 20px;
    }

    .info-section {
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 6px;
      border-left: 4px solid #003D7A;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .info-item label {
      font-weight: bold;
      color: #003D7A;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-item span {
      color: #333;
      font-size: 14px;
    }
  `]
})
export class TerminalLocationsComponent implements OnInit {
  locations$: Observable<TerminalLocation[]>;
  selectedLocation: TerminalLocation | null = null;

  constructor(private terminalLocationService: TerminalLocationService) {
    this.locations$ = this.terminalLocationService.getLocations();
  }

  ngOnInit(): void {
    // Component initialization
  }

  selectLocation(location: TerminalLocation): void {
    this.selectedLocation = location;
  }

  closeDetails(): void {
    this.selectedLocation = null;
  }
}
