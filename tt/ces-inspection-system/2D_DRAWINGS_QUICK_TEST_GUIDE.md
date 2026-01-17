# 2D Drawings Feature - Quick Action Testing Guide

## 🚀 Quick Start Testing

Follow these steps to verify that the 2D Drawings feature is working correctly.

---

## Step 1: Start the Application

```powershell
# In PowerShell
cd "c:\Users\AGH064\OneDrive - Maersk Group\Documents\CES\src\ces\tt\ces-inspection-system"
npm start
```

The application will start on `http://localhost:4200`

---

## Step 2: Navigate to Asset List

1. Open the application in your browser
2. Navigate to the **Asset List** component
3. You should see a table with assets:
   - `asset-001` (STS-001) - Straddle Carrier Unit 1
   - `asset-002` (RTG-001) - Rubber Tyred Gantry 1

---

## Step 3: Test Asset 2D Drawings

### Test Asset-001 (STS-001)

1. **Click on Asset-001 row** in the table
   - Asset details panel should expand below the table

2. **Verify Asset Information Section**
   - Asset ID: asset-001
   - Asset Code: STS-001
   - Type: STS
   - Description: Straddle Carrier Unit 1

3. **Scroll down to "2D Asset Drawing" section**
   - ✅ Section should be visible
   - ✅ Image should display with placeholder content
   - ✅ Image shows "STS-001 2D Drawing"
   - ✅ Below image: "Asset: asset-001" and "Type: STS"

4. **Check Image Rendering**
   - Image should be contained within box
   - Image should not be stretched
   - Image should have shadow effect
   - Image should be centered

### Test Asset-002 (RTG-001)

1. **Click on Asset-002 row** in the table

2. **Verify Asset Information Section**
   - Asset ID: asset-002
   - Asset Code: RTG-001

3. **Scroll to "2D Asset Drawing" section**
   - ✅ Different image should display
   - ✅ Image shows "RTG-001 2D Drawing"
   - ✅ Asset metadata shows correct info

---

## Step 4: Test Component Tree and 2D Component Drawings

### Test Asset-001 Component Tree

1. **In Asset Details for asset-001**, scroll to **"Component Tree Structure"** section

2. **Verify Component Tree Loads**
   - ✅ Should see multiple components listed
   - ✅ Some components have expand button (▶)
   - ✅ Some components have dot (•) (no children)

3. **Expand Parent Components**

   **Component: Boom Assembly (comp-001)**
   - Click the expand button (▶) next to "Boom Assembly"
   - Button should change to collapse (▼)
   - Two child components should appear:
     - Motor Control System
     - Boom Position Sensor
   - Children should be indented to the right

4. **Select Child Component**
   - Click on **"Motor Control System"** child
   - Component detail panel should expand
   - Should show:
     - **Basic Information** section
     - **Technical Specifications** section
     - **Maintenance Information** section
     - **2D Component Drawing** section with image

5. **Verify Component 2D Drawing**
   - ✅ "2D Component Drawing" heading visible
   - ✅ Image displays showing "Control System Drawing"
   - ✅ Component metadata below:
     - Component: Motor Control System
     - Code: CONTROL-STS-001
     - Category: Electrical

6. **Test Collapse**
   - Click expand button (▼) again to collapse
   - Child components should disappear
   - Button should return to (▶)

---

## Step 5: Test Asset-002 Full Tree Structure

### Asset-002 Has More Complex Hierarchy

1. **Click on Asset-002** in asset list

2. **Scroll to Component Tree Structure**

3. **Expand Each Parent Component:**

   **Hydraulic Pump System (comp-003)**
   - Click expand (▶)
   - Should show 2 children:
     - Pump Piston Assembly
     - Pump Seal Kit
   - Each child has a 2D drawing

   **Main Bogie Wheel Assembly (comp-006)**
   - Click expand (▶)
   - Should show 2 children:
     - Wheel Hub Bearing
     - Wheel Tyre
   - Each child has a 2D drawing

   **Programmable Logic Controller (comp-009)**
   - Click expand (▶)
   - Should show 1 child:
     - Control Cable Harness
   - Child has a 2D drawing

---

## Step 6: Test Responsive Design

### Test on Desktop (1920px width)
1. All diagrams should display with plenty of space
2. Tree should not have horizontal scrolling
3. Text should be fully readable
4. Badges should display on single lines

### Test on Tablet (768px width)
1. Resize browser window to 768px width
   ```powershell
   # Or manually drag browser window
   ```
2. Verify:
   - ✅ Diagrams still visible and not stretched
   - ✅ Tree indentation still visible
   - ✅ No horizontal scrolling required
   - ✅ Text remains readable

### Test on Mobile (480px width)
1. Resize browser window to 480px width
2. Verify:
   - ✅ Single column layout
   - ✅ Diagrams scale appropriately
   - ✅ All content accessible without horizontal scroll
   - ✅ Touch-friendly spacing maintained

---

## Step 7: Browser Developer Tools Testing

### Open Developer Console (F12)

1. **Check for Errors**
   - Open DevTools: **F12**
   - Go to **Console** tab
   - ✅ Should show NO red errors
   - ✅ May see some warnings (acceptable)

2. **Monitor Network Requests**
   - Go to **Network** tab
   - Reload page (Ctrl+R)
   - Look for image requests:
     - `via.placeholder.com/700x500...` (asset diagrams)
     - `via.placeholder.com/400x300...` (component diagrams)
   - ✅ All requests should return **200 OK** status

3. **Check Image URLs**
   - In **Network** tab, click on image requests
   - Verify URLs are properly formatted
   - Verify image previews display correctly

### Inspect Element

1. Right-click on a diagram image
2. Select **"Inspect"** or **"Inspect Element"**
3. Verify HTML structure:
   ```html
   <div class="diagram-container">
     <img class="diagram-image" src="..." alt="...">
     <div class="diagram-info">...</div>
   </div>
   ```
4. Verify CSS is applied:
   - `max-width: 700px` or `400px`
   - `max-height: 500px` or `400px`
   - `object-fit: contain`
   - `display: block`

---

## Step 8: Fallback Testing

### Verify Fallback UI Works

1. **Check Component Without Diagram**
   - Find a component without diagramUrl
   - Select it in the tree
   - Should see message: **"No 2D drawing available for this component"**
   - Message should display in styled box
   - Layout should not break

---

## Troubleshooting Checklist

### Diagrams Not Showing?
- [ ] Image container visible? (empty gray box)
- [ ] Browser console shows errors? (F12 → Console)
- [ ] Network requests failing? (F12 → Network)
- [ ] Try hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
- [ ] Check internet connection (need to reach via.placeholder.com)

### Tree Not Expanding?
- [ ] Expand button visible (▶)?
- [ ] Clicked in the right spot? (click the arrow, not the text)
- [ ] Looking at parent component? (has expand button)
- [ ] Try selecting asset again

### Components Not Showing?
- [ ] Correct asset selected?
- [ ] Tree container visible below asset info?
- [ ] Scroll down to see tree section?
- [ ] Check browser console for errors

### Layout Broken?
- [ ] Resize window to see if responsive
- [ ] Zoom out to 80% (Ctrl+-) to see full layout
- [ ] Try different browser
- [ ] Clear browser cache (Ctrl+Shift+Delete)

---

## Visual Verification Checklist

### Asset Diagrams
- [ ] Gray box with border visible
- [ ] Diagram image inside box, centered
- [ ] Image has shadow effect
- [ ] Asset metadata below image
- [ ] Professional appearance with spacing

### Component Diagrams
- [ ] Similar styling to asset diagrams
- [ ] Slightly smaller than asset diagrams
- [ ] Component metadata below image
- [ ] Shows in expanded detail panel
- [ ] Professional appearance maintained

### Tree Structure
- [ ] Root components listed
- [ ] Parent components have expand button (▶)
- [ ] Child components indented
- [ ] Children only show when parent expanded
- [ ] Expand button changes to (▼) when expanded
- [ ] Text is readable and properly styled

### Overall UX
- [ ] Color scheme consistent with app
- [ ] Spacing feels balanced
- [ ] No overlapping elements
- [ ] Professional appearance
- [ ] Easy to understand hierarchy

---

## Expected Component Counts

### Asset-001 (STS-001)
- **Total Components:** 3
- **Root Components:** 2
  - comp-001: Boom Assembly (has 2 children)
  - comp-002: Main Drive Motor (no children)
- **Child Components:** 1 (under Boom Assembly)
  - comp-002a: Motor Control System
  - comp-002b: Boom Position Sensor

### Asset-002 (RTG-001)
- **Total Components:** 8
- **Root Components:** 3
  - comp-003: Hydraulic Pump System (has 2 children)
  - comp-006: Main Bogie Wheel Assembly (has 2 children)
  - comp-009: Programmable Logic Controller (has 1 child)
- **Child Components:** 5
  - comp-004: Pump Piston Assembly
  - comp-005: Pump Seal Kit
  - comp-007: Wheel Hub Bearing
  - comp-008: Wheel Tyre
  - comp-010: Control Cable Harness

---

## Performance Benchmarks

Test these timings:

| Operation | Expected Time | Your Measurement |
|-----------|---------------|------------------|
| Asset list load | < 1 second | _____ |
| Asset details render | < 500ms | _____ |
| Tree expansion | < 200ms | _____ |
| Component selection | < 300ms | _____ |
| Diagram image load | < 1 second | _____ |
| Responsive resize | < 100ms | _____ |

---

## Success Criteria

Mark these as ✅ when verified:

### 2D Diagrams Working
- [ ] Asset-001 diagram displays
- [ ] Asset-002 diagram displays
- [ ] Different images for different assets
- [ ] Professional styling applied
- [ ] Metadata displays correctly

### Component Tree Working
- [ ] Components load for selected asset
- [ ] Parent components show expand button
- [ ] Child components appear when expanded
- [ ] Children properly indented
- [ ] Collapse hides children

### Component Diagrams Working
- [ ] Diagrams show in detail panel
- [ ] All components have diagrams
- [ ] Metadata displays below diagram
- [ ] Professional styling applied
- [ ] Fallback shows when unavailable

### Responsive Design Working
- [ ] Desktop (1920px): Full layout
- [ ] Tablet (768px): Single column, no scroll
- [ ] Mobile (480px): Optimized layout
- [ ] All text readable at all sizes

### No Errors
- [ ] Console: No red errors
- [ ] Network: All 200 OK responses
- [ ] No broken layout
- [ ] No missing elements

---

## If All Tests Pass

🎉 **Congratulations!** The 2D Drawings feature is working correctly.

### Next Steps
1. Deploy to staging environment
2. Perform user acceptance testing
3. Deploy to production
4. Monitor performance in production

---

## If Tests Fail

1. **Check the Troubleshooting Guide**
   - See `2D_DRAWINGS_TROUBLESHOOTING_GUIDE.md`

2. **Review Implementation Details**
   - See `DEVELOPER_GUIDE.md`

3. **Check Component Code**
   - `asset-list.component.ts` - Main implementation
   - `asset.service.ts` - Asset data
   - `component-master.service.ts` - Component data

4. **Verify Data Structure**
   - Open browser DevTools
   - Go to Console
   - Run: `console.table(assets)` to see asset data
   - Run: `console.table(components)` to see component data

---

**Test Date:** _____________  
**Tested By:** _____________  
**Result:** ☐ Pass ☐ Fail  
**Notes:** ___________________________________________________________________
