# Royal Smart Notes + Workout Planner

A premium productivity web application combining notes, documents, calendar, and workout planning with a beautiful royal dark theme and gold accents.

## Features

### ðŸ“ Notes System (Google Keep Style)
- Create, edit, and delete notes
- Color-coded status system:
  - **Red** (ðŸ”´) - Hard/Urgent
  - **Green** (ðŸŸ¢) - In Progress
  - **White** (âšª) - Not Started
  - **Brown** (ðŸŸ¤) - Easy
  - **Yellow** (âœ…) - Completed
- Pin important notes
- Archive completed tasks
- Search and filter notes
- **Checklist completion** with automatic archiving
- Due date tracking with **SAVE button**

### âœ… Checklist Completion Feature
- Each note has a checkbox
- When checked:
  - Plays completion animation
  - Automatically moves to Archive
  - Removes from active notes
- Gives satisfaction of completing tasks

### ðŸ“„ Documents (Google Docs Style)
- Full-featured rich text editor with **dark theme**
- Text formatting: Bold, Italic, Underline
- Headings (H1, H2, Paragraph)
- Bullet and numbered lists
- Auto-save functionality (saves every 1 second)
- Multiple document management
- Last edited timestamps
- **Dark background** (not white) for comfortable editing

### ðŸ“… Calendar
- Monthly calendar view
- **Task names displayed directly** on calendar dates
- Example display:
  ```
  March 12
  â€¢ Math Assignment
  â€¢ Study Biology
  ```
- **Fixed date display** - dates match exactly what you select
- Click on tasks to view/edit
- Color-coded tasks matching note colors
- Today's date highlighting

### ðŸ’ª Workout Planner
- Plan workouts for each day of the week (Mon-Sun)
- Choose muscle groups:
  - Arms
  - Legs
  - Chest
  - Back
  - Shoulders
  - Core
  - Rest Day
- Exercise database for each muscle group:
  - **Arms**: Bicep Curls, Tricep Dips, Hammer Curls
  - **Legs**: Squats, Lunges, Leg Press
  - **Chest**: Push-ups, Bench Press, Chest Flys
  - **Back**: Pull-ups, Rows, Lat Pulldowns
  - **Shoulders**: Shoulder Press, Lateral Raises, Front Raises
  - **Core**: Planks, Crunches, Russian Twists
- **Automatic workout calculation**:
  - Enter your maximum reps
  - App calculates: **3 sets Ã— 75% of max reps**
  - Example: Max 20 reps â†’ 3 Ã— 15 reps
- Visual workout plan display

### ðŸ—„ï¸ Archive
- Stores completed and archived notes
- Restore notes back to active
- Permanently delete archived notes

### ðŸ“Š Dashboard
- Quick statistics:
  - Total notes count
  - Completed tasks
  - Upcoming tasks
  - **Workout days this week**
- Recent activity feed

## Installation

**No installation required!** This is a pure client-side web application.

### How to Use

1. **Download** the project folder
2. **Open** `index.html` in any modern web browser
3. **Start using** the app immediately

That's it! No Node.js, no npm, no server needed.

## File Structure

```
royal-workout-planner/
â”œâ”€â”€ index.html          # Main HTML structure
â”œâ”€â”€ styles.css          # Royal dark theme styling
â”œâ”€â”€ app.js              # Notes, dashboard, archive functionality
â”œâ”€â”€ calendar.js         # Calendar with date fix
â”œâ”€â”€ documents.js        # Dark theme document editor
â”œâ”€â”€ workout.js          # Workout planner with auto-calculation
â””â”€â”€ README.md           # This file
```

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Data Storage

All data is stored locally in your browser using `localStorage`:
- Notes and due dates
- Documents
- Calendar events
- Workout plans
- Archived items

Your data persists between sessions and **never leaves your device**.

## Design Features

### Royal Dark Theme
- Background: `#0f1623` (Deep navy)
- Card color: `#1b2335` (Dark slate)
- Accent: `#d4af37` (Gold)
- Glass-style panels with borders
- Smooth hover animations

### Typography
- Elegant serif headings (Georgia)
- Clean modern body font (Segoe UI)

### User Experience
- Smooth transitions and hover effects
- Completion animations
- Intuitive navigation
- Visual feedback on all interactions

## Responsive Design

Fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Usage Guide

### Creating a Note
1. Click "Create Note" button
2. Enter title and content
3. Set a due date (optional)
4. Choose a status color
5. Click "**Save Note**" button

### Completing a Task
1. Check the checkbox on any note
2. Watch the completion animation
3. Note automatically moves to Archive

### Creating a Workout Plan
1. Go to "Workout Planner"
2. Click "+ Add Workout" on any day
3. Select muscle group (or Rest Day)
4. Choose an exercise
5. Enter your maximum reps
6. App shows recommended: **3 sets Ã— [calculated reps]**
7. Click "Save Workout"

### Using Documents
1. Go to "Documents"
2. Click "Create Document"
3. Start writing with dark theme editor
4. Use toolbar for formatting
5. Changes auto-save every second

### Calendar Date Fix
- When you select a due date for a note (e.g., March 12)
- The calendar displays it on the **exact same date** (March 12)
- No more date shifting issues!

## Privacy

This app runs entirely in your browser. **No data is sent to any server.** All your notes, documents, workouts, and schedules remain private on your device.

## Support

If you encounter any issues:
- Ensure you're using a modern browser
- JavaScript must be enabled
- localStorage must be enabled (not in private/incognito mode)

## Key Improvements

This version includes:
- âœ… **Removed AI Smart Planner** (as requested)
- âœ… **Added Workout Planner** with automatic calculation
- âœ… **Fixed calendar date display** (no more date shifting)
- âœ… **Dark theme document editor** (no white background)
- âœ… **Save button** in notes modal
- âœ… **Checklist completion** with auto-archive
- âœ… **Task names displayed** on calendar

## Version

2.0.0 - March 2026

---

**Stay organized and fit with Royal Smart Notes + Workout Planner! ðŸ‘‘ðŸ’ª**
