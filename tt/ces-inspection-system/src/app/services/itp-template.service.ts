import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITPTemplate, InspectionTask, ControlPoint } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ITPTemplateService {
  private templates: ITPTemplate[] = [];
  private templatesSubject = new BehaviorSubject<ITPTemplate[]>([]);
  public templates$ = this.templatesSubject.asObservable();

  private tasks: InspectionTask[] = [];
  private tasksSubject = new BehaviorSubject<InspectionTask[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

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
    ];

    this.tasks = [
      {
        taskId: 'tsk-001',
        templateId: 'tpl-001',
        sequenceOrder: 1,
        taskDescription: 'Visual inspection of brake system',
        componentCategory: 'Mechanical',
        inspectionMethod: 'Visual',
        isMandatory: true,
        taskThreshold: 'Brake pad thickness: Minimum 5mm thickness required'
      },
      {
        taskId: 'tsk-002',
        templateId: 'tpl-001',
        sequenceOrder: 2,
        taskDescription: 'Ultrasonic measurement of chain wear',
        componentCategory: 'Mechanical',
        inspectionMethod: 'Ultrasonic',
        isMandatory: true,
        taskThreshold: 'Chain elongation: Less than 2% elongation allowed'
      },
      {
        taskId: 'tsk-003',
        templateId: 'tpl-002',
        sequenceOrder: 1,
        taskDescription: 'Electrical safety test',
        componentCategory: 'Electrical',
        inspectionMethod: 'Functional Test',
        isMandatory: true,
        taskThreshold: 'Insulation resistance: Minimum 1 MΩ at 500V DC'
      }
    ];

    this.controlPoints = [
      {
        controlId: 'cp-001',
        taskId: 'tsk-001',
        pointType: 'H',
        description: 'Brake pad thickness',
        criteria: 'Minimum 5mm thickness required',
        frequencyDays: 365
      },
      {
        controlId: 'cp-002',
        taskId: 'tsk-002',
        pointType: 'W',
        description: 'Chain elongation',
        criteria: 'Less than 2% elongation',
        frequencyDays: 365
      }
    ];

    this.templatesSubject.next(this.templates);
    this.tasksSubject.next(this.tasks);
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

  // Task Methods
  getTasksByTemplate(templateId: string): InspectionTask[] {
    return this.tasks.filter(t => t.templateId === templateId);
  }

  getTasks(): Observable<InspectionTask[]> {
    return this.tasks$;
  }

  getTaskById(id: string): InspectionTask | undefined {
    return this.tasks.find(t => t.taskId === id);
  }

  addTask(task: InspectionTask): void {
    this.tasks.push(task);
    this.tasksSubject.next([...this.tasks]);
  }

  updateTask(task: InspectionTask): void {
    const index = this.tasks.findIndex(t => t.taskId === task.taskId);
    if (index !== -1) {
      this.tasks[index] = task;
      this.tasksSubject.next([...this.tasks]);
    }
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(t => t.taskId !== id);
    this.tasksSubject.next([...this.tasks]);
  }

  // Control Point Methods
  getControlPointsByTask(taskId: string): ControlPoint[] {
    return this.controlPoints.filter(cp => cp.taskId === taskId);
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
