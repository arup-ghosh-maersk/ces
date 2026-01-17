import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ComponentInspectionPoint,
  ComponentHierarchy,
  ComponentPointCoverage,
  InspectionPoint,
  ComponentMaster
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ComponentInspectionPointsService {
  private componentInspectionPoints: ComponentInspectionPoint[] = [];
  private componentInspectionPointsSubject = new BehaviorSubject<ComponentInspectionPoint[]>([]);
  public componentInspectionPoints$ = this.componentInspectionPointsSubject.asObservable();

  private componentHierarchies: ComponentHierarchy[] = [];
  private hierarchiesSubject = new BehaviorSubject<ComponentHierarchy[]>([]);
  public hierarchies$ = this.hierarchiesSubject.asObservable();

  private coverageMetrics: ComponentPointCoverage[] = [];
  private coverageSubject = new BehaviorSubject<ComponentPointCoverage[]>([]);
  public coverage$ = this.coverageSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Example component hierarchies
    this.componentHierarchies = [
      {
        hierarchyId: 'hier-001',
        parentComponentId: 'comp-001', // Brake System
        childComponentId: 'comp-001-01', // Brake Pads
        relationshipType: 'SubAssembly',
        sequence: 1,
        isActive: true
      },
      {
        hierarchyId: 'hier-002',
        parentComponentId: 'comp-001', // Brake System
        childComponentId: 'comp-001-02', // Brake Disc
        relationshipType: 'SubAssembly',
        sequence: 2,
        isActive: true
      },
      {
        hierarchyId: 'hier-003',
        parentComponentId: 'comp-002', // Chain System
        childComponentId: 'comp-002-01', // Chain Links
        relationshipType: 'SubAssembly',
        sequence: 1,
        isActive: true
      },
      {
        hierarchyId: 'hier-004',
        parentComponentId: 'comp-002', // Chain System
        childComponentId: 'comp-002-02', // Sprockets
        relationshipType: 'SubAssembly',
        sequence: 2,
        isActive: true
      }
    ];

    // Example component-to-inspection-point mappings
    this.componentInspectionPoints = [
      {
        mappingId: 'map-001',
        pointId: 'pt-001', // Visual inspection of brake system
        componentId: 'comp-001', // Brake System
        subComponentId: 'comp-001-01', // Brake Pads
        applicableToComponent: true,
        applicableToSubComponent: true,
        inspectionSequence: 1,
        priority: 'Critical',
        createdAt: new Date('2024-01-10')
      },
      {
        mappingId: 'map-002',
        pointId: 'pt-001', // Visual inspection of brake system
        componentId: 'comp-001', // Brake System
        subComponentId: 'comp-001-02', // Brake Disc
        applicableToComponent: true,
        applicableToSubComponent: true,
        inspectionSequence: 2,
        priority: 'High',
        createdAt: new Date('2024-01-10')
      },
      {
        mappingId: 'map-003',
        pointId: 'pt-002', // Ultrasonic measurement of chain wear
        componentId: 'comp-002', // Chain System
        subComponentId: 'comp-002-01', // Chain Links
        applicableToComponent: true,
        applicableToSubComponent: true,
        inspectionSequence: 1,
        priority: 'Critical',
        createdAt: new Date('2024-01-10')
      },
      {
        mappingId: 'map-004',
        pointId: 'pt-002', // Ultrasonic measurement of chain wear
        componentId: 'comp-002', // Chain System
        subComponentId: 'comp-002-02', // Sprockets
        applicableToComponent: true,
        applicableToSubComponent: true,
        inspectionSequence: 2,
        priority: 'High',
        createdAt: new Date('2024-01-10')
      }
    ];

    // Coverage metrics
    this.coverageMetrics = [
      {
        coverageId: 'cov-001',
        componentId: 'comp-001',
        totalInspectionPoints: 3,
        mappedPoints: 1,
        coveragePercentage: 33.33,
        lastUpdated: new Date()
      },
      {
        coverageId: 'cov-002',
        componentId: 'comp-002',
        totalInspectionPoints: 3,
        mappedPoints: 1,
        coveragePercentage: 33.33,
        lastUpdated: new Date()
      }
    ];

    this.componentInspectionPointsSubject.next(this.componentInspectionPoints);
    this.hierarchiesSubject.next(this.componentHierarchies);
    this.coverageSubject.next(this.coverageMetrics);
  }

  // Component Inspection Point Methods
  getComponentInspectionPoints(): Observable<ComponentInspectionPoint[]> {
    return this.componentInspectionPoints$;
  }

  getPointsByComponent(componentId: string): ComponentInspectionPoint[] {
    return this.componentInspectionPoints.filter(
      cip => cip.componentId === componentId && cip.applicableToComponent
    );
  }

  getPointsBySubComponent(subComponentId: string): ComponentInspectionPoint[] {
    return this.componentInspectionPoints.filter(
      cip => cip.subComponentId === subComponentId && cip.applicableToSubComponent
    );
  }

  getPointsByComponentAndSubComponent(componentId: string, subComponentId: string): ComponentInspectionPoint[] {
    return this.componentInspectionPoints.filter(
      cip => cip.componentId === componentId && cip.subComponentId === subComponentId
    );
  }

  addComponentInspectionPoint(mapping: ComponentInspectionPoint): void {
    this.componentInspectionPoints.push(mapping);
    this.componentInspectionPointsSubject.next([...this.componentInspectionPoints]);
    this.updateCoverage(mapping.componentId);
  }

  updateComponentInspectionPoint(mapping: ComponentInspectionPoint): void {
    const index = this.componentInspectionPoints.findIndex(
      cip => cip.mappingId === mapping.mappingId
    );
    if (index !== -1) {
      this.componentInspectionPoints[index] = mapping;
      this.componentInspectionPointsSubject.next([...this.componentInspectionPoints]);
      this.updateCoverage(mapping.componentId);
    }
  }

  deleteComponentInspectionPoint(mappingId: string, componentId: string): void {
    this.componentInspectionPoints = this.componentInspectionPoints.filter(
      cip => cip.mappingId !== mappingId
    );
    this.componentInspectionPointsSubject.next([...this.componentInspectionPoints]);
    this.updateCoverage(componentId);
  }

  // Component Hierarchy Methods
  getComponentHierarchies(): Observable<ComponentHierarchy[]> {
    return this.hierarchies$;
  }

  getSubComponentsByParent(parentComponentId: string): ComponentHierarchy[] {
    return this.componentHierarchies.filter(
      h => h.parentComponentId === parentComponentId && h.isActive
    );
  }

  getParentComponents(childComponentId: string): ComponentHierarchy[] {
    return this.componentHierarchies.filter(
      h => h.childComponentId === childComponentId && h.isActive
    );
  }

  addComponentHierarchy(hierarchy: ComponentHierarchy): void {
    this.componentHierarchies.push(hierarchy);
    this.hierarchiesSubject.next([...this.componentHierarchies]);
  }

  updateComponentHierarchy(hierarchy: ComponentHierarchy): void {
    const index = this.componentHierarchies.findIndex(
      h => h.hierarchyId === hierarchy.hierarchyId
    );
    if (index !== -1) {
      this.componentHierarchies[index] = hierarchy;
      this.hierarchiesSubject.next([...this.componentHierarchies]);
    }
  }

  deleteComponentHierarchy(hierarchyId: string): void {
    this.componentHierarchies = this.componentHierarchies.filter(
      h => h.hierarchyId !== hierarchyId
    );
    this.hierarchiesSubject.next([...this.componentHierarchies]);
  }

  // Coverage Methods
  getComponentPointCoverage(): Observable<ComponentPointCoverage[]> {
    return this.coverage$;
  }

  getCoverageByComponent(componentId: string): ComponentPointCoverage | undefined {
    return this.coverageMetrics.find(c => c.componentId === componentId);
  }

  private updateCoverage(componentId: string): void {
    const pointsForComponent = this.componentInspectionPoints.filter(
      cip => cip.componentId === componentId && cip.applicableToComponent
    );
    
    const coverageIndex = this.coverageMetrics.findIndex(
      c => c.componentId === componentId
    );

    if (coverageIndex !== -1) {
      const coverage = this.coverageMetrics[coverageIndex];
      coverage.mappedPoints = pointsForComponent.length;
      coverage.coveragePercentage = coverage.totalInspectionPoints > 0
        ? (coverage.mappedPoints / coverage.totalInspectionPoints) * 100
        : 0;
      coverage.lastUpdated = new Date();
      
      this.coverageMetrics[coverageIndex] = coverage;
      this.coverageSubject.next([...this.coverageMetrics]);
    }
  }

  // Get complete component structure with inspection points
  getComponentWithInspectionPoints(componentId: string): {
    component: any;
    points: ComponentInspectionPoint[];
    subComponents: { component: any; points: ComponentInspectionPoint[] }[];
  } {
    const points = this.getPointsByComponent(componentId);
    const subComponentHierarchies = this.getSubComponentsByParent(componentId);
    
    const subComponents = subComponentHierarchies.map(h => ({
      component: { componentId: h.childComponentId },
      points: this.getPointsBySubComponent(h.childComponentId)
    }));

    return {
      component: { componentId },
      points,
      subComponents
    };
  }

  // Get inspection points applicable at different hierarchy levels
  getInspectionPointHierarchy(componentId: string): {
    componentLevel: ComponentInspectionPoint[];
    subComponentLevel: { [key: string]: ComponentInspectionPoint[] };
  } {
    const componentLevel = this.getPointsByComponent(componentId);
    const subComponentHierarchies = this.getSubComponentsByParent(componentId);
    
    const subComponentLevel: { [key: string]: ComponentInspectionPoint[] } = {};
    
    subComponentHierarchies.forEach(h => {
      subComponentLevel[h.childComponentId] = this.getPointsBySubComponent(h.childComponentId);
    });

    return {
      componentLevel,
      subComponentLevel
    };
  }
}
