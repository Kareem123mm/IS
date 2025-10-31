# 📤 File Upload Feature - Implementation Summary

**© 2025 Kareem. All Rights Reserved.**

---

## 🎯 Overview

The system has been modified to require users to upload their own CSV files before generating a timetable. The application no longer auto-loads default data on startup.

---

## ✨ What's New

### 1. **File Upload Interface**
- New upload section on the Dashboard tab
- Users must upload 4 CSV files:
  - **Courses.csv** - Course information
  - **instructors.csv** - Instructor details
  - **Rooms.csv** - Room inventory
  - **TimeSlots.csv** - Available time slots

### 2. **Smart UI Updates**
- Upload section is shown when no data is loaded
- Generation section appears only after successful upload
- Real-time status updates and validation

### 3. **Backend Changes**
- New `/api/upload-files` endpoint for handling file uploads
- New `/api/check-data-status` endpoint to check if data is loaded
- Files are saved to `uploads/` directory
- Generate endpoint now checks if data is loaded first

---

## 📝 How to Use

### Step 1: Start the Server
```powershell
python app.py
```

### Step 2: Upload Files
1. Open browser to `http://localhost:5000`
2. You'll see the **Upload CSV Files** section
3. Select your 4 CSV files:
   - Courses
   - Instructors
   - Rooms
   - Time Slots
4. Click **"Upload Files"** button

### Step 3: Generate Timetable
- After successful upload, the generation form appears
- Set the timeout (default: 300 seconds)
- Click **"Generate Full Timetable"**
- Wait for the algorithm to complete

---

## 📁 Required CSV File Formats

### Courses.csv
```csv
CourseID,CourseName,Credits,Type
AID427,Artificial Intelligence,3,Lecture and Lab
CSC111,Programming 1,3,Lecture and Lab
```

### instructors.csv
```csv
InstructorID,Name,Role,PreferredSlots,QualifiedCourses
I001,Dr. Ahmed,Professor,Morning,"AID427,CSC111"
I002,Prof. Sara,Assistant Professor,Afternoon,"CSC222"
```

### Rooms.csv
```csv
RoomID,Type,Capacity
R101,Lecture,100
LAB01,Lab,30
```

### TimeSlots.csv
```csv
Day,StartTime,EndTime
Sunday,9:00 AM,10:30 AM
Sunday,10:45 AM,12:15 PM
```

---

## 🔧 Technical Changes

### Modified Files:

#### 1. **app.py**
- Added `UPLOAD_FOLDER` configuration
- Added `werkzeug.utils.secure_filename` import
- Modified `initialize_data()` to be optional
- Added `data_loaded` global flag
- New route: `/api/upload-files` (POST)
- New route: `/api/check-data-status` (GET)
- Updated `/api/generate` to check data status

#### 2. **templates/index.html**
- Added upload section with file input fields
- Added upload status display area
- Upload section shows/hides based on data status

#### 3. **static/js/app.js**
- Added `dataLoaded` flag to global state
- New function: `checkDataStatus()`
- New function: `updateUIBasedOnDataStatus()`
- New function: `handleFileUpload()`
- Updated `handleGenerate()` to check data status

#### 4. **static/css/style.css**
- Added `.upload-section` styles
- Added `.upload-grid` for responsive layout
- Added file input styling
- Added alert box styles for status messages

---

## 🚀 Features

✅ **Required Upload**: Users must upload files before generating  
✅ **All 4 Files Required**: System validates all files are present  
✅ **CSV Validation**: Only accepts .csv file format  
✅ **File Size Limit**: Maximum 16MB per file  
✅ **Real-time Feedback**: Shows upload progress and status  
✅ **Automatic UI Update**: Generation form appears after upload  
✅ **Data Statistics**: Shows counts after successful upload  
✅ **Error Handling**: Clear error messages for issues  

---

## 📂 New Directory Structure

```
roqia is project/
├── uploads/                  # NEW - Stores uploaded CSV files
│   ├── Courses.csv
│   ├── instructors.csv
│   ├── Rooms.csv
│   └── TimeSlots.csv
├── app.py                    # MODIFIED
├── templates/
│   └── index.html           # MODIFIED
├── static/
│   ├── js/
│   │   └── app.js          # MODIFIED
│   └── css/
│       └── style.css       # MODIFIED
└── [other files...]
```

---

## 🎨 User Experience Flow

```
1. User opens application
   ↓
2. Sees "Upload CSV Files" section
   ↓
3. Selects 4 required CSV files
   ↓
4. Clicks "Upload Files"
   ↓
5. System validates and loads data
   ↓
6. Success message shows data counts
   ↓
7. Upload section hides
   ↓
8. Generation section appears
   ↓
9. User can now generate timetable
```

---

## ⚠️ Important Notes

1. **First Time Use**: No default data is loaded. Upload is required.
2. **Reupload**: Users can upload new files anytime via "Reload Data"
3. **File Storage**: Uploaded files are saved to `uploads/` folder
4. **Data Persistence**: Data stays loaded until server restart
5. **Validation**: All 4 files must be valid CSV format

---

## 🐛 Error Messages

| Error | Meaning |
|-------|---------|
| "Missing [file] file" | One or more required files not uploaded |
| "No [file] file selected" | File input is empty |
| "[file] must be CSV format" | Wrong file type uploaded |
| "No data loaded. Please upload CSV files first" | Tried to generate without uploading |

---

## 💡 Benefits

✅ **Flexibility**: Users can use their own data  
✅ **Privacy**: No default institutional data exposed  
✅ **Testing**: Easy to test with different datasets  
✅ **Customization**: Each user can have unique constraints  
✅ **Clean Start**: No pre-loaded data confusion  

---

## 🔄 API Endpoints Summary

### New Endpoints:
- `POST /api/upload-files` - Upload CSV files
- `GET /api/check-data-status` - Check if data loaded

### Modified Endpoints:
- `POST /api/generate` - Now checks data status first

---

**Ready to use! Upload your CSV files and start generating timetables! 🚀**
