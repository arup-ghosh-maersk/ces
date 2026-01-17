import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ComponentParameter,
  ParameterIndicator,
  ThresholdRequirement,
  ComponentInspectionConfig,
  InspectionPoint
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AssetInspectionPointsService {
  private assetInspectionPointsSubject = new BehaviorSubject<AssetInspectionPoint[]>([]);
  private parameterIndicatorsSubject = new BehaviorSubject<ParameterIndicator[]>([]);
  private thresholdRequirementsSubject = new BehaviorSubject<ThresholdRequirement[]>([]);
  private assetParameterThresholdsSubject = new BehaviorSubject<AssetParameterThreshold[]>([]);

  // Mock data
  private mockAssetInspectionPoints: AssetInspectionPoint[] = [
    {
      assetPointId: 'aip-001',
      assetId: 'ASSET-001',
      pointId: 'POINT-001',
      templateId: 'TEMPLATE-001',
      sequence: 1,
      isApplicable: true,
      isMandatory: true,
      priority: 'Critical',
      createdAt: new Date()
    },
    {
      assetPointId: 'aip-002',
      assetId: 'ASSET-001',
      pointId: 'POINT-002',
      templateId: 'TEMPLATE-001',
      sequence: 2,
      isApplicable: true,
      isMandatory: true,
      priority: 'High',
      createdAt: new Date()
    },
    {
      assetPointId: 'aip-003',
      assetId: 'ASSET-002',
      pointId: 'POINT-003',
      templateId: 'TEMPLATE-002',
      sequence: 1,
      isApplicable: true,
      isMandatory: false,
      priority: 'Medium',
      createdAt: new Date()
    }
  ];

  private mockParameterIndicators: ParameterIndicator[] = [
    {
      indicatorId: 'IND-001',
      indicatorName: 'Operating Temperature',
      indicatorType: 'Temperature',
      unit: '°C',
      description: 'Motor operating temperature',
      isNumeric: true,
      createdAt: new Date()
    },
    {
      indicatorId: 'IND-002',
      indicatorName: 'Hydraulic Pressure',
      indicatorType: 'Pressure',
      unit: 'bar',
      description: 'System hydraulic pressure',
      isNumeric: true,
      createdAt: new Date()
    },
    {
      indicatorId: 'IND-003',
      indicatorName: 'Vibration Level',
      indicatorType: 'Vibration',
      unit: 'mm/s',
      description: 'Structural vibration measurement',
      isNumeric: true,
      createdAt: new Date()
    },
    {
      indicatorId: 'IND-004',
      indicatorName: 'Oil Leak Detection',
      indicatorType: 'Visual',
      unit: 'Status',
      description: 'Visual inspection for oil leaks',
      isNumeric: false,
      createdAt: new Date()
    },
    {
      indicatorId: 'IND-005',
      indicatorName: 'Electrical Resistance',
      indicatorType: 'Electrical',
      unit: 'Ω',
      description: 'Ground resistance measurement',
      isNumeric: true,
      createdAt: new Date()
    }
  ];

  private mockThresholdRequirements: ThresholdRequirement[] = [
    {
      thresholdId: 'TH-001',
      indicatorId: 'IND-001',
      minimumValue: 20,
      maximumValue: 85,
      warningMin: 25,
      warningMax: 80,
      criticalMin: 15,
      criticalMax: 90,
      acceptableTolerance: 2,
      unit: '°C',
      description: 'Temperature range for normal operation',
      isActive: true,
      createdAt: new Date()
    },
    {
      thresholdId: 'TH-002',
      indicatorId: 'IND-002',
      minimumValue: 1,
      maximumValue: 250,
      warningMin: 10,
      warningMax: 240,
      criticalMin: 0.5,
      criticalMax: 280,
      acceptableTolerance: 5,
      unit: 'bar',
      description: 'Hydraulic system pressure limits',
      isActive: true,
      createdAt: new Date()
    },
    {
      thresholdId: 'TH-003',
      indicatorId: 'IND-003',
      minimumValue: 0,
      maximumValue: 7.1,
      warningMin: 0.5,
      warningMax: 6,
      criticalMin: 0,
      criticalMax: 10,
      acceptableTolerance: 0.5,
      unit: 'mm/s',
      description: 'Vibration severity levels (ISO 20816)',
      isActive: true,
      createdAt: new Date()
    },
    {
      thresholdId: 'TH-004',
      indicatorId: 'IND-005',
      minimumValue: 1000000,
      maximumValue: undefined,
      warningMin: 500000,
      warningMax: undefined,
      criticalMin: 100000,
      criticalMax: undefined,
      acceptableTolerance: undefined,
      unit: 'Ω',
      description: 'Minimum ground resistance requirement',
      isActive: true,
      createdAt: new Date()
    }
  ];

  private mockAssetParameterThresholds: AssetParameterThreshold[] = [
    {
      assetParamId: 'apt-001',
      assetPointId: 'aip-001',
      indicatorId: 'IND-001',
      thresholdId: 'TH-001',
      assetId: 'ASSET-001',
      pointId: 'POINT-001',
      sequence: 1,
      isRequired: true,
      isActive: true,
      notes: 'Check motor temperature after 2 hours of operation',
      createdAt: new Date()
    },
    {
      assetParamId: 'apt-002',
      assetPointId: 'aip-001',
      indicatorId: 'IND-002',
      thresholdId: 'TH-002',
      assetId: 'ASSET-001',
      pointId: 'POINT-001',
      sequence: 2,
      isRequired: true,
      isActive: true,
      notes: 'Monitor hydraulic pressure during load test',
      createdAt: new Date()
    },
    {
      assetParamId: 'apt-003',
      assetPointId: 'aip-002',
      indicatorId: 'IND-003',
      thresholdId: 'TH-003',
      assetId: 'ASSET-001',
      pointId: 'POINT-002',
      sequence: 1,
      isRequired: true,
      isActive: true,
      notes: 'Measure vibration at idle and full load',
      createdAt: new Date()
    },
    {
      assetParamId: 'apt-004',
      assetPointId: 'aip-003',
      indicatorId: 'IND-004',
      thresholdId: 'TH-004',
      assetId: 'ASSET-002',
      pointId: 'POINT-003',
      sequence: 1,
      isRequired: true,
      isActive: true,
      notes: 'Visual inspection for any visible leaks',
      createdAt: new Date()
    }
  ];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.assetInspectionPointsSubject.next(this.mockAssetInspectionPoints);
    this.parameterIndicatorsSubject.next(this.mockParameterIndicators);
    this.thresholdRequirementsSubject.next(this.mockThresholdRequirements);
    this.assetParameterThresholdsSubject.next(this.mockAssetParameterThresholds);
  }

  // Asset Inspection Points Methods
  getAssetInspectionPoints(): Observable<AssetInspectionPoint[]> {
    return this.assetInspectionPointsSubject.asObservable();
  }

  getAssetInspectionPointsByAsset(assetId: string): Observable<AssetInspectionPoint[]> {
    return new Observable(subscriber => {
      const filtered = this.mockAssetInspectionPoints.filter(ap => ap.assetId === assetId);
      subscriber.next(filtered);
      subscriber.complete();
    });
  }

  addAssetInspectionPoint(assetPoint: AssetInspectionPoint): void {
    this.mockAssetInspectionPoints.push(assetPoint);
    this.assetInspectionPointsSubject.next([...this.mockAssetInspectionPoints]);
  }

  updateAssetInspectionPoint(assetPointId: string, updates: Partial<AssetInspectionPoint>): void {
    const index = this.mockAssetInspectionPoints.findIndex(ap => ap.assetPointId === assetPointId);
    if (index > -1) {
      this.mockAssetInspectionPoints[index] = { ...this.mockAssetInspectionPoints[index], ...updates };
      this.assetInspectionPointsSubject.next([...this.mockAssetInspectionPoints]);
    }
  }

  deleteAssetInspectionPoint(assetPointId: string): void {
    this.mockAssetInspectionPoints = this.mockAssetInspectionPoints.filter(ap => ap.assetPointId !== assetPointId);
    this.assetInspectionPointsSubject.next([...this.mockAssetInspectionPoints]);
  }

  // Parameter Indicator Methods
  getParameterIndicators(): Observable<ParameterIndicator[]> {
    return this.parameterIndicatorsSubject.asObservable();
  }

  getParameterIndicatorById(indicatorId: string): Observable<ParameterIndicator | undefined> {
    return new Observable(subscriber => {
      const indicator = this.mockParameterIndicators.find(ind => ind.indicatorId === indicatorId);
      subscriber.next(indicator);
      subscriber.complete();
    });
  }

  addParameterIndicator(indicator: ParameterIndicator): void {
    this.mockParameterIndicators.push(indicator);
    this.parameterIndicatorsSubject.next([...this.mockParameterIndicators]);
  }

  updateParameterIndicator(indicatorId: string, updates: Partial<ParameterIndicator>): void {
    const index = this.mockParameterIndicators.findIndex(ind => ind.indicatorId === indicatorId);
    if (index > -1) {
      this.mockParameterIndicators[index] = { ...this.mockParameterIndicators[index], ...updates };
      this.parameterIndicatorsSubject.next([...this.mockParameterIndicators]);
    }
  }

  deleteParameterIndicator(indicatorId: string): void {
    this.mockParameterIndicators = this.mockParameterIndicators.filter(ind => ind.indicatorId !== indicatorId);
    this.parameterIndicatorsSubject.next([...this.mockParameterIndicators]);
  }

  // Threshold Requirement Methods
  getThresholdRequirements(): Observable<ThresholdRequirement[]> {
    return this.thresholdRequirementsSubject.asObservable();
  }

  getThresholdRequirementsByIndicator(indicatorId: string): Observable<ThresholdRequirement[]> {
    return new Observable(subscriber => {
      const filtered = this.mockThresholdRequirements.filter(tr => tr.indicatorId === indicatorId);
      subscriber.next(filtered);
      subscriber.complete();
    });
  }

  addThresholdRequirement(threshold: ThresholdRequirement): void {
    this.mockThresholdRequirements.push(threshold);
    this.thresholdRequirementsSubject.next([...this.mockThresholdRequirements]);
  }

  updateThresholdRequirement(thresholdId: string, updates: Partial<ThresholdRequirement>): void {
    const index = this.mockThresholdRequirements.findIndex(tr => tr.thresholdId === thresholdId);
    if (index > -1) {
      this.mockThresholdRequirements[index] = { ...this.mockThresholdRequirements[index], ...updates };
      this.thresholdRequirementsSubject.next([...this.mockThresholdRequirements]);
    }
  }

  deleteThresholdRequirement(thresholdId: string): void {
    this.mockThresholdRequirements = this.mockThresholdRequirements.filter(tr => tr.thresholdId !== thresholdId);
    this.thresholdRequirementsSubject.next([...this.mockThresholdRequirements]);
  }

  // Asset Parameter Threshold Methods
  getAssetParameterThresholds(): Observable<AssetParameterThreshold[]> {
    return this.assetParameterThresholdsSubject.asObservable();
  }

  getAssetParameterThresholdsByAssetPoint(assetPointId: string): Observable<AssetParameterThreshold[]> {
    return new Observable(subscriber => {
      const filtered = this.mockAssetParameterThresholds.filter(apt => apt.assetPointId === assetPointId);
      subscriber.next(filtered);
      subscriber.complete();
    });
  }

  getAssetParameterThresholdsByAsset(assetId: string): Observable<AssetParameterThreshold[]> {
    return new Observable(subscriber => {
      const filtered = this.mockAssetParameterThresholds.filter(apt => apt.assetId === assetId);
      subscriber.next(filtered);
      subscriber.complete();
    });
  }

  addAssetParameterThreshold(assetParamThreshold: AssetParameterThreshold): void {
    this.mockAssetParameterThresholds.push(assetParamThreshold);
    this.assetParameterThresholdsSubject.next([...this.mockAssetParameterThresholds]);
  }

  updateAssetParameterThreshold(assetParamId: string, updates: Partial<AssetParameterThreshold>): void {
    const index = this.mockAssetParameterThresholds.findIndex(apt => apt.assetParamId === assetParamId);
    if (index > -1) {
      this.mockAssetParameterThresholds[index] = { ...this.mockAssetParameterThresholds[index], ...updates };
      this.assetParameterThresholdsSubject.next([...this.mockAssetParameterThresholds]);
    }
  }

  deleteAssetParameterThreshold(assetParamId: string): void {
    this.mockAssetParameterThresholds = this.mockAssetParameterThresholds.filter(apt => apt.assetParamId !== assetParamId);
    this.assetParameterThresholdsSubject.next([...this.mockAssetParameterThresholds]);
  }

  // Complex query methods
  getAssetInspectionPointConfiguration(assetId: string, pointId: string): Observable<AssetInspectionPointConfig | null> {
    return new Observable(subscriber => {
      const assetPoint = this.mockAssetInspectionPoints.find(ap => ap.assetId === assetId && ap.pointId === pointId);
      if (!assetPoint) {
        subscriber.next(null);
        subscriber.complete();
        return;
      }

      const paramThresholds = this.mockAssetParameterThresholds.filter(apt => apt.assetPointId === assetPoint.assetPointId);
      
      const config: AssetInspectionPointConfig = {
        assetId: assetPoint.assetId,
        assetCode: 'ASSET-' + assetPoint.assetId.substring(6),
        assetType: 'STS',
        pointId: assetPoint.pointId,
        pointDescription: 'Inspection Point ' + assetPoint.pointId,
        inspectionMethod: 'Visual',
        priority: assetPoint.priority,
        sequence: assetPoint.sequence,
        parameterThresholds: paramThresholds.map(pt => {
          const indicator = this.mockParameterIndicators.find(ind => ind.indicatorId === pt.indicatorId);
          const threshold = this.mockThresholdRequirements.find(tr => tr.thresholdId === pt.thresholdId);
          
          return {
            indicatorId: indicator?.indicatorId || '',
            indicatorName: indicator?.indicatorName || '',
            indicatorType: indicator?.indicatorType || '',
            unit: indicator?.unit || '',
            minimumValue: threshold?.minimumValue,
            maximumValue: threshold?.maximumValue,
            warningMin: threshold?.warningMin,
            warningMax: threshold?.warningMax,
            criticalMin: threshold?.criticalMin,
            criticalMax: threshold?.criticalMax
          };
        })
      };

      subscriber.next(config);
      subscriber.complete();
    });
  }

  // Get all inspection points for an asset with their parameter thresholds
  getAssetInspectionConfiguration(assetId: string): Observable<AssetInspectionPointConfig[]> {
    return new Observable(subscriber => {
      const assetPoints = this.mockAssetInspectionPoints.filter(ap => ap.assetId === assetId);
      const configs: AssetInspectionPointConfig[] = assetPoints.map(assetPoint => {
        const paramThresholds = this.mockAssetParameterThresholds.filter(apt => apt.assetPointId === assetPoint.assetPointId);
        
        return {
          assetId: assetPoint.assetId,
          assetCode: 'ASSET-' + assetPoint.assetId.substring(6),
          assetType: 'STS',
          pointId: assetPoint.pointId,
          pointDescription: 'Inspection Point ' + assetPoint.pointId,
          inspectionMethod: 'Visual',
          priority: assetPoint.priority,
          sequence: assetPoint.sequence,
          parameterThresholds: paramThresholds.map(pt => {
            const indicator = this.mockParameterIndicators.find(ind => ind.indicatorId === pt.indicatorId);
            const threshold = this.mockThresholdRequirements.find(tr => tr.thresholdId === pt.thresholdId);
            
            return {
              indicatorId: indicator?.indicatorId || '',
              indicatorName: indicator?.indicatorName || '',
              indicatorType: indicator?.indicatorType || '',
              unit: indicator?.unit || '',
              minimumValue: threshold?.minimumValue,
              maximumValue: threshold?.maximumValue,
              warningMin: threshold?.warningMin,
              warningMax: threshold?.warningMax,
              criticalMin: threshold?.criticalMin,
              criticalMax: threshold?.criticalMax
            };
          })
        };
      });

      subscriber.next(configs);
      subscriber.complete();
    });
  }
}
