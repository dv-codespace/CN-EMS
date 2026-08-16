// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const currentDate = document.getElementById('currentDate');
    
    // Action buttons
    const addUserBtn = document.getElementById('addUserBtn');
    const exportUsersBtn = document.getElementById('exportUsersBtn');
    const filterBtn = document.getElementById('filterBtn');
    const clearFilters = document.getElementById('clearFilters');
    const userSearch = document.getElementById('userSearch');
    
    // Filter elements
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    // Table elements
    const selectAllCheckbox = document.getElementById('selectAll');
    const bulkActionSelect = document.getElementById('bulkAction');
    const applyBulkBtn = document.getElementById('applyBulk');
    const usersTableBody = document.getElementById('usersTableBody');
    const showingFrom = document.getElementById('showingFrom');
    const showingTo = document.getElementById('showingTo');
    const totalUsersCount = document.getElementById('totalUsersCount');
    const itemsPerPage = document.getElementById('itemsPerPage');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.querySelectorAll('.page-number');
    
    // Modal elements
    const addUserModal = document.getElementById('addUserModal');
    const addUserForm = document.getElementById('addUserForm');
    const closeAddUserModal = document.getElementById('closeAddUserModal');
    const cancelAddUser = document.getElementById('cancelAddUser');
    
    const editUserModal = document.getElementById('editUserModal');
    const editUserForm = document.getElementById('editUserForm');
    const closeEditUserModal = document.getElementById('closeEditUserModal');
    const cancelEditUser = document.getElementById('cancelEditUser');
    
    const userDetailModal = document.getElementById('userDetailModal');
    const closeUserDetailModal = document.getElementById('closeUserDetailModal');
    const userDetailContainer = document.getElementById('userDetailContainer');
    
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');
    const deleteUserInfo = document.getElementById('deleteUserInfo');
    
    // Stats elements
    const totalUsers = document.getElementById('totalUsers');
    const activeUsers = document.getElementById('activeUsers');
    const organizerUsers = document.getElementById('organizerUsers');
    const adminUsers = document.getElementById('adminUsers');
    
    // State variables
    let users = [];
    let currentFilters = {
        role: 'all',
        status: 'all',
        date: 'all',
        sort: 'newest',
        search: ''
    };
    let currentPage = 1;
    let itemsPerPageValue = 25;
    let selectedUsers = new Set();
    let userToDelete = null;
    
    // Sample users data
    const sampleUsers = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'organizer',
            status: 'active',
            registered: '2024-01-15',
            lastActive: '2024-03-20 14:30',
            events: 12,
            avatar: 'John',
            permissions: ['create_events', 'manage_events'],
            bio: 'Event organizer with 5+ years experience',
            phone: '+1 (555) 123-4567',
            company: 'EventPro Solutions'
        },
        {
            id: 2,
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.j@example.com',
            role: 'attendee',
            status: 'active',
            registered: '2024-02-10',
            lastActive: '2024-03-19 09:15',
            events: 3,
            avatar: 'Sarah',
            permissions: [],
            bio: 'Regular event attendee',
            phone: '+1 (555) 987-6543',
            company: null
        },
        {
            id: 3,
            firstName: 'Mike',
            lastName: 'Chen',
            email: 'mike.chen@example.com',
            role: 'organizer',
            status: 'pending',
            registered: '2024-03-05',
            lastActive: '2024-03-18 16:45',
            events: 0,
            avatar: 'Mike',
            permissions: ['create_events'],
            bio: 'New event organizer',
            phone: '+1 (555) 456-7890',
            company: 'Tech Events Inc.'
        },
        {
            id: 4,
            firstName: 'Emma',
            lastName: 'Wilson',
            email: 'emma.w@example.com',
            role: 'admin',
            status: 'active',
            registered: '2023-12-20',
            lastActive: '2024-03-20 11:20',
            events: 45,
            avatar: 'Emma',
            permissions: ['create_events', 'manage_events', 'view_reports', 'manage_users'],
            bio: 'System administrator',
            phone: '+1 (555) 234-5678',
            company: 'Evento Platform'
        },
        {
            id: 5,
            firstName: 'David',
            lastName: 'Kim',
            email: 'david.kim@example.com',
            role: 'attendee',
            status: 'inactive',
            registered: '2024-01-25',
            lastActive: '2024-02-28 13:10',
            events: 1,
            avatar: 'David',
            permissions: [],
            bio: 'Occasional event attendee',
            phone: '+1 (555) 876-5432',
            company: null
        },
        {
            id: 6,
            firstName: 'Lisa',
            lastName: 'Park',
            email: 'lisa.park@example.com',
            role: 'moderator',
            status: 'active',
            registered: '2024-02-15',
            lastActive: '2024-03-19 17:30',
            events: 8,
            avatar: 'Lisa',
            permissions: ['create_events', 'manage_events', 'view_reports'],
            bio: 'Content moderator',
            phone: '+1 (555) 345-6789',
            company: 'Event Management Co.'
        },
        {
            id: 7,
            firstName: 'Robert',
            lastName: 'Smith',
            email: 'robert.s@example.com',
            role: 'organizer',
            status: 'suspended',
            registered: '2024-01-10',
            lastActive: '2024-02-15 10:45',
            events: 5,
            avatar: 'Robert',
            permissions: ['create_events', 'manage_events'],
            bio: 'Event organizer',
            phone: '+1 (555) 765-4321',
            company: 'Creative Events Ltd.'
        },
        {
            id: 8,
            firstName: 'Maria',
            lastName: 'Garcia',
            email: 'maria.g@example.com',
            role: 'attendee',
            status: 'active',
            registered: '2024-03-01',
            lastActive: '2024-03-20 08:20',
            events: 7,
            avatar: 'Maria',
            permissions: [],
            bio: 'Active event participant',
            phone: '+1 (555) 987-1234',
            company: null
        }
    ];
    
    // Initialize user management
    function initUserManagement() {
        // Update date display
        updateDateDisplay();
        
        // Load users
        users = [...sampleUsers];
        loadUsers();
        
        // Update stats
        updateUserStats();
        
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
    
    // Load users with filters
    function loadUsers() {
        // Filter users
        let filteredUsers = users.filter(user => {
            // Role filter
            if (currentFilters.role !== 'all' && user.role !== currentFilters.role) {
                return false;
            }
            
            // Status filter
            if (currentFilters.status !== 'all' && user.status !== currentFilters.status) {
                return false;
            }
            
            // Date filter (simplified)
            if (currentFilters.date !== 'all') {
                const regDate = new Date(user.registered);
                const now = new Date();
                
                if (currentFilters.date === 'today') {
                    if (regDate.toDateString() !== now.toDateString()) return false;
                } else if (currentFilters.date === 'week') {
                    const weekAgo = new Date(now);
                    weekAgo.setDate(now.getDate() - 7);
                    if (regDate < weekAgo) return false;
                } else if (currentFilters.date === 'month') {
                    const monthAgo = new Date(now);
                    monthAgo.setMonth(now.getMonth() - 1);
                    if (regDate < monthAgo) return false;
                } else if (currentFilters.date === 'year') {
                    const yearAgo = new Date(now);
                    yearAgo.setFullYear(now.getFullYear() - 1);
                    if (regDate < yearAgo) return false;
                }
            }
            
            // Search filter
            if (currentFilters.search) {
                const searchLower = currentFilters.search.toLowerCase();
                return (
                    user.firstName.toLowerCase().includes(searchLower) ||
                    user.lastName.toLowerCase().includes(searchLower) ||
                    user.email.toLowerCase().includes(searchLower)
                );
            }
            
            return true;
        });
        
        // Sort users
        filteredUsers.sort((a, b) => {
            switch(currentFilters.sort) {
                case 'oldest':
                    return new Date(a.registered) - new Date(b.registered);
                case 'name_asc':
                    return a.firstName.localeCompare(b.firstName);
                case 'name_desc':
                    return b.firstName.localeCompare(a.firstName);
                case 'activity':
                    return new Date(b.lastActive) - new Date(a.lastActive);
                default: // 'newest'
                    return new Date(b.registered) - new Date(a.registered);
            }
        });
        
        // Update total count
        const total = filteredUsers.length;
        totalUsersCount.textContent = total.toLocaleString();
        
        // Calculate pagination
        const totalPages = Math.ceil(total / itemsPerPageValue);
        const startIndex = (currentPage - 1) * itemsPerPageValue;
        const endIndex = startIndex + itemsPerPageValue;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        
        // Update pagination info
        showingFrom.textContent = startIndex + 1;
        showingTo.textContent = Math.min(endIndex, total);
        
        // Clear table
        usersTableBody.innerHTML = '';
        
        // Add users to table
        paginatedUsers.forEach(user => {
            const userRow = createUserRow(user);
            usersTableBody.appendChild(userRow);
        });
        
        // Update pagination buttons
        updatePagination(total, totalPages);
        
        // Update select all checkbox
        selectAllCheckbox.checked = selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0;
        selectAllCheckbox.indeterminate = selectedUsers.size > 0 && selectedUsers.size < paginatedUsers.length;
    }
    
    // Create user row element
    function createUserRow(user) {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.dataset.id = user.id;
        
        // Format dates
        const regDate = new Date(user.registered);
        const regDateString = regDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const lastActive = new Date(user.lastActive);
        const lastActiveString = formatTimeAgo(lastActive);
        
        // Get role badge
        let roleClass = '';
        let roleText = '';
        switch(user.role) {
            case 'attendee':
                roleClass = 'role-attendee';
                roleText = 'Attendee';
                break;
            case 'organizer':
                roleClass = 'role-organizer';
                roleText = 'Organizer';
                break;
            case 'moderator':
                roleClass = 'role-moderator';
                roleText = 'Moderator';
                break;
            case 'admin':
                roleClass = 'role-admin';
                roleText = 'Admin';
                break;
        }
        
        // Get status badge
        let statusClass = '';
        let statusText = '';
        switch(user.status) {
            case 'active':
                statusClass = 'status-active';
                statusText = 'Active';
                break;
            case 'inactive':
                statusClass = 'status-inactive';
                statusText = 'Inactive';
                break;
            case 'suspended':
                statusClass = 'status-suspended';
                statusText = 'Suspended';
                break;
            case 'pending':
                statusClass = 'status-pending';
                statusText = 'Pending';
                break;
        }
        
        row.innerHTML = `
            <div class="table-cell select-cell">
                <input type="checkbox" ${selectedUsers.has(user.id) ? 'checked' : ''}>
            </div>
            
            <div class="table-cell user-cell">
                <div class="user-avatar">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}" alt="${user.firstName}">
                </div>
                <div class="user-info">
                    <h4>${user.firstName} ${user.lastName}</h4>
                    <p>ID: #${user.id.toString().padStart(6, '0')}</p>
                </div>
            </div>
            
            <div class="table-cell email-cell">${user.email}</div>
            
            <div class="table-cell role-cell">
                <span class="role-badge ${roleClass}">${roleText}</span>
            </div>
            
            <div class="table-cell status-cell">
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            
            <div class="table-cell date-cell">${regDateString}</div>
            
            <div class="table-cell activity-cell">${lastActiveString}</div>
            
            <div class="table-cell events-cell">${user.events}</div>
            
            <div class="table-cell actions-cell">
                <button class="action-btn-icon view" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn-icon edit" title="Edit User">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn-icon delete" title="Delete User">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners
        const checkbox = row.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedUsers.add(user.id);
            } else {
                selectedUsers.delete(user.id);
            }
            updateSelectAllCheckbox();
        });
        
        const viewBtn = row.querySelector('.view');
        viewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showUserDetails(user);
        });
        
        const editBtn = row.querySelector('.edit');
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            editUser(user);
        });
        
        const deleteBtn = row.querySelector('.delete');
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showDeleteConfirmation(user);
        });
        
        // Add click event to row
        row.addEventListener('click', function(e) {
            if (!e.target.closest('.select-cell') && !e.target.closest('.actions-cell')) {
                showUserDetails(user);
            }
        });
        
        return row;
    }
    
    // Format time ago
    function formatTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else if (minutes > 0) {
            return `${minutes}m ago`;
        } else {
            return 'Just now';
        }
    }
    
    // Update user stats
    function updateUserStats() {
        const total = users.length;
        const active = users.filter(u => u.status === 'active').length;
        const organizers = users.filter(u => u.role === 'organizer').length;
        const admins = users.filter(u => u.role === 'admin').length;
        
        totalUsers.textContent = total.toLocaleString();
        activeUsers.textContent = active.toLocaleString();
        organizerUsers.textContent = organizers.toLocaleString();
        adminUsers.textContent = admins.toLocaleString();
    }
    
    // Update select all checkbox
    function updateSelectAllCheckbox() {
        const checkboxes = document.querySelectorAll('.table-body input[type="checkbox"]');
        const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
        const someChecked = Array.from(checkboxes).some(cb => cb.checked);
        
        selectAllCheckbox.checked = allChecked;
        selectAllCheckbox.indeterminate = someChecked && !allChecked;
    }
    
    // Update pagination
    function updatePagination(total, totalPages) {
        // Previous button
        prevPage.disabled = currentPage === 1;
        
        // Next button
        nextPage.disabled = currentPage === totalPages || totalPages === 0;
        
        // Update page numbers (simplified)
        pageNumbers.forEach((pageBtn, index) => {
            pageBtn.classList.toggle('active', index === 0 && currentPage === 1);
        });
    }
    
    // Show user details
    function showUserDetails(user) {
        const regDate = new Date(user.registered);
        const regDateString = regDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const lastActive = new Date(user.lastActive);
        const lastActiveString = lastActive.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Get role text
        let roleText = '';
        switch(user.role) {
            case 'attendee': roleText = 'Attendee'; break;
            case 'organizer': roleText = 'Event Organizer'; break;
            case 'moderator': roleText = 'Moderator'; break;
            case 'admin': roleText = 'Administrator'; break;
        }
        
        // Get status text
        let statusText = '';
        let statusClass = '';
        switch(user.status) {
            case 'active': 
                statusText = 'Active';
                statusClass = 'status-active';
                break;
            case 'inactive': 
                statusText = 'Inactive';
                statusClass = 'status-inactive';
                break;
            case 'suspended': 
                statusText = 'Suspended';
                statusClass = 'status-suspended';
                break;
            case 'pending': 
                statusText = 'Pending Verification';
                statusClass = 'status-pending';
                break;
        }
        
        userDetailContainer.innerHTML = `
            <div class="user-detail-header">
                <div class="user-detail-avatar">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}" alt="${user.firstName}">
                </div>
                <div class="user-detail-info">
                    <h3>${user.firstName} ${user.lastName}</h3>
                    <p>${user.email}</p>
                    <div class="user-detail-meta">
                        <span class="role-badge ${user.role === 'admin' ? 'role-admin' : user.role === 'organizer' ? 'role-organizer' : 'role-attendee'}">${roleText}</span>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        <span>User ID: #${user.id.toString().padStart(6, '0')}</span>
                    </div>
                </div>
            </div>
            
            <div class="user-detail-grid">
                <div class="detail-item">
                    <h4>Contact Information</h4>
                    <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
                    <p><strong>Company:</strong> ${user.company || 'Not provided'}</p>
                </div>
                
                <div class="detail-item">
                    <h4>Account Information</h4>
                    <p><strong>Registered:</strong> ${regDateString}</p>
                    <p><strong>Last Active:</strong> ${lastActiveString}</p>
                    <p><strong>Events Attended/Created:</strong> ${user.events}</p>
                </div>
                
                <div class="detail-item">
                    <h4>Permissions</h4>
                    <p>${user.permissions.length > 0 ? user.permissions.map(p => {
                        switch(p) {
                            case 'create_events': return 'Create Events';
                            case 'manage_events': return 'Manage Events';
                            case 'view_reports': return 'View Reports';
                            case 'manage_users': return 'Manage Users';
                            default: return p;
                        }
                    }).join(', ') : 'No special permissions'}</p>
                </div>
                
                <div class="detail-item">
                    <h4>Bio</h4>
                    <p>${user.bio || 'No bio provided'}</p>
                </div>
                
                <div class="detail-item user-activity">
                    <h4>Recent Activity</h4>
                    <div class="activity-list">
                        <div class="activity-item">
                            <div class="activity-icon">
                                <i class="fas fa-user-check"></i>
                            </div>
                            <div class="activity-content">
                                <h5>Account ${user.status === 'active' ? 'Activated' : user.status === 'pending' ? 'Created' : 'Status Updated'}</h5>
                                <p>Account status: ${statusText}</p>
                                <span class="activity-time">${regDateString}</span>
                            </div>
                        </div>
                        
                        <div class="activity-item">
                            <div class="activity-icon">
                                <i class="fas fa-calendar"></i>
                            </div>
                            <div class="activity-content">
                                <h5>${user.events > 0 ? 'Event Activity' : 'No Events Yet'}</h5>
                                <p>${user.events > 0 ? `Participated in ${user.events} events` : 'Has not attended any events yet'}</p>
                                <span class="activity-time">${lastActiveString}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="cancel-btn" id="closeUserDetail">
                    Close
                </button>
                <button type="button" class="save-btn" id="editUserFromDetail">
                    <i class="fas fa-edit"></i>
                    Edit User
                </button>
            </div>
        `;
        
        // Add event listeners for detail modal buttons
        const closeDetailBtn = document.getElementById('closeUserDetail');
        const editFromDetailBtn = document.getElementById('editUserFromDetail');
        
        closeDetailBtn.addEventListener('click', function() {
            userDetailModal.classList.remove('active');
        });
        
        editFromDetailBtn.addEventListener('click', function() {
            userDetailModal.classList.remove('active');
            editUser(user);
        });
        
        // Show modal
        userDetailModal.classList.add('active');
    }
    
    // Edit user
    function editUser(user) {
        // Set form values
        document.getElementById('editUserAvatar').src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`;
        document.getElementById('editUserName').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('editUserEmail').textContent = user.email;
        document.getElementById('editFirstName').value = user.firstName;
        document.getElementById('editLastName').value = user.lastName;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editRole').value = user.role;
        document.getElementById('editStatus').value = user.status;
        
        // Set status badge
        const statusBadge = document.getElementById('editUserStatus');
        statusBadge.textContent = user.status.charAt(0).toUpperCase() + user.status.slice(1);
        statusBadge.className = 'user-status-badge';
        
        switch(user.status) {
            case 'active':
                statusBadge.classList.add('status-active');
                break;
            case 'inactive':
                statusBadge.classList.add('status-inactive');
                break;
            case 'suspended':
                statusBadge.classList.add('status-suspended');
                break;
            case 'pending':
                statusBadge.classList.add('status-pending');
                break;
        }
        
        // Set permissions
        document.querySelectorAll('input[name="editPermissions"]').forEach(checkbox => {
            checkbox.checked = user.permissions.includes(checkbox.value);
        });
        
        // Set form submit handler
        editUserForm.onsubmit = function(e) {
            e.preventDefault();
            
            // Update user data
            const index = users.findIndex(u => u.id === user.id);
            if (index !== -1) {
                users[index] = {
                    ...users[index],
                    firstName: document.getElementById('editFirstName').value,
                    lastName: document.getElementById('editLastName').value,
                    email: document.getElementById('editEmail').value,
                    role: document.getElementById('editRole').value,
                    status: document.getElementById('editStatus').value,
                    permissions: Array.from(document.querySelectorAll('input[name="editPermissions"]:checked')).map(cb => cb.value)
                };
                
                loadUsers();
                updateUserStats();
                editUserModal.classList.remove('active');
                showToast('User updated successfully!');
            }
        };
        
        // Show modal
        editUserModal.classList.add('active');
    }
    
    // Show delete confirmation
    function showDeleteConfirmation(user) {
        userToDelete = user;
        deleteUserInfo.textContent = `User: ${user.firstName} ${user.lastName} (${user.email})`;
        deleteConfirmModal.classList.add('active');
    }
    
    // Delete user
    function deleteUser() {
        if (userToDelete) {
            users = users.filter(u => u.id !== userToDelete.id);
            selectedUsers.delete(userToDelete.id);
            
            loadUsers();
            updateUserStats();
            deleteConfirmModal.classList.remove('active');
            showToast('User deleted successfully!', 'error');
            
            userToDelete = null;
        }
    }
    
    // Add new user
    function addNewUser(userData) {
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            ...userData,
            registered: new Date().toISOString().split('T')[0],
            lastActive: new Date().toISOString(),
            events: 0,
            avatar: userData.firstName,
            bio: '',
            phone: '',
            company: ''
        };
        
        users.unshift(newUser);
        loadUsers();
        updateUserStats();
        showToast('New user created successfully!');
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
        
        // Add user button
        addUserBtn.addEventListener('click', function() {
            addUserModal.classList.add('active');
        });
        
        // Export users button
        exportUsersBtn.addEventListener('click', function() {
            showToast('Exporting user data...', 'info');
        });
        
        // Filter button
        filterBtn.addEventListener('click', function() {
            // Toggle filters bar visibility
            const filtersBar = document.querySelector('.filters-bar');
            filtersBar.style.display = filtersBar.style.display === 'none' ? 'flex' : 'none';
        });
        
        // Clear filters
        clearFilters.addEventListener('click', function() {
            roleFilter.value = 'all';
            statusFilter.value = 'all';
            dateFilter.value = 'all';
            sortFilter.value = 'newest';
            userSearch.value = '';
            
            currentFilters = {
                role: 'all',
                status: 'all',
                date: 'all',
                sort: 'newest',
                search: ''
            };
            
            currentPage = 1;
            loadUsers();
        });
        
        // Filter changes
        roleFilter.addEventListener('change', function() {
            currentFilters.role = this.value;
            currentPage = 1;
            loadUsers();
        });
        
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            currentPage = 1;
            loadUsers();
        });
        
        dateFilter.addEventListener('change', function() {
            currentFilters.date = this.value;
            currentPage = 1;
            loadUsers();
        });
        
        sortFilter.addEventListener('change', function() {
            currentFilters.sort = this.value;
            loadUsers();
        });
        
        // Search input
        userSearch.addEventListener('input', function() {
            currentFilters.search = this.value;
            currentPage = 1;
            loadUsers();
        });
        
        // Select all checkbox
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.table-body input[type="checkbox"]');
            checkboxes.forEach(cb => {
                cb.checked = this.checked;
                const userId = parseInt(cb.closest('.table-row').dataset.id);
                if (this.checked) {
                    selectedUsers.add(userId);
                } else {
                    selectedUsers.delete(userId);
                }
            });
        });
        
        // Bulk actions
        applyBulkBtn.addEventListener('click', function() {
            const action = bulkActionSelect.value;
            if (!action) {
                alert('Please select a bulk action');
                return;
            }
            
            if (selectedUsers.size === 0) {
                alert('Please select at least one user');
                return;
            }
            
            switch(action) {
                case 'activate':
                    users.forEach(user => {
                        if (selectedUsers.has(user.id)) {
                            user.status = 'active';
                        }
                    });
                    showToast(`${selectedUsers.size} users activated!`);
                    break;
                    
                case 'deactivate':
                    users.forEach(user => {
                        if (selectedUsers.has(user.id)) {
                            user.status = 'inactive';
                        }
                    });
                    showToast(`${selectedUsers.size} users deactivated!`);
                    break;
                    
                case 'assign-role':
                    const newRole = prompt('Enter new role (attendee, organizer, moderator, admin):');
                    if (newRole && ['attendee', 'organizer', 'moderator', 'admin'].includes(newRole)) {
                        users.forEach(user => {
                            if (selectedUsers.has(user.id)) {
                                user.role = newRole;
                            }
                        });
                        showToast(`Role updated for ${selectedUsers.size} users!`);
                    }
                    break;
                    
                case 'send-email':
                    showToast(`Email will be sent to ${selectedUsers.size} users`, 'info');
                    break;
                    
                case 'export':
                    showToast(`Exporting ${selectedUsers.size} users...`, 'info');
                    break;
                    
                case 'delete':
                    if (confirm(`Delete ${selectedUsers.size} selected users? This action cannot be undone.`)) {
                        users = users.filter(user => !selectedUsers.has(user.id));
                        selectedUsers.clear();
                        showToast(`${selectedUsers.size} users deleted!`, 'error');
                    }
                    break;
            }
            
            bulkActionSelect.value = '';
            loadUsers();
            updateUserStats();
        });
        
        // Pagination
        prevPage.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                loadUsers();
            }
        });
        
        nextPage.addEventListener('click', function() {
            currentPage++;
            loadUsers();
        });
        
        pageNumbers.forEach(pageBtn => {
            pageBtn.addEventListener('click', function() {
                const pageNum = parseInt(this.textContent);
                if (!isNaN(pageNum)) {
                    currentPage = pageNum;
                    loadUsers();
                }
            });
        });
        
        itemsPerPage.addEventListener('change', function() {
            itemsPerPageValue = parseInt(this.value);
            currentPage = 1;
            loadUsers();
        });
        
        // Add user modal
        closeAddUserModal.addEventListener('click', function() {
            addUserModal.classList.remove('active');
            addUserForm.reset();
        });
        
        cancelAddUser.addEventListener('click', function() {
            addUserModal.classList.remove('active');
            addUserForm.reset();
        });
        
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('userPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (password.length < 8) {
                alert('Password must be at least 8 characters long!');
                return;
            }
            
            const userData = {
                firstName: document.getElementById('userFirstName').value,
                lastName: document.getElementById('userLastName').value,
                email: document.getElementById('userEmail').value,
                role: document.getElementById('userRole').value,
                status: 'active',
                permissions: Array.from(document.querySelectorAll('input[name="permissions"]:checked')).map(cb => cb.value)
            };
            
            addNewUser(userData);
            addUserModal.classList.remove('active');
            addUserForm.reset();
        });
        
        // Edit user modal
        closeEditUserModal.addEventListener('click', function() {
            editUserModal.classList.remove('active');
        });
        
        cancelEditUser.addEventListener('click', function() {
            editUserModal.classList.remove('active');
        });
        
        // User detail modal
        closeUserDetailModal.addEventListener('click', function() {
            userDetailModal.classList.remove('active');
        });
        
        // Delete confirmation modal
        closeDeleteModal.addEventListener('click', function() {
            deleteConfirmModal.classList.remove('active');
            userToDelete = null;
        });
        
        cancelDelete.addEventListener('click', function() {
            deleteConfirmModal.classList.remove('active');
            userToDelete = null;
        });
        
        confirmDelete.addEventListener('click', deleteUser);
        
        // Modal close on outside click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
                if (e.target.id === 'addUserModal') {
                    addUserForm.reset();
                } else if (e.target.id === 'editUserModal') {
                    // Reset nothing, keep form data
                } else if (e.target.id === 'deleteConfirmModal') {
                    userToDelete = null;
                }
            }
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                addUserModal.classList.remove('active');
                editUserModal.classList.remove('active');
                userDetailModal.classList.remove('active');
                deleteConfirmModal.classList.remove('active');
                
                addUserForm.reset();
                userToDelete = null;
            }
        });
        
        // Quick switch link
        document.querySelector('.quick-switch').addEventListener('click', function(e) {
            if (!this.href.includes('org-dashboard.html')) {
                e.preventDefault();
                if (confirm('Switch to Organizer View?')) {
                    window.location.href = '../organizer/org-dashboard.html';
                }
            }
        });
    }
    
    // Initialize the user management page
    initUserManagement();
});