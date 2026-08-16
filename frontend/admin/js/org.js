// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const currentDate = document.getElementById('currentDate');
    const organizerSearch = document.getElementById('organizerSearch');
    const addOrganizerBtn = document.getElementById('addOrganizerBtn');
    const exportBtn = document.getElementById('exportBtn');
    const notificationBtn = document.getElementById('notificationBtn');
    const closeNotifications = document.getElementById('closeNotifications');
    const notificationPanel = document.querySelector('.notification-panel');
    
    // Filter elements
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    const organizerStatFilter = document.getElementById('organizerStatFilter');
    
    // Modal elements
    const addOrganizerModal = document.getElementById('addOrganizerModal');
    const closeOrganizerModal = document.getElementById('closeOrganizerModal');
    const cancelOrganizerBtn = document.getElementById('cancelOrganizerBtn');
    const organizerForm = document.getElementById('organizerForm');
    
    // Quick action buttons
    const quickActionButtons = document.querySelectorAll('.action-card');
    const bulkVerifyBtn = document.getElementById('bulkVerifyBtn');
    const sendNotificationBtn = document.getElementById('sendNotificationBtn');
    const performanceReportBtn = document.getElementById('performanceReportBtn');
    const trainingMaterialBtn = document.getElementById('trainingMaterialBtn');
    
    // Table elements
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('.row-select');
    const tableActions = document.querySelectorAll('.action-icon');
    const approveBtns = document.querySelectorAll('.approve-btn');
    const rejectBtns = document.querySelectorAll('.reject-btn');
    
    // View buttons
    const viewAllPendingBtn = document.querySelector('.view-all-pending-btn');
    
    // Notification elements
    const markAllReadBtn = document.querySelector('.mark-all-read');
    const viewAllNotificationsBtn = document.querySelector('.view-all-notifications');
    
    // Initialize organizers page
    function initOrganizersPage() {
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
        // Select all checkbox
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', function() {
                const isChecked = this.checked;
                rowCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                });
                
                if (isChecked) {
                    showToast('All organizers selected');
                }
            });
        }
        
        // Individual row checkbox
        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateSelectAllState();
            });
        });
        
        // Table row click
        document.querySelectorAll('.organizers-table tbody tr').forEach(row => {
            row.addEventListener('click', function(e) {
                // Don't trigger if clicking on checkbox or action button
                if (!e.target.closest('input[type="checkbox"]') && !e.target.closest('.action-icon')) {
                    const organizerName = this.querySelector('h4').textContent;
                    showToast(`Viewing details for ${organizerName}`, 'info');
                }
            });
        });
    }
    
    // Update select all checkbox state
    function updateSelectAllState() {
        if (!selectAllCheckbox) return;
        
        const totalCheckboxes = rowCheckboxes.length;
        const checkedCount = document.querySelectorAll('.row-select:checked').length;
        
        if (checkedCount === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (checkedCount === totalCheckboxes) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
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
        
        // Add organizer button
        addOrganizerBtn.addEventListener('click', function() {
            addOrganizerModal.classList.add('active');
        });
        
        // Export button
        exportBtn.addEventListener('click', function() {
            const selectedCount = document.querySelectorAll('.row-select:checked').length;
            if (selectedCount > 0) {
                showToast(`Exporting ${selectedCount} selected organizers...`, 'info');
            } else {
                showToast('Exporting all organizers...', 'info');
            }
        });
        
        // Notification button
        notificationBtn.addEventListener('click', function() {
            notificationPanel.classList.add('active');
        });
        
        closeNotifications.addEventListener('click', function() {
            notificationPanel.classList.remove('active');
        });
        
        // Organizer search
        organizerSearch.addEventListener('input', function() {
            if (this.value.length > 2) {
                // In a real app, you would filter the table here
                console.log('Searching organizers for:', this.value);
            }
        });
        
        organizerSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                showToast(`Searching for "${this.value}"...`, 'info');
            }
        });
        
        // Filter changes
        statusFilter.addEventListener('change', function() {
            showToast(`Filtering organizers by status: ${this.value}`, 'info');
        });
        
        sortFilter.addEventListener('change', function() {
            showToast(`Sorting organizers by: ${this.value}`, 'info');
        });
        
        organizerStatFilter.addEventListener('change', function() {
            showToast(`Showing organizer statistics by ${this.value}`, 'info');
        });
        
        // Quick action buttons
        quickActionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const actionName = this.querySelector('h4').textContent;
                showToast(`${actionName} clicked - Feature coming soon!`, 'info');
            });
        });
        
        // Bulk verify
        bulkVerifyBtn.addEventListener('click', function() {
            const selectedCount = document.querySelectorAll('.row-select:checked').length;
            if (selectedCount > 0) {
                if (confirm(`Verify ${selectedCount} selected organizers?`)) {
                    showToast(`Verifying ${selectedCount} organizers...`, 'info');
                    // In real app, you would make API call here
                }
            } else {
                showToast('Please select organizers to verify', 'warning');
            }
        });
        
        // Send notification
        sendNotificationBtn.addEventListener('click', function() {
            showToast('Opening notification composer...', 'info');
        });
        
        // Performance report
        performanceReportBtn.addEventListener('click', function() {
            showToast('Generating performance report...', 'info');
        });
        
        // Training materials
        trainingMaterialBtn.addEventListener('click', function() {
            showToast('Opening training materials...', 'info');
        });
        
        // View all pending
        viewAllPendingBtn.addEventListener('click', function() {
            showToast('Opening all pending verifications...', 'info');
        });
        
        // Mark all notifications as read
        markAllReadBtn.addEventListener('click', function() {
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
            });
            showToast('All notifications marked as read');
        });
        
        // View all notifications
        viewAllNotificationsBtn.addEventListener('click', function() {
            showToast('Opening all notifications...', 'info');
        });
        
        // Add organizer modal
        closeOrganizerModal.addEventListener('click', function() {
            addOrganizerModal.classList.remove('active');
            organizerForm.reset();
        });
        
        cancelOrganizerBtn.addEventListener('click', function() {
            addOrganizerModal.classList.remove('active');
            organizerForm.reset();
        });
        
        organizerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const organizerName = document.getElementById('organizerName').value;
            const organizerEmail = document.getElementById('organizerEmail').value;
            const organizerType = document.getElementById('organizerType').value;
            
            // In a real app, you would send the data to the server
            console.log('Creating new organizer:', { organizerName, organizerEmail, organizerType });
            
            addOrganizerModal.classList.remove('active');
            organizerForm.reset();
            
            showToast(`Organizer "${organizerName}" created successfully!`);
            
            // Simulate adding to table
            setTimeout(() => {
                // In real app, you would refresh the table or add the new row
                showToast('Organizer added to the list', 'info');
            }, 1000);
        });
        
        // Table action buttons
        tableActions.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.classList[1];
                const row = this.closest('tr');
                const organizerName = row.querySelector('h4').textContent;
                
                switch(action) {
                    case 'view':
                        showToast(`Viewing details for ${organizerName}`, 'info');
                        break;
                    case 'edit':
                        showToast(`Editing ${organizerName}`, 'info');
                        break;
                    case 'suspend':
                        if (confirm(`Suspend organizer ${organizerName}?`)) {
                            row.style.opacity = '0.5';
                            setTimeout(() => {
                                row.querySelector('.status-badge').textContent = 'Suspended';
                                row.querySelector('.status-badge').className = 'status-badge suspended';
                                row.style.opacity = '1';
                                showToast(`${organizerName} suspended`, 'warning');
                            }, 300);
                        }
                        break;
                    case 'verify':
                        row.style.opacity = '0.5';
                        setTimeout(() => {
                            row.querySelector('.status-badge').textContent = 'Verified';
                            row.querySelector('.status-badge').className = 'status-badge verified';
                            row.style.opacity = '1';
                            showToast(`${organizerName} verified`, 'success');
                        }, 300);
                        break;
                    case 'reject':
                        if (confirm(`Reject organizer ${organizerName}?`)) {
                            row.style.opacity = '0.5';
                            row.style.pointerEvents = 'none';
                            setTimeout(() => {
                                row.remove();
                                showToast(`${organizerName} rejected`, 'error');
                                updatePendingCount();
                            }, 300);
                        }
                        break;
                    case 'activate':
                        row.style.opacity = '0.5';
                        setTimeout(() => {
                            row.querySelector('.status-badge').textContent = 'Verified';
                            row.querySelector('.status-badge').className = 'status-badge verified';
                            row.style.opacity = '1';
                            showToast(`${organizerName} activated`, 'success');
                        }, 300);
                        break;
                    case 'delete':
                        if (confirm(`Delete organizer ${organizerName} permanently?`)) {
                            row.style.opacity = '0.5';
                            row.style.pointerEvents = 'none';
                            setTimeout(() => {
                                row.remove();
                                showToast(`${organizerName} deleted`, 'error');
                            }, 300);
                        }
                        break;
                }
            });
        });
        
        // Approval buttons (in pending verifications section)
        approveBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const item = this.closest('.approval-item');
                const itemName = item.querySelector('h4').textContent;
                item.style.opacity = '0.5';
                item.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    item.remove();
                    showToast(`"${itemName}" verified successfully!`);
                    updatePendingCount();
                }, 300);
            });
        });
        
        rejectBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const item = this.closest('.approval-item');
                const itemName = item.querySelector('h4').textContent;
                
                if (confirm(`Are you sure you want to reject "${itemName}"?`)) {
                    item.style.opacity = '0.5';
                    item.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        item.remove();
                        showToast(`"${itemName}" rejected`, 'warning');
                        updatePendingCount();
                    }, 300);
                }
            });
        });
        
        // Quick switch link
        document.querySelector('.quick-switch').addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Switch to Organizer View? You will be redirected to the organizer dashboard.')) {
                showToast('Switching to organizer view...', 'info');
                // In real app, redirect to organizer dashboard
                // window.location.href = '../../index.html';
            }
        });
        
        // Modal close on outside click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
                if (e.target.id === 'addOrganizerModal') {
                    organizerForm.reset();
                }
            }
        });
        
        // Escape key to close modals and panels
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                addOrganizerModal.classList.remove('active');
                notificationPanel.classList.remove('active');
                organizerForm.reset();
            }
        });
    }
    
    // Update pending count
    function updatePendingCount() {
        const pendingItems = document.querySelectorAll('.approval-item').length;
        const pendingCount = document.querySelector('.pending-count');
        if (pendingCount) {
            pendingCount.textContent = `${pendingItems} items`;
        }
        
        // Also update the stats card
        const pendingCard = document.querySelector('.stat-card:nth-child(3) h3');
        if (pendingCard) {
            pendingCard.textContent = pendingItems;
        }
    }
    
    // Initialize the organizers page
    initOrganizersPage();
});