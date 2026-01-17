# 2D Diagram Setup Guide for Assets and Components

## Overview
Each Asset and Component can now have an associated 2D diagram (image) for visual reference. This guide explains how to set up diagrams for your assets and components.

## Supported Diagram Format
- **Image Formats**: PNG, JPG, SVG
- **Size**: Recommended max-width 600px for assets, 500px for components
- **Location**: Can be stored locally in `/public` folder or served from external URL

## Adding Diagrams to Assets

### Step 1: Store Your Diagram Image
Place your diagram image file in the public folder:
```
public/
  diagrams/
    asset-01-diagram.png
    asset-02-diagram.svg
    etc.
```

### Step 2: Update Asset Data
When creating or updating an asset, include the `diagramUrl` field:

```typescript
const asset: Asset = {
  assetId: 'ASSET-001',
  assetCode: 'RTG-01',
  assetType: 'RTG',
  locationId: 'LOC-001',
  description: 'Rubber Tyred Gantry Crane',
  manufacturer: 'Konecranes',
  modelNumber: 'RTG-500',
  serialNumber: 'SN-123456',
  diagramUrl: '/diagrams/asset-rtg-01.png', // ← Add this line
  acquisitionDate: new Date('2020-01-15'),
  warrantyExpiry: new Date('2025-01-15')
};
```

## Adding Diagrams to Components

### Step 1: Store Your Component Diagram
Place component diagram images in the public folder:
```
public/
  diagrams/
    components/
      hoist-system.png
      motor-assembly.svg
      etc.
```

### Step 2: Update Component Data
When creating or updating a component, include the `diagramUrl` field:

```typescript
const component: ComponentMaster = {
  componentId: 'COMP-001',
  componentCode: 'HOIST-01',
  componentName: 'Main Hoist System',
  assetId: 'ASSET-001',
  assetType: 'RTG',
  category: 'Mechanical',
  manufacturer: 'Konecranes',
  modelNumber: 'HS-3000',
  serialNumber: 'SN-987654',
  criticality: 'Critical',
  diagramUrl: '/diagrams/components/hoist-system.png', // ← Add this line
  maintenanceIntervalDays: 30,
  isActive: true
};
```

## Display Behavior

### Asset Diagram
- Displayed in the Asset Details section under "Asset Diagram"
- Only shown if `diagramUrl` is provided
- Max-width: 600px, max-height: 500px
- Maintains aspect ratio with object-fit: contain

### Component Diagram
- Displayed in the Component Tree node details under "Component Diagram"
- Only shown if `diagramUrl` is provided and node is expanded
- Max-width: 500px, max-height: 400px
- Maintains aspect ratio with object-fit: contain

## Creating Diagrams

### Recommended Tools
1. **DrawIO (Draw.io)** - Free, web-based, supports multiple formats
   - Export as PNG/SVG for web use
   - Keep diagrams simple and clear

2. **Visio** - Professional, detailed diagrams
   - Export as PNG/JPG/SVG

3. **Inkscape** - Free, open-source vector graphics
   - Native SVG support
   - Good for technical drawings

### Best Practices for Diagrams
- **Keep it simple**: Focus on key components and connections
- **Use clear labels**: Label all important parts
- **Color coding**: Use consistent colors for different types (mechanical, electrical, etc.)
- **Scale appropriately**: Ensure details are visible at display size
- **White background**: Recommended for clarity
- **Format**: SVG for scalable diagrams, PNG for raster images

## Example Diagram URLs

### Local Files (relative paths)
```
/diagrams/asset-rtg-01.png
/diagrams/components/motor-assembly.svg
/diagrams/sts/structure.png
```

### External URLs
```
https://example.com/diagrams/asset-001.png
https://cdn.example.com/diagrams/components/hoist.svg
```

## Integration with Mock Data

If you're using mock data in services, update your mock data like this:

```typescript
// asset.service.ts
getMockAssets(): Asset[] {
  return [
    {
      assetId: 'ASSET-001',
      assetCode: 'RTG-01',
      assetType: 'RTG',
      locationId: 'LOC-001',
      description: 'Rubber Tyred Gantry Crane',
      // ... other properties ...
      diagramUrl: '/diagrams/rtg-01.png'
    },
    // ... more assets ...
  ];
}

// component-master.service.ts
getMockComponents(): ComponentMaster[] {
  return [
    {
      componentId: 'COMP-001',
      componentCode: 'HOIST-01',
      componentName: 'Main Hoist System',
      assetId: 'ASSET-001',
      assetType: 'RTG',
      category: 'Mechanical',
      // ... other properties ...
      diagramUrl: '/diagrams/components/hoist-system.png'
    },
    // ... more components ...
  ];
}
```

## Testing the Feature

1. Start the application: `npm start`
2. Navigate to the Asset List
3. Click on an asset to view Asset Details
4. If the asset has a `diagramUrl`, you'll see the diagram displayed
5. Expand a component in the tree
6. If the component has a `diagramUrl`, you'll see it in the Component Diagram section

## Troubleshooting

### Diagram Not Showing
- **Check URL**: Verify the `diagramUrl` is correct and accessible
- **CORS Issues**: If using external URLs, ensure CORS is enabled on the host
- **File Format**: Ensure the image file format is supported (PNG, JPG, SVG)

### Image Looks Stretched
- Diagrams use `object-fit: contain` which maintains aspect ratio
- If image appears distorted, check the original aspect ratio

### Performance Issues
- **Optimize images**: Compress PNG/JPG files before uploading
- **Use appropriate formats**: SVG for scalable diagrams, PNG for complex images
- **Size**: Keep images under 500KB for optimal performance

## Future Enhancements
- Diagram zoom/pan functionality
- Upload diagrams through UI
- Support for multi-page diagrams
- Annotation tools for marking inspection points
- Integration with Drawing.io embedded viewer

