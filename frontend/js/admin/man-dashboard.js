// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const currentDate = document.getElementById('currentDate');
    const refreshBtn = document.getElementById('refreshBtn');
    const systemAlertBtn = document.getElementById('systemAlertBtn');
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.querySelector('.notification-panel');
    const closeNotifications = document.getElementById('closeNotifications');
    const globalSearch = document.getElementById('globalSearch');
    
    // Quick action buttons
    const quickActionButtons = document.querySelectorAll('.action-card');
    
    // View buttons
    const viewAllActivities = document.getElementById('viewAllActivities');
    const viewAllPendingBtn = document.querySelector('.view-all-pending-btn');
    
    // Modal elements
    const systemAlertModal = document.getElementById('systemAlertModal');
    const systemAlertForm = document.getElementById('systemAlertForm');
    const closeAlertModal = document.getElementById('closeAlertModal');
    const cancelAlertBtn = document.getElementById('cancelAlertBtn');
    
    // Notification elements
    const markAllReadBtn = document.querySelector('.mark-all-read');
    const viewAllNotificationsBtn = document.querySelector('.view-all-notifications');
    
    // Filter elements
    const performanceFilter = document.getElementById('performanceFilter');
    const eventStatFilter = document.getElementById('eventStatFilter');
    
    // Approval buttons
    const approveBtns = document.querySelectorAll('.approve-btn');
    const rejectBtns = document.querySelectorAll('.reject-btn');
    
    // Alert action buttons
    const alertActionBtns = document.querySelectorAll('.alert-action');
    
    // State variables
    let notifications = [
        {
            id: 1,
            title: 'New Organizer Verification',
            message: 'Mike Chen requested organizer verification',
            time: '10 minutes ago',
            read: false,
            icon: 'user-check'
        },
        {
            id: 2,
            title: 'System Alert',
            message: 'High database load detected',
            time: '1 hour ago',
            read: false,
            icon: 'exclamation-triangle'
        },
        {
            id: 3,
            title: 'New Event Created',
            message: '"AI Conference 2024" submitted for review',
            time: '2 hours ago',
            read: true,
            icon: 'calendar-plus'
        },
        {
            id: 4,
            title: 'Large Transaction',
            message: '$5,000 payment received for Tech Summit',
            time: '5 hours ago',
            read: true,
            icon: 'credit-card'
        }
    ];
    
    // Initialize admin dashboard
    function initAdminDashboard() {
        // Update date display
        updateDateDisplay();
        
        // Setup event listeners
        setupEventListeners();
        
        // Update notification count
        updateNotificationCount();
        
        // Update date every minute
        setInterval(updateDateDisplay, 60000);
        
        // Simulate real-time updates
        simulateRealtimeUpdates();
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
        const unreadCount = notifications.filter(n => !n.read).length;
        const notificationCount = document.querySelector('.notification-count');
        if (notificationCount) {
            notificationCount.textContent = unreadCount;
            notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }
    
    // Mark all notifications as read
    function markAllNotificationsAsRead() {
        notifications.forEach(notification => {
            notification.read = true;
        });
        updateNotificationCount();
        
        // Update UI
        document.querySelectorAll('.notification-item.unread').forEach(item => {
            item.classList.remove('unread');
        });
        
        showToast('All notifications marked as read');
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
    
    // Simulate real-time updates
    function simulateRealtimeUpdates() {
        // Update stats every 30 seconds
        setInterval(() => {
            // Randomly update some stats
            const stats = document.querySelectorAll('.stat-content h3');
            stats.forEach(stat => {
                const currentValue = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
                if (!isNaN(currentValue)) {
                    const change = Math.floor(Math.random() * 10) - 2; // -2 to +7
                    const newValue = Math.max(1, currentValue + change);
                    stat.textContent = newValue.toLocaleString();
                }
            });
            
            // Update timestamp
            updateDateDisplay();
        }, 30000);
        
        // Add random notifications every 2 minutes
        setInterval(() => {
            const notificationTypes = [
                {
                    title: 'New User Registration',
                    message: 'A new user has registered on the platform',
                    icon: 'user-plus'
                },
                {
                    title: 'Event Created',
                    message: 'A new event has been created and needs review',
                    icon: 'calendar-plus'
                },
                {
                    title: 'Payment Processed',
                    message: 'A large payment has been successfully processed',
                    icon: 'credit-card'
                },
                {
                    title: 'System Update',
                    message: 'System maintenance completed successfully',
                    icon: 'sync-alt'
                }
            ];
            
            const randomNotif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
            const timeAgo = ['Just now', '2 minutes ago', '5 minutes ago'][Math.floor(Math.random() * 3)];
            
            // Add to notifications array
            notifications.unshift({
                id: notifications.length + 1,
                title: randomNotif.title,
                message: randomNotif.message,
                time: timeAgo,
                read: false,
                icon: randomNotif.icon
            });
            
            // Update notification count
            updateNotificationCount();
            
            // Show subtle notification if panel is not open
            if (!notificationPanel.classList.contains('active')) {
                showToast(`New notification: ${randomNotif.title}`, 'info');
            }
        }, 120000);
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
        
        // Refresh button
        refreshBtn.addEventListener('click', function() {
            showToast('Refreshing dashboard data...', 'info');
            
            // Simulate refresh
            setTimeout(() => {
                showToast('Dashboard refreshed successfully!');
            }, 1000);
        });
        
        // System alert button
        systemAlertBtn.addEventListener('click', function() {
            systemAlertModal.classList.add('active');
        });
        
        // Notification button
        notificationBtn.addEventListener('click', function() {
            notificationPanel.classList.add('active');
        });
        
        closeNotifications.addEventListener('click', function() {
            notificationPanel.classList.remove('active');
        });
        
        // Global search
        globalSearch.addEventListener('input', function() {
            if (this.value.length > 2) {
                // In a real app, you would search here
                console.log('Searching for:', this.value);
            }
        });
        
        globalSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                showToast(`Searching for "${this.value}"...`, 'info');
                this.value = '';
            }
        });
        
        // Quick action buttons
        quickActionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const actionName = this.querySelector('h4').textContent;
                showToast(`${actionName} clicked - Feature coming soon!`, 'info');
            });
        });
        
        // View all activities
        viewAllActivities.addEventListener('click', function() {
            showToast('Opening all activities...', 'info');
        });
        
        // View all pending
        viewAllPendingBtn.addEventListener('click', function() {
            showToast('Opening all pending items...', 'info');
        });
        
        // Mark all notifications as read
        markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
        
        // View all notifications
        viewAllNotificationsBtn.addEventListener('click', function() {
            showToast('Opening all notifications...', 'info');
        });
        
        // System alert modal
        closeAlertModal.addEventListener('click', function() {
            systemAlertModal.classList.remove('active');
            systemAlertForm.reset();
        });
        
        cancelAlertBtn.addEventListener('click', function() {
            systemAlertModal.classList.remove('active');
            systemAlertForm.reset();
        });
        
        systemAlertForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const alertType = document.getElementById('alertType').value;
            const alertTitle = document.getElementById('alertTitle').value;
            const alertMessage = document.getElementById('alertMessage').value;
            
            // In a real app, you would send the alert to the system
            console.log('Sending system alert:', { alertType, alertTitle, alertMessage });
            
            systemAlertModal.classList.remove('active');
            systemAlertForm.reset();
            
            showToast(`System alert "${alertTitle}" sent successfully!`);
        });
        
        // Filter changes
        performanceFilter.addEventListener('change', function() {
            showToast(`Showing performance data for ${this.value}`, 'info');
        });
        
        eventStatFilter.addEventListener('change', function() {
            showToast(`Showing event statistics by ${this.value}`, 'info');
        });
        
        // Approval buttons
        approveBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const item = this.closest('.approval-item');
                const itemName = item.querySelector('h4').textContent;
                item.style.opacity = '0.5';
                item.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    item.remove();
                    showToast(`"${itemName}" approved successfully!`);
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
        
        // Alert action buttons
        alertActionBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const alertItem = this.closest('.alert-item');
                const alertTitle = alertItem.querySelector('h4').textContent;
                const action = this.textContent.trim();
                
                alertItem.style.opacity = '0.5';
                alertItem.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    alertItem.remove();
                    showToast(`Alert "${alertTitle}" ${action.toLowerCase()}`, 'success');
                    updateAlertCount();
                }, 300);
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
                if (e.target.id === 'systemAlertModal') {
                    systemAlertForm.reset();
                }
            }
        });
        
        // Escape key to close modals and panels
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                systemAlertModal.classList.remove('active');
                notificationPanel.classList.remove('active');
                systemAlertForm.reset();
            }
        });
        
        // Activity item click
        document.querySelectorAll('.activity-item').forEach(item => {
            item.addEventListener('click', function() {
                const activityTitle = this.querySelector('h4').textContent;
                showToast(`Viewing details for "${activityTitle}"`, 'info');
            });
        });
        
        // Organizer rank item click
        document.querySelectorAll('.rank-item').forEach(item => {
            item.addEventListener('click', function() {
                const organizerName = this.querySelector('h4').textContent;
                showToast(`Viewing organizer details: ${organizerName}`, 'info');
            });
        });
    }
    
    // Update pending count
    function updatePendingCount() {
        const pendingItems = document.querySelectorAll('.approval-item').length;
        const pendingCount = document.querySelector('.pending-count');
        if (pendingCount) {
            pendingCount.textContent = `${pendingItems} items`;
        }
    }
    
    // Update alert count
    function updateAlertCount() {
        const alertItems = document.querySelectorAll('.alert-item').length;
        const alertCount = document.querySelector('.alert-count');
        if (alertCount) {
            alertCount.textContent = `${alertItems} Critical`;
        }
    }
    
    // Initialize the dashboard
    initAdminDashboard();
});