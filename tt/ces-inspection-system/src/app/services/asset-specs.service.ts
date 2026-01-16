import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AssetSpecs } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AssetSpecsService {
  private specs: AssetSpecs[] = [];
  private specsSubject = new BehaviorSubject<AssetSpecs[]>([]);
  public specs$ = this.specsSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.specs = [
      {
        specId: 'spec-001',
        assetId: 'asset-001',
        operatingPressure: 250,
        liftCapacity: 45,
        maxSpeed: 2.5,
        trackGauge: 2000,
        motorPower: 75,
        cycleTime: 120,
        boomLength: 35,
        spreadsheetCapacity: 45,
        wheelDiameter: 800,
        tireCondition: 'Good',
        maintenanceHistory: 'Regular maintenance performed',
        lastServiceDate: new Date('2024-10-15'),
        nextServiceDate: new Date('2025-01-15'),
        certifications: 'ISO 9001, API 2A',
        createdAt: new Date('2024-01-01')
      },
      {
        specId: 'spec-002',
        assetId: 'asset-002',
        operatingPressure: 280,
        liftCapacity: 65,
        maxSpeed: 3.0,
        trackGauge: 2200,
        motorPower: 110,
        cycleTime: 90,
        boomLength: 42,
        spreadsheetCapacity: 65,
        wheelDiameter: 900,
        tireCondition: 'Excellent',
        maintenanceHistory: 'Recently serviced',
        lastServiceDate: new Date('2024-11-01'),
        nextServiceDate: new Date('2025-02-01'),
        certifications: 'ISO 9001, ISO 14001, OHSAS 18001',
        createdAt: new Date('2024-02-01')
      }
    ];
    this.specsSubject.next(this.specs);
  }

  getSpecs(): Observable<AssetSpecs[]> {
    return this.specsSubject.asObservable();
  }

  getSpecsByAssetId(assetId: string): Observable<AssetSpecs | undefined> {
    const spec = this.specs.find(s => s.assetId === assetId);
    return new BehaviorSubject<AssetSpecs | undefined>(spec).asObservable();
  }

  getSpecById(id: string): AssetSpecs | undefined {
    return this.specs.find(s => s.specId === id);
  }

  addSpecs(spec: AssetSpecs): void {
    this.specs.push(spec);
    this.specsSubject.next([...this.specs]);
  }

  updateSpecs(spec: AssetSpecs): void {
    const index = this.specs.findIndex(s => s.specId === spec.specId);
    if (index !== -1) {
      this.specs[index] = { ...spec, updatedAt: new Date() };
      this.specsSubject.next([...this.specs]);
    }
  }

  deleteSpecs(id: string): void {
    this.specs = this.specs.filter(s => s.specId !== id);
    this.specsSubject.next([...this.specs]);
  }

  getSpecsByAssetType(assetType: string): Observable<AssetSpecs[]> {
    // This would require joining with Asset table in real implementation
    return this.specsSubject.asObservable();
  }
}
