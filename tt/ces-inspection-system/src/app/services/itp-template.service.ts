import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITPTemplate, InspectionPoint, ControlPoint } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ITPTemplateService {
  private templates: ITPTemplate[] = [];
  private templatesSubject = new BehaviorSubject<ITPTemplate[]>([]);
  public templates$ = this.templatesSubject.asObservable();
  private points: InspectionPoint[] = [];
  private pointsSubject = new BehaviorSubject<InspectionPoint[]>([]);
  public points$ = this.pointsSubject.asObservable();

  private controlPoints: ControlPoint[] = [];
  private controlPointsSubject = new BehaviorSubject<ControlPoint[]>([]);
  public controlPoints$ = this.controlPointsSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.templates = [
      {
        templateId: 'tpl-001',
        templateCode: 'ITP-STS-MECH-ANN',
        title: 'Annual Mechanical Inspection for STS',
        revisionNo: 2,
        applicableAssetType: 'STS',
        standardReference: 'ASME B30.2',
        approvedBy: 'user-001',
        createdAt: new Date('2023-01-10'),
        isActive: true,
        description: 'Annual mechanical inspection template for Straddle Carrier Units'
      },
      {
        templateId: 'tpl-002',
        templateCode: 'ITP-RTG-ELEC-SEMI',
        title: 'Semi-Annual Electrical Inspection for RTG',
        revisionNo: 1,
        applicableAssetType: 'RTG',
        standardReference: 'ISO 4309',
        approvedBy: 'user-001',
        createdAt: new Date('2023-02-15'),
        isActive: true,
        description: 'Semi-annual electrical inspection for Rubber Tyred Gantries'
      }
    ];    this.points = [
      {
        pointId: 'pt-001',
        templateId: 'tpl-001',
        sequenceOrder: 1,
        pointDescription: 'Visual inspection of brake system',
        componentCategory: 'Mechanical',
        inspectionMethod: 'Visual',
        isMandatory: true,
        pointThreshold: 'Brake pad thickness: Minimum 5mm thickness required',
        applicableToComponent: false,
        applicableToAsset: true
      },
      {
        pointId: 'pt-002',
        templateId: 'tpl-001',
        sequenceOrder: 2,
        pointDescription: 'Ultrasonic measurement of chain wear',
        componentCategory: 'Mechanical',
        inspectionMethod: 'Ultrasonic',
        isMandatory: true,
        pointThreshold: 'Chain elongation: Less than 2% elongation allowed',
        applicableToComponent: true,
        applicableToAsset: true
      },
      {
        pointId: 'pt-003',
        templateId: 'tpl-002',
        sequenceOrder: 1,
        pointDescription: 'Electrical safety test',
        componentCategory: 'Electrical',
        inspectionMethod: 'Functional Test',
        isMandatory: true,
        pointThreshold: 'Insulation resistance: Minimum 1 MΩ at 500V DC',
        applicableToComponent: true,
        applicableToAsset: true
      },
      {
        pointId: 'pt-004',
        templateId: 'tpl-002',
        sequenceOrder: 2,
        pointDescription: 'Motor bearing vibration analysis',
        componentCategory: 'Electrical',
        inspectionMethod: 'Ultrasonic',
        isMandatory: false,
        pointThreshold: 'Vibration: Less than 7.1 mm/s',
        applicableToComponent: true,
        applicableToAsset: false
      },
      {
        pointId: 'pt-005',
        templateId: 'tpl-001',
        sequenceOrder: 3,
        pointDescription: 'Hydraulic pump pressure test',
        componentCategory: 'Hydraulic',
        inspectionMethod: 'Functional Test',
        isMandatory: true,
        pointThreshold: 'Pressure: 1-250 bar',
        applicableToComponent: true,
        applicableToAsset: false
      }
    ];this.controlPoints = [
      {
        controlId: 'cp-001',
        pointId: 'pt-001',
        pointType: 'H',
        description: 'Brake pad thickness',
        criteria: 'Minimum 5mm thickness required',
        frequencyDays: 365
      },
      {
        controlId: 'cp-002',
        pointId: 'pt-002',
        pointType: 'W',
        description: 'Chain elongation',
        criteria: 'Less than 2% elongation',
        frequencyDays: 365
      }
    ];    this.templatesSubject.next(this.templates);
    this.pointsSubject.next(this.points);
    this.controlPointsSubject.next(this.controlPoints);
  }

  // Template Methods
  getTemplates(): Observable<ITPTemplate[]> {
    return this.templates$;
  }

  getTemplateById(id: string): ITPTemplate | undefined {
    return this.templates.find(t => t.templateId === id);
  }

  addTemplate(template: ITPTemplate): void {
    this.templates.push(template);
    this.templatesSubject.next([...this.templates]);
  }

  updateTemplate(template: ITPTemplate): void {
    const index = this.templates.findIndex(t => t.templateId === template.templateId);
    if (index !== -1) {
      this.templates[index] = template;
      this.templatesSubject.next([...this.templates]);
    }
  }

  deleteTemplate(id: string): void {
    this.templates = this.templates.filter(t => t.templateId !== id);
    this.templatesSubject.next([...this.templates]);
  }
  // Inspection Point Methods
  getPointsByTemplate(templateId: string): InspectionPoint[] {
    return this.points.filter(p => p.templateId === templateId);
  }

  getPoints(): Observable<InspectionPoint[]> {
    return this.points$;
  }

  getPointById(id: string): InspectionPoint | undefined {
    return this.points.find(p => p.pointId === id);
  }

  addPoint(point: InspectionPoint): void {
    this.points.push(point);
    this.pointsSubject.next([...this.points]);
  }

  updatePoint(point: InspectionPoint): void {
    const index = this.points.findIndex(p => p.pointId === point.pointId);
    if (index !== -1) {
      this.points[index] = point;
      this.pointsSubject.next([...this.points]);
    }
  }

  deletePoint(id: string): void {
    this.points = this.points.filter(p => p.pointId !== id);
    this.pointsSubject.next([...this.points]);
  }

  // Control Point Methods
  getControlPointsByPoint(pointId: string): ControlPoint[] {
    return this.controlPoints.filter(cp => cp.pointId === pointId);
  }

  getControlPoints(): Observable<ControlPoint[]> {
    return this.controlPoints$;
  }

  getControlPointById(id: string): ControlPoint | undefined {
    return this.controlPoints.find(cp => cp.controlId === id);
  }

  addControlPoint(controlPoint: ControlPoint): void {
    this.controlPoints.push(controlPoint);
    this.controlPointsSubject.next([...this.controlPoints]);
  }

  updateControlPoint(controlPoint: ControlPoint): void {
    const index = this.controlPoints.findIndex(cp => cp.controlId === controlPoint.controlId);
    if (index !== -1) {
      this.controlPoints[index] = controlPoint;
      this.controlPointsSubject.next([...this.controlPoints]);
    }
  }

  deleteControlPoint(id: string): void {
    this.controlPoints = this.controlPoints.filter(cp => cp.controlId !== id);
    this.controlPointsSubject.next([...this.controlPoints]);
  }
}
