// Royal Smart Notes + Workout Planner - Main Application Script

// Data Storage
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let archivedNotes = JSON.parse(localStorage.getItem('archivedNotes')) || [];
let currentFilter = 'all';
let currentNoteId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeNotes();
    updateDashboard();
    loadNotes();
    loadArchive();
});

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPage = item.dataset.page;

            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(targetPage).classList.add('active');

            // Load page-specific content
            if (targetPage === 'dashboard') {
                updateDashboard();
            } else if (targetPage === 'notes') {
                loadNotes();
            } else if (targetPage === 'archive') {
                loadArchive();
            }
        });
    });
}

// Dashboard Functions
function updateDashboard() {
    const totalNotes = notes.length;
    const completedTasks = notes.filter(n => n.color === 'yellow').length;
    const upcomingTasks = notes.filter(n => n.dueDate && new Date(n.dueDate) >= new Date()).length;
    const archivedCount = archivedNotes.length;

    // Get workout days count
    const workoutData = JSON.parse(localStorage.getItem('workouts')) || {};
    const workoutDays = Object.values(workoutData).filter(w => w && w.muscleGroup !== 'rest').length;

    document.getElementById('stat-total-notes').textContent = totalNotes;
    document.getElementById('stat-completed').textContent = completedTasks;
    document.getElementById('stat-upcoming').textContent = upcomingTasks;
    document.getElementById('stat-workout-days').textContent = workoutDays;

    updateRecentActivity();
}

function updateRecentActivity() {
    const activityContainer = document.getElementById('recent-activity');

    if (notes.length === 0) {
        activityContainer.innerHTML = '<p class="empty-state">No recent activity</p>';
        return;
    }

    // Get last 5 notes sorted by creation time
    const recentNotes = [...notes]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    activityContainer.innerHTML = recentNotes.map(note => `
        <div class="activity-item">
            ðŸ“ ${note.title} ${note.dueDate ? `- Due: ${formatDate(note.dueDate)}` : ''}
        </div>
    `).join('');
}

// Notes Functions
function initializeNotes() {
    // Create Note Button
    document.getElementById('create-note-btn').addEventListener('click', openNoteModal);

    // Modal Controls
    document.getElementById('close-modal').addEventListener('click', closeNoteModal);
    document.getElementById('cancel-note-btn').addEventListener('click', closeNoteModal);
    document.getElementById('save-note-btn').addEventListener('click', saveNote);

    // Color Options
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
        });
    });

    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.color;
            loadNotes();
        });
    });

    // Search
    document.getElementById('search-notes').addEventListener('input', (e) => {
        loadNotes(e.target.value);
    });

    // Close modal on outside click
    document.getElementById('note-modal').addEventListener('click', (e) => {
        if (e.target.id === 'note-modal') {
            closeNoteModal();
        }
    });
}

function openNoteModal(noteId = null) {
    const modal = document.getElementById('note-modal');
    const modalTitle = document.getElementById('modal-title');

    if (noteId) {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            currentNoteId = noteId;
            modalTitle.textContent = 'Edit Note';
            document.getElementById('note-title').value = note.title;
            document.getElementById('note-content').value = note.content;
            document.getElementById('note-due-date').value = note.dueDate || '';

            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.remove('active');
                if (option.dataset.color === note.color) {
                    option.classList.add('active');
                }
            });
        }
    } else {
        currentNoteId = null;
        modalTitle.textContent = 'Create Note';
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        document.getElementById('note-due-date').value = '';

        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector('.color-option.white').classList.add('active');
    }

    modal.classList.add('active');
}

function closeNoteModal() {
    document.getElementById('note-modal').classList.remove('active');
    currentNoteId = null;
}

function saveNote() {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();
    const dueDate = document.getElementById('note-due-date').value;
    const color = document.querySelector('.color-option.active').dataset.color;

    if (!title) {
        alert('Please enter a note title');
        return;
    }

    if (currentNoteId) {
        // Update existing note
        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex] = {
                ...notes[noteIndex],
                title,
                content,
                dueDate,
                color,
                updatedAt: Date.now()
            };
        }
    } else {
        // Create new note
        const newNote = {
            id: Date.now(),
            title,
            content,
            dueDate,
            color,
            pinned: false,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        notes.unshift(newNote);
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
    updateDashboard();
    closeNoteModal();
}

function loadNotes(searchQuery = '') {
    const notesGrid = document.getElementById('notes-grid');

    let filteredNotes = notes;

    // Apply color filter
    if (currentFilter !== 'all') {
        filteredNotes = filteredNotes.filter(note => note.color === currentFilter);
    }

    // Apply search filter
    if (searchQuery) {
        filteredNotes = filteredNotes.filter(note =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Sort: pinned first, then by updated time
    filteredNotes.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.updatedAt - a.updatedAt;
    });

    if (filteredNotes.length === 0) {
        notesGrid.innerHTML = '<p class="empty-state">No notes found</p>';
        return;
    }

    notesGrid.innerHTML = filteredNotes.map(note => createNoteCard(note)).join('');

    // Attach event listeners
    attachNoteEventListeners();
}

function createNoteCard(note) {
    const colorLabel = {
        yellow: 'Completed',
        green: 'In Progress',
        white: 'Not Started',
        red: 'Hard/Urgent',
        brown: 'Easy'
    };

    return `
        <div class="note-card ${note.color} ${note.pinned ? 'pinned' : ''}" data-id="${note.id}">
            <div class="note-header">
                <h3 class="note-title">${note.title}</h3>
                <div class="note-actions">
                    <button class="note-action-btn pin-btn" data-id="${note.id}">
                        ${note.pinned ? 'ðŸ“Œ' : 'ðŸ“'}
                    </button>
                    <button class="note-action-btn edit-btn" data-id="${note.id}">âœï¸</button>
                    <button class="note-action-btn archive-btn" data-id="${note.id}">ðŸ—„ï¸</button>
                    <button class="note-action-btn delete-btn" data-id="${note.id}">ðŸ—‘ï¸</button>
                </div>
            </div>
            <div class="note-content">${note.content || 'No content'}</div>
            <div class="note-footer">
                <span class="note-date">
                    ${note.dueDate ? 'ðŸ“… ' + formatDate(note.dueDate) : 'No due date'}
                </span>
                <div class="checkbox-container">
                    <input type="checkbox" class="complete-checkbox" data-id="${note.id}"
                           ${note.color === 'yellow' ? 'checked' : ''}>
                    <span style="font-size: 12px;">${colorLabel[note.color]}</span>
                </div>
            </div>
        </div>
    `;
}

function attachNoteEventListeners() {
    // Pin buttons
    document.querySelectorAll('.pin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePin(parseInt(btn.dataset.id));
        });
    });

    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openNoteModal(parseInt(btn.dataset.id));
        });
    });

    // Archive buttons
    document.querySelectorAll('.archive-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            archiveNote(parseInt(btn.dataset.id));
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteNote(parseInt(btn.dataset.id));
        });
    });

    // Complete checkboxes
    document.querySelectorAll('.complete-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            completeNote(parseInt(checkbox.dataset.id), checkbox.checked);
        });
    });
}

function togglePin(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        note.pinned = !note.pinned;
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    }
}

function archiveNote(noteId) {
    const noteIndex = notes.findIndex(n => n.id === noteId);
    if (noteIndex !== -1) {
        const note = notes.splice(noteIndex, 1)[0];
        archivedNotes.unshift(note);
        localStorage.setItem('notes', JSON.stringify(notes));
        localStorage.setItem('archivedNotes', JSON.stringify(archivedNotes));
        loadNotes();
        updateDashboard();
    }
}

function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(n => n.id !== noteId);
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
        updateDashboard();
    }
}

function completeNote(noteId, isCompleted) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        const noteCard = document.querySelector(`.note-card[data-id="${noteId}"]`);

        if (isCompleted) {
            // Animate completion
            noteCard.classList.add('completing');

            setTimeout(() => {
                // Mark as completed (yellow)
                note.color = 'yellow';

                // Auto-archive
                const noteIndex = notes.findIndex(n => n.id === noteId);
                if (noteIndex !== -1) {
                    const completedNote = notes.splice(noteIndex, 1)[0];
                    archivedNotes.unshift(completedNote);
                    localStorage.setItem('notes', JSON.stringify(notes));
                    localStorage.setItem('archivedNotes', JSON.stringify(archivedNotes));
                    loadNotes();
                    updateDashboard();
                }
            }, 500);
        }
    }
}

// Archive Functions
function loadArchive() {
    const archiveGrid = document.getElementById('archive-grid');

    if (archivedNotes.length === 0) {
        archiveGrid.innerHTML = '<p class="empty-state">No archived notes</p>';
        return;
    }

    archiveGrid.innerHTML = archivedNotes.map(note => createArchivedNoteCard(note)).join('');
    attachArchiveEventListeners();
}

function createArchivedNoteCard(note) {
    return `
        <div class="note-card ${note.color}" data-id="${note.id}">
            <div class="note-header">
                <h3 class="note-title">${note.title}</h3>
                <div class="note-actions">
                    <button class="note-action-btn restore-btn" data-id="${note.id}">â†©ï¸</button>
                    <button class="note-action-btn delete-archived-btn" data-id="${note.id}">ðŸ—‘ï¸</button>
                </div>
            </div>
            <div class="note-content">${note.content || 'No content'}</div>
            <div class="note-footer">
                <span class="note-date">
                    ${note.dueDate ? 'ðŸ“… ' + formatDate(note.dueDate) : 'No due date'}
                </span>
            </div>
        </div>
    `;
}

function attachArchiveEventListeners() {
    // Restore buttons
    document.querySelectorAll('.restore-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            restoreNote(parseInt(btn.dataset.id));
        });
    });

    // Delete archived buttons
    document.querySelectorAll('.delete-archived-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteArchivedNote(parseInt(btn.dataset.id));
        });
    });
}

function restoreNote(noteId) {
    const noteIndex = archivedNotes.findIndex(n => n.id === noteId);
    if (noteIndex !== -1) {
        const note = archivedNotes.splice(noteIndex, 1)[0];
        notes.unshift(note);
        localStorage.setItem('notes', JSON.stringify(notes));
        localStorage.setItem('archivedNotes', JSON.stringify(archivedNotes));
        loadArchive();
        updateDashboard();
    }
}

function deleteArchivedNote(noteId) {
    if (confirm('Are you sure you want to permanently delete this note?')) {
        archivedNotes = archivedNotes.filter(n => n.id !== noteId);
        localStorage.setItem('archivedNotes', JSON.stringify(archivedNotes));
        loadArchive();
        updateDashboard();
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
