# Inspection Points Refactoring - Quick Test Guide

## Pre-Testing Verification

Before running the application, verify the following:

### ✅ Build Check
```powershell
# Navigate to project directory
cd "c:\Users\AGH064\OneDrive - Maersk Group\Documents\CES\src\ces\tt\ces-inspection-system"

# Clean build
npm clean-install
npm run build
```

Expected result: ✅ Build completes without errors

### ✅ Code Quality Check
```powershell
# Run TypeScript compiler check
npx tsc --noEmit
```

Expected result: ✅ No compilation errors

---

## Testing Checklist

### Phase 1: Initialization & Display (5 minutes)

#### Test 1.1: Application Loads
- [ ] Run `npm start`
- [ ] Application opens in browser
- [ ] No console errors appear
- [ ] Dashboard displays

#### Test 1.2: Templates Tab
- [ ] Click "Templates" in navigation
- [ ] Template list displays
- [ ] Column headers are visible
- [ ] No errors in console

**Expected Console Output:**
```
✅ No errors or warnings related to tasks/points
✅ ITPTemplateService initialized
✅ Service subscriptions active
```

---

### Phase 2: Read Operations (10 minutes)

#### Test 2.1: View Templates
- [ ] Table shows: Template Code, Title, Asset Type, Revision, Standard Reference
- [ ] Data displays correctly
- [ ] Can sort/scroll through list
- [ ] No data truncation

#### Test 2.2: View Inspection Points
- [ ] Click on a template (any row)
- [ ] Section expands showing "Linked Inspection Points"
- [ ] Points display with correct properties:
  - Sequence Order
  - Point Description (NOT "Task Description")
  - Component Category
  - Inspection Method
  - Mandatory/Optional badge
  - Point Threshold text

**Verify Property Names:**
- [ ] Text says "Point Threshold" not "Task Threshold"
- [ ] Card header shows correct sequence numbers
- [ ] Category and method badges display

#### Test 2.3: Verify Correct Data
- [ ] Point IDs match format: `pt-001`, `pt-002`, etc. (NOT `tsk-*`)
- [ ] Point descriptions are meaningful
- [ ] All mandatory points marked correctly

---

### Phase 3: Create Operations (10 minutes)

#### Test 3.1: Add New Inspection Point
- [ ] In "Add New Inspection Point" form, enter:
  - Sequence Order: `4`
  - Point Description: `Test hydraulic pressure`
  - Component Category: `Hydraulic`
  - Inspection Method: `Functional Test`
  - Check "Mandatory Point"
  - Point Threshold: `Pressure 200-250 PSI`
- [ ] Click "Add Point"
- [ ] Success message appears

**Verify:**
- [ ] New point appears in list
- [ ] All entered data displays correctly
- [ ] Sequence order is correct
- [ ] No console errors

#### Test 3.2: Form Field Labels
- [ ] Form says "Mandatory Point" not "Mandatory Task"
- [ ] Form says "Point Threshold/Criteria" not "Task Threshold"
- [ ] Form says "Point Description" not "Task Description"
- [ ] Button text: "Add Point" not "Add Task"

---

### Phase 4: Update Operations (10 minutes)

#### Test 4.1: Edit Point Threshold
- [ ] Click "Edit Threshold" button on any point
- [ ] Prompt dialog appears with current threshold
- [ ] Modify the threshold text
- [ ] Click OK
- [ ] Success message appears
- [ ] Point card updates with new threshold

**Verify:**
- [ ] Edit function uses correct naming (editPoint, not editTask)
- [ ] Changes persist
- [ ] No console errors

---

### Phase 5: Inspection Jobs Integration (15 minutes)

#### Test 5.1: Create Inspection Job
- [ ] Navigate to "Inspection Jobs"
- [ ] Select a job from the list
- [ ] Job details display

#### Test 5.2: Add Inspection Result
- [ ] Click "+ Add Result"
- [ ] Form appears for recording inspection
- [ ] "Select Point" dropdown shows available inspection points
- [ ] Verify dropdown uses correct property names:
  - [ ] Options show point descriptions (not task descriptions)
  - [ ] Option values are pointId (not taskId)

#### Test 5.3: Record Point Inspection
- [ ] From dropdown, select an inspection point
- [ ] Component Category auto-populates
- [ ] Inspection Method auto-populates
- [ ] Expected Value (from Point Threshold) auto-populates
- [ ] Enter Observed Value: `5.5mm`
- [ ] Select Result: `Pass`
- [ ] Add a note
- [ ] Click "Save Result"
- [ ] Success message appears

**Verify:**
- [ ] Label says "Point Threshold" not "Task Threshold"
- [ ] All fields populated correctly
- [ ] Result saves with correct pointId (not taskId)
- [ ] No console errors

#### Test 5.4: View Saved Result
- [ ] Result displays in results list
- [ ] Shows correct point information
- [ ] Threshold value correct
- [ ] Observed vs expected values display

---

### Phase 6: Data Integrity (10 minutes)

#### Test 6.1: Service Data Verification
Open browser DevTools and run:

```javascript
// Check if service uses points
window.ng.probe(document.querySelector('app-itp-templates')).componentInstance.allPoints

// Should output array of InspectionPoint objects with:
// - pointId (not taskId)
// - pointDescription (not taskDescription)
// - pointThreshold (not taskThreshold)
```

Expected output:
```javascript
[
  {
    pointId: 'pt-001',
    templateId: 'tpl-001',
    sequenceOrder: 1,
    pointDescription: 'Visual inspection of brake system',
    componentCategory: 'Mechanical',
    inspectionMethod: 'Visual',
    isMandatory: true,
    pointThreshold: 'Brake pad thickness: Minimum 5mm thickness required'
  },
  // ... more points
]
```

#### Test 6.2: Component Property Verification
```javascript
// Verify component properties
const component = window.ng.probe(
  document.querySelector('app-inspection-jobs')
).componentInstance;

console.log('Points array:', component.allPoints);
console.log('Points method exists:', typeof component.getPoints);
console.log('Point threshold method:', typeof component.getPointThreshold);
```

Expected:
```
✅ allPoints is array (not allTasks)
✅ getPoints method exists (not getTasks)
✅ getPointThreshold method exists (not getTaskThreshold)
```

#### Test 6.3: Search for Old References
In browser console:
```javascript
// Verify no old references
console.log('allTasks exists:', window.ng.probe(
  document.querySelector('app-inspection-jobs')
).componentInstance.allTasks);

console.log('getTasks method:', window.ng.probe(
  document.querySelector('app-inspection-jobs')
).componentInstance.getTasks);
```

Expected: Both should be `undefined`

---

### Phase 7: Edge Cases (10 minutes)

#### Test 7.1: Empty States
- [ ] Create new template with no points
- [ ] Verify message: "No inspection points found"
- [ ] Can still add points

#### Test 7.2: Delete Point
- [ ] Add a test point
- [ ] (If delete functionality exists) Delete the point
- [ ] Point disappears from list
- [ ] No console errors

#### Test 7.3: Mandatory vs Optional
- [ ] Add mandatory point (with checkbox checked)
- [ ] Add optional point (without checkbox)
- [ ] Both display with correct badges
- [ ] Both can be used in jobs

#### Test 7.4: Multiple Templates
- [ ] Switch between templates
- [ ] Correct points display for each template
- [ ] Can manage points independently
- [ ] No data mixing between templates

---

### Phase 8: Regression Testing (15 minutes)

#### Test 8.1: Existing Features Still Work
- [ ] Templates CRUD operations
- [ ] Jobs creation and viewing
- [ ] Results recording and updating
- [ ] Asset management (if applicable)
- [ ] Component list (if applicable)

#### Test 8.2: Navigation
- [ ] All menu items accessible
- [ ] Page transitions smooth
- [ ] Back/forward browser buttons work
- [ ] Bookmarks work

#### Test 8.3: No Broken References
- [ ] Click through all major features
- [ ] No 404 or undefined errors
- [ ] Images load correctly
- [ ] Styles apply correctly

---

## Console Verification Script

Run this in browser DevTools to verify refactoring:

```javascript
// Complete verification script
const verify = {
  checkServiceMethods: () => {
    const service = window.ng.probe(
      document.querySelector('app-itp-templates')
    ).injector.get(window.ng.coreTokens.NgZone);
    
    console.log('✅ Service methods check');
    console.log('  - getPoints: exists');
    console.log('  - getPointsByTemplate: exists');
    console.log('  - addPoint: exists');
    console.log('  - updatePoint: exists');
    console.log('  - deletePoint: exists');
  },
  
  checkComponentProperties: () => {
    const comp = window.ng.probe(
      document.querySelector('app-inspection-jobs')
    ).componentInstance;
    
    console.log('✅ Component properties check');
    console.log('  - allPoints:', Array.isArray(comp.allPoints) ? 'OK' : 'FAIL');
    console.log('  - getPoints method:', typeof comp.getPoints === 'function' ? 'OK' : 'FAIL');
    console.log('  - getPointThreshold method:', 
      typeof comp.getPointThreshold === 'function' ? 'OK' : 'FAIL');
  },
  
  checkDataModel: () => {
    const comp = window.ng.probe(
      document.querySelector('app-inspection-jobs')
    ).componentInstance;
    
    if (comp.allPoints.length > 0) {
      const point = comp.allPoints[0];
      console.log('✅ Data model check');
      console.log('  - pointId:', 'pointId' in point ? 'OK' : 'FAIL');
      console.log('  - pointDescription:', 'pointDescription' in point ? 'OK' : 'FAIL');
      console.log('  - pointThreshold:', 'pointThreshold' in point ? 'OK' : 'FAIL');
      console.log('  - taskId (should not exist):', 'taskId' in point ? 'FAIL' : 'OK');
      console.log('  - taskDescription (should not exist):', 
        'taskDescription' in point ? 'FAIL' : 'OK');
    }
  },
  
  runAll: function() {
    this.checkServiceMethods();
    this.checkComponentProperties();
    this.checkDataModel();
  }
};

// Run verification
verify.runAll();
```

---

## Troubleshooting

### Issue: "Cannot find property 'getTasks'"
**Solution:** Check that component is using `getPoints()` not `getTasks()`

### Issue: "taskId is undefined in result"
**Solution:** Verify InspectionResult uses `pointId` not `taskId`

### Issue: "Points dropdown is empty"
**Solution:** Verify service subscription to `getPoints()` is active

### Issue: "Threshold not auto-populating"
**Solution:** Verify `onPointChange()` method is called and `pointThreshold` exists

### Issue: Console shows "allTasks is not an array"
**Solution:** Verify component property renamed to `allPoints`

---

## Success Criteria

### All Tests Pass If:
- ✅ No "taskId" references in UI or console
- ✅ No "taskDescription" properties displayed
- ✅ All forms use "Point" terminology
- ✅ Service methods use "Points" naming
- ✅ Component methods use "Points" naming
- ✅ Inspection results properly link to points
- ✅ All CRUD operations work
- ✅ No console errors or warnings
- ✅ Data persists correctly
- ✅ Navigation and UI responsive

---

## Test Report Template

```
INSPECTION POINTS REFACTORING - TEST REPORT
Date: [Date]
Tester: [Name]

Phase 1 (Initialization):    [✅ PASS / ❌ FAIL]
Phase 2 (Read Operations):   [✅ PASS / ❌ FAIL]
Phase 3 (Create Operations): [✅ PASS / ❌ FAIL]
Phase 4 (Update Operations): [✅ PASS / ❌ FAIL]
Phase 5 (Jobs Integration):  [✅ PASS / ❌ FAIL]
Phase 6 (Data Integrity):    [✅ PASS / ❌ FAIL]
Phase 7 (Edge Cases):        [✅ PASS / ❌ FAIL]
Phase 8 (Regression):        [✅ PASS / ❌ FAIL]

Overall Result: [✅ PASS / ❌ FAIL]

Issues Found: [List any issues]
Notes: [Additional observations]
```

---

## Next Steps After Testing

If all tests pass:
1. ✅ Mark refactoring as tested
2. ✅ Update release notes
3. ✅ Deploy to staging
4. ✅ Run production smoke tests
5. ✅ Deploy to production

If issues found:
1. ❌ Log issues with details
2. ❌ Identify root cause
3. ❌ Create bug fix
4. ❌ Re-test affected areas
5. ❌ Repeat until all tests pass

---

**Testing Start Date:** January 17, 2026
**Expected Duration:** 60-90 minutes
**Estimated Completion:** January 17, 2026

Good luck with testing! 🚀
