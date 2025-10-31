# 🎓 CSP TimetableAI - Intelligent Scheduling System<<<<<<< HEAD

# 🎓 CSP TimetableAI - Intelligent Scheduling System

<div align="center">

<div align="center">

**An intelligent university timetable scheduling system powered by AI algorithms**

**An intelligent university timetable scheduling system powered by AI algorithms**

[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)

[![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)](https://flask.palletsprojects.com/)[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)

[![Status](https://img.shields.io/badge/Status-Production-success.svg)]()[![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)](https://flask.palletsprojects.com/)

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**© 2025 Kareem. All Rights Reserved.**[![Status](https://img.shields.io/badge/Status-Production-success.svg)]()



</div>**© 2025 Kareem. All Rights Reserved.**



---</div>



## 📋 Table of Contents---



- [Overview](#-overview)## 📋 Table of Contents

- [Key Features](#-key-features)

- [Quick Start](#-quick-start)- [Overview](#-overview)

- [System Requirements](#-system-requirements)- [Key Features](#-key-features)

- [Installation](#-installation)- [Quick Start](#-quick-start)

- [Usage Guide](#-usage-guide)- [System Requirements](#-system-requirements)

- [Project Structure](#-project-structure)- [Installation](#-installation)

- [Documentation](#-documentation)- [Usage Guide](#-usage-guide)

- [Performance](#-performance)- [Project Structure](#-project-structure)

- [Troubleshooting](#-troubleshooting)- [Documentation](#-documentation)

- [Performance](#-performance)

---- [Troubleshooting](#-troubleshooting)



## 🎯 Overview---



**CSP TimetableAI** is a sophisticated web-based application that automatically generates conflict-free university timetables using **Constraint Satisfaction Problem (CSP)** algorithms. It intelligently assigns courses to instructors, rooms, and time slots while respecting all scheduling constraints.## 🎯 Overview



### What Makes It Special?**CSP TimetableAI** is a sophisticated web-based application that automatically generates conflict-free university timetables using **Constraint Satisfaction Problem (CSP)** algorithms. It intelligently assigns courses to instructors, rooms, and time slots while respecting all scheduling constraints.



✅ **Lightning Fast**: Generates complete timetables in **15-25 seconds** (15-30x faster than traditional backtracking)  ### What Makes It Special?

✅ **High Success Rate**: Schedules **92-97%** of all sessions automatically  

✅ **Smart Algorithm**: Uses greedy CSP with constraint optimization  ✅ **Lightning Fast**: Generates complete timetables in **15-25 seconds** (15-30x faster than traditional backtracking)  

✅ **User-Friendly**: Modern, responsive web interface with real-time updates  ✅ **High Success Rate**: Schedules **92-97%** of all sessions automatically  

✅ **Beautiful PDFs**: Professional timetable exports with stunning design  ✅ **Smart Algorithm**: Uses greedy CSP with constraint optimization  

✅ **Flexible**: Easy data management through CSV files  ✅ **User-Friendly**: Modern, responsive web interface with real-time updates  

✅ **Flexible**: Easy data management through CSV files  

---✅ **Professional**: Export timetables as PDF or JSON



## ⭐ Key Features---



### 🤖 Intelligent Scheduling## ⭐ Key Features

- **Automated Timetable Generation**: One-click scheduling of all courses

- **Constraint Satisfaction**: Handles complex scheduling rules automatically### 🤖 Intelligent Scheduling

- **Conflict Resolution**: Prevents double-booking and scheduling conflicts- **Automated Timetable Generation**: One-click scheduling of all courses

- **Room Type Matching**: Assigns lectures to lecture halls, labs to lab rooms- **Constraint Satisfaction**: Handles complex scheduling rules automatically

- **Instructor Qualification**: Ensures instructors teach only qualified courses- **Conflict Resolution**: Prevents double-booking and scheduling conflicts

- **Room Type Matching**: Assigns lectures to lecture halls, labs to lab rooms

### 🎨 Modern User Interface- **Instructor Qualification**: Ensures instructors teach only qualified courses

- **Clean Dashboard**: Intuitive tab-based navigation

- **Interactive Timetable**: View by day with color-coded sessions### 🎨 Modern User Interface

- **Search & Filter**: Quick course, instructor, or room lookup- **Clean Dashboard**: Intuitive tab-based navigation

- **Real-time Updates**: Instant feedback on all actions- **Interactive Timetable**: View by day with color-coded sessions

- **Responsive Design**: Works on desktop, tablet, and mobile- **Search & Filter**: Quick course, instructor, or room lookup

- **Real-time Updates**: Instant feedback on all actions

### 📊 Data Management- **Responsive Design**: Works on desktop, tablet, and mobile

- **CSV-Based**: Easy data import/export

- **Live Reload**: Update data without restarting server### 📊 Data Management

- **File Upload**: Upload new CSV files directly from UI- **CSV-Based**: Easy data import/export

- **Data Validation**: Built-in integrity checks- **Live Reload**: Update data without restarting server

- **Multiple Views**: Browse courses, instructors, rooms, timeslots- **Data Validation**: Built-in integrity checks

- **Multiple Views**: Browse courses, instructors, rooms, timeslots

### ✏️ Manual Controls

- **Edit Classes**: Modify any scheduled class### ✏️ Manual Controls

- **Delete Classes**: Remove unwanted assignments- **Edit Classes**: Modify any scheduled class

- **Add Classes**: Manually schedule unscheduled courses- **Delete Classes**: Remove unwanted assignments

- **Validation**: Prevents invalid manual assignments- **Add Classes**: Manually schedule unassigned courses

- **Validation**: Prevents invalid manual assignments

### 📄 Professional PDF Export

- **Beautiful Timetables**: Gradient cover page with 3D text effects### 📄 Export Options

- **Weekly Grid**: Color-coded schedule grid with auto-pagination- **PDF Generation**: Professional timetable documents

- **Detailed Schedules**: Separate pages for each day- **JSON Export**: Integration with other systems

- **Statistics**: Success rate, class counts, and metrics- **Print-Friendly**: Optimized printing layouts

- **Copyright Footer**: Professional branding on all pages

- **Analytics Report**: Comprehensive report with charts and analysis---



---## 🚀 Quick Start



## 🚀 Quick Start### Option 1: One-Click Setup (Recommended)



### Option 1: One-Click Setup (Recommended)**Windows Command Prompt:**

```batch

**Windows Command Prompt:**SETUP.bat

```batch```

SETUP.bat

```**Windows PowerShell:**

```powershell

**Windows PowerShell:**.\SETUP.ps1

```powershell```

.\SETUP.ps1

```This will:

1. Check Python installation

This will:2. Install all dependencies

1. Check Python installation3. Start the server automatically

2. Install all dependencies

3. Start the server automatically### Option 2: Manual Setup



### Option 2: Manual Setup```bash

# 1. Install dependencies

```bashpip install Flask==3.0.0 Flask-CORS==4.0.0

# 1. Install dependencies

pip install Flask==3.0.0 Flask-CORS==4.0.0# 2. Start the server

python app.py

# 2. Start the server

python app.py# 3. Open browser

# Navigate to: http://localhost:5000

# 3. Open browser```

# Navigate to: http://localhost:5000

```### Option 3: Start Server Only



### Option 3: Start Server OnlyIf dependencies are already installed:



If dependencies are already installed:**Windows:**

```batch

**Windows:**START_SERVER.bat

```batch```

START_SERVER.bat

```**PowerShell:**

```powershell

**PowerShell:**.\START_SERVER.ps1

```powershell```

.\START_SERVER.ps1

```---



---## 💻 System Requirements



## 💻 System Requirements### Minimum Requirements

| Component | Requirement |

### Minimum Requirements|-----------|------------|

| Component | Requirement || **Operating System** | Windows 10/11, Linux, macOS |

|-----------|------------|| **Python** | 3.8 or higher |

| **Operating System** | Windows 10/11, Linux, macOS || **RAM** | 512 MB |

| **Python** | 3.8 or higher || **Storage** | 50 MB |

| **RAM** | 512 MB || **Browser** | Chrome, Firefox, Edge (latest versions) |

| **Storage** | 50 MB |

| **Browser** | Chrome, Firefox, Edge (latest versions) |### Recommended

| Component | Recommendation |

### Recommended|-----------|---------------|

| Component | Recommendation || **Python** | 3.11+ |

|-----------|---------------|| **RAM** | 1 GB |

| **Python** | 3.11+ || **Browser** | Chrome 100+ for best performance |

| **RAM** | 1 GB |

| **Browser** | Chrome 100+ for best performance |---



---## 📦 Installation



## 📦 Installation### Step 1: Download/Clone Project

```bash

### Step 1: Download/Clone Project# Clone repository (if using Git)

```bashgit clone https://github.com/yourusername/timetable-system.git

# Clone repository (if using Git)cd timetable-system

git clone https://github.com/Kareem123mm/IS.git

cd IS# Or extract ZIP file to a folder

```

# Or extract ZIP file to a folder

```### Step 2: Verify Python Installation

```bash

### Step 2: Verify Python Installationpython --version

```bash# Should show Python 3.8 or higher

python --version```

# Should show Python 3.8 or higher

```If Python is not installed:

- **Windows**: Download from [python.org](https://www.python.org/downloads/)

If Python is not installed:- **Linux**: `sudo apt install python3 python3-pip`

- **Windows**: Download from [python.org](https://www.python.org/downloads/)- **macOS**: `brew install python3`

- **Linux**: `sudo apt install python3 python3-pip`

- **macOS**: `brew install python3`### Step 3: Install Dependencies

```bash

### Step 3: Install Dependenciespip install -r requirements.txt

```bash```

pip install Flask==3.0.0 Flask-CORS==4.0.0

```Or manually:

```bash

### Step 4: Verify Data Filespip install Flask==3.0.0 Flask-CORS==4.0.0

Ensure these CSV files exist:```

- ✅ `Courses.csv`

- ✅ `instructors.csv`### Step 4: Verify Data Files

- ✅ `Rooms.csv`Ensure these CSV files exist:

- ✅ `TimeSlots.csv`- ✅ `Courses.csv`

- ✅ `instructors.csv`

### Step 5: Start the Server- ✅ `Rooms.csv`

```bash- ✅ `TimeSlots.csv`

python app.py

```### Step 5: Start the Server

```bash

You should see:python app.py

``````

✅ Data loaded successfully!

📊 Loaded: 90 courses, 47 instructors, 43 rooms, 20 timeslotsYou should see:

```

🎓 AUTOMATED TIMETABLE GENERATION SYSTEM✅ Data loaded successfully!

════════════════════════════════════════🎓 AUTOMATED TIMETABLE GENERATION SYSTEM

🚀 Starting Flask server...

🚀 Starting Flask server...📍 Server will be available at: http://localhost:5000

📍 Server will be available at: http://localhost:5000```

⚡ Server running in DEBUG mode

```### Step 6: Open Browser

Navigate to: **http://localhost:5000**

### Step 6: Open Browser

Navigate to: **http://localhost:5000**---



---## 📖 Usage Guide



## 📖 Usage Guide### 1. Generate Timetable



### 1. Generate Timetable1. Click the **"Dashboard"** tab

2. Click **"Auto Schedule All Courses"** button

1. Click the **"Dashboard"** tab3. Wait 15-25 seconds for generation

2. Click **"Auto Schedule All Courses"** button4. View results in **"Timetable View"** tab

3. Wait 15-25 seconds for generation

4. View results in **"Timetable View"** tab### 2. View Timetable



### 2. View Timetable1. Click **"Timetable View"** tab

2. Select day tab (Sunday-Thursday)

1. Click **"Timetable View"** tab3. Browse scheduled classes

2. Select day tab (Sunday-Thursday)4. Each card shows:

3. Browse scheduled classes   - Course ID & Name

4. Each card shows:   - Section Type (Lecture/Lab)

   - Course ID & Name   - Instructor

   - Section Type (Lecture/Lab)   - Room

   - Instructor   - Time

   - Room

   - Time### 3. Search & Filter



### 3. Search & Filter1. Use **Search Box** to find courses

2. Select **Day Filter** for specific days

1. Use **Search Box** to find courses3. Choose **Type Filter** (Lecture/Lab/All)

2. Select **Day Filter** for specific days4. Results update instantly

3. Choose **Type Filter** (Lecture/Lab/All)

4. Results update instantly### 4. Edit a Class



### 4. Edit a Class1. Click **✏️ Edit** icon on any class card

2. Modal opens with editable fields

1. Click **✏️ Edit** icon on any class card3. Modify instructor, room, or time

2. Modal opens with editable fields4. Click **"Save Changes"**

3. Modify instructor, room, or time5. System validates before saving

4. Click **"Save Changes"**

5. System validates before saving### 5. Delete a Class



### 5. Delete a Class1. Click **🗑️ Delete** icon on any class card

2. Confirm deletion

1. Click **🗑️ Delete** icon on any class card3. Class removed from timetable

2. Confirm deletion

3. Class removed from timetable### 6. Export Timetable



### 6. Export PDF**PDF Export:**

1. Click **"Download PDF"** button

**Timetable PDF:**2. Professional PDF generates

1. Click **"Download PDF"** button3. Save to computer

2. Beautiful PDF generates (3-5 seconds)

3. Includes:**JSON Export:**

   - Gradient cover page1. Click **"Download JSON"** button

   - Statistics box2. JSON file downloads

   - Weekly schedule grid3. Use for integration with other systems

   - Detailed day schedules

   - Copyright footer### 7. Manage Data



**Analytics Report:**1. Click **"Data Management"** tab

1. Click **"Download Detailed Report"**2. View courses, instructors, rooms, timeslots

2. Comprehensive report generates (5-8 seconds)3. Click **"Reload Data"** to refresh from CSV

3. Includes:4. Browse using tab navigation

   - Executive summary

   - Statistics and charts### 8. View Statistics

   - Instructor workload analysis

   - Room utilization1. Click **"Statistics"** tab

   - Unscheduled courses2. See:

   - Total scheduled sessions

### 7. Manage Data   - Completion percentage

   - Unscheduled courses

1. Click **"Data Management"** tab   - Generation time

2. View courses, instructors, rooms, timeslots

3. Click **"Reload Data"** to refresh from CSV---

4. Use search/filter in tables

## 📁 Project Structure

### 8. Upload Data

```

1. Go to **Data Management** tabAutomated Timetable Generation/

2. Select file type (Courses/Instructors/Rooms/Timeslots)│

3. Choose CSV file├── 📄 Core Application

4. Click **"Upload"**│   ├── app.py                    # Flask server (main entry point)

5. System validates and loads data│   ├── enhanced_csp_model.py     # CSP scheduling algorithm

│   ├── data_loader.py            # CSV data loading

---│   └── requirements.txt          # Python dependencies

│

## 📁 Project Structure├── 📊 Data Files

│   ├── Courses.csv               # 90 courses

```│   ├── instructors.csv           # 47 instructors

CSP TimetableAI/│   ├── Rooms.csv                 # 43 rooms (32 halls + 11 labs)

││   └── TimeSlots.csv             # 20 timeslots (5 days × 4 slots)

├── 📄 Core Application│

│   ├── app.py                    # Flask server (724 lines)├── 🌐 Frontend

│   ├── enhanced_csp_model.py     # CSP scheduling algorithm│   ├── templates/

│   ├── data_loader.py            # CSV data loading│   │   └── index.html            # Main UI

│   └── requirements.txt          # Python dependencies│   └── static/

││       ├── css/style.css         # Styling

├── 📊 Data Files│       └── js/app.js             # JavaScript logic

│   ├── Courses.csv               # 90 courses│

│   ├── instructors.csv           # 47 instructors├── 🚀 Quick Start

│   ├── Rooms.csv                 # 43 rooms (32 halls + 11 labs)│   ├── SETUP.bat                 # Windows setup script

│   └── TimeSlots.csv             # 20 timeslots (5 days × 4 slots)│   ├── SETUP.ps1                 # PowerShell setup script

││   ├── START_SERVER.bat          # Windows server launcher

├── 🌐 Frontend│   └── START_SERVER.ps1          # PowerShell server launcher

│   ├── templates/│

│   │   └── index.html            # Main UI (1040 lines)└── 📖 Documentation

│   └── static/    ├── README.md                 # This file

│       ├── css/style.css         # Styling (950+ lines)    ├── WORKFLOW.md               # System workflow & diagrams

│       └── js/app.js             # JavaScript logic (3150+ lines)    ├── PROJECT_DOCUMENTATION.md  # Complete technical documentation

│    ├── ARCHITECTURE.md           # System architecture diagrams

├── 🚀 Quick Start    └── COMPLETE_FIXES_SUMMARY.md # All improvements & fixes

│   ├── SETUP.bat                 # Windows setup script```

│   ├── SETUP.ps1                 # PowerShell setup script

│   ├── START_SERVER.bat          # Windows server launcher---

│   └── START_SERVER.ps1          # PowerShell server launcher

│## 📚 Documentation

└── 📖 Documentation

    ├── README.md                 # This file### 📖 Available Documentation

    ├── WORKFLOW.md               # System workflow & diagrams

    ├── PROJECT_DOCUMENTATION.md  # Technical documentation| Document | Description |

    ├── ARCHITECTURE.md           # System architecture|----------|-------------|

    ├── QUICK_REFERENCE.md        # Quick reference guide| **README.md** | Main documentation (you are here) |

    └── COMPLETE_PROJECT_DOCUMENTATION.md  # Complete guide| **[WORKFLOW.md](WORKFLOW.md)** | Complete system workflow with diagrams |

```| **[PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)** | Technical documentation of all components |

| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System architecture and design |

---| **[COMPLETE_FIXES_SUMMARY.md](COMPLETE_FIXES_SUMMARY.md)** | All fixes and improvements applied |



## 📚 Documentation### 🔍 Quick Links



### 📖 Available Documentation- **How It Works**: See [WORKFLOW.md](WORKFLOW.md)

- **API Reference**: See [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md#api-reference)

| Document | Description |- **Algorithm Details**: See [WORKFLOW.md](WORKFLOW.md#csp-algorithm-workflow)

|----------|-------------|- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)

| **README.md** | Main documentation (you are here) |

| **[WORKFLOW.md](WORKFLOW.md)** | Complete system workflow with diagrams |---

| **[PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)** | Technical documentation of all components |

| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System architecture and design |## ⚡ Performance

| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | Quick reference guide |

| **[COMPLETE_PROJECT_DOCUMENTATION.md](COMPLETE_PROJECT_DOCUMENTATION.md)** | Comprehensive guide covering everything |### Speed Benchmarks



### 🔍 Quick Links| Metric | Value |

|--------|-------|

- **How It Works**: See [WORKFLOW.md](WORKFLOW.md)| **Data Loading** | ~0.5 seconds |

- **API Reference**: See [COMPLETE_PROJECT_DOCUMENTATION.md](COMPLETE_PROJECT_DOCUMENTATION.md#api-reference)| **Variable Creation** | ~0.1 seconds |

- **Algorithm Details**: See [WORKFLOW.md](WORKFLOW.md#csp-algorithm-workflow)| **Domain Generation** | ~1 second |

- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)| **Greedy Assignment** | ~15-20 seconds |

- **Troubleshooting**: See [COMPLETE_PROJECT_DOCUMENTATION.md](COMPLETE_PROJECT_DOCUMENTATION.md#troubleshooting)| **Total Generation Time** | **15-25 seconds** |



---### Success Metrics



## ⚡ Performance| Metric | Value |

|--------|-------|

### Speed Benchmarks| **Scheduling Success Rate** | 92-97% |

| **Typical Sessions Scheduled** | 130-138 / 142 sessions |

| Metric | Value || **Algorithm Efficiency** | 15-30x faster than backtracking |

|--------|-------|| **Memory Usage** | ~6.1 MB |

| **Data Loading** | ~0.5 seconds |

| **Variable Creation** | ~0.1 seconds |### Scalability

| **Domain Generation** | ~1 second |

| **Greedy Assignment** | ~15-20 seconds |- ✅ Handles **142 sessions** efficiently

| **Total Generation Time** | **15-25 seconds** |- ✅ Supports **47 instructors** 

| **PDF Generation** | 3-5 seconds |- ✅ Manages **43 rooms**

| **Analytics Report** | 5-8 seconds |- ✅ Covers **20 timeslots**

- ✅ Can scale to **200+ courses** with optimization

### Success Metrics

---

| Metric | Value |

|--------|-------|## 🐛 Troubleshooting

| **Scheduling Success Rate** | 92-97% |

| **Typical Sessions Scheduled** | 130-138 / 142 sessions |### Problem: Server won't start

| **Algorithm Efficiency** | 15-30x faster than backtracking |

| **Memory Usage** | ~6-8 MB |**Error**: `ModuleNotFoundError: No module named 'flask'`



### Scalability**Solution**:

```bash

- ✅ Handles **142 sessions** efficientlypip install Flask==3.0.0 Flask-CORS==4.0.0

- ✅ Supports **47 instructors** ```

- ✅ Manages **43 rooms**

- ✅ Covers **20 timeslots**---

- ✅ Can scale to **200+ courses** with optimization

### Problem: Port 5000 already in use

---

**Error**: `OSError: [Errno 48] Address already in use`

## 🐛 Troubleshooting

**Solution 1** - Kill existing Python process:

### Problem: Server won't start```bash

# Windows

**Error**: `ModuleNotFoundError: No module named 'flask'`taskkill /F /IM python.exe



**Solution**:# Linux/Mac

```bashpkill python

pip install Flask==3.0.0 Flask-CORS==4.0.0```

```

**Solution 2** - Change port in `app.py`:

---```python

if __name__ == '__main__':

### Problem: Port 5000 already in use    app.run(host='0.0.0.0', port=5001, debug=True)  # Changed to 5001

```

**Error**: `OSError: [Errno 48] Address already in use`

---

**Solution 1** - Kill existing Python process:

```bash### Problem: CSV files not found

# Windows

taskkill /F /IM python.exe**Error**: `FileNotFoundError: [Errno 2] No such file or directory: 'Courses.csv'`



# Linux/Mac**Solution**:

pkill python1. Ensure you're in the correct directory

```2. Check that all CSV files exist:

   - `Courses.csv`

**Solution 2** - Change port in `app.py`:   - `instructors.csv`

```python   - `Rooms.csv`

if __name__ == '__main__':   - `TimeSlots.csv`

    app.run(host='0.0.0.0', port=5001, debug=True)  # Changed to 5001

```---



---### Problem: Timetable generation hangs



### Problem: CSV files not found**Symptom**: "Generating..." message doesn't finish



**Error**: `FileNotFoundError: [Errno 2] No such file or directory: 'Courses.csv'`**Solution**:

1. Hard refresh browser: `Ctrl + Shift + R`

**Solution**:2. Check browser console for errors (F12)

1. Ensure you're in the correct directory3. Restart server

2. Check that all CSV files exist:4. Clear browser cache

   - `Courses.csv`

   - `instructors.csv`---

   - `Rooms.csv`

   - `TimeSlots.csv`### Problem: Edit button shows "Class not found"



---**Solution**:

1. Hard refresh browser: `Ctrl + Shift + R`

### Problem: PDF generation fails2. This ensures latest JavaScript is loaded



**Solution**:---

1. Hard refresh browser: `Ctrl + Shift + R`

2. Check browser console for errors (F12)### Problem: Data shows doubled (180 courses instead of 90)

3. Clear browser cache

4. Try different browser (Chrome recommended)**Solution**:

1. This is fixed in the latest version

---2. Click **"Reload Data"** button

3. Counts should remain consistent

### Problem: Success rate shows 0%

---

**Solution**:

This was fixed in version 5.0. The success rate now calculates properly from scheduled/total courses. Generate a new timetable and it should show 90-97%.<div align="center">



---### ⭐ If you find this project useful, please star it!



### Problem: Table cuts off in PDF**Made with ❤️ for efficient university scheduling**



**Solution**:---

Fixed in version 5.0 with AutoTable pagination settings. Tables now automatically flow to new pages without splitting rows.

**Quick Links**: [Documentation](#-documentation) | [Quick Start](#-quick-start) | [Features](#-key-features) | [Troubleshooting](#-troubleshooting)

---

---

### Problem: Shows "Lecture and Lab" instead of just one type

## 📜 Copyright & License

**Solution**:

Fixed in version 5.0. PDFs now show either "Lab" or "Lecture" (not both).**CSP TimetableAI** - Intelligent Scheduling System  

**© 2025 Kareem. All Rights Reserved.**

---

This software is protected by copyright law. Unauthorized copying, distribution, or modification of this software, via any medium, is strictly prohibited without prior written permission from the copyright holder.

<div align="center">

**Developed by**: Kareem  

### ⭐ If you find this project useful, please star it!**Project**: CSP TimetableAI  

**Year**: 2025  

**Made with ❤️ for efficient university scheduling****License**: Proprietary - All Rights Reserved



------



**Quick Links**: [Documentation](#-documentation) | [Quick Start](#-quick-start) | [Features](#-key-features) | [Troubleshooting](#-troubleshooting)</div>

=======

---# IS

>>>>>>> 5d681e0619e5d2f1f8584b4d77e2a0c78e804b6e

## 📜 Copyright & License

**CSP TimetableAI** - Intelligent Scheduling System  
**© 2025 Kareem. All Rights Reserved.**

This software is protected by copyright law. Unauthorized copying, distribution, or modification of this software, via any medium, is strictly prohibited without prior written permission from the copyright holder.

**Developed by**: Kareem  
**Project**: CSP TimetableAI  
**Year**: 2025  
**License**: Proprietary - All Rights Reserved

---

**Repository**: [Kareem123mm/IS](https://github.com/Kareem123mm/IS)  
**Version**: 5.0  
**Status**: Production Ready

</div>
