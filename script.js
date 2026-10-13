// Student records are stored in parallel arrays.
// The value at a given index belongs to the same student in every array.
const studentIds = [];
const studentNames = [];
const studentMarks = [];

const STORAGE_KEY = "studentMarksManager.v1";
const PASS_MARK = 50;

const form = document.getElementById("student-form");
const nameInput = document.getElementById("student-name");
const idInput = document.getElementById("student-id");
const marksInput = document.getElementById("student-marks");
const formMessage = document.getElementById("form-message");
const tableBody = document.getElementById("student-table-body");
const searchInput = document.getElementById("search-input");
const clearDialog = document.getElementById("confirm-dialog");

function getGrade(mark) {
  if (mark >= 80) return "A";
  if (mark >= 70) return "B";
  if (mark >= 60) return "C";
  if (mark >= 50) return "D";
  return "F";
}

function getRemark(mark) {
  return mark >= PASS_MARK ? "Pass" : "Fail";
}

function showMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle("error", isError);
}

function saveRecords() {
  const records = studentIds.map((id, index) => ({
    id,
    name: studentNames[index],
    mark: studentMarks[index]
  }));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    showMessage("Records are available for this session, but this browser could not save them.", true);
  }
}

function loadRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return;
    saved.forEach((record) => {
      if (record && typeof record.id === "string" &&
          typeof record.name === "string" &&
          Number.isFinite(record.mark) && record.mark >= 0 && record.mark <= 100) {
        studentIds.push(record.id);
        studentNames.push(record.name);
        studentMarks.push(record.mark);
      }
    });
  } catch (error) {
    // If saved data is invalid, start with empty arrays.
  }
}

function addStudent(id, name, mark) {
  studentIds.push(id);
  studentNames.push(name);
  studentMarks.push(mark);
  saveRecords();
  render();
}

function removeStudent(index) {
  // Remove matching positions from all three arrays to keep records aligned.
  studentIds.splice(index, 1);
  studentNames.splice(index, 1);
  studentMarks.splice(index, 1);
  saveRecords();
  render();
  showMessage("Student record deleted.");
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  tableBody.replaceChildren();

  const visibleIndices = [];
  for (let i = 0; i < studentIds.length; i++) {
    const matches = studentIds[i].toLowerCase().includes(query) ||
                    studentNames[i].toLowerCase().includes(query);
    if (matches) visibleIndices.push(i);
  }

  if (visibleIndices.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 7;
    cell.textContent = studentIds.length === 0
      ? "No students yet. Add a student or load sample data."
      : "No students match your search.";
    row.appendChild(cell);
    tableBody.appendChild(row);
  } else {
    visibleIndices.forEach((index, visibleNumber) => {
      const row = document.createElement("tr");
      const values = [
        String(visibleNumber + 1),
        studentIds[index],
        studentNames[index],
        `${studentMarks[index]}%`
      ];
      values.forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      const gradeCell = document.createElement("td");
      const grade = document.createElement("span");
      grade.className = "grade-pill";
      grade.textContent = getGrade(studentMarks[index]);
      gradeCell.appendChild(grade);
      row.appendChild(gradeCell);

      const remarkCell = document.createElement("td");
      const remark = document.createElement("span");
      const passed = studentMarks[index] >= PASS_MARK;
      remark.className = `remark-pill ${passed ? "pass" : "fail"}`;
      remark.textContent = getRemark(studentMarks[index]);
      remarkCell.appendChild(remark);
      row.appendChild(remarkCell);

      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-button";
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("aria-label", `Delete ${studentNames[index]}`);
      deleteButton.addEventListener("click", () => removeStudent(index));
      actionCell.appendChild(deleteButton);
      row.appendChild(actionCell);
      tableBody.appendChild(row);
    });
  }

  updateSummary();
}

function updateSummary() {
  const count = studentMarks.length;
  document.getElementById("student-count").textContent = count;

  if (count === 0) {
    document.getElementById("class-average").textContent = "—";
    document.getElementById("highest-mark").textContent = "—";
    document.getElementById("pass-rate").textContent = "—";
    return;
  }

  // Array loops calculate total, highest score, and number of passes.
  let total = 0;
  let highest = studentMarks[0];
  let passes = 0;
  for (let i = 0; i < studentMarks.length; i++) {
    total += studentMarks[i];
    if (studentMarks[i] > highest) highest = studentMarks[i];
    if (studentMarks[i] >= PASS_MARK) passes++;
  }

  document.getElementById("class-average").textContent = `${(total / count).toFixed(1)}%`;
  document.getElementById("highest-mark").textContent = `${highest}%`;
  document.getElementById("pass-rate").textContent = `${((passes / count) * 100).toFixed(0)}%`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = idInput.value.trim();
  const name = nameInput.value.trim();
  const mark = Number(marksInput.value);

  if (!id || !name || marksInput.value === "") {
    showMessage("Please complete all fields.", true);
    return;
  }
  if (!Number.isFinite(mark) || mark < 0 || mark > 100) {
    showMessage("Enter a valid mark from 0 to 100.", true);
    return;
  }
  if (studentIds.some((existingId) => existingId.toLowerCase() === id.toLowerCase())) {
    showMessage("That student ID already exists. Use a unique ID.", true);
    return;
  }

  addStudent(id, name, mark);
  form.reset();
  nameInput.focus();
  showMessage(`Added ${name}'s result successfully.`);
});

searchInput.addEventListener("input", render);

document.getElementById("load-sample").addEventListener("click", () => {
  const samples = [
    { id: "IT2026-001", name: "Ama Mensah", mark: 85 },
    { id: "IT2026-002", name: "Kofi Boateng", mark: 72 },
    { id: "IT2026-003", name: "Yaw Owusu", mark: 46 },
    { id: "IT2026-004", name: "Abena Asare", mark: 64 }
  ];
  let added = 0;
  samples.forEach((sample) => {
    if (!studentIds.some((id) => id.toLowerCase() === sample.id.toLowerCase())) {
      studentIds.push(sample.id);
      studentNames.push(sample.name);
      studentMarks.push(sample.mark);
      added++;
    }
  });
  saveRecords();
  render();
  showMessage(added ? `Loaded ${added} sample student(s).` : "Sample data is already loaded.");
});

document.getElementById("export-csv").addEventListener("click", () => {
  if (studentIds.length === 0) {
    showMessage("Add at least one student before exporting.", true);
    return;
  }
  const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const rows = [["Student ID", "Name", "Mark", "Grade", "Remark"]];
  for (let i = 0; i < studentIds.length; i++) {
    rows.push([
      studentIds[i], studentNames[i], studentMarks[i],
      getGrade(studentMarks[i]), getRemark(studentMarks[i])
    ]);
  }
  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "student-results.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showMessage("CSV file exported.");
});

document.getElementById("clear-all").addEventListener("click", () => {
  if (typeof clearDialog.showModal === "function") clearDialog.showModal();
  else if (window.confirm("Clear all student records?")) clearAllRecords();
});

document.getElementById("confirm-clear").addEventListener("click", (event) => {
  // The dialog's submit event is handled below so Cancel never clears records.
  event.preventDefault();
  clearDialog.close("confirm");
});

clearDialog.addEventListener("close", () => {
  if (clearDialog.returnValue === "confirm") clearAllRecords();
});

function clearAllRecords() {
  studentIds.length = 0;
  studentNames.length = 0;
  studentMarks.length = 0;
  localStorage.removeItem(STORAGE_KEY);
  render();
  showMessage("All student records have been cleared.");
}

loadRecords();
render();
