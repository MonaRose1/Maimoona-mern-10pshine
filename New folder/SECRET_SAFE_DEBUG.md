# Secret Safe Debugging Guide

## Testing the Double-Click Feature

### Step 1: Open Browser Console
1. Open your app at `http://localhost:5173` (or your dev URL)
2. Press `F12` or right-click and select "Inspect"
3. Go to the "Console" tab

### Step 2: Test Double-Click
1. Double-click the **Search icon** (🔍) in the top-right corner
2. Watch the console for these messages:

**Expected Console Output:**

```
Single click - opening search           (if single click)
OR
Double click detected - opening Secret Safe    (if double click)
🔒 Attempting to access Secret Safe...
✅ PIN check response: {hasPin: false}
🆕 First time user - showing PIN creation dialog
🚪 PIN Dialog Open State: true | First Time: true
```

### Step 3: Check What's Happening

#### If you see the console logs:
- ✅ Double-click is working
- ✅ Function is being called
- ❓ Check if dialog state is changing

#### If dialog doesn't appear but logs show `🚪 PIN Dialog Open State: true`:
- Problem: Dialog component might not be rendering
- Check browser console for React errors

#### If you get an error on `/api/secret/check-pin`:
- Problem: Backend not running or route not working
- Solution: Check backend server is running on port 5000

### Step 4: Manual Test
Open browser console and run:
```javascript
// Test if dialog opens manually
window.testSecretDialog = () => {
  const event = new Event('click');
  document.querySelector('[data-testid="button-search"]').click();
  setTimeout(() => {
    document.querySelector('[data-testid="button-search"]').click();
  }, 100);
};

// Run it
window.testSecretDialog();
```

### Common Issues & Solutions

#### Issue 1: "Failed to check PIN status" error
**Cause**: Backend API not responding  
**Solution**: 
1. Check backend is running: `cd backend/server && npm start`
2. Check console network tab for the request status

#### Issue 2: Single click opens search immediately
**Cause**: Clicking too slowly  
**Solution**: Click twice quickly within 0.4 seconds

#### Issue 3: Dialog state changes but nothing appears
**Cause**: Component import or rendering issue  
**Solution**: Check browser console for errors like:
- "Element type is invalid"
- "Cannot read property"

#### Issue 4: Console shows errors from Dialog component
**Cause**: Missing dependencies or incorrect props  
**Solution**: Check that `secret-pin-dialog.jsx` has all imports

### Debugging Commands

Run in browser console:

```javascript
// Check if SecretPinDialog component exists
console.log("Dialog component imported:", !!window.React);

// Force open the dialog
localStorage.setItem('forceDialogOpen', 'true');

// Check dialog state from React DevTools
// Install React DevTools extension and inspect component state
```

### Backend Check

If API calls are failing:

1. **Check backend is running:**
   ```bash
   cd backend/server
   npm start
   ```

2. **Test API directly:**
   ```bash
   curl -X POST http://localhost:5000/api/secret/check-pin \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer mock-token-123"
   ```

3. **Expected response:**
   ```json
   {"hasPin": false}
   ```

### Success Checklist

When working correctly, you should see:
- ✅ Console log: "Double click detected"
- ✅ Console log: "Attempting to access Secret Safe"
- ✅ Console log: "PIN Dialog Open State: true"
- ✅ Dialog appears with "Create Secret PIN" or "Enter Secret PIN"
- ✅ Purple lock icon visible
- ✅ PIN input field visible

### Still Not Working?

1. **Clear browser cache** and reload (Ctrl+Shift+R)
2. **Check React DevTools** for component hierarchy
3. **Look for console errors** (red text)
4. **Verify imports** in Home.jsx include SecretPinDialog
5. **Check Dialog component** has useState imported

---

**Quick Test:**
Double-click search icon → Should see purple dialog with lock icon 🔒
