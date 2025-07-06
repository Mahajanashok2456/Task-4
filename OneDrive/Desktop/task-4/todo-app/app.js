// TaskMaster Todo App - Main JavaScript File

class TaskMaster {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.editingTaskId = null;
        
        this.init();
    }

    init() {
        this.loadTasks();
        this.setupEventListeners();
        this.renderTasks();
        this.updateStats();
        this.loadTheme();
    }

    // LocalStorage Operations
    saveTasks() {
        localStorage.setItem('taskmaster_tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('taskmaster_tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
    }

    // Theme Management
    loadTheme() {
        const savedTheme = localStorage.getItem('taskmaster_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('taskmaster_theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Task CRUD Operations
    addTask(title, category = 'personal', dueDate = null) {
        const task = {
            id: Date.now().toString(),
            title: title.trim(),
            category,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.showToast('Task added successfully!', 'success');
        
        return task;
    }

    updateTask(id, updates) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = {
                ...this.tasks[taskIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showToast('Task updated successfully!', 'success');
            return true;
        }
        return false;
    }

    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showToast('Task deleted successfully!', 'success');
            return true;
        }
        return false;
    }

    toggleTaskComplete(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            task.updatedAt = new Date().toISOString();
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            
            const message = task.completed ? 'Task completed!' : 'Task marked as pending';
            this.showToast(message, 'success');
        }
    }

    clearAllTasks() {
        this.tasks = [];
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.showToast('All tasks cleared!', 'success');
    }

    // Filtering and Searching
    filterTasks(filter) {
        this.currentFilter = filter;
        this.renderTasks();
        this.updateFilterButtons();
    }

    searchTasks(query) {
        this.searchQuery = query.toLowerCase();
        this.renderTasks();
    }

    getFilteredTasks() {
        let filteredTasks = [...this.tasks];

        // Apply search filter
        if (this.searchQuery) {
            filteredTasks = filteredTasks.filter(task =>
                task.title.toLowerCase().includes(this.searchQuery) ||
                task.category.toLowerCase().includes(this.searchQuery)
            );
        }

        // Apply status filter
        switch (this.currentFilter) {
            case 'active':
                filteredTasks = filteredTasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = filteredTasks.filter(task => task.completed);
                break;
            case 'all':
            default:
                break;
        }

        return filteredTasks;
    }

    // Rendering
    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        const loadingState = document.getElementById('loadingState');

        // Hide loading state
        if (loadingState) {
            loadingState.style.display = 'none';
        }

        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '';
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }

        if (emptyState) {
            emptyState.style.display = 'none';
        }

        tasksList.innerHTML = '';
        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            tasksList.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const template = document.getElementById('taskTemplate');
        const taskElement = template.content.cloneNode(true);
        const taskItem = taskElement.querySelector('.task-item');

        // Set task data
        taskItem.setAttribute('data-id', task.id);
        if (task.completed) {
            taskItem.classList.add('completed');
        }

        // Set task content
        const titleElement = taskItem.querySelector('.task-title');
        const categoryElement = taskItem.querySelector('.task-category');
        const dateElement = taskItem.querySelector('.task-date');
        const checkbox = taskItem.querySelector('.task-checkbox-input');

        titleElement.textContent = task.title;
        categoryElement.textContent = task.category;
        checkbox.checked = task.completed;

        // Format and display date
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            const now = new Date();
            const isOverdue = dueDate < now && !task.completed;
            
            dateElement.innerHTML = `
                <i class="fas fa-calendar"></i>
                <span class="${isOverdue ? 'overdue' : ''}">${this.formatDate(dueDate)}</span>
            `;
        } else {
            dateElement.innerHTML = '<i class="fas fa-calendar"></i> <span>No due date</span>';
        }

        // Add event listeners
        this.addTaskEventListeners(taskItem, task);

        return taskElement;
    }

    addTaskEventListeners(taskItem, task) {
        const checkbox = taskItem.querySelector('.task-checkbox-input');
        const editBtn = taskItem.querySelector('.edit-btn');
        const deleteBtn = taskItem.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => {
            this.toggleTaskComplete(task.id);
        });

        editBtn.addEventListener('click', () => {
            this.openEditModal(task);
        });

        deleteBtn.addEventListener('click', () => {
            this.confirmDelete(task);
        });
    }

    // Modal Operations
    openEditModal(task) {
        this.editingTaskId = task.id;
        const modal = document.getElementById('editModal');
        const titleInput = document.getElementById('editTaskTitle');
        const categorySelect = document.getElementById('editTaskCategory');
        const dueDateInput = document.getElementById('editTaskDueDate');

        titleInput.value = task.title;
        categorySelect.value = task.category;
        dueDateInput.value = task.dueDate ? task.dueDate.slice(0, 16) : '';

        modal.style.display = 'flex';
    }

    closeEditModal() {
        const modal = document.getElementById('editModal');
        modal.style.display = 'none';
        this.editingTaskId = null;
    }

    confirmDelete(task) {
        const modal = document.getElementById('confirmModal');
        const message = document.getElementById('confirmMessage');
        
        message.textContent = `Are you sure you want to delete "${task.title}"?`;
        modal.style.display = 'flex';

        const confirmBtn = document.getElementById('confirmAction');
        confirmBtn.onclick = () => {
            this.deleteTask(task.id);
            this.closeConfirmModal();
        };
    }

    closeConfirmModal() {
        const modal = document.getElementById('confirmModal');
        modal.style.display = 'none';
    }

    // Statistics
    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('completionRate').textContent = `${completionRate}%`;

        // Update filter counts
        document.getElementById('allCount').textContent = totalTasks;
        document.getElementById('activeCount').textContent = pendingTasks;
        document.getElementById('completedCount').textContent = completedTasks;
    }

    updateFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === this.currentFilter) {
                btn.classList.add('active');
            }
        });
    }

    // Utility Functions
    formatDate(date) {
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `Overdue (${Math.abs(diffDays)} days ago)`;
        } else if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Tomorrow';
        } else if (diffDays <= 7) {
            return `In ${diffDays} days`;
        } else {
            return date.toLocaleDateString();
        }
    }

    showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <div class="toast-content">
                <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);

        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Add task form
        const addTaskForm = document.getElementById('addTaskForm');
        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('taskInput');
            const categorySelect = document.getElementById('taskCategory');
            const dueDateInput = document.getElementById('taskDueDate');

            const title = titleInput.value.trim();
            if (title) {
                this.addTask(title, categorySelect.value, dueDateInput.value || null);
                addTaskForm.reset();
                titleInput.focus();
            }
        });

        // Edit task form
        const editTaskForm = document.getElementById('editTaskForm');
        editTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('editTaskTitle');
            const categorySelect = document.getElementById('editTaskCategory');
            const dueDateInput = document.getElementById('editTaskDueDate');

            const title = titleInput.value.trim();
            if (title && this.editingTaskId) {
                this.updateTask(this.editingTaskId, {
                    title,
                    category: categorySelect.value,
                    dueDate: dueDateInput.value || null
                });
                this.closeEditModal();
            }
        });

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.filterTasks(filter);
            });
        });

        // Search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.searchTasks(e.target.value);
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Clear all button
        const clearAllBtn = document.getElementById('clearAllBtn');
        clearAllBtn.addEventListener('click', () => {
            if (this.tasks.length > 0) {
                const modal = document.getElementById('confirmModal');
                const message = document.getElementById('confirmMessage');
                
                message.textContent = 'Are you sure you want to clear all tasks? This action cannot be undone.';
                modal.style.display = 'flex';

                const confirmBtn = document.getElementById('confirmAction');
                confirmBtn.onclick = () => {
                    this.clearAllTasks();
                    this.closeConfirmModal();
                };
            }
        });

        // Modal close buttons
        const closeModalBtn = document.getElementById('closeModal');
        const closeConfirmModalBtn = document.getElementById('closeConfirmModal');
        const cancelEditBtn = document.getElementById('cancelEdit');
        const cancelConfirmBtn = document.getElementById('cancelConfirm');

        closeModalBtn.addEventListener('click', () => this.closeEditModal());
        closeConfirmModalBtn.addEventListener('click', () => this.closeConfirmModal());
        cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        cancelConfirmBtn.addEventListener('click', () => this.closeConfirmModal());

        // Close modals when clicking outside
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to add task
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const taskInput = document.getElementById('taskInput');
                if (document.activeElement === taskInput) {
                    addTaskForm.dispatchEvent(new Event('submit'));
                }
            }

            // Escape to close modals
            if (e.key === 'Escape') {
                const editModal = document.getElementById('editModal');
                const confirmModal = document.getElementById('confirmModal');
                
                if (editModal.style.display === 'flex') {
                    this.closeEditModal();
                }
                if (confirmModal.style.display === 'flex') {
                    this.closeConfirmModal();
                }
            }
        });

        // Auto-save due date to tomorrow if not set
        const dueDateInput = document.getElementById('taskDueDate');
        dueDateInput.addEventListener('focus', () => {
            if (!dueDateInput.value) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(9, 0, 0, 0);
                dueDateInput.value = tomorrow.toISOString().slice(0, 16);
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TaskMaster();
});

// Add some sample tasks for demonstration
function addSampleTasks() {
    const app = window.taskMaster;
    if (app && app.tasks.length === 0) {
        const sampleTasks = [
            { title: 'Complete project presentation', category: 'work', dueDate: new Date(Date.now() + 86400000).toISOString() },
            { title: 'Buy groceries', category: 'shopping', dueDate: new Date(Date.now() + 43200000).toISOString() },
            { title: 'Go for a run', category: 'health', dueDate: new Date(Date.now() + 21600000).toISOString() },
            { title: 'Read a book', category: 'personal', dueDate: null },
            { title: 'Call mom', category: 'personal', dueDate: new Date(Date.now() + 172800000).toISOString() }
        ];

        sampleTasks.forEach(task => {
            app.addTask(task.title, task.category, task.dueDate);
        });
    }
}

// Uncomment the line below to add sample tasks for demonstration
// setTimeout(addSampleTasks, 1000); 