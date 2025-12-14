// ===========================
// APP STATE & CONFIGURATION
// ===========================
const AppState = {
    currentSection: 'dashboard',
    books: [],
    members: [],
    activities: []
};

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// ===========================
// DOM ELEMENTS
// ===========================
const elements = {
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('.section-container'),
    addBookBtns: document.querySelectorAll('#addBookBtn, #addBookBtn2'),
    addMemberBtns: document.querySelectorAll('#addMemberBtn, #addMemberBtn2'),
    modalCloseBtns: document.querySelectorAll('.modal-close, [data-modal]'),
    addBookModal: document.getElementById('addBookModal'),
    addBookForm: document.getElementById('addBookForm'),
    activitiesList: document.getElementById('activitiesList'),
    booksGrid: document.getElementById('booksGrid'),
    membersTableBody: document.getElementById('membersTableBody')
};

// ===========================
// INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadInitialData();
});

function initializeApp() {
    console.log('🚀 Library Management System Initialized');
    animateStatCards();
    initializeCharts();
}

// ===========================
// EVENT LISTENERS
// ===========================
function setupEventListeners() {
    // Navigation
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('href').substring(1);
            switchSection(targetSection);
        });
    });

    // Add Book Modal
    elements.addBookBtns.forEach(btn => {
        btn.addEventListener('click', () => openModal('addBookModal'));
    });

    // Modal Close
    elements.modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = btn.getAttribute('data-modal');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });

    // Add Book Form
    if (elements.addBookForm) {
        elements.addBookForm.addEventListener('submit', handleAddBook);
    }

    // Quick Actions
    const quickActionBtns = {
        issueBookBtn: document.getElementById('issueBookBtn'),
        returnBookBtn: document.getElementById('returnBookBtn'),
        generateReportBtn: document.getElementById('generateReportBtn')
    };

    if (quickActionBtns.issueBookBtn) {
        quickActionBtns.issueBookBtn.addEventListener('click', () => {
            showNotification('Issue Book feature coming soon!', 'info');
        });
    }

    if (quickActionBtns.returnBookBtn) {
        quickActionBtns.returnBookBtn.addEventListener('click', () => {
            showNotification('Return Book feature coming soon!', 'info');
        });
    }

    if (quickActionBtns.generateReportBtn) {
        quickActionBtns.generateReportBtn.addEventListener('click', generateReport);
    }

    // Search and Filter
    const bookSearch = document.getElementById('bookSearch');
    if (bookSearch) {
        bookSearch.addEventListener('input', debounce(filterBooks, 300));
    }

    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', filterBooks);
    }
}

// ===========================
// NAVIGATION
// ===========================
function switchSection(sectionId) {
    // Update nav links
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Update sections
    elements.sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });

    AppState.currentSection = sectionId;
}

// ===========================
// MODAL MANAGEMENT
// ===========================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ===========================
// DATA LOADING
// ===========================
async function loadInitialData() {
    try {
        await Promise.all([
            loadBooks(),
            loadMembers(),
            loadActivities()
        ]);
    } catch (error) {
        console.error('Error loading initial data:', error);
        // Load mock data as fallback
        loadMockData();
    }
}

function loadMockData() {
    // Mock Books
    AppState.books = [
        {
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            isbn: '978-0-7432-7356-5',
            category: 'fiction',
            status: 'available',
            description: 'A classic American novel set in the Jazz Age'
        },
        {
            id: 2,
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            isbn: '978-0-06-112008-4',
            category: 'fiction',
            status: 'issued',
            description: 'A gripping tale of racial injustice and childhood innocence'
        },
        {
            id: 3,
            title: 'A Brief History of Time',
            author: 'Stephen Hawking',
            isbn: '978-0-553-10953-5',
            category: 'science',
            status: 'available',
            description: 'A landmark volume in science writing'
        },
        {
            id: 4,
            title: 'Clean Code',
            author: 'Robert C. Martin',
            isbn: '978-0-13-235088-4',
            category: 'technology',
            status: 'available',
            description: 'A handbook of agile software craftsmanship'
        },
        {
            id: 5,
            title: 'Sapiens',
            author: 'Yuval Noah Harari',
            isbn: '978-0-06-231609-7',
            category: 'history',
            status: 'issued',
            description: 'A brief history of humankind'
        },
        {
            id: 6,
            title: '1984',
            author: 'George Orwell',
            isbn: '978-0-452-28423-4',
            category: 'fiction',
            status: 'available',
            description: 'A dystopian social science fiction novel'
        }
    ];

    // Mock Members
    AppState.members = [
        {
            id: 'MEM001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            booksIssued: 2,
            status: 'active'
        },
        {
            id: 'MEM002',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            booksIssued: 1,
            status: 'active'
        },
        {
            id: 'MEM003',
            name: 'Mike Johnson',
            email: 'mike.j@example.com',
            booksIssued: 0,
            status: 'active'
        },
        {
            id: 'MEM004',
            name: 'Sarah Williams',
            email: 'sarah.w@example.com',
            booksIssued: 3,
            status: 'active'
        },
        {
            id: 'MEM005',
            name: 'David Brown',
            email: 'david.b@example.com',
            booksIssued: 0,
            status: 'inactive'
        }
    ];

    // Mock Activities
    AppState.activities = [
        {
            type: 'issue',
            title: 'Book Issued',
            description: 'John Doe borrowed "The Great Gatsby"',
            time: '2 minutes ago'
        },
        {
            type: 'return',
            title: 'Book Returned',
            description: 'Jane Smith returned "Clean Code"',
            time: '15 minutes ago'
        },
        {
            type: 'add',
            title: 'New Book Added',
            description: '"Sapiens" by Yuval Noah Harari added to library',
            time: '1 hour ago'
        },
        {
            type: 'issue',
            title: 'Book Issued',
            description: 'Sarah Williams borrowed "1984"',
            time: '2 hours ago'
        },
        {
            type: 'return',
            title: 'Book Returned',
            description: 'Mike Johnson returned "To Kill a Mockingbird"',
            time: '3 hours ago'
        }
    ];

    renderActivities();
    renderBooks();
    renderMembers();
}

async function loadBooks() {
    try {
        const response = await fetch(`${API_BASE_URL}/books`);
        if (response.ok) {
            AppState.books = await response.json();
            renderBooks();
        }
    } catch (error) {
        console.log('Using mock data for books');
    }
}

async function loadMembers() {
    try {
        const response = await fetch(`${API_BASE_URL}/members`);
        if (response.ok) {
            AppState.members = await response.json();
            renderMembers();
        }
    } catch (error) {
        console.log('Using mock data for members');
    }
}

async function loadActivities() {
    try {
        const response = await fetch(`${API_BASE_URL}/activities`);
        if (response.ok) {
            AppState.activities = await response.json();
            renderActivities();
        }
    } catch (error) {
        console.log('Using mock data for activities');
    }
}

// ===========================
// RENDERING
// ===========================
function renderActivities() {
    if (!elements.activitiesList) return;

    elements.activitiesList.innerHTML = AppState.activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon icon-${activity.type}">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-meta">${activity.description}</div>
            </div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

function renderBooks() {
    if (!elements.booksGrid) return;

    const booksHTML = AppState.books.map(book => `
        <div class="col-lg-4 col-md-6">
            <div class="book-card" data-book-id="${book.id}">
                <div class="book-cover" style="background: ${getBookGradient(book.category)}">
                    <i class="fas fa-book"></i>
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">by ${book.author}</p>
                    <div class="book-meta">
                        <span class="book-category">${book.category}</span>
                        <span class="book-status ${book.status}">${book.status}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    elements.booksGrid.innerHTML = booksHTML;
}

function renderMembers() {
    if (!elements.membersTableBody) return;

    const membersHTML = AppState.members.map(member => `
        <tr>
            <td><strong>${member.id}</strong></td>
            <td>
                <div class="member-info">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6366f1&color=fff" 
                         alt="${member.name}" 
                         class="member-avatar">
                    <span class="member-name">${member.name}</span>
                </div>
            </td>
            <td>${member.email}</td>
            <td><strong>${member.booksIssued}</strong></td>
            <td><span class="status-badge ${member.status}">${member.status}</span></td>
            <td>
                <button class="action-btn" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    elements.membersTableBody.innerHTML = membersHTML;
}

// ===========================
// FORM HANDLING
// ===========================
async function handleAddBook(e) {
    e.preventDefault();

    const bookData = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        isbn: document.getElementById('bookISBN').value,
        category: document.getElementById('bookCategory').value,
        description: document.getElementById('bookDescription').value,
        status: 'available'
    };

    try {
        const response = await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            showNotification('Book added successfully!', 'success');
            closeModal('addBookModal');
            elements.addBookForm.reset();
            await loadBooks();
        } else {
            throw new Error('Failed to add book');
        }
    } catch (error) {
        console.error('Error adding book:', error);
        // Add to local state as fallback
        bookData.id = AppState.books.length + 1;
        AppState.books.push(bookData);
        renderBooks();
        showNotification('Book added successfully! (Local only)', 'success');
        closeModal('addBookModal');
        elements.addBookForm.reset();
    }
}

// ===========================
// FILTERING
// ===========================
function filterBooks() {
    const searchTerm = document.getElementById('bookSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const availabilityFilter = document.getElementById('availabilityFilter')?.value || '';

    const filteredBooks = AppState.books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                            book.author.toLowerCase().includes(searchTerm) ||
                            book.isbn.includes(searchTerm);
        
        const matchesCategory = !categoryFilter || book.category === categoryFilter;
        const matchesAvailability = !availabilityFilter || book.status === availabilityFilter;

        return matchesSearch && matchesCategory && matchesAvailability;
    });

    // Temporarily update books for rendering
    const originalBooks = AppState.books;
    AppState.books = filteredBooks;
    renderBooks();
    AppState.books = originalBooks;
}

// ===========================
// ANIMATIONS
// ===========================
function animateStatCards() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-value').replace(/,/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateValue = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateValue);
            } else {
                stat.textContent = target.toLocaleString();
            }
        };

        // Start animation with a slight delay for stagger effect
        setTimeout(updateValue, 100);
    });
}

// ===========================
// CHARTS
// ===========================
function initializeCharts() {
    // Circulation Chart
    const circulationCtx = document.getElementById('circulationChart');
    if (circulationCtx) {
        new Chart(circulationCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Books Issued',
                    data: [65, 78, 90, 81, 96, 105, 112],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Books Returned',
                    data: [60, 75, 85, 78, 92, 100, 108],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#a0aec0'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: { color: '#a0aec0' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#a0aec0' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Fiction', 'Science', 'Technology', 'History', 'Non-Fiction'],
                datasets: [{
                    data: [30, 20, 25, 15, 10],
                    backgroundColor: [
                        '#6366f1',
                        '#8b5cf6',
                        '#ec4899',
                        '#10b981',
                        '#f59e0b'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#a0aec0',
                            padding: 15
                        }
                    }
                }
            }
        });
    }
}

// ===========================
// UTILITY FUNCTIONS
// ===========================
function getActivityIcon(type) {
    const icons = {
        issue: 'hand-holding-medical',
        return: 'undo',
        add: 'plus-circle'
    };
    return icons[type] || 'circle';
}

function getBookGradient(category) {
    const gradients = {
        fiction: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        science: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        technology: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        history: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'non-fiction': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    };
    return gradients[category] || gradients.fiction;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        padding: 1rem 1.5rem;
        color: var(--text-primary);
        box-shadow: var(--card-shadow);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}" 
               style="color: ${type === 'success' ? 'var(--success-color)' : 'var(--info-color)'}; font-size: 1.5rem;"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function generateReport() {
    const reportData = {
        totalBooks: AppState.books.length,
        totalMembers: AppState.members.length,
        booksIssued: AppState.books.filter(b => b.status === 'issued').length,
        booksAvailable: AppState.books.filter(b => b.status === 'available').length,
        activeMembers: AppState.members.filter(m => m.status === 'active').length
    };

    console.log('📊 Library Report:', reportData);
    showNotification('Report generated successfully! Check console for details.', 'success');
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
