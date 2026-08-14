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
    const eventsGrid = document.getElementById('eventsGrid');
    const noEvents = document.getElementById('noEvents');
    
    // Filter elements
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const clearFilters = document.getElementById('clearFilters');
    const searchBtn = document.getElementById('searchBtn');
    const filterBtn = document.getElementById('filterBtn');
    const createEventBtn = document.getElementById('createEventBtn');
    const createEmptyBtn = document.getElementById('createEmptyBtn');
    
    // Modal elements
    const eventModal = document.getElementById('eventModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.getElementById('closeModal');
    
    // Search elements
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const closeSearch = document.getElementById('closeSearch');
    
    // Pagination elements
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.querySelectorAll('.page-number');
    
    // Sample events data
    let eventsData = [];
    
    // Current filters
    let currentFilters = {
        status: 'all',
        category: 'all',
        date: 'all',
        search: ''
    };
    
    // Current page
    let currentPage = 1;
    const eventsPerPage = 6;
    
    // Initialize the page
    function initMyEvents() {
        // Update date display
        updateDateDisplay();
        
        // Load events
        fetchMyEvents();
        
        // Setup event listeners
        setupEventListeners();
        
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
    
    function updateSummary() {
    const total = eventsData.length;

    const upcoming = eventsData.filter(e => e.status === "PUBLISHED").length;
    const draft = eventsData.filter(e => e.status === "DRAFT").length;

    document.querySelectorAll(".summary-content h3")[0].textContent = total;
    document.querySelectorAll(".summary-content h3")[1].textContent = upcoming;
    document.querySelectorAll(".summary-content h3")[2].textContent = 0; // live future
    document.querySelectorAll(".summary-content h3")[3].textContent = draft;
}

    async function fetchMyEvents() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            showNotification("Please login again.");
            return;
        }

        const response = await fetch("http://localhost:3000/organizer/events", {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch events");
        }

        eventsData = data.events || [];

        updateSummary();
        loadEvents();

    } catch (error) {
        console.error("Fetch events error:", error);
        showNotification("Error loading events");
    }
}

    // Load events with filters
    function loadEvents() {
        // Filter events
        let filteredEvents = eventsData.filter(event => {
            // Status filter
            if (currentFilters.status !== 'all' && event.status !== currentFilters.status) {
                return false;
            }
            
            // Category filter
            if (currentFilters.category !== 'all' && event.category !== currentFilters.category) {
                return false;
            }
            
            // Date filter (simplified)
            if (currentFilters.date !== 'all') {
                const eventDate = new Date(event.date);
                const today = new Date();
                
                if (currentFilters.date === 'today') {
                    if (eventDate.toDateString() !== today.toDateString()) return false;
                } else if (currentFilters.date === 'week') {
                    const weekFromNow = new Date(today);
                    weekFromNow.setDate(today.getDate() + 7);
                    if (eventDate < today || eventDate > weekFromNow) return false;
                } else if (currentFilters.date === 'month') {
                    const monthFromNow = new Date(today);
                    monthFromNow.setMonth(today.getMonth() + 1);
                    if (eventDate < today || eventDate > monthFromNow) return false;
                }
            }
            
            // Search filter
            if (currentFilters.search) {
                const searchLower = currentFilters.search.toLowerCase();
                return (
                    event.title.toLowerCase().includes(searchLower) ||
                    event.description.toLowerCase().includes(searchLower) ||
                    event.location.toLowerCase().includes(searchLower)
                );
            }
            
            return true;
        });
        
        // Check if no events found
        if (filteredEvents.length === 0) {
            eventsGrid.style.display = 'none';
            noEvents.style.display = 'block';
            document.querySelector('.pagination').style.display = 'none';
            return;
        }
        
        // Show events grid
        eventsGrid.style.display = 'grid';
        noEvents.style.display = 'none';
        document.querySelector('.pagination').style.display = 'flex';
        
        // Calculate pagination
        const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
        const startIndex = (currentPage - 1) * eventsPerPage;
        const endIndex = startIndex + eventsPerPage;
        const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
        
        // Clear grid
        eventsGrid.innerHTML = '';
        
        // Add events to grid
        paginatedEvents.forEach(event => {
            const eventCard = createEventCard(event);
            eventsGrid.appendChild(eventCard);
        });
        
        // Update pagination buttons
        updatePagination(filteredEvents.length, totalPages);
    }
    
    // Create event card element
    function createEventCard(event) {
        // Safe defaults to prevent undefined
        event.description = event.description || "No description provided";
        event.location = event.location || "Location not specified";
        event.date = event.date || "Date not set";
        event.category = event.category || "General";
        event.time = event.time || "Time not set";
        event.attendees = event.attendees || 0;
        event.revenue = event.revenue || 0;
        event.tickets = event.tickets || 0;
        event.tags = event.tags || [];
        event.capacity = event.capacity || 0;

        const card = document.createElement('div');
        card.className = 'event-card';
        card.dataset.id = event.id;
        
        // Format date
        const eventDate = new Date(event.date);
        const dateString = eventDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        // Get status class and text
        let statusClass = '';
        let statusText = '';
        let uiStatus = event.status;

        if (event.status === "PUBLISHED") {
            uiStatus = "upcoming";
        }
        if (event.status === "DRAFT") {
            uiStatus = "draft";
        }

        switch(uiStatus) {
            case 'upcoming':
                statusClass = 'status-upcoming';
                statusText = 'Upcoming';
                break;
            case 'live':
                statusClass = 'status-live';
                statusText = 'Live Now';
                break;
            case 'completed':
                statusClass = 'status-completed';
                statusText = 'Completed';
                break;
            case 'draft':
                statusClass = 'status-draft';
                statusText = 'Draft';
                break;
        }
        
        // Get category text
        let categoryText = '';
        switch(event.category) {
            case 'conference':
                categoryText = 'Conference';
                break;
            case 'workshop':
                categoryText = 'Workshop';
                break;
            case 'concert':
                categoryText = 'Concert';
                break;
            case 'meeting':
                categoryText = 'Meeting';
                break;
        }
        
        card.innerHTML = `
            <div class="event-header">
                <div>
                    <h3 class="event-title">${event.title}</h3>
                    <span class="event-category">${categoryText}</span>
                </div>
                <span class="event-status ${statusClass}">${statusText}</span>
            </div>
            
            <div class="event-body">
                <div class="event-details">
                    <div class="event-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${dateString} • ${event.time}</span>
                    </div>
                    <div class="event-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    <div class="event-detail">
                        <i class="fas fa-info-circle"></i>
                        <span>${event.description}</span>
                    </div>
                </div>
                
                <div class="event-stats">
                    <div class="stat">
                        <span class="stat-value">${event.attendees}</span>
                        <span class="stat-label">Attendees</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${event.tickets}</span>
                        <span class="stat-label">Tickets</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${event.revenue}</span>
                        <span class="stat-label">Revenue</span>
                    </div>
                </div>
            </div>
            
            <div class="event-footer">
                <button class="action-button view" data-action="view">
                    <i class="fas fa-eye"></i>
                    View
                </button>
                <button class="action-button edit" data-action="edit" onclick="editEvent('${event.eventId}')">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="action-button delete" data-action="delete">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        `;
        
        // Add event listeners to action buttons
        const actionButtons = card.querySelectorAll('.action-button');
        actionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.dataset.action;
                handleEventAction(action, event);
            });
        });
        
        // Add click event to view event details
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.action-button')) {
                handleEventAction('view', event);
            }
        });
        
        return card;
    }
    
    

    // Handle event actions
    function handleEventAction(action, event) {
        switch(action) {
            case 'view':
                showEventDetails(event);
                break;
            case 'edit':
                editEvent(event);
                break;
            case 'delete':
                deleteEvent(event);
                break;
        }
    }
    
    // Show event details modal
    function showEventDetails(event) {
        modalTitle.textContent = event.title;
        
        const eventDate = new Date(event.date);
        const dateString = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        modalBody.innerHTML = `
            <div class="event-modal-details">
                <div class="detail-row">
                    <strong>Status:</strong>
                    <span class="status-${event.status}">${event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span>
                </div>
                <div class="detail-row">
                    <strong>Date & Time:</strong>
                    <span>${dateString} at ${event.time}</span>
                </div>
                <div class="detail-row">
                    <strong>Location:</strong>
                    <span>${event.location}</span>
                </div>
                <div class="detail-row">
                    <strong>Category:</strong>
                    <span>${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
                </div>
                <div class="detail-row">
                    <strong>Description:</strong>
                    <p>${event.description}</p>
                </div>
                <div class="detail-row">
                    <strong>Attendees:</strong>
                    <span>${event.attendees} registered</span>
                </div>
                <div class="detail-row">
                    <strong>Tickets Sold:</strong>
                    <span>${event.tickets}</span>
                </div>
                <div class="detail-row">
                    <strong>Revenue:</strong>
                    <span>${event.revenue}</span>
                </div>
                
                <div class="modal-actions">
                    <button class="modal-action-btn primary" id="editModalBtn">
                        <i class="fas fa-edit"></i>
                        Edit Event
                    </button>
                    <button class="modal-action-btn" id="closeModalBtn">
                        <i class="fas fa-times"></i>
                        Close
                    </button>
                </div>
            </div>
        `;
        
        eventModal.classList.add('active');
        
        // Add event listeners to modal buttons
        document.getElementById('editModalBtn').addEventListener('click', function() {
            eventModal.classList.remove('active');
            editEvent(event);
        });
        
        document.getElementById('closeModalBtn').addEventListener('click', function() {
            eventModal.classList.remove('active');
        });
    }
    
    // Edit event
    function editEvent(event) {
        showNotification(`Editing event: ${event.title}`);
        // In a real app, this would open an edit form
    }
    
    // Delete event
    async function deleteEvent(event) {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;

    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:3000/organizer/events/${event.eventId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        showNotification("Event deleted successfully");
        fetchMyEvents();

    } catch (error) {
        console.error(error);
        showNotification("Error deleting event");
    }
}

    
    // Update pagination
    function updatePagination(totalEvents, totalPages) {
        // Previous button
        prevPage.disabled = currentPage === 1;
        
        // Next button
        nextPage.disabled = currentPage === totalPages;
        
        // Page numbers
        pageNumbers.forEach((page, index) => {
            page.classList.toggle('active', index + 1 === currentPage);
        });
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
        
        // Filter changes
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            currentPage = 1;
            loadEvents();
        });
        
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            currentPage = 1;
            loadEvents();
        });
        
        dateFilter.addEventListener('change', function() {
            currentFilters.date = this.value;
            currentPage = 1;
            loadEvents();
        });
        
        // Clear filters
        clearFilters.addEventListener('click', function() {
            statusFilter.value = 'all';
            categoryFilter.value = 'all';
            dateFilter.value = 'all';
            currentFilters = { status: 'all', category: 'all', date: 'all', search: '' };
            currentPage = 1;
            loadEvents();
            showNotification('Filters cleared');
        });
        
        // Search button
        searchBtn.addEventListener('click', function() {
            searchModal.classList.add('active');
            searchInput.focus();
        });
        
        // Filter button
        filterBtn.addEventListener('click', function() {
            showNotification('Advanced filters coming soon!');
        });
        
        // Create event buttons
        createEventBtn.addEventListener('click', function() {
            showNotification('Create new event form opening...');
            // In a real app, this would navigate to create event page
        });
        
        createEmptyBtn.addEventListener('click', function() {
            showNotification('Create new event form opening...');
            // In a real app, this would navigate to create event page
        });
        
        // Close modal
        closeModal.addEventListener('click', function() {
            eventModal.classList.remove('active');
        });
        
        // Close modal when clicking outside
        eventModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
        
        // Search functionality
        closeSearch.addEventListener('click', function() {
            searchModal.classList.remove('active');
            searchInput.value = '';
        });
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            currentFilters.search = searchTerm;
            currentPage = 1;
            
            if (searchTerm.length >= 2) {
                loadEvents();
                showSearchResults(searchTerm);
            } else if (searchTerm.length === 0) {
                currentFilters.search = '';
                loadEvents();
                searchResults.innerHTML = '';
            }
        });
        
        // Close search when clicking outside
        searchModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                searchInput.value = '';
                currentFilters.search = '';
                loadEvents();
            }
        });
        
        // Pagination
        prevPage.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                loadEvents();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        
        nextPage.addEventListener('click', function() {
            currentPage++;
            loadEvents();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        pageNumbers.forEach(page => {
            page.addEventListener('click', function() {
                currentPage = parseInt(this.textContent);
                loadEvents();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', handleResize);
        
        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
                if (eventModal.classList.contains('active')) {
                    eventModal.classList.remove('active');
                }
                if (searchModal.classList.contains('active')) {
                    searchModal.classList.remove('active');
                    searchInput.value = '';
                    currentFilters.search = '';
                    loadEvents();
                }
            }
        });
    }
    
    // Show search results
    function showSearchResults(searchTerm) {
        const results = eventsData.filter(event => {
            const searchLower = searchTerm.toLowerCase();
            return (
                event.title.toLowerCase().includes(searchLower) ||
                event.description.toLowerCase().includes(searchLower) ||
                event.location.toLowerCase().includes(searchLower)
            );
        });
        
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No events found matching your search.</p>';
            return;
        }
        
        results.forEach(event => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <h4>${event.title}</h4>
                <p>${event.description}</p>
                <small>${event.location} • ${new Date(event.date).toLocaleDateString()}</small>
            `;
            
            resultItem.addEventListener('click', function() {
                searchModal.classList.remove('active');
                searchInput.value = '';
                showEventDetails(event);
            });
            
            searchResults.appendChild(resultItem);
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
    
    // Initialize the page
    initMyEvents();
    handleResize();
});

function editEvent(eventId) {
        localStorage.setItem("editEventId", eventId);
        window.location.href = "org-createevent.html";
    }