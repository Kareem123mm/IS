# data_loader.py (using built-in csv module - NO PANDAS)
import csv
from enhanced_csp_model import Course, Instructor, Room, Timeslot

class DataLoader:
    def __init__(self):
        self.courses = []
        self.instructors = []
        self.rooms = []
        self.timeslots = []

    def load_all_data(self, courses_path, instructors_path, rooms_path, timeslots_path):
        """Loads all data from the provided CSV file paths using built-in csv module."""
        try:
            # Clear existing data before reloading
            self.courses = []
            self.instructors = []
            self.rooms = []
            self.timeslots = []
            
            # Load Courses
            with open(courses_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    self.courses.append(Course(
                        row['CourseID'], 
                        row['CourseName'], 
                        row['Credits'], 
                        row['Type']
                    ))
            
            # Load Instructors
            with open(instructors_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    self.instructors.append(Instructor(
                        row['InstructorID'],
                        row['Name'],
                        row['Role'],
                        row['PreferredSlots'],
                        row['QualifiedCourses']
                    ))
            
            # Load Rooms
            with open(rooms_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    self.rooms.append(Room(
                        row['RoomID'],
                        row['Type'],
                        int(row['Capacity'])
                    ))
            
            # Load Timeslots
            with open(timeslots_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    self.timeslots.append(Timeslot(
                        row['Day'],
                        row['StartTime'],
                        row['EndTime']
                    ))
            
            print("All data loaded successfully using CSV module!")
            print(f"Loaded {len(self.courses)} courses, {len(self.instructors)} instructors, {len(self.rooms)} rooms, {len(self.timeslots)} timeslots")
            
        except FileNotFoundError as e:
            print(f"Error loading data: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")

    def get_courses(self):
        return self.courses

    def get_instructors(self):
        return self.instructors

    def get_rooms(self):
        return self.rooms

    def get_timeslots(self):
        return self.timeslots

    # ============================================================================
    # CRUD OPERATIONS (Create, Read, Update, Delete)
    # ============================================================================
    
    def save_courses_to_csv(self, filepath='uploads/Courses.csv'):
        """Save courses to CSV file"""
        try:
            with open(filepath, 'w', newline='', encoding='utf-8') as file:
                writer = csv.DictWriter(file, fieldnames=['CourseID', 'CourseName', 'Credits', 'Type'])
                writer.writeheader()
                for course in self.courses:
                    writer.writerow({
                        'CourseID': course.course_id,
                        'CourseName': course.name,  # Fixed: use course.name not course.course_name
                        'Credits': course.credits,
                        'Type': course.type  # Fixed: use course.type not course.course_type
                    })
            return True
        except Exception as e:
            print(f"Error saving courses: {e}")
            return False

    def save_instructors_to_csv(self, filepath='uploads/instructors.csv'):
        """Save instructors to CSV file"""
        try:
            with open(filepath, 'w', newline='', encoding='utf-8') as file:
                writer = csv.DictWriter(file, fieldnames=['InstructorID', 'Name', 'Role', 'PreferredSlots', 'QualifiedCourses'])
                writer.writeheader()
                for instructor in self.instructors:
                    # The Instructor class stores preferred_slots as unavailable_day
                    preferred_slots_value = instructor.unavailable_day if hasattr(instructor, 'unavailable_day') else ''
                    if isinstance(preferred_slots_value, list):
                        preferred_slots_value = ','.join(preferred_slots_value)
                    
                    qualified_courses_value = instructor.qualified_courses
                    if isinstance(qualified_courses_value, list):
                        qualified_courses_value = ','.join(qualified_courses_value)
                    
                    writer.writerow({
                        'InstructorID': instructor.instructor_id,
                        'Name': instructor.name,
                        'Role': instructor.role,
                        'PreferredSlots': preferred_slots_value,
                        'QualifiedCourses': qualified_courses_value
                    })
            return True
        except Exception as e:
            print(f"Error saving instructors: {e}")
            return False

    def save_rooms_to_csv(self, filepath='uploads/Rooms.csv'):
        """Save rooms to CSV file"""
        try:
            with open(filepath, 'w', newline='', encoding='utf-8') as file:
                writer = csv.DictWriter(file, fieldnames=['RoomID', 'Type', 'Capacity'])
                writer.writeheader()
                for room in self.rooms:
                    writer.writerow({
                        'RoomID': room.room_id,
                        'Type': room.type,  # Fixed: use room.type not room.room_type
                        'Capacity': room.capacity
                    })
            return True
        except Exception as e:
            print(f"Error saving rooms: {e}")
            return False

    def save_timeslots_to_csv(self, filepath='uploads/TimeSlots.csv'):
        """Save timeslots to CSV file"""
        try:
            with open(filepath, 'w', newline='', encoding='utf-8') as file:
                writer = csv.DictWriter(file, fieldnames=['Day', 'StartTime', 'EndTime'])
                writer.writeheader()
                for timeslot in self.timeslots:
                    writer.writerow({
                        'Day': timeslot.day,
                        'StartTime': timeslot.start_time,
                        'EndTime': timeslot.end_time
                    })
            return True
        except Exception as e:
            print(f"Error saving timeslots: {e}")
            return False

    def delete_course(self, course_id):
        """Delete a course by ID"""
        self.courses = [c for c in self.courses if c.course_id != course_id]
        return self.save_courses_to_csv()

    def delete_instructor(self, instructor_id):
        """Delete an instructor by ID"""
        self.instructors = [i for i in self.instructors if i.instructor_id != instructor_id]
        return self.save_instructors_to_csv()

    def delete_room(self, room_id):
        """Delete a room by ID"""
        self.rooms = [r for r in self.rooms if r.room_id != room_id]
        return self.save_rooms_to_csv()

    def delete_timeslot(self, day, start_time):
        """Delete a timeslot by day and start time"""
        self.timeslots = [t for t in self.timeslots if not (t.day == day and t.start_time == start_time)]
        return self.save_timeslots_to_csv()

    def update_course(self, course_id, course_name, credits, course_type):
        """Update a course"""
        for course in self.courses:
            if course.course_id == course_id:
                course.name = course_name  # Fixed: use course.name not course.course_name
                course.credits = credits
                course.type = course_type  # Fixed: use course.type not course.course_type
                return self.save_courses_to_csv()
        return False

    def update_instructor(self, instructor_id, name, role, preferred_slots, qualified_courses):
        """Update an instructor"""
        for instructor in self.instructors:
            if instructor.instructor_id == instructor_id:
                instructor.name = name
                instructor.role = role
                # Update unavailable_day (which is stored as preferred_slots in CSV)
                instructor.unavailable_day = preferred_slots if isinstance(preferred_slots, list) else preferred_slots.split(',')
                instructor.qualified_courses = qualified_courses if isinstance(qualified_courses, list) else qualified_courses.split(',')
                return self.save_instructors_to_csv()
        return False

    def update_room(self, room_id, room_type, capacity):
        """Update a room"""
        for room in self.rooms:
            if room.room_id == room_id:
                room.type = room_type  # Fixed: use room.type not room.room_type
                room.capacity = capacity
                return self.save_rooms_to_csv()
        return False

    def update_timeslot(self, old_day, old_start_time, new_day, new_start_time, new_end_time):
        """Update a timeslot"""
        for timeslot in self.timeslots:
            if timeslot.day == old_day and timeslot.start_time == old_start_time:
                timeslot.day = new_day
                timeslot.start_time = new_start_time
                timeslot.end_time = new_end_time
                return self.save_timeslots_to_csv()
        return False

# Test the data loader
if __name__ == "__main__":
    loader = DataLoader()
    loader.load_all_data('Courses.csv', 'instructors.csv', 'Rooms.csv', 'TimeSlots.csv')
    
    # Print a sample of loaded data
    print("\nSample Course:", loader.courses[0] if loader.courses else "No courses")
    print("Sample Instructor:", loader.instructors[0] if loader.instructors else "No instructors")
    print("Sample Room:", loader.rooms[0] if loader.rooms else "No rooms")
    print("Sample Timeslot:", loader.timeslots[0] if loader.timeslots else "No timeslots")
    
    # Show some qualified courses for the first instructor
    if loader.instructors:
        print(f"\nFirst instructor can teach: {loader.instructors[0].qualified_courses}")
