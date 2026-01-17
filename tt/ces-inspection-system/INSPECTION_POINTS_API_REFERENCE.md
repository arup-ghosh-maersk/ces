# Inspection Points API Reference Guide

## Quick Overview

The CES Inspection System now uses "Inspection Points" terminology throughout. This guide provides quick reference for developers working with the new API.

---

## Service API: ITPTemplateService

### Observable Streams

#### Get All Points
```typescript
// Returns Observable of all inspection points
this.itpService.getPoints(): Observable<InspectionPoint[]>

// Usage in component
this.itpService.getPoints().subscribe(points => {
  this.allPoints = points;
});
```

#### Points Observable
```typescript
// Subscribe to points$ for reactive updates
this.itpService.points$: Observable<InspectionPoint[]>

// Usage
this.itpService.points$.subscribe(points => {
  console.log('Points updated:', points);
});
```

---

### Query Methods

#### Get Points by Template
```typescript
getPointsByTemplate(templateId: string): InspectionPoint[]

// Example
const templatePoints = this.itpService.getPointsByTemplate('tpl-001');
```

#### Get Single Point
```typescript
getPointById(id: string): InspectionPoint | undefined

// Example
const point = this.itpService.getPointById('pt-001');
if (point) {
  console.log(point.pointDescription);
}
```

#### Get Control Points for an Inspection Point
```typescript
getControlPointsByPoint(pointId: string): ControlPoint[]

// Example
const controls = this.itpService.getControlPointsByPoint('pt-001');
```

---

### CRUD Operations

#### Create New Point
```typescript
addPoint(point: InspectionPoint): void

// Example
const newPoint: InspectionPoint = {
  pointId: 'pt-' + Date.now(),
  templateId: 'tpl-001',
  sequenceOrder: 3,
  pointDescription: 'Electrical continuity test',
  componentCategory: 'Electrical',
  inspectionMethod: 'Functional Test',
  isMandatory: true,
  pointThreshold: 'Resistance < 0.1 Ohm'
};

this.itpService.addPoint(newPoint);
```

#### Update Existing Point
```typescript
updatePoint(point: InspectionPoint): void

// Example
const updatedPoint = {
  ...existingPoint,
  pointThreshold: 'Resistance < 0.05 Ohm'
};

this.itpService.updatePoint(updatedPoint);
```

#### Delete Point
```typescript
deletePoint(id: string): void

// Example
this.itpService.deletePoint('pt-001');
```

---

## Data Models

### InspectionPoint Interface
```typescript
export interface InspectionPoint {
  pointId: string;                           // Unique identifier
  templateId: string;                        // Parent template
  sequenceOrder: number;                     // Display order
  pointDescription: string;                  // What to inspect
  componentCategory: string;                 // e.g., "Mechanical", "Electrical"
  inspectionMethod: 'Visual' 
                    | 'Ultrasonic' 
                    | 'Functional Test' 
                    | 'NDT';                // How to inspect
  isMandatory: boolean;                     // Required or optional
  pointThreshold?: string;                  // Success criteria
}
```

### InspectionResult Interface
```typescript
export interface InspectionResult {
  resultId: string;                          // Unique identifier
  jobId: string;                             // Parent inspection job
  pointId: string;                           // Which point was inspected
  controlId?: string;                        // Optional control point reference
  result: 'Pass' | 'Fail' | 'N/A';          // Inspection outcome
  observedValue?: string;                    // What was found
  expectedValue?: string;                    // What was expected
  inspectionDate?: Date;                     // When inspected
  inspectorId?: string;                      // Who inspected
  inspectorNotes?: string;                   // Additional notes
}
```

### ControlPoint Interface
```typescript
export interface ControlPoint {
  controlId: string;                         // Unique identifier
  pointId: string;                           // Associated inspection point
  pointType: 'H' | 'W' | 'M' | 'R';         // Control type
  description: string;                       // Control description
  criteria: string;                          // Pass/fail criteria
  frequencyDays?: number;                    // Inspection frequency
}
```

---

## Component Integration

### In inspection-jobs.component.ts

#### Getting Points
```typescript
export class InspectionJobsComponent implements OnInit {
  private allPoints: InspectionPoint[] = [];

  ngOnInit(): void {
    this.itpService.getPoints().subscribe(points => {
      this.allPoints = points;
    });
  }

  getPoints(): InspectionPoint[] {
    return this.allPoints;
  }
}
```

#### Template Usage
```html
<select [(ngModel)]="result.pointId" (change)="onPointChange(result)">
  <option value="">Select Point</option>
  <option *ngFor="let point of getPoints()" [value]="point.pointId">
    {{ point.pointDescription }}
  </option>
</select>
```

#### Helper Methods
```typescript
getPointDescription(pointId: string): string {
  const point = this.allPoints.find(p => p.pointId === pointId);
  return point ? point.pointDescription : 'Unknown';
}

getPointThreshold(pointId: string): string {
  const point = this.allPoints.find(p => p.pointId === pointId);
  return point?.pointThreshold || '-';
}

onPointChange(result: InspectionResult, index: number): void {
  const point = this.allPoints.find(p => p.pointId === result.pointId);
  if (point?.pointThreshold) {
    result.expectedValue = point.pointThreshold;
  }
}
```

### In itp-templates.component.ts

#### Managing Points
```typescript
export class ITPTemplatesComponent implements OnInit {
  private allPoints: InspectionPoint[] = [];
  newPoint: Partial<InspectionPoint> = {
    isMandatory: true
  };

  ngOnInit(): void {
    this.itpService.getPoints().subscribe(points => {
      this.allPoints = points;
    });
  }

  getPointsByTemplate(templateId: string): InspectionPoint[] {
    return this.allPoints.filter(p => p.templateId === templateId);
  }

  addPointToTemplate(): void {
    if (!this.selectedTemplateId || !this.newPoint.pointDescription) {
      alert('Please select a template and fill in point description');
      return;
    }

    const maxSequence = Math.max(
      0,
      ...this.getPointsByTemplate(this.selectedTemplateId)
        .map(p => p.sequenceOrder)
    );

    const point: InspectionPoint = {
      pointId: 'pt-' + Date.now(),
      templateId: this.selectedTemplateId,
      sequenceOrder: this.newPoint.sequenceOrder || maxSequence + 1,
      pointDescription: this.newPoint.pointDescription!,
      componentCategory: this.newPoint.componentCategory || '',
      inspectionMethod: (this.newPoint.inspectionMethod as any) || 'Visual',
      isMandatory: this.newPoint.isMandatory || true,
      pointThreshold: this.newPoint.pointThreshold
    };

    this.itpService.addPoint(point);
    this.newPoint = { isMandatory: true };
  }

  editPoint(point: InspectionPoint): void {
    const newThreshold = prompt('Edit Point Threshold:', point.pointThreshold || '');
    if (newThreshold !== null) {
      const updatedPoint = { ...point, pointThreshold: newThreshold };
      this.itpService.updatePoint(updatedPoint);
    }
  }
}
```

---

## Common Patterns

### Creating an Inspection Result
```typescript
const result: InspectionResult = {
  resultId: 'res-' + Date.now(),
  jobId: currentJobId,
  pointId: selectedPointId,
  result: 'Pass',
  observedValue: '5.2mm',
  expectedValue: '>5mm',
  inspectionDate: new Date(),
  inspectorId: 'usr-001'
};

this.jobService.addResult(result);
```

### Updating a Point
```typescript
const point = this.itpService.getPointById('pt-001');
if (point) {
  point.pointThreshold = 'New criteria';
  this.itpService.updatePoint(point);
}
```

### Filtering Points
```typescript
// Get mandatory points only
const mandatoryPoints = this.allPoints.filter(p => p.isMandatory);

// Get points by inspection method
const visualPoints = this.allPoints.filter(
  p => p.inspectionMethod === 'Visual'
);

// Get points for a specific template
const templatePoints = this.itpService.getPointsByTemplate('tpl-001');
```

---

## Migration from Old API

### Old vs New

| Operation | Old API | New API |
|-----------|---------|---------|
| Get all | `getTasks()` | `getPoints()` |
| Get by template | `getTasksByTemplate()` | `getPointsByTemplate()` |
| Get by ID | `getTaskById()` | `getPointById()` |
| Create | `addTask()` | `addPoint()` |
| Update | `updateTask()` | `updatePoint()` |
| Delete | `deleteTask()` | `deletePoint()` |
| Get controls | `getControlPointsByTask()` | `getControlPointsByPoint()` |

### Old vs New Properties

| Context | Old | New |
|---------|-----|-----|
| **InspectionPoint** | `taskId` | `pointId` |
| **InspectionPoint** | `taskDescription` | `pointDescription` |
| **InspectionPoint** | `taskThreshold` | `pointThreshold` |
| **InspectionResult** | `result.taskId` | `result.pointId` |
| **ControlPoint** | `taskId` | `pointId` |

---

## Error Prevention

### Common Mistakes to Avoid

❌ **Wrong:**
```typescript
// Old API call
this.itpService.getTasks()

// Wrong property access
const desc = point.taskDescription;
```

✅ **Correct:**
```typescript
// New API call
this.itpService.getPoints()

// Correct property access
const desc = point.pointDescription;
```

### Type Checking
```typescript
// Always verify pointId exists
if (result.pointId && result.pointId !== '') {
  // Safe to use pointId
}

// Check for optional threshold
const threshold = point.pointThreshold || 'No threshold set';
```

---

## Testing Examples

### Unit Test Example
```typescript
describe('ITPTemplateService', () => {
  let service: ITPTemplateService;

  beforeEach(() => {
    service = TestBed.inject(ITPTemplateService);
  });

  it('should return InspectionPoints', (done) => {
    service.getPoints().subscribe(points => {
      expect(points.length).toBeGreaterThan(0);
      expect(points[0].pointId).toBeDefined();
      expect(points[0].pointDescription).toBeDefined();
      done();
    });
  });

  it('should add a point', () => {
    const newPoint: InspectionPoint = {
      pointId: 'test-pt',
      templateId: 'test-tpl',
      sequenceOrder: 1,
      pointDescription: 'Test Point',
      componentCategory: 'Test',
      inspectionMethod: 'Visual',
      isMandatory: true
    };

    service.addPoint(newPoint);
    const retrieved = service.getPointById('test-pt');
    expect(retrieved?.pointDescription).toBe('Test Point');
  });
});
```

---

## FAQ

**Q: What's the difference between InspectionPoint and ControlPoint?**
A: InspectionPoint defines what to inspect, ControlPoint defines specific control criteria for that inspection point.

**Q: Can I still use tasks anywhere?**
A: No, all references to tasks have been removed. Use points terminology throughout.

**Q: How do I update code that used taskId?**
A: Replace all `taskId` references with `pointId` and update property accesses accordingly.

**Q: What if I need the old API?**
A: The old API is no longer supported. Update your code to use the new API as shown above.

---

## Resources

- **Service File:** `src/app/services/itp-template.service.ts`
- **Models:** `src/app/models/index.ts`
- **Components:** `src/app/components/inspection-jobs/` and `src/app/components/itp-templates/`
- **Documentation:** `REFACTORING_COMPLETION_REPORT.md`

---

**Last Updated:** January 17, 2026  
**API Version:** 2.0 (Points-based)
