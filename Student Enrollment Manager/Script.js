const form = document.getElementById('enrollmentForm');
const studentList = document.getElementById('studentList');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('studentName').value.trim();
  const id = document.getElementById('studentID').value.trim();
  const course = document.getElementById('course').value.trim();
  const dob = document.getElementById('dob').value;
  const enrollDate = document.getElementById('enrollDate').value;
  const address = document.getElementById('address').value.trim();
  const completed = document.getElementById('completed').value;

  if (!name || !id || !course || !dob || !enrollDate || !address || !completed) {
    alert('Please fill out all fields.');
    return;
  }

  // Validate date format (DD/MM/YYYY)
  if (!isValidDate(dob) || !isValidDate(enrollDate)) {
    alert('Please enter valid dates in the format DD/MM/YYYY.');
    return;
  }

  createStudentCard(name, id, course, dob, enrollDate, address, completed);
  form.reset();
  alert('Student successfully enrolled!');
});

function isValidDate(dateString) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(dateString);
}

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

function createButton(text, bgColor, onClick) {
  const button = document.createElement('button');
  button.className = 'remove-btn';
  button.style.backgroundColor = bgColor;
  button.textContent = text;
  button.onclick = onClick;
  return button;
}

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
    createStudentCard(
      nameInput.value,
      idInput.value,
      courseInput.value,
      dobInput.value,
      enrollInput.value,
      addrInput.value,
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

function createInput(value, type = 'text') {
  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  input.className = 'edit-input';
  return input;
}

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
