// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const currentDate = document.getElementById('currentDate');
    const eventSearch = document.getElementById('eventSearch');
    const addEventBtn = document.getElementById('addEventBtn');
    const exportEventsBtn = document.getElementById('exportEventsBtn');
    const bulkActionsBtn = document.getElementById('bulkActionsBtn');
    const notificationBtn = document.getElementById('notificationBtn');
    const closeNotifications = document.getElementById('closeNotifications');
    const notificationPanel = document.querySelector('.notification-panel');
    
    // Filter elements
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    // Bulk action elements
    const selectAllRows = document.getElementById('selectAllRows');
    const selectAllEvents = document.getElementById('selectAllEvents');
    const eventSelectCheckboxes = document.querySelectorAll('.event-select');
    const applyBulkAction = document.getElementById('applyBulkAction');
    
    // Modal elements
    const addEventModal = document.getElementById('addEventModal');
    const closeEventModal = document.getElementById('closeEventModal');
    const cancelEventBtn = document.getElementById('cancelEventBtn');
    const eventForm = document.getElementById('eventForm');
    
    const bulkActionsModal = document.getElementById('bulkActionsModal');
    const closeBulkModal = document.getElementById('closeBulkModal');
    const bulkActionBtns = document.querySelectorAll('.bulk-action-btn');
    const selectedCount = document.getElementById('selectedCount');
    
    // Quick action buttons
    const quickActionButtons = document.querySelectorAll('.action-card');
    const bulkApproveBtn = document.getElementById('bulkApproveBtn');
    const scheduleEventsBtn = document.getElementById('scheduleEventsBtn');
    const sendNotificationsBtn = document.getElementById('sendNotificationsBtn');
    const generateReportBtn = document.getElementById('generateReportBtn');
    
    // Table action buttons
    const viewButtons = document.querySelectorAll('.action-icon.view');
    const editButtons = document.querySelectorAll('.action-icon.edit');
    const pauseButtons = document.querySelectorAll('.action-icon.pause');
    const approveButtons = document.querySelectorAll('.action-icon.approve');
    const analyticsButtons = document.querySelectorAll('.action-icon.analytics');
    const restoreButtons = document.querySelectorAll('.action-icon.restore');
    const dropdownItems = document.querySelectorAll('.dropdown-menu a');
    
    // Notification elements
    const markAllReadBtn = document.querySelector('.mark-all-read');
    const viewAllNotificationsBtn = document.querySelector('.view-all-notifications');
    
    // View buttons
    const viewAllActivitiesBtn = document.querySelector('.view-all-btn');
    
    // State
    let selectedEvents = new Set();
    let eventsData = [
        {
            id: 'EVT-001',
            name: 'Tech Summit 2024',
            category: 'tech',
            status: 'active',
            date: '2024-04-15',
            attendees: 850,
            revenue: 15240,
            capacity: 85
        },
        {
            id: 'EVT-002',
            name: 'Summer Music Festival',
            category: 'music',
            status: 'upcoming',
            date: '2024-06-22',
            attendees: 1250,
            revenue: 12850,
            capacity: 95
        },
        {
            id: 'EVT-003',
            name: 'Startup Conference',
            category: 'business',
            status: 'completed',
            date: '2024-03-10',
            attendees: 420,
            revenue: 9420,
            capacity: 70
        },
        {
            id: 'EVT-004',
            name: 'Modern Art Exhibition',
            category: 'arts',
            status: 'pending',
            date: '2024-05-05',
            attendees: 320,
            revenue: 8150,
            capacity: 64
        },
        {
            id: 'EVT-005',
            name: 'Digital Marketing Workshop',
            category: 'education',
            status: 'active',
            date: '2024-04-30',
            attendees: 180,
            revenue: 7890,
            capacity: 90
        },
        {
            id: 'EVT-006',
            name: 'Charity Football Match',
            category: 'sports',
            status: 'cancelled',
            date: '2024-07-15',
            attendees: 550,
            revenue: 6500,
            capacity: 55
        }
    ];
    
    // Initialize events page
    function initEventsPage() {
        // Update date display
        updateDateDisplay();
        
        // Setup event listeners
        setupEventListeners();
        
        // Update notification count
        updateNotificationCount();
        
        // Update date every minute
        setInterval(updateDateDisplay, 60000);
        
        // Initialize table functionality
        initTableFunctionality();
        
        // Initialize filters
        initFilters();
    }
    
    // Update date display
    function updateDateDisplay() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        currentDate.textContent = now.toLocaleDateString('en-US', options) + ' • ' + now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});
    }
    
    // Update notification count
    function updateNotificationCount() {
        const unreadCount = 3; // Hardcoded for now
        const notificationCount = document.querySelector('.notification-count');
        if (notificationCount) {
            notificationCount.textContent = unreadCount;
            notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }
    
    // Initialize table functionality
    function initTableFunctionality() {
        // Select all checkboxes
        if (selectAllRows) {
            selectAllRows.addEventListener('change', function() {
                const isChecked = this.checked;
                eventSelectCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                    updateEventSelection(checkbox);
                });
                
                updateBulkSelectionInfo();
                
                if (isChecked) {
                    showToast('All events on this page selected');
                }
            });
        }
        
        if (selectAllEvents) {
            selectAllEvents.addEventListener('change', function() {
                const isChecked = this.checked;
                eventSelectCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                    updateEventSelection(checkbox);
                });
                
                updateBulkSelectionInfo();
                
                if (isChecked) {
                    showToast('All events selected');
                }
            });
        }
        
        // Individual event checkbox
        eventSelectCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateEventSelection(this);
                updateBulkSelectionInfo();
                updateSelectAllStates();
            });
        });
        
        // Table row click
        document.querySelectorAll('.events-table tbody tr').forEach((row, index) => {
            row.addEventListener('click', function(e) {
                // Don't trigger if clicking on checkbox or action button
                if (!e.target.closest('input[type="checkbox"]') && !e.target.closest('.action-icon') && !e.target.closest('.dropdown-menu')) {
                    const eventName = this.querySelector('h4').textContent;
                    showToast(`Viewing details for "${eventName}"`, 'info');
                }
            });
        });
    }
    
    // Initialize filters
    function initFilters() {
        // Filter change events
        const filters = [categoryFilter, statusFilter, dateFilter, sortFilter];
        filters.forEach(filter => {
            if (filter) {
                filter.addEventListener('change', function() {
                    applyFilters();
                });
            }
        });
    }
    
    // Update event selection
    function updateEventSelection(checkbox) {
        const eventId = checkbox.closest('tr').querySelector('.event-info h4').textContent;
        
        if (checkbox.checked) {
            selectedEvents.add(eventId);
        } else {
            selectedEvents.delete(eventId);
        }
    }
    
    // Update bulk selection info
    function updateBulkSelectionInfo() {
        const count = selectedEvents.size;
        selectedCount.textContent = count;
        
        if (applyBulkAction) {
            applyBulkAction.disabled = count === 0;
            applyBulkAction.style.opacity = count === 0 ? '0.5' : '1';
            applyBulkAction.style.cursor = count === 0 ? 'not-allowed' : 'pointer';
        }
    }
    
    // Update select all states
    function updateSelectAllStates() {
        if (!selectAllRows || !selectAllEvents) return;
        
        const totalCheckboxes = eventSelectCheckboxes.length;
        const checkedCount = document.querySelectorAll('.event-select:checked').length;
        
        // Update select all rows
        if (checkedCount === 0) {
            selectAllRows.checked = false;
            selectAllRows.indeterminate = false;
        } else if (checkedCount === totalCheckboxes) {
            selectAllRows.checked = true;
            selectAllRows.indeterminate = false;
        } else {
            selectAllRows.checked = false;
            selectAllRows.indeterminate = true;
        }
        
        // Update select all events
        selectAllEvents.checked = checkedCount === totalCheckboxes;
        selectAllEvents.indeterminate = checkedCount > 0 && checkedCount < totalCheckboxes;
    }
    
    // Apply filters
    function applyFilters() {
        const category = categoryFilter.value;
        const status = statusFilter.value;
        const dateRange = dateFilter.value;
        const sortBy = sortFilter.value;
        
        // In a real app, you would filter the data and update the table
        console.log('Applying filters:', { category, status, dateRange, sortBy });
        
        showToast(`Filtering events by ${category !== 'all' ? category + ' ' : ''}${status !== 'all' ? status + ' ' : ''}${dateRange !== 'all' ? dateRange + ' ' : ''}events`, 'info');
    }
    
    // Show toast notification
    function showToast(message, type = 'success') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        
        let icon = 'check-circle';
        let bgColor = 'var(--success-color)';
        
        switch(type) {
            case 'error':
                icon = 'exclamation-circle';
                bgColor = 'var(--danger-color)';
                break;
            case 'warning':
                icon = 'exclamation-triangle';
                bgColor = 'var(--warning-color)';
                break;
            case 'info':
                icon = 'info-circle';
                bgColor = 'var(--info-color)';
                break;
        }
        
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: toastSlideIn 0.3s ease forwards;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
        
        // Add animation keyframes if not already added
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes toastSlideIn {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes toastSlideOut {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Mobile menu toggle
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !mobileMenuToggle.contains(e.target) && 
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
        
        // Add event button
        addEventBtn.addEventListener('click', function() {
            addEventModal.classList.add('active');
        });
        
        // Export events button
        exportEventsBtn.addEventListener('click', function() {
            if (selectedEvents.size > 0) {
                showToast(`Exporting ${selectedEvents.size} selected events...`, 'info');
            } else {
                showToast('Exporting all events...', 'info');
            }
        });
        
        // Bulk actions button
        bulkActionsBtn.addEventListener('click', function() {
            if (selectedEvents.size > 0) {
                bulkActionsModal.classList.add('active');
            } else {
                showToast('Please select events to perform bulk actions', 'warning');
            }
        });
        
        // Apply bulk action button
        applyBulkAction.addEventListener('click', function() {
            if (selectedEvents.size > 0) {
                bulkActionsModal.classList.add('active');
            } else {
                showToast('Please select events first', 'warning');
            }
        });
        
        // Notification button
        notificationBtn.addEventListener('click', function() {
            notificationPanel.classList.add('active');
        });
        
        closeNotifications.addEventListener('click', function() {
            notificationPanel.classList.remove('active');
        });
        
        // Event search
        eventSearch.addEventListener('input', function() {
            if (this.value.length > 2) {
                // In a real app, you would filter the table here
                console.log('Searching events for:', this.value);
            }
        });
        
        eventSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                showToast(`Searching for "${this.value}"...`, 'info');
            }
        });
        
        // Quick action buttons
        quickActionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const actionName = this.querySelector('h4').textContent;
                showToast(`${actionName} clicked - Feature coming soon!`, 'info');
            });
        });
        
        // Bulk approve
        bulkApproveBtn.addEventListener('click', function() {
            if (selectedEvents.size > 0) {
                if (confirm(`Approve ${selectedEvents.size} selected events?`)) {
                    showToast(`Approving ${selectedEvents.size} events...`, 'info');
                    // In real app, you would make API call here
                }
            } else {
                showToast('Please select events to approve', 'warning');
            }
        });
        
        // Schedule events
        scheduleEventsBtn.addEventListener('click', function() {
            showToast('Opening event scheduler...', 'info');
        });
        
        // Send notifications
        sendNotificationsBtn.addEventListener('click', function() {
            showToast('Opening notification composer...', 'info');
        });
        
        // Generate report
        generateReportBtn.addEventListener('click', function() {
            showToast('Generating event report...', 'info');
        });
        
        // View all activities
        if (viewAllActivitiesBtn) {
            viewAllActivitiesBtn.addEventListener('click', function() {
                showToast('Opening all activities...', 'info');
            });
        }
        
        // Mark all notifications as read
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', function() {
                document.querySelectorAll('.notification-item.unread').forEach(item => {
                    item.classList.remove('unread');
                });
                showToast('All notifications marked as read');
                updateNotificationCount();
            });
        }
        
        // View all notifications
        if (viewAllNotificationsBtn) {
            viewAllNotificationsBtn.addEventListener('click', function() {
                showToast('Opening all notifications...', 'info');
            });
        }
        
        // Add event modal
        closeEventModal.addEventListener('click', function() {
            addEventModal.classList.remove('active');
            eventForm.reset();
        });
        
        cancelEventBtn.addEventListener('click', function() {
            addEventModal.classList.remove('active');
            eventForm.reset();
        });
        
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const eventTitle = document.getElementById('eventTitle').value;
            const eventCategory = document.getElementById('eventCategory').value;
            const eventDate = document.getElementById('eventDate').value;
            
            // In a real app, you would send the data to the server
            console.log('Creating new event:', { eventTitle, eventCategory, eventDate });
            
            addEventModal.classList.remove('active');
            eventForm.reset();
            
            showToast(`Event "${eventTitle}" created successfully!`);
            
            // Simulate adding to table
            setTimeout(() => {
                // In real app, you would refresh the table or add the new row
                showToast('Event added to the list', 'info');
            }, 1000);
        });
        
        // Bulk actions modal
        closeBulkModal.addEventListener('click', function() {
            bulkActionsModal.classList.remove('active');
        });
        
        bulkActionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.dataset.action;
                const count = selectedEvents.size;
                
                let actionText = '';
                switch(action) {
                    case 'approve':
                        actionText = 'approve';
                        break;
                    case 'pause':
                        actionText = 'pause';
                        break;
                    case 'cancel':
                        actionText = 'cancel';
                        break;
                    case 'delete':
                        actionText = 'delete';
                        break;
                    case 'export':
                        actionText = 'export';
                        break;
                    case 'notify':
                        actionText = 'notify attendees of';
                        break;
                }
                
                if (confirm(`${action === 'delete' ? 'Are you sure you want to permanently delete' : `Do you want to ${actionText}`} ${count} selected event${count > 1 ? 's' : ''}?`)) {
                    bulkActionsModal.classList.remove('active');
                    showToast(`${action === 'delete' ? 'Deleting' : action === 'approve' ? 'Approving' : action === 'pause' ? 'Pausing' : action === 'cancel' ? 'Cancelling' : action === 'export' ? 'Exporting' : 'Notifying'} ${count} event${count > 1 ? 's' : ''}...`, 'info');
                    
                    // Simulate API call
                    setTimeout(() => {
                        if (action === 'delete') {
                            // Remove selected rows from table
                            document.querySelectorAll('.event-select:checked').forEach(checkbox => {
                                const row = checkbox.closest('tr');
                                row.style.opacity = '0.5';
                                row.style.pointerEvents = 'none';
                                
                                setTimeout(() => {
                                    row.remove();
                                }, 300);
                            });
                            
                            // Clear selection
                            selectedEvents.clear();
                            updateBulkSelectionInfo();
                            updateSelectAllStates();
                        }
                        
                        showToast(`${action === 'delete' ? 'Deleted' : action === 'approve' ? 'Approved' : action === 'pause' ? 'Paused' : action === 'cancel' ? 'Cancelled' : action === 'export' ? 'Exported' : 'Notified'} ${count} event${count > 1 ? 's' : ''} successfully!`);
                    }, 1500);
                }
            });
        });
        
        // Table action buttons
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const eventName = row.querySelector('h4').textContent;
                showToast(`Viewing details for "${eventName}"`, 'info');
            });
        });
        
        editButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const eventName = row.querySelector('h4').textContent;
                showToast(`Editing "${eventName}"`, 'info');
            });
        });
        
        pauseButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const eventName = row.querySelector('h4').textContent;
                const statusBadge = row.querySelector('.status-badge');
                
                if (confirm(`Pause event "${eventName}"?`)) {
                    statusBadge.textContent = 'Paused';
                    statusBadge.className = 'status-badge pending';
                    showToast(`"${eventName}" paused`, 'warning');
                }
            });
        });
        
        approveButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const eventName = row.querySelector('h4').textContent;
                const statusBadge = row.querySelector('.status-badge');
                
                statusBadge.textContent = 'Active';
                statusBadge.className = 'status-badge active';
                showToast(`"${eventName}" approved`, 'success');
            });
        });
        
        analyticsButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const eventName = row.querySelector('h4').textContent;
                showToast(`Opening analytics for "${eventName}"`, 'info');
            });
        });
        
        restoreButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const eventName = row.querySelector('h4').textContent;
                const statusBadge = row.querySelector('.status-badge');
                
                statusBadge.textContent = 'Active';
                statusBadge.className = 'status-badge active';
                showToast(`"${eventName}" restored`, 'success');
            });
        });
        
        // Dropdown menu items
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.querySelector('i').className;
                const row = this.closest('tr');
                const eventName = row.querySelector('h4').textContent;
                
                let actionText = '';
                if (action.includes('chart-line')) actionText = 'View analytics for';
                else if (action.includes('users')) actionText = 'View attendees for';
                else if (action.includes('ticket-alt')) actionText = 'View tickets for';
                else if (action.includes('copy')) actionText = 'Duplicate';
                else if (action.includes('trash')) {
                    if (confirm(`Delete event "${eventName}" permanently?`)) {
                        row.style.opacity = '0.5';
                        row.style.pointerEvents = 'none';
                        
                        setTimeout(() => {
                            row.remove();
                            showToast(`"${eventName}" deleted`, 'error');
                        }, 300);
                    }
                    return;
                }
                
                if (actionText) {
                    showToast(`${actionText} "${eventName}"`, 'info');
                }
            });
        });
        
        // Pagination buttons
        document.querySelectorAll('.pagination-btn:not(:disabled), .page-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (!this.disabled && !this.classList.contains('active')) {
                    showToast('Loading more events...', 'info');
                }
            });
        });
        
        // Quick switch link
        document.querySelector('.quick-switch').addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Switch to Organizer View? You will be redirected to the organizer dashboard.')) {
                showToast('Switching to organizer view...', 'info');
                // In real app, redirect to organizer dashboard
                // window.location.href = 'org-dashboard.html';
            }
        });
        
        // Modal close on outside click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
                if (e.target.id === 'addEventModal') {
                    eventForm.reset();
                }
            }
        });
        
        // Escape key to close modals and panels
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                addEventModal.classList.remove('active');
                bulkActionsModal.classList.remove('active');
                notificationPanel.classList.remove('active');
                eventForm.reset();
            }
        });
    }
    
    // Initialize the events page
    initEventsPage();
});