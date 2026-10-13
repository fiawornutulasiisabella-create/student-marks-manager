# Student Marks Management System

A responsive student results website made with HTML, CSS, and JavaScript. It demonstrates arrays as a data structure.

## Features
- Add student ID, name, and mark (0–100)
- Calculate grades and Pass/Fail remarks
- Show student count, class average, highest mark, and pass rate
- Search by student name or ID
- Delete one record or clear all records
- Save records in the browser with `localStorage`
- Export results to CSV

## Run locally
1. Extract the ZIP file.
2. Keep `index.html`, `styles.css`, and `script.js` in the same folder.
3. Open `index.html` in a modern browser.

No server or package installation is required.

## Array implementation
The program uses three parallel arrays in `script.js`:
- `studentIds[]`
- `studentNames[]`
- `studentMarks[]`

The values at the same index belong to the same student. For example, `studentIds[0]`, `studentNames[0]`, and `studentMarks[0]` describe the first student. `push()` adds a record, `splice()` removes a record at an index, and loops calculate class statistics and render the table.

## Grade scale used in this demo
- A: 80–100
- B: 70–79.99
- C: 60–69.99
- D: 50–59.99
- F: below 50

These are example thresholds; change `getGrade()` if your lecturer requires a different scale.

## Test checklist
1. Add a student with 85: expect grade A and Pass.
2. Add a student with 49: expect grade F and Fail.
3. Try a mark of 101 or -1: it should be rejected by validation.
4. Try to add the same student ID twice: it should be rejected.
5. Search for a name or ID.
6. Delete one record and confirm the summary updates.
7. Refresh the page and confirm records remain in that browser.
8. Export CSV and open the downloaded file in Excel or WPS Spreadsheets.
9. Clear all records and confirm the table and summary reset.

## Deploy with GitHub Pages
1. Create or sign in to a GitHub account.
2. Create a new public repository, for example `student-marks-manager`.
3. Upload `index.html`, `styles.css`, and `script.js` to the repository's root folder. You may also upload this README.
4. Open the repository's **Settings** → **Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main` and folder `/(root)`, then click **Save**.
7. Wait for the Pages deployment to finish. GitHub will show the website URL in the Pages section. Open it and test the features.

GitHub's menus can change slightly over time. If you use another hosting provider, upload the same three website files to a static site host such as Netlify.

## Important limitation
This is a front-end learning project. Records are saved only in the browser and device where they were entered; they are not shared between users or computers. Do not use real sensitive student information in this demo. A production system would need a secure backend, authentication, access controls, and a database.
