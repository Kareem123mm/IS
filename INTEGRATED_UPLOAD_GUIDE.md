# 📤 Integrated File Upload System - Complete Guide

**© 2025 Kareem. All Rights Reserved.**

---

## 🎯 Overview

The CSP TimetableAI system now features a fully integrated file upload system that allows you to manage your course scheduling data through an intuitive interface. Upload CSV files, monitor data status, and manage everything from the Data Management tab.

---

## ✨ Key Features

### 1. **Professional Upload Modal**
- Beautiful modal interface for file uploads
- Drag-and-drop style file selection
- Real-time file name display
- Progress tracking with visual feedback
- Automatic UI updates after upload

### 2. **Data Management Hub**
- Centralized data status card showing:
  - Data load status (loaded/not loaded)
  - Live counts for all data types
  - Visual statistics dashboard
- Quick access buttons:
  - **Upload New Data** - Opens upload modal
  - **Reload Data** - Refreshes from current files

### 3. **Smart UI Integration**
- Dashboard shows data summary cards
- Generation form only works when data is loaded
- Data tables update automatically after upload
- Status indicators throughout the interface

### 4. **Backend Integration**
- Files saved to `uploads/` directory
- Data validation before processing
- Error handling with clear messages
- Seamless integration with existing features

---

## 🚀 How to Use

### Step 1: Access Data Management
1. Open the application at `http://localhost:5000`
2. Click the **"Data"** tab in the navigation
3. You'll see the Data Status Card at the top

### Step 2: Upload CSV Files
1. Click the **"Upload New Data"** button
2. Upload Modal opens with 4 file input sections:
   - 📚 **Courses CSV**
   - 👨‍🏫 **Instructors CSV**
   - 🚪 **Rooms CSV**
   - ⏰ **Time Slots CSV**
3. Click each "Choose File" button or drag files
4. File names appear when selected
5. Click **"Upload Files"** button

### Step 3: Monitor Upload Progress
- Progress bar shows upload status
- Text updates:
  - "Uploading files..." (30%)
  - "Processing data..." (70%)
  - "✅ Success! Loaded X courses..." (100%)
- Modal auto-closes after 2 seconds on success

### Step 4: Verify Data
- Data Status Card updates automatically
- Shows new counts for all data types
- Status changes to "✅ Data loaded and ready"
- Data tables refresh with new information

### Step 5: Generate Timetable
1. Return to **Dashboard** tab
2. Data summary cards show updated counts
3. Click **"Generate Full Timetable"**
4. System uses your uploaded data

---

## 📊 Data Management Tab Features

### Data Status Card
```
┌─────────────────────────────────────┐
│ 🗄️ Data Status                      │
│ ✅ Data loaded and ready             │
│                                      │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│ │📚90│ │👨‍🏫47│ │🚪43│ │⏰20│        │
│ └────┘ └────┘ └────┘ └────┘        │
│ Courses Instructors Rooms Timeslots │
└─────────────────────────────────────┘
```

### Action Buttons
- **Upload New Data**: Opens modal for file upload
- **Reload Data**: Refreshes from current CSV files

### Data Tables
- Tabs for each data type (Courses, Instructors, Rooms, Time Slots)
- Auto-updates after upload
- Searchable and sortable
- Professional styling

---

## 📁 CSV File Format Requirements

### 1. Courses.csv
```csv
CourseID,CourseName,Credits,Type
AID427,Artificial Intelligence,3,Lecture and Lab
CSC111,Programming 1,3,Lecture and Lab
MAT101,Calculus I,4,Lecture
```

**Required Columns:**
- `CourseID` - Unique course identifier
- `CourseName` - Full course name
- `Credits` - Number of credit hours
- `Type` - "Lecture", "Lab", or "Lecture and Lab"

---

### 2. instructors.csv
```csv
InstructorID,Name,Role,PreferredSlots,QualifiedCourses
I001,Dr. Ahmed Ali,Professor,Morning,"AID427,CSC111,MAT101"
I002,Prof. Sara Khan,Assistant Professor,Afternoon,"CSC222,CSC333"
```

**Required Columns:**
- `InstructorID` - Unique instructor identifier
- `Name` - Full instructor name
- `Role` - Academic rank/position
- `PreferredSlots` - Preferred time preference
- `QualifiedCourses` - Comma-separated course IDs in quotes

---

### 3. Rooms.csv
```csv
RoomID,Type,Capacity
R101,Lecture,100
R102,Lecture,80
LAB01,Lab,30
LAB02,Lab,25
```

**Required Columns:**
- `RoomID` - Unique room identifier
- `Type` - "Lecture" or "Lab"
- `Capacity` - Maximum student capacity

---

### 4. TimeSlots.csv
```csv
Day,StartTime,EndTime
Sunday,9:00 AM,10:30 AM
Sunday,10:45 AM,12:15 PM
Monday,9:00 AM,10:30 AM
Monday,10:45 AM,12:15 PM
```

**Required Columns:**
- `Day` - Day of week (Sunday-Thursday)
- `StartTime` - Start time (e.g., "9:00 AM")
- `EndTime` - End time (e.g., "10:30 AM")

---

## 🎨 User Interface Components

### Upload Modal Design
- **Header**: Gradient header with upload icon
- **Body**: 
  - 2×2 grid layout for file inputs
  - Icon badges for each file type
  - File format hints below each input
  - Progress bar with status text
- **Footer**: Cancel and Upload buttons

### Data Status Card
- **Status Indicator**: Color-coded text
  - Green (✅) = Data loaded
  - Yellow (⚠️) = No data
- **Statistics Grid**: 4 stat boxes with icons
- **Hover Effects**: Interactive visual feedback

### Toast Notifications
- Success messages (green)
- Error messages (red)
- Info messages (blue)
- Auto-dismiss after 3 seconds

---

## 🔧 Technical Implementation

### Frontend (JavaScript)

#### Key Functions:
```javascript
// Open upload modal
showUploadModal()

// Close upload modal
closeUploadModal()

// Handle file upload
handleModalUpload()

// Update data status display
updateDataStatusCard()

// Reload data from files
reloadData()
```

#### Global State:
- `dataLoaded` - Boolean flag for data status
- `allData` - Object containing all loaded data

---

### Backend (Python/Flask)

#### API Endpoints:

**POST /api/upload-files**
- Accepts multipart form data with 4 CSV files
- Validates file presence and format
- Saves files to `uploads/` directory
- Loads data into system
- Returns success status and counts

**GET /api/check-data-status**
- Returns current data load status
- Returns counts for each data type
- Used for UI state management

**POST /api/reload**
- Reloads data from existing CSV files
- Updates all data structures
- Returns success status

---

## 📈 Workflow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Click "Upload       │
│ New Data" Button    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Upload Modal Opens  │
│ - Select 4 files    │
│ - Click Upload      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Files Sent to       │
│ Backend             │
│ - Validated         │
│ - Saved to uploads/ │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Data Loaded into    │
│ System              │
│ - Courses           │
│ - Instructors       │
│ - Rooms             │
│ - TimeSlots         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ UI Updates          │
│ - Status card       │
│ - Data tables       │
│ - Summary cards     │
│ - Modal closes      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Ready to Generate   │
│ Timetable           │
└─────────────────────┘
```

---

## ⚙️ Configuration

### File Upload Limits
```python
# In app.py
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
```

### Upload Directory Structure
```
roqia is project/
└── uploads/
    ├── Courses.csv
    ├── instructors.csv
    ├── Rooms.csv
    └── TimeSlots.csv
```

---

## 🐛 Error Handling

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Missing [file] file" | Not all 4 files selected | Select all required files |
| "[file] must be CSV format" | Wrong file type | Use .csv files only |
| "No data loaded" | Tried to generate without data | Upload files first |
| "Failed to upload files" | Server/network error | Check connection, try again |
| "Error loading data" | Invalid CSV format | Check CSV format matches requirements |

### Validation Checks
✅ All 4 files present  
✅ Files are CSV format  
✅ Files not empty  
✅ CSV columns match expected format  
✅ No duplicate IDs in data  

---

## 💡 Best Practices

### For Users:
1. **Prepare CSV files** with correct format before uploading
2. **Verify data** in Data Management tables after upload
3. **Check status card** to confirm data loaded successfully
4. **Use Reload Data** to refresh if you update CSV files
5. **Keep backups** of your CSV files

### For Developers:
1. **Validate input** on both frontend and backend
2. **Provide clear feedback** at each step
3. **Handle errors gracefully** with user-friendly messages
4. **Log operations** for debugging
5. **Test with various** CSV formats and edge cases

---

## 🎯 Integration Points

### Dashboard Tab
- Summary cards display uploaded data counts
- Generation form checks data status
- Real-time updates after upload

### Data Management Tab
- Status card shows load state
- Upload button opens modal
- Reload button refreshes data
- Tables display current data

### Timetable Tab
- Uses uploaded data for generation
- Displays scheduled courses
- Allows editing with uploaded data

### Statistics Tab
- Shows metrics from generated timetable
- Based on uploaded data

---

## 📊 Features Checklist

✅ **Modal-based upload interface**  
✅ **4-file simultaneous upload**  
✅ **Real-time progress tracking**  
✅ **Data status monitoring**  
✅ **Automatic UI updates**  
✅ **Error handling & validation**  
✅ **Professional styling**  
✅ **Responsive design**  
✅ **Integration with all tabs**  
✅ **Backend file management**  
✅ **Data persistence**  
✅ **Reload functionality**  

---

## 🚀 Quick Start Guide

```bash
# 1. Start the server
python app.py

# 2. Open browser
http://localhost:5000

# 3. Navigate to Data tab
Click "Data" in navigation

# 4. Upload files
Click "Upload New Data"
Select your 4 CSV files
Click "Upload Files"

# 5. Verify upload
Check status card shows "Data loaded and ready"
View tables to see your data

# 6. Generate timetable
Go to Dashboard
Click "Generate Full Timetable"
Wait for results

# 7. View and export
Go to Timetable tab
View schedule
Export as PDF or JSON
```

---

## 📞 Support & Troubleshooting

### Check These First:
1. ✅ All 4 CSV files formatted correctly
2. ✅ Files are .csv extension
3. ✅ Column names match exactly
4. ✅ No special characters in data
5. ✅ Server is running

### Still Having Issues?
1. Check browser console (F12) for errors
2. Check server terminal for error messages
3. Verify file paths and permissions
4. Try reloading the page (Ctrl+Shift+R)
5. Restart the server

---

## 🎉 Summary

The integrated upload system provides:
- **Professional UI** for file management
- **Easy data upload** with visual feedback
- **Real-time status** monitoring
- **Seamless integration** across all features
- **Error handling** for smooth user experience
- **Complete backend** support

**Ready to upload and schedule!** 📚✨

---

**© 2025 Kareem. All Rights Reserved.**
