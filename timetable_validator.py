"""
Timetable Validation and Analysis Module
Validates generated timetables against all constraints and generates reports
"""

import pandas as pd
from collections import defaultdict


class TimetableValidator:
    """Validates timetable against hard and soft constraints"""

    def __init__(self, schedule_df, courses_df, instructors_df, rooms_df, timeslots_df):
        self.schedule = schedule_df
        self.courses = courses_df
        self.instructors = instructors_df
        self.rooms = rooms_df
        self.timeslots = timeslots_df

        self.violations = {
            'hard': [],
            'soft': []
        }

    def validate_hard_constraint_1(self):
        """No professor can teach more than one class at the same time"""
        violations = []
        instructor_schedule = {}

        for idx, row in self.schedule.iterrows():
            key = (row['instructor'], row['timeslot_idx'])
            if key in instructor_schedule:
                violations.append({
                    'type': 'Instructor Conflict',
                    'instructor': row['instructor'],
                    'timeslot': row['timeslot_idx'],
                    'courses': [instructor_schedule[key], row['course_id']]
                })
            else:
                instructor_schedule[key] = row['course_id']

        return len(violations) == 0, violations

    def validate_hard_constraint_2(self):
        """No room can host more than one class at the same time"""
        violations = []
        room_schedule = {}

        for idx, row in self.schedule.iterrows():
            key = (row['room'], row['timeslot_idx'])
            if key in room_schedule:
                violations.append({
                    'type': 'Room Conflict',
                    'room': row['room'],
                    'timeslot': row['timeslot_idx'],
                    'courses': [room_schedule[key], row['course_id']]
                })
            else:
                room_schedule[key] = row['course_id']

        return len(violations) == 0, violations

    def validate_hard_constraint_3(self):
        """Room type must match course type"""
        violations = []

        for idx, row in self.schedule.iterrows():
            room_info = self.rooms[self.rooms['RoomID'] == row['room']].iloc[0]

            if row['course_type'] == 'Lecture' and room_info['Type'] != 'Lecture':
                violations.append({
                    'type': 'Room Type Mismatch',
                    'course': row['course_id'],
                    'expected': 'Lecture',
                    'got': room_info['Type']
                })
            elif row['course_type'] == 'Lab' and room_info['Type'] != 'Lab':
                violations.append({
                    'type': 'Room Type Mismatch',
                    'course': row['course_id'],
                    'expected': 'Lab',
                    'got': room_info['Type']
                })

        return len(violations) == 0, violations

    def validate_instructor_preferences(self):
        """Check instructor day preferences (soft constraint)"""
        violations = []

        for idx, row in self.schedule.iterrows():
            inst_info = self.instructors[self.instructors['InstructorID'] == row['instructor']].iloc[0]
            pref = inst_info['PreferredSlots']

            if pref and 'Not on' in pref:
                avoided_day = pref.replace('Not on ', '').strip()
                if row['Day'] == avoided_day:
                    violations.append({
                        'type': 'Preference Violation',
                        'instructor': row['instructor'],
                        'course': row['course_id'],
                        'day': row['Day']
                    })

        return len(violations) == 0, violations

    def generate_report(self):
        """Generate comprehensive validation report"""
        print("\n" + "="*70)
        print("TIMETABLE VALIDATION REPORT")
        print("="*70)

        # Hard Constraint 1
        passed, violations = self.validate_hard_constraint_1()
        print(f"\n✓ Hard Constraint 1 (No instructor conflicts): {'PASSED' if passed else 'FAILED'}")
        print(f"  Violations: {len(violations)}")
        if violations:
            for v in violations[:3]:
                print(f"    - {v}")

        # Hard Constraint 2
        passed, violations = self.validate_hard_constraint_2()
        print(f"\n✓ Hard Constraint 2 (No room conflicts): {'PASSED' if passed else 'FAILED'}")
        print(f"  Violations: {len(violations)}")
        if violations:
            for v in violations[:3]:
                print(f"    - {v}")

        # Hard Constraint 3
        passed, violations = self.validate_hard_constraint_3()
        print(f"\n✓ Hard Constraint 3 (Room type match): {'PASSED' if passed else 'FAILED'}")
        print(f"  Violations: {len(violations)}")

        # Soft Constraints
        passed, violations = self.validate_instructor_preferences()
        print(f"\n✓ Instructor Preferences: {len(self.schedule) - len(violations)}/{len(self.schedule)} satisfied")

        print("\n" + "="*70)

    def analyze_utilization(self):
        """Analyze resource utilization"""
        print("\n" + "="*70)
        print("RESOURCE UTILIZATION ANALYSIS")
        print("="*70)

        # Instructor workload
        inst_workload = self.schedule['instructor'].value_counts()
        print(f"\n📊 Instructor Utilization:")
        print(f"  Total instructors: {len(self.instructors)}")
        print(f"  Active instructors: {len(inst_workload)}")
        print(f"  Utilization rate: {len(inst_workload)/len(self.instructors)*100:.1f}%")
        print(f"  Avg courses per active instructor: {inst_workload.mean():.2f}")
        print(f"  Max workload: {inst_workload.max()} courses")
        print(f"  Min workload: {inst_workload.min()} course(s)")

        # Room utilization
        room_usage = self.schedule['room'].value_counts()
        print(f"\n📊 Room Utilization:")
        print(f"  Total rooms: {len(self.rooms)}")
        print(f"  Rooms used: {len(room_usage)}")
        print(f"  Utilization rate: {len(room_usage)/len(self.rooms)*100:.1f}%")
        print(f"  Avg sessions per room: {room_usage.mean():.2f}")

        # Time distribution
        time_dist = self.schedule['Day'].value_counts().sort_index()
        print(f"\n📊 Time Distribution:")
        for day, count in time_dist.items():
            print(f"  {day}: {count} courses ({count/len(self.schedule)*100:.1f}%)")

        print("\n" + "="*70)


def main():
    """Main validation function"""
    # Load data
    schedule = pd.read_csv('Generated_Timetable_Complete.csv')
    courses = pd.read_csv('Courses.csv')
    instructors = pd.read_csv('Instructor.csv')
    rooms = pd.read_csv('Rooms.csv')
    timeslots = pd.read_csv('TimeSlots.csv')

    # Create validator
    validator = TimetableValidator(schedule, courses, instructors, rooms, timeslots)

    # Run validation
    validator.generate_report()
    validator.analyze_utilization()


if __name__ == "__main__":
    main()
