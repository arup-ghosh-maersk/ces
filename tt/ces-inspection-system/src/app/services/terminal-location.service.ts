import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TerminalLocation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TerminalLocationService {
  private locations: TerminalLocation[] = [];
  private locationsSubject = new BehaviorSubject<TerminalLocation[]>([]);
  public locations$ = this.locationsSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.locations = [
      {
        locationId: 'loc-001',
        locationName: 'Port Terminal A - North Dock',
        terminalCode: 'PTA-ND',
        gpsCoordinates: '13.1939° N, 80.2825° E'
      },
      {
        locationId: 'loc-002',
        locationName: 'Port Terminal A - South Dock',
        terminalCode: 'PTA-SD',
        gpsCoordinates: '13.1850° N, 80.2800° E'
      },
      {
        locationId: 'loc-003',
        locationName: 'Port Terminal B - East Yard',
        terminalCode: 'PTB-EY',
        gpsCoordinates: '13.1900° N, 80.2900° E'
      },
      {
        locationId: 'loc-004',
        locationName: 'Port Terminal B - West Yard',
        terminalCode: 'PTB-WY',
        gpsCoordinates: '13.1880° N, 80.2750° E'
      },
      {
        locationId: 'loc-005',
        locationName: 'Inland Container Depot - ICD-01',
        terminalCode: 'ICD-01',
        gpsCoordinates: '13.2100° N, 80.3000° E'
      },
      {
        locationId: 'loc-006',
        locationName: 'Inland Container Depot - ICD-02',
        terminalCode: 'ICD-02',
        gpsCoordinates: '13.2150° N, 80.3050° E'
      }
    ];
    this.locationsSubject.next(this.locations);
  }

  getLocations(): Observable<TerminalLocation[]> {
    return this.locationsSubject.asObservable();
  }

  getLocationById(locationId: string): TerminalLocation | undefined {
    return this.locations.find(l => l.locationId === locationId);
  }

  getLocationByTerminalCode(terminalCode: string): TerminalLocation | undefined {
    return this.locations.find(l => l.terminalCode === terminalCode);
  }

  addLocation(location: TerminalLocation): void {
    this.locations.push(location);
    this.locationsSubject.next([...this.locations]);
  }

  updateLocation(locationId: string, updatedLocation: Partial<TerminalLocation>): void {
    const index = this.locations.findIndex(l => l.locationId === locationId);
    if (index !== -1) {
      this.locations[index] = { ...this.locations[index], ...updatedLocation };
      this.locationsSubject.next([...this.locations]);
    }
  }

  deleteLocation(locationId: string): void {
    this.locations = this.locations.filter(l => l.locationId !== locationId);
    this.locationsSubject.next(this.locations);
  }
}
