const form = document.getElementById('enrollmentForm');
const studentList = document.getElementById('studentList');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('studentName').value.trim();
  const id = document.getElementById('studentID').value.trim();
  const course = document.getElementById('course').value.trim();
  const dob = document.getElementById('dob').value.trim();
  const enrollDate = document.getElementById('enrollDate').value.trim();
  const address = document.getElementById('address').value.trim();
  const completed = document.getElementById('completed').value;

  if (!name || !id || !course || !dob || !enrollDate || !address || !completed) {
    alert('Please fill out all fields.');
    return;
  }

  // Validate proper DD/MM/YYYY format and logical date correctness
  if (!isValidFullDate(dob) || !isValidFullDate(enrollDate)) {
    alert('Please enter valid dates in DD/MM/YYYY format (e.g., 21/07/2023).');
    return;
  }

  createStudentCard(name, id, course, dob, enrollDate, address, completed);
  form.reset();
  alert('Student successfully enrolled!');
});

// Regex & Logical Validator
function isValidFullDate(dateStr) {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(regex);
  if (!match) return false;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  // Check valid month and day range
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  // Now create a Date object using zero-based month
  const date = new Date(year, month - 1, day);

  // Validate whether the Date object matches the input (catches overflows like 31/02/2023)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}


// Create and display a student card
function createStudentCard(name, id, course, dob, enrollDate, address, completed) {
  const card = document.createElement('div');
  card.className = 'student-card';

  const info = document.createElement('div');
  info.className = 'student-info';
  info.innerHTML = `
    <strong>${name}</strong>
    ID: ${id}<br>
    Course: ${course}<br>
    DOB: ${dob}<br>
    Enrolled: ${enrollDate}<br>
    Address: ${address}<br>
    Completed: ${completed}
  `;

  const removeBtn = createButton('Remove', '#ff4d4f', () => {
    if (confirm(`Remove ${name}?`)) {
      studentList.removeChild(card);
      alert('Student removed!');
    }
  });

  const editBtn = createButton('Edit', '#f0ad4e', () => {
    enterEditMode(card, name, id, course, dob, enrollDate, address, completed);
  });

  const btnGroup = document.createElement('div');
  btnGroup.className = 'action-buttons';
  btnGroup.append(editBtn, removeBtn);

  card.append(info, btnGroup);
  studentList.appendChild(card);
}

// Button generator
function createButton(text, bgColor, onClick) {
  const button = document.createElement('button');
  button.className = 'remove-btn';
  button.style.backgroundColor = bgColor;
  button.textContent = text;
  button.onclick = onClick;
  return button;
}

// Edit Mode Functionality
function enterEditMode(card, name, id, course, dob, enrollDate, address, completed) {
  card.innerHTML = '';

  const nameInput = createInput(name);
  const idInput = createInput(id);
  const courseInput = createInput(course);
  const dobInput = createInput(dob, 'text');
  const enrollInput = createInput(enrollDate, 'text');
  const addrInput = createInput(address);
  const completedSelect = createSelect(completed);

  const saveBtn = createButton('Save', '#5cb85c', () => {
    if (
      !nameInput.value.trim() || !idInput.value.trim() ||
      !courseInput.value.trim() || !dobInput.value.trim() ||
      !enrollInput.value.trim() || !addrInput.value.trim() || !completedSelect.value
    ) {
      alert('All fields are required.');
      return;
    }

    if (!isValidFullDate(dobInput.value.trim()) || !isValidFullDate(enrollInput.value.trim())) {
      alert('Enter valid dates in DD/MM/YYYY format.');
      return;
    }

    createStudentCard(
      nameInput.value.trim(),
      idInput.value.trim(),
      courseInput.value.trim(),
      dobInput.value.trim(),
      enrollInput.value.trim(),
      addrInput.value.trim(),
      completedSelect.value
    );
    studentList.removeChild(card);
    alert('Changes saved!');
  });

  const cancelBtn = createButton('Cancel', '#6c757d', () => {
    createStudentCard(name, id, course, dob, enrollDate, address, completed);
    studentList.removeChild(card);
  });

  card.append(
    nameInput,
    idInput,
    courseInput,
    dobInput,
    enrollInput,
    addrInput,
    completedSelect,
    saveBtn,
    cancelBtn
  );
}

// Helper Input Creator
function createInput(value, type = 'text') {
  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  input.className = 'edit-input';
  return input;
}

// Helper Select Creator
function createSelect(selectedValue) {
  const select = document.createElement('select');
  select.className = 'edit-input';
  ['Yes', 'No'].forEach(opt => {
    const option = document.createElement('option');
    option.value = opt;
    option.textContent = opt;
    if (opt === selectedValue) option.selected = true;
    select.appendChild(option);
  });
  return select;
}
