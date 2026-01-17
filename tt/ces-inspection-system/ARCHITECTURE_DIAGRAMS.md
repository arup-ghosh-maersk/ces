# 2D Drawings Feature - Architecture & Design Diagrams

**Version**: 1.0  
**Date**: January 17, 2026  

---

## 🏗️ System Architecture

### High-Level Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CES Inspection System UI Layer                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            AssetListComponent                           │   │
│  │  (Main Display Component)                               │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ Asset Table Section                              │  │   │
│  │  │ - Asset rows (clickable)                         │  │   │
│  │  │ - Selection state tracking                       │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ Asset Details Panel (when selected)              │  │   │
│  │  │ ┌────────────────────────────────────────────┐  │  │   │
│  │  │ │ Basic Information                          │  │  │   │
│  │  │ ├────────────────────────────────────────────┤  │  │   │
│  │  │ │ 2D Asset Drawing Section ✨ NEW            │  │  │   │
│  │  │ │ ┌──────────────────────────────────────┐  │  │  │   │
│  │  │ │ │ Diagram Container                    │  │  │  │   │
│  │  │ │ ├──────────────────────────────────────┤  │  │  │   │
│  │  │ │ │ [Diagram Image]                      │  │  │  │   │
│  │  │ │ ├──────────────────────────────────────┤  │  │  │   │
│  │  │ │ │ Asset Metadata (ID, Type)            │  │  │  │   │
│  │  │ │ └──────────────────────────────────────┘  │  │  │   │
│  │  │ ├────────────────────────────────────────────┤  │  │   │
│  │  │ │ Component Tree Section                     │  │  │   │
│  │  │ │ ┌────────────────────────────────────────┐ │  │  │   │
│  │  │ │ │ [Root Components]                      │ │  │  │   │
│  │  │ │ │ ├─ [Child Component 1]                 │ │  │  │   │
│  │  │ │ │ │  └─ Component Details                │ │  │  │   │
│  │  │ │ │ │  └─ 2D Component Drawing ✨ NEW      │ │  │  │   │
│  │  │ │ │ │     ├─ Diagram Image                 │ │  │  │   │
│  │  │ │ │ │     └─ Component Metadata            │ │  │  │   │
│  │  │ │ │ └─ [Child Component 2]                 │ │  │  │   │
│  │  │ │ └────────────────────────────────────────┘ │  │  │   │
│  │  │ └────────────────────────────────────────────┘  │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
         ↑                           ↑                    ↑
         │                           │                    │
         │                           │                    │
    [Services Layer]        [Data Models]        [Styling/CSS]
         │                           │                    │
         └─────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

### Asset Diagram Display Flow

```
User clicks Asset Row
         ↓
selectAsset(asset) called
         ↓
selectedAssetId = asset.assetId
selectedAsset = asset
         ↓
loadAssetComponents(assetId)
         ↓
Request: getComponents() from ComponentMasterService
         ↓
Service returns: ComponentMaster[]
         ↓
Filter components for this asset
         ↓
buildComponentTree() creates hierarchy
         ↓
Template detects selectedAsset changed
         ↓
*ngIf="selectedAsset.diagramUrl" evaluates
         ↓
    ┌────────────┴────────────┐
    │                         │
   YES                       NO
    │                         │
    ↓                         ↓
Display diagram          Display fallback
container with:          UI with message
- Image from URL         - "No diagram"
- Asset metadata         - Helpful hint
(ID, Type)              
```

### Component Diagram Display Flow

```
User clicks Component Node
         ↓
selectComponent(component) called
         ↓
selectedComponentId = component.componentId
         ↓
Template detects selectedComponentId changed
         ↓
Expand component node details section
         ↓
*ngIf="component.diagramUrl" evaluates
         ↓
    ┌────────────┴────────────┐
    │                         │
   YES                       NO
    │                         │
    ↓                         ↓
Display diagram          Display fallback
container with:          UI with message
- Image from URL         - "No diagram"
- Component metadata     - Helpful hint
(Name, Code, Category)
```

---

## 🔄 Component Lifecycle

### AssetListComponent Lifecycle

```
ngOnInit()
    ↓
Subscribe to route queryParams
    ↓
getAssets() from AssetService
    ↓
assets$ Observable ready
    ↓
Render Asset Table
    ↓
User Interaction...
    ↓
selectAsset()
    ↓
loadAssetComponents()
    ↓
Render Asset Details + Component Tree
    ↓
Component Tree Ready for interaction
```

---

## 🎯 State Management Diagram

```
┌─────────────────────────────────────────────────────┐
│         AssetListComponent State                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  assets$: Observable<Asset[]>                      │
│  ├─ Asset[]                                        │
│  │  ├─ assetId: string                             │
│  │  ├─ assetCode: string                           │
│  │  ├─ description: string                         │
│  │  ├─ diagramUrl?: string ✨ NEW                  │
│  │  └─ ... other properties                        │
│  │                                                 │
│  selectedAssetId: string | null                   │
│  ├─ Tracks currently selected asset                │
│  │                                                 │
│  selectedAsset: Asset | null                       │
│  ├─ Full asset object (from selection)             │
│  │                                                 │
│  assetComponents: ComponentMaster[]                │
│  ├─ All components for selected asset              │
│  │  ├─ componentId: string                         │
│  │  ├─ componentName: string                       │
│  │  ├─ diagramUrl?: string ✨ NEW                  │
│  │  └─ ... other properties                        │
│  │                                                 │
│  componentTree: ComponentMaster[]                  │
│  ├─ Root-level components only                     │
│  │                                                 │
│  expandedNodes: Set<string>                        │
│  ├─ Tracks which components are expanded           │
│  │                                                 │
│  selectedComponentId: string | null                │
│  └─ Tracks currently selected component            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📐 Class Diagram

```
┌──────────────────────────┐
│       Asset              │
├──────────────────────────┤
│ - assetId: string        │
│ - assetCode: string      │
│ - assetType: enum        │
│ - description: string    │
│ - manufacturer?: string  │
│ - modelNumber?: string   │
│ - diagramUrl?: string    │ ✨ NEW
│ - ... other fields       │
└──────────────────────────┘
           △
           │ uses
           │
┌──────────────────────────┐       ┌──────────────────────────┐
│  AssetListComponent      │◄──────│   AssetService           │
├──────────────────────────┤       ├──────────────────────────┤
│ - selectedAsset: Asset   │       │ - getAssets()            │
│ - assetComponents[]      │       │ - getAssetById()         │
│ - expandedNodes: Set     │       │ - addAsset()             │
├──────────────────────────┤       │ - updateAsset()          │
│ + selectAsset()          │       │ - deleteAsset()          │
│ + selectComponent()      │       └──────────────────────────┘
│ + toggleNode()           │
│ + loadAssetComponents()  │
└──────────────────────────┘
           │
           │ uses
           │
           ▼
┌──────────────────────────────┐
│ ComponentMasterService       │
├──────────────────────────────┤
│ - getComponents()            │
│ - getComponentById()         │
│ - getComponentsByAsset()     │
│ - getSubcomponents()         │
│ - addComponent()             │
│ - updateComponent()          │
│ - deleteComponent()          │
└──────────────────────────────┘
           △
           │ provides
           │
┌──────────────────────────────┐
│   ComponentMaster            │
├──────────────────────────────┤
│ - componentId: string        │
│ - componentName: string      │
│ - componentCode: string      │
│ - category: enum             │
│ - criticality: enum          │
│ - diagramUrl?: string        │ ✨ NEW
│ - parentComponentId?: string │
│ - ... other fields           │
└──────────────────────────────┘
```

---

## 🎨 UI Component Layout

### Asset Details View

```
┌─────────────────────────────────────────────────────────┐
│ Asset Details for: STS-001                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Basic Information Section]                            │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Asset ID    │ asset-001   Model      │ DRF450  │   │
│ │ Asset Code  │ STS-001     Serial     │ KLM001  │   │
│ │ Type        │ STS         Mfg        │ Kalmar  │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ [2D Asset Drawing Section] ✨ NEW                      │
│ ┌─────────────────────────────────────────────────┐   │
│ │          2D Asset Drawing                       │   │
│ ├─────────────────────────────────────────────────┤   │
│ │                                                 │   │
│ │              [Diagram Image]                    │   │
│ │              (700px max width)                  │   │
│ │              (500px max height)                 │   │
│ │                                                 │   │
│ ├─────────────────────────────────────────────────┤   │
│ │ Asset: asset-001       Type: STS                │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ [Component Tree Structure]                            │
│ ┌─────────────────────────────────────────────────┐   │
│ │ ▼ Boom Assembly [Structural] [Critical]         │   │
│ │   [Selected - show details below]               │   │
│ │   ┌────────────────────────────────────────┐   │   │
│ │   │ Basic Info  │ ID: comp-001              │   │   │
│ │   │ Technical   │ Code: BOOM-001            │   │   │
│ │   │ Maintenance │ Category: Structural      │   │   │
│ │   │ Description │ ...                       │   │   │
│ │   ├────────────────────────────────────────┤   │   │
│ │   │ 2D Component Drawing ✨ NEW            │   │   │
│ │   │ [Component Diagram Image]              │   │   │
│ │   │ Comp: Boom Assembly Code: BOOM-001     │   │   │
│ │   └────────────────────────────────────────┘   │   │
│ │                                                 │   │
│ │ ▶ Main Drive Motor [Electrical] [Critical]     │   │
│ │                                                 │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Template Structure Diagram

```
AssetListComponent
│
├─ Assets Section
│  │
│  └─ Table
│     └─ Table Rows (clickable)
│        │
│        └─ selectAsset() → loads details
│
└─ Asset Details Section (if selected)
   │
   ├─ Basic Information Grid
   │
   ├─ 2D Asset Drawing Section ✨ NEW
   │  │
   │  └─ [Conditional: if diagramUrl]
   │     ├─ diagram-container
   │     │  ├─ <img> (diagram-image)
   │     │  └─ diagram-info
   │     │     ├─ Asset ID
   │     │     └─ Asset Type
   │     │
   │     └─ [Fallback: if !diagramUrl]
   │        └─ no-diagram
   │           ├─ "No diagram available"
   │           └─ "Add diagram URL"
   │
   └─ Component Tree Section
      │
      └─ ng-template #treeNode (recursive)
         │
         ├─ Node Content (clickable)
         │  ├─ Expand/collapse button
         │  └─ Component name + badges
         │
         ├─ Node Details (if selected)
         │  │
         │  ├─ Basic Information
         │  ├─ Technical Specifications
         │  ├─ Maintenance Information
         │  │
         │  ├─ 2D Component Drawing ✨ NEW
         │  │  │
         │  │  └─ [Conditional: if diagramUrl]
         │  │     ├─ component-diagram-container
         │  │     │  ├─ <img> (component-diagram-image)
         │  │     │  └─ diagram-metadata
         │  │     │     ├─ Component Name
         │  │     │     ├─ Component Code
         │  │     │     └─ Component Category
         │  │     │
         │  │     └─ [Fallback: if !diagramUrl]
         │  │        └─ no-component-diagram
         │  │
         │  └─ Description & Specifications
         │
         └─ Children (recursive)
            └─ [Collapsed/Expanded based on state]
```

---

## 🔀 Event Flow Diagram

```
USER INTERACTIONS

Asset Selection:
  Table Row Click → selectAsset(asset) 
      ↓
  updateUI: 
    - Set selectedAssetId
    - Set selectedAsset
    - Call loadAssetComponents()
      ↓
  loadAssetComponents:
    - Get assetId from selectedAsset
    - Request getComponents() from service
    - Filter for matching assetId
    - Build componentTree
      ↓
  Render:
    - Asset Details Panel opens
    - Asset info displays
    - Asset diagram displays (if diagramUrl exists)
    - Component tree renders

Component Expansion:
  Arrow Button Click → toggleNode(component)
      ↓
  Update State:
    - Add/remove from expandedNodes Set
    - Close sibling nodes (accordion behavior)
      ↓
  Render:
    - Component children show/hide
    - Arrow icon rotates (▶/▼)

Component Selection:
  Component Row Click → selectComponent(component)
      ↓
  Update State:
    - Set selectedComponentId
      ↓
  Render:
    - Node highlights (selected class)
    - Component details show
    - Component diagram displays (if diagramUrl exists)
```

---

## 🎯 Diagram Display Logic

### Asset Diagram Decision Tree

```
selectAsset(asset)
    ↓
Is selectedAsset not null?
    ├─ YES: Continue
    │   ↓
    │   Does asset.diagramUrl exist?
    │   ├─ YES: Render diagram section
    │   │   ├─ Show diagram-container
    │   │   ├─ Load <img> from diagramUrl
    │   │   └─ Show asset metadata below
    │   │
    │   └─ NO: Render fallback section
    │       ├─ Show no-diagram container
    │       ├─ Display "No diagram available" message
    │       └─ Suggest adding diagram URL
    │
    └─ NO: Don't render diagram section
```

### Component Diagram Decision Tree

```
selectComponent(component)
    ↓
Is selectedComponentId === component.componentId?
    ├─ YES: Show component details
    │   ↓
    │   Does component.diagramUrl exist?
    │   ├─ YES: Render diagram section
    │   │   ├─ Show component-diagram-container
    │   │   ├─ Load <img> from diagramUrl
    │   │   └─ Show component metadata below
    │   │
    │   └─ NO: Render fallback section
    │       ├─ Show no-component-diagram container
    │       ├─ Display "No diagram available" message
    │       └─ Suggest adding diagram URL
    │
    └─ NO: Hide component details
```

---

## 📊 Data Model Relationships

```
┌─────────────────────┐
│     Terminal        │
│     Location        │
└──────────┬──────────┘
           │ 1:N
           │
           ▼
┌─────────────────────┐
│      Asset          │
│ - assetId           │
│ - assetCode         │
│ - assetType         │
│ - diagramUrl? ✨    │
│ - ... others        │
└──────────┬──────────┘
           │ 1:N
           │
           ▼
┌─────────────────────┐
│  ComponentMaster    │
│ - componentId       │
│ - componentName     │
│ - assetId (FK)      │
│ - parentComponentId?│
│ - diagramUrl? ✨    │
│ - ... others        │
└─────────────────────┘
           │ 1:N (Self-referential)
           │ parentComponentId
           │
           └──→ (Recursive relationship)
```

---

## 🔌 Service Integration Points

```
┌──────────────────────────────────────────────────────┐
│         Frontend (AssetListComponent)                 │
└──────────┬───────────────────────────────────────────┘
           │
           ├─→ AssetService.getAssets()
           │   └─ Returns: Observable<Asset[]>
           │      - Includes diagramUrl field
           │
           ├─→ ComponentMasterService.getComponents()
           │   └─ Returns: Observable<ComponentMaster[]>
           │      - Includes diagramUrl field
           │
           ├─→ ComponentMasterService.getSubcomponents(id)
           │   └─ Returns: Observable<ComponentMaster[]>
           │      - For nested components
           │
           └─→ ActivatedRoute.queryParams
               └─ For auto-selecting asset from URL
```

---

## 🖼️ Visual Hierarchy

```
ASSET DIAGRAM DISPLAY HIERARCHY

Diagram Container
├─ Level 1: Container Box (border, padding, background)
│
├─ Level 2: Image Display
│  ├─ Max width: 700px
│  ├─ Max height: 500px
│  ├─ Background: white
│  └─ Shadow: subtle
│
└─ Level 3: Metadata Section
   ├─ Background: white
   ├─ Left border: purple (#7b1fa2)
   ├─ Font size: 12px
   └─ Alignment: centered

COMPONENT DIAGRAM DISPLAY HIERARCHY

Diagram Container
├─ Level 1: Container Box (smaller borders, lighter padding)
│
├─ Level 2: Image Display
│  ├─ Max height: 400px
│  ├─ Background: white
│  └─ Shadow: subtle
│
└─ Level 3: Metadata Section
   ├─ Background: white
   ├─ Left border: purple (#7b1fa2)
   ├─ Font size: 11px
   └─ Multiple metadata lines
```

---

## ⚙️ Technical Stack

```
┌────────────────────────────────────────────┐
│         Technology Stack                   │
├────────────────────────────────────────────┤
│                                            │
│ Frontend Framework                         │
│ └─ Angular 19.x (Standalone Components)   │
│                                            │
│ Language                                   │
│ └─ TypeScript 5.x                          │
│                                            │
│ Styling                                    │
│ └─ CSS3 (Component scoped)                 │
│                                            │
│ Image Handling                             │
│ └─ HTML <img> with native lazy loading     │
│                                            │
│ State Management                           │
│ └─ Angular Component State + RxJS          │
│                                            │
│ Data Binding                               │
│ └─ Property binding [src]                  │
│ └─ Structural directives *ngIf, *ngFor     │
│ └─ Event binding (click)                   │
│                                            │
│ Build Tool                                 │
│ └─ Angular CLI with Webpack                │
│                                            │
└────────────────────────────────────────────┘
```

---

## 📈 Scalability Architecture

```
Current State (12 assets/components)
└─ Single service with mock data
   └─ All data in memory
   └─ Load time: <100ms

Growth Path (100+ assets/components)
└─ Backend API integration
   ├─ Pagination for asset list
   ├─ Lazy loading for diagrams
   └─ Load time: <500ms

Scale (1000+ assets/components)
└─ Advanced features
   ├─ Search/filter
   ├─ Caching strategy
   ├─ CDN for diagram delivery
   ├─ Virtual scrolling
   └─ Load time: <1000ms
```

---

**Version**: 1.0  
**Last Updated**: January 17, 2026  
**Status**: ✅ COMPLETE

