// Royal Smart Notes + Workout Planner - Calendar Module

let currentDate = new Date();

// Initialize Calendar
document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
});

function initializeCalendar() {
    // Navigation buttons
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderMonthView();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderMonthView();
    });

    // Render calendar when page loads
    renderMonthView();
}

function renderMonthView() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update title
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    document.getElementById('calendar-title').textContent = monthName;

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    // Get days from previous month
    const prevMonthLastDay = new Date(year, month, 0);
    const daysInPrevMonth = prevMonthLastDay.getDate();

    const calendarContainer = document.getElementById('calendar-view');
    let html = '<div class="calendar-grid">';

    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });

    // Previous month days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const date = new Date(year, month - 1, day);
        html += createDayCell(date, true);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        html += createDayCell(date, false);
    }

    // Next month days to fill grid
    const totalCells = startDayOfWeek + daysInMonth;
    const remainingCells = 7 - (totalCells % 7);
    if (remainingCells < 7) {
        for (let day = 1; day <= remainingCells; day++) {
            const date = new Date(year, month + 1, day);
            html += createDayCell(date, true);
        }
    }

    html += '</div>';
    calendarContainer.innerHTML = html;

    // Attach click handlers
    attachCalendarClickHandlers();
}

function createDayCell(date, isOtherMonth) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cellDate = new Date(date);
    cellDate.setHours(0, 0, 0, 0);

    const isToday = cellDate.getTime() === today.getTime();
    const dayNumber = date.getDate();

    // IMPORTANT FIX: Use local date string without timezone conversion
    // Format date as YYYY-MM-DD in local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    // Get tasks for this date
    const tasksForDay = getTasksForDate(dateString);

    let classes = 'calendar-day';
    if (isOtherMonth) classes += ' other-month';
    if (isToday) classes += ' today';

    let html = `<div class="${classes}" data-date="${dateString}">`;
    html += `<div class="day-number">${dayNumber}</div>`;

    if (tasksForDay.length > 0) {
        html += '<div class="day-tasks">';
        // Show up to 3 tasks
        tasksForDay.slice(0, 3).forEach(task => {
            html += `<div class="task-item ${task.color}" title="${task.title}">â€¢ ${task.title}</div>`;
        });
        if (tasksForDay.length > 3) {
            html += `<div class="task-item" style="font-size: 10px; text-align: center;">+${tasksForDay.length - 3} more</div>`;
        }
        html += '</div>';
    }

    html += '</div>';
    return html;
}

function getTasksForDate(dateString) {
    // Get notes from localStorage
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    // Filter notes that have this due date
    // The dateString is already in YYYY-MM-DD format from the date picker
    return notes.filter(note => note.dueDate === dateString);
}

function attachCalendarClickHandlers() {
    document.querySelectorAll('.task-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            // Get task title from the text
            const taskTitle = item.textContent.replace('â€¢ ', '').trim();
            // Find the note by title
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            const note = notes.find(n => n.title === taskTitle);
            if (note) {
                // Switch to notes page and open the note
                switchToNotesAndOpen(note.id);
            }
        });
    });
}

function switchToNotesAndOpen(noteId) {
    // Switch to notes page
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelector('[data-page="notes"]').classList.add('active');

    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('notes').classList.add('active');

    // Load notes and open modal
    loadNotes();

    setTimeout(() => {
        openNoteModal(noteId);
    }, 100);
}
