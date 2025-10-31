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
// HELPER FUNCTIONS
// ============================================================================

// Fetch with cache busting
async function fetchWithCacheBust(url, options = {}) {
    const cacheBustUrl = url.includes('?') 
        ? `${url}&_t=${Date.now()}` 
        : `${url}?_t=${Date.now()}`;
    
    const defaultOptions = {
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            ...options.headers
        },
        ...options
    };
    
    return fetch(cacheBustUrl, defaultOptions);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    initializeTabs();
    initializeDataTabs();
    initializeForms();
    initializeRefreshHandlers();
    
    // Check data status first
    await checkDataStatus();
    
    // Only load data if already uploaded
    if (dataLoaded) {
 await loadDataSummary();
        await loadAllData();
        setTimeout(() => {
            updateDataStatusCard();
        }, 500);
    } else {
        // Show upload prompt
        updateUIBasedOnDataStatus();
        updateDataStatusCard();
    }
});

// Initialize refresh handlers
function initializeRefreshHandlers() {
    // Add keyboard shortcut: Ctrl+Shift+R for force refresh
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            forceRefreshPage();
        }
    });
    
    // Detect when user returns to tab (refresh if stale)
    document.addEventListener('visibilitychange', async () => {
        if (!document.hidden && dataLoaded) {
            const lastRefresh = parseInt(sessionStorage.getItem('lastRefresh') || '0');
            const now = Date.now();
            // Auto-refresh if more than 5 minutes since last refresh
            if (now - lastRefresh > 5 * 60 * 1000) {
                console.log(' Auto-refreshing stale data...');
                await softRefresh();
            }
        }
    });
}

// Soft refresh (just data, no page reload)
async function softRefresh() {
    try {
        await checkDataStatus();
        if (dataLoaded) {
 await loadDataSummary();
            await loadAllData();
            updateDataStatusCard();
            sessionStorage.setItem('lastRefresh', Date.now().toString());
            console.log(' Soft refresh complete');
        }
    } catch (error) {
        console.error('Soft refresh failed:', error);
    }
}

// Force refresh entire page with cache clear
async function forceRefreshPage() {
    const overlay = createRefreshOverlay();
    document.body.appendChild(overlay);
    
    try {
        updateRefreshProgress(overlay, 10, ' Clearing all caches...');
        
        // Clear all caches thoroughly
        await clearBrowserCache();
        
        // Clear localStorage except essential items
        const preserveKeys = ['theme', 'language'];
        const localStorageBackup = {};
        preserveKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorageBackup[key] = localStorage.getItem(key);
            }
        });
        localStorage.clear();
        Object.keys(localStorageBackup).forEach(key => {
            localStorage.setItem(key, localStorageBackup[key]);
        });
        
        await sleep(500);
        
        updateRefreshProgress(overlay, 40, ' Clearing session data...');
        sessionStorage.clear();
        await sleep(300);
        
        updateRefreshProgress(overlay, 60, ' Preparing reload...');
        await sleep(300);
        
        updateRefreshProgress(overlay, 80, ' Almost done...');
        await sleep(300);
        
        updateRefreshProgress(overlay, 100, ' Refresh complete!');
        await sleep(500);
        
        // Force hard reload with cache bypass
        // Add timestamp to force cache bust
        const url = new URL(window.location.href);
        url.searchParams.set('_t', Date.now());
        
        // Use location.replace for hard refresh
        window.location.replace(url.toString());
        
    } catch (error) {
        console.error('Force refresh failed:', error);
        overlay.remove();
        showToast('Force refresh failed. Using standard refresh...', 'warning');
        window.location.reload();
    }
}

// Create refresh overlay
function createRefreshOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'reload-overlay';
    overlay.style.zIndex = '999999';
    overlay.innerHTML = `
        <div class="reload-content">
            <div class="reload-icon">
                <i class="fas fa-bolt" style="color: #f59e0b; font-size: 4rem; animation: pulse 1s ease-in-out infinite;"></i>
            </div>
            <h2 class="reload-title">Force Refresh</h2>
            <p class="reload-message">Clearing cache and reloading page...</p>
            <div class="reload-progress-bar">
                <div class="reload-progress-fill"></div>
            </div>
            <p class="reload-status">Initializing...</p>
        </div>
    `;
    return overlay;
}

// Update refresh progress
function updateRefreshProgress(overlay, percent, message) {
    const progressFill = overlay.querySelector('.reload-progress-fill');
    const statusText = overlay.querySelector('.reload-status');
    
    progressFill.style.width = percent + '%';
    statusText.textContent = message;
}

// Check if data is loaded
async function checkDataStatus() {
    try {
        const response = await fetchWithCacheBust('/api/check-data-status');
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

            // Scroll to top smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}

function initializeDataTabs() {
    const dataTabs = document.querySelectorAll('.data-tab-btn');
    const dataContents = document.querySelectorAll('.data-tab-content');

    dataTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // Update active states
            dataTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            dataContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabName) {
                    content.classList.add('active');
                }
            });

            // Display data for the selected tab from cache
            switch(tabName) {
                case 'courses-data':
                    displayCoursesTable(allData.courses);
                    break;
                case 'instructors-data':
                    displayInstructorsTable(allData.instructors);
                    break;
                case 'rooms-data':
                    displayRoomsTable(allData.rooms);
                    break;
                case 'timeslots-data':
                    displayTimeslotsTable(allData.timeslots);
                    break;
            }

            // Scroll to the data section (not all the way to top since we're already in Data tab)
            const dataSection = document.getElementById('data-management');
            if (dataSection) {
                dataSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
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
        // If no data loaded, set counts to 0
        if (!dataLoaded) {
            document.getElementById('courses-count').textContent = '0';
            document.getElementById('instructors-count').textContent = '0';
            document.getElementById('rooms-count').textContent = '0';
            document.getElementById('timeslots-count').textContent = '0';
            return;
        }
        
        const response = await fetchWithCacheBust('/api/data/summary');
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
        const response = await fetchWithCacheBust('/api/courses');
        const data = await response.json();
        
        console.log('Courses response:', data);
        
        if (data.success) {
            allData.courses = data.courses;
            displayCoursesTable(data.courses);
            console.log(` Loaded ${data.courses.length} courses`);
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
        const response = await fetchWithCacheBust('/api/instructors');
        const data = await response.json();
        
        console.log('Instructors response:', data);
        
        if (data.success) {
            allData.instructors = data.instructors;
            displayInstructorsTable(data.instructors);
            console.log(` Loaded ${data.instructors.length} instructors`);
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
        const response = await fetchWithCacheBust('/api/rooms');
        const data = await response.json();
        
        console.log('Rooms response:', data);
        
        if (data.success) {
            allData.rooms = data.rooms;
            displayRoomsTable(data.rooms);
            console.log(` Loaded ${data.rooms.length} rooms`);
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
        const response = await fetchWithCacheBust('/api/timeslots');
        const data = await response.json();
        
        console.log('Timeslots response:', data);
        
        if (data.success) {
            allData.timeslots = data.timeslots;
            displayTimeslotsTable(data.timeslots);
            console.log(` Loaded ${data.timeslots.length} timeslots`);
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
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No courses found</td></tr>';
        return;
    }
    
    tbody.innerHTML = courses.map(course => `
        <tr>
            <td>${course.course_id}</td>
            <td>${course.name}</td>
            <td>${course.credits}</td>
            <td><span class="course-type">${course.type}</span></td>
            <td class="action-buttons">
                <button class="btn-edit" onclick="editCourse('${course.course_id}', '${course.name}', '${course.credits}', '${course.type}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteCourse('${course.course_id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function displayInstructorsTable(instructors) {
    const tbody = document.getElementById('instructors-table-body');
    
    if (instructors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No instructors found</td></tr>';
        return;
    }
    
    tbody.innerHTML = instructors.map(instructor => {
        const qualifiedCoursesStr = instructor.qualified_courses.join(',');
        const preferredSlotsStr = instructor.preferred_slots ? instructor.preferred_slots.join(',') : '';
        return `
        <tr>
            <td>${instructor.instructor_id}</td>
            <td>${instructor.name}</td>
            <td>${instructor.role}</td>
            <td>${instructor.unavailable_day || 'None'}</td>
            <td>${instructor.qualified_courses.slice(0, 5).join(', ')}${instructor.qualified_courses.length > 5 ? '...' : ''}</td>
            <td class="action-buttons">
                <button class="btn-edit" onclick="editInstructor('${instructor.instructor_id}', '${instructor.name}', '${instructor.role}', '${preferredSlotsStr}', '${qualifiedCoursesStr}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteInstructor('${instructor.instructor_id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `}).join('');
}

function displayRoomsTable(rooms) {
    const tbody = document.getElementById('rooms-table-body');
    
    if (rooms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No rooms found</td></tr>';
        return;
    }
    
    tbody.innerHTML = rooms.map(room => `
        <tr>
            <td>${room.room_id}</td>
            <td>${room.type}</td>
            <td>${room.capacity}</td>
            <td class="action-buttons">
                <button class="btn-edit" onclick="editRoom('${room.room_id}', '${room.type}', ${room.capacity})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteRoom('${room.room_id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function displayTimeslotsTable(timeslots) {
    const tbody = document.getElementById('timeslots-table-body');
    
    if (timeslots.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No timeslots found</td></tr>';
        return;
    }
    
    tbody.innerHTML = timeslots.map(slot => `
        <tr>
            <td>${slot.day}</td>
            <td>${slot.start_time}</td>
            <td>${slot.end_time}</td>
            <td class="action-buttons">
                <button class="btn-edit" onclick="editTimeslot('${slot.day}', '${slot.start_time}', '${slot.end_time}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteTimeslot('${slot.day}', '${slot.start_time}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ============================================================================
// DELETE FUNCTIONS
// ============================================================================

async function deleteCourse(courseId) {
    if (!confirm(`Are you sure you want to delete course ${courseId}?`)) {
        return;
    }

    try {
        const response = await fetchWithCacheBust(`/api/courses/${courseId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Course deleted successfully', 'success');
            await loadCourses();  // Reload courses from server
 await loadDataSummary(); // Update the summary counts
        } else {
            showToast(data.error || 'Failed to delete course', 'error');
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        showToast('Failed to delete course', 'error');
    }
}

async function deleteInstructor(instructorId) {
    if (!confirm(`Are you sure you want to delete instructor ${instructorId}?`)) {
        return;
    }

    try {
        const response = await fetchWithCacheBust(`/api/instructors/${instructorId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Instructor deleted successfully', 'success');
            await loadInstructors();  // Reload instructors from server
 await loadDataSummary(); // Update the summary counts
        } else {
            showToast(data.error || 'Failed to delete instructor', 'error');
        }
    } catch (error) {
        console.error('Error deleting instructor:', error);
        showToast('Failed to delete instructor', 'error');
    }
}

async function deleteRoom(roomId) {
    if (!confirm(`Are you sure you want to delete room ${roomId}?`)) {
        return;
    }

    try {
        const response = await fetchWithCacheBust(`/api/rooms/${roomId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Room deleted successfully', 'success');
            await loadRooms();  // Reload rooms from server
 await loadDataSummary(); // Update the summary counts
        } else {
            showToast(data.error || 'Failed to delete room', 'error');
        }
    } catch (error) {
        console.error('Error deleting room:', error);
        showToast('Failed to delete room', 'error');
    }
}

async function deleteTimeslot(day, startTime) {
    if (!confirm(`Are you sure you want to delete timeslot ${day} ${startTime}?`)) {
        return;
    }

    try {
        const response = await fetchWithCacheBust(`/api/timeslots/${encodeURIComponent(day)}/${encodeURIComponent(startTime)}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Timeslot deleted successfully', 'success');
            await loadTimeslots();  // Reload timeslots from server
 await loadDataSummary(); // Update the summary counts
        } else {
            showToast(data.error || 'Failed to delete timeslot', 'error');
        }
    } catch (error) {
        console.error('Error deleting timeslot:', error);
        showToast('Failed to delete timeslot', 'error');
    }
}

// ============================================================================
// EDIT FUNCTIONS
// ============================================================================

function editCourse(courseId, courseName, credits, courseType) {
    const newName = prompt('Enter new course name:', courseName);
    if (newName === null) return;
    
    const newCredits = prompt('Enter new credits:', credits);
    if (newCredits === null) return;
    
    const newType = prompt('Enter new type (Lecture/Lab):', courseType);
    if (newType === null) return;

    updateCourse(courseId, newName, newCredits, newType);
}

async function updateCourse(courseId, courseName, credits, courseType) {
    try {
        const response = await fetchWithCacheBust(`/api/courses/${courseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                course_name: courseName,
                credits: credits,
                course_type: courseType
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Course updated successfully', 'success');
            await loadCourses();  // Reload courses from server
 await loadDataSummary(); // Update the summary counts
        } else {
            showToast(data.error || 'Failed to update course', 'error');
        }
    } catch (error) {
        console.error('Error updating course:', error);
        showToast('Failed to update course', 'error');
    }
}

function editInstructor(instructorId, name, role, preferredSlots, qualifiedCourses) {
    const newName = prompt('Enter new name:', name);
    if (newName === null) return;
    
    const newRole = prompt('Enter new role:', role);
    if (newRole === null) return;
    
    const newPreferredSlots = prompt('Enter new preferred slots (comma-separated):', preferredSlots);
    if (newPreferredSlots === null) return;
    
    const newQualifiedCourses = prompt('Enter new qualified courses (comma-separated):', qualifiedCourses);
    if (newQualifiedCourses === null) return;

    updateInstructor(instructorId, newName, newRole, newPreferredSlots, newQualifiedCourses);
}

async function updateInstructor(instructorId, name, role, preferredSlots, qualifiedCourses) {
    try {
        const response = await fetchWithCacheBust(`/api/instructors/${instructorId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                role: role,
                preferred_slots: preferredSlots,
                qualified_courses: qualifiedCourses
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Instructor updated successfully', 'success');
            await loadInstructors();  // Reload instructors from server
 await loadDataSummary(); // Update the summary counts
        } else {
            showToast(data.error || 'Failed to update instructor', 'error');
        }
    } catch (error) {
        console.error('Error updating instructor:', error);
        showToast('Failed to update instructor', 'error');
    }
}

function editRoom(roomId, roomType, capacity) {
    const newType = prompt('Enter new room type (Lecture/Lab):', roomType);
    if (newType === null) return;
    
    const newCapacity = prompt('Enter new capacity:', capacity);
    if (newCapacity === null) return;

    updateRoom(roomId, newType, parseInt(newCapacity));
}

async function updateRoom(roomId, roomType, capacity) {
    try {
        const response = await fetchWithCacheBust(`/api/rooms/${roomId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                room_type: roomType,
                capacity: capacity
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Room updated successfully', 'success');
            await loadRooms();  // Reload rooms from server
 await loadDataSummary(); // Update the summary counts
        } else {
            showToast(data.error || 'Failed to update room', 'error');
        }
    } catch (error) {
        console.error('Error updating room:', error);
        showToast('Failed to update room', 'error');
    }
}

function editTimeslot(day, startTime, endTime) {
    const newDay = prompt('Enter new day:', day);
    if (newDay === null) return;
    
    const newStartTime = prompt('Enter new start time:', startTime);
    if (newStartTime === null) return;
    
    const newEndTime = prompt('Enter new end time:', endTime);
    if (newEndTime === null) return;

    updateTimeslot(day, startTime, newDay, newStartTime, newEndTime);
}

async function updateTimeslot(oldDay, oldStartTime, newDay, newStartTime, newEndTime) {
    try {
        const response = await fetchWithCacheBust('/api/timeslots', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                old_day: oldDay,
                old_start_time: oldStartTime,
                new_day: newDay,
                new_start_time: newStartTime,
                new_end_time: newEndTime
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Timeslot updated successfully', 'success');
            await loadTimeslots();  // Reload timeslots from server
 await loadDataSummary(); // Update the summary counts
        } else {
            showToast(data.error || 'Failed to update timeslot', 'error');
        }
    } catch (error) {
        console.error('Error updating timeslot:', error);
        showToast('Failed to update timeslot', 'error');
    }
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
        // Create impressive reload overlay
        const overlay = createReloadOverlay();
        document.body.appendChild(overlay);
        
        // Clear browser cache
        await clearBrowserCache();
        
        // Animate reload process
        updateReloadProgress(overlay, 10, ' Clearing cache...');
        await sleep(500);
        
        updateReloadProgress(overlay, 30, ' Contacting server...');
        const response = await fetch('/api/reload', {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        updateReloadProgress(overlay, 50, ' Fetching fresh data...');
        const data = await response.json();
        
        if (data.success) {
            updateReloadProgress(overlay, 70, ' Updating UI...');
            
            // Clear cached data
            allData = {
                courses: [],
                instructors: [],
                rooms: [],
                timeslots: []
            };
            
            // Mark as loaded
            dataLoaded = true;
            
            await checkDataStatus();
            
            updateReloadProgress(overlay, 80, ' Loading data summary...');
 await loadDataSummary();
            
            updateReloadProgress(overlay, 90, ' Loading all data...');
            await loadAllData();
            
            updateReloadProgress(overlay, 95, ' Updating displays...');
            updateDataStatusCard();
            updateUIBasedOnDataStatus();
            
            // Update all data tabs by calling load functions which also display
            // The load functions will populate allData and call the display functions
            // So no need to call display functions separately
            
            updateReloadProgress(overlay, 100, ' Reload complete!');
            
            // Success animation
            const checkmark = overlay.querySelector('.reload-icon');
            checkmark.innerHTML = '<i class="fas fa-check-circle" style="color: #4ade80; font-size: 4rem;"></i>';
            
            await sleep(800);
            
            // Remove overlay with fade out
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
            
            showToast(` Data reloaded successfully! ${data.counts.courses} courses, ${data.counts.instructors} instructors loaded.`, 'success');
        } else {
            updateReloadProgress(overlay, 100, ' Reload failed!');
            setTimeout(() => overlay.remove(), 2000);
            showToast('Failed to reload data: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Reload error:', error);
        showToast('Error: ' + error.message, 'error');
        const overlay = document.querySelector('.reload-overlay');
        if (overlay) overlay.remove();
    }
}

// Create impressive reload overlay
function createReloadOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'reload-overlay';
    overlay.innerHTML = `
        <div class="reload-content">
            <div class="reload-icon">
                <i class="fas fa-sync-alt fa-spin" style="color: #667eea; font-size: 4rem;"></i>
            </div>
            <h2 class="reload-title">Reloading Data</h2>
            <p class="reload-message">Please wait while we refresh everything...</p>
            <div class="reload-progress-bar">
                <div class="reload-progress-fill"></div>
            </div>
            <p class="reload-status">Initializing...</p>
            <div class="reload-stats">
                <div class="stat-item">
                    <i class="fas fa-database"></i>
                    <span>Clearing Cache</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-cloud-download-alt"></i>
                    <span>Fetching Data</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-sync"></i>
                    <span>Updating UI</span>
                </div>
            </div>
        </div>
    `;
    return overlay;
}

// Update reload progress
function updateReloadProgress(overlay, percent, message) {
    const progressFill = overlay.querySelector('.reload-progress-fill');
    const statusText = overlay.querySelector('.reload-status');
    
    progressFill.style.width = percent + '%';
    statusText.textContent = message;
    
    // Animate stat items based on progress
    const statItems = overlay.querySelectorAll('.stat-item');
    if (percent >= 30) statItems[0]?.classList.add('active');
    if (percent >= 60) statItems[1]?.classList.add('active');
    if (percent >= 90) statItems[2]?.classList.add('active');
}

// Clear browser cache
async function clearBrowserCache() {
    try {
        // Clear Service Worker cache if available
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log(' Service Worker caches cleared');
        }
        
        // Clear sessionStorage
        sessionStorage.clear();
        console.log(' Session storage cleared');
        
        // Note: localStorage is preserved (contains user preferences)
        
        console.log(' Browser cache cleared successfully');
    } catch (error) {
        console.warn(' Cache clearing failed:', error);
    }
}

// Utility sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Update data status card in Data Management tab
function updateDataStatusCard() {
    const statusText = document.getElementById('data-status-text');
    const coursesCount = document.getElementById('data-courses-count');
    const instructorsCount = document.getElementById('data-instructors-count');
    const roomsCount = document.getElementById('data-rooms-count');
    const timeslotsCount = document.getElementById('data-timeslots-count');
    
    if (dataLoaded) {
        statusText.textContent = ' Data loaded and ready';
        statusText.style.color = '#4ade80';
    } else {
        statusText.textContent = ' No data loaded - Upload CSV files';
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
            progressText.textContent = ` Success! Loaded ${result.counts.courses} courses, ${result.counts.instructors} instructors, ${result.counts.rooms} rooms, ${result.counts.timeslots} timeslots`;
            
            showToast('Files uploaded successfully! Refreshing data...', 'success');
            
            // Clear any cached data
            allData = {
                courses: [],
                instructors: [],
                rooms: [],
                timeslots: []
            };
            
            // Force update UI state
            updateUIBasedOnDataStatus();
            
            // Wait a bit for backend to process
            await sleep(500);
            
            // Reload everything with cache busting
            await checkDataStatus();
 await loadDataSummary();
            await loadAllData();
            updateDataStatusCard();
            
            // loadAllData() already calls the display functions for each data type
            // So data will be displayed in the Data Management tabs automatically
            
            progressText.textContent = ` Complete! All data loaded and displayed successfully.`;
            
            // Close modal after 2 seconds
            setTimeout(() => {
                closeUploadModal();
            }, 2000);
        } else {
            progressText.textContent = ` Error: ${result.error}`;
            progressText.style.color = '#f87171';
            showToast(result.error, 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        progressText.textContent = ` Error: ${error.message}`;
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
            ? ` Warning: No other Teaching Assistants qualified for ${entry.course_id}` 
            : ` Warning: No other instructors qualified for ${entry.course_id}`;
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
            infoDiv.textContent = ` ${qualifiedInstructors.length} ${roleText} available`;
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
    
    //  Check if instructor is qualified for this course
    const courseId = currentEditingEntry.course_id;
    const isQualified = instructor.qualified_courses && 
                        instructor.qualified_courses.includes(courseId);
    
    if (!isQualified) {
        showToast(` Instructor ${instructor.name} is not qualified to teach ${courseId}`, 'error');
        console.error(`Qualification check failed:`, {
            instructor: instructor.name,
            instructorId: instructor.instructor_id,
            courseId: courseId,
            qualifiedCourses: instructor.qualified_courses
        });
        return;
    }
    
    //  Check if this is a lab SECTION and validate instructor role
    const course = allData.courses.find(c => c.course_id === courseId);
    const isLabSection = currentEditingEntry.section_id === 'LAB' || 
                         (currentEditingEntry.section_id && currentEditingEntry.section_id.toLowerCase().includes('lab'));
    
    if (isLabSection) {
        // LAB sections must have Teaching Assistants
        if (instructor.role !== 'Teaching Assistant') {
            showToast(` Lab sections must be assigned to Teaching Assistants only. ${instructor.name} is a ${instructor.role}.`, 'error');
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
            showToast(` Lecture sections must be assigned to Professors or Doctors. ${instructor.name} is a ${instructor.role}.`, 'error');
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
    
    //  Check instructor availability for the selected day
    if (instructor.preferred_slots && instructor.preferred_slots.toLowerCase().includes('not on')) {
        const prefs = instructor.preferred_slots.toLowerCase();
        const notOnDay = prefs.replace('not on ', '').trim();
        if (notOnDay === newDay.toLowerCase()) {
            showToast(` ${instructor.name} is not available on ${newDay} (Preference: ${instructor.preferred_slots})`, 'error');
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
    
    showToast(' Class updated successfully!', 'success');
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
// REPORT PROGRESS OVERLAY FUNCTIONS
// ============================================================================

// Create report progress overlay
function createReportProgressOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'reload-overlay';
    overlay.style.zIndex = '999999';
    overlay.innerHTML = `
        <div class="reload-content">
            <div class="reload-icon">
                <i class="fas fa-file-pdf" style="color: #667eea; font-size: 4rem; animation: pulse 1s ease-in-out infinite;"></i>
            </div>
            <h2 class="reload-title">Generating Report</h2>
            <p class="reload-message">Creating comprehensive analytics PDF...</p>
            <div class="reload-progress-bar">
                <div class="reload-progress-fill" style="width: 0%;"></div>
            </div>
            <p class="reload-status">Initializing...</p>
            <div class="reload-stats">
                <div class="stat-item">
                    <i class="fas fa-chart-line"></i>
                    <span>Analyzing Data</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-file-alt"></i>
                    <span>Generating Pages</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-download"></i>
                    <span>Creating PDF</span>
                </div>
            </div>
        </div>
    `;
    return overlay;
}

// Update report progress
function updateReportProgress(overlay, percent, message) {
    const progressFill = overlay.querySelector('.reload-progress-fill');
    const statusText = overlay.querySelector('.reload-status');
    
    progressFill.style.width = percent + '%';
    statusText.textContent = message;
    
    // Animate stat items based on progress
    const statItems = overlay.querySelectorAll('.stat-item');
    if (percent >= 30) statItems[0]?.classList.add('active');
    if (percent >= 60) statItems[1]?.classList.add('active');
    if (percent >= 90) statItems[2]?.classList.add('active');
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
    
    showToast('Creating beautiful timetable PDF...', 'info');
    
    try {
        // Simple text cleaner
        const clean = (text) => {
            if (!text && text !== 0) return '';
            return String(text).replace(/[^\x20-\x7E]/g, '').trim() || 'N/A';
        };
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4');
        
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
        const timeSlots = ['9:00 AM - 10:30 AM', '10:45 AM - 12:15 PM', '12:30 PM - 2:00 PM', '2:15 PM - 3:45 PM'];
        
        // Color palette - Modern and vibrant
        const colors = {
            primary: [65, 105, 225],      // Royal Blue
            secondary: [138, 43, 226],    // Blue Violet
            accent: [255, 140, 0],        // Dark Orange
            success: [46, 204, 113],      // Emerald
            info: [52, 152, 219],         // Peter River
            warning: [241, 196, 15],      // Sun Flower
            danger: [231, 76, 60],        // Alizarin
            dark: [52, 73, 94],           // Wet Asphalt
            light: [236, 240, 241],       // Clouds
            white: [255, 255, 255]
        };
        
        // Day colors for visual distinction
        const dayColors = [
            [231, 76, 60],    // Sunday - Red
            [52, 152, 219],   // Monday - Blue
            [46, 204, 113],   // Tuesday - Green
            [155, 89, 182],   // Wednesday - Purple
            [241, 196, 15]    // Thursday - Yellow
        ];
        
        // Group schedule by day and time
        const grouped = {};
        currentTimetable.schedule.forEach(entry => {
            if (!grouped[entry.day]) grouped[entry.day] = {};
            const timeKey = `${entry.start_time} - ${entry.end_time}`;
            if (!grouped[entry.day][timeKey]) grouped[entry.day][timeKey] = [];
            grouped[entry.day][timeKey].push(entry);
        });
        
        // ============================================================
        // STUNNING COVER PAGE
        // ============================================================
        
        // Gradient background simulation with multiple rectangles
        for (let i = 0; i < 210; i++) {
            const ratio = i / 210;
            const r = 65 + (138 - 65) * ratio;
            const g = 105 + (43 - 105) * ratio;
            const b = 225 + (226 - 225) * ratio;
            doc.setFillColor(r, g, b);
            doc.rect(0, i, 297, 1, 'F');
        }
        
        // Decorative circles with transparency effect
        doc.setFillColor(255, 255, 255);
        doc.setGState(doc.GState({ opacity: 0.1 }));
        doc.circle(50, 40, 60, 'F');
        doc.circle(247, 170, 70, 'F');
        doc.circle(148.5, 105, 40, 'F');
        doc.setGState(doc.GState({ opacity: 1 }));
        
        // Modern title with shadow effect
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(42);
        doc.setFont('helvetica', 'bold');
        doc.text('UNIVERSITY', 149.5, 51, { align: 'center' });
        doc.text('TIMETABLE', 149.5, 71, { align: 'center' });
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(42);
        doc.text('UNIVERSITY', 148.5, 50, { align: 'center' });
        doc.text('TIMETABLE', 148.5, 70, { align: 'center' });
        
        // Academic year badge
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(110, 80, 77, 12, 6, 6, 'F');
        doc.setTextColor(65, 105, 225);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Academic Year 2024/2025', 148.5, 87.5, { align: 'center' });
        
        // Elegant info box with stats
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(65, 105, 225);
        doc.setLineWidth(1);
        doc.roundedRect(50, 105, 197, 70, 8, 8, 'FD');
        
        // Info box header
        doc.setFillColor(65, 105, 225);
        doc.roundedRect(50, 105, 197, 15, 8, 8, 'F');
        doc.rect(50, 113, 197, 7, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('SCHEDULE OVERVIEW', 148.5, 115, { align: 'center' });
        
        // Stats in a beautiful grid
        const date = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        doc.setTextColor(52, 73, 94);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        
        // Left column stats
        doc.text('Generated:', 70, 135);
        doc.text('Total Classes:', 70, 145);
        doc.text('Success Rate:', 70, 155);
        
        // Right column stats
        doc.text('Active Days:', 70, 165);
        doc.text('Departments:', 190, 135);
        doc.text('Instructors:', 190, 145);
        
        // Values
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(clean(date), 115, 135);
        doc.text(String(currentTimetable.schedule.length), 115, 145);
        
        // Success rate with color - FIXED CALCULATION
        const totalCourses = currentTimetable.total_courses || currentTimetable.scheduled_courses || currentTimetable.schedule.length;
        const scheduledCourses = currentTimetable.scheduled_courses || currentTimetable.schedule.length;
        const successRate = totalCourses > 0 ? Math.round((scheduledCourses / totalCourses) * 100) : 0;
        
        if (successRate >= 90) doc.setTextColor(46, 204, 113);
        else if (successRate >= 70) doc.setTextColor(241, 196, 15);
        else doc.setTextColor(231, 76, 60);
        doc.setFont('helvetica', 'bold');
        doc.text(`${successRate}%`, 115, 155);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(String(Object.keys(grouped).length), 115, 165);
        doc.text('Multiple', 220, 135);
        doc.text('Various', 220, 145);
        
        // Bottom banner with decorative elements
        doc.setFillColor(52, 73, 94);
        doc.rect(0, 185, 297, 25, 'F');
        
        // Small decorative lines
        doc.setDrawColor(255, 140, 0);
        doc.setLineWidth(2);
        doc.line(50, 197, 100, 197);
        doc.line(197, 197, 247, 197);
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('CSP TimetableAI', 148.5, 195, { align: 'center' });
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Intelligent Scheduling System - Powered by Constraint Satisfaction', 148.5, 202, { align: 'center' });
        
        // ============================================================
        // BEAUTIFUL TIMETABLE GRID - LIKE REFERENCE IMAGE
        // ============================================================
        
        doc.addPage();
        
        // Page title with beautiful header
        doc.setFillColor(65, 105, 225);
        doc.rect(0, 0, 297, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('WEEKLY CLASS SCHEDULE', 148.5, 13, { align: 'center' });
        
        // Prepare data for the beautiful grid table
        const timetableData = [];
        
        timeSlots.forEach((time) => {
            const row = [time]; // First column is time
            
            days.forEach(day => {
                const dayClasses = grouped[day] || {};
                const classes = dayClasses[time] || [];
                
                if (classes.length === 0) {
                    row.push('');
                } else if (classes.length === 1) {
                    const entry = classes[0];
                    const isLab = entry.course_type && entry.course_type.toLowerCase().includes('lab');
                    row.push({
                        content: `${clean(entry.course_id)}\n${clean(entry.course_name)}\nRoom: ${clean(entry.room_id)}`,
                        styles: { 
                            fillColor: isLab ? [255, 140, 0] : [65, 105, 225],
                            textColor: [255, 255, 255],
                            fontStyle: 'bold',
                            fontSize: 8,
                            halign: 'center',
                            valign: 'middle',
                            cellPadding: 2
                        }
                    });
                } else {
                    // Multiple classes - show first one with indicator
                    const entry = classes[0];
                    const isLab = entry.course_type && entry.course_type.toLowerCase().includes('lab');
                    row.push({
                        content: `${clean(entry.course_id)}\n${clean(entry.course_name)}\nRoom: ${clean(entry.room_id)}\n+${classes.length - 1} more`,
                        styles: { 
                            fillColor: isLab ? [255, 140, 0] : [65, 105, 225],
                            textColor: [255, 255, 255],
                            fontStyle: 'bold',
                            fontSize: 7,
                            halign: 'center',
                            valign: 'middle',
                            cellPadding: 2
                        }
                    });
                }
            });
            
            timetableData.push(row);
        });
        
        // Create the beautiful grid table
        doc.autoTable({
            startY: 25,
            head: [['TIME', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY']],
            body: timetableData,
            theme: 'grid',
            headStyles: {
                0: { fillColor: [52, 73, 94], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold', halign: 'center' },
                1: { fillColor: [231, 76, 60], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold', halign: 'center' },
                2: { fillColor: [52, 152, 219], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold', halign: 'center' },
                3: { fillColor: [46, 204, 113], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold', halign: 'center' },
                4: { fillColor: [155, 89, 182], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold', halign: 'center' },
                5: { fillColor: [241, 196, 15], textColor: [52, 73, 94], fontSize: 10, fontStyle: 'bold', halign: 'center' }
            },
            columnStyles: {
                0: { cellWidth: 32, fillColor: [236, 240, 241], fontStyle: 'bold', fontSize: 8, halign: 'center', valign: 'middle' },
                1: { cellWidth: 53, minCellHeight: 30 },
                2: { cellWidth: 53, minCellHeight: 30 },
                3: { cellWidth: 53, minCellHeight: 30 },
                4: { cellWidth: 53, minCellHeight: 30 },
                5: { cellWidth: 53, minCellHeight: 30 }
            },
            bodyStyles: {
                fontSize: 8,
                cellPadding: 3,
                valign: 'middle',
                halign: 'center',
                lineColor: [200, 200, 200],
                lineWidth: 0.5
            },
            alternateRowStyles: {
                fillColor: [255, 255, 255]
            },
            margin: { left: 10, right: 10, top: 25, bottom: 20 },
            pageBreak: 'auto',
            rowPageBreak: 'avoid',
            showHead: 'everyPage',
            didParseCell: function(data) {
                // Make empty cells white
                if (data.section === 'body' && data.column.index > 0) {
                    if (!data.cell.raw || data.cell.raw === '') {
                        data.cell.styles.fillColor = [255, 255, 255];
                    }
                }
            },
            didDrawCell: function(data) {
                // Add subtle shadow effect to filled cells
                if (data.section === 'body' && data.column.index > 0 && data.cell.raw && data.cell.raw !== '') {
                    doc.setDrawColor(150, 150, 150);
                    doc.setLineWidth(0.3);
                }
            }
        });
        
        // Add detailed schedule per day on separate pages
        days.forEach((day, dayIndex) => {
            const dayClasses = grouped[day] || {};
            const allClasses = Object.values(dayClasses).flat();
            
            if (allClasses.length > 0) {
                doc.addPage();
                
                // Day-specific page header
                doc.setFillColor(...dayColors[dayIndex]);
                doc.rect(0, 0, 297, 25, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(18);
                doc.setFont('helvetica', 'bold');
                doc.text(`${day.toUpperCase()} - Detailed Schedule`, 148.5, 15, { align: 'center' });
                
                // Detailed class list using autoTable
                const dayData = [];
                timeSlots.forEach(time => {
                    const classes = dayClasses[time] || [];
                    classes.forEach(entry => {
                        // Properly determine if it's Lab or Lecture (not both)
                        let courseType = 'Lecture'; // Default
                        if (entry.course_type) {
                            const typeStr = entry.course_type.toLowerCase();
                            if (typeStr.includes('lab')) {
                                courseType = 'Lab';
                            } else if (typeStr.includes('lecture')) {
                                courseType = 'Lecture';
                            } else {
                                courseType = entry.course_type; // Keep original if neither
                            }
                        }
                        
                        dayData.push([
                            clean(time),
                            clean(entry.course_id),
                            clean(entry.course_name),
                            clean(courseType),
                            clean(entry.room_id),
                            clean(entry.instructor_name)
                        ]);
                    });
                });
                
                doc.autoTable({
                    startY: 35,
                    head: [['Time', 'Course ID', 'Course Name', 'Type', 'Room', 'Instructor']],
                    body: dayData,
                    theme: 'grid',
                    headStyles: { 
                        fillColor: dayColors[dayIndex], 
                        fontSize: 10, 
                        halign: 'center',
                        fontStyle: 'bold',
                        textColor: [255, 255, 255]
                    },
                    bodyStyles: { 
                        fontSize: 9,
                        cellPadding: 4
                    },
                    columnStyles: {
                        0: { cellWidth: 38, halign: 'center', fontStyle: 'bold' },
                        1: { cellWidth: 25, halign: 'center', fontStyle: 'bold', fillColor: [240, 248, 255] },
                        2: { cellWidth: 75 },
                        3: { cellWidth: 28, halign: 'center' },
                        4: { cellWidth: 22, halign: 'center' },
                        5: { cellWidth: 54 }
                    },
                    alternateRowStyles: { fillColor: [250, 250, 250] },
                    margin: { left: 15, right: 15 },
                    didDrawCell: (data) => {
                        // Add subtle borders
                        if (data.section === 'body' && data.column.index === 1) {
                            doc.setDrawColor(...dayColors[dayIndex]);
                            doc.setLineWidth(0.5);
                        }
                    }
                });
            }
        });
        
        // Add page numbers and footer to all pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            // Elegant footer with decorative line
            doc.setDrawColor(65, 105, 225);
            doc.setLineWidth(0.5);
            doc.line(10, 202, 287, 202);
            
            // Page number (center)
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'normal');
            doc.text(`Page ${i} of ${pageCount}`, 148.5, 206, { align: 'center' });
            
            // System name (left)
            doc.text('CSP TimetableAI - Intelligent Scheduling System', 20, 206);
            
            // Date (right)
            doc.text(new Date().toLocaleDateString('en-US'), 270, 206);
            
            // Copyright notice (center bottom)
            doc.setFontSize(7);
            doc.setTextColor(120, 120, 120);
            doc.setFont('helvetica', 'italic');
            doc.text('© 2025 Kareem - All Rights Reserved', 148.5, 209, { align: 'center' });
        }
        
        // Save with professional filename
        const timestamp = new Date().toISOString().split('T')[0];
        doc.save(`University-Timetable-${timestamp}.pdf`);
        showToast('Beautiful timetable PDF created successfully!', 'success');
        
    } catch (error) {
        console.error('PDF Generation Error:', error);
        showToast('Failed to generate timetable PDF: ' + error.message, 'error');
    }
}

// ============================================================================
// ENHANCED DETAILED REPORT WITH ANALYTICS
// ============================================================================

async function downloadDetailedReport() {
    if (!currentTimetable) {
        showToast('Please generate a timetable first', 'warning');
        return;
    }
    
    // Create progress overlay
    const progressOverlay = createReportProgressOverlay();
    document.body.appendChild(progressOverlay);
    
    try {
        updateReportProgress(progressOverlay, 10, 'Analyzing timetable data...');
        await sleep(300);
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        updateReportProgress(progressOverlay, 20, 'Collecting course data...');
        
        // Get data safely
        const schedule = currentTimetable.export_to_dict ? 
                        currentTimetable.export_to_dict() : 
                        currentTimetable;
        const courses = allData.courses || [];
        const instructors = allData.instructors || [];
        const rooms = allData.rooms || [];
        const timeslots = allData.timeslots || [];
        
        if (!schedule || !schedule.schedule) {
            throw new Error('Invalid timetable data structure');
        }
        
        updateReportProgress(progressOverlay, 30, 'Analyzing scheduled courses...');
        await sleep(200);
    
    // ========================================================================
    // ANALYZE DATA
    // ========================================================================
    
    updateReportProgress(progressOverlay, 40, 'Finding unscheduled courses...');
    await sleep(200);
    
    // Find scheduled courses
    const scheduledCourseIds = new Set();
    schedule.schedule.forEach(entry => {
        scheduledCourseIds.add(entry.course_id);
    });
    
    // Find unscheduled courses
    const unscheduledCourses = courses.filter(c => !scheduledCourseIds.has(c.course_id));
    
    // Analyze why courses are unscheduled
    const coursesWithoutQualifiedInstructors = [];
    const coursesWithNoInstructors = [];
    
    unscheduledCourses.forEach(course => {
        // Find qualified instructors for this course
        const qualifiedInstructors = instructors.filter(inst => {
            const qualified = inst.qualified_courses || [];
            return qualified.includes(course.course_id);
        });
        
        if (qualifiedInstructors.length === 0) {
            coursesWithNoInstructors.push({
                course: course,
                reason: 'No qualified instructors found'
            });
        } else {
            // Check if they're professors or TAs based on course type
            const needsProfessor = course.type.toLowerCase().includes('lecture') || 
                                 course.type.toLowerCase().includes('s1');
            const needsTA = course.type.toLowerCase().includes('lab');
            
            const professors = qualifiedInstructors.filter(i => 
                i.role.toLowerCase().includes('professor') || 
                i.role.toLowerCase().includes('doctor')
            );
            const tas = qualifiedInstructors.filter(i => 
                i.role.toLowerCase().includes('ta') || 
                i.role.toLowerCase().includes('teaching assistant')
            );
            
            if (needsProfessor && professors.length === 0) {
                coursesWithoutQualifiedInstructors.push({
                    course: course,
                    reason: 'No qualified Professors/Doctors',
                    qualified: qualifiedInstructors.length,
                    needsRole: 'Professor/Doctor'
                });
            } else if (needsTA && tas.length === 0) {
                coursesWithoutQualifiedInstructors.push({
                    course: course,
                    reason: 'No qualified Teaching Assistants',
                    qualified: qualifiedInstructors.length,
                    needsRole: 'Teaching Assistant'
                });
            }
        }
    });
    
    // Find instructors with assignments
    const instructorAssignments = {};
    instructors.forEach(inst => {
        instructorAssignments[inst.instructor_id] = [];
    });
    
    schedule.schedule.forEach(entry => {
        if (instructorAssignments[entry.instructor_id] !== undefined) {
            instructorAssignments[entry.instructor_id].push(entry);
        }
    });
    
    // Find idle instructors (no assignments)
    const idleInstructors = instructors.filter(inst => 
        instructorAssignments[inst.instructor_id].length === 0
    );
    
    updateReportProgress(progressOverlay, 50, 'Analyzing instructor assignments...');
    await sleep(200);
    
    // Categorize idle instructors
    const idleProfessors = idleInstructors.filter(i => 
        i.role.toLowerCase().includes('professor') || 
        i.role.toLowerCase().includes('doctor')
    );
    const idleTAs = idleInstructors.filter(i => 
        i.role.toLowerCase().includes('ta') || 
        i.role.toLowerCase().includes('teaching assistant')
    );
    
    // Room utilization
    const roomUsage = {};
    rooms.forEach(room => {
        roomUsage[room.room_id] = 0;
    });
    schedule.schedule.forEach(entry => {
        if (roomUsage[entry.room_id] !== undefined) {
            roomUsage[entry.room_id]++;
        }
    });
    
    const totalSlots = timeslots.length * 5; // 5 days
    const underutilizedRooms = rooms.filter(room => {
        const usage = roomUsage[room.room_id] || 0;
        const utilizationRate = (usage / totalSlots) * 100;
        return utilizationRate < 30;
    });
    
    // ========================================================================
    // COVER PAGE
    // ========================================================================
    
    updateReportProgress(progressOverlay, 60, 'Creating cover page...');
    await sleep(200);
    
    // Gradient background
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont(undefined, 'bold');
 doc.text('TIMETABLE', 105, 80, { align: 'center' });
 doc.text('ANALYTICS REPORT', 105, 95, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
 doc.text('Comprehensive Scheduling Analysis', 105, 110, { align: 'center' });
    
    // Date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    doc.setFontSize(11);
 doc.text(`Generated: ${dateStr}`, 105, 125, { align: 'center' });
    
    // Key stats box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(40, 140, 130, 60, 5, 5, 'F');
    
    doc.setTextColor(102, 126, 234);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
 doc.text('SCHEDULING SUMMARY', 105, 150, { align: 'center' });
    
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    
    const summaryStats = [
        `Scheduled Courses: ${schedule.scheduled_courses} / ${schedule.total_courses}`,
        `Success Rate: ${((schedule.scheduled_courses / schedule.total_courses) * 100).toFixed(1)}%`,
        `Unscheduled Courses: ${unscheduledCourses.length}`,
        `Idle Instructors: ${idleInstructors.length}`,
        `Total Classes: ${schedule.schedule.length}`
    ];
    
    let yPos = 160;
    summaryStats.forEach(stat => {
 doc.text(stat, 50, yPos);
        yPos += 7;
    });
    
    // Footer
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
 doc.text('CSP TimetableAI - Intelligent Scheduling System', 105, 250, { align: 'center' });
    doc.setFontSize(7);
 doc.text(' 2025 Kareem. All Rights Reserved.', 105, 255, { align: 'center' });
    
    // ========================================================================
    // PAGE 2: EXECUTIVE SUMMARY
    // ========================================================================
    
    updateReportProgress(progressOverlay, 70, 'Generating executive summary...');
    await sleep(200);
    
    doc.addPage();
    yPos = 20;
    
    // Header
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
 doc.text('Executive Summary', 15, 18);
    
    yPos = 40;
    
    // Overall Statistics
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
 doc.text('Overall Statistics', 15, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    const stats = [
        { label: 'Total Courses in System:', value: courses.length },
        { label: 'Successfully Scheduled:', value: schedule.scheduled_courses, color: [76, 175, 80] },
        { label: 'Unscheduled Courses:', value: unscheduledCourses.length, color: [244, 67, 54] },
        { label: 'Total Instructors:', value: instructors.length },
        { label: 'Active Instructors:', value: instructors.length - idleInstructors.length, color: [76, 175, 80] },
        { label: 'Idle Instructors:', value: idleInstructors.length, color: [255, 152, 0] },
        { label: 'Total Rooms:', value: rooms.length },
        { label: 'Underutilized Rooms (<30%):', value: underutilizedRooms.length, color: [255, 152, 0] },
        { label: 'Available Time Slots:', value: timeslots.length },
        { label: 'Total Classes Scheduled:', value: schedule.schedule.length }
    ];
    
    stats.forEach(stat => {
        doc.setTextColor(60, 60, 60);
 doc.text(stat.label, 20, yPos);
        
        if (stat.color) {
            doc.setTextColor(stat.color[0], stat.color[1], stat.color[2]);
        }
        doc.setFont(undefined, 'bold');
 doc.text(stat.value.toString(), 120, yPos);
        doc.setFont(undefined, 'normal');
        
        yPos += 7;
    });
    
    yPos += 10;
    
 // Issues Summary
    doc.setTextColor(244, 67, 54);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
 doc.text('Critical Issues Identified', 15, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    const issues = [
        {
            icon: '',
            title: 'Courses Without Qualified Instructors',
            count: coursesWithNoInstructors.length,
            severity: 'High'
        },
        {
            icon: '',
            title: 'Courses Without Proper Role Match',
            count: coursesWithoutQualifiedInstructors.length,
            severity: 'High'
        },
        {
            icon: '',
            title: 'Idle Professors/Doctors',
            count: idleProfessors.length,
            severity: 'Medium'
        },
        {
            icon: '',
            title: 'Idle Teaching Assistants',
            count: idleTAs.length,
            severity: 'Medium'
        },
        {
            icon: '',
            title: 'Underutilized Rooms',
            count: underutilizedRooms.length,
            severity: 'Low'
        }
    ];
    
    issues.forEach(issue => {
        doc.setTextColor(60, 60, 60);
        doc.text(`${issue.title}:`, 20, yPos);
        
        const severityColor = issue.severity === 'High' ? [244, 67, 54] : 
                             issue.severity === 'Medium' ? [255, 152, 0] : 
                             [33, 150, 243];
        doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
        doc.setFont(undefined, 'bold');
 doc.text(`${issue.count} (${issue.severity})`, 140, yPos);
        doc.setFont(undefined, 'normal');
        
        yPos += 7;
    });
    
    // ========================================================================
    // PAGE 3: UNSCHEDULED COURSES - NO QUALIFIED INSTRUCTORS
    // ========================================================================
    
    if (coursesWithNoInstructors.length > 0) {
        doc.addPage();
        yPos = 20;
        
        // Header
        doc.setFillColor(244, 67, 54);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
 doc.text(' Courses Without ANY Qualified Instructors', 15, 18);
        
        yPos = 40;
        
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
 doc.text(`Total: ${coursesWithNoInstructors.length} courses cannot be scheduled`, 15, yPos);
        yPos += 10;
        
        // Table header
        doc.setFillColor(244, 67, 54);
        doc.rect(15, yPos, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
 doc.text('Course ID', 20, yPos + 5.5);
 doc.text('Course Name', 55, yPos + 5.5);
 doc.text('Type', 140, yPos + 5.5);
 doc.text('Credits', 170, yPos + 5.5);
        
        yPos += 10;
        
        coursesWithNoInstructors.forEach((item, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            
            const bgColor = index % 2 === 0 ? [255, 245, 245] : [255, 255, 255];
            doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
            doc.rect(15, yPos, 180, 7, 'F');
            
            doc.setTextColor(40, 40, 40);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(8);
 doc.text(item.course.course_id, 20, yPos + 4.5);
            
            const courseName = item.course.name.length > 35 ? 
                item.course.name.substring(0, 32) + '...' : 
                item.course.name;
 doc.text(courseName, 55, yPos + 4.5);
 doc.text(item.course.type, 140, yPos + 4.5);
 doc.text(item.course.credits.toString(), 170, yPos + 4.5);
            
            yPos += 7;
        });
        
        yPos += 5;
        
        // Recommendation
        doc.setFillColor(255, 243, 224);
        doc.rect(15, yPos, 180, 20, 'F');
        doc.setTextColor(230, 81, 0);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text('RECOMMENDATION:', 20, yPos + 5);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(8);
        const rec1 = 'Add qualified instructors to the system who can teach these courses.';
        const rec2 = 'Update existing instructors\' qualified courses list to include these courses.';
        doc.text(rec1, 20, yPos + 10);
        doc.text(rec2, 20, yPos + 15);
    }
    
    // ========================================================================
    // PAGE: UNSCHEDULED COURSES - WRONG ROLE
    // ========================================================================
    
    if (coursesWithoutQualifiedInstructors.length > 0) {
        doc.addPage();
        yPos = 20;
        
        // Header
        doc.setFillColor(255, 152, 0);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
 doc.text(' Courses Without Proper Role Match', 15, 18);
        
        yPos = 40;
        
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
 doc.text(`Total: ${coursesWithoutQualifiedInstructors.length} courses need specific roles`, 15, yPos);
        yPos += 10;
        
        // Table header
        doc.setFillColor(255, 152, 0);
        doc.rect(15, yPos, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
 doc.text('Course ID', 20, yPos + 5.5);
 doc.text('Course Name', 55, yPos + 5.5);
 doc.text('Type', 120, yPos + 5.5);
 doc.text('Needs Role', 155, yPos + 5.5);
        
        yPos += 10;
        
        coursesWithoutQualifiedInstructors.forEach((item, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            
            const bgColor = index % 2 === 0 ? [255, 248, 225] : [255, 255, 255];
            doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
            doc.rect(15, yPos, 180, 7, 'F');
            
            doc.setTextColor(40, 40, 40);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(8);
 doc.text(item.course.course_id, 20, yPos + 4.5);
            
            const courseName = item.course.name.length > 25 ? 
                item.course.name.substring(0, 22) + '...' : 
                item.course.name;
 doc.text(courseName, 55, yPos + 4.5);
 doc.text(item.course.type, 120, yPos + 4.5);
            
            doc.setTextColor(230, 81, 0);
            doc.setFont(undefined, 'bold');
            const roleText = item.needsRole === 'Professor/Doctor' ? 'Prof/Dr' : 'TA';
 doc.text(roleText, 155, yPos + 4.5);
            
            yPos += 7;
        });
        
        yPos += 5;
        
        // Recommendation
        doc.setFillColor(255, 243, 224);
        doc.rect(15, yPos, 180, 20, 'F');
        doc.setTextColor(230, 81, 0);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text('RECOMMENDATION:', 20, yPos + 5);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(8);
        const rec3 = 'Hire or assign the appropriate role (Professor/Doctor or TA) for these courses.';
        const rec4 = 'Lectures/S1 courses require Professors/Doctors, Labs require Teaching Assistants.';
        doc.text(rec3, 20, yPos + 10);
        doc.text(rec4, 20, yPos + 15);
    }
    
    // ========================================================================
    // PAGE: IDLE INSTRUCTORS
    // ========================================================================
    
    if (idleInstructors.length > 0) {
        doc.addPage();
        yPos = 20;
        
        // Header
        doc.setFillColor(33, 150, 243);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
 doc.text(' Idle Instructors (No Courses Assigned)', 15, 18);
        
        yPos = 40;
        
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
 doc.text(`Total: ${idleInstructors.length} instructors with no assignments`, 15, yPos);
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(9);
 doc.text(`(${idleProfessors.length} Professors/Doctors, ${idleTAs.length} Teaching Assistants)`, 15, yPos + 6);
        yPos += 15;
        
        // Table header
        doc.setFillColor(33, 150, 243);
        doc.rect(15, yPos, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
 doc.text('ID', 20, yPos + 5.5);
 doc.text('Name', 45, yPos + 5.5);
 doc.text('Role', 100, yPos + 5.5);
 doc.text('Qualified Courses', 135, yPos + 5.5);
        
        yPos += 10;
        
        idleInstructors.forEach((instructor, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            
            const bgColor = index % 2 === 0 ? [227, 242, 253] : [255, 255, 255];
            doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
            doc.rect(15, yPos, 180, 7, 'F');
            
            doc.setTextColor(40, 40, 40);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(8);
 doc.text(instructor.instructor_id, 20, yPos + 4.5);
            
            const name = instructor.name.length > 22 ? 
                instructor.name.substring(0, 19) + '...' : 
                instructor.name;
 doc.text(name, 45, yPos + 4.5);
            
            const role = instructor.role.length > 15 ? 
                instructor.role.substring(0, 12) + '...' : 
                instructor.role;
 doc.text(role, 100, yPos + 4.5);
            
            const qualCount = (instructor.qualified_courses || []).length;
 doc.text(`${qualCount} courses`, 135, yPos + 4.5);
            
            yPos += 7;
        });
        
        yPos += 5;
        
        // Recommendation
        doc.setFillColor(232, 245, 233);
        doc.rect(15, yPos, 180, 25, 'F');
        doc.setTextColor(27, 94, 32);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
 doc.text(' OPTIMIZATION OPPORTUNITIES:', 20, yPos + 5);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(8);
        const rec5 = '* Review if these instructors can be trained for unscheduled courses.';
        const rec6 = '* Consider adding more courses to their qualified courses list.';
        const rec7 = '* Evaluate workload distribution among active instructors.';
 doc.text(rec5, 20, yPos + 11);
 doc.text(rec6, 20, yPos + 16);
 doc.text(rec7, 20, yPos + 21);
    }
    
    // ========================================================================
    // PAGE: ROOM UTILIZATION
    // ========================================================================
    
    if (underutilizedRooms.length > 0) {
        doc.addPage();
        yPos = 20;
        
        // Header
        doc.setFillColor(156, 39, 176);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
 doc.text(' Room Utilization Analysis', 15, 18);
        
        yPos = 40;
        
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
 doc.text(`Underutilized Rooms: ${underutilizedRooms.length} rooms with <30% usage`, 15, yPos);
        yPos += 10;
        
        // Table header
        doc.setFillColor(156, 39, 176);
        doc.rect(15, yPos, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
 doc.text('Room ID', 20, yPos + 5.5);
 doc.text('Type', 55, yPos + 5.5);
 doc.text('Capacity', 90, yPos + 5.5);
 doc.text('Times Used', 125, yPos + 5.5);
 doc.text('Utilization', 160, yPos + 5.5);
        
        yPos += 10;
        
        underutilizedRooms.forEach((room, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            
            const usage = roomUsage[room.room_id] || 0;
            const utilRate = ((usage / totalSlots) * 100).toFixed(1);
            
            const bgColor = index % 2 === 0 ? [243, 229, 245] : [255, 255, 255];
            doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
            doc.rect(15, yPos, 180, 7, 'F');
            
            doc.setTextColor(40, 40, 40);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(8);
 doc.text(room.room_id, 20, yPos + 4.5);
 doc.text(room.type, 55, yPos + 4.5);
 doc.text(room.capacity.toString(), 90, yPos + 4.5);
 doc.text(`${usage} / ${totalSlots}`, 125, yPos + 4.5);
            
            const utilColor = utilRate < 20 ? [244, 67, 54] : [255, 152, 0];
            doc.setTextColor(utilColor[0], utilColor[1], utilColor[2]);
            doc.setFont(undefined, 'bold');
 doc.text(`${utilRate}%`, 160, yPos + 4.5);
            
            yPos += 7;
        });
    }
    
    // ========================================================================
 // FINAL PAGE: RECOMMENDATIONS
    // ========================================================================
    
    doc.addPage();
    yPos = 20;
    
    // Header
    doc.setFillColor(76, 175, 80);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
 doc.text('Recommendations & Action Items', 15, 18);
    
    yPos = 40;
    
    // Priority actions
    const recommendations = [
        {
            priority: 'HIGH',
            color: [244, 67, 54],
            items: [
                `Address ${coursesWithNoInstructors.length} courses with no qualified instructors`,
                `Resolve role mismatches for ${coursesWithoutQualifiedInstructors.length} courses`,
                'Add qualified instructors or update qualifications in system'
            ]
        },
        {
            priority: 'MEDIUM',
            color: [255, 152, 0],
            items: [
                `Optimize workload for ${idleInstructors.length} idle instructors`,
                'Review and expand qualified courses for underutilized staff',
                'Balance teaching load across active instructors'
            ]
        },
        {
            priority: 'LOW',
            color: [33, 150, 243],
            items: [
                `Improve utilization of ${underutilizedRooms.length} underused rooms`,
                'Consider room capacity adjustments',
                'Evaluate if additional courses can be scheduled'
            ]
        }
    ];
    
    recommendations.forEach(rec => {
        // Priority badge
        doc.setFillColor(rec.color[0], rec.color[1], rec.color[2]);
        doc.roundedRect(15, yPos, 35, 8, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
 doc.text(rec.priority, 32.5, yPos + 5.5, { align: 'center' });
        
        yPos += 12;
        
        // Items
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        
        rec.items.forEach(item => {
 doc.text(`* ${item}`, 20, yPos);
            yPos += 6;
        });
        
        yPos += 5;
    });
    
    yPos += 10;
    
    // Success metrics
    doc.setFillColor(232, 245, 233);
    doc.roundedRect(15, yPos, 180, 35, 3, 3, 'F');
    doc.setTextColor(27, 94, 32);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
 doc.text('Success Metrics', 20, yPos + 8);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60, 60, 60);
    
    const currentSuccess = ((schedule.scheduled_courses / schedule.total_courses) * 100).toFixed(1);
 doc.text(`Current: ${currentSuccess}% of courses scheduled`, 20, yPos + 16);
 doc.text(`Target: 95%+ scheduling rate`, 20, yPos + 22);
 doc.text(`Goal: Zero courses without qualified instructors`, 20, yPos + 28);
    
    // ========================================================================
    // ADD PAGE NUMBERS TO ALL PAGES
    // ========================================================================
    
    updateReportProgress(progressOverlay, 90, 'Adding page numbers...');
    await sleep(200);
    
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Page number
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 288, { align: 'center' });
        
        // Report title
        doc.setFontSize(7);
        doc.text('CSP TimetableAI - Comprehensive Analytics Report', 105, 291, { align: 'center' });
        
        // Copyright notice
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        doc.setFont('helvetica', 'italic');
        doc.text('© 2025 Kareem - All Rights Reserved', 105, 294, { align: 'center' });
    }
    
    // Save the PDF
    updateReportProgress(progressOverlay, 95, 'Generating PDF file...');
    await sleep(300);
    
    doc.save('CSP-TimetableAI-Detailed-Report.pdf');
    
    updateReportProgress(progressOverlay, 100, 'Report generated successfully!');
    
    // Success animation
    const checkmark = progressOverlay.querySelector('.reload-icon');
    checkmark.innerHTML = '<i class="fas fa-check-circle" style="color: #4ade80; font-size: 4rem;"></i>';
    
    await sleep(800);
    
    // Remove overlay with fade out
    progressOverlay.style.opacity = '0';
    setTimeout(() => progressOverlay.remove(), 500);
    
    showToast(' Detailed analytics report downloaded successfully!', 'success');
    
    } catch (error) {
        console.error('Error generating report:', error);
        const overlay = document.querySelector('.reload-overlay');
        if (overlay) {
            const icon = overlay.querySelector('.reload-icon');
            icon.innerHTML = '<i class="fas fa-exclamation-circle" style="color: #f87171; font-size: 4rem;"></i>';
            updateReportProgress(overlay, 100, ' Failed to generate report');
            await sleep(2000);
            overlay.remove();
        }
        showToast('Failed to generate report: ' + error.message, 'error');
    }
}
