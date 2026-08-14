// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    const token = localStorage.getItem("token");

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
    
        const profileName = document.getElementById("profileName");
        if (profileName) profileName.textContent = payload.name || payload.email || "User";

        const sidebarAvatar = document.querySelector(".sidebar .user-profile .avatar img");
        if (sidebarAvatar && payload.profileImage) {
            sidebarAvatar.src = payload.profileImage;
        }

    }
    // Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const currentDate = document.getElementById('currentDate');
    
    // Action buttons
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const createNotificationBtn = document.getElementById('createNotificationBtn');
    
    // Overview elements
    const totalNotifications = document.getElementById('totalNotifications');
    const unreadNotifications = document.getElementById('unreadNotifications');
    const upcomingEvents = document.getElementById('upcomingEvents');
    const pendingActions = document.getElementById('pendingActions');
    
    // Filter elements
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const clearFilters = document.getElementById('clearFilters');
    const viewOptions = document.querySelectorAll('.view-option');
    
    // List elements
    const notificationsList = document.getElementById('notificationsList');
    const noNotifications = document.getElementById('noNotifications');
    const bulkAction = document.getElementById('bulkAction');
    const applyBulk = document.getElementById('applyBulk');
    const notificationsCount = document.querySelector('.notifications-count');
    
    // Modal elements
    const createNotificationModal = document.getElementById('createNotificationModal');
    const createNotificationForm = document.getElementById('createNotificationForm');
    const closeCreateModal = document.getElementById('closeCreateModal');
    const cancelCreateBtn = document.getElementById('cancelCreateBtn');
    const notificationTitle = document.getElementById('notificationTitle');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationType = document.getElementById('notificationType');
    const notificationPriority = document.getElementById('notificationPriority');
    const notificationEvent = document.getElementById('notificationEvent');
    const notificationSchedule = document.getElementById('notificationSchedule');
    const scheduleDateGroup = document.getElementById('scheduleDateGroup');
    const notificationDate = document.getElementById('notificationDate');
    
    const notificationDetailModal = document.getElementById('notificationDetailModal');
    const detailTitle = document.getElementById('detailTitle');
    const notificationDetail = document.getElementById('notificationDetail');
    const closeDetailModal = document.getElementById('closeDetailModal');
    
    // Settings elements
    const emailNotifications = document.getElementById('emailNotifications');
    const pushNotifications = document.getElementById('pushNotifications');
    const smsNotifications = document.getElementById('smsNotifications');
    const soundNotifications = document.getElementById('soundNotifications');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const resetSettingsBtn = document.getElementById('resetSettingsBtn');
    
    // Chart
    let notificationChart;
    
    // Sample notifications data
    let notificationsData = [
        {
            id: 1,
            title: 'Music Festival Starts Today',
            message: 'Your Music Festival event starts in 2 hours. Make sure everything is set up and ready.',
            type: 'event',
            priority: 'high',
            event: 'Music Festival',
            status: 'unread',
            timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
            icon: 'music'
        },
        {
            id: 2,
            title: 'New Attendee Registration',
            message: 'Sarah Chen has registered for the Tech Conference with a VIP ticket.',
            type: 'attendee',
            priority: 'medium',
            event: 'Tech Conference',
            status: 'unread',
            timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
            icon: 'user-plus'
        },
        {
            id: 3,
            title: 'System Maintenance Scheduled',
            message: 'Scheduled maintenance will occur this Sunday from 2 AM to 4 AM. The system will be temporarily unavailable.',
            type: 'system',
            priority: 'medium',
            event: null,
            status: 'read',
            timestamp: new Date(Date.now() - 5 * 3600000), // 5 hours ago
            icon: 'server'
        },
        {
            id: 4,
            title: 'AI Workshop Reminder',
            message: 'Your AI Workshop is scheduled for tomorrow at 2:00 PM. Remember to prepare your materials.',
            type: 'reminder',
            priority: 'low',
            event: 'AI Workshop',
            status: 'read',
            timestamp: new Date(Date.now() - 1 * 24 * 3600000), // 1 day ago
            icon: 'bell'
        },
        {
            id: 5,
            title: 'Low Ticket Alert',
            message: 'Only 15 tickets left for the Startup Pitch Night. Consider increasing capacity.',
            type: 'alert',
            priority: 'high',
            event: 'Startup Pitch Night',
            status: 'unread',
            timestamp: new Date(Date.now() - 1 * 24 * 3600000), // 1 day ago
            icon: 'exclamation-triangle'
        },
        {
            id: 6,
            title: 'Event Analytics Ready',
            message: 'Weekly analytics report for Music Festival is now available. Check insights and performance metrics.',
            type: 'system',
            priority: 'low',
            event: 'Music Festival',
            status: 'read',
            timestamp: new Date(Date.now() - 2 * 24 * 3600000), // 2 days ago
            icon: 'chart-bar'
        },
        {
            id: 7,
            title: 'Venue Confirmation Required',
            message: 'Please confirm the venue booking for Tech Conference by tomorrow to avoid cancellation.',
            type: 'reminder',
            priority: 'high',
            event: 'Tech Conference',
            status: 'unread',
            timestamp: new Date(Date.now() - 2 * 24 * 3600000), // 2 days ago
            icon: 'map-marker-alt'
        },
        {
            id: 8,
            title: 'Speaker Added',
            message: 'John Doe has been added as a speaker to your AI Workshop event.',
            type: 'attendee',
            priority: 'medium',
            event: 'AI Workshop',
            status: 'read',
            timestamp: new Date(Date.now() - 3 * 24 * 3600000), // 3 days ago
            icon: 'user-tie'
        },
        {
            id: 9,
            title: 'Payment Received',
            message: 'Payment of $2,500 has been received for Tech Conference sponsorship.',
            type: 'system',
            priority: 'medium',
            event: 'Tech Conference',
            status: 'read',
            timestamp: new Date(Date.now() - 4 * 24 * 3600000), // 4 days ago
            icon: 'credit-card'
        },
        {
            id: 10,
            title: 'Weather Alert',
            message: 'Heavy rain forecasted for Music Festival day. Consider indoor backup plans.',
            type: 'alert',
            priority: 'high',
            event: 'Music Festival',
            status: 'unread',
            timestamp: new Date(Date.now() - 5 * 24 * 3600000), // 5 days ago
            icon: 'cloud-rain'
        }
    ];
    
    // State variables
    let currentFilters = {
        type: 'all',
        status: 'all',
        date: 'all',
        priority: 'all'
    };
    let selectedNotifications = new Set();
    let currentView = 'list';
    let notificationSettings = {
        email: true,
        emailTypes: ['events', 'attendees', 'system'],
        push: true,
        pushTypes: ['urgent', 'reminders'],
        sms: false,
        smsTypes: [],
        sound: true,
        soundTypes: ['unread', 'high-priority']
    };
    
    // Initialize notifications page
    function initNotifications() {
        // Update date display
        updateDateDisplay();
        
        // Load notifications
        loadNotifications();
        
        // Initialize chart
        initChart();
        
        // Setup event listeners
        setupEventListeners();
        
        // Load settings
        loadSettings();
        
        // Update date every minute
        setInterval(updateDateDisplay, 60000);
    }
    
    // Update date display
    function updateDateDisplay() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDate.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Load notifications with filters
    function loadNotifications() {
        // Filter notifications
        let filteredNotifications = notificationsData.filter(notification => {
            // Type filter
            if (currentFilters.type !== 'all' && notification.type !== currentFilters.type) {
                return false;
            }
            
            // Status filter
            if (currentFilters.status !== 'all' && notification.status !== currentFilters.status) {
                return false;
            }
            
            // Priority filter
            if (currentFilters.priority !== 'all' && notification.priority !== currentFilters.priority) {
                return false;
            }
            
            // Date filter
            if (currentFilters.date !== 'all') {
                const now = new Date();
                const notificationDate = new Date(notification.timestamp);
                const timeDiff = now - notificationDate;
                
                if (currentFilters.date === 'today') {
                    if (notificationDate.toDateString() !== now.toDateString()) return false;
                } else if (currentFilters.date === 'week') {
                    if (timeDiff > 7 * 24 * 3600000) return false;
                } else if (currentFilters.date === 'month') {
                    if (timeDiff > 30 * 24 * 3600000) return false;
                } else if (currentFilters.date === 'older') {
                    if (timeDiff <= 30 * 24 * 3600000) return false;
                }
            }
            
            return true;
        });
        
        // Sort by timestamp (newest first)
        filteredNotifications.sort((a, b) => b.timestamp - a.timestamp);
        
        // Update counts
        const total = filteredNotifications.length;
        const unread = filteredNotifications.filter(n => n.status === 'unread').length;
        
        totalNotifications.textContent = total;
        unreadNotifications.textContent = unread;
        notificationsCount.textContent = `(${total})`;
        
        // Update other counts
        const upcomingCount = filteredNotifications.filter(n => 
            n.type === 'event' && n.status === 'unread'
        ).length;
        const pendingCount = filteredNotifications.filter(n => 
            n.priority === 'high' && n.status === 'unread'
        ).length;
        
        upcomingEvents.textContent = upcomingCount;
        pendingActions.textContent = pendingCount;
        
        // Check if no notifications found
        if (total === 0) {
            notificationsList.style.display = 'none';
            noNotifications.style.display = 'block';
            return;
        }
        
        // Show notifications list
        notificationsList.style.display = 'block';
        noNotifications.style.display = 'none';
        
        // Clear list
        notificationsList.innerHTML = '';
        
        // Add notifications to list
        filteredNotifications.forEach(notification => {
            const notificationItem = createNotificationItem(notification);
            notificationsList.appendChild(notificationItem);
        });
        
        // Update chart
        updateChart();
    }
    
    // Create notification item element
    function createNotificationItem(notification) {
        const item = document.createElement('div');
        item.className = `notification-item ${notification.status} ${notification.priority === 'high' ? 'high-priority' : ''}`;
        item.dataset.id = notification.id;
        
        // Format time
        const timeString = formatTime(notification.timestamp);
        
        // Get icon class
        let iconClass = '';
        let iconName = '';
        switch(notification.type) {
            case 'event':
                iconClass = 'event';
                iconName = 'calendar-alt';
                break;
            case 'attendee':
                iconClass = 'attendee';
                iconName = 'users';
                break;
            case 'system':
                iconClass = 'system';
                iconName = 'cog';
                break;
            case 'reminder':
                iconClass = 'reminder';
                iconName = 'bell';
                break;
            case 'alert':
                iconClass = 'alert';
                iconName = 'exclamation-triangle';
                break;
        }
        
        // Use custom icon if specified
        if (notification.icon) {
            iconName = notification.icon;
        }
        
        // Priority badge
        let priorityText = '';
        switch(notification.priority) {
            case 'high': priorityText = 'High'; break;
            case 'medium': priorityText = 'Medium'; break;
            case 'low': priorityText = 'Low'; break;
        }
        
        item.innerHTML = `
            <div class="notification-checkbox">
                <input type="checkbox" ${selectedNotifications.has(notification.id) ? 'checked' : ''}>
            </div>
            
            <div class="notification-icon ${iconClass}">
                <i class="fas fa-${iconName}"></i>
            </div>
            
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <div class="notification-meta">
                    <span class="notification-time">${timeString}</span>
                    ${notification.event ? `<span class="notification-event">${notification.event}</span>` : ''}
                    <span class="priority-badge priority-${notification.priority}">${priorityText}</span>
                </div>
            </div>
            
            <div class="notification-actions">
                <button class="notification-action-btn mark-read" data-action="mark-read" title="Mark as Read">
                    <i class="fas fa-check"></i>
                </button>
                <button class="notification-action-btn delete" data-action="delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedNotifications.add(notification.id);
            } else {
                selectedNotifications.delete(notification.id);
            }
        });
        
        const actionButtons = item.querySelectorAll('.notification-action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.dataset.action;
                handleNotificationAction(action, notification);
            });
        });
        
        // Add click event to view notification
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.notification-checkbox') && !e.target.closest('.notification-action-btn')) {
                showNotificationDetail(notification);
            }
        });
        
        return item;
    }
    
    // Format time relative to now
    function formatTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        
        // Convert to seconds
        const seconds = Math.floor(diff / 1000);
        
        if (seconds < 60) {
            return 'Just now';
        }
        
        // Convert to minutes
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        }
        
        // Convert to hours
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        }
        
        // Convert to days
        const days = Math.floor(hours / 24);
        if (days < 7) {
            return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        }
        
        // Show date
        return timestamp.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }
    
    // Handle notification actions
    function handleNotificationAction(action, notification) {
        switch(action) {
            case 'mark-read':
                markAsRead(notification.id);
                break;
            case 'delete':
                deleteNotification(notification.id);
                break;
        }
    }
    
    // Mark notification as read
    function markAsRead(notificationId) {
        const notification = notificationsData.find(n => n.id === notificationId);
        if (notification && notification.status === 'unread') {
            notification.status = 'read';
            loadNotifications();
            showToast('Notification marked as read');
        }
    }
    
    // Delete notification
    function deleteNotification(notificationId) {
        if (confirm('Are you sure you want to delete this notification?')) {
            notificationsData = notificationsData.filter(n => n.id !== notificationId);
            selectedNotifications.delete(notificationId);
            loadNotifications();
            showToast('Notification deleted');
        }
    }
    
    // Show notification detail modal
    function showNotificationDetail(notification) {
        detailTitle.textContent = 'Notification Details';
        
        // Format time
        const timeString = formatTime(notification.timestamp);
        const fullTime = notification.timestamp.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Get icon class
        let iconClass = '';
        let iconName = '';
        switch(notification.type) {
            case 'event':
                iconClass = 'event';
                iconName = 'calendar-alt';
                break;
            case 'attendee':
                iconClass = 'attendee';
                iconName = 'users';
                break;
            case 'system':
                iconClass = 'system';
                iconName = 'cog';
                break;
            case 'reminder':
                iconClass = 'reminder';
                iconName = 'bell';
                break;
            case 'alert':
                iconClass = 'alert';
                iconName = 'exclamation-triangle';
                break;
        }
        
        // Use custom icon if specified
        if (notification.icon) {
            iconName = notification.icon;
        }
        
        // Priority text
        let priorityText = '';
        switch(notification.priority) {
            case 'high': priorityText = 'High Priority'; break;
            case 'medium': priorityText = 'Medium Priority'; break;
            case 'low': priorityText = 'Low Priority'; break;
        }
        
        notificationDetail.innerHTML = `
            <div class="detail-header">
                <div class="detail-icon ${iconClass}">
                    <i class="fas fa-${iconName}"></i>
                </div>
                <div class="detail-info">
                    <h3>${notification.title}</h3>
                    <div class="detail-meta">
                        <span class="notification-time">${fullTime}</span>
                        ${notification.event ? `<span class="notification-event">${notification.event}</span>` : ''}
                        <span class="priority-badge priority-${notification.priority}">${priorityText}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-body">
                <p>${notification.message}</p>
            </div>
            
            <div class="detail-actions">
                <button class="action-btn" id="markDetailReadBtn" ${notification.status === 'read' ? 'disabled' : ''}>
                    <i class="fas fa-check"></i>
                    Mark as Read
                </button>
                <button class="action-btn danger-btn" id="deleteDetailBtn">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        `;
        
        // Add event listeners for detail buttons
        const markDetailReadBtn = document.getElementById('markDetailReadBtn');
        if (markDetailReadBtn) {
            markDetailReadBtn.addEventListener('click', function() {
                markAsRead(notification.id);
                notificationDetailModal.classList.remove('active');
            });
        }
        
        const deleteDetailBtn = document.getElementById('deleteDetailBtn');
        if (deleteDetailBtn) {
            deleteDetailBtn.addEventListener('click', function() {
                deleteNotification(notification.id);
                notificationDetailModal.classList.remove('active');
            });
        }
        
        // Mark as read when viewing
        if (notification.status === 'unread') {
            markAsRead(notification.id);
        }
        
        // Show modal
        notificationDetailModal.classList.add('active');
    }
    
    // Initialize chart
    function initChart() {
        const ctx = document.getElementById('notificationChart').getContext('2d');
        
        notificationChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Events', 'Attendees', 'System', 'Reminders', 'Alerts'],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(67, 97, 238, 0.8)',
                        'rgba(74, 222, 128, 0.8)',
                        'rgba(6, 182, 212, 0.8)',
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(248, 113, 113, 0.8)'
                    ],
                    borderColor: [
                        'rgb(67, 97, 238)',
                        'rgb(74, 222, 128)',
                        'rgb(6, 182, 212)',
                        'rgb(251, 191, 36)',
                        'rgb(248, 113, 113)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
        
        updateChart();
    }
    
    // Update chart data
    function updateChart() {
        if (!notificationChart) return;
        
        const typeCounts = {
            event: notificationsData.filter(n => n.type === 'event').length,
            attendee: notificationsData.filter(n => n.type === 'attendee').length,
            system: notificationsData.filter(n => n.type === 'system').length,
            reminder: notificationsData.filter(n => n.type === 'reminder').length,
            alert: notificationsData.filter(n => n.type === 'alert').length
        };
        
        notificationChart.data.datasets[0].data = [
            typeCounts.event,
            typeCounts.attendee,
            typeCounts.system,
            typeCounts.reminder,
            typeCounts.alert
        ];
        
        notificationChart.update();
        
        // Update legend counts
        document.querySelectorAll('.legend-count').forEach((countSpan, index) => {
            const counts = Object.values(typeCounts);
            if (counts[index] !== undefined) {
                countSpan.textContent = counts[index];
            }
        });
    }
    
    // Load settings from localStorage or use defaults
    function loadSettings() {
        const savedSettings = localStorage.getItem('notificationSettings');
        if (savedSettings) {
            notificationSettings = JSON.parse(savedSettings);
        }
        
        // Apply settings to UI
        emailNotifications.checked = notificationSettings.email;
        pushNotifications.checked = notificationSettings.push;
        smsNotifications.checked = notificationSettings.sms;
        soundNotifications.checked = notificationSettings.sound;
        
        // Apply email types
        document.querySelectorAll('input[name="emailTypes"]').forEach(checkbox => {
            checkbox.checked = notificationSettings.emailTypes.includes(checkbox.value);
        });
        
        // Apply push types
        document.querySelectorAll('input[name="pushTypes"]').forEach(checkbox => {
            checkbox.checked = notificationSettings.pushTypes.includes(checkbox.value);
        });
        
        // Apply SMS types
        document.querySelectorAll('input[name="smsTypes"]').forEach(checkbox => {
            checkbox.checked = notificationSettings.smsTypes.includes(checkbox.value);
        });
        
        // Apply sound types
        document.querySelectorAll('input[name="soundTypes"]').forEach(checkbox => {
            checkbox.checked = notificationSettings.soundTypes.includes(checkbox.value);
        });
    }
    
    // Save settings
    function saveSettings() {
        // Update settings object
        notificationSettings.email = emailNotifications.checked;
        notificationSettings.push = pushNotifications.checked;
        notificationSettings.sms = smsNotifications.checked;
        notificationSettings.sound = soundNotifications.checked;
        
        // Update email types
        notificationSettings.emailTypes = [];
        document.querySelectorAll('input[name="emailTypes"]:checked').forEach(checkbox => {
            notificationSettings.emailTypes.push(checkbox.value);
        });
        
        // Update push types
        notificationSettings.pushTypes = [];
        document.querySelectorAll('input[name="pushTypes"]:checked').forEach(checkbox => {
            notificationSettings.pushTypes.push(checkbox.value);
        });
        
        // Update SMS types
        notificationSettings.smsTypes = [];
        document.querySelectorAll('input[name="smsTypes"]:checked').forEach(checkbox => {
            notificationSettings.smsTypes.push(checkbox.value);
        });
        
        // Update sound types
        notificationSettings.soundTypes = [];
        document.querySelectorAll('input[name="soundTypes"]:checked').forEach(checkbox => {
            notificationSettings.soundTypes.push(checkbox.value);
        });
        
        // Save to localStorage
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
        
        showToast('Settings saved successfully!');
    }
    
    // Reset settings to defaults
    function resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            notificationSettings = {
                email: true,
                emailTypes: ['events', 'attendees', 'system'],
                push: true,
                pushTypes: ['urgent', 'reminders'],
                sms: false,
                smsTypes: [],
                sound: true,
                soundTypes: ['unread', 'high-priority']
            };
            
            localStorage.removeItem('notificationSettings');
            loadSettings();
            showToast('Settings reset to defaults');
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
        
        // Action buttons
        markAllReadBtn.addEventListener('click', function() {
            notificationsData.forEach(notification => {
                if (notification.status === 'unread') {
                    notification.status = 'read';
                }
            });
            loadNotifications();
            showToast('All notifications marked as read');
        });
        
        clearAllBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
                notificationsData = [];
                selectedNotifications.clear();
                loadNotifications();
                showToast('All notifications cleared');
            }
        });
        
        createNotificationBtn.addEventListener('click', function() {
            createNotificationModal.classList.add('active');
            notificationTitle.focus();
        });
        
        // Filter changes
        typeFilter.addEventListener('change', function() {
            currentFilters.type = this.value;
            loadNotifications();
        });
        
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            loadNotifications();
        });
        
        dateFilter.addEventListener('change', function() {
            currentFilters.date = this.value;
            loadNotifications();
        });
        
        priorityFilter.addEventListener('change', function() {
            currentFilters.priority = this.value;
            loadNotifications();
        });
        
        // Clear filters
        clearFilters.addEventListener('click', function() {
            typeFilter.value = 'all';
            statusFilter.value = 'all';
            dateFilter.value = 'all';
            priorityFilter.value = 'all';
            
            currentFilters.type = 'all';
            currentFilters.status = 'all';
            currentFilters.date = 'all';
            currentFilters.priority = 'all';
            
            loadNotifications();
        });
        
        // View options
        viewOptions.forEach(option => {
            option.addEventListener('click', function() {
                viewOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                currentView = this.dataset.view;
                showToast(`Switched to ${currentView} view`);
            });
        });
        
        // Create notification modal
        closeCreateModal.addEventListener('click', function() {
            createNotificationModal.classList.remove('active');
            createNotificationForm.reset();
            scheduleDateGroup.style.display = 'none';
        });
        
        cancelCreateBtn.addEventListener('click', function() {
            createNotificationModal.classList.remove('active');
            createNotificationForm.reset();
            scheduleDateGroup.style.display = 'none';
        });
        
        notificationSchedule.addEventListener('change', function() {
            if (this.value === 'custom') {
                scheduleDateGroup.style.display = 'block';
                
                // Set default date to tomorrow
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(9, 0, 0, 0);
                
                // Format for datetime-local input
                const formattedDate = tomorrow.toISOString().slice(0, 16);
                notificationDate.value = formattedDate;
                notificationDate.min = new Date().toISOString().slice(0, 16);
            } else {
                scheduleDateGroup.style.display = 'none';
            }
        });
        
        createNotificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create new notification
            const newNotification = {
                id: notificationsData.length > 0 ? Math.max(...notificationsData.map(n => n.id)) + 1 : 1,
                title: notificationTitle.value,
                message: notificationMessage.value,
                type: notificationType.value,
                priority: notificationPriority.value,
                event: notificationEvent.value || null,
                status: 'unread',
                timestamp: new Date(),
                icon: getIconForType(notificationType.value)
            };
            
            // Handle scheduling
            if (notificationSchedule.value === 'custom' && notificationDate.value) {
                const scheduledDate = new Date(notificationDate.value);
                if (scheduledDate > new Date()) {
                    // In a real app, you would schedule this notification
                    showToast(`Notification scheduled for ${scheduledDate.toLocaleString()}`);
                } else {
                    newNotification.timestamp = scheduledDate;
                }
            }
            
            // Add to beginning of array
            notificationsData.unshift(newNotification);
            
            // Update UI
            loadNotifications();
            
            // Close modal and reset form
            createNotificationModal.classList.remove('active');
            createNotificationForm.reset();
            scheduleDateGroup.style.display = 'none';
            
            showToast('Notification created successfully!');
            
            // If sound notifications are enabled, play a sound
            if (notificationSettings.sound && notificationSettings.soundTypes.includes('unread')) {
                playNotificationSound();
            }
        });
        
        // Notification detail modal
        closeDetailModal.addEventListener('click', function() {
            notificationDetailModal.classList.remove('active');
        });
        
        // Bulk actions
        applyBulk.addEventListener('click', function() {
            const action = bulkAction.value;
            if (!action) {
                alert('Please select a bulk action');
                return;
            }
            
            if (selectedNotifications.size === 0) {
                alert('Please select at least one notification');
                return;
            }
            
            switch(action) {
                case 'mark-read':
                    selectedNotifications.forEach(id => {
                        const notification = notificationsData.find(n => n.id === id);
                        if (notification) {
                            notification.status = 'read';
                        }
                    });
                    selectedNotifications.clear();
                    loadNotifications();
                    showToast(`${selectedNotifications.size} notifications marked as read`);
                    break;
                    
                case 'mark-unread':
                    selectedNotifications.forEach(id => {
                        const notification = notificationsData.find(n => n.id === id);
                        if (notification) {
                            notification.status = 'unread';
                        }
                    });
                    selectedNotifications.clear();
                    loadNotifications();
                    showToast(`${selectedNotifications.size} notifications marked as unread`);
                    break;
                    
                case 'archive':
                    // In a real app, you would archive notifications
                    showToast(`${selectedNotifications.size} notifications archived`);
                    selectedNotifications.clear();
                    loadNotifications();
                    break;
                    
                case 'delete':
                    if (confirm(`Are you sure you want to delete ${selectedNotifications.size} selected notifications?`)) {
                        notificationsData = notificationsData.filter(notification => 
                            !selectedNotifications.has(notification.id)
                        );
                        selectedNotifications.clear();
                        loadNotifications();
                        showToast(`${selectedNotifications.size} notifications deleted`);
                    }
                    break;
            }
            
            bulkAction.value = '';
        });
        
        // Settings
        saveSettingsBtn.addEventListener('click', saveSettings);
        resetSettingsBtn.addEventListener('click', resetSettings);
        
        // Modal close on outside click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
                if (e.target.id === 'createNotificationModal') {
                    createNotificationForm.reset();
                    scheduleDateGroup.style.display = 'none';
                }
            }
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                createNotificationModal.classList.remove('active');
                notificationDetailModal.classList.remove('active');
                createNotificationForm.reset();
                scheduleDateGroup.style.display = 'none';
            }
        });
        
        // Remind later buttons
        document.addEventListener('click', function(e) {
            if (e.target.closest('.remind-later-btn')) {
                const btn = e.target.closest('.remind-later-btn');
                const eventItem = btn.closest('.upcoming-item');
                const eventName = eventItem.querySelector('h4').textContent;
                
                // In a real app, you would schedule a reminder
                showToast(`Reminder for "${eventName}" set for 1 hour from now`);
            }
        });
    }
    
    // Get icon for notification type
    function getIconForType(type) {
        switch(type) {
            case 'event': return 'calendar-alt';
            case 'attendee': return 'users';
            case 'system': return 'cog';
            case 'reminder': return 'bell';
            case 'alert': return 'exclamation-triangle';
            default: return 'bell';
        }
    }
    
    // Play notification sound
    function playNotificationSound() {
        // Create audio context for notification sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
    
    // Show toast notification
    function showToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-color);
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
    
    // Initialize the page
    initNotifications();
});