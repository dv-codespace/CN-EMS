// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Load user profile details from token
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userNameEl = document.querySelector('.user-profile .user-info h3');
            const userAvatarImg = document.querySelector('.user-profile .avatar img');
            
            if (userNameEl) {
                userNameEl.textContent = payload.name || payload.email || "Alex Johnson";
            }
            if (userAvatarImg) {
                userAvatarImg.src = payload.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${payload.name || payload.email || 'User'}`;
            }
        } catch (e) {
            console.error("Error decoding profile token:", e);
        }
    }
    
    async function loadFreshUserProfile() {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const response = await fetch("http://localhost:3000/auth/profile", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const user = data.user;
                if (user) {
                    const userNameEl = document.querySelector('.user-profile .user-info h3');
                    const userAvatarImg = document.querySelector('.user-profile .avatar img');
                    
                    if (userNameEl) {
                        userNameEl.textContent = user.name || user.email || "Alex Johnson";
                    }
                    
                    const welcomeHeader = document.querySelector(".top-bar .page-title h1");
                    if (welcomeHeader && welcomeHeader.textContent.startsWith("Welcome Back")) {
                        const firstName = (user.name || "User").split(' ')[0];
                        welcomeHeader.textContent = `Welcome Back, ${firstName}!`;
                    }

                    if (userAvatarImg && user.profileImage) {
                        userAvatarImg.src = user.profileImage;
                    }
                    
                    // Update user settings avatar preview if on settings page
                    const largeAvatar = document.querySelector(".avatar-large img");
                    if (largeAvatar && user.profileImage) {
                        largeAvatar.src = user.profileImage;
                    }
                }
            }
        } catch (e) {
            console.error("Error loading fresh user profile:", e);
        }

        try {
            const regResponse = await fetch("http://localhost:3000/api/events/registrations", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (regResponse.ok) {
                const registrations = await regResponse.json();
                const now = new Date();
                
                const upcoming = registrations.filter(r => r.event && new Date(r.event.date) >= now);
                
                let bookmarksCount = 0;
                try {
                    const saved = localStorage.getItem("bookmarks");
                    if (saved) {
                        bookmarksCount = JSON.parse(saved).length;
                    } else {
                        bookmarksCount = 4;
                    }
                } catch(err) {
                    bookmarksCount = 4;
                }

                // Update sidebar stats
                const sidebarUpcomingEl = document.querySelector(".user-stats .stat-item:nth-child(1) .stat-value");
                if (sidebarUpcomingEl) {
                    sidebarUpcomingEl.textContent = upcoming.length;
                }
                const sidebarBookmarksEl = document.querySelector(".user-stats .stat-item:nth-child(2) .stat-value");
                if (sidebarBookmarksEl) {
                    sidebarBookmarksEl.textContent = bookmarksCount;
                }

                // Update page stats cards (if on usr-dashboard.html)
                const cardUpcoming = document.querySelector(".stats-grid .stat-card:nth-child(1) h3");
                if (cardUpcoming) {
                    cardUpcoming.textContent = upcoming.length;
                }
                const cardTickets = document.querySelector(".stats-grid .stat-card:nth-child(3) h3");
                if (cardTickets) {
                    cardTickets.textContent = registrations.length;
                }
                const cardBookmarks = document.querySelector(".stats-grid .stat-card:nth-child(4) h3");
                if (cardBookmarks) {
                    cardBookmarks.textContent = bookmarksCount;
                }
            }
        } catch (e) {
            console.error("Error loading registrations count:", e);
        }
    }
    loadFreshUserProfile();
    
    // Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const logoutBtn = document.getElementById('logoutBtn');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const currentDate = document.getElementById('currentDate');
    const currentMonth = document.getElementById('currentMonth');
    const calendarDays = document.getElementById('calendarDays');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotifications = document.getElementById('closeNotifications');
    const markAllRead = document.getElementById('markAllRead');
    const searchInput = document.getElementById('searchInput');
    const viewTicketBtns = document.querySelectorAll('.btn-view');
    const ticketModal = document.getElementById('ticketModal');
    const closeTicketModal = document.getElementById('closeTicketModal');
    const quickActionButtons = document.querySelectorAll('.quick-action-card');
    const categoryItems = document.querySelectorAll('.category-item');
    const joinButtons = document.querySelectorAll('.btn-join, .btn-remind, .btn-book');
    
    // Current date for calendar
    let currentCalendarDate = new Date();
    
    // Initialize the dashboard
    initDashboard();
    
    // Initialize dashboard
    function initDashboard() {
        // Update date display
        updateDateDisplay();
        
        // Generate calendar
        generateCalendar();
        
        // Setup event listeners
        setupEventListeners();
        
        // Update date every minute
        setInterval(updateDateDisplay, 60000);
    }
    
    // Update date display
    function updateDateDisplay() {
        if (!currentDate) return;
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDate.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Generate calendar
    function generateCalendar() {
        if (!calendarDays || !currentMonth) return;
        
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        
        // Update month display
        const monthOptions = { month: 'long', year: 'numeric' };
        currentMonth.textContent = currentCalendarDate.toLocaleDateString('en-US', monthOptions);
        
        // Get first day of month
        const firstDay = new Date(year, month, 1);
        // Get last day of month
        const lastDay = new Date(year, month + 1, 0);
        // Get number of days in month
        const daysInMonth = lastDay.getDate();
        // Get starting day (0 = Sunday, 6 = Saturday)
        const startingDay = firstDay.getDay();
        
        // Clear calendar
        calendarDays.innerHTML = '';
        
        // Add empty cells for days before first day
        for (let i = 0; i < startingDay; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day other-month';
            dayEl.textContent = '';
            calendarDays.appendChild(dayEl);
        }
        
        // Add days of the month
        const today = new Date();
        const userEventDays = [5, 12, 15]; // User's events
        const popularEventDays = [8, 20, 25]; // Popular events
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;
            
            // Check if today
            if (year === today.getFullYear() && 
                month === today.getMonth() && 
                day === today.getDate()) {
                dayEl.classList.add('today');
            }
            
            // Check if user has event
            if (userEventDays.includes(day)) {
                dayEl.classList.add('event');
            }
            
            // Check if popular event
            if (popularEventDays.includes(day)) {
                dayEl.classList.add('popular');
            }
            
            // Add click event
            dayEl.addEventListener('click', function() {
                const eventDate = new Date(year, month, day);
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                showNotification(`Selected: ${eventDate.toLocaleDateString('en-US', options)}`);
            });
            
            calendarDays.appendChild(dayEl);
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Mobile menu toggle
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', function() {
                if (sidebar) sidebar.classList.toggle('active');
                if (mainContent) mainContent.classList.toggle('sidebar-active');
            });
        }
        
        // Close sidebar when clicking on main content on mobile
        if (mainContent) {
            mainContent.addEventListener('click', function(e) {
                if (window.innerWidth <= 768 && !e.target.closest('.mobile-menu-toggle')) {
                    if (sidebar) sidebar.classList.remove('active');
                }
            });
        }
        
        // Calendar navigation
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', function() {
                currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
                generateCalendar();
            });
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', function() {
                currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
                generateCalendar();
            });
        }
        
        // Notification panel
        if (notificationBtn) {
            notificationBtn.addEventListener('click', function() {
                if (notificationPanel) notificationPanel.classList.toggle('active');
            });
        }
        
        if (closeNotifications) {
            closeNotifications.addEventListener('click', function() {
                if (notificationPanel) notificationPanel.classList.remove('active');
            });
        }
        
        // Mark all notifications as read
        if (markAllRead) {
            markAllRead.addEventListener('click', function() {
                document.querySelectorAll('.notification-item.unread').forEach(item => {
                    item.classList.remove('unread');
                });
                const badge = document.querySelector('.notification-count');
                if (badge) badge.textContent = '0';
                showNotification('All notifications marked as read');
            });
        }
        
        // Close notification panel when clicking outside
        document.addEventListener('click', function(e) {
            if (notificationPanel && notificationBtn && !notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
                notificationPanel.classList.remove('active');
            }
        });
        
        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                if (searchTerm.length > 2) {
                    showNotification(`Searching for: ${searchTerm}`);
                }
            });
        }
        
        // View ticket buttons
        if (viewTicketBtns) {
            viewTicketBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const eventItem = this.closest('.event-item');
                    if (!eventItem) return;
                    const eventName = eventItem.querySelector('h4').textContent;
                    const eventDate = eventItem.querySelector('p').textContent;
                    
                    // Update modal content
                    const ticketEventName = document.getElementById('ticketEventName');
                    const ticketEventDate = document.getElementById('ticketEventDate');
                    if (ticketEventName) ticketEventName.textContent = eventName;
                    if (ticketEventDate) ticketEventDate.textContent = eventDate;
                    
                    // Show modal
                    if (ticketModal) {
                        ticketModal.classList.add('active');
                        ticketModal.style.display = 'flex';
                    }
                });
            });
        }
        
        // Close ticket modal
        if (closeTicketModal) {
            closeTicketModal.addEventListener('click', function() {
                if (ticketModal) closeModal(ticketModal);
            });
        }
        
        // Close modal when clicking outside
        if (ticketModal) {
            ticketModal.addEventListener('click', function(e) {
                if (e.target === ticketModal) {
                    closeModal(ticketModal);
                }
            });
        }
        
        // Quick action buttons
        if (quickActionButtons) {
            quickActionButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const headingEl = this.querySelector('h4');
                    if (!headingEl) return;
                    const actionName = headingEl.textContent;
                    switch(actionName) {
                        case 'Browse Events':
                            showNotification('Opening events browser...');
                            break;
                        case 'Invite Friends':
                            showNotification('Opening friend invitation...');
                            break;
                        case 'View Tickets':
                            showNotification('Opening tickets...');
                            break;
                        case 'Create Event':
                            showNotification('Opening event creation...');
                            break;
                    }
                });
            });
        }
        
        // Category items
        if (categoryItems) {
            categoryItems.forEach(item => {
                item.addEventListener('click', function() {
                    const spanEl = this.querySelector('span');
                    if (spanEl) {
                        const categoryName = spanEl.textContent;
                        showNotification(`Browsing ${categoryName} events`);
                    }
                });
            });
        }
        
        // Join/Book/Remind buttons
        if (joinButtons) {
            joinButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const eventItem = this.closest('.live-event, .recommended-item');
                    const eventName = eventItem ? eventItem.querySelector('h4').textContent : 'Event';
                    
                    if (this.classList.contains('btn-join')) {
                        showNotification(`Joining: ${eventName}`);
                    } else if (this.classList.contains('btn-remind')) {
                        showNotification(`Reminder set for: ${eventName}`);
                        this.textContent = 'Reminder Set!';
                        this.disabled = true;
                        this.style.opacity = '0.7';
                    } else if (this.classList.contains('btn-book')) {
                        showNotification(`Booking tickets for: ${eventName}`);
                        this.textContent = 'Booked!';
                        this.disabled = true;
                        this.style.opacity = '0.7';
                    }
                });
            });
        }
        
        // Event item clicks
        document.querySelectorAll('.event-item, .recommended-item, .live-event').forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.closest('button')) {
                    const headingEl = this.querySelector('h4');
                    if (headingEl) {
                        const eventName = headingEl.textContent;
                        showNotification(`Opening details for: ${eventName}`);
                    }
                }
            });
        });
        
        // Upgrade button
        const upgradeBtn = document.querySelector('.upgrade-btn');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', function() {
                showNotification('Opening upgrade options...');
            });
        }
        
        // Social links
        document.querySelectorAll('.social-links a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const iconEl = this.querySelector('i');
                if (iconEl) {
                    const platform = iconEl.className.split('-')[1];
                    showNotification(`Opening ${platform}...`);
                }
            });
        });
        
        // Download and share ticket buttons
        const btnDownload = document.querySelector('.btn-download');
        if (btnDownload) {
            btnDownload.addEventListener('click', function() {
                showNotification('Downloading ticket...');
            });
        }
        
        const btnShare = document.querySelector('.btn-share');
        if (btnShare) {
            btnShare.addEventListener('click', function() {
                showNotification('Sharing ticket...');
            });
        }
        
        // Logout button
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const confirmLogout = confirm("Do you want to logout?");
                if (!confirmLogout) return;
                localStorage.clear();
                window.location.href = "../../auth.html";
            });
        }

        // Handle window resize
        window.addEventListener('resize', handleResize);
        
        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (sidebar && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
                if (notificationPanel && notificationPanel.classList.contains('active')) {
                    notificationPanel.classList.remove('active');
                }
                if (ticketModal && ticketModal.classList.contains('active')) {
                    closeModal(ticketModal);
                }
            }
        });
    }
    
    // Close modal function
    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    // Handle window resize
    function handleResize() {
        if (!sidebar || !mobileMenuToggle) return;
        // Auto-close sidebar when switching to desktop
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
        
        // Update mobile menu toggle visibility
        if (window.innerWidth > 768) {
            mobileMenuToggle.style.display = 'none';
        } else {
            mobileMenuToggle.style.display = 'flex';
        }
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification-toast');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'warning' ? 'fa-exclamation-triangle' : 
                    type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification-toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: var(--bg-primary);
                    border-left: 4px solid var(--primary-color);
                    padding: 15px 20px;
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 1000;
                    animation: slideInRight 0.3s ease;
                    max-width: 300px;
                }
                
                .notification-toast.success {
                    border-left-color: var(--success-color);
                }
                
                .notification-toast.warning {
                    border-left-color: var(--warning-color);
                }
                
                .notification-toast.error {
                    border-left-color: var(--danger-color);
                }
                
                .notification-toast i {
                    font-size: 18px;
                }
                
                .notification-toast.info i {
                    color: var(--primary-color);
                }
                
                .notification-toast.success i {
                    color: var(--success-color);
                }
                
                .notification-toast.warning i {
                    color: var(--warning-color);
                }
                
                .notification-toast.error i {
                    color: var(--danger-color);
                }
                
                .notification-toast span {
                    font-size: 14px;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                @media (max-width: 768px) {
                    .notification-toast {
                        left: 20px;
                        right: 20px;
                        max-width: none;
                        animation: slideInUp 0.3s ease;
                    }
                    
                    @keyframes slideInUp {
                        from {
                            transform: translateY(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                    
                    @keyframes slideOutDown {
                        from {
                            transform: translateY(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateY(100%);
                            opacity: 0;
                        }
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = window.innerWidth <= 768 ? 'slideOutDown 0.3s ease' : 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // Initialize on load
    handleResize();
    
    // Add some sample data updates
    setInterval(() => {
        // Randomly update notification count
        const count = Math.floor(Math.random() * 5);
        const badgeEl = document.querySelector('.notification-count');
        if (badgeEl) badgeEl.textContent = count;
        
        // Update some stats randomly
        const stats = document.querySelectorAll('.stat-content h3');
        if (stats.length > 0 && Math.random() > 0.7) {
            const randomStat = stats[Math.floor(Math.random() * stats.length)];
            const current = parseInt(randomStat.textContent);
            if (!isNaN(current)) {
                randomStat.textContent = current + 1;
                showNotification('Stats updated!', 'success');
            }
        }
    }, 30000); // Update every 30 seconds
});