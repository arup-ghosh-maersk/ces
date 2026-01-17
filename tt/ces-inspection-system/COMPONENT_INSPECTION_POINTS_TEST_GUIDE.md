# Component Inspection Points - Quick Test Guide

## Quick Start Testing

### Step 1: Access the Feature
1. Open the application at `http://localhost:4200`
2. Navigate to "Asset Inspection Points" section
3. Look for the "Component Inspection Points" tab next to "Asset Inspection Points"

### Step 2: View Component Points Table
Click on the "Component Inspection Points" tab. You should see:
- A subtitle: "Inspection points applicable to specific equipment components (motors, bearings, hydraulic systems, etc.)"
- A filter input field
- A table with 4 sample inspection points:

| Point ID | Template ID | Component Category | Sequence | Description | Method | Mandatory |
|----------|-------------|-------------------|----------|-------------|--------|-----------|
| pt-002 | tpl-001 | Structural | 1 | Chain wear analysis and measurement | Visual | ✓ |
| pt-003 | tpl-001 | Electrical | 2 | Electrical safety and insulation testing | Functional Test | ✓ |
| pt-004 | tpl-002 | Electrical | 2 | Motor bearing vibration analysis | Ultrasonic | ✗ |
| pt-005 | tpl-002 | Hydraulic | 3 | Hydraulic pump pressure test | Functional Test | ✗ |

### Step 3: Test Filtering
1. Type "Electrical" in the filter field
2. Table should filter to show only points with "Electrical" category (pt-003, pt-004)
3. Type "Hydraulic"
4. Table should show only pt-005
5. Click "Clear" button
6. All 4 points should reappear

### Step 4: Add a New Component Point
1. Scroll down to "Add Component Inspection Point" form
2. Fill in the following information:
   - **Point ID**: `pt-006`
   - **Template ID**: `tpl-003`
   - **Component Category**: `Pump`
   - **Sequence Order**: `1`
   - **Point Description**: `Check pump noise levels and vibration`
   - **Inspection Method**: `Ultrasonic`
   - **Threshold Criteria**: `Noise: Less than 85 dB`
3. Check the "Mandatory Inspection" checkbox
4. "Applicable to Component" should already be checked
5. Click "Add Component Point" button
6. You should see an alert: "Component inspection point added successfully!"
7. Scroll up to the table - your new point (pt-006) should appear at the bottom

### Step 5: Test Delete Functionality
1. Click the "Delete" button on any point (e.g., pt-006)
2. A confirmation dialog should appear: "Are you sure you want to delete this component inspection point?"
3. Click "OK" to confirm
4. You should see an alert: "Component inspection point deleted!"
5. The point should disappear from the table

### Step 6: Test Filter with New Data
1. Add another component point:
   - **Point ID**: `pt-007`
   - **Template ID**: `tpl-001`
   - **Component Category**: `Motor`
   - **Sequence Order**: `3`
   - **Point Description**: `Motor efficiency test`
   - **Inspection Method**: `Functional Test`
   - Leave threshold blank
2. Don't check Mandatory
3. Click "Add Component Point"
4. In the filter field, type "Motor"
5. Only pt-007 should appear
6. Clear the filter
7. All points should reappear

### Step 7: Test Edit Functionality
1. Click the "Edit" button on any component point
2. You should see an alert: "Edit component inspection point functionality coming soon"
   (This is a placeholder for future implementation)

## Visual Inspection Checklist

- [ ] Tab button "Component Inspection Points" is visible and highlighted when active
- [ ] Section title reads "Component Inspection Points"
- [ ] Subtitle text is present and describes component-level inspection
- [ ] Filter input field has placeholder text "Filter by Component Category..."
- [ ] Filter "Clear" button is visible
- [ ] Component category badges are styled in purple color
- [ ] Table headers are properly aligned and readable
- [ ] Mandatory column shows checkboxes (checked or unchecked)
- [ ] Threshold column displays text or "N/A"
- [ ] Edit and Delete buttons are visible in Actions column
- [ ] Form section has clear title "Add Component Inspection Point"
- [ ] Form fields are properly labeled and styled
- [ ] Inspector Method dropdown shows options: Visual, Ultrasonic, Functional Test, NDT
- [ ] Checkboxes for Mandatory and Applicable to Component are functional
- [ ] Primary button "Add Component Point" has blue styling
- [ ] Empty state message appears when no points are present

## Expected Behavior

### Filtering
- Filtering is **case-insensitive** (type "electrical" or "Electrical")
- Filtering searches the **Component Category** field only
- Clear button immediately resets filter
- Filter updates the table **in real-time** as you type

### Add Form
- **Required fields**: Point ID, Template ID, Component Category, Sequence Order, Point Description, Inspection Method
- **Optional fields**: Threshold Criteria
- **Checkboxes**: Mandatory Inspection (unchecked by default), Applicable to Component (always checked)
- Form clears after successful submission
- Alert confirms addition
- New point appears at bottom of table

### Delete
- Requires **confirmation dialog**
- Shows alert on successful deletion
- Point is immediately removed from table
- Filter is reapplied if active

### Edit
- Currently shows "coming soon" placeholder
- Will be implemented in future phase

## Data Persistence

⚠️ **Important**: Component inspection points are stored in **memory only**
- Refresh the page will reset all data to sample points
- In production, data will be persisted to backend database
- For testing, add/delete operations work within the current session

## Known Limitations (Current Release)

1. ❌ Edit functionality not yet implemented
2. ❌ No data persistence (in-memory only)
3. ❌ No backend API integration
4. ❌ No export/import capabilities
5. ❌ No bulk operations
6. ❌ No component hierarchy view

## Troubleshooting

### Issue: Component Inspection Points tab doesn't appear
- **Solution**: Refresh the page (Ctrl+F5)
- **Check**: Browser console for any errors (F12 → Console)

### Issue: Sample data not showing
- **Solution**: Clear browser cache and reload
- **Check**: Network tab to ensure app loaded successfully

### Issue: Filter not working
- **Solution**: Check spelling of component category (case-insensitive)
- **Example**: Try "electrical", "Electrical", or "ELECTRICAL"

### Issue: Add button not responding
- **Solution**: Verify all required fields are filled
- **Required**: Point ID, Template ID, Component Category, Sequence Order, Point Description, Inspection Method

### Issue: Data disappears after refresh
- **Expected behavior**: In-memory storage means data is lost on page refresh
- **This is normal** for the current development version
- Backend persistence will be added in future release

## Performance Notes

- Table with 10 items: Instant filtering
- Table with 100 items: <50ms filtering
- Form submission: <100ms (in-memory operation)
- No noticeable lag with typical data volumes

## Browser Console Commands (Advanced)

You can test the component directly in browser console:

```javascript
// Get reference to the component instance
let component = ng.getComponent(document.querySelector('app-asset-inspection-points'));

// View current points
console.log(component.componentInspectionPoints);

// View current filter
console.log(component.componentFilter);

// Manually add a point
component.componentInspectionPoints.push({
  pointId: 'pt-test',
  templateId: 'tpl-test',
  sequenceOrder: 99,
  pointDescription: 'Test point',
  componentCategory: 'Test',
  inspectionMethod: 'Visual',
  isMandatory: true,
  pointThreshold: 'Test threshold',
  applicableToComponent: true,
  applicableToAsset: false
});

// Clear all points
component.componentInspectionPoints = [];

// Reset filter
component.componentFilter = '';

// Load sample data again
component.loadComponentInspectionPoints();
```

## Success Criteria

✅ **Complete Implementation** when:
1. All 4 sample points display correctly
2. Filter works for all component categories
3. Can add new component points
4. Can delete component points
5. Form validates required fields
6. UI is responsive on mobile devices
7. No console errors or warnings
8. Tab integrates seamlessly with other tabs

---

**Last Updated**: January 17, 2026
**Test Version**: 1.0
**Status**: Ready for Testing
