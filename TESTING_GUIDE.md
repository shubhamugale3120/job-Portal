VIDEO TUTORIAL - HOW TO TEST VIEW DETAILS FUNCTIONALITY
=======================================================

STEP 1: OPEN BROWSER DEVELOPER CONSOLE
======================================
1. Open Firefox/Chrome
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Leave this open while testing

STEP 2: NAVIGATE TO BROWSE JOBS PAGE
====================================
1. Go to http://localhost:3000/jobs/browse
2. You should see "Find Your Dream Job" header
3. Scroll down to see job listings

STEP 3: LOOK FOR LOG MESSAGES
=============================
When the page loads, you should see console logs:
✅ "📌 Fetching job details for ID: [jobId]"
✅ "Loading jobs..."
✅ "Jobs loaded: 5 jobs"

STEP 4: TEST VIEW DETAILS BUTTON
================================

A. What to expect:
   - Every job card should have a BLUE button "👁️ View Details"
   - Even if you already applied, the View Details button should be visible

B. Click the View Details button:
   - In console, you should see: "View Details clicked for jobId: [jobId]"
   - A modal window should pop up showing full job details
   - Modal should show:
     ✅ Job Title
     ✅ Location
     ✅ Job Type
     ✅ Salary
     ✅ Full Description
     ✅ Required Skills (as blue badges)
     ✅ Applications count and posted date

C. If it doesn't work:
   - Open browser console (F12)
   - Look for ERROR messages (usually red)
   - Take a screenshot of the error
   - Common errors:
     ❌ "viewJobDetails is not defined" → Function definition missing
     ❌ "Cannot read property '_id' of undefined" → Job data missing
     ❌ "jobDetailsModal is null" → Modal HTML not found
     ❌ "bootstrap is not defined" → Bootstrap JS not loaded

STEP 5: TEST APPLY BUTTON (IF NOT ALREADY APPLIED)
==================================================

A. What to expect:
   - If you haven't applied yet, you should see GREEN "Apply" button
   - If you already applied, you should see GRAY "Already Applied" button

B. Click Apply button (if you haven't applied):
   - Modal should open showing:
     ✅ Job title at the top
     ✅ Resume URL input field (required)
     ✅ Cover Letter textarea (optional)
     ✅ Submit Application button

C. Test duplicate prevention:
   - Fill in Resume URL (e.g., "https://example.com/resume.pdf")
   - Click "Submit Application"
   - You should see: "Application submitted successfully!"
   - Modal closes
   - Try to click Apply again on the SAME job
   - You should see: "Already Applied" button now
   - The job should show status badge (e.g., "⏳ Application Pending")

STEP 6: BROWSER CONSOLE DEBUGGING
=================================

If anything fails, open the browser console and look for:

✅ SUCCESS LOGS (should appear):
   ✅ "📌 Fetching job details for ID: 6985f9e0524c951e89abeec8"
   ✅ "✅ Job details loaded: {_id, title, ...}"
   ✅ "🔄 Opening modal for job: Node.js developer"
   ✅ "✅ Modal opened successfully"

❌ ERROR LOGS (if something fails):
   ❌ "❌ Invalid job ID: undefined"
   ❌ "❌ Failed to fetch job. Status: 404"
   ❌ "❌ Modal elements not found in DOM"

STEP 7: CLEAR CACHE & RELOAD
============================
If you don't see the updated code:
1. Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. Clear browser cache
3. Hard reload: Ctrl+F5 (or Cmd+Shift+R on Mac)
4. Try again

EXPECTED BEHAVIOR CHECKLIST
==========================

✅ Page loads without errors
✅ "Find Your Dream Job" header visible
✅ 5 jobs displayed with cards
✅ Each job card has "View Details" button
✅ Click View Details → Modal opens with all job info
✅ Click Apply → Apply modal opens with form
✅ Enter resume URL → Application submitted
✅ Try to reapply → "Already Applied" button shown
✅ Console shows debug logs for each action

CONTACT SUPPORT
===============
If View Details still doesn't work:
1. Take a screenshot of the browser error
2. Open console (F12)
3. Right-click on error and select "Copy message"
4. Provide these details for debugging
