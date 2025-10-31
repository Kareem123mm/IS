# ============================================================================
# CSP TimetableAI - Intelligent Scheduling System
# Flask Backend Server
# 
# © 2025 Kareem. All Rights Reserved.
# This software is proprietary and confidential.
# ============================================================================

from flask import Flask, render_template, jsonify, request, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
import csv
import io
import os
from data_loader import DataLoader
from enhanced_csp_model import EnhancedCSPTimetable, Course, Instructor, Room, Timeslot

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload settings
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Global data loader
data_loader = DataLoader()
current_timetable = None
data_loaded = False  # Track if user has uploaded data

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# DON'T load data on startup - require user to upload files first
def initialize_data():
    """Load data from CSV files if they exist (DISABLED - require upload)"""
    global data_loaded
    data_loaded = False
    print("⚠️ Auto-load disabled. Please upload CSV files to begin.")
    return False

# Don't auto-load data - user must upload files first
# initialize_data()  # COMMENTED OUT - require manual upload

# ============================================================================
# API ROUTES
# ============================================================================

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/test')
def test_page():
    """Serve the test page"""
    return render_template('test.html')

@app.route('/api/check-data-status', methods=['GET'])
def check_data_status():
    """Check if data has been loaded"""
    global data_loaded
    try:
        # Only get counts if data is actually loaded
        if data_loaded:
            counts = {
                'courses': len(data_loader.get_courses()),
                'instructors': len(data_loader.get_instructors()),
                'rooms': len(data_loader.get_rooms()),
                'timeslots': len(data_loader.get_timeslots())
            }
        else:
            counts = {
                'courses': 0,
                'instructors': 0,
                'rooms': 0,
                'timeslots': 0
            }
        
        return jsonify({
            'success': True,
            'data_loaded': data_loaded,
            'counts': counts
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/upload-files', methods=['POST'])
def upload_files():
    """Upload CSV files for courses, instructors, rooms, and timeslots"""
    global data_loaded
    
    try:
        # Check if all required files are present
        required_files = ['courses', 'instructors', 'rooms', 'timeslots']
        uploaded_files = {}
        
        for file_key in required_files:
            if file_key not in request.files:
                return jsonify({'success': False, 'error': f'Missing {file_key} file'}), 400
            
            file = request.files[file_key]
            if file.filename == '':
                return jsonify({'success': False, 'error': f'No {file_key} file selected'}), 400
            
            if not allowed_file(file.filename):
                return jsonify({'success': False, 'error': f'{file_key} file must be CSV format'}), 400
            
            uploaded_files[file_key] = file
        
        # Save files to uploads directory
        file_paths = {}
        file_mapping = {
            'courses': 'Courses.csv',
            'instructors': 'instructors.csv',
            'rooms': 'Rooms.csv',
            'timeslots': 'TimeSlots.csv'
        }
        
        for key, file in uploaded_files.items():
            filename = file_mapping[key]
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            file_paths[key] = filepath
        
        # Load data from uploaded files
        data_loader.load_all_data(
            file_paths['courses'],
            file_paths['instructors'],
            file_paths['rooms'],
            file_paths['timeslots']
        )
        
        data_loaded = True
        
        return jsonify({
            'success': True,
            'message': 'Files uploaded and data loaded successfully',
            'counts': {
                'courses': len(data_loader.get_courses()),
                'instructors': len(data_loader.get_instructors()),
                'rooms': len(data_loader.get_rooms()),
                'timeslots': len(data_loader.get_timeslots())
            }
        })
        
    except Exception as e:
        data_loaded = False
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/data/summary', methods=['GET'])
def get_data_summary():
    """Get summary of all available data"""
    try:
        return jsonify({
            'success': True,
            'data': {
                'courses_count': len(data_loader.get_courses()),
                'instructors_count': len(data_loader.get_instructors()),
                'rooms_count': len(data_loader.get_rooms()),
                'timeslots_count': len(data_loader.get_timeslots())
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/courses', methods=['GET'])
def get_courses():
    """Get all courses"""
    try:
        courses = data_loader.get_courses()
        return jsonify({
            'success': True,
            'courses': [c.to_dict() for c in courses]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/instructors', methods=['GET'])
def get_instructors():
    """Get all instructors"""
    try:
        instructors = data_loader.get_instructors()
        return jsonify({
            'success': True,
            'instructors': [i.to_dict() for i in instructors]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    """Get all rooms"""
    try:
        rooms = data_loader.get_rooms()
        return jsonify({
            'success': True,
            'rooms': [r.to_dict() for r in rooms]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/timeslots', methods=['GET'])
def get_timeslots():
    """Get all timeslots"""
    try:
        timeslots = data_loader.get_timeslots()
        return jsonify({
            'success': True,
            'timeslots': [t.to_dict() for t in timeslots]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================================================
# DELETE ENDPOINTS
# ============================================================================

@app.route('/api/courses/<course_id>', methods=['DELETE'])
def delete_course(course_id):
    """Delete a course by ID"""
    global data_loaded
    try:
        if not data_loaded:
            return jsonify({'success': False, 'error': 'No data loaded'}), 400
        
        success = data_loader.delete_course(course_id)
        if success:
            return jsonify({'success': True, 'message': f'Course {course_id} deleted successfully'})
        else:
            return jsonify({'success': False, 'error': 'Failed to delete course'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/instructors/<instructor_id>', methods=['DELETE'])
def delete_instructor(instructor_id):
    """Delete an instructor by ID"""
    global data_loaded
    try:
        if not data_loaded:
            return jsonify({'success': False, 'error': 'No data loaded'}), 400
        
        success = data_loader.delete_instructor(instructor_id)
        if success:
            return jsonify({'success': True, 'message': f'Instructor {instructor_id} deleted successfully'})
        else:
            return jsonify({'success': False, 'error': 'Failed to delete instructor'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/rooms/<room_id>', methods=['DELETE'])
def delete_room(room_id):
    """Delete a room by ID"""
    global data_loaded
    try:
        if not data_loaded:
            return jsonify({'success': False, 'error': 'No data loaded'}), 400
        
        success = data_loader.delete_room(room_id)
        if success:
            return jsonify({'success': True, 'message': f'Room {room_id} deleted successfully'})
        else:
            return jsonify({'success': False, 'error': 'Failed to delete room'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/timeslots/<day>/<start_time>', methods=['DELETE'])
def delete_timeslot(day, start_time):
    """Delete a timeslot by day and start time"""
    global data_loaded
    try:
        if not data_loaded:
            return jsonify({'success': False, 'error': 'No data loaded'}), 400
        
        # URL decode the start_time (in case it contains special characters like :)
        from urllib.parse import unquote
        start_time = unquote(start_time)
        
        success = data_loader.delete_timeslot(day, start_time)
        if success:
            return jsonify({'success': True, 'message': f'Timeslot {day} {start_time} deleted successfully'})
        else:
            return jsonify({'success': False, 'error': 'Failed to delete timeslot'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================================================
# UPDATE ENDPOINTS
# ============================================================================

@app.route('/api/courses/<course_id>', methods=['PUT'])
def update_course(course_id):
    """Update a course"""
    global data_loaded
    try:
        if not data_loaded:
            return jsonify({'success': False, 'error': 'No data loaded'}), 400
        
        data = request.get_json()
        success = data_loader.update_course(
            course_id,
            data.get('course_name'),
            data.get('credits'),
            data.get('course_type')
        )
        
        if success:
            return jsonify({'success': True, 'message': f'Course {course_id} updated successfully'})
        else:
            return jsonify({'success': False, 'error': 'Failed to update course'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/instructors/<instructor_id>', methods=['PUT'])
def update_instructor(instructor_id):
    """Update an instructor"""
    global data_loaded
    try:
        if not data_loaded:
            return jsonify({'success': False, 'error': 'No data loaded'}), 400
        
        data = request.get_json()
        success = data_loader.update_instructor(
            instructor_id,
            data.get('name'),
            data.get('role'),
            data.get('preferred_slots'),
            data.get('qualified_courses')
        )
        
        if success:
            return jsonify({'success': True, 'message': f'Instructor {instructor_id} updated successfully'})
        else:
            return jsonify({'success': False, 'error': 'Failed to update instructor'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/rooms/<room_id>', methods=['PUT'])
def update_room(room_id):
    """Update a room"""
    global data_loaded
    try:
        if not data_loaded:
            return jsonify({'success': False, 'error': 'No data loaded'}), 400
        
        data = request.get_json()
        success = data_loader.update_room(
            room_id,
            data.get('room_type'),
            int(data.get('capacity'))
        )
        
        if success:
            return jsonify({'success': True, 'message': f'Room {room_id} updated successfully'})
        else:
            return jsonify({'success': False, 'error': 'Failed to update room'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/timeslots', methods=['PUT'])
def update_timeslot():
    """Update a timeslot"""
    global data_loaded
    try:
        if not data_loaded:
            return jsonify({'success': False, 'error': 'No data loaded'}), 400
        
        data = request.get_json()
        success = data_loader.update_timeslot(
            data.get('old_day'),
            data.get('old_start_time'),
            data.get('new_day'),
            data.get('new_start_time'),
            data.get('new_end_time')
        )
        
        if success:
            return jsonify({'success': True, 'message': 'Timeslot updated successfully'})
        else:
            return jsonify({'success': False, 'error': 'Failed to update timeslot'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/generate', methods=['POST'])
def generate_timetable():
    """Generate a new timetable - AUTO-SCHEDULES ALL COURSES"""
    global current_timetable, data_loaded
    
    # Check if data has been loaded
    if not data_loaded:
        return jsonify({
            'success': False,
            'error': 'No data loaded. Please upload CSV files first.'
        }), 400
    
    try:
        data = request.get_json() if request.get_json() else {}
        timeout = data.get('timeout', 60)  # Reduced to 60 seconds (greedy algorithm is MUCH faster)
        
        # Get ALL courses with qualified instructors (no manual selection!)
        all_courses = data_loader.get_courses()
        schedulable_courses = []
        
        print(f"\n🔍 Analyzing all {len(all_courses)} courses...")
        
        for course in all_courses:
            qualified = [instr for instr in data_loader.get_instructors() 
                        if course.course_id in instr.qualified_courses]
            if qualified:
                schedulable_courses.append((course, len(qualified)))
        
        # Sort by number of qualified instructors (better success rate)
        schedulable_courses.sort(key=lambda x: x[1], reverse=True)
        
        # USE ALL SCHEDULABLE COURSES - NO LIMIT!
        selected_courses = [course for course, count in schedulable_courses]
        
        if not selected_courses:
            return jsonify({'success': False, 'error': 'No courses with qualified instructors found'}), 400
        
        print(f"✅ Found {len(selected_courses)} schedulable courses (out of {len(all_courses)} total)")
        print(f"🚀 Attempting to schedule ALL {len(selected_courses)} courses across ALL available time slots...")
        print(f"⏱️  Timeout: {timeout} seconds")
        
        # Create and run solver with ALL time slots
        solver = EnhancedCSPTimetable(
            courses=selected_courses,
            instructors=data_loader.get_instructors(),
            rooms=data_loader.get_rooms(),
            timeslots=data_loader.get_timeslots()  # Uses ALL time slots
        )
        
        print(f"\n{'='*80}")
        print(f"🚀 STARTING ENHANCED CSP SOLVER")
        print(f"{'='*80}")
        success = solver.solve_enhanced(timeout_seconds=timeout)
        
        # Store current timetable
        current_timetable = solver
        
        # Export results
        result = solver.export_to_dict()
        
        scheduled = result["scheduled_courses"]
        total = result["total_courses"]
        percentage = (scheduled / total * 100) if total > 0 else 0
        
        result['message'] = f'Successfully scheduled {scheduled} out of {total} courses ({percentage:.1f}%)'
        
        print(f"\n{'='*80}")
        print(f"✅ GENERATION COMPLETE")
        print(f"📊 Result: {scheduled}/{total} courses ({percentage:.1f}%)")
        print(f"{'='*80}\n")
        
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Error generating timetable: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/timetable/current', methods=['GET'])
def get_current_timetable():
    """Get the current timetable"""
    global current_timetable
    
    if current_timetable is None:
        return jsonify({'success': False, 'error': 'No timetable generated yet'}), 404
    
    try:
        result = current_timetable.export_to_dict()
        return jsonify(result)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/timetable/export/csv', methods=['GET'])
def export_timetable_csv():
    """Export current timetable as CSV"""
    global current_timetable
    
    if current_timetable is None:
        return jsonify({'success': False, 'error': 'No timetable generated yet'}), 404
    
    try:
        # Create CSV in memory
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['Course ID', 'Course Name', 'Day', 'Start Time', 'End Time', 
                        'Room', 'Instructor', 'Course Type'])
        
        # Write data
        timetable_data = current_timetable.export_to_dict()
        for entry in timetable_data['schedule']:
            writer.writerow([
                entry['course_id'],
                entry['course_name'],
                entry['day'],
                entry['start_time'],
                entry['end_time'],
                entry['room_id'],
                entry['instructor_name'],
                entry['course_type']
            ])
        
        # Create response
        output.seek(0)
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name='timetable.csv'
        )
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/timetable/export/json', methods=['GET'])
def export_timetable_json():
    """Export current timetable as JSON"""
    global current_timetable
    
    if current_timetable is None:
        return jsonify({'success': False, 'error': 'No timetable generated yet'}), 404
    
    try:
        result = current_timetable.export_to_dict()
        
        # Create JSON file in memory
        json_str = json.dumps(result, indent=2)
        
        return send_file(
            io.BytesIO(json_str.encode('utf-8')),
            mimetype='application/json',
            as_attachment=True,
            download_name='timetable.json'
        )
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get statistics about the current timetable"""
    global current_timetable
    
    if current_timetable is None:
        return jsonify({'success': False, 'error': 'No timetable generated yet'}), 404
    
    try:
        stats = current_timetable.get_statistics()
        return jsonify({
            'success': True,
            'statistics': stats
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/courses/add', methods=['POST'])
def add_course():
    """Add a new course"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['course_id', 'name', 'credits', 'type']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Missing field: {field}'}), 400
        
        # Check if course already exists
        existing = [c for c in data_loader.get_courses() if c.course_id == data['course_id']]
        if existing:
            return jsonify({'success': False, 'error': 'Course ID already exists'}), 400
        
        # Add course
        new_course = Course(data['course_id'], data['name'], data['credits'], data['type'])
        data_loader.courses.append(new_course)
        
        # Save to CSV using data_loader method
        data_loader.save_courses_to_csv()
        
        return jsonify({'success': True, 'message': 'Course added successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/reload', methods=['POST'])
def reload_data():
    """Reload all data from CSV files (from uploads folder if available, otherwise from root)"""
    global data_loaded
    try:
        # Try to load from uploads folder first (user uploaded files)
        upload_files = [
            os.path.join(UPLOAD_FOLDER, 'Courses.csv'),
            os.path.join(UPLOAD_FOLDER, 'instructors.csv'),
            os.path.join(UPLOAD_FOLDER, 'Rooms.csv'),
            os.path.join(UPLOAD_FOLDER, 'TimeSlots.csv')
        ]
        
        # Check if uploaded files exist
        if all(os.path.exists(f) for f in upload_files):
            data_loader.load_all_data(
                upload_files[0],
                upload_files[1],
                upload_files[2],
                upload_files[3]
            )
            data_loaded = True
            return jsonify({
                'success': True, 
                'message': 'Data reloaded successfully from uploaded files',
                'counts': {
                    'courses': len(data_loader.get_courses()),
                    'instructors': len(data_loader.get_instructors()),
                    'rooms': len(data_loader.get_rooms()),
                    'timeslots': len(data_loader.get_timeslots())
                }
            })
        
        # Fallback to root folder CSV files
        root_files = ['Courses.csv', 'instructors.csv', 'Rooms.csv', 'TimeSlots.csv']
        if all(os.path.exists(f) for f in root_files):
            data_loader.load_all_data(
                root_files[0],
                root_files[1],
                root_files[2],
                root_files[3]
            )
            data_loaded = True
            return jsonify({
                'success': True, 
                'message': 'Data reloaded successfully from default files',
                'counts': {
                    'courses': len(data_loader.get_courses()),
                    'instructors': len(data_loader.get_instructors()),
                    'rooms': len(data_loader.get_rooms()),
                    'timeslots': len(data_loader.get_timeslots())
                }
            })
        
        # No data files found
        data_loaded = False
        return jsonify({'success': False, 'error': 'No CSV files found. Please upload data first.'}), 404
        
    except Exception as e:
        print(f"Error reloading data: {e}")
        data_loaded = False
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'error': 'Internal server error'}), 500

# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    print("\n" + "="*80)
    print("🎓 CSP TIMETABLEAI - INTELLIGENT SCHEDULING SYSTEM")
    print("   © 2025 Kareem. All Rights Reserved.")
    print("="*80)
    print("\n🚀 Starting Flask server...")
    print("📍 Server will be available at: http://localhost:5000")
    print("="*80 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
