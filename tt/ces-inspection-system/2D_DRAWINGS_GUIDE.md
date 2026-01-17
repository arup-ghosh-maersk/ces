# 2D Drawings Display Guide

## Overview
The CES Inspection System now displays 2D technical drawings for both Assets and Components. This feature provides visual reference for engineers, inspectors, and maintenance personnel.

## Features Implemented

### 1. Asset 2D Drawings
- **Location**: Asset Details section, below basic information
- **Display**: Large diagram with metadata
- **Shows**:
  - Technical drawing image (PNG, JPG, or SVG)
  - Asset ID and Type information
  - Professional styling with shadow and border

### 2. Component 2D Drawings
- **Location**: Component Tree node details (when node is expanded/selected)
- **Display**: Medium-sized diagram with detailed metadata
- **Shows**:
  - Technical drawing image
  - Component name, code, and category
  - Professional styling matching asset diagrams

### 3. Fallback Messages
- If no diagram is available, displays helpful message
- Encourages adding diagrams to system
- Non-intrusive design doesn't disrupt layout

## UI Components

### Asset Diagram Section
```
┌─────────────────────────────────────────┐
│  2D Asset Drawing                       │
├─────────────────────────────────────────┤
│                                         │
│           [Technical Drawing]           │
│                                         │
│   Asset: ASSET-001                      │
│   Type: RTG                             │
│                                         │
└─────────────────────────────────────────┘
```

### Component Diagram Section
```
┌─────────────────────────────────────────┐
│  2D Component Drawing                   │
├─────────────────────────────────────────┤
│                                         │
│       [Technical Drawing]               │
│                                         │
│   Component: Main Hoist System          │
│   Code: HOIST-RTG-01                    │
│   Category: Mechanical                  │
│                                         │
└─────────────────────────────────────────┘
```

### No Diagram State
```
┌─────────────────────────────────────────┐
│  2D Asset Drawing                       │
├─────────────────────────────────────────┤
│                                         │
│  No 2D drawing available for this asset │
│  Add a diagram URL to display           │
│  technical drawings                     │
│                                         │
└─────────────────────────────────────────┘
```

## How to Add Diagrams

### Step 1: Prepare Your Drawings
- Create using DrawIO, Visio, AutoCAD, or Inkscape
- Export as PNG, JPG, or SVG
- Recommended size: 600-800px for assets, 400-600px for components

### Step 2: Store Diagrams
**Option A: Local Storage**
```
project/
  public/
    diagrams/
      rtg-01-side-view.png
      sts-01-top-view.svg
      rmg-01-technical-drawing.png
      components/
        hoist-system-assembly.png
        motor-wiring-diagram.svg
        frame-structural-drawing.png
        trolley-assembly-detail.png
```

**Option B: External CDN/Cloud**
```
https://cdn.example.com/diagrams/rtg-01.png
https://s3.amazonaws.com/diagrams/motor.svg
```

### Step 3: Update Service Data
In your asset service:
```typescript
const mockAssets: Asset[] = [
  {
    assetId: 'ASSET-001',
    // ... other properties ...
    diagramUrl: '/diagrams/rtg-01-side-view.png'  // Add this line
  }
];
```

In your component service:
```typescript
const mockComponents: ComponentMaster[] = [
  {
    componentId: 'COMP-001',
    // ... other properties ...
    diagramUrl: '/diagrams/components/hoist-system-assembly.png'  // Add this line
  }
];
```

## Styling Details

### Asset Diagram Container
- **Max Width**: 700px
- **Max Height**: 500px (image)
- **Background**: Light gray (#fafafa)
- **Border**: 2px solid #e0e0e0
- **Padding**: 20px
- **Gap between elements**: 15px

### Component Diagram Container
- **Max Width**: 100% (flexible)
- **Max Height**: 400px (image)
- **Background**: Light gray (#fafafa)
- **Border**: 2px solid #e0e0e0
- **Padding**: 15px
- **Gap between elements**: 12px

### Image Properties
- **Object Fit**: contain (maintains aspect ratio)
- **Border Radius**: 4px
- **Box Shadow**: 0 2px 4px rgba(0,0,0,0.1)
- **Background**: white with 8-10px padding

### Metadata Section
- **Styling**: White background with purple left border
- **Font Size**: 12px (asset), 11px (component)
- **Text Color**: #555 (body), #7b1fa2 (labels)
- **Padding**: 10px

### No Diagram State
- **Background**: Linear gradient from #f5f5f5 to #fafafa
- **Border**: 2px dashed #ddd
- **Text Color**: #999 (placeholder text)
- **Padding**: 40px (asset), 30px (component)

## Responsive Behavior

### Desktop (1200px+)
- Asset diagrams: Full width up to 700px
- Component diagrams: Full width of card
- All metadata visible

### Tablet (768px - 1199px)
- Asset diagrams: 90% width with max 600px
- Component diagrams: 100% width
- All metadata visible

### Mobile (< 768px)
- Asset diagrams: 95% width
- Component diagrams: 100% width
- Metadata stacked vertically
- Images scale appropriately

## Browser Support
- Modern browsers: Chrome, Firefox, Safari, Edge
- Image formats: PNG (all), JPG (all), SVG (all modern)
- Fallback: Automatic graceful degradation for unsupported formats

## Performance Optimization

### Image Compression
```bash
# PNG compression
pngquant diagrams/*.png --output diagrams/compressed/

# JPEG optimization
jpegoptim diagrams/*.jpg --dest diagrams/compressed/

# SVG optimization
svgo diagrams/*.svg
```

### File Size Guidelines
- PNG: 100-300 KB
- JPG: 80-250 KB
- SVG: 20-100 KB
- Total per asset/component: < 500 KB

### Caching Strategy
- Browser caching: 30 days for diagram images
- CDN caching: 7 days
- Force reload: Clear browser cache if diagram updated

## Error Handling

### Broken Image Links
- **Behavior**: Empty space with alt text
- **Recovery**: Check URL path and file exists
- **Message**: Browser developer console shows 404 error

### CORS Issues (External URLs)
- **Behavior**: Image fails to load
- **Solution**: Enable CORS on server hosting images
- **Alternative**: Store diagrams locally

### Very Large Images
- **Behavior**: Slow loading, potential memory issues
- **Solution**: Compress before uploading
- **Recommended**: < 1MB per image

## Integration Example

### Before
```typescript
// Asset without diagram
{
  assetId: 'ASSET-001',
  assetCode: 'RTG-01',
  assetType: 'RTG',
  description: 'Rubber Tyred Gantry Crane',
  // ... other properties ...
}
```

### After
```typescript
// Asset with diagram
{
  assetId: 'ASSET-001',
  assetCode: 'RTG-01',
  assetType: 'RTG',
  description: 'Rubber Tyred Gantry Crane',
  diagramUrl: '/diagrams/rtg-01-side-view.png',  // New field
  // ... other properties ...
}
```

## Updating Diagrams

### Change Existing Diagram
1. Save new version in same location
2. Use same filename to overwrite
3. Clear browser cache if needed
4. Refresh page

### Add Diagram to Existing Asset/Component
1. Create and save diagram to public/diagrams/
2. Update asset/component data with diagramUrl
3. Restart service (if using static data)
4. Verify display in UI

## Troubleshooting

### Diagram Not Showing
1. Check URL path is correct
2. Verify file exists in public folder
3. Check browser console for 404 errors
4. Clear browser cache and refresh

### Image Appears Blurry
1. Use higher resolution original
2. Export at 1.5x or 2x scale
3. Use SVG format for scalable graphics
4. Increase max-height/width CSS values

### Layout Issues
1. Check image aspect ratio
2. Verify CSS display properties
3. Test on different screen sizes
4. Check for missing styles

## Future Enhancements

### Planned Features
- [ ] Zoom/Pan functionality for detailed inspection
- [ ] Image annotation tools
- [ ] Multi-page diagram support
- [ ] Diagram versioning history
- [ ] Upload diagrams through UI
- [ ] Integration with Drawing.io embedded viewer
- [ ] 360° rotation for 3D-like viewing
- [ ] Hotspot annotations for component locations
- [ ] Print-friendly diagram layouts

### Suggested Tools
- DrawIO: Free, web-based, easy to use
- Visio: Professional, detailed diagrams
- AutoCAD: Industry standard CAD
- Inkscape: Free vector graphics
- Figma: Collaborative design tool

## Support & Questions

For issues or questions about 2D drawings display:
1. Check this guide first
2. Review DIAGRAM_EXAMPLES.ts
3. Check browser console for errors
4. Verify file paths and URLs
5. Test with different image formats

## Summary

The 2D Drawings feature provides:
✅ Visual reference for assets and components
✅ Professional presentation of technical drawings
✅ Responsive design for all devices
✅ Flexible storage (local or cloud)
✅ Graceful fallback for missing diagrams
✅ Easy integration with existing data
✅ High-performance image rendering

Get started by adding diagrams to your assets and components!
