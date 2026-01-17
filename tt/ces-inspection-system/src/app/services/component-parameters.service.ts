import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ComponentParameter,
  ComponentInspectionConfig,
  ParameterIndicator,
  ThresholdRequirement,
  InspectionPoint
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ComponentParametersService {  
  private componentParametersSubject = new BehaviorSubject<ComponentParameter[]>([]);
  private parameterIndicatorsSubject = new BehaviorSubject<ParameterIndicator[]>([]);
  private thresholdRequirementsSubject = new BehaviorSubject<ThresholdRequirement[]>([]);
  private inspectionPointsSubject = new BehaviorSubject<InspectionPoint[]>([]);

  // Mock data
  private mockComponentParameters: ComponentParameter[] = [
    {
      componentParamId: 'cp-001',
      componentId: 'COMP-MOTOR-001',
      pointId: 'POINT-001',
      indicatorId: 'IND-001',
      thresholdId: 'TH-001',
      sequence: 1,
      isRequired: true,
      isActive: true,
      notes: 'Check motor operating temperature',
      createdAt: new Date()
    },
    {
      componentParamId: 'cp-002',
      componentId: 'COMP-MOTOR-001',
      pointId: 'POINT-001',
      indicatorId: 'IND-002',
      thresholdId: 'TH-002',
      sequence: 2,
      isRequired: true,
      isActive: true,
      notes: 'Monitor motor vibration levels',
      createdAt: new Date()
    },
    {
      componentParamId: 'cp-003',
      componentId: 'COMP-BEARING-001',
      pointId: 'POINT-002',
      indicatorId: 'IND-003',
      thresholdId: 'TH-003',
      sequence: 1,
      isRequired: true,
      isActive: true,
      notes: 'Measure bearing vibration',
      createdAt: new Date()
    },
    {
      componentParamId: 'cp-004',
      componentId: 'COMP-HYDRAULIC-001',
      pointId: 'POINT-003',
      indicatorId: 'IND-002',
      thresholdId: 'TH-002',
      sequence: 1,
      isRequired: true,
      isActive: true,
      notes: 'Check hydraulic system pressure',
      createdAt: new Date()
    }
  ];

  private mockParameterIndicators: ParameterIndicator[] = [
    {
      indicatorId: 'IND-001',
      indicatorName: 'Operating Temperature',
      indicatorType: 'Temperature',
      unit: '°C',
      description: 'Component operating temperature',
      isNumeric: true,
      createdAt: new Date()
    },
    {
      indicatorId: 'IND-002',
      indicatorName: 'System Pressure',
      indicatorType: 'Pressure',
      unit: 'bar',
      description: 'Hydraulic or pneumatic system pressure',
      isNumeric: true,
      createdAt: new Date()
    },
    {
      indicatorId: 'IND-003',
      indicatorName: 'Vibration Level',
      indicatorType: 'Vibration',
      unit: 'mm/s',
      description: 'Component vibration measurement',
      isNumeric: true,
      createdAt: new Date()
    },
    {
      indicatorId: 'IND-004',
      indicatorName: 'Oil Leak Detection',
      indicatorType: 'Visual',
      unit: 'Status',
      description: 'Visual inspection for leaks',
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
      description: 'Pressure limits for system operation',
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

  private mockInspectionPoints: InspectionPoint[] = [
    {
      pointId: 'POINT-001',
      templateId: 'TEMPLATE-001',
      componentId: 'COMP-MOTOR-001',
      sequenceOrder: 1,
      pointDescription: 'Motor Temperature Check',
      componentCategory: 'Mechanical',
      inspectionMethod: 'Visual',
      isMandatory: true,
      pointThreshold: '20-85°C',
      applicableToComponent: true,
      applicableToAsset: true
    },
    {
      pointId: 'POINT-002',
      templateId: 'TEMPLATE-001',
      componentId: 'COMP-BEARING-001',
      sequenceOrder: 2,
      pointDescription: 'Bearing Vibration Analysis',
      componentCategory: 'Mechanical',
      inspectionMethod: 'Ultrasonic',
      isMandatory: true,
      pointThreshold: '0-7.1 mm/s',
      applicableToComponent: true,
      applicableToAsset: true
    },
    {
      pointId: 'POINT-003',
      templateId: 'TEMPLATE-001',
      componentId: 'COMP-HYDRAULIC-001',
      sequenceOrder: 3,
      pointDescription: 'Hydraulic Pressure Verification',
      componentCategory: 'Hydraulic',
      inspectionMethod: 'Functional Test',
      isMandatory: true,
      pointThreshold: '1-250 bar',
      applicableToComponent: true,
      applicableToAsset: false
    },
    {
      pointId: 'POINT-004',
      templateId: 'TEMPLATE-002',
      componentId: 'COMP-ELECTRICAL-001',
      sequenceOrder: 1,
      pointDescription: 'Electrical Ground Resistance',
      componentCategory: 'Electrical',
      inspectionMethod: 'Functional Test',
      isMandatory: true,
      pointThreshold: '>1000000 Ω',
      applicableToComponent: true,
      applicableToAsset: true
    },    {
      pointId: 'POINT-005',
      templateId: 'TEMPLATE-002',
      componentId: undefined,
      sequenceOrder: 5,
      pointDescription: 'Overall Asset Visual Inspection',
      componentCategory: 'Structural',
      inspectionMethod: 'Visual',
      isMandatory: true,
      pointThreshold: 'No visible defects',
      applicableToComponent: false,
      applicableToAsset: true
    }
  ];

  constructor() {
    this.initializeMockData();
  }
  private initializeMockData(): void {
    this.componentParametersSubject.next(this.mockComponentParameters);
    this.parameterIndicatorsSubject.next(this.mockParameterIndicators);
    this.thresholdRequirementsSubject.next(this.mockThresholdRequirements);
    this.inspectionPointsSubject.next(this.mockInspectionPoints);
  }

  // Component Parameter Methods
  getComponentParameters(): Observable<ComponentParameter[]> {
    return this.componentParametersSubject.asObservable();
  }

  getComponentParametersByComponent(componentId: string): Observable<ComponentParameter[]> {
    return new Observable(subscriber => {
      const filtered = this.mockComponentParameters.filter(cp => cp.componentId === componentId);
      subscriber.next(filtered);
      subscriber.complete();
    });
  }

  getComponentParametersByPoint(pointId: string): Observable<ComponentParameter[]> {
    return new Observable(subscriber => {
      const filtered = this.mockComponentParameters.filter(cp => cp.pointId === pointId);
      subscriber.next(filtered);
      subscriber.complete();
    });
  }

  addComponentParameter(parameter: ComponentParameter): void {
    this.mockComponentParameters.push(parameter);
    this.componentParametersSubject.next([...this.mockComponentParameters]);
  }

  updateComponentParameter(componentParamId: string, updates: Partial<ComponentParameter>): void {
    const index = this.mockComponentParameters.findIndex(cp => cp.componentParamId === componentParamId);
    if (index > -1) {
      this.mockComponentParameters[index] = { ...this.mockComponentParameters[index], ...updates };
      this.componentParametersSubject.next([...this.mockComponentParameters]);
    }
  }
  deleteComponentParameter(componentParamId: string): void {
    this.mockComponentParameters = this.mockComponentParameters.filter(cp => cp.componentParamId !== componentParamId);
    this.componentParametersSubject.next([...this.mockComponentParameters]);
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
  // Component Inspection Configuration Methods
  
  getComponentInspectionConfiguration(componentId: string, pointId: string): Observable<ComponentInspectionConfig | null> {
    return new Observable(subscriber => {
      const parameters = this.mockComponentParameters.filter(cp => cp.componentId === componentId && cp.pointId === pointId);
      
      if (parameters.length === 0) {
        subscriber.next(null);
        subscriber.complete();
        return;
      }

      // Create config from parameters
      const firstParam = parameters[0];
      
      const config: ComponentInspectionConfig = {
        componentId: firstParam.componentId,
        componentName: 'Component ' + firstParam.componentId.substring(5),
        componentCode: firstParam.componentId,
        category: 'Mechanical',
        pointId: firstParam.pointId,
        pointDescription: 'Inspection Point ' + firstParam.pointId,
        inspectionMethod: 'Visual',
        isMandatory: firstParam.isRequired,
        sequence: firstParam.sequence,
        parameterThresholds: parameters.map(param => {
          const indicator = this.mockParameterIndicators.find(ind => ind.indicatorId === param.indicatorId);
          const threshold = this.mockThresholdRequirements.find(tr => tr.thresholdId === param.thresholdId);
          
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

  // Get all inspection configurations for a component
  getComponentInspectionConfigurations(componentId: string): Observable<ComponentInspectionConfig[]> {
    return new Observable(subscriber => {
      const componentParams = this.mockComponentParameters.filter(cp => cp.componentId === componentId);
      const configs: ComponentInspectionConfig[] = [];

      componentParams.forEach(param => {
        const indicator = this.mockParameterIndicators.find(ind => ind.indicatorId === param.indicatorId);
        const threshold = this.mockThresholdRequirements.find(tr => tr.thresholdId === param.thresholdId);
        
        const config: ComponentInspectionConfig = {
          componentId: param.componentId,
          componentName: 'Component ' + param.componentId.substring(5),
          componentCode: param.componentId,
          category: 'Mechanical',
          pointId: param.pointId,
          pointDescription: 'Inspection Point ' + param.pointId,
          inspectionMethod: 'Visual',
          isMandatory: param.isRequired,
          sequence: param.sequence,
          parameterThresholds: [{
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
          }]
        };
        
        configs.push(config);
      });

      subscriber.next(configs);
      subscriber.complete();
    });
  }

  // Inspection Point Methods
  getInspectionPoints(): Observable<InspectionPoint[]> {
    return this.inspectionPointsSubject.asObservable();
  }

  getInspectionPointsByComponent(componentId: string): Observable<InspectionPoint[]> {
    return new Observable(subscriber => {
      const filtered = this.mockInspectionPoints.filter(ip => ip.componentId === componentId);
      subscriber.next(filtered);
      subscriber.complete();
    });
  }

  getInspectionPointsByTemplate(templateId: string): Observable<InspectionPoint[]> {
    return new Observable(subscriber => {
      const filtered = this.mockInspectionPoints.filter(ip => ip.templateId === templateId);
      subscriber.next(filtered);
      subscriber.complete();
    });
  }

  getInspectionPointById(pointId: string): Observable<InspectionPoint | undefined> {
    return new Observable(subscriber => {
      const point = this.mockInspectionPoints.find(ip => ip.pointId === pointId);
      subscriber.next(point);
      subscriber.complete();
    });
  }

  addInspectionPoint(point: InspectionPoint): void {
    this.mockInspectionPoints.push(point);
    this.inspectionPointsSubject.next([...this.mockInspectionPoints]);
  }

  updateInspectionPoint(pointId: string, updates: Partial<InspectionPoint>): void {
    const index = this.mockInspectionPoints.findIndex(ip => ip.pointId === pointId);
    if (index > -1) {
      this.mockInspectionPoints[index] = { ...this.mockInspectionPoints[index], ...updates };
      this.inspectionPointsSubject.next([...this.mockInspectionPoints]);
    }
  }

  deleteInspectionPoint(pointId: string): void {
    this.mockInspectionPoints = this.mockInspectionPoints.filter(ip => ip.pointId !== pointId);
    this.inspectionPointsSubject.next([...this.mockInspectionPoints]);
  }
}
