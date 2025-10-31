# 🏗️ System Architecture

## 📐 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    TIMETABLE GENERATION SYSTEM                           │
│                         (3-Tier Architecture)                            │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                             │
│                         (Browser - Client Side)                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌────────────────┐  │
│  │                     │  │                     │  │                │  │
│  │    HTML Templates   │  │    CSS Styling     │  │   JavaScript   │  │
│  │    (index.html)     │  │   (style.css)      │  │    (app.js)    │  │
│  │                     │  │                     │  │                │  │
│  │  - Page Structure   │  │  - Visual Design   │  │  - API Calls   │  │
│  │  - Tab Navigation   │  │  - Responsive      │  │  - User Events │  │
│  │  - Modal Dialogs    │  │  - Color Themes    │  │  - Data Display│  │
│  │  - Tables & Forms   │  │  - Animations      │  │  - PDF Export  │  │
│  │                     │  │                     │  │                │  │
│  └─────────────────────┘  └─────────────────────┘  └────────────────┘  │
│                                                                          │
│          │                         │                         │           │
│          └─────────────────────────┼─────────────────────────┘           │
│                                    │                                     │
│                              HTTP  │  REST API                           │
│                                    │                                     │
└────────────────────────────────────┼─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          APPLICATION LAYER                               │
│                        (Flask - Server Side)                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                        app.py (Main Server)                       │  │
│  │                                                                   │  │
│  │  REST API Endpoints:                                              │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │  GET  /                    → Serve HTML page                │ │  │
│  │  │  GET  /api/data/summary    → Get statistics                 │ │  │
│  │  │  GET  /api/courses         → Get all courses                │ │  │
│  │  │  GET  /api/instructors     → Get all instructors            │ │  │
│  │  │  GET  /api/rooms           → Get all rooms                  │ │  │
│  │  │  GET  /api/timeslots       → Get all timeslots              │ │  │
│  │  │  POST /api/generate        → Generate timetable             │ │  │
│  │  │  POST /api/save-class      → Save manual assignment         │ │  │
│  │  │  DELETE /api/delete-class  → Delete scheduled class         │ │  │
│  │  │  POST /api/reload          → Reload CSV data                │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│          │                                                  │            │
│          ▼                                                  ▼            │
│  ┌─────────────────┐                             ┌──────────────────┐   │
│  │                 │                             │                  │   │
│  │  data_loader.py │                             │ enhanced_csp_    │   │
│  │                 │                             │    model.py      │   │
│  │  - Load CSVs    │                             │                  │   │
│  │  - Parse Data   │                             │  - CSP Algorithm │   │
│  │  - Clear Lists  │                             │  - Constraints   │   │
│  │  - Validation   │                             │  - Optimization  │   │
│  │                 │                             │  - Scheduling    │   │
│  └─────────────────┘                             └──────────────────┘   │
│                                                                          │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                    │
│                        (CSV Files - Database)                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  ┌──────────────┐    │
│  │             │  │              │  │           │  │              │    │
│  │ Courses.csv │  │instructors   │  │ Rooms.csv │  │ TimeSlots    │    │
│  │             │  │    .csv      │  │           │  │    .csv      │    │
│  │             │  │              │  │           │  │              │    │
│  │ 90 courses  │  │ 47 instruct. │  │ 43 rooms  │  │ 20 timeslots │    │
│  │             │  │              │  │           │  │              │    │
│  └─────────────┘  └──────────────┘  └───────────┘  └──────────────┘    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request-Response Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    USER INTERACTION SEQUENCE                            │
└─────────────────────────────────────────────────────────────────────────┘

USER                  BROWSER              FLASK SERVER           CSP SOLVER
 │                       │                        │                    │
 │  1. Open Page         │                        │                    │
 ├──────────────────────▶│                        │                    │
 │                       │  GET /                 │                    │
 │                       ├───────────────────────▶│                    │
 │                       │                        │                    │
 │                       │   index.html           │                    │
 │                       │◀───────────────────────┤                    │
 │                       │                        │                    │
 │                       │  2. Load CSS/JS        │                    │
 │                       ├───────────────────────▶│                    │
 │                       │                        │                    │
 │                       │  3. Get Data           │                    │
 │                       ├───────────────────────▶│                    │
 │                       │                        │                    │
 │                       │   JSON Response        │                    │
 │                       │◀───────────────────────┤                    │
 │                       │                        │                    │
 │  4. Click Generate    │                        │                    │
 ├──────────────────────▶│                        │                    │
 │                       │  POST /api/generate    │                    │
 │                       ├───────────────────────▶│                    │
 │                       │                        │                    │
 │                       │                        │  5. Run Algorithm  │
 │                       │                        ├───────────────────▶│
 │                       │                        │                    │
 │                       │                        │  - Create Vars     │
 │                       │                        │  - Create Domains  │
 │                       │                        │  - Greedy Assign   │
 │                       │                        │  - Validate        │
 │                       │                        │                    │
 │                       │                        │  6. Return Result  │
 │                       │                        │◀───────────────────┤
 │                       │                        │                    │
 │                       │   Timetable JSON       │                    │
 │                       │◀───────────────────────┤                    │
 │                       │                        │                    │
 │  7. View Timetable    │                        │                    │
 │◀──────────────────────┤                        │                    │
 │                       │                        │                    │
```

---

## 🧩 Component Interactions

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT DIAGRAM                               │
└─────────────────────────────────────────────────────────────────────────┘

                          ┌──────────────────┐
                          │                  │
                          │   User Browser   │
                          │                  │
                          └────────┬─────────┘
                                   │
                    HTTP Requests  │  JSON Responses
                                   │
                          ┌────────▼─────────┐
                          │                  │
                          │   Flask Router   │
                          │    (app.py)      │
                          │                  │
                          └──┬───────────┬───┘
                             │           │
              ┌──────────────┘           └──────────────┐
              │                                         │
     ┌────────▼──────────┐                   ┌─────────▼─────────┐
     │                   │                   │                   │
     │   DataLoader      │                   │  EnhancedCSP      │
     │                   │                   │   Timetable       │
     │ ┌───────────────┐ │                   │                   │
     │ │ load_all_data │ │                   │ ┌───────────────┐ │
     │ │               │ │                   │ │create_variables│ │
     │ │ get_courses() │ │                   │ │create_domains │ │
     │ │ get_instruct. │ │                   │ │solve_enhanced │ │
     │ │ get_rooms()   │ │                   │ │validate()     │ │
     │ │ get_timeslots │ │                   │ └───────────────┘ │
     │ └───────────────┘ │                   │                   │
     │                   │                   │   Uses:           │
     │   Reads from:     │                   │   - Greedy Search │
     │   - CSV Files     │                   │   - Constraints   │
     │                   │                   │   - Optimization  │
     └───────────────────┘                   └───────────────────┘
              │                                         │
              │                                         │
     ┌────────▼─────────────────────────────────────────▼────────┐
     │                                                            │
     │                    Data Models                            │
     │                                                            │
     │  ┌─────────┐  ┌────────────┐  ┌──────┐  ┌──────────┐     │
     │  │ Course  │  │ Instructor │  │ Room │  │ Timeslot │     │
     │  └─────────┘  └────────────┘  └──────┘  └──────────┘     │
     │                                                            │
     └────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Data Model Relationships

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ENTITY RELATIONSHIP                            │
└─────────────────────────────────────────────────────────────────────────┘

     ┌─────────────┐
     │   COURSE    │
     ├─────────────┤
     │ course_id   │───┐
     │ name        │   │
     │ credits     │   │
     │ type        │   │
     └─────────────┘   │
           │           │
           │ requires  │
           │           │
           ▼           │
     ┌─────────────┐   │
     │ INSTRUCTOR  │   │
     ├─────────────┤   │
     │instructor_id│   │
     │ name        │   │
     │ role        │   │            ┌────────────┐
     │ unavailable │   │            │ TIMETABLE  │
     │ qualified[] │◀──┘            │  ENTRY     │
     └─────────────┘                ├────────────┤
           │                        │ course_id  │───┐
           │ teaches                │ section_id │   │
           │                        │instructor_id   │
           └───────────────────────▶│ room_id    │   │
                                    │ day        │   │
     ┌─────────────┐                │ start_time │   │
     │    ROOM     │                │ end_time   │   │
     ├─────────────┤                └────────────┘   │
     │ room_id     │───┐                  │          │
     │ type        │   │                  │          │
     │ capacity    │   │ used by          │ assigned │
     └─────────────┘   │                  │ to       │
           │           │                  ▼          │
           │           └─────────────────────────────┤
           │                                         │
           │                      ┌─────────────┐    │
           │                      │  TIMESLOT   │    │
           │                      ├─────────────┤    │
           └─────────────────────▶│ day         │◀───┘
                                  │ start_time  │
                     scheduled in │ end_time    │
                                  └─────────────┘

RELATIONSHIPS:
─────────────
• Course  → Instructor  : Many-to-Many (qualified_courses)
• Course  → Room        : Many-to-Many (type compatibility)
• Course  → Timeslot    : Many-to-Many (scheduling)
• Timetable Entry       : Combines all entities (1-to-1-to-1-to-1)
```

---

## 🎯 Algorithm Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CSP ALGORITHM ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────────┘

INPUT STAGE
───────────
  90 Courses, 47 Instructors, 43 Rooms, 20 Timeslots
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: VARIABLE CREATION                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │  Split       │      │  Create      │                    │
│  │  Lecture+Lab │─────▶│  142 Session │                    │
│  │  Courses     │      │  Variables   │                    │
│  └──────────────┘      └──────────────┘                    │
│                                                             │
│  - Lecture-only: 35 × 1 = 35 sessions                      │
│  - Lecture+Lab:  52 × 2 = 104 sessions                     │
│  - Lab-only:      3 × 1 = 3 sessions                       │
│  ─────────────────────────────────────                     │
│  Total: 142 variables                                      │
│                                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: DOMAIN GENERATION                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  For each variable:                                         │
│                                                             │
│  ┌────────────┐    ┌────────────┐    ┌─────────────┐       │
│  │ Filter     │    │ Filter     │    │ Combine     │       │
│  │ Qualified  │───▶│ Compatible │───▶│ with All    │       │
│  │ Instructors│    │ Rooms      │    │ Timeslots   │       │
│  └────────────┘    └────────────┘    └─────────────┘       │
│                                             │               │
│                                             ▼               │
│                                  ~416 possible assignments  │
│                                                             │
│  Domain = {(instructor, room, timeslot) | constraints OK}  │
│                                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: VARIABLE ORDERING                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Sort by:                                                   │
│  1. Domain size (smallest first) ───▶ Most constrained     │
│  2. Lecture+Lab pairs together   ───▶ Dependency handling  │
│  3. Course dependencies          ───▶ Prerequisite order   │
│                                                             │
│  Result: Ordered list of 142 variables                     │
│                                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 4: GREEDY ASSIGNMENT (Repeat 5 times)                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  For each variable (in order):                              │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Filter Valid │    │ Score Soft   │    │ Select Best  │  │
│  │ by Hard      │───▶│ Constraints  │───▶│ Assignment   │  │
│  │ Constraints  │    │              │    │              │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                             │
│  Hard Constraints (MUST satisfy):                          │
│  ✓ No instructor conflict                                  │
│  ✓ No room conflict                                        │
│  ✓ Room type matches                                       │
│  ✓ Instructor qualified                                    │
│                                                             │
│  Soft Constraints (scoring):                               │
│  +10 Day distribution                                      │
│  +5  Instructor preference                                 │
│  +3  Avoid back-to-back                                    │
│  +2  Room efficiency                                       │
│                                                             │
│  If no valid assignment: Skip variable                     │
│                                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 5: RESULT SELECTION                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Compare 5 attempts:                                        │
│  - Attempt 1: 135 sessions scheduled                        │
│  - Attempt 2: 138 sessions scheduled  ← BEST               │
│  - Attempt 3: 132 sessions scheduled                        │
│  - Attempt 4: 136 sessions scheduled                        │
│  - Attempt 5: 134 sessions scheduled                        │
│                                                             │
│  Return: Best result (138/142 = 97.2%)                     │
│                                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
OUTPUT STAGE
────────────
  Complete Timetable + Unscheduled Courses List
```

---

## 📦 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT OPTIONS                                   │
└─────────────────────────────────────────────────────────────────────────┘

OPTION 1: Development (Current)
────────────────────────────────
┌─────────────────────────────┐
│   Local Machine             │
│                             │
│   ┌─────────────────────┐   │
│   │  Flask Dev Server   │   │
│   │  (port 5000)        │   │
│   │  Debug Mode: ON     │   │
│   └─────────────────────┘   │
│            │                │
│   ┌────────▼────────┐       │
│   │  CSV Files      │       │
│   │  (Local Storage)│       │
│   └─────────────────┘       │
│                             │
└─────────────────────────────┘

Access: http://localhost:5000


OPTION 2: Production (Recommended)
──────────────────────────────────
┌──────────────────────────────────────┐
│   Production Server                  │
│                                      │
│   ┌──────────────────────────┐       │
│   │  Nginx (Reverse Proxy)   │       │
│   │  Port 80/443 (HTTPS)     │       │
│   └──────────┬───────────────┘       │
│              │                       │
│   ┌──────────▼───────────────┐       │
│   │  Gunicorn / uWSGI        │       │
│   │  (WSGI Server)           │       │
│   │  Workers: 4              │       │
│   └──────────┬───────────────┘       │
│              │                       │
│   ┌──────────▼───────────────┐       │
│   │  Flask Application       │       │
│   │  (app.py)                │       │
│   └──────────┬───────────────┘       │
│              │                       │
│   ┌──────────▼───────────────┐       │
│   │  CSV Files or Database   │       │
│   │  (PostgreSQL/MySQL)      │       │
│   └──────────────────────────┘       │
│                                      │
└──────────────────────────────────────┘

Access: https://yourdomain.com
```

---

## 🔒 Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                                     │
└─────────────────────────────────────────────────────────────────────────┘

LAYER 1: Network Security
─────────────────────────
  ┌─────────────────────────────┐
  │  Firewall                   │
  │  - Allow port 5000 only     │
  │  - Rate limiting            │
  │  - IP whitelisting (opt.)   │
  └─────────────────────────────┘

LAYER 2: Application Security
─────────────────────────────
  ┌─────────────────────────────┐
  │  Flask-CORS                 │
  │  - Origin validation        │
  │  - Credential handling      │
  └─────────────────────────────┘
            │
  ┌─────────▼───────────────────┐
  │  Input Validation           │
  │  - Type checking            │
  │  - Sanitization             │
  │  - Length limits            │
  └─────────────────────────────┘

LAYER 3: Data Security
─────────────────────────
  ┌─────────────────────────────┐
  │  File Access Control        │
  │  - Read-only CSV access     │
  │  - No arbitrary file reads  │
  │  - Path validation          │
  └─────────────────────────────┘
            │
  ┌─────────▼───────────────────┐
  │  Error Handling             │
  │  - No stack traces in prod  │
  │  - Generic error messages   │
  │  - Logging to file          │
  └─────────────────────────────┘
```

---

**This architecture ensures scalability, maintainability, and security!** 🔐
