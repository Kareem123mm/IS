// Timetable Data
const timetableData = [
  {
    course_id: "LRA401",
    course_name: "Japanese Language (1)",
    course_type: "Lecture",
    instructor: "PROF33",
    instructor_name: "Dr. Kenji Tanaka",
    room: "R105",
    day: "Tuesday",
    start_time: "12:30 PM",
    end_time: "2:00 PM"
  },
  {
    course_id: "LRA402",
    course_name: "Japanese Language (2)",
    course_type: "Lecture",
    instructor: "PROF33",
    instructor_name: "Dr. Kenji Tanaka",
    room: "R114",
    day: "Thursday",
    start_time: "2:15 PM",
    end_time: "3:45 PM"
  },
  {
    course_id: "LRA403",
    course_name: "Japanese Language (3)",
    course_type: "Lecture",
    instructor: "PROF33",
    instructor_name: "Dr. Kenji Tanaka",
    room: "R106",
    day: "Wednesday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "LRA404",
    course_name: "Japanese Language (4)",
    course_type: "Lecture",
    instructor: "PROF35",
    instructor_name: "Dr. Haruto Ito",
    room: "R107",
    day: "Wednesday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "LRA405",
    course_name: "Key Skills Seminar (1)",
    course_type: "Lecture",
    instructor: "PROF30",
    instructor_name: "Dr. Maali Fouad",
    room: "R111",
    day: "Wednesday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "LRA101",
    course_name: "Japanese Culture",
    course_type: "Lecture",
    instructor: "PROF04",
    instructor_name: "Dr. Sherine Elmotasem",
    room: "R110",
    day: "Wednesday",
    start_time: "2:15 PM",
    end_time: "3:45 PM"
  },
  {
    course_id: "LRA208",
    course_name: "Safety and Risk Management",
    course_type: "Lecture",
    instructor: "PROF31",
    instructor_name: "Prof. Mohamed Hassan",
    room: "R107",
    day: "Thursday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "LRA103",
    course_name: "Fine Arts Appreciation",
    course_type: "Lecture",
    instructor: "PROF32",
    instructor_name: "Dr. Amal Gomaa",
    room: "R108",
    day: "Wednesday",
    start_time: "12:30 PM",
    end_time: "2:00 PM"
  },
  {
    course_id: "LRA104",
    course_name: "Music and Technology",
    course_type: "Lecture",
    instructor: "PROF27",
    instructor_name: "Prof. Adel Al-senn",
    room: "R101",
    day: "Sunday",
    start_time: "12:30 PM",
    end_time: "2:00 PM"
  },
  {
    course_id: "LRA105",
    course_name: "Theater and Drama",
    course_type: "Lecture",
    instructor: "PROF28",
    instructor_name: "Dr. Mohamed El-khateeb",
    room: "R112",
    day: "Tuesday",
    start_time: "10:45 AM",
    end_time: "12:15 PM"
  },
  {
    course_id: "LRA203",
    course_name: "Entrepreneurship and Innovation",
    course_type: "Lecture",
    instructor: "PROF28",
    instructor_name: "Dr. Mohamed El-khateeb",
    room: "R109",
    day: "Monday",
    start_time: "2:15 PM",
    end_time: "3:45 PM"
  },
  {
    course_id: "LRA206",
    course_name: "Sociology of work",
    course_type: "Lecture",
    instructor: "PROF29",
    instructor_name: "Prof. Said Sadik",
    room: "R102",
    day: "Wednesday",
    start_time: "12:30 PM",
    end_time: "2:00 PM"
  },
  {
    course_id: "LRA201",
    course_name: "Introduction to Economics",
    course_type: "Lecture",
    instructor: "PROF27",
    instructor_name: "Prof. Adel Al-senn",
    room: "R110",
    day: "Thursday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "LRA306",
    course_name: "Natural Resources",
    course_type: "Lecture",
    instructor: "PROF29",
    instructor_name: "Prof. Said Sadik",
    room: "R106",
    day: "Thursday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "LRA409",
    course_name: "Research Methods",
    course_type: "Lecture",
    instructor: "PROF31",
    instructor_name: "Prof. Mohamed Hassan",
    room: "R114",
    day: "Tuesday",
    start_time: "2:15 PM",
    end_time: "3:45 PM"
  },
  {
    course_id: "MTH111",
    course_name: "Mathematics (1) Calculus",
    course_type: "Lecture",
    instructor: "PROF02",
    instructor_name: "Dr. Ayman Arafa",
    room: "R113",
    day: "Thursday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "CSC111",
    course_name: "Intro to Computer Science",
    course_type: "Lecture and Lab",
    instructor: "PROF01",
    instructor_name: "Dr. Reda Elbasiony",
    room: "L2",
    day: "Sunday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "MTH212",
    course_name: "Ordinary Differential Equations",
    course_type: "Lecture",
    instructor: "PROF20",
    instructor_name: "Dr. Karim Hamed",
    room: "R103",
    day: "Sunday",
    start_time: "12:30 PM",
    end_time: "2:00 PM"
  },
  {
    course_id: "PHY113",
    course_name: "Physics 1",
    course_type: "Lecture",
    instructor: "PROF03",
    instructor_name: "Dr. Adel Fathy",
    room: "R109",
    day: "Sunday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "ECE111",
    course_name: "Logic Design",
    course_type: "Lecture and Lab",
    instructor: "PROF05",
    instructor_name: "Prof. Ahmed Allam",
    room: "L3",
    day: "Sunday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "PHY123",
    course_name: "Physics 2",
    course_type: "Lecture",
    instructor: "PROF03",
    instructor_name: "Dr. Adel Fathy",
    room: "R104",
    day: "Sunday",
    start_time: "2:15 PM",
    end_time: "3:45 PM"
  },
  {
    course_id: "CSC112",
    course_name: "Object Oriented Programming",
    course_type: "Lecture and Lab",
    instructor: "PROF20",
    instructor_name: "Dr. Karim Hamed",
    room: "L1",
    day: "Monday",
    start_time: "12:30 PM",
    end_time: "2:00 PM"
  },
  {
    course_id: "MTH121",
    course_name: "Discrete Mathematics",
    course_type: "Lecture",
    instructor: "PROF02",
    instructor_name: "Dr. Ayman Arafa",
    room: "R108",
    day: "Monday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "ECE213",
    course_name: "Microprocessors",
    course_type: "Lecture and Lab",
    instructor: "PROF20",
    instructor_name: "Dr. Karim Hamed",
    room: "L5",
    day: "Thursday",
    start_time: "12:30 PM",
    end_time: "2:00 PM"
  },
  {
    course_id: "CSC211",
    course_name: "Data Structures",
    course_type: "Lecture and Lab",
    instructor: "PROF07",
    instructor_name: "Dr. Ahmed Arafa",
    room: "L4",
    day: "Sunday",
    start_time: "10:45 AM",
    end_time: "12:15 PM"
  },
  {
    course_id: "MTH222",
    course_name: "Applied Numerical Methods",
    course_type: "Lecture",
    instructor: "PROF22",
    instructor_name: "Dr. Ali Kandil",
    room: "R102",
    day: "Sunday",
    start_time: "2:15 PM",
    end_time: "3:45 PM"
  },
  {
    course_id: "CSC221",
    course_name: "Computer Architecture",
    course_type: "Lecture",
    instructor: "PROF19",
    instructor_name: "Dr. Nadia Fawzy",
    room: "R111",
    day: "Sunday",
    start_time: "10:45 AM",
    end_time: "12:15 PM"
  },
  {
    course_id: "BIF312",
    course_name: "Database Systems",
    course_type: "Lecture and Lab",
    instructor: "PROF06",
    instructor_name: "Dr. Sameh Sherif",
    room: "L6",
    day: "Monday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "CSC315",
    course_name: "Algorithms",
    course_type: "Lecture",
    instructor: "PROF09",
    instructor_name: "Prof. Mostafa Soliman",
    room: "R105",
    day: "Monday",
    start_time: "12:30 PM",
    end_time: "2:00 PM"
  },
  {
    course_id: "AID311",
    course_name: "Machine Learning",
    course_type: "Lecture and Lab",
    instructor: "PROF08",
    instructor_name: "Dr. Ahmed Anter",
    room: "L2",
    day: "Monday",
    start_time: "10:45 AM",
    end_time: "12:15 PM"
  },
  {
    course_id: "CSC314",
    course_name: "Operating Systems",
    course_type: "Lecture and Lab",
    instructor: "PROF16",
    instructor_name: "Dr. Mustafa AlSayed",
    room: "L1",
    day: "Tuesday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "BIF322",
    course_name: "Bioinformatics",
    course_type: "Lecture",
    instructor: "PROF06",
    instructor_name: "Dr. Sameh Sherif",
    room: "R103",
    day: "Monday",
    start_time: "2:15 PM",
    end_time: "3:45 PM"
  },
  {
    course_id: "CNC320",
    course_name: "Computer Networks",
    course_type: "Lecture and Lab",
    instructor: "PROF02",
    instructor_name: "Dr. Ayman Arafa",
    room: "L3",
    day: "Tuesday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "CSC422",
    course_name: "Data Security",
    course_type: "Lecture",
    instructor: "PROF07",
    instructor_name: "Dr. Ahmed Arafa",
    room: "R104",
    day: "Monday",
    start_time: "12:30 PM",
    end_time: "2:00 PM"
  },
  {
    course_id: "AID428",
    course_name: "New Trends in Data Science",
    course_type: "Lecture",
    instructor: "PROF07",
    instructor_name: "Dr. Ahmed Arafa",
    room: "R108",
    day: "Thursday",
    start_time: "12:30 PM",
    end_time: "2:00 PM"
  },
  {
    course_id: "CSC317",
    course_name: "Software Engineering",
    course_type: "Lecture",
    instructor: "PROF12",
    instructor_name: "Dr. Hataba",
    room: "R101",
    day: "Tuesday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  },
  {
    course_id: "LRA106",
    course_name: "Physical Education",
    course_type: "Lecture",
    instructor: "PROF26",
    instructor_name: "Dr. Omar Hassan",
    room: "R113",
    day: "Sunday",
    start_time: "2:15 PM",
    end_time: "3:45 PM"
  },
  {
    course_id: "LRA110",
    course_name: "Modern Egyptian History",
    course_type: "Lecture",
    instructor: "PROF25",
    instructor_name: "Prof. Karim Khalil",
    room: "R112",
    day: "Sunday",
    start_time: "2:15 PM",
    end_time: "3:45 PM"
  },
  {
    course_id: "LRA303",
    course_name: "Fundamentals of Communication",
    course_type: "Lecture",
    instructor: "PROF32",
    instructor_name: "Dr. Amal Gomaa",
    room: "R109",
    day: "Thursday",
    start_time: "12:30 PM",
    end_time: "2:00 PM"
  },
  {
    course_id: "MTH223",
    course_name: "Mathematics (2) Calculus",
    course_type: "Lecture",
    instructor: "PROF22",
    instructor_name: "Dr. Ali Kandil",
    room: "R114",
    day: "Sunday",
    start_time: "9:00 AM",
    end_time: "10:30 AM"
  }
];

const timeSlots = [
  "9:00 AM - 10:30 AM",
  "10:45 AM - 12:15 PM",
  "12:30 PM - 2:00 PM",
  "2:15 PM - 3:45 PM"
];

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

// State management
let currentData = [...timetableData];
let sortColumn = null;
let sortDirection = 'asc';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeTabs();
  initializeTimetable();
  initializeInstructors();
  initializeRooms();
  initializeCourses();
  initializeModal();
});

// Tab functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });
}

// Timetable functionality
function initializeTimetable() {
  const timetableBody = document.getElementById('timetable-body');
  
  timeSlots.forEach(timeSlot => {
    const row = document.createElement('tr');
    
    // Time slot cell
    const timeCell = document.createElement('td');
    timeCell.textContent = timeSlot;
    timeCell.style.fontWeight = 'bold';
    row.appendChild(timeCell);
    
    // Day cells
    days.forEach(day => {
      const dayCell = document.createElement('td');
      const coursesInSlot = timetableData.filter(course => 
        course.day === day && 
        `${course.start_time} - ${course.end_time}` === timeSlot
      );
      
      coursesInSlot.forEach(course => {
        const courseSlot = createCourseSlot(course);
        dayCell.appendChild(courseSlot);
      });
      
      row.appendChild(dayCell);
    });
    
    timetableBody.appendChild(row);
  });
}

function createCourseSlot(course) {
  const slot = document.createElement('div');
  slot.className = `course-slot ${course.course_type.toLowerCase().replace(/\s+/g, '-')}`;
  slot.setAttribute('data-course', JSON.stringify(course));
  
  slot.innerHTML = `
    <div class="course-code">${course.course_id}</div>
    <div class="course-name">${course.course_name}</div>
    <div class="course-instructor">${course.instructor_name}</div>
    <div class="course-room">${course.room}</div>
  `;
  
  slot.addEventListener('click', () => showCourseModal(course));
  
  return slot;
}

// Instructors functionality
function initializeInstructors() {
  const instructorSelect = document.getElementById('instructor-select');
  const instructors = [...new Set(timetableData.map(course => course.instructor_name))].sort();
  
  instructors.forEach(instructor => {
    const option = document.createElement('option');
    option.value = instructor;
    option.textContent = instructor;
    instructorSelect.appendChild(option);
  });
  
  instructorSelect.addEventListener('change', (e) => {
    if (e.target.value) {
      displayInstructorInfo(e.target.value);
    } else {
      document.getElementById('instructor-details').innerHTML = '';
    }
  });
}

function displayInstructorInfo(instructorName) {
  const instructorCourses = timetableData.filter(course => course.instructor_name === instructorName);
  const detailsContainer = document.getElementById('instructor-details');
  
  const workloadStats = {
    totalCourses: instructorCourses.length,
    lectureAndLab: instructorCourses.filter(c => c.course_type === 'Lecture and Lab').length,
    lectureOnly: instructorCourses.filter(c => c.course_type === 'Lecture').length
  };
  
  detailsContainer.innerHTML = `
    <div class="info-card">
      <h3>${instructorName}</h3>
      <div class="instructor-stats">
        <p><strong>Total Courses:</strong> ${workloadStats.totalCourses}</p>
        <p><strong>Lecture &amp; Lab:</strong> ${workloadStats.lectureAndLab}</p>
        <p><strong>Lecture Only:</strong> ${workloadStats.lectureOnly}</p>
      </div>
      <div class="schedule-grid">
        ${instructorCourses.map(course => `
          <div class="schedule-item">
            <div class="schedule-day">${course.day}</div>
            <div class="course-code">${course.course_id}</div>
            <div class="course-name">${course.course_name}</div>
            <div class="schedule-time">${course.start_time} - ${course.end_time}</div>
            <div class="course-room">Room: ${course.room}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Rooms functionality
function initializeRooms() {
  const roomSelect = document.getElementById('room-select');
  const rooms = [...new Set(timetableData.map(course => course.room))].sort();
  
  rooms.forEach(room => {
    const option = document.createElement('option');
    option.value = room;
    option.textContent = room;
    roomSelect.appendChild(option);
  });
  
  roomSelect.addEventListener('change', (e) => {
    if (e.target.value) {
      displayRoomInfo(e.target.value);
    } else {
      document.getElementById('room-details').innerHTML = '';
    }
  });
}

function displayRoomInfo(roomName) {
  const roomCourses = timetableData.filter(course => course.room === roomName);
  const detailsContainer = document.getElementById('room-details');
  
  const totalSlots = timeSlots.length * days.length;
  const utilization = ((roomCourses.length / totalSlots) * 100).toFixed(1);
  const roomType = roomName.startsWith('L') ? 'Lab' : 'Regular Classroom';
  
  detailsContainer.innerHTML = `
    <div class="info-card">
      <h3>Room ${roomName}</h3>
      <div class="room-stats">
        <p><strong>Type:</strong> ${roomType}</p>
        <p><strong>Utilization:</strong> ${utilization}%</p>
        <p><strong>Total Classes:</strong> ${roomCourses.length}</p>
      </div>
      <div class="schedule-grid">
        ${roomCourses.map(course => `
          <div class="schedule-item">
            <div class="schedule-day">${course.day}</div>
            <div class="course-code">${course.course_id}</div>
            <div class="course-name">${course.course_name}</div>
            <div class="schedule-time">${course.start_time} - ${course.end_time}</div>
            <div class="course-instructor">${course.instructor_name}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Courses functionality
function initializeCourses() {
  const courseSearch = document.getElementById('course-search');
  const dayFilter = document.getElementById('day-filter');
  const coursesTable = document.getElementById('courses-table');
  const tableHeaders = coursesTable.querySelectorAll('th[data-sort]');
  
  // Initialize table
  displayCourses(currentData);
  
  // Search functionality
  courseSearch.addEventListener('input', (e) => {
    filterCourses();
  });
  
  // Day filter
  dayFilter.addEventListener('change', (e) => {
    filterCourses();
  });
  
  // Sorting functionality
  tableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const column = header.getAttribute('data-sort');
      
      if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortColumn = column;
        sortDirection = 'asc';
      }
      
      sortCourses(column, sortDirection);
    });
  });
}

function filterCourses() {
  const searchTerm = document.getElementById('course-search').value.toLowerCase();
  const dayFilter = document.getElementById('day-filter').value;
  
  let filteredData = timetableData.filter(course => {
    const matchesSearch = 
      course.course_id.toLowerCase().includes(searchTerm) ||
      course.course_name.toLowerCase().includes(searchTerm) ||
      course.instructor_name.toLowerCase().includes(searchTerm) ||
      course.room.toLowerCase().includes(searchTerm);
    
    const matchesDay = !dayFilter || course.day === dayFilter;
    
    return matchesSearch && matchesDay;
  });
  
  currentData = filteredData;
  displayCourses(currentData);
}

function sortCourses(column, direction) {
  currentData.sort((a, b) => {
    let aVal = a[column];
    let bVal = b[column];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (direction === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });
  
  displayCourses(currentData);
}

function displayCourses(courses) {
  const tbody = document.getElementById('courses-table-body');
  
  tbody.innerHTML = courses.map(course => `
    <tr>
      <td>${course.course_id}</td>
      <td>${course.course_name}</td>
      <td>${course.course_type}</td>
      <td>${course.instructor_name}</td>
      <td>${course.room}</td>
      <td>${course.day}</td>
      <td>${course.start_time} - ${course.end_time}</td>
    </tr>
  `).join('');
}

// Modal functionality
function initializeModal() {
  const modal = document.getElementById('course-modal');
  const closeBtn = modal.querySelector('.close');
  
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

function showCourseModal(course) {
  const modal = document.getElementById('course-modal');
  const modalBody = document.getElementById('modal-body');
  
  modalBody.innerHTML = `
    <h2>${course.course_id} - ${course.course_name}</h2>
    <div class="course-details">
      <p><strong>Type:</strong> ${course.course_type}</p>
      <p><strong>Instructor:</strong> ${course.instructor_name} (${course.instructor})</p>
      <p><strong>Room:</strong> ${course.room}</p>
      <p><strong>Day:</strong> ${course.day}</p>
      <p><strong>Time:</strong> ${course.start_time} - ${course.end_time}</p>
    </div>
  `;
  
  modal.style.display = 'block';
}