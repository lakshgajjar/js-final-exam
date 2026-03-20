let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

const form = document.getElementById("studentForm");
const tableBody = document.getElementById("tableBody");
const search = document.getElementById("search");

students = students.map(s => ({
  ...s,
  attendance: s.attendance || [],
  marks: s.marks || [],
  fees: s.fees || { total: 0, paid: 0, pending: 0, status: "Pending" }
}));

function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
}

function displayData(data = students) {
  tableBody.innerHTML = "";

  data.forEach((s, index) => {
    const attendance = s.attendance.length
      ? s.attendance.map(a => `${a.date} (${a.status})`).join("<br>")
      : "No Data";

    const marks = s.marks.length
      ? s.marks.map(m => `${m.subject}: ${m.percentage}% (${m.grade})`).join("<br>")
      : "No Data";

    const fees = `
      ₹${s.fees.total}<br>
      Paid: ₹${s.fees.paid}<br>
      Pending: ₹${s.fees.pending}<br>
      ${s.fees.status}
    `;

    tableBody.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.course}</td>
        <td>${s.city}</td>
        <td>${attendance}</td>
        <td>${marks}</td>
        <td>${fees}</td>
        <td>
          <button onclick="editStudent(${index})">Edit</button>
          <button onclick="deleteStudent(${index})">Delete</button>
          <button onclick="addAttendance(${index})">Attend</button>
          <button onclick="addMarks(${index})">Marks</button>
          <button onclick="addFees(${index})">Fees</button>
        </td>
      </tr>
    `;
  });
}

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const idVal = document.getElementById("id").value.trim();
  const nameVal = document.getElementById("name").value.trim();
  const fatherVal = document.getElementById("father").value.trim();
  const mobileVal = document.getElementById("mobile").value.trim();
  const emailVal = document.getElementById("email").value.trim();
  const courseVal = document.getElementById("course").value.trim();
  const cityVal = document.getElementById("city").value.trim();
  const genderVal = document.getElementById("gender").value;
  const dateVal = document.getElementById("date").value;

  if (!idVal || !nameVal || !mobileVal || !emailVal) {
    alert("Please fill required fields!");
    return;
  }

  const exists = students.find((s, i) => s.id === idVal && i !== editIndex);
  if (exists) {
    alert("Student ID already exists!");
    return;
  }

  const student = {
    id: idVal,
    name: nameVal,
    father: fatherVal,
    mobile: mobileVal,
    email: emailVal,
    course: courseVal,
    city: cityVal,
    gender: genderVal,
    date: dateVal,
    attendance: editIndex === -1 ? [] : students[editIndex].attendance,
    marks: editIndex === -1 ? [] : students[editIndex].marks,
    fees: editIndex === -1
      ? { total: 0, paid: 0, pending: 0, status: "Pending" }
      : students[editIndex].fees
  };

  if (editIndex === -1) {
    students.push(student);
  } else {
    students[editIndex] = student;
    editIndex = -1;
  }

  saveData();
  displayData();
  form.reset();

  alert("Student Saved Successfully");
});

function deleteStudent(index) {
  if (confirm("Are you sure?")) {
    students.splice(index, 1);
    saveData();
    displayData();
  }
}

function editStudent(index) {
  let s = students[index];

  document.getElementById("id").value = s.id;
  document.getElementById("name").value = s.name;
  document.getElementById("father").value = s.father;
  document.getElementById("mobile").value = s.mobile;
  document.getElementById("email").value = s.email;
  document.getElementById("course").value = s.course;
  document.getElementById("city").value = s.city;
  document.getElementById("gender").value = s.gender;
  document.getElementById("date").value = s.date;

  editIndex = index;
}

search.addEventListener("keyup", () => {
  let value = search.value.toLowerCase();

  let filtered = students.filter(s =>
    s.name.toLowerCase().includes(value) ||
    s.id.toLowerCase().includes(value)
  );

  displayData(filtered);
});

function addAttendance(index) {
  let date = prompt("Enter Date (YYYY-MM-DD):");

  let status = prompt("Select:\n1. Present\n2. Absent");

  if (status === "1") status = "Present";
  else if (status === "2") status = "Absent";
  else {
    alert("Invalid choice");
    return;
  }

  if (date) {
    students[index].attendance.push({ date, status });
    saveData();
    displayData();
  }
}

function addMarks(index) {
  let subject = prompt("Subject:");
  let obtained = Number(prompt("Obtained Marks:"));
  let total = Number(prompt("Total Marks:"));

  if (subject && obtained && total) {
    let percentage = ((obtained / total) * 100).toFixed(2);

    let grade = "F";
    if (percentage >= 90) grade = "A";
    else if (percentage >= 75) grade = "B";
    else if (percentage >= 50) grade = "C";

    students[index].marks.push({ subject, obtained, total, percentage, grade });

    saveData();
    displayData();
  }
}

function addFees(index) {
  let total = Number(prompt("Total Fees:"));
  let paid = Number(prompt("Paid Fees:"));

  if (total >= 0 && paid >= 0) {
    let pending = total - paid;
    let status = pending === 0 ? "Paid" : "Pending";

    students[index].fees = { total, paid, pending, status };

    saveData();
    displayData();
  }
}

displayData();