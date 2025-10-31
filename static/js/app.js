// app.js - Frontend JavaScript for CSP TimetableAI
// © 2025 Kareem. All Rights Reserved.

// Global state
let currentTimetable = null;
let dataLoaded = false;
let allData = {
    courses: [],
    instructors: [],
    rooms: [],
    timeslots: []
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    initializeTabs();
    initializeDataTabs();
    initializeForms();
    
    // Load data in proper sequence
    await checkDataStatus();
    await loadDataSummary();
    await loadAllData();
    
    // Update status card after data is loaded
    setTimeout(() => {
        updateDataStatusCard();
    }, 500);
});

// Check if data is loaded
async function checkDataStatus() {
    try {
        const response = await fetch('/api/check-data-status');
        const result = await response.json();
        
        if (result.success) {
            dataLoaded = result.data_loaded;
            console.log('Data loaded status:', dataLoaded);
            console.log('Data counts:', result.counts);
            updateUIBasedOnDataStatus();
        }
    } catch (error) {
        console.error('Error checking data status:', error);
    }
}

// Update UI based on whether data is loaded
function updateUIBasedOnDataStatus() {
    const generationSection = document.querySelector('.generation-section');
    const uploadSection = document.querySelector('.upload-section');
    
    if (dataLoaded) {
        if (uploadSection) uploadSection.style.display = 'none';
        if (generationSection) generationSection.style.display = 'block';
    } else {
        if (uploadSection) uploadSection.style.display = 'block';
        if (generationSection) generationSection.style.display = 'none';
    }
}

// ============================================================================
// TAB NAVIGATION
// ============================================================================

function initializeTabs() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // Update active states
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabName) {
                    content.classList.add('active');
                }
            });
        });
    });
}

function initializeDataTabs() {
    const dataTabs = document.querySelectorAll('.data-tab-btn');
    const dataContents = document.querySelectorAll('.data-tab-content');

    dataTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-data-tab');
            
            // Update active states
            dataTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            dataContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabName) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// ============================================================================
// FORM HANDLING
// ============================================================================

function initializeForms() {
    const generationForm = document.getElementById('generation-form');
    if (generationForm) {
        generationForm.addEventListener('submit', handleGenerate);
    }
    
    // Add search and filter listeners
    const searchInput = document.getElementById('search-timetable');
    const filterDay = document.getElementById('filter-day');
    const filterType = document.getElementById('filter-type');
    
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    if (filterDay) {
        filterDay.addEventListener('change', applyFilters);
    }
    if (filterType) {
        filterType.addEventListener('change', applyFilters);
    }
}

async function handleGenerate(e) {
    e.preventDefault();
    
    if (!dataLoaded) {
        showToast('Please upload CSV files first', 'error');
        return;
    }
    
    const timeout = parseInt(document.getElementById('timeout').value);
    
    // Show progress
    document.getElementById('generation-progress').classList.remove('hidden');
    document.getElementById('generation-results').classList.add('hidden');
    document.getElementById('progress-message').textContent = 'Scheduling ALL courses across all time slots... This may take a few minutes.';
    
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                timeout: timeout
            })
        });
        
        const data = await response.json();
        
        // Hide progress
        document.getElementById('generation-progress').classList.add('hidden');
        
        if (data.success || data.scheduled_courses > 0) {
            currentTimetable = data;
            displayResults(data);
            showToast(data.message || 'Timetable generated successfully!', 'success');
        } else {
            showToast('Failed to generate timetable: ' + (data.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        document.getElementById('generation-progress').classList.add('hidden');
        showToast('Error: ' + error.message, 'error');
    }
}

function displayResults(data) {
    const resultsSection = document.getElementById('generation-results');
    resultsSection.classList.remove('hidden');
    
    document.getElementById('result-scheduled').textContent = data.scheduled_courses;
    document.getElementById('result-total').textContent = data.total_courses;
    
    const successRate = ((data.scheduled_courses / data.total_courses) * 100).toFixed(1);
    document.getElementById('result-success').textContent = successRate + '%';
}

// ============================================================================
// DATA LOADING
// ============================================================================

async function loadDataSummary() {
    try {
        const response = await fetch('/api/data/summary');
        const data = await response.json();
        
        if (data.success) {
            console.log('Data summary loaded:', data.data);
            
            // Update dashboard cards
            document.getElementById('courses-count').textContent = data.data.courses_count;
            document.getElementById('instructors-count').textContent = data.data.instructors_count;
            document.getElementById('rooms-count').textContent = data.data.rooms_count;
            document.getElementById('timeslots-count').textContent = data.data.timeslots_count;
            
            // Also update data management status card counts
            const dataCoursesCount = document.getElementById('data-courses-count');
            const dataInstructorsCount = document.getElementById('data-instructors-count');
            const dataRoomsCount = document.getElementById('data-rooms-count');
            const dataTimeslotsCount = document.getElementById('data-timeslots-count');
            
            if (dataCoursesCount) dataCoursesCount.textContent = data.data.courses_count;
            if (dataInstructorsCount) dataInstructorsCount.textContent = data.data.instructors_count;
            if (dataRoomsCount) dataRoomsCount.textContent = data.data.rooms_count;
            if (dataTimeslotsCount) dataTimeslotsCount.textContent = data.data.timeslots_count;
        }
    } catch (error) {
        console.error('Error loading data summary:', error);
    }
}

async function loadAllData() {
    try {
        await Promise.all([
            loadCourses(),
            loadInstructors(),
            loadRooms(),
            loadTimeslots()
        ]);
        
        console.log('All data loaded successfully');
        console.log('Courses:', allData.courses.length);
        console.log('Instructors:', allData.instructors.length);
        console.log('Rooms:', allData.rooms.length);
        console.log('Timeslots:', allData.timeslots.length);
        
        // Update status card after all data is loaded
        updateDataStatusCard();
    } catch (error) {
        console.error('Error loading all data:', error);
    }
}

async function loadCourses() {
    try {
        console.log('Loading courses...');
        const response = await fetch('/api/courses');
        const data = await response.json();
        
        console.log('Courses response:', data);
        
        if (data.success) {
            allData.courses = data.courses;
            displayCoursesTable(data.courses);
            console.log(`✅ Loaded ${data.courses.length} courses`);
        } else {
            console.error('Failed to load courses:', data.error);
            const tbody = document.getElementById('courses-table-body');
            tbody.innerHTML = '<tr><td colspan="4" class="text-center error">Error loading courses</td></tr>';
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        const tbody = document.getElementById('courses-table-body');
        tbody.innerHTML = '<tr><td colspan="4" class="text-center error">Failed to load courses</td></tr>';
    }
}

async function loadInstructors() {
    try {
        console.log('Loading instructors...');
        const response = await fetch('/api/instructors');
        const data = await response.json();
        
        console.log('Instructors response:', data);
        
        if (data.success) {
            allData.instructors = data.instructors;
            displayInstructorsTable(data.instructors);
            console.log(`✅ Loaded ${data.instructors.length} instructors`);
        } else {
            console.error('Failed to load instructors:', data.error);
            const tbody = document.getElementById('instructors-table-body');
            tbody.innerHTML = '<tr><td colspan="5" class="text-center error">Error loading instructors</td></tr>';
        }
    } catch (error) {
        console.error('Error loading instructors:', error);
        const tbody = document.getElementById('instructors-table-body');
        tbody.innerHTML = '<tr><td colspan="5" class="text-center error">Failed to load instructors</td></tr>';
    }
}

async function loadRooms() {
    try {
        console.log('Loading rooms...');
        const response = await fetch('/api/rooms');
        const data = await response.json();
        
        console.log('Rooms response:', data);
        
        if (data.success) {
            allData.rooms = data.rooms;
            displayRoomsTable(data.rooms);
            console.log(`✅ Loaded ${data.rooms.length} rooms`);
        } else {
            console.error('Failed to load rooms:', data.error);
            const tbody = document.getElementById('rooms-table-body');
            tbody.innerHTML = '<tr><td colspan="3" class="text-center error">Error loading rooms</td></tr>';
        }
    } catch (error) {
        console.error('Error loading rooms:', error);
        const tbody = document.getElementById('rooms-table-body');
        tbody.innerHTML = '<tr><td colspan="3" class="text-center error">Failed to load rooms</td></tr>';
    }
}

async function loadTimeslots() {
    try {
        console.log('Loading timeslots...');
        const response = await fetch('/api/timeslots');
        const data = await response.json();
        
        console.log('Timeslots response:', data);
        
        if (data.success) {
            allData.timeslots = data.timeslots;
            displayTimeslotsTable(data.timeslots);
            console.log(`✅ Loaded ${data.timeslots.length} timeslots`);
        } else {
            console.error('Failed to load timeslots:', data.error);
            const tbody = document.getElementById('timeslots-table-body');
            tbody.innerHTML = '<tr><td colspan="3" class="text-center error">Error loading timeslots</td></tr>';
        }
    } catch (error) {
        console.error('Error loading timeslots:', error);
        const tbody = document.getElementById('timeslots-table-body');
        tbody.innerHTML = '<tr><td colspan="3" class="text-center error">Failed to load timeslots</td></tr>';
    }
}

// ============================================================================
// TABLE DISPLAY
// ============================================================================

function displayCoursesTable(courses) {
    const tbody = document.getElementById('courses-table-body');
    
    if (courses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No courses found</td></tr>';
        return;
    }
    
    tbody.innerHTML = courses.map(course => `
        <tr>
            <td>${course.course_id}</td>
            <td>${course.name}</td>
            <td>${course.credits}</td>
            <td><span class="course-type">${course.type}</span></td>
        </tr>
    `).join('');
}

function displayInstructorsTable(instructors) {
    const tbody = document.getElementById('instructors-table-body');
    
    if (instructors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No instructors found</td></tr>';
        return;
    }
    
    tbody.innerHTML = instructors.map(instructor => `
        <tr>
            <td>${instructor.instructor_id}</td>
            <td>${instructor.name}</td>
            <td>${instructor.role}</td>
            <td>${instructor.unavailable_day}</td>
            <td>${instructor.qualified_courses.slice(0, 5).join(', ')}${instructor.qualified_courses.length > 5 ? '...' : ''}</td>
        </tr>
    `).join('');
}

function displayRoomsTable(rooms) {
    const tbody = document.getElementById('rooms-table-body');
    
    if (rooms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">No rooms found</td></tr>';
        return;
    }
    
    tbody.innerHTML = rooms.map(room => `
        <tr>
            <td>${room.room_id}</td>
            <td>${room.type}</td>
            <td>${room.capacity}</td>
        </tr>
    `).join('');
}

function displayTimeslotsTable(timeslots) {
    const tbody = document.getElementById('timeslots-table-body');
    
    if (timeslots.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">No timeslots found</td></tr>';
        return;
    }
    
    tbody.innerHTML = timeslots.map(slot => `
        <tr>
            <td>${slot.day}</td>
            <td>${slot.start_time}</td>
            <td>${slot.end_time}</td>
        </tr>
    `).join('');
}

// ============================================================================
// TIMETABLE DISPLAY
// ============================================================================

function viewTimetable() {
    // Switch to timetable tab
    document.querySelector('[data-tab="timetable"]').click();
    
    if (!currentTimetable || !currentTimetable.schedule) {
        return;
    }
    
    displayTimetableByDay(currentTimetable.schedule);
}

function displayTimetableByDay(schedule) {
    const content = document.getElementById('timetable-content');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    
    // Define proper time order
    const timeOrder = {
        '9:00 AM': 1,
        '10:45 AM': 2,
        '12:30 PM': 3,
        '2:15 PM': 4
    };
    
    if (schedule.length === 0) {
        content.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-times"></i><p>No classes scheduled</p></div>';
        return;
    }
    
    // Group by day and time
    const grouped = {};
    schedule.forEach(entry => {
        if (!grouped[entry.day]) {
            grouped[entry.day] = {};
        }
        const timeKey = `${entry.start_time} - ${entry.end_time}`;
        if (!grouped[entry.day][timeKey]) {
            grouped[entry.day][timeKey] = [];
        }
        grouped[entry.day][timeKey].push(entry);
    });
    
    // Generate HTML with improved layout
    let html = `
        <div class="timetable-actions">
            <button class="btn btn-primary" onclick="downloadPDF()">
                <i class="fas fa-file-pdf"></i> Download as PDF
            </button>
            <button class="btn btn-secondary" onclick="printTimetable()">
                <i class="fas fa-print"></i> Print
            </button>
        </div>
        <div class="timetable-grid-improved">
    `;
    
    days.forEach(day => {
        if (grouped[day]) {
            const dayClasses = Object.values(grouped[day]).flat();
            html += `
                <div class="day-section-improved">
                    <div class="day-header-improved">
                        <div class="day-title">
                            <i class="fas fa-calendar-day"></i>
                            <span>${day}</span>
                        </div>
                        <div class="day-stats">
                            <span class="badge">${dayClasses.length} Classes</span>
                        </div>
                    </div>
                    <div class="day-content">
            `;
            
            // Sort times using custom order (9:00 AM, 10:45 AM, 12:30 PM, 2:15 PM)
            const times = Object.keys(grouped[day]).sort((a, b) => {
                const startA = a.split(' - ')[0];
                const startB = b.split(' - ')[0];
                return (timeOrder[startA] || 999) - (timeOrder[startB] || 999);
            });
            
            times.forEach(time => {
                html += `
                    <div class="timeslot-section">
                        <div class="timeslot-header-improved">
                            <i class="fas fa-clock"></i>
                            <span class="time-text">${time}</span>
                            <span class="class-count">(${grouped[day][time].length})</span>
                        </div>
                        <div class="classes-grid">
                `;
                
                grouped[day][time].forEach((entry, index) => {
                    // Determine display type based on section_id (for split Lecture+Lab courses)
                    let displayType = entry.course_type;
                    let classType = 'lecture';
                    
                    if (entry.section_id === 'LAB') {
                        displayType = 'Lab Session';
                        classType = 'lab';
                    } else if (entry.section_id === 'LECTURE') {
                        displayType = 'Lecture Session';
                        classType = 'lecture';
                    } else if (entry.course_type.includes('Lab')) {
                        classType = 'lab';
                    }
                    
                    const entryId = `${entry.course_id}-${entry.section_id || 'S1'}-${entry.day}-${entry.start_time.replace(/[: ]/g, '')}`;
                    
                    // Add lab indicator badge if this is a lab session
                    let labIndicatorBadge = '';
                    if (classType === 'lab') {
                        labIndicatorBadge = `
                            <div class="lab-indicator-badge" style="margin-top: 0.5rem; padding: 0.3rem 0.5rem; background: #fef3c7; border-left: 3px solid #fbbf24; border-radius: 4px; font-size: 0.75rem;">
                                <i class="fas fa-flask" style="color: #f59e0b;"></i>
                                <span style="color: #92400e; font-weight: 500;">Lab Session: Only TAs can be assigned</span>
                            </div>
                        `;
                    }
                    
                    html += `
                        <div class="class-card ${classType}" data-entry-id="${entryId}">
                            <div class="class-card-header">
                                <div class="course-info">
                                    <span class="course-code-large">${entry.course_id}</span>
                                    <span class="course-type-badge ${classType}">${displayType}</span>
                                </div>
                                <button class="btn-edit-class-small" onclick="editClass('${entryId}')" title="Edit this class">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                            <div class="course-name-improved">${entry.course_name}</div>
                            <div class="class-details-improved">
                                <div class="detail-row">
                                    <i class="fas fa-door-open"></i>
                                    <span class="detail-label">Room:</span>
                                    <span class="detail-value">${entry.room_id} (${entry.room_type})</span>
                                </div>
                                <div class="detail-row">
                                    <i class="fas fa-chalkboard-teacher"></i>
                                    <span class="detail-label">Instructor:</span>
                                    <span class="detail-value">${entry.instructor_name}</span>
                                </div>
                            </div>
                            ${labIndicatorBadge}
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
    });
    
    html += '</div>';
    content.innerHTML = html;
    
    // Also display statistics
    displayStatistics();
}

function displayStatistics() {
    if (!currentTimetable || !currentTimetable.statistics) {
        return;
    }
    
    const stats = currentTimetable.statistics;
    const content = document.getElementById('statistics-content');
    
    let html = '<div class="stats-grid">';
    
    // Day distribution
    if (stats.day_distribution) {
        html += `
            <div class="stat-card">
                <h3><i class="fas fa-calendar-week"></i> Day Distribution</h3>
        `;
        
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
        const maxCount = Math.max(...Object.values(stats.day_distribution));
        
        days.forEach(day => {
            const count = stats.day_distribution[day] || 0;
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            html += `
                <div class="stat-bar">
                    <span class="stat-label">${day}</span>
                    <div class="stat-bar-container">
                        <div class="stat-bar-fill" style="width: ${percentage}%">${count}</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    // Room utilization (top 10)
    if (stats.room_utilization) {
        html += `
            <div class="stat-card">
                <h3><i class="fas fa-door-open"></i> Top 10 Room Utilization</h3>
        `;
        
        const rooms = Object.entries(stats.room_utilization)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        const maxCount = rooms.length > 0 ? rooms[0][1] : 0;
        
        rooms.forEach(([room, count]) => {
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            html += `
                <div class="stat-bar">
                    <span class="stat-label">${room}</span>
                    <div class="stat-bar-container">
                        <div class="stat-bar-fill" style="width: ${percentage}%">${count}</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    // Instructor workload (top 10)
    if (stats.instructor_workload) {
        html += `
            <div class="stat-card">
                <h3><i class="fas fa-chalkboard-teacher"></i> Top 10 Instructor Workload</h3>
        `;
        
        const instructors = Object.entries(stats.instructor_workload)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        const maxCount = instructors.length > 0 ? instructors[0][1] : 0;
        
        instructors.forEach(([instructor, count]) => {
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            html += `
                <div class="stat-bar">
                    <span class="stat-label">${instructor.substring(0, 20)}</span>
                    <div class="stat-bar-container">
                        <div class="stat-bar-fill" style="width: ${percentage}%">${count}</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    html += '</div>';
    content.innerHTML = html;
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

function exportCSV() {
    window.location.href = '/api/timetable/export/csv';
    showToast('Downloading CSV...', 'success');
}

function exportJSON() {
    window.location.href = '/api/timetable/export/json';
    showToast('Downloading JSON...', 'success');
}

// ============================================================================
// DATA MANAGEMENT
// ============================================================================

async function reloadData() {
    try {
        showToast('Reloading data...', 'info');
        
        const response = await fetch('/api/reload', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Data reloaded successfully!', 'success');
            await checkDataStatus();
            await loadDataSummary();
            await loadAllData();
            updateDataStatusCard();
        } else {
            showToast('Failed to reload data: ' + data.error, 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

// Update data status card in Data Management tab
function updateDataStatusCard() {
    const statusText = document.getElementById('data-status-text');
    const coursesCount = document.getElementById('data-courses-count');
    const instructorsCount = document.getElementById('data-instructors-count');
    const roomsCount = document.getElementById('data-rooms-count');
    const timeslotsCount = document.getElementById('data-timeslots-count');
    
    if (dataLoaded) {
        statusText.textContent = '✅ Data loaded and ready';
        statusText.style.color = '#4ade80';
    } else {
        statusText.textContent = '⚠️ No data loaded - Upload CSV files';
        statusText.style.color = '#fbbf24';
    }
    
    // Update counts
    if (coursesCount) coursesCount.textContent = allData.courses.length || 0;
    if (instructorsCount) instructorsCount.textContent = allData.instructors.length || 0;
    if (roomsCount) roomsCount.textContent = allData.rooms.length || 0;
    if (timeslotsCount) timeslotsCount.textContent = allData.timeslots.length || 0;
}

// ============================================================================
// UPLOAD MODAL FUNCTIONS
// ============================================================================

function showUploadModal() {
    const modal = document.getElementById('uploadModal');
    modal.style.display = 'flex';
    
    // Add file change listeners
    const fileInputs = ['courses', 'instructors', 'rooms', 'timeslots'];
    fileInputs.forEach(type => {
        const input = document.getElementById(`${type}-file-modal`);
        const nameSpan = document.getElementById(`${type}-file-name`);
        
        input.addEventListener('change', function() {
            if (this.files.length > 0) {
                nameSpan.textContent = this.files[0].name;
                nameSpan.style.color = '#4ade80';
            } else {
                nameSpan.textContent = 'No file selected';
                nameSpan.style.color = '#94a3b8';
            }
        });
    });
}

function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    modal.style.display = 'none';
    
    // Reset form
    const form = document.getElementById('upload-form-modal');
    form.reset();
    
    // Reset file names
    const fileTypes = ['courses', 'instructors', 'rooms', 'timeslots'];
    fileTypes.forEach(type => {
        const nameSpan = document.getElementById(`${type}-file-name`);
        nameSpan.textContent = 'No file selected';
        nameSpan.style.color = '#94a3b8';
    });
    
    // Hide progress
    document.getElementById('upload-progress').classList.add('hidden');
}

async function handleModalUpload() {
    const formData = new FormData();
    const coursesFile = document.getElementById('courses-file-modal').files[0];
    const instructorsFile = document.getElementById('instructors-file-modal').files[0];
    const roomsFile = document.getElementById('rooms-file-modal').files[0];
    const timeslotsFile = document.getElementById('timeslots-file-modal').files[0];
    
    // Validate all files are selected
    if (!coursesFile || !instructorsFile || !roomsFile || !timeslotsFile) {
        showToast('Please select all four CSV files', 'error');
        return;
    }
    
    formData.append('courses', coursesFile);
    formData.append('instructors', instructorsFile);
    formData.append('rooms', roomsFile);
    formData.append('timeslots', timeslotsFile);
    
    // Show progress
    const progressDiv = document.getElementById('upload-progress');
    const progressText = document.getElementById('upload-progress-text');
    const progressFill = document.getElementById('upload-progress-fill');
    
    progressDiv.classList.remove('hidden');
    progressText.textContent = 'Uploading files...';
    progressFill.style.width = '30%';
    
    try {
        const response = await fetch('/api/upload-files', {
            method: 'POST',
            body: formData
        });
        
        progressFill.style.width = '70%';
        progressText.textContent = 'Processing data...';
        
        const result = await response.json();
        
        progressFill.style.width = '100%';
        
        if (result.success) {
            dataLoaded = true;
            progressText.textContent = `✅ Success! Loaded ${result.counts.courses} courses, ${result.counts.instructors} instructors, ${result.counts.rooms} rooms, ${result.counts.timeslots} timeslots`;
            
            showToast('Files uploaded successfully!', 'success');
            
            // Update UI
            updateUIBasedOnDataStatus();
            await loadDataSummary();
            await loadAllData();
            updateDataStatusCard();
            
            // Close modal after 2 seconds
            setTimeout(() => {
                closeUploadModal();
            }, 2000);
        } else {
            progressText.textContent = `❌ Error: ${result.error}`;
            progressText.style.color = '#f87171';
            showToast(result.error, 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        progressText.textContent = `❌ Error: ${error.message}`;
        progressText.style.color = '#f87171';
        showToast('Failed to upload files', 'error');
    }
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatTime(timeStr) {
    // Format time string for better display
    return timeStr;
}

function getCourseColor(courseType) {
    if (courseType.includes('Lab')) {
        return '#60a5fa';
    }
    return '#4ade80';
}

// ============================================================================
// SEARCH AND FILTER FUNCTIONS
// ============================================================================

function applyFilters() {
    if (!currentTimetable || !currentTimetable.schedule) {
        return;
    }
    
    const searchTerm = document.getElementById('search-timetable').value.toLowerCase();
    const filterDay = document.getElementById('filter-day').value;
    const filterType = document.getElementById('filter-type').value;
    
    // Filter schedule based on criteria
    let filteredSchedule = currentTimetable.schedule.filter(entry => {
        // Day filter
        if (filterDay !== 'all' && entry.day !== filterDay) {
            return false;
        }
        
        // Type filter - Check section_id for LECTURE vs LAB
        if (filterType !== 'all') {
            // Determine if this is a lab section
            const isLabSection = entry.section_id === 'LAB' || 
                                 (entry.section_id && entry.section_id.toLowerCase().includes('lab'));
            
            if (filterType === 'lab' && !isLabSection) return false;
            if (filterType === 'lecture' && isLabSection) return false;
        }
        
        // Search filter
        if (searchTerm) {
            const searchable = (
                entry.course_id.toLowerCase() +
                entry.course_name.toLowerCase() +
                entry.instructor_name.toLowerCase() +
                entry.room_id.toLowerCase()
            );
            if (!searchable.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Display filtered results
    displayTimetableByDay(filteredSchedule);
    
    // Show filter summary
    const summary = `Showing ${filteredSchedule.length} of ${currentTimetable.schedule.length} classes`;
    showFilterSummary(summary);
}

function showFilterSummary(text) {
    // Add or update filter summary element
    let summary = document.querySelector('.filter-summary');
    if (!summary) {
        summary = document.createElement('div');
        summary.className = 'filter-summary';
        const content = document.getElementById('timetable-content');
        content.insertBefore(summary, content.firstChild);
    }
    summary.textContent = text;
    summary.style.padding = '1rem';
    summary.style.background = 'var(--bg-secondary)';
    summary.style.borderRadius = '0.5rem';
    summary.style.marginBottom = '1rem';
    summary.style.textAlign = 'center';
    summary.style.color = 'var(--text-secondary)';
}

// ============================================================================
// DYNAMIC EDITING FUNCTIONS
// ============================================================================

let currentEditingEntry = null;

function editClass(entryId) {
    if (!currentTimetable || !currentTimetable.schedule) {
        showToast('No timetable loaded', 'error');
        return;
    }
    
    // Find the entry - NEW FORMAT includes section_id
    const entry = currentTimetable.schedule.find(e => {
        const id = `${e.course_id}-${e.section_id || 'S1'}-${e.day}-${e.start_time.replace(/[: ]/g, '')}`;
        return id === entryId;
    });
    
    if (!entry) {
        showToast('Class not found', 'error');
        console.error('Could not find entry with ID:', entryId);
        console.log('Available entries:', currentTimetable.schedule.map(e => 
            `${e.course_id}-${e.section_id || 'S1'}-${e.day}-${e.start_time.replace(/[: ]/g, '')}`
        ));
        return;
    }
    
    currentEditingEntry = entry;
    currentEditingEntry.entryId = entryId;
    
    // Populate modal
    document.getElementById('edit-course').value = `${entry.course_id} - ${entry.course_name}`;
    document.getElementById('edit-day').value = entry.day;
    document.getElementById('edit-timeslot').value = `${entry.start_time} - ${entry.end_time}`;
    
    // Populate rooms dropdown
    const roomSelect = document.getElementById('edit-room');
    roomSelect.innerHTML = allData.rooms.map(room => 
        `<option value="${room.room_id}" ${room.room_id === entry.room_id ? 'selected' : ''}>
            ${room.room_id} (${room.type}, Capacity: ${room.capacity})
        </option>`
    ).join('');
    
    // Populate instructors dropdown (only qualified ones)
    const instructorSelect = document.getElementById('edit-instructor');
    
    // Check if this is a lab session by section_id (LAB) or course type
    const course = allData.courses.find(c => c.course_id === entry.course_id);
    const isLabSession = entry.section_id === 'LAB' || 
                         (entry.section_id && entry.section_id.toLowerCase().includes('lab'));
    
    console.log(`Course ${entry.course_id} - Section: ${entry.section_id}, Type: ${course?.type}, Is Lab Section: ${isLabSession}`);
    
    // Show/hide lab session indicator
    const labIndicator = document.getElementById('lab-session-indicator');
    if (labIndicator) {
        labIndicator.style.display = isLabSession ? 'block' : 'none';
    }
    
    // Helper function to check if instructor is available on this day
    const isInstructorAvailable = (instructor, day) => {
        if (!instructor.preferred_slots) return true;
        const prefs = instructor.preferred_slots.toLowerCase();
        
        // Check if instructor has "Not on X" constraint for this day
        if (prefs.includes('not on')) {
            const notOnDay = prefs.replace('not on ', '').trim();
            if (notOnDay === day.toLowerCase()) {
                return false; // Instructor not available on this day
            }
        }
        return true; // Available
    };
    
    let qualifiedInstructors;
    if (isLabSession) {
        // For LAB sections, only show Teaching Assistants who are qualified AND available
        qualifiedInstructors = allData.instructors.filter(inst => 
            inst.role === 'Teaching Assistant' &&
            inst.qualified_courses && inst.qualified_courses.includes(entry.course_id) &&
            isInstructorAvailable(inst, entry.day)
        );
        console.log(`Lab Section - Found ${qualifiedInstructors.length} qualified & available TAs for ${entry.course_id} on ${entry.day}`);
    } else {
        // For LECTURE sections, show only Professors and Doctors who are qualified and available
        qualifiedInstructors = allData.instructors.filter(inst => 
            (inst.role === 'Professor' || inst.role === 'Doctor') &&
            inst.qualified_courses && inst.qualified_courses.includes(entry.course_id) &&
            isInstructorAvailable(inst, entry.day)
        );
        console.log(`Lecture Section - Found ${qualifiedInstructors.length} qualified & available Professors/Doctors for ${entry.course_id} on ${entry.day}`);
    }
    
    if (qualifiedInstructors.length === 0) {
        const currentInst = allData.instructors.find(i => i.instructor_id === entry.instructor_id);
        const roleNote = isLabSession ? '(Current - No other qualified TAs)' : '(Current - No other qualified instructors)';
        instructorSelect.innerHTML = `<option value="${entry.instructor_id}">${entry.instructor_name} ${roleNote}</option>`;
        const warningMsg = isLabSession 
            ? `⚠️ Warning: No other Teaching Assistants qualified for ${entry.course_id}` 
            : `⚠️ Warning: No other instructors qualified for ${entry.course_id}`;
        showToast(warningMsg, 'warning');
    } else {
        instructorSelect.innerHTML = qualifiedInstructors.map(inst =>
            `<option value="${inst.instructor_id}" ${inst.instructor_id === entry.instructor_id ? 'selected' : ''}>
                ${inst.name} (${inst.role})
            </option>`
        ).join('');
        
        // Add info message showing number of qualified instructors
        const infoDiv = document.querySelector('.edit-instructor-info');
        if (infoDiv) {
            const roleText = isLabSession ? 'qualified TA(s)' : 'qualified instructor(s)';
            infoDiv.textContent = `✅ ${qualifiedInstructors.length} ${roleText} available`;
        }
    }
    
    // Show modal
    document.getElementById('editClassModal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('editClassModal').style.display = 'none';
    currentEditingEntry = null;
}

function saveClassEdit() {
    if (!currentEditingEntry) {
        return;
    }
    
    // Get new values
    const newDay = document.getElementById('edit-day').value;
    const newTimeslot = document.getElementById('edit-timeslot').value;
    const [newStartTime, newEndTime] = newTimeslot.split(' - ');
    const newRoomId = document.getElementById('edit-room').value;
    const newInstructorId = document.getElementById('edit-instructor').value;
    
    // Find instructor and room details
    const instructor = allData.instructors.find(i => i.instructor_id === newInstructorId);
    const room = allData.rooms.find(r => r.room_id === newRoomId);
    
    if (!instructor || !room) {
        showToast('Invalid instructor or room selected', 'error');
        return;
    }
    
    // ✅ Check if instructor is qualified for this course
    const courseId = currentEditingEntry.course_id;
    const isQualified = instructor.qualified_courses && 
                        instructor.qualified_courses.includes(courseId);
    
    if (!isQualified) {
        showToast(`⚠️ Instructor ${instructor.name} is not qualified to teach ${courseId}`, 'error');
        console.error(`Qualification check failed:`, {
            instructor: instructor.name,
            instructorId: instructor.instructor_id,
            courseId: courseId,
            qualifiedCourses: instructor.qualified_courses
        });
        return;
    }
    
    // ✅ Check if this is a lab SECTION and validate instructor role
    const course = allData.courses.find(c => c.course_id === courseId);
    const isLabSection = currentEditingEntry.section_id === 'LAB' || 
                         (currentEditingEntry.section_id && currentEditingEntry.section_id.toLowerCase().includes('lab'));
    
    if (isLabSection) {
        // LAB sections must have Teaching Assistants
        if (instructor.role !== 'Teaching Assistant') {
            showToast(`❌ Lab sections must be assigned to Teaching Assistants only. ${instructor.name} is a ${instructor.role}.`, 'error');
            console.error(`Lab section validation failed:`, {
                instructor: instructor.name,
                role: instructor.role,
                courseId: courseId,
                sectionId: currentEditingEntry.section_id,
                isLabSection: isLabSection
            });
            return;
        }
    } else {
        // LECTURE sections must have Professors or Doctors
        if (instructor.role !== 'Professor' && instructor.role !== 'Doctor') {
            showToast(`❌ Lecture sections must be assigned to Professors or Doctors. ${instructor.name} is a ${instructor.role}.`, 'error');
            console.error(`Lecture section validation failed:`, {
                instructor: instructor.name,
                role: instructor.role,
                courseId: courseId,
                sectionId: currentEditingEntry.section_id,
                isLabSection: isLabSection
            });
            return;
        }
    }
    
    // ✅ Check instructor availability for the selected day
    if (instructor.preferred_slots && instructor.preferred_slots.toLowerCase().includes('not on')) {
        const prefs = instructor.preferred_slots.toLowerCase();
        const notOnDay = prefs.replace('not on ', '').trim();
        if (notOnDay === newDay.toLowerCase()) {
            showToast(`❌ ${instructor.name} is not available on ${newDay} (Preference: ${instructor.preferred_slots})`, 'error');
            console.error(`Time constraint validation failed:`, {
                instructor: instructor.name,
                day: newDay,
                preference: instructor.preferred_slots
            });
            return;
        }
    }
    
    console.log(`Validation passed - Course: ${courseId}, Section: ${currentEditingEntry.section_id}, Instructor: ${instructor.name} (${instructor.role}), Is Lab Section: ${isLabSection}, Day: ${newDay}`);
    
    // Check for conflicts
    const conflict = currentTimetable.schedule.find(e => {
        if (e === currentEditingEntry) return false;  // Skip current entry
        return (
            e.day === newDay &&
            e.start_time === newStartTime &&
            (e.room_id === newRoomId || e.instructor_id === newInstructorId)
        );
    });
    
    if (conflict) {
        showToast(`Conflict detected: ${conflict.room_id === newRoomId ? 'Room' : 'Instructor'} already assigned at this time`, 'error');
        return;
    }
    
    // Update the entry
    currentEditingEntry.day = newDay;
    currentEditingEntry.start_time = newStartTime;
    currentEditingEntry.end_time = newEndTime;
    currentEditingEntry.room_id = newRoomId;
    currentEditingEntry.instructor_id = newInstructorId;
    currentEditingEntry.instructor_name = instructor.name;
    
    // Refresh display
    displayTimetableByDay(currentTimetable.schedule);
    applyFilters();  // Reapply any active filters
    
    showToast('✅ Class updated successfully!', 'success');
    closeEditModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editClassModal');
    if (event.target === modal) {
        closeEditModal();
    }
}

// ============================================================================
// PDF DOWNLOAD AND PRINT FUNCTIONS
// ============================================================================

function printTimetable() {
    window.print();
}

async function downloadPDF() {
    if (!currentTimetable || !currentTimetable.schedule) {
        showToast('No timetable to download', 'error');
        return;
    }
    
    showToast('Generating PDF... Please wait', 'info');
    
    // Import jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape A4
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const times = ['9:00 AM - 10:30 AM', '10:45 AM - 12:15 PM', '12:30 PM - 2:00 PM', '2:15 PM - 3:45 PM'];
    
    // Group schedule by day and time
    const grouped = {};
    currentTimetable.schedule.forEach(entry => {
        if (!grouped[entry.day]) {
            grouped[entry.day] = {};
        }
        const timeKey = `${entry.start_time} - ${entry.end_time}`;
        if (!grouped[entry.day][timeKey]) {
            grouped[entry.day][timeKey] = [];
        }
        grouped[entry.day][timeKey].push(entry);
    });
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('CSP TIMETABLEAI - INTELLIGENT SCHEDULING', 148, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    doc.text(`Generated on: ${date}`, 148, 22, { align: 'center' });
    
    // Summary stats
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const stats = `Total Classes: ${currentTimetable.schedule.length} | Success Rate: ${currentTimetable.success_rate}%`;
    doc.text(stats, 148, 28, { align: 'center' });
    
    let yPos = 35;
    
    // Draw timetable grid
    days.forEach((day, dayIndex) => {
        if (yPos > 180) {
            doc.addPage();
            yPos = 20;
        }
        
        // Day header
        doc.setFillColor(52, 152, 219);
        doc.rect(10, yPos, 277, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(day, 15, yPos + 5.5);
        
        const dayClasses = grouped[day] || {};
        const classCount = Object.values(dayClasses).flat().length;
        doc.text(`(${classCount} classes)`, 270, yPos + 5.5);
        
        yPos += 10;
        
        // Time slots
        times.forEach((time, timeIndex) => {
            const classes = dayClasses[time] || [];
            
            if (classes.length > 0) {
                // Time slot header
                doc.setFillColor(236, 240, 241);
                doc.rect(10, yPos, 277, 6, 'F');
                doc.setTextColor(60, 60, 60);
                doc.setFontSize(9);
                doc.setFont(undefined, 'bold');
                doc.text(time, 15, yPos + 4);
                doc.text(`(${classes.length})`, 270, yPos + 4);
                
                yPos += 8;
                
                // Classes
                classes.forEach((entry, idx) => {
                    if (yPos > 185) {
                        doc.addPage();
                        yPos = 20;
                    }
                    
                    const isLab = entry.course_type.includes('Lab');
                    const bgColor = isLab ? [255, 243, 224] : [232, 245, 233];
                    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
                    doc.rect(15, yPos, 267, 10, 'F');
                    doc.rect(15, yPos, 267, 10, 'S');
                    
                    doc.setFont(undefined, 'bold');
                    doc.setTextColor(40, 40, 40);
                    doc.setFontSize(9);
                    doc.text(entry.course_id, 18, yPos + 4);
                    
                    doc.setFont(undefined, 'normal');
                    doc.setTextColor(60, 60, 60);
                    doc.setFontSize(8);
                    const courseName = entry.course_name.length > 40 ? 
                        entry.course_name.substring(0, 37) + '...' : 
                        entry.course_name;
                    doc.text(courseName, 18, yPos + 7.5);
                    
                    // Room and instructor
                    doc.setFontSize(7);
                    doc.setTextColor(80, 80, 80);
                    doc.text(`Room: ${entry.room_id}`, 160, yPos + 4);
                    const instName = entry.instructor_name.length > 25 ? 
                        entry.instructor_name.substring(0, 22) + '...' : 
                        entry.instructor_name;
                    doc.text(`Instructor: ${instName}`, 160, yPos + 7.5);
                    
                    // Type badge
                    const badgeColor = isLab ? [255, 152, 0] : [76, 175, 80];
                    doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
                    doc.roundedRect(250, yPos + 2, 28, 6, 2, 2, 'F');
                    doc.setTextColor(255, 255, 255);
                    doc.setFont(undefined, 'bold');
                    doc.setFontSize(7);
                    doc.text(isLab ? 'LAB' : 'LECTURE', 264, yPos + 5.5, { align: 'center' });
                    
                    yPos += 11;
                });
                
                yPos += 2;
            }
        });
        
        yPos += 3;
    });
    
    // Footer on last page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 148, 200, { align: 'center' });
        doc.setFontSize(7);
        doc.text('Generated by CSP TimetableAI - Intelligent Scheduling System', 148, 204, { align: 'center' });
        doc.setFontSize(6);
        doc.text('© 2025 Kareem. All Rights Reserved.', 148, 207, { align: 'center' });
    }
    
    // Save the PDF
    doc.save('CSP-TimetableAI-Schedule.pdf');
    showToast('PDF downloaded successfully!', 'success');
}
