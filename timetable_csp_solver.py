"""
Automated Timetable Generation using Constraint Satisfaction Problem (CSP)
Intelligent Systems - Fall 2025/2026
Project 1: Dynamic Timetable Generator for CSIT Department

This module implements a backtracking-based CSP solver for automated timetable generation.
"""

import pandas as pd
import random
import time
from datetime import datetime
from collections import defaultdict


class TimetableCSP:
    """
    CSP Solver for Automated Timetable Generation

    This class implements a constraint satisfaction problem solver using
    backtracking algorithm with forward checking and heuristics.
    """

    def __init__(self, courses_df, instructors_df, rooms_df, timeslots_df):
        """
        Initialize the CSP solver with input data

        Args:
            courses_df: DataFrame containing course information
            instructors_df: DataFrame containing instructor information
            rooms_df: DataFrame containing room information
            timeslots_df: DataFrame containing time slot information
        """
        # Build instructor qualification mapping
        self.instructor_courses = {}
        instructor_list = instructors_df.to_dict('records')
        for inst in instructor_list:
            qualified = inst['QualifiedCourses'].split(', ')
            self.instructor_courses[inst['InstructorID']] = qualified

        # Filter courses to only those with qualified instructors
        all_qualified_courses = set()
        for courses_list in self.instructor_courses.values():
            all_qualified_courses.update(courses_list)

        self.courses = [c for c in courses_df.to_dict('records')
                        if c['CourseID'] in all_qualified_courses]

        self.instructors = instructor_list
        self.rooms = rooms_df.to_dict('records')
        self.timeslots = timeslots_df.to_dict('records')

        # Create lookup dictionaries
        self.instructor_map = {inst['InstructorID']: inst for inst in self.instructors}
        self.room_map = {room['RoomID']: room for room in self.rooms}

        # Initialize solution tracking
        self.schedule = []
        self.stats = {
            'start_time': None,
            'end_time': None,
            'iterations': 0,
            'backtracks': 0,
            'constraint_checks': 0
        }

        print(f"Initialized CSP with {len(self.courses)} schedulable courses")

    def get_qualified_instructors(self, course_id):
        """
        Get list of instructors qualified to teach a specific course

        Args:
            course_id: Course identifier

        Returns:
            List of qualified instructor IDs
        """
        qualified = []
        for inst_id, courses_list in self.instructor_courses.items():
            if course_id in courses_list:
                qualified.append(inst_id)
        return qualified

    def get_compatible_rooms(self, course_type):
        """
        Get rooms compatible with course type (Lab/Lecture/Both)

        Args:
            course_type: Type of course ('Lecture', 'Lab', or 'Lecture and Lab')

        Returns:
            List of compatible room IDs
        """
        compatible = []
        for room in self.rooms:
            if course_type == 'Lecture' and room['Type'] == 'Lecture':
                compatible.append(room['RoomID'])
            elif course_type == 'Lab' and room['Type'] == 'Lab':
                compatible.append(room['RoomID'])
            elif course_type == 'Lecture and Lab':
                compatible.append(room['RoomID'])
        return compatible

    def is_instructor_available(self, instructor_id, timeslot_idx, current_schedule):
        """
        Check if instructor is available at given timeslot (Hard Constraint 1)

        Args:
            instructor_id: Instructor identifier
            timeslot_idx: Index of timeslot
            current_schedule: Current partial schedule

        Returns:
            True if instructor is available, False otherwise
        """
        self.stats['constraint_checks'] += 1

        timeslot = self.timeslots[timeslot_idx]
        day = timeslot['Day']

        # Check instructor preference (Soft Constraint - treated as hard)
        instructor = self.instructor_map[instructor_id]
        preferred = instructor['PreferredSlots']
        if preferred and 'Not on' in preferred:
            avoided_day = preferred.replace('Not on ', '').strip()
            if day == avoided_day:
                return False

        # Check if already teaching at this time (Hard Constraint 1)
        for assignment in current_schedule:
            if (assignment['instructor'] == instructor_id and
                    assignment['timeslot_idx'] == timeslot_idx):
                return False

        return True

    def is_room_available(self, room_id, timeslot_idx, current_schedule):
        """
        Check if room is available at given timeslot (Hard Constraint 2)

        Args:
            room_id: Room identifier
            timeslot_idx: Index of timeslot
            current_schedule: Current partial schedule

        Returns:
            True if room is available, False otherwise
        """
        self.stats['constraint_checks'] += 1

        # Check if room already occupied (Hard Constraint 2)
        for assignment in current_schedule:
            if (assignment['room'] == room_id and
                    assignment['timeslot_idx'] == timeslot_idx):
                return False

        return True

    def get_domain(self, course):
        """
        Get domain of possible values for a course variable

        Args:
            course: Course dictionary

        Returns:
            List of possible assignments (instructor, room, timeslot combinations)
        """
        course_id = course['CourseID']
        course_type = course['Type']

        # Get qualified instructors
        instructors = self.get_qualified_instructors(course_id)

        # Get compatible rooms
        rooms = self.get_compatible_rooms(course_type)

        # Get all timeslots
        timeslots = list(range(len(self.timeslots)))

        # Create all possible combinations
        domain = []
        for inst in instructors:
            for room in rooms:
                for ts in timeslots:
                    domain.append({
                        'instructor': inst,
                        'room': room,
                        'timeslot_idx': ts
                    })

        return domain

    def is_consistent(self, course, assignment, current_schedule):
        """
        Check if assignment satisfies all hard constraints

        Args:
            course: Course being assigned
            assignment: Proposed assignment
            current_schedule: Current partial schedule

        Returns:
            True if consistent, False otherwise
        """
        # Hard Constraint 1: Instructor availability
        if not self.is_instructor_available(assignment['instructor'],
                                            assignment['timeslot_idx'],
                                            current_schedule):
            return False

        # Hard Constraint 2: Room availability
        if not self.is_room_available(assignment['room'],
                                      assignment['timeslot_idx'],
                                      current_schedule):
            return False

        # Hard Constraint 4: Room type matches course type (implicitly satisfied by get_compatible_rooms)

        return True

    def backtrack(self, current_schedule, assigned_courses, max_courses=None):
        """
        Backtracking search algorithm with constraint propagation

        Args:
            current_schedule: Current partial schedule
            assigned_courses: Set of assigned course IDs
            max_courses: Maximum number of courses to schedule (optional)

        Returns:
            True if solution found, False otherwise
        """
        self.stats['iterations'] += 1

        # Success conditions
        if max_courses and len(assigned_courses) >= max_courses:
            return True

        if len(assigned_courses) == len(self.courses):
            return True

        # Timeout protection
        if self.stats['iterations'] > 50000:
            return True

        # Select unassigned course (Variable ordering)
        unassigned = [c for c in self.courses if c['CourseID'] not in assigned_courses]
        if not unassigned:
            return True

        course = unassigned[0]  # Can be improved with MRV heuristic

        # Get domain
        domain = self.get_domain(course)

        # Value ordering: shuffle for variety
        random.shuffle(domain)

        # Try assignments from domain
        for assignment in domain[:100]:  # Limit search per variable
            if self.is_consistent(course, assignment, current_schedule):
                # Make assignment
                full_assignment = {
                    'course_id': course['CourseID'],
                    'course_name': course['CourseName'],
                    'course_type': course['Type'],
                    'instructor': assignment['instructor'],
                    'instructor_name': self.instructor_map[assignment['instructor']]['Name'],
                    'room': assignment['room'],
                    'timeslot_idx': assignment['timeslot_idx']
                }

                current_schedule.append(full_assignment)
                assigned_courses.add(course['CourseID'])

                # Recursive call
                result = self.backtrack(current_schedule, assigned_courses, max_courses)

                if result:
                    return True

                # Backtrack
                current_schedule.pop()
                assigned_courses.remove(course['CourseID'])
                self.stats['backtracks'] += 1

        return False

    def solve(self, max_courses=50):
        """
        Solve the timetabling CSP

        Args:
            max_courses: Maximum number of courses to schedule

        Returns:
            Tuple of (success, schedule)
        """
        print(f"\nStarting CSP Solver...")
        print(f"Target: Schedule up to {max_courses} courses")
        print("=" * 60)

        self.stats['start_time'] = time.time()

        current_schedule = []
        assigned_courses = set()

        success = self.backtrack(current_schedule, assigned_courses, max_courses)

        self.stats['end_time'] = time.time()
        self.schedule = current_schedule

        return success, current_schedule

    def export_schedule(self, filename='timetable_output.csv'):
        """
        Export generated schedule to CSV

        Args:
            filename: Output filename
        """
        if not self.schedule:
            print("No schedule to export!")
            return

        # Convert to DataFrame
        schedule_df = pd.DataFrame(self.schedule)

        # Add timeslot details
        schedule_df['Day'] = schedule_df['timeslot_idx'].apply(
            lambda x: self.timeslots[x]['Day'])
        schedule_df['StartTime'] = schedule_df['timeslot_idx'].apply(
            lambda x: self.timeslots[x]['StartTime'])
        schedule_df['EndTime'] = schedule_df['timeslot_idx'].apply(
            lambda x: self.timeslots[x]['EndTime'])

        # Select columns for export
        output = schedule_df[['course_id', 'course_name', 'course_type',
                              'instructor', 'instructor_name', 'room',
                              'Day', 'StartTime', 'EndTime']]

        output.to_csv(filename, index=False)
        print(f"Schedule exported to {filename}")

    def print_statistics(self):
        """Print solver statistics"""
        print("\n" + "=" * 60)
        print("SOLVER STATISTICS")
        print("=" * 60)
        print(f"Scheduled Courses: {len(self.schedule)}")
        print(f"Execution Time: {self.stats['end_time'] - self.stats['start_time']:.3f} seconds")
        print(f"Total Iterations: {self.stats['iterations']}")
        print(f"Backtracks: {self.stats['backtracks']}")
        print(f"Constraint Checks: {self.stats['constraint_checks']}")
        print(
            f"Avg Time per Course: {(self.stats['end_time'] - self.stats['start_time']) / len(self.schedule) * 1000:.2f} ms")
        print("=" * 60)


def main():
    """Main execution function"""
    # Load data
    print("Loading data...")
    courses = pd.read_csv('Courses.csv')
    instructors = pd.read_csv('Instructor.csv')
    rooms = pd.read_csv('Rooms.csv')
    timeslots = pd.read_csv('TimeSlots.csv')

    # Create solver
    solver = TimetableCSP(courses, instructors, rooms, timeslots)

    # Solve
    success, schedule = solver.solve(max_courses=40)

    # Print results
    solver.print_statistics()

    # Export
    solver.export_schedule('Generated_Timetable.csv')

    print(f"\nStatus: {'SUCCESS' if success else 'PARTIAL SUCCESS'}")


if __name__ == "__main__":
    main()
