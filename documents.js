// Royal Smart Notes + Workout Planner - Documents Module

let documents = JSON.parse(localStorage.getItem('documents')) || [];
let currentDocumentId = null;
let autoSaveTimer = null;

// Initialize Documents
document.addEventListener('DOMContentLoaded', () => {
    initializeDocuments();
});

function initializeDocuments() {
    // Create Document Button
    document.getElementById('create-doc-btn').addEventListener('click', createNewDocument);

    // Close Editor Button
    document.getElementById('close-editor-btn').addEventListener('click', closeDocumentEditor);

    // Toolbar Buttons
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const command = btn.dataset.command;
            const value = btn.dataset.value || null;

            if (command === 'formatBlock' && value) {
                document.execCommand(command, false, value);
            } else {
                document.execCommand(command, false, value);
            }

            // Focus back to editor
            document.getElementById('editor-content').focus();
        });
    });

    // Auto-save on content change
    document.getElementById('editor-content').addEventListener('input', () => {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            saveCurrentDocument();
        }, 1000); // Auto-save after 1 second of inactivity
    });

    // Auto-save on title change
    document.getElementById('doc-title').addEventListener('input', () => {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            saveCurrentDocument();
        }, 1000);
    });

    // Load documents list when navigating to documents page
    const documentsNavItem = document.querySelector('[data-page="documents"]');
    if (documentsNavItem) {
        documentsNavItem.addEventListener('click', () => {
            closeDocumentEditor();
            loadDocumentsList();
        });
    }

    // Initial load
    loadDocumentsList();
}

function createNewDocument() {
    const newDoc = {
        id: Date.now(),
        title: 'Untitled Document',
        content: '<p>Start writing...</p>',
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    documents.unshift(newDoc);
    localStorage.setItem('documents', JSON.stringify(documents));

    openDocument(newDoc.id);
}

function loadDocumentsList() {
    const documentsList = document.getElementById('documents-list');
    const documentEditor = document.getElementById('document-editor');

    documentsList.style.display = 'grid';
    documentEditor.style.display = 'none';

    if (documents.length === 0) {
        documentsList.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <p>No documents yet. Click "Create Document" to start writing.</p>
            </div>
        `;
        return;
    }

    documentsList.innerHTML = documents.map(doc => createDocumentCard(doc)).join('');

    // Attach click handlers
    document.querySelectorAll('.document-item').forEach(item => {
        item.addEventListener('click', () => {
            const docId = parseInt(item.dataset.id);
            openDocument(docId);
        });
    });

    // Attach delete handlers
    document.querySelectorAll('.delete-doc-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const docId = parseInt(btn.dataset.id);
            deleteDocument(docId);
        });
    });
}

function createDocumentCard(doc) {
    const lastEdited = formatDocumentDate(doc.updatedAt);

    // Extract plain text from HTML for preview
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = doc.content;
    const preview = tempDiv.textContent.substring(0, 100);

    return `
        <div class="document-item" data-id="${doc.id}">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h3 class="document-title">${doc.title}</h3>
                <button class="note-action-btn delete-doc-btn" data-id="${doc.id}" style="opacity: 1;">ðŸ—‘ï¸</button>
            </div>
            <p style="color: var(--text-secondary); font-size: 13px; margin: 10px 0;">${preview}...</p>
            <div class="document-meta">
                <span>ðŸ“„ Document</span>
                <span>Last edited: ${lastEdited}</span>
            </div>
        </div>
    `;
}

function openDocument(docId) {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    currentDocumentId = docId;

    // Show editor, hide list
    document.getElementById('documents-list').style.display = 'none';
    document.getElementById('document-editor').style.display = 'block';

    // Set title and content
    document.getElementById('doc-title').value = doc.title;
    document.getElementById('editor-content').innerHTML = doc.content;

    // Focus on editor
    setTimeout(() => {
        document.getElementById('editor-content').focus();
    }, 100);
}

function closeDocumentEditor() {
    if (currentDocumentId) {
        saveCurrentDocument();
    }

    currentDocumentId = null;

    document.getElementById('documents-list').style.display = 'grid';
    document.getElementById('document-editor').style.display = 'none';

    loadDocumentsList();
}

function saveCurrentDocument() {
    if (!currentDocumentId) return;

    const doc = documents.find(d => d.id === currentDocumentId);
    if (!doc) return;

    const title = document.getElementById('doc-title').value.trim() || 'Untitled Document';
    const content = document.getElementById('editor-content').innerHTML;

    doc.title = title;
    doc.content = content;
    doc.updatedAt = Date.now();

    localStorage.setItem('documents', JSON.stringify(documents));
}

function deleteDocument(docId) {
    if (confirm('Are you sure you want to delete this document?')) {
        documents = documents.filter(d => d.id !== docId);
        localStorage.setItem('documents', JSON.stringify(documents));
        loadDocumentsList();
    }
}

function formatDocumentDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
        return 'Just now';
    } else if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

// Prevent losing work on page unload
window.addEventListener('beforeunload', (e) => {
    if (currentDocumentId) {
        saveCurrentDocument();
    }
});
