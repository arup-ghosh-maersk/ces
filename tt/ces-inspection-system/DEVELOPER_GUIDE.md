# CES Inspection System - 2D Drawings Developer Guide

**Version**: 1.0  
**Last Updated**: January 17, 2026  
**Target Audience**: Angular Developers, System Maintainers

---

## 📚 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Anatomy](#component-anatomy)
3. [Adding Diagram URLs](#adding-diagram-urls)
4. [Styling & Customization](#styling--customization)
5. [Advanced Features](#advanced-features)
6. [Troubleshooting](#troubleshooting)
7. [Performance Tips](#performance-tips)

---

## 🏗️ Architecture Overview

### Feature Components

```typescript
AssetListComponent {
  // Main component handling diagram display
  - Template with diagram sections
  - Service integration for assets/components
  - Event handlers for interaction
  - CSS styling for diagrams
}
```

### Data Flow

```
Service (Asset/Component)
    ↓
Observable<Asset[] | ComponentMaster[]>
    ↓
Component receives data
    ↓
ngIf checks for diagramUrl
    ↓
Template renders diagram or fallback
```

### Key Properties

```typescript
// In AssetListComponent
selectedAsset: Asset | null = null;        // Currently selected asset
assetComponents: ComponentMaster[] = [];     // Components for asset
selectedComponentId: string | null = null;  // Currently selected component
expandedNodes: Set<string> = new Set();     // Expanded nodes in tree
```

---

## 🧩 Component Anatomy

### Asset Diagram Template

**Location**: `asset-list.component.ts` (inline template)

```html
<!-- When diagram exists -->
<div class="info-section" *ngIf="selectedAsset.diagramUrl">
  <h4>2D Asset Drawing</h4>
  <div class="diagram-container">
    <img [src]="selectedAsset.diagramUrl" 
         [alt]="'2D Drawing for ' + selectedAsset.assetId" 
         class="diagram-image">
    <div class="diagram-info">
      <p><strong>Asset:</strong> {{ selectedAsset.assetId }}</p>
      <p><strong>Type:</strong> {{ selectedAsset.assetType }}</p>
    </div>
  </div>
</div>

<!-- Fallback when diagram missing -->
<div class="info-section" *ngIf="!selectedAsset.diagramUrl">
  <h4>2D Asset Drawing</h4>
  <div class="no-diagram">
    <p>No 2D drawing available for this asset</p>
    <small>Add a diagram URL to display technical drawings</small>
  </div>
</div>
```

### Component Diagram Template

**Location**: Within tree node template

```html
<!-- When diagram exists -->
<div class="detail-section" *ngIf="component.diagramUrl">
  <h6>2D Component Drawing</h6>
  <div class="component-diagram-container">
    <img [src]="component.diagramUrl" 
         [alt]="'2D Drawing for ' + component.componentName" 
         class="component-diagram-image">
    <div class="diagram-metadata">
      <p><strong>Component:</strong> {{ component.componentName }}</p>
      <p><strong>Code:</strong> {{ component.componentCode }}</p>
      <p><strong>Category:</strong> {{ component.category }}</p>
    </div>
  </div>
</div>

<!-- Fallback when diagram missing -->
<div class="detail-section" *ngIf="!component.diagramUrl">
  <h6>2D Component Drawing</h6>
  <div class="no-component-diagram">
    <p>No 2D drawing available for this component</p>
    <small>Add a diagram URL to display technical drawings</small>
  </div>
</div>
```

### Model Definitions

```typescript
// Asset interface
export interface Asset {
  assetId: string;
  locationId: string;
  assetCode: string;
  assetType: 'STS' | 'RTG' | 'RMG';
  description: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  acquisitionDate?: Date;
  warrantyExpiry?: Date;
  diagramUrl?: string; // ← Diagram property
}

// ComponentMaster interface
export interface ComponentMaster {
  componentId: string;
  componentCode: string;
  componentName: string;
  assetId: string;
  assetType: 'STS' | 'RTG' | 'RMG';
  category: 'Structural' | 'Electrical' | 'Mechanical' | 'Hydraulic' | 'Software' | 'Other';
  description?: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  warrantyExpiry?: Date;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  parentComponentId?: string;
  specifications?: string;
  maintenanceIntervalDays?: number;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
  diagramUrl?: string; // ← Diagram property
}
```

---

## 🔧 Adding Diagram URLs

### Method 1: Update Mock Data (Development)

**File**: `src/app/services/asset.service.ts`

```typescript
private initializeMockData(): void {
  // ...
  this.assets = [
    {
      assetId: 'asset-001',
      // ... other properties
      diagramUrl: 'https://your-server.com/diagrams/asset-001.png'
    },
    // ... more assets
  ];
  // ...
}
```

**File**: `src/app/services/component-master.service.ts`

```typescript
private initializeMockData(): void {
  // ...
  this.components = [
    {
      componentId: 'comp-001',
      // ... other properties
      diagramUrl: 'https://your-server.com/diagrams/component-001.png'
    },
    // ... more components
  ];
  // ...
}
```

### Method 2: Connect to Backend API (Production)

Update service to fetch from API:

```typescript
// asset.service.ts
export class AssetService {
  constructor(private http: HttpClient) { }

  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>('/api/assets');
  }

  getAssetById(id: string): Observable<Asset> {
    return this.http.get<Asset>(`/api/assets/${id}`);
  }
}

// component-master.service.ts
export class ComponentMasterService {
  constructor(private http: HttpClient) { }

  getComponents(): Observable<ComponentMaster[]> {
    return this.http.get<ComponentMaster[]>('/api/components');
  }
}
```

### Method 3: Dynamic URL Resolution

Create a utility service for diagram URL handling:

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {
  private diagramBaseUrl = environment.diagramApiUrl;

  constructor() { }

  getAssetDiagramUrl(assetId: string): string {
    return `${this.diagramBaseUrl}/assets/${assetId}.png`;
  }

  getComponentDiagramUrl(componentId: string): string {
    return `${this.diagramBaseUrl}/components/${componentId}.png`;
  }

  isUrlValid(url: string | undefined): boolean {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
```

---

## 🎨 Styling & Customization

### Modify Diagram Dimensions

**Asset Diagram** (in component styles):

```css
.diagram-container {
  max-width: 800px;  /* Change from 700px */
}

.diagram-image {
  max-height: 600px;  /* Change from 500px */
}
```

**Component Diagram**:

```css
.component-diagram-image {
  max-height: 450px;  /* Change from 400px */
}
```

### Change Color Theme

Update the purple color (#7b1fa2) throughout:

```css
/* Current (Purple) */
border-left: 3px solid #7b1fa2;

/* To change globally, replace all instances */
border-left: 3px solid #0066cc;  /* New color */
```

### Customize Fallback UI

```css
.no-diagram {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);  /* Green */
  border: 2px dashed #4caf50;  /* Green border */
  color: #558b2f;  /* Green text */
}

.no-diagram p {
  color: #558b2f;
}

.no-diagram small {
  color: #7cb342;
}
```

### Add Border Styling Options

```css
.diagram-container {
  /* Solid border (current) */
  border: 2px solid #e0e0e0;
  
  /* Or use shadow instead */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: none;
  
  /* Or use both */
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

---

## 🚀 Advanced Features

### Feature 1: Image Lazy Loading

Implement lazy loading for better performance:

```typescript
// In component
<img [src]="selectedAsset.diagramUrl" 
     loading="lazy"  <!-- Add this -->
     class="diagram-image">
```

### Feature 2: Error Handling

Add error event handling:

```typescript
// Template
<img [src]="selectedAsset.diagramUrl" 
     (error)="onImageError($event)"
     class="diagram-image">

// Component
onImageError(event: Event): void {
  console.error('Failed to load diagram:', event);
  // Show fallback or retry logic
}
```

### Feature 3: Image Zoom

Add zoom capability:

```typescript
// Add to component properties
zoomedDiagramId: string | null = null;

// Add method
toggleZoom(componentId: string): void {
  this.zoomedDiagramId = this.zoomedDiagramId === componentId ? null : componentId;
}
```

```css
/* Add zoom styling */
.diagram-container.zoomed {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  max-width: 90vw;
  max-height: 90vh;
}
```

### Feature 4: Diagram Versioning

Track diagram versions:

```typescript
export interface DiagramVersion {
  diagramUrl: string;
  version: number;
  uploadedDate: Date;
  uploadedBy: string;
  description?: string;
}

// Update Asset model
export interface Asset {
  // ... existing properties
  diagramUrl?: string;  // Current diagram
  diagramHistory?: DiagramVersion[];  // Version history
}
```

### Feature 5: Download Diagram

Add download functionality:

```typescript
downloadDiagram(assetId: string, diagramUrl: string): void {
  const link = document.createElement('a');
  link.href = diagramUrl;
  link.download = `${assetId}-diagram.png`;
  link.click();
}
```

```html
<button (click)="downloadDiagram(selectedAsset.assetId, selectedAsset.diagramUrl)"
        class="btn btn-download">
  Download Diagram
</button>
```

---

## 🐛 Troubleshooting

### Issue: Diagram Not Displaying

**Checklist**:
1. Verify `diagramUrl` property exists in data
2. Check URL is valid and accessible
3. Check browser console for CORS errors
4. Test URL directly in browser
5. Verify image format is supported

**Debug Code**:
```typescript
// Add to component
console.log('Asset:', this.selectedAsset);
console.log('Diagram URL:', this.selectedAsset?.diagramUrl);
console.log('URL exists:', !!this.selectedAsset?.diagramUrl);
```

### Issue: Image Stretched or Distorted

**Solution**: Verify CSS is applied correctly

```css
/* Should have object-fit: contain */
.diagram-image {
  object-fit: contain;  /* Don't remove this */
  max-width: 100%;
  max-height: 500px;
}
```

### Issue: CORS Error

**Solution**: Use CORS-enabled image service or proxy

```typescript
// Instead of direct URL
diagramUrl: 'https://example.com/diagram.png'

// Use CORS proxy
diagramUrl: 'https://cors-anywhere.herokuapp.com/https://example.com/diagram.png'
```

### Issue: Poor Performance

**Solutions**:

1. **Optimize Images**
   - Compress PNG/JPEG files
   - Use WebP format if supported
   - Reduce resolution if appropriate

2. **Implement Caching**
   ```typescript
   private diagramCache = new Map<string, string>();
   
   getDiagramUrl(id: string): string {
     if (this.diagramCache.has(id)) {
       return this.diagramCache.get(id)!;
     }
     const url = this.resolveDiagramUrl(id);
     this.diagramCache.set(id, url);
     return url;
   }
   ```

3. **Use CDN**
   - Store diagrams on CDN for faster delivery
   - Use regional endpoints

---

## ⚡ Performance Tips

### 1. Image Optimization

```typescript
// Serve different sizes based on device
getOptimizedDiagramUrl(assetId: string, isMobile: boolean): string {
  const resolution = isMobile ? '400' : '700';
  return `${this.baseUrl}/diagrams/${assetId}-${resolution}.png`;
}
```

### 2. Lazy Loading

```html
<!-- Use native lazy loading -->
<img [src]="diagramUrl" 
     loading="lazy"
     class="diagram-image">
```

### 3. Preloading Strategy

```typescript
// Preload diagrams for frequently accessed assets
ngOnInit() {
  this.preloadCommonDiagrams();
}

preloadCommonDiagrams(): void {
  const commonAssets = ['asset-001', 'asset-002'];
  commonAssets.forEach(id => {
    const img = new Image();
    img.src = this.getDiagramUrl(id);
  });
}
```

### 4. Responsive Images

```html
<!-- Use picture element for responsive sizing -->
<picture>
  <source media="(max-width: 768px)" 
          srcset="diagram-small.png">
  <source media="(min-width: 769px)" 
          srcset="diagram-large.png">
  <img [src]="selectedAsset.diagramUrl" 
       class="diagram-image">
</picture>
```

### 5. Conditional Rendering

```html
<!-- Only load diagram when visible -->
<div class="info-section" 
     *ngIf="selectedAsset && selectedAsset.diagramUrl">
  <img [src]="selectedAsset.diagramUrl" 
       class="diagram-image">
</div>
```

---

## 📝 Best Practices

### 1. Error Handling

Always handle missing URLs gracefully:

```typescript
// Good
<img *ngIf="asset.diagramUrl" [src]="asset.diagramUrl" />
<div *ngIf="!asset.diagramUrl">No diagram available</div>

// Bad
<img [src]="asset.diagramUrl" />  <!-- May break layout -->
```

### 2. Accessibility

Always include alt text:

```html
<!-- Good -->
<img [alt]="'2D Drawing for ' + asset.assetId" />

<!-- Bad -->
<img alt="diagram" />  <!-- Not descriptive -->
```

### 3. URL Management

Keep URLs in configuration:

```typescript
// In environment.ts
export const environment = {
  diagramApiUrl: 'https://api.example.com/diagrams',
  diagramBaseUrl: 'https://cdn.example.com/diagrams'
};
```

### 4. Testing

Test with various scenarios:

```typescript
// Test cases
- Asset with diagram
- Asset without diagram
- Component with diagram
- Component without diagram
- Broken image URL
- Large image file
- Different image formats
```

---

## 🔐 Security Considerations

### 1. URL Validation

```typescript
isValidDiagramUrl(url: string | undefined): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    // Only allow HTTPS
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}
```

### 2. Content Security Policy

Add to index.html:

```html
<meta http-equiv="Content-Security-Policy" 
      content="img-src 'self' https: data:;">
```

### 3. XSS Prevention

The component already prevents XSS:

```html
<!-- Safe - uses property binding -->
[src]="selectedAsset.diagramUrl"

<!-- NEVER do this -->
[innerHTML]="'<img src=' + url + '>'">  <!-- DANGEROUS -->
```

---

## 📚 Related Documentation

- `2D_DRAWINGS_IMPLEMENTATION_COMPLETE.md` - Full implementation details
- `2D_DRAWINGS_FEATURE_QUICK_START.md` - Quick start guide
- `2D_DRAWINGS_GUIDE.md` - Visual guide
- `VERIFICATION_REPORT.md` - Verification and testing report

---

## 🎯 Quick Reference

### Key Files
- Component: `src/app/components/asset-list/asset-list.component.ts`
- Models: `src/app/models/index.ts`
- Asset Service: `src/app/services/asset.service.ts`
- Component Service: `src/app/services/component-master.service.ts`

### Key Classes
- Asset, ComponentMaster interfaces
- AssetService, ComponentMasterService
- AssetListComponent

### Key CSS Classes
- `.diagram-container` - Asset diagram wrapper
- `.component-diagram-container` - Component diagram wrapper
- `.diagram-image` - Asset diagram image
- `.component-diagram-image` - Component diagram image
- `.no-diagram` - Asset fallback UI
- `.no-component-diagram` - Component fallback UI

---

**Version**: 1.0  
**Last Updated**: January 17, 2026  
**Status**: ✅ COMPLETE

