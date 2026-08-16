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
    const searchBtn = document.getElementById('searchBtn');
    const importBtn = document.getElementById('importBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importEmptyBtn = document.getElementById('importEmptyBtn');
    
    // Filter elements
    const eventFilter = document.getElementById('eventFilter');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const clearFilters = document.getElementById('clearFilters');
    const viewOptions = document.querySelectorAll('.view-option');
    
    // List elements
    const attendeesList = document.getElementById('attendeesList');
    const noAttendees = document.getElementById('noAttendees');
    const bulkAction = document.getElementById('bulkAction');
    const applyBulk = document.getElementById('applyBulk');
    
    // Pagination elements
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.querySelectorAll('.page-number');
    const itemsPerPage = document.getElementById('itemsPerPage');
    const showingFrom = document.getElementById('showingFrom');
    const showingTo = document.getElementById('showingTo');
    const totalAttendees = document.getElementById('totalAttendees');
    const attendeesCount = document.querySelector('.attendees-count');
    
    // Modal elements
    const attendeeModal = document.getElementById('attendeeModal');
    const modalTitle = document.getElementById('modalTitle');
    const attendeeDetailContainer = document.getElementById('attendeeDetailContainer');
    const closeModal = document.getElementById('closeModal');
    
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const closeSearch = document.getElementById('closeSearch');
    
    const importModal = document.getElementById('importModal');
    const importForm = document.getElementById('importForm');
    const importMethods = document.querySelectorAll('.import-method');
    const importContent = document.getElementById('importContent');
    const closeImportModal = document.getElementById('closeImportModal');
    const cancelImportBtn = document.getElementById('cancelImportBtn');
    const importSubmitBtn = document.getElementById('importSubmitBtn');
    
    const exportModal = document.getElementById('exportModal');
    const exportForm = document.getElementById('exportForm');
    const closeExportModal = document.getElementById('closeExportModal');
    const cancelExportBtn = document.getElementById('cancelExportBtn');
    const exportSubmitBtn = document.querySelector('#exportForm .export-submit-btn');
    
    // Sample attendees data
    const attendeesData = [
        {
            id: 1,
            name: 'Sarah Chen',
            email: 'sarah.chen@email.com',
            phone: '+1 (555) 123-4567',
            event: 'Music Festival',
            ticketType: 'VIP Pass',
            status: 'checked-in',
            registrationDate: '2024-12-10',
            checkInTime: '2024-12-10 17:30',
            avatar: 'Sarah',
            notes: 'VIP guest, special dietary requirements'
        },
        {
            id: 2,
            name: 'Michael Rodriguez',
            email: 'michael.r@email.com',
            phone: '+1 (555) 234-5678',
            event: 'Tech Conference',
            ticketType: 'Early Bird',
            status: 'registered',
            registrationDate: '2024-12-08',
            checkInTime: null,
            avatar: 'Michael',
            notes: 'Interested in AI workshops'
        },
        {
            id: 3,
            name: 'Emma Wilson',
            email: 'emma.wilson@email.com',
            phone: '+1 (555) 345-6789',
            event: 'AI Workshop',
            ticketType: 'General Admission',
            status: 'attended',
            registrationDate: '2024-12-05',
            checkInTime: '2024-12-12 09:15',
            avatar: 'Emma',
            notes: 'Student discount applied'
        },
        {
            id: 4,
            name: 'David Kim',
            email: 'david.kim@email.com',
            phone: '+1 (555) 456-7890',
            event: 'Startup Pitch Night',
            ticketType: 'Investor Pass',
            status: 'no-show',
            registrationDate: '2024-12-03',
            checkInTime: null,
            avatar: 'David',
            notes: 'Potential investor, follow up needed'
        },
        {
            id: 5,
            name: 'Lisa Park',
            email: 'lisa.park@email.com',
            phone: '+1 (555) 567-8901',
            event: 'Music Festival',
            ticketType: 'General Admission',
            status: 'checked-in',
            registrationDate: '2024-12-09',
            checkInTime: '2024-12-10 18:45',
            avatar: 'Lisa',
            notes: 'Group booking - 4 tickets'
        },
        {
            id: 6,
            name: 'James Wilson',
            email: 'james.w@email.com',
            phone: '+1 (555) 678-9012',
            event: 'Tech Conference',
            ticketType: 'Standard',
            status: 'registered',
            registrationDate: '2024-12-07',
            checkInTime: null,
            avatar: 'James',
            notes: 'Requested accessibility accommodations'
        },
        {
            id: 7,
            name: 'Maria Garcia',
            email: 'maria.g@email.com',
            phone: '+1 (555) 789-0123',
            event: 'AI Workshop',
            ticketType: 'Premium',
            status: 'attended',
            registrationDate: '2024-12-04',
            checkInTime: '2024-12-12 08:45',
            avatar: 'Maria',
            notes: 'Workshop leader'
        },
        {
            id: 8,
            name: 'Robert Chen',
            email: 'robert.chen@email.com',
            phone: '+1 (555) 890-1234',
            event: 'Startup Pitch Night',
            ticketType: 'Founder Pass',
            status: 'checked-in',
            registrationDate: '2024-12-02',
            checkInTime: '2024-12-05 19:00',
            avatar: 'Robert',
            notes: 'Event sponsor'
        }
    ];
    
    // State variables
    let currentFilters = {
        event: 'all',
        status: 'all',
        date: 'all',
        search: ''
    };
    let currentPage = 1;
    let itemsPerPageValue = 20;
    let selectedAttendees = new Set();
    let currentView = 'list';
    let allAttendees = [...attendeesData]; // Copy for adding/removing attendees
    
    // Initialize attendees page
    function initAttendees() {
        // Update date display
        updateDateDisplay();
        
        // Load attendees
        loadAttendees();
        
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
    
    // Load attendees with filters
    function loadAttendees() {
        // Filter attendees
        let filteredAttendees = allAttendees.filter(attendee => {
            // Event filter
            if (currentFilters.event !== 'all' && attendee.event.toLowerCase().replace(/\s+/g, '-') !== currentFilters.event) {
                return false;
            }
            
            // Status filter
            if (currentFilters.status !== 'all' && attendee.status !== currentFilters.status) {
                return false;
            }
            
            // Date filter (simplified)
            if (currentFilters.date !== 'all') {
                const regDate = new Date(attendee.registrationDate);
                const today = new Date();
                
                if (currentFilters.date === 'today') {
                    if (regDate.toDateString() !== today.toDateString()) return false;
                } else if (currentFilters.date === 'week') {
                    const weekAgo = new Date(today);
                    weekAgo.setDate(today.getDate() - 7);
                    if (regDate < weekAgo) return false;
                } else if (currentFilters.date === 'month') {
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(today.getMonth() - 1);
                    if (regDate < monthAgo) return false;
                }
            }
            
            // Search filter
            if (currentFilters.search) {
                const searchLower = currentFilters.search.toLowerCase();
                return (
                    attendee.name.toLowerCase().includes(searchLower) ||
                    attendee.email.toLowerCase().includes(searchLower) ||
                    attendee.event.toLowerCase().includes(searchLower)
                );
            }
            
            return true;
        });
        
        // Update counts
        const total = filteredAttendees.length;
        totalAttendees.textContent = total.toLocaleString();
        attendeesCount.textContent = `(${total})`;
        
        // Check if no attendees found
        if (total === 0) {
            attendeesList.style.display = 'none';
            noAttendees.style.display = 'block';
            return;
        }
        
        // Show attendees list
        attendeesList.style.display = 'block';
        noAttendees.style.display = 'none';
        
        // Calculate pagination
        const totalPages = Math.ceil(total / itemsPerPageValue);
        const startIndex = (currentPage - 1) * itemsPerPageValue;
        const endIndex = startIndex + itemsPerPageValue;
        const paginatedAttendees = filteredAttendees.slice(startIndex, endIndex);
        
        // Update pagination info
        showingFrom.textContent = startIndex + 1;
        showingTo.textContent = Math.min(endIndex, total);
        
        // Clear list
        attendeesList.innerHTML = '';
        
        // Add attendees to list
        paginatedAttendees.forEach(attendee => {
            const attendeeRow = createAttendeeRow(attendee);
            attendeesList.appendChild(attendeeRow);
        });
        
        // Update pagination buttons
        updatePagination(total, totalPages);
    }
    
    // Create attendee row element
    function createAttendeeRow(attendee) {
        const row = document.createElement('div');
        row.className = `attendee-row ${selectedAttendees.has(attendee.id) ? 'selected' : ''}`;
        row.dataset.id = attendee.id;
        
        // Format date
        const regDate = new Date(attendee.registrationDate);
        const dateString = regDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        // Get status badge
        let statusClass = '';
        let statusText = '';
        switch(attendee.status) {
            case 'registered':
                statusClass = 'status-registered';
                statusText = 'Registered';
                break;
            case 'checked-in':
                statusClass = 'status-checked-in';
                statusText = 'Checked In';
                break;
            case 'attended':
                statusClass = 'status-attended';
                statusText = 'Attended';
                break;
            case 'no-show':
                statusClass = 'status-no-show';
                statusText = 'No Show';
                break;
        }
        
        row.innerHTML = `
            <div class="attendee-checkbox">
                <input type="checkbox" ${selectedAttendees.has(attendee.id) ? 'checked' : ''}>
            </div>
            
            <div class="attendee-info">
                <div class="attendee-avatar">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${attendee.avatar}" alt="${attendee.name}">
                </div>
                <div class="attendee-details">
                    <h4>${attendee.name}</h4>
                    <p>${attendee.email}</p>
                    <span class="attendee-event">${attendee.event}</span>
                </div>
            </div>
            
            <div class="attendee-status">
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            
            <div class="attendee-date">${dateString}</div>
            
            <div class="attendee-actions">
                <button class="action-icon view" data-action="view">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-icon edit" data-action="edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-icon delete" data-action="delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners
        const checkbox = row.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedAttendees.add(attendee.id);
                row.classList.add('selected');
            } else {
                selectedAttendees.delete(attendee.id);
                row.classList.remove('selected');
            }
        });
        
        const actionButtons = row.querySelectorAll('.action-icon');
        actionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.dataset.action;
                handleAttendeeAction(action, attendee);
            });
        });
        
        // Add click event to view attendee
        row.addEventListener('click', function(e) {
            if (!e.target.closest('.attendee-checkbox') && !e.target.closest('.action-icon')) {
                showAttendeeDetails(attendee);
            }
        });
        
        return row;
    }
    
    // Handle attendee actions
    function handleAttendeeAction(action, attendee) {
        switch(action) {
            case 'view':
                showAttendeeDetails(attendee);
                break;
            case 'edit':
                editAttendee(attendee);
                break;
            case 'delete':
                deleteAttendee(attendee);
                break;
        }
    }
    
    // Show attendee details modal
    function showAttendeeDetails(attendee) {
        modalTitle.textContent = 'Attendee Details';
        
        // Format dates
        const regDate = new Date(attendee.registrationDate);
        const regDateString = regDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        let checkInString = 'Not checked in yet';
        if (attendee.checkInTime) {
            const checkInDate = new Date(attendee.checkInTime);
            checkInString = checkInDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        // Get status text
        let statusText = '';
        switch(attendee.status) {
            case 'registered': statusText = 'Registered'; break;
            case 'checked-in': statusText = 'Checked In'; break;
            case 'attended': statusText = 'Attended'; break;
            case 'no-show': statusText = 'No Show'; break;
        }
        
        attendeeDetailContainer.innerHTML = `
            <div class="attendee-detail-header">
                <div class="attendee-detail-avatar">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${attendee.avatar}" alt="${attendee.name}">
                </div>
                <div class="attendee-detail-info">
                    <h3>${attendee.name}</h3>
                    <p>${attendee.email}</p>
                    <span class="status-badge status-${attendee.status}">${statusText}</span>
                </div>
            </div>
            
            <div class="attendee-detail-grid">
                <div class="detail-item">
                    <h4>Phone</h4>
                    <p>${attendee.phone}</p>
                </div>
                
                <div class="detail-item">
                    <h4>Event</h4>
                    <p>${attendee.event}</p>
                </div>
                
                <div class="detail-item">
                    <h4>Ticket Type</h4>
                    <p>${attendee.ticketType}</p>
                </div>
                
                <div class="detail-item">
                    <h4>Registration Date</h4>
                    <p>${regDateString}</p>
                </div>
                
                <div class="detail-item">
                    <h4>Check-in Time</h4>
                    <p>${checkInString}</p>
                </div>
                
                <div class="detail-item">
                    <h4>Attendee ID</h4>
                    <p>#${attendee.id.toString().padStart(6, '0')}</p>
                </div>
            </div>
            
            <div class="detail-item">
                <h4>Notes</h4>
                <p>${attendee.notes || 'No additional notes'}</p>
            </div>
            
            <div class="detail-actions">
                <button class="action-btn check-in-btn" id="checkInBtn" ${attendee.status === 'checked-in' || attendee.status === 'attended' ? 'disabled' : ''}>
                    <i class="fas fa-check-circle"></i>
                    Check In
                </button>
                <button class="action-btn send-email-btn" id="sendEmailBtn">
                    <i class="fas fa-envelope"></i>
                    Send Email
                </button>
            </div>
        `;
        
        // Add event listeners for modal buttons
        const checkInBtn = document.getElementById('checkInBtn');
        if (checkInBtn) {
            checkInBtn.addEventListener('click', function() {
                checkInAttendee(attendee.id);
            });
        }
        
        const sendEmailBtn = document.getElementById('sendEmailBtn');
        if (sendEmailBtn) {
            sendEmailBtn.addEventListener('click', function() {
                alert(`Email would be sent to: ${attendee.email}`);
            });
        }
        
        // Show modal
        attendeeModal.classList.add('active');
    }
    
    // Edit attendee
    function editAttendee(attendee) {
        modalTitle.textContent = 'Edit Attendee';
        
        attendeeDetailContainer.innerHTML = `
            <form id="editAttendeeForm">
                <div class="form-group">
                    <label for="editName">Name</label>
                    <input type="text" id="editName" value="${attendee.name}" required>
                </div>
                
                <div class="form-group">
                    <label for="editEmail">Email</label>
                    <input type="email" id="editEmail" value="${attendee.email}" required>
                </div>
                
                <div class="form-group">
                    <label for="editPhone">Phone</label>
                    <input type="tel" id="editPhone" value="${attendee.phone}">
                </div>
                
                <div class="form-group">
                    <label for="editEvent">Event</label>
                    <select id="editEvent">
                        <option value="Music Festival" ${attendee.event === 'Music Festival' ? 'selected' : ''}>Music Festival</option>
                        <option value="Tech Conference" ${attendee.event === 'Tech Conference' ? 'selected' : ''}>Tech Conference</option>
                        <option value="AI Workshop" ${attendee.event === 'AI Workshop' ? 'selected' : ''}>AI Workshop</option>
                        <option value="Startup Pitch Night" ${attendee.event === 'Startup Pitch Night' ? 'selected' : ''}>Startup Pitch Night</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="editStatus">Status</label>
                    <select id="editStatus">
                        <option value="registered" ${attendee.status === 'registered' ? 'selected' : ''}>Registered</option>
                        <option value="checked-in" ${attendee.status === 'checked-in' ? 'selected' : ''}>Checked In</option>
                        <option value="attended" ${attendee.status === 'attended' ? 'selected' : ''}>Attended</option>
                        <option value="no-show" ${attendee.status === 'no-show' ? 'selected' : ''}>No Show</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="editNotes">Notes</label>
                    <textarea id="editNotes">${attendee.notes || ''}</textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="cancel-btn" id="cancelEditBtn">Cancel</button>
                    <button type="submit" class="import-submit-btn">
                        <i class="fas fa-save"></i>
                        Save Changes
                    </button>
                </div>
            </form>
        `;
        
        const editForm = document.getElementById('editAttendeeForm');
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Update attendee data
            const index = allAttendees.findIndex(a => a.id === attendee.id);
            if (index !== -1) {
                allAttendees[index] = {
                    ...allAttendees[index],
                    name: document.getElementById('editName').value,
                    email: document.getElementById('editEmail').value,
                    phone: document.getElementById('editPhone').value,
                    event: document.getElementById('editEvent').value,
                    status: document.getElementById('editStatus').value,
                    notes: document.getElementById('editNotes').value
                };
                
                // Update check-in time if status changed to checked-in
                if (allAttendees[index].status === 'checked-in' && !attendee.checkInTime) {
                    allAttendees[index].checkInTime = new Date().toISOString();
                }
                
                loadAttendees();
                attendeeModal.classList.remove('active');
                showNotification('Attendee updated successfully!');
            }
        });
        
        cancelEditBtn.addEventListener('click', function() {
            attendeeModal.classList.remove('active');
        });
        
        attendeeModal.classList.add('active');
    }
    
    // Delete attendee
    function deleteAttendee(attendee) {
        if (confirm(`Are you sure you want to delete ${attendee.name}? This action cannot be undone.`)) {
            const index = allAttendees.findIndex(a => a.id === attendee.id);
            if (index !== -1) {
                allAttendees.splice(index, 1);
                selectedAttendees.delete(attendee.id);
                loadAttendees();
                showNotification('Attendee deleted successfully!');
            }
        }
    }
    
    // Check in attendee
    function checkInAttendee(attendeeId) {
        const attendee = allAttendees.find(a => a.id === attendeeId);
        if (attendee) {
            attendee.status = 'checked-in';
            attendee.checkInTime = new Date().toISOString();
            loadAttendees();
            attendeeModal.classList.remove('active');
            showNotification(`${attendee.name} has been checked in!`);
        }
    }
    
    // Update pagination
    function updatePagination(total, totalPages) {
        // Previous button
        prevPage.disabled = currentPage === 1;
        
        // Next button
        nextPage.disabled = currentPage === totalPages || totalPages === 0;
        
        // Update page numbers (simplified - in real app you'd generate dynamic page numbers)
        pageNumbers.forEach((pageBtn, index) => {
            pageBtn.classList.toggle('active', index === 0 && currentPage === 1);
        });
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
        
        // Filter changes
        eventFilter.addEventListener('change', function() {
            currentFilters.event = this.value;
            currentPage = 1;
            loadAttendees();
        });
        
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            currentPage = 1;
            loadAttendees();
        });
        
        dateFilter.addEventListener('change', function() {
            currentFilters.date = this.value;
            currentPage = 1;
            loadAttendees();
        });
        
        // Clear filters
        clearFilters.addEventListener('click', function() {
            eventFilter.value = 'all';
            statusFilter.value = 'all';
            dateFilter.value = 'all';
            
            currentFilters.event = 'all';
            currentFilters.status = 'all';
            currentFilters.date = 'all';
            currentFilters.search = '';
            searchInput.value = '';
            
            currentPage = 1;
            loadAttendees();
        });
        
        // View options
        viewOptions.forEach(option => {
            option.addEventListener('click', function() {
                viewOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                currentView = this.dataset.view;
                // In a real app, you would update the view here
                console.log(`Switched to ${currentView} view`);
            });
        });
        
        // Search
        searchBtn.addEventListener('click', function() {
            searchModal.classList.add('active');
            searchInput.focus();
        });
        
        closeSearch.addEventListener('click', function() {
            searchModal.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        });
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length < 2) {
                searchResults.innerHTML = '<p class="search-hint">Type at least 2 characters to search</p>';
                return;
            }
            
            const results = allAttendees.filter(attendee => 
                attendee.name.toLowerCase().includes(searchTerm) ||
                attendee.email.toLowerCase().includes(searchTerm) ||
                attendee.event.toLowerCase().includes(searchTerm)
            );
            
            if (results.length === 0) {
                searchResults.innerHTML = '<p class="no-results">No attendees found</p>';
                return;
            }
            
            searchResults.innerHTML = results.slice(0, 10).map(attendee => `
                <div class="search-result-item" data-id="${attendee.id}">
                    <div class="search-result-avatar">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${attendee.avatar}" alt="${attendee.name}">
                    </div>
                    <div class="search-result-info">
                        <h4>${attendee.name}</h4>
                        <p>${attendee.email}</p>
                        <small>${attendee.event}</small>
                    </div>
                </div>
            `).join('');
            
            // Add click event to search results
            document.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', function() {
                    const attendeeId = parseInt(this.dataset.id);
                    const attendee = allAttendees.find(a => a.id === attendeeId);
                    if (attendee) {
                        searchModal.classList.remove('active');
                        searchInput.value = '';
                        searchResults.innerHTML = '';
                        showAttendeeDetails(attendee);
                    }
                });
            });
        });
        
        // Import
        importBtn.addEventListener('click', function() {
            importModal.classList.add('active');
            loadImportContent('csv');
        });
        
        importEmptyBtn.addEventListener('click', function() {
            importModal.classList.add('active');
            loadImportContent('csv');
        });
        
        importMethods.forEach(method => {
            method.addEventListener('click', function() {
                importMethods.forEach(m => m.classList.remove('active'));
                this.classList.add('active');
                const methodType = this.dataset.method;
                loadImportContent(methodType);
            });
        });
        
        closeImportModal.addEventListener('click', function() {
            importModal.classList.remove('active');
        });
        
        cancelImportBtn.addEventListener('click', function() {
            importModal.classList.remove('active');
        });
        
        importForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, you would handle the import here
            showNotification('Attendees imported successfully!');
            importModal.classList.remove('active');
        });
        
        // Export
        exportBtn.addEventListener('click', function() {
            exportModal.classList.add('active');
        });
        
        closeExportModal.addEventListener('click', function() {
            exportModal.classList.remove('active');
        });
        
        cancelExportBtn.addEventListener('click', function() {
            exportModal.classList.remove('active');
        });
        
        exportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const format = document.getElementById('exportFormat').value;
            const event = document.getElementById('exportEvent').value;
            const email = document.getElementById('exportEmail').value;
            
            // Get selected fields
            const selectedFields = [];
            document.querySelectorAll('input[name="exportFields"]:checked').forEach(checkbox => {
                selectedFields.push(checkbox.value);
            });
            
            // Filter attendees based on event
            let attendeesToExport = allAttendees;
            if (event !== 'all') {
                attendeesToExport = allAttendees.filter(a => 
                    a.event.toLowerCase().replace(/\s+/g, '-') === event
                );
            }
            
            // In a real app, you would generate and download the export file here
            console.log(`Exporting ${attendeesToExport.length} attendees to ${format} format`);
            console.log('Selected fields:', selectedFields);
            
            if (email) {
                showNotification(`Export will be sent to ${email}`);
            } else {
                showNotification(`Exporting ${attendeesToExport.length} attendees to ${format} format`);
            }
            
            exportModal.classList.remove('active');
        });
        
        // Bulk actions
        applyBulk.addEventListener('click', function() {
            const action = bulkAction.value;
            if (!action) {
                alert('Please select a bulk action');
                return;
            }
            
            if (selectedAttendees.size === 0) {
                alert('Please select at least one attendee');
                return;
            }
            
            switch(action) {
                case 'email':
                    alert(`Sending email to ${selectedAttendees.size} selected attendees`);
                    break;
                case 'checkin':
                    selectedAttendees.forEach(id => {
                        const attendee = allAttendees.find(a => a.id === id);
                        if (attendee && attendee.status === 'registered') {
                            attendee.status = 'checked-in';
                            attendee.checkInTime = new Date().toISOString();
                        }
                    });
                    loadAttendees();
                    showNotification(`${selectedAttendees.size} attendees checked in!`);
                    break;
                case 'export':
                    alert(`Exporting ${selectedAttendees.size} selected attendees`);
                    break;
                case 'delete':
                    if (confirm(`Are you sure you want to delete ${selectedAttendees.size} selected attendees?`)) {
                        allAttendees = allAttendees.filter(attendee => !selectedAttendees.has(attendee.id));
                        selectedAttendees.clear();
                        loadAttendees();
                        showNotification(`${selectedAttendees.size} attendees deleted!`);
                    }
                    break;
            }
            
            bulkAction.value = '';
        });
        
        // Pagination
        prevPage.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                loadAttendees();
            }
        });
        
        nextPage.addEventListener('click', function() {
            currentPage++;
            loadAttendees();
        });
        
        pageNumbers.forEach(pageBtn => {
            pageBtn.addEventListener('click', function() {
                const pageNum = parseInt(this.textContent);
                if (!isNaN(pageNum)) {
                    currentPage = pageNum;
                    loadAttendees();
                }
            });
        });
        
        itemsPerPage.addEventListener('change', function() {
            itemsPerPageValue = parseInt(this.value);
            currentPage = 1;
            loadAttendees();
        });
        
        // Modal close
        closeModal.addEventListener('click', function() {
            attendeeModal.classList.remove('active');
        });
        
        // Close modals when clicking outside
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
            }
        });
        
        // Close search modal when clicking outside
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('search-modal')) {
                e.target.classList.remove('active');
                searchInput.value = '';
                searchResults.innerHTML = '';
            }
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                attendeeModal.classList.remove('active');
                searchModal.classList.remove('active');
                importModal.classList.remove('active');
                exportModal.classList.remove('active');
            }
        });
    }
    
    // Load import content based on method
    function loadImportContent(method) {
        if (method === 'csv') {
            importContent.innerHTML = `
                <div class="form-group">
                    <label for="csvFile">Select CSV File</label>
                    <input type="file" id="csvFile" accept=".csv" required>
                    <small class="hint">CSV should contain columns: name, email, phone, event, ticket_type, status</small>
                </div>
                
                <div class="form-group">
                    <label for="importEvent">Assign to Event</label>
                    <select id="importEvent">
                        <option value="">Select Event (Optional)</option>
                        <option value="music-festival">Music Festival</option>
                        <option value="tech-conference">Tech Conference</option>
                        <option value="ai-workshop">AI Workshop</option>
                        <option value="startup-pitch">Startup Pitch Night</option>
                    </select>
                </div>
            `;
        } else if (method === 'manual') {
            importContent.innerHTML = `
                <div class="manual-entry-container" id="manualEntries">
                    <div class="manual-entry">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="entry-name" placeholder="Full Name" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" class="entry-email" placeholder="email@example.com" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="tel" class="entry-phone" placeholder="+1 (555) 123-4567">
                        </div>
                        
                        <div class="form-group">
                            <label>Event</label>
                            <select class="entry-event">
                                <option value="Music Festival">Music Festival</option>
                                <option value="Tech Conference">Tech Conference</option>
                                <option value="AI Workshop">AI Workshop</option>
                                <option value="Startup Pitch Night">Startup Pitch Night</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <button type="button" class="add-another-btn" id="addAnotherBtn">
                    <i class="fas fa-plus"></i>
                    Add Another Attendee
                </button>
            `;
            
            // Add event listener for adding more entries
            document.getElementById('addAnotherBtn').addEventListener('click', addManualEntry);
        }
    }
    
    // Add manual entry form
    function addManualEntry() {
        const manualEntries = document.getElementById('manualEntries');
        const newEntry = document.createElement('div');
        newEntry.className = 'manual-entry';
        newEntry.innerHTML = `
            <div class="form-group">
                <label>Name</label>
                <input type="text" class="entry-name" placeholder="Full Name" required>
            </div>
            
            <div class="form-group">
                <label>Email</label>
                <input type="email" class="entry-email" placeholder="email@example.com" required>
            </div>
            
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" class="entry-phone" placeholder="+1 (555) 123-4567">
            </div>
            
            <div class="form-group">
                <label>Event</label>
                <select class="entry-event">
                    <option value="Music Festival">Music Festival</option>
                    <option value="Tech Conference">Tech Conference</option>
                    <option value="AI Workshop">AI Workshop</option>
                    <option value="Startup Pitch Night">Startup Pitch Night</option>
                </select>
            </div>
            
            <button type="button" class="remove-entry-btn">
                <i class="fas fa-times"></i>
                Remove
            </button>
        `;
        
        manualEntries.appendChild(newEntry);
        
        // Add event listener for remove button
        newEntry.querySelector('.remove-entry-btn').addEventListener('click', function() {
            if (manualEntries.children.length > 1) {
                manualEntries.removeChild(newEntry);
            } else {
                alert('At least one entry is required');
            }
        });
    }
    
    // Show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 15px 20px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideIn 0.3s ease forwards;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
        
        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Initialize the page
    initAttendees();
});