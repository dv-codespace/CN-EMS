const API_BASE = "http://localhost:3000";
const token = localStorage.getItem("token");

let dashboardEvents = [];

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
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

    document.getElementById("logout").addEventListener("click", () => {
        const confirmLogout = confirm("Do you want to logout?");

        if (!confirmLogout) return;

        // 🔥 Clear everything
        localStorage.clear();
        sessionStorage.clear(); // optional but good

        // 🚀 Redirect to login
        window.location.href = "../../auth.html";
    });

    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const currentDate = document.getElementById('currentDate');
    const currentMonth = document.getElementById('currentMonth');
    const calendarDays = document.getElementById('calendarDays');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    // Current date for calendar
    let currentCalendarDate = new Date();
    
    // Initialize the dashboard
    initDashboard();
    
    // Initialize dashboard
    function initDashboard() {
        // Update date display
        updateDateDisplay();
        fetchDashboardEvents();
        
        // Generate calendar
        generateCalendar();
        
        // Setup event listeners
        setupEventListeners();
        
        // Update date every minute
        setInterval(updateDateDisplay, 60000);
    }
    
    // Fetch events for dashboard
    async function fetchDashboardEvents() {
    try {
        if (!token) {
            showNotification("Please login again");
            return;
        }

        const response = await fetch(`${API_BASE}/organizer/events`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        dashboardEvents = data.events || [];

        updateStats();
        renderUpcomingEvents();
        generateCalendar(); // refresh calendar with real event days
        renderLiveEvents();

    } catch (error) {
        console.error(error);
        showNotification("Failed to load dashboard data");
    }
}

    function updateStats() {
    document.getElementById("totalEvents").textContent = dashboardEvents.length;

    // Placeholder until registration system built
    document.getElementById("totalAttendees").textContent = 0;
    document.getElementById("ticketsSold").textContent = 0;
    document.getElementById("totalRevenue").textContent = "$0";
}

    function renderUpcomingEvents() {
    const container = document.getElementById("upcomingEventsContainer");
    container.innerHTML = "";

    const upcoming = dashboardEvents
        .filter(e => e.status === "PUBLISHED")
        .slice(0, 3);

    upcoming.forEach(event => {
        const div = document.createElement("div");
        div.className = "event-item";

        div.innerHTML = `
            <div class="event-icon">
                <i class="fas fa-calendar"></i>
            </div>
            <div class="event-details">
                <h4>${event.title}</h4>
                <p><i class="fas fa-clock"></i> ${event.date || "Date not set"}</p>
            </div>
            <div class="event-attendees">
                <span>0</span>
                <small>attending</small>
            </div>
        `;

        container.appendChild(div);
    });
}

    function renderLiveEvents() {
    const container = document.getElementById("liveEventsContainer");
    container.innerHTML = "";

    const live = dashboardEvents.filter(e => e.status === "PUBLISHED");

    live.slice(0, 2).forEach(event => {
        const div = document.createElement("div");
        div.className = "live-event";

        div.innerHTML = `
            <div class="live-details">
                <h4>${event.title}</h4>
                <p>0 attending</p>
            </div>
            <span class="status-badge active">Active</span>
        `;

        container.appendChild(div);
    });
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
    
    // Generate calendar
    function generateCalendar() {
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
        const eventDays = dashboardEvents.map(e => {
    if (!e.date) return null;
    const d = new Date(e.date);
    return d.getDate();
}).filter(Boolean);
 // Example event days
        
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
            
            // Check if has event
            if (eventDays.includes(day)) {
                dayEl.classList.add('event');
            }
            
            // Add click event
            dayEl.addEventListener('click', function() {
                alert(`Selected: ${month + 1}/${day}/${year}`);
            });
            
            calendarDays.appendChild(dayEl);
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Mobile menu toggle
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('sidebar-active');
        });
        
        // Close sidebar when clicking on main content on mobile
        mainContent.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
        
        // Calendar navigation
        prevMonthBtn.addEventListener('click', function() {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            generateCalendar();
        });
        
        nextMonthBtn.addEventListener('click', function() {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            generateCalendar();
        });
        
        // Quick action buttons
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            action.addEventListener('click', function() {
                const actionText = this.querySelector('span').textContent;
                showNotification(`Action: ${actionText} clicked!`);
            });
        });
        
        // Event item clicks
        const eventItems = document.querySelectorAll('.event-item');
        eventItems.forEach(item => {
            item.addEventListener('click', function() {
                const eventTitle = this.querySelector('h4').textContent;
                showNotification(`Opening details for: ${eventTitle}`);
            });
        });
        
        // Action buttons in top bar
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.querySelector('.fa-search')) {
                    showNotification('Search feature coming soon!');
                } else if (this.querySelector('.fa-bell')) {
                    showNotification('No new notifications');
                } else if (this.querySelector('.fa-user')) {
                    showNotification('Opening user profile');
                }
            });
        });
        
        // Navigation menu items
        const navLinks = document.querySelectorAll('.nav-menu a');

            navLinks.forEach(link => {
            link.addEventListener('click', function () {

            // Remove active from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active to clicked link
            this.classList.add('active');

            // Optional popup message
            showNotification(`Opening: ${this.textContent}`);
            });
        });
        const currentPage = location.pathname.split('/').pop();

            navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });


        
        // View all links
        const viewAllLinks = document.querySelectorAll('.view-all');
        viewAllLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Opening all items...');
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', handleResize);
        
        // Handle escape key to close sidebar
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    }
    
    // Handle window resize
    function handleResize() {
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
    function showNotification(message) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification-toast');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
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
                
                .notification-toast i {
                    color: var(--primary-color);
                    font-size: 18px;
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
});