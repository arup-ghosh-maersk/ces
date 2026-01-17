import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComponentMaster } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ComponentMasterService {
  private components: ComponentMaster[] = [];
  private componentsSubject = new BehaviorSubject<ComponentMaster[]>([]);
  public components$ = this.componentsSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.components = [      {
        componentId: 'comp-001',
        componentCode: 'BOOM-STS-001',
        componentName: 'Boom Assembly',
        assetId: 'asset-001',
        assetType: 'STS',
        category: 'Structural',
        description: 'Main boom structural assembly for Straddle Transfer Stacker',
        manufacturer: 'Kalmar Industries',
        modelNumber: 'KLM-2500',
        warrantyExpiry: new Date('2025-06-01'),
        criticality: 'Critical',
        specifications: 'Length: 35m, Material: High-strength steel, Max load: 45 tonnes',
        maintenanceIntervalDays: 90,
        lastMaintenanceDate: new Date('2024-10-15'),
        nextMaintenanceDate: new Date('2025-01-15'),
        createdAt: new Date('2024-01-01'),
        isActive: true,
        diagramUrl: 'https://via.placeholder.com/400x300?text=Boom+Assembly+Drawing'
      },      {
        componentId: 'comp-002',
        componentCode: 'MOTOR-STS-001',
        componentName: 'Main Drive Motor',
        assetId: 'asset-001',
        assetType: 'STS',
        category: 'Electrical',
        description: 'Primary electric motor for horizontal movement',
        manufacturer: 'Siemens',
        modelNumber: 'S7-1200',
        serialNumber: 'SN-2024-001',
        warrantyExpiry: new Date('2025-08-01'),
        criticality: 'Critical',
        specifications: '75kW, 415V 3-phase, 1500 RPM',
        maintenanceIntervalDays: 180,
        lastMaintenanceDate: new Date('2024-09-01'),
        nextMaintenanceDate: new Date('2025-03-01'),
        createdAt: new Date('2024-01-05'),
        isActive: true,
        diagramUrl: 'https://via.placeholder.com/400x300?text=Drive+Motor+Drawing'
      },
      {
        componentId: 'comp-002a',
        componentCode: 'CONTROL-STS-001',
        componentName: 'Motor Control System',
        assetId: 'asset-001',
        assetType: 'STS',
        category: 'Electrical',
        description: 'PLC and control system for boom assembly',
        manufacturer: 'Siemens',
        modelNumber: 'S7-1200F',
        parentComponentId: 'comp-001',
        criticality: 'High',
        specifications: 'CPU module with digital I/O, 24V DC',
        maintenanceIntervalDays: 365,
        lastMaintenanceDate: new Date('2024-10-01'),
        nextMaintenanceDate: new Date('2025-10-01'),
        createdAt: new Date('2024-01-10'),
        isActive: true,
        diagramUrl: 'https://via.placeholder.com/400x300?text=Control+System+Drawing'
      },
      {
        componentId: 'comp-002b',
        componentCode: 'SENSOR-STS-001',
        componentName: 'Boom Position Sensor',
        assetId: 'asset-001',
        assetType: 'STS',
        category: 'Electrical',
        description: 'LVDT sensor for boom angle feedback',
        manufacturer: 'Temposonics',
        modelNumber: 'TLE-0050',
        parentComponentId: 'comp-001',
        criticality: 'High',
        specifications: 'Range: 0-5V analog output, ±5% linearity',
        maintenanceIntervalDays: 180,
        lastMaintenanceDate: new Date('2024-09-15'),
        nextMaintenanceDate: new Date('2025-03-15'),
        createdAt: new Date('2024-01-12'),
        isActive: true,
        diagramUrl: 'https://via.placeholder.com/400x300?text=Position+Sensor+Drawing'
      },{
        componentId: 'comp-003',
        componentCode: 'PUMP-RTG-001',
        componentName: 'Hydraulic Pump System',
        assetId: 'asset-002',
        assetType: 'RTG',
        category: 'Hydraulic',
        description: 'Main hydraulic pump for spreader bar actuation',
        manufacturer: 'Eaton Hydraulics',
        modelNumber: 'PVH57',
        criticality: 'Critical',
        specifications: 'Displacement: 57cc/rev, Max pressure: 350 bar',
        maintenanceIntervalDays: 120,
        lastMaintenanceDate: new Date('2024-08-20'),
        nextMaintenanceDate: new Date('2024-12-20'),
        createdAt: new Date('2024-02-01'),
        isActive: true,
        diagramUrl: 'https://via.placeholder.com/400x300?text=Hydraulic+Pump+Drawing'
      },      {
        componentId: 'comp-004',
        componentCode: 'PISTON-HYD-001',
        componentName: 'Pump Piston Assembly',
        assetId: 'asset-002',
        assetType: 'RTG',
        category: 'Hydraulic',
        description: 'Piston and cylinder assembly for hydraulic pump',
        manufacturer: 'Bosch Rexroth',
        modelNumber: 'A4VSO-040',
        criticality: 'High',
        parentComponentId: 'comp-003',
        specifications: 'Bore: 40mm, Stroke: 25mm, Displacement: 40cc/rev',
        maintenanceIntervalDays: 120,
        lastMaintenanceDate: new Date('2024-09-15'),
        nextMaintenanceDate: new Date('2024-12-15'),
        createdAt: new Date('2024-02-10'),
        isActive: true,
        diagramUrl: 'https://via.placeholder.com/400x300?text=Piston+Assembly+Drawing'
      },      {
        componentId: 'comp-005',
        componentCode: 'SEAL-HYD-001',
        componentName: 'Pump Seal Kit',
        assetId: 'asset-002',
        assetType: 'RTG',
        category: 'Hydraulic',
        description: 'Complete seal kit for hydraulic pump',
        manufacturer: 'SKF Seals',
        modelNumber: 'SKF-2500',
        criticality: 'High',
        parentComponentId: 'comp-003',
        specifications: 'Viton seals, Size range: 40-60mm',
        maintenanceIntervalDays: 180,
        lastMaintenanceDate: new Date('2024-08-01'),
        nextMaintenanceDate: new Date('2025-02-01'),
        createdAt: new Date('2024-02-15'),
        isActive: true,
        diagramUrl: 'https://via.placeholder.com/400x300?text=Seal+Kit+Drawing'
      },      {
        componentId: 'comp-006',
        componentCode: 'WHEEL-RTG-001',
        componentName: 'Main Bogie Wheel Assembly',
        assetId: 'asset-002',
        assetType: 'RTG',
        category: 'Mechanical',
        description: 'Complete bogie wheel assembly with bearing and hub',
        manufacturer: 'FAG Bearings',
        modelNumber: 'FAG-6309',
        criticality: 'High',
        specifications: 'Diameter: 900mm, Rubber compound: NR80',
        maintenanceIntervalDays: 60,
        lastMaintenanceDate: new Date('2024-11-01'),
        nextMaintenanceDate: new Date('2024-12-31'),
        createdAt: new Date('2024-03-01'),
        isActive: true,
        diagramUrl: 'https://via.placeholder.com/400x300?text=Bogie+Wheel+Drawing'
      },      {
        componentId: 'comp-007',
        componentCode: 'BEARING-RTG-001',
        componentName: 'Wheel Hub Bearing',
        assetId: 'asset-002',
        assetType: 'RTG',
        category: 'Mechanical',
        description: 'Double row spherical roller bearing for wheel hub',
        manufacturer: 'SKF',
        modelNumber: 'SKF-22209',
        criticality: 'High',
        parentComponentId: 'comp-006',
        specifications: 'Bore: 45mm, Outer: 85mm, Width: 28mm',
        maintenanceIntervalDays: 120,
        lastMaintenanceDate: new Date('2024-10-15'),
        nextMaintenanceDate: new Date('2025-01-15'),
        createdAt: new Date('2024-03-05'),
        isActive: true,
        diagramUrl: 'https://via.placeholder.com/400x300?text=Bearing+Drawing'
      },      {
        componentId: 'comp-008',
        componentCode: 'TYRE-RTG-001',
        componentName: 'Wheel Tyre',
        assetId: 'asset-002',
        assetType: 'RTG',
        category: 'Mechanical',
        description: 'Industrial rubber tyre for RTG bogie wheel',
        manufacturer: 'Pirelli',
        modelNumber: 'P4500',
        criticality: 'Medium',
        parentComponentId: 'comp-006',
        specifications: 'Size: 900x240, Tread depth: 12mm, Load index: 180',
        maintenanceIntervalDays: 180,
        lastMaintenanceDate: new Date('2024-11-01'),
        nextMaintenanceDate: new Date('2025-05-01'),
        createdAt: new Date('2024-03-10'),
        isActive: true,
        diagramUrl: 'https://via.placeholder.com/400x300?text=Tyre+Drawing'
      },
      {
        componentId: 'comp-009',
        componentCode: 'PLC-RTG-001',
        componentName: 'Programmable Logic Controller',
        assetId: 'asset-002',
        assetType: 'RTG',
        category: 'Software',
        description: 'Main control PLC for RTG equipment automation',
        manufacturer: 'Siemens',
        modelNumber: 'S7-1200F',
        serialNumber: 'SN-2024-RTG-001',
        warrantyExpiry: new Date('2025-12-01'),
        criticality: 'Critical',
        specifications: 'CPU: S7-1200F, Memory: 75KB',
        maintenanceIntervalDays: 365,
        lastMaintenanceDate: new Date('2024-01-15'),
        nextMaintenanceDate: new Date('2025-01-15'),
        createdAt: new Date('2024-04-01'),
        isActive: true,
        diagramUrl: 'https://via.placeholder.com/400x300?text=PLC+Drawing'
      },
      {
        componentId: 'comp-010',
        componentCode: 'CABLE-CTRL-001',
        componentName: 'Control Cable Harness',
        assetId: 'asset-002',
        assetType: 'RTG',
        category: 'Electrical',
        description: 'Main control signal cable harness',
        manufacturer: 'Lapp Kabel',
        modelNumber: 'OLFLEX-CLASSIC',
        criticality: 'Medium',
        parentComponentId: 'comp-009',
        specifications: '5-core shielded, AWG 2.5, Length: 100m',
        maintenanceIntervalDays: 365,
        lastMaintenanceDate: new Date('2024-06-01'),
        nextMaintenanceDate: new Date('2025-06-01'),
        createdAt: new Date('2024-04-05'),
        isActive: true,
        diagramUrl: 'https://via.placeholder.com/400x300?text=Cable+Harness+Drawing'
      }
    ];
    this.componentsSubject.next(this.components);
  }

  getComponents(): Observable<ComponentMaster[]> {
    return this.componentsSubject.asObservable();
  }

  getComponentById(id: string): ComponentMaster | undefined {
    return this.components.find(c => c.componentId === id);
  }

  getComponentsByAssetType(assetType: string): Observable<ComponentMaster[]> {
    const filtered = this.components.filter(c => c.assetType === assetType);
    return new BehaviorSubject<ComponentMaster[]>(filtered).asObservable();
  }

  getComponentsByCategory(category: string): Observable<ComponentMaster[]> {
    const filtered = this.components.filter(c => c.category === category);
    return new BehaviorSubject<ComponentMaster[]>(filtered).asObservable();
  }

  getComponentsByCriticality(criticality: string): Observable<ComponentMaster[]> {
    const filtered = this.components.filter(c => c.criticality === criticality);
    return new BehaviorSubject<ComponentMaster[]>(filtered).asObservable();
  }

  getSubcomponents(parentComponentId: string): Observable<ComponentMaster[]> {
    const filtered = this.components.filter(c => c.parentComponentId === parentComponentId);
    return new BehaviorSubject<ComponentMaster[]>(filtered).asObservable();
  }

  addComponent(component: ComponentMaster): void {
    this.components.push(component);
    this.componentsSubject.next([...this.components]);
  }

  updateComponent(component: ComponentMaster): void {
    const index = this.components.findIndex(c => c.componentId === component.componentId);
    if (index !== -1) {
      this.components[index] = { ...component, updatedAt: new Date() };
      this.componentsSubject.next([...this.components]);
    }
  }

  deleteComponent(id: string): void {
    this.components = this.components.filter(c => c.componentId !== id);
    this.componentsSubject.next([...this.components]);
  }

  toggleComponentStatus(id: string): void {
    const component = this.getComponentById(id);
    if (component) {
      component.isActive = !component.isActive;
      this.updateComponent(component);
    }
  }

  getComponentsByAsset(assetId: string): Observable<ComponentMaster[]> {
    const filtered = this.components.filter(c => c.assetId === assetId);
    return new BehaviorSubject<ComponentMaster[]>(filtered).asObservable();
  }
}
