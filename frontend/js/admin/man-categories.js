// ===== ADMIN CATEGORIES PAGE JS =====
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const currentDate = document.getElementById('currentDate');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const importCategoriesBtn = document.getElementById('importCategoriesBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    const categorySearch = document.getElementById('categorySearch');
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotifications = document.getElementById('closeNotifications');
    const addCategoryModal = document.getElementById('addCategoryModal');
    const closeCategoryModal = document.getElementById('closeCategoryModal');
    const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
    const categoryForm = document.getElementById('categoryForm');
    const editCategoryModal = document.getElementById('editCategoryModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const bulkActionsModal = document.getElementById('bulkActionsModal');
    const closeBulkModal = document.getElementById('closeBulkModal');
    const applyBulkAction = document.getElementById('applyBulkAction');
    const selectAllCategories = document.getElementById('selectAllCategories');
    const categoriesGrid = document.getElementById('categoriesGrid');
    const statusFilter = document.getElementById('statusFilter');
    const featuredFilter = document.getElementById('featuredFilter');
    const sortFilter = document.getElementById('sortFilter');
    const typeFilter = document.getElementById('typeFilter');
    const reorderCategoriesBtn = document.getElementById('reorderCategoriesBtn');
    const bulkEnableBtn = document.getElementById('bulkEnableBtn');
    const setFeaturedBtn = document.getElementById('setFeaturedBtn');
    const exportCategoriesBtn = document.getElementById('exportCategoriesBtn');
    const categoryAnalyticsBtn = document.getElementById('categoryAnalyticsBtn');
    const mergeCategoriesBtn = document.getElementById('mergeCategoriesBtn');
    const selectedCount = document.getElementById('selectedCount');
    const bulkActionBtns = document.querySelectorAll('.bulk-action-btn');
    
    // Initialize date display
    updateCurrentDate();
    
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('sidebar-collapsed');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                sidebar.classList.remove('active');
                mainContent.classList.remove('sidebar-collapsed');
            }
        }
    });
    
    // Update current date
    function updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDate.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Notification panel toggle
    notificationBtn.addEventListener('click', function() {
        notificationPanel.classList.toggle('active');
    });
    
    closeNotifications.addEventListener('click', function() {
        notificationPanel.classList.remove('active');
    });
    
    // Close notification panel when clicking outside
    document.addEventListener('click', function(event) {
        if (!notificationPanel.contains(event.target) && !notificationBtn.contains(event.target)) {
            notificationPanel.classList.remove('active');
        }
    });
    
    // Mark all notifications as read
    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            const unreadNotifications = document.querySelectorAll('.notification-item.unread');
            unreadNotifications.forEach(notification => {
                notification.classList.remove('unread');
            });
            
            // Update notification count
            const notificationCount = document.querySelector('.notification-count');
            if (notificationCount) {
                notificationCount.textContent = '0';
                notificationCount.style.display = 'none';
            }
            
            // Show confirmation
            showToast('All notifications marked as read', 'success');
        });
    }
    
    // Modal Management
    function openModal(modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }
    
    // Add Category Modal
    addCategoryBtn.addEventListener('click', function() {
        openModal(addCategoryModal);
    });
    
    closeCategoryModal.addEventListener('click', function() {
        closeModal(addCategoryModal);
    });
    
    cancelCategoryBtn.addEventListener('click', function() {
        closeModal(addCategoryModal);
    });
    
    // Close modal when clicking outside
    addCategoryModal.addEventListener('click', function(event) {
        if (event.target === addCategoryModal) {
            closeModal(addCategoryModal);
        }
    });
    
    editCategoryModal.addEventListener('click', function(event) {
        if (event.target === editCategoryModal) {
            closeModal(editCategoryModal);
        }
    });
    
    bulkActionsModal.addEventListener('click', function(event) {
        if (event.target === bulkActionsModal) {
            closeModal(bulkActionsModal);
        }
    });
    
    // Category form submission
    categoryForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const categoryName = document.getElementById('categoryName').value;
        const categoryIcon = document.getElementById('categoryIcon').value;
        const isFeatured = document.getElementById('isFeatured').checked;
        
        // Generate a new category ID
        const newId = generateCategoryId();
        
        // Create new category card
        const newCategory = {
            id: newId,
            name: categoryName,
            icon: categoryIcon,
            description: document.getElementById('categoryDescription').value || 'No description provided',
            events: 0,
            attendees: 0,
            revenue: '$0',
            status: document.getElementById('categoryStatus').value,
            featured: isFeatured,
            tags: ['New']
        };
        
        // Add to grid (prepend)
        const categoryCard = createCategoryCard(newCategory);
        categoriesGrid.prepend(categoryCard);
        
        // Update stats
        updateCategoryStats();
        
        // Show success message
        showToast(`Category "${categoryName}" created successfully!`, 'success');
        
        // Reset form and close modal
        categoryForm.reset();
        closeModal(addCategoryModal);
        
        // Log activity
        logActivity('category-added', `"${categoryName}" category created`);
    });
    
    // Generate unique category ID
    function generateCategoryId() {
        const existingIds = Array.from(document.querySelectorAll('.category-id'))
            .map(el => {
                const idText = el.textContent.replace('ID: ', '');
                const num = parseInt(idText.split('-')[1]);
                return isNaN(num) ? 0 : num;
            });
        
        const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 8;
        return `CAT-${String(maxId + 1).padStart(3, '0')}`;
    }
    
    // Create category card HTML
    function createCategoryCard(category) {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.dataset.id = category.id.split('-')[1];
        card.dataset.featured = category.featured.toString();
        card.dataset.events = category.events;
        
        const iconClass = getIconClass(category.icon);
        const iconBackground = getIconBackground(category.icon);
        
        card.innerHTML = `
            <div class="category-card-header">
                <div class="category-icon" style="${iconBackground}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="category-actions">
                    <input type="checkbox" class="category-select">
                    <div class="category-dropdown">
                        <button class="dropdown-toggle">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="#" class="edit-category"><i class="fas fa-edit"></i> Edit</a>
                            <a href="#" class="toggle-category"><i class="fas fa-toggle-on"></i> ${category.status === 'active' ? 'Disable' : 'Enable'}</a>
                            <a href="#" class="feature-category"><i class="fas fa-star"></i> ${category.featured ? 'Unfeature' : 'Feature'}</a>
                            <a href="#" class="delete-category"><i class="fas fa-trash"></i> Delete</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="category-card-body">
                <h3 class="category-name">${category.name}</h3>
                <p class="category-description">${category.description}</p>
                
                <div class="category-stats">
                    <div class="stat-item">
                        <span class="stat-value">${category.events}</span>
                        <span class="stat-label">Events</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${category.attendees}</span>
                        <span class="stat-label">Attendees</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${category.revenue}</span>
                        <span class="stat-label">Revenue</span>
                    </div>
                </div>
                
                <div class="category-tags">
                    ${category.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="category-card-footer">
                <div class="category-status">
                    <span class="status-badge ${category.status}">${capitalizeFirstLetter(category.status)}</span>
                    ${category.featured ? '<span class="status-badge featured">Featured</span>' : ''}
                </div>
                <div class="category-id">
                    ID: ${category.id}
                </div>
            </div>
        `;
        
        // Add event listeners to new card
        addCardEventListeners(card);
        
        return card;
    }
    
    // Helper function to get icon class
    function getIconClass(iconValue) {
        const iconMap = {
            'music': 'fas fa-music',
            'laptop': 'fas fa-laptop-code',
            'briefcase': 'fas fa-briefcase',
            'graduation': 'fas fa-graduation-cap',
            'futbol': 'fas fa-futbol',
            'palette': 'fas fa-palette',
            'utensils': 'fas fa-utensils',
            'heart': 'fas fa-heartbeat'
        };
        return iconMap[iconValue] || 'fas fa-tag';
    }
    
    // Helper function to get icon background
    function getIconBackground(iconValue) {
        // Return inline style for gradient background
        const backgroundMap = {
            'music': 'background: linear-gradient(135deg, #8b5cf6, #a78bfa)',
            'laptop': 'background: linear-gradient(135deg, #10b981, #34d399)',
            'briefcase': 'background: linear-gradient(135deg, #f59e0b, #fbbf24)',
            'graduation': 'background: linear-gradient(135deg, #06b6d4, #22d3ee)',
            'futbol': 'background: linear-gradient(135deg, #ef4444, #f87171)',
            'palette': 'background: linear-gradient(135deg, #db2777, #ec4899)',
            'utensils': 'background: linear-gradient(135deg, #8b5cf6, #c4b5fd)',
            'heart': 'background: linear-gradient(135deg, #10b981, #6ee7b7)'
        };
        return backgroundMap[iconValue] || 'background: linear-gradient(135deg, #6b7280, #9ca3af)';
    }
    
    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Add event listeners to category card
    function addCardEventListeners(card) {
        // Edit category
        const editBtn = card.querySelector('.edit-category');
        editBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const categoryId = card.dataset.id;
            editCategory(card, categoryId);
        });
        
        // Toggle category status
        const toggleBtn = card.querySelector('.toggle-category');
        toggleBtn.addEventListener('click', function(event) {
            event.preventDefault();
            toggleCategoryStatus(card);
        });
        
        // Toggle featured status
        const featureBtn = card.querySelector('.feature-category');
        featureBtn.addEventListener('click', function(event) {
            event.preventDefault();
            toggleFeaturedStatus(card);
        });
        
        // Delete category
        const deleteBtn = card.querySelector('.delete-category');
        deleteBtn.addEventListener('click', function(event) {
            event.preventDefault();
            deleteCategory(card);
        });
        
        // Category checkbox
        const checkbox = card.querySelector('.category-select');
        checkbox.addEventListener('change', function() {
            updateSelectedCount();
            updateSelectAllCheckbox();
        });
    }
    
    // Initialize event listeners for existing category cards
    document.querySelectorAll('.category-card').forEach(card => {
        addCardEventListeners(card);
    });
    
    // Edit category function
    function editCategory(card, categoryId) {
        const categoryName = card.querySelector('.category-name').textContent;
        const categoryDescription = card.querySelector('.category-description').textContent;
        const categoryStatus = card.querySelector('.status-badge.active, .status-badge.disabled, .status-badge.pending');
        const isFeatured = card.querySelector('.status-badge.featured') !== null;
        
        // Populate edit form (simplified version)
        const editForm = document.getElementById('editCategoryForm');
        editForm.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="editCategoryName">Category Name *</label>
                    <input type="text" id="editCategoryName" value="${categoryName}" required>
                </div>
                <div class="form-group">
                    <label for="editCategorySlug">URL Slug</label>
                    <input type="text" id="editCategorySlug" value="${categoryName.toLowerCase().replace(/\s+/g, '-')}">
                </div>
            </div>
            
            <div class="form-group">
                <label for="editCategoryDescription">Description</label>
                <textarea id="editCategoryDescription" rows="3">${categoryDescription}</textarea>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editCategoryStatus">Status</label>
                    <select id="editCategoryStatus">
                        <option value="active" ${categoryStatus && categoryStatus.classList.contains('active') ? 'selected' : ''}>Active</option>
                        <option value="disabled" ${categoryStatus && categoryStatus.classList.contains('disabled') ? 'selected' : ''}>Disabled</option>
                        <option value="pending" ${categoryStatus && categoryStatus.classList.contains('pending') ? 'selected' : ''}>Pending Review</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editCategoryOrder">Display Order</label>
                    <input type="number" id="editCategoryOrder" value="1" min="1" max="100">
                </div>
            </div>
            
            <div class="form-checkboxes">
                <label class="checkbox-label">
                    <input type="checkbox" id="editIsFeatured" ${isFeatured ? 'checked' : ''}>
                    <span>Mark as Featured Category</span>
                </label>
            </div>
            
            <div class="form-actions">
                <button type="button" class="cancel-btn" id="cancelEditBtn">Cancel</button>
                <button type="submit" class="send-alert-btn">
                    <i class="fas fa-save"></i>
                    Save Changes
                </button>
            </div>
        `;
        
        // Open edit modal
        openModal(editCategoryModal);
        
        // Handle edit form submission
        editForm.onsubmit = function(event) {
            event.preventDefault();
            
            // Update card with new values
            card.querySelector('.category-name').textContent = document.getElementById('editCategoryName').value;
            card.querySelector('.category-description').textContent = document.getElementById('editCategoryDescription').value;
            
            // Update status badge
            const newStatus = document.getElementById('editCategoryStatus').value;
            const statusBadge = card.querySelector('.status-badge.active, .status-badge.disabled, .status-badge.pending');
            if (statusBadge) {
                statusBadge.className = `status-badge ${newStatus}`;
                statusBadge.textContent = capitalizeFirstLetter(newStatus);
                
                // Update toggle button text
                const toggleBtn = card.querySelector('.toggle-category');
                toggleBtn.innerHTML = `<i class="fas fa-toggle-on"></i> ${newStatus === 'active' ? 'Disable' : 'Enable'}`;
            }
            
            // Update featured status
            const isFeaturedChecked = document.getElementById('editIsFeatured').checked;
            let featuredBadge = card.querySelector('.status-badge.featured');
            const featuredBtn = card.querySelector('.feature-category');
            
            if (isFeaturedChecked && !featuredBadge) {
                // Add featured badge
                const categoryStatusDiv = card.querySelector('.category-status');
                featuredBadge = document.createElement('span');
                featuredBadge.className = 'status-badge featured';
                featuredBadge.textContent = 'Featured';
                categoryStatusDiv.appendChild(featuredBadge);
                
                // Update button text
                featuredBtn.innerHTML = '<i class="fas fa-star"></i> Unfeature';
                card.dataset.featured = 'true';
            } else if (!isFeaturedChecked && featuredBadge) {
                // Remove featured badge
                featuredBadge.remove();
                
                // Update button text
                featuredBtn.innerHTML = '<i class="fas fa-star"></i> Feature';
                card.dataset.featured = 'false';
            }
            
            // Show success message
            showToast(`Category "${document.getElementById('editCategoryName').value}" updated successfully!`, 'success');
            
            // Log activity
            logActivity('category-updated', `"${document.getElementById('editCategoryName').value}" category updated`);
            
            // Close modal
            closeModal(editCategoryModal);
        };
        
        // Cancel edit button
        document.getElementById('cancelEditBtn').addEventListener('click', function() {
            closeModal(editCategoryModal);
        });
    }
    
    closeEditModal.addEventListener('click', function() {
        closeModal(editCategoryModal);
    });
    
    // Toggle category status
    function toggleCategoryStatus(card) {
        const statusBadge = card.querySelector('.status-badge.active, .status-badge.disabled, .status-badge.pending');
        const toggleBtn = card.querySelector('.toggle-category');
        
        if (statusBadge.classList.contains('active')) {
            // Change to disabled
            statusBadge.className = 'status-badge disabled';
            statusBadge.textContent = 'Disabled';
            toggleBtn.innerHTML = '<i class="fas fa-toggle-on"></i> Enable';
            card.dataset.status = 'disabled';
            
            // Log activity
            const categoryName = card.querySelector('.category-name').textContent;
            logActivity('category-disabled', `"${categoryName}" category disabled`);
            
            showToast('Category disabled', 'warning');
        } else {
            // Change to active
            statusBadge.className = 'status-badge active';
            statusBadge.textContent = 'Active';
            toggleBtn.innerHTML = '<i class="fas fa-toggle-on"></i> Disable';
            card.dataset.status = 'active';
            
            // Log activity
            const categoryName = card.querySelector('.category-name').textContent;
            logActivity('category-enabled', `"${categoryName}" category enabled`);
            
            showToast('Category enabled', 'success');
        }
        
        updateCategoryStats();
    }
    
    // Toggle featured status
    function toggleFeaturedStatus(card) {
        const featuredBadge = card.querySelector('.status-badge.featured');
        const featuredBtn = card.querySelector('.feature-category');
        
        if (featuredBadge) {
            // Remove featured status
            featuredBadge.remove();
            featuredBtn.innerHTML = '<i class="fas fa-star"></i> Feature';
            card.dataset.featured = 'false';
            
            // Log activity
            const categoryName = card.querySelector('.category-name').textContent;
            logActivity('category-unfeatured', `"${categoryName}" unfeatured`);
            
            showToast('Category unfeatured', 'info');
        } else {
            // Add featured status
            const categoryStatusDiv = card.querySelector('.category-status');
            const newFeaturedBadge = document.createElement('span');
            newFeaturedBadge.className = 'status-badge featured';
            newFeaturedBadge.textContent = 'Featured';
            categoryStatusDiv.appendChild(newFeaturedBadge);
            
            featuredBtn.innerHTML = '<i class="fas fa-star"></i> Unfeature';
            card.dataset.featured = 'true';
            
            // Log activity
            const categoryName = card.querySelector('.category-name').textContent;
            logActivity('category-featured', `"${categoryName}" marked as featured`);
            
            showToast('Category featured', 'success');
        }
        
        updateCategoryStats();
    }
    
    // Delete category
    function deleteCategory(card) {
        const categoryName = card.querySelector('.category-name').textContent;
        
        if (confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)) {
            // Animate removal
            card.style.transform = 'scale(0.9)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                card.remove();
                updateCategoryStats();
                
                // Log activity
                logActivity('category-deleted', `"${categoryName}" category deleted`);
                
                showToast(`Category "${categoryName}" deleted`, 'success');
            }, 300);
        }
    }
    
    // Search categories
    categorySearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            const categoryName = card.querySelector('.category-name').textContent.toLowerCase();
            const categoryDescription = card.querySelector('.category-description').textContent.toLowerCase();
            
            if (categoryName.includes(searchTerm) || categoryDescription.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        updateCategoryCount();
    });
    
    // Filter categories
    [statusFilter, featuredFilter, sortFilter, typeFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    function applyFilters() {
        const statusValue = statusFilter.value;
        const featuredValue = featuredFilter.value;
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            let shouldShow = true;
            
            // Status filter
            if (statusValue !== 'all') {
                const statusBadge = card.querySelector('.status-badge.active, .status-badge.disabled, .status-badge.pending');
                const cardStatus = statusBadge ? statusBadge.textContent.toLowerCase() : '';
                
                if (statusValue === 'active' && cardStatus !== 'active') shouldShow = false;
                if (statusValue === 'disabled' && cardStatus !== 'disabled') shouldShow = false;
                if (statusValue === 'pending' && cardStatus !== 'pending') shouldShow = false;
            }
            
            // Featured filter
            if (featuredValue !== 'all') {
                const isFeatured = card.dataset.featured === 'true';
                
                if (featuredValue === 'featured' && !isFeatured) shouldShow = false;
                if (featuredValue === 'not-featured' && isFeatured) shouldShow = false;
            }
            
            card.style.display = shouldShow ? 'block' : 'none';
        });
        
        // Apply sorting
        applySorting();
        updateCategoryCount();
    }
    
    function applySorting() {
        const sortValue = sortFilter.value;
        const categoriesGrid = document.getElementById('categoriesGrid');
        const categoryCards = Array.from(categoriesGrid.querySelectorAll('.category-card'));
        
        categoryCards.sort((a, b) => {
            switch(sortValue) {
                case 'name':
                    const nameA = a.querySelector('.category-name').textContent.toLowerCase();
                    const nameB = b.querySelector('.category-name').textContent.toLowerCase();
                    return nameA.localeCompare(nameB);
                    
                case 'events':
                    const eventsA = parseInt(a.dataset.events) || 0;
                    const eventsB = parseInt(b.dataset.events) || 0;
                    return eventsB - eventsA;
                    
                case 'newest':
                    // Simulate by ID (higher ID = newer)
                    const idA = parseInt(a.dataset.id) || 0;
                    const idB = parseInt(b.dataset.id) || 0;
                    return idB - idA;
                    
                case 'oldest':
                    // Simulate by ID (lower ID = older)
                    const idA2 = parseInt(a.dataset.id) || 0;
                    const idB2 = parseInt(b.dataset.id) || 0;
                    return idA2 - idB2;
                    
                default:
                    return 0;
            }
        });
        
        // Reorder the grid
        categoryCards.forEach(card => {
            categoriesGrid.appendChild(card);
        });
    }
    
    // Update category count
    function updateCategoryCount() {
        const visibleCards = document.querySelectorAll('.category-card[style*="display: block"], .category-card:not([style*="display: none"])');
        const totalCards = document.querySelectorAll('.category-card').length;
        
        const countElement = document.querySelector('.categories-count');
        if (countElement) {
            countElement.textContent = `${visibleCards.length} Categories Found`;
        }
        
        // Update pagination info
        const paginationInfo = document.querySelector('.pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Showing 1-${Math.min(visibleCards.length, 8)} of ${visibleCards.length} categories`;
        }
    }
    
    // Update category stats in footer
    function updateCategoryStats() {
        const categoryCards = document.querySelectorAll('.category-card');
        const totalCategories = categoryCards.length;
        const activeCategories = Array.from(categoryCards).filter(card => {
            const statusBadge = card.querySelector('.status-badge.active');
            return statusBadge !== null;
        }).length;
        
        const featuredCategories = Array.from(categoryCards).filter(card => {
            const featuredBadge = card.querySelector('.status-badge.featured');
            return featuredBadge !== null;
        }).length;
        
        // Update footer stats
        const footerStats = document.querySelectorAll('.footer-stat .stat-value');
        if (footerStats.length >= 3) {
            footerStats[0].textContent = totalCategories;
            footerStats[1].textContent = activeCategories;
            footerStats[2].textContent = featuredCategories;
        }
        
        // Update system stats card
        const totalCategoriesStat = document.querySelector('.system-stats .stat-card:nth-child(1) h3');
        if (totalCategoriesStat) {
            totalCategoriesStat.textContent = totalCategories;
        }
    }
    
    // Initialize category stats
    updateCategoryStats();
    updateCategoryCount();
    
    // Bulk actions functionality
    selectAllCategories.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.category-select');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateSelectedCount();
    });
    
    function updateSelectedCount() {
        const selected = document.querySelectorAll('.category-select:checked');
        selectedCount.textContent = selected.length;
        
        // Update bulk delete button state
        bulkDeleteBtn.disabled = selected.length === 0;
        applyBulkAction.disabled = selected.length === 0;
    }
    
    function updateSelectAllCheckbox() {
        const checkboxes = document.querySelectorAll('.category-select');
        const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(checkbox => checkbox.checked);
        selectAllCategories.checked = allChecked;
    }
    
    // Apply bulk action button
    applyBulkAction.addEventListener('click', function() {
        const selected = document.querySelectorAll('.category-select:checked');
        if (selected.length > 0) {
            openModal(bulkActionsModal);
        } else {
            showToast('Please select at least one category', 'warning');
        }
    });
    
    // Bulk delete button
    bulkDeleteBtn.addEventListener('click', function() {
        const selected = document.querySelectorAll('.category-select:checked');
        if (selected.length === 0) {
            showToast('Please select at least one category', 'warning');
            return;
        }
        
        if (confirm(`Are you sure you want to delete ${selected.length} category(ies)? This action cannot be undone.`)) {
            selected.forEach(checkbox => {
                const card = checkbox.closest('.category-card');
                if (card) {
                    const categoryName = card.querySelector('.category-name').textContent;
                    logActivity('category-deleted', `"${categoryName}" category deleted (bulk action)`);
                    card.remove();
                }
            });
            
            updateCategoryStats();
            updateCategoryCount();
            showToast(`${selected.length} category(ies) deleted`, 'success');
            
            // Reset selection
            selectAllCategories.checked = false;
            updateSelectedCount();
        }
    });
    
    // Bulk action buttons in modal
    bulkActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const selected = document.querySelectorAll('.category-select:checked');
            
            if (selected.length === 0) {
                showToast('No categories selected', 'warning');
                return;
            }
            
            let actionText = '';
            let logType = '';
            
            selected.forEach(checkbox => {
                const card = checkbox.closest('.category-card');
                if (card) {
                    const categoryName = card.querySelector('.category-name').textContent;
                    
                    switch(action) {
                        case 'enable':
                            const disabledBadge = card.querySelector('.status-badge.disabled');
                            if (disabledBadge) {
                                toggleCategoryStatus(card);
                            }
                            actionText = 'enabled';
                            logType = 'category-enabled';
                            break;
                            
                        case 'disable':
                            const activeBadge = card.querySelector('.status-badge.active');
                            if (activeBadge) {
                                toggleCategoryStatus(card);
                            }
                            actionText = 'disabled';
                            logType = 'category-disabled';
                            break;
                            
                        case 'feature':
                            const featuredBadge = card.querySelector('.status-badge.featured');
                            if (!featuredBadge) {
                                toggleFeaturedStatus(card);
                            }
                            actionText = 'featured';
                            logType = 'category-featured';
                            break;
                            
                        case 'unfeature':
                            const unfeatureBadge = card.querySelector('.status-badge.featured');
                            if (unfeatureBadge) {
                                toggleFeaturedStatus(card);
                            }
                            actionText = 'unfeatured';
                            logType = 'category-unfeatured';
                            break;
                            
                        case 'delete':
                            // Already handled by bulkDeleteBtn
                            return;
                            
                        case 'export':
                            actionText = 'exported';
                            break;
                    }
                    
                    if (logType) {
                        logActivity(logType, `"${categoryName}" category ${actionText} (bulk action)`);
                    }
                }
            });
            
            if (action !== 'delete') {
                closeModal(bulkActionsModal);
                showToast(`${selected.length} category(ies) ${actionText}`, 'success');
                
                // Reset selection
                selectAllCategories.checked = false;
                updateSelectedCount();
            }
        });
    });
    
    closeBulkModal.addEventListener('click', function() {
        closeModal(bulkActionsModal);
    });
    
    // Quick action buttons
    reorderCategoriesBtn.addEventListener('click', function() {
        showToast('Reorder mode activated. Drag and drop categories to reorder.', 'info');
        // In a real app, this would enable drag-and-drop functionality
    });
    
    bulkEnableBtn.addEventListener('click', function() {
        // Select all disabled categories and enable them
        const disabledCards = document.querySelectorAll('.status-badge.disabled');
        disabledCards.forEach(badge => {
            const card = badge.closest('.category-card');
            const checkbox = card.querySelector('.category-select');
            checkbox.checked = true;
        });
        
        updateSelectedCount();
        
        if (disabledCards.length > 0) {
            showToast(`${disabledCards.length} disabled categories selected for bulk enable`, 'info');
            openModal(bulkActionsModal);
        } else {
            showToast('No disabled categories found', 'info');
        }
    });
    
    setFeaturedBtn.addEventListener('click', function() {
        // Select all non-featured categories
        const nonFeaturedCards = document.querySelectorAll('.category-card:not([data-featured="true"])');
        nonFeaturedCards.forEach(card => {
            const checkbox = card.querySelector('.category-select');
            checkbox.checked = true;
        });
        
        updateSelectedCount();
        
        if (nonFeaturedCards.length > 0) {
            showToast(`${nonFeaturedCards.length} non-featured categories selected`, 'info');
            openModal(bulkActionsModal);
        } else {
            showToast('All categories are already featured', 'info');
        }
    });
    
    exportCategoriesBtn.addEventListener('click', function() {
        // Select all categories
        const allCheckboxes = document.querySelectorAll('.category-select');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        
        updateSelectedCount();
        showToast('All categories selected for export', 'info');
        
        // Simulate export
        setTimeout(() => {
            showToast('Categories exported successfully! Download will start shortly.', 'success');
            
            // Reset selection
            selectAllCategories.checked = false;
            allCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            updateSelectedCount();
        }, 1000);
    });
    
    categoryAnalyticsBtn.addEventListener('click', function() {
        showToast('Opening category analytics dashboard...', 'info');
        // In a real app, this would navigate to analytics page
    });
    
    mergeCategoriesBtn.addEventListener('click', function() {
        showToast('Merge categories feature coming soon!', 'info');
        // In a real app, this would open a merge categories modal
    });
    
    // Import categories button
    importCategoriesBtn.addEventListener('click', function() {
        // Create a file input dynamically
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json,.csv';
        
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                showToast(`Importing ${file.name}...`, 'info');
                
                // Simulate import process
                setTimeout(() => {
                    showToast('Categories imported successfully!', 'success');
                    
                    // Simulate adding imported categories
                    const importedCategories = [
                        {
                            name: 'Virtual Events',
                            icon: 'laptop',
                            description: 'Online webinars, virtual conferences, and remote workshops',
                            events: 15,
                            attendees: 3200,
                            revenue: '$25.4K',
                            status: 'active',
                            featured: true,
                            tags: ['Online', 'Virtual', 'Webinar']
                        },
                        {
                            name: 'Charity & Fundraising',
                            icon: 'heart',
                            description: 'Charity events, fundraising galas, and donation drives',
                            events: 8,
                            attendees: 1850,
                            revenue: '$42.8K',
                            status: 'active',
                            featured: false,
                            tags: ['Charity', 'Fundraising', 'Non-profit']
                        }
                    ];
                    
                    importedCategories.forEach(category => {
                        const newCategory = {
                            ...category,
                            id: generateCategoryId()
                        };
                        const categoryCard = createCategoryCard(newCategory);
                        categoriesGrid.prepend(categoryCard);
                    });
                    
                    updateCategoryStats();
                    updateCategoryCount();
                    
                    logActivity('categories-imported', '2 new categories imported from file');
                }, 1500);
            }
        });
        
        fileInput.click();
    });
    
    // Pagination functionality
    const pageBtns = document.querySelectorAll('.page-btn');
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    
    pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            pageBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const pageNum = parseInt(this.textContent);
            showToast(`Loading page ${pageNum}...`, 'info');
            
            // Update pagination buttons state
            prevBtn.disabled = pageNum === 1;
            nextBtn.disabled = pageNum === 5; // Assuming 5 is last page
            
            // In a real app, this would load the corresponding page data
        });
    });
    
    prevBtn.addEventListener('click', function() {
        if (!this.disabled) {
            const activePage = document.querySelector('.page-btn.active');
            const currentPage = parseInt(activePage.textContent);
            const prevPage = currentPage - 1;
            
            if (prevPage >= 1) {
                // Find and click the previous page button
                const prevPageBtn = Array.from(pageBtns).find(btn => parseInt(btn.textContent) === prevPage);
                if (prevPageBtn) {
                    prevPageBtn.click();
                }
            }
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (!this.disabled) {
            const activePage = document.querySelector('.page-btn.active');
            const currentPage = parseInt(activePage.textContent);
            const nextPage = currentPage + 1;
            const maxPage = 5; // Assuming 5 is last page
            
            if (nextPage <= maxPage) {
                // Find and click the next page button
                const nextPageBtn = Array.from(pageBtns).find(btn => parseInt(btn.textContent) === nextPage);
                if (nextPageBtn) {
                    nextPageBtn.click();
                }
            }
        }
    });
    
    // Activity logging function
    function logActivity(type, description) {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;
        
        const activityIcons = {
            'category-added': 'fa-tag',
            'category-updated': 'fa-edit',
            'category-featured': 'fa-star',
            'category-unfeatured': 'fa-star',
            'category-enabled': 'fa-toggle-on',
            'category-disabled': 'fa-ban',
            'category-deleted': 'fa-trash',
            'categories-imported': 'fa-upload'
        };
        
        const activityTitles = {
            'category-added': 'Category Added',
            'category-updated': 'Category Updated',
            'category-featured': 'Category Featured',
            'category-unfeatured': 'Category Unfeatured',
            'category-enabled': 'Category Enabled',
            'category-disabled': 'Category Disabled',
            'category-deleted': 'Category Deleted',
            'categories-imported': 'Categories Imported'
        };
        
        const iconClass = activityIcons[type] || 'fa-tag';
        const title = activityTitles[type] || 'Category Activity';
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon category-updated">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="activity-content">
                <h4>${title}</h4>
                <p>${description}</p>
                <span class="activity-time">Just now</span>
            </div>
        `;
        
        // Add to the top of the activity list
        activityList.prepend(activityItem);
        
        // Limit to 4 items
        const items = activityList.querySelectorAll('.activity-item');
        if (items.length > 4) {
            items[items.length - 1].remove();
        }
    }
    
    // Toast notification function
    function showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to body
        document.body.appendChild(toast);
        
        // Add CSS for toast if not already present
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    top: 100px;
                    right: 30px;
                    background: var(--bg-primary);
                    border-left: 4px solid var(--primary-color);
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 300px;
                    max-width: 400px;
                    z-index: 9999;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                }
                .toast.active {
                    transform: translateX(0);
                }
                .toast-success {
                    border-left-color: var(--success-color);
                }
                .toast-warning {
                    border-left-color: var(--warning-color);
                }
                .toast-error, .toast-danger {
                    border-left-color: var(--danger-color);
                }
                .toast-info {
                    border-left-color: var(--info-color);
                }
                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex: 1;
                }
                .toast-content i {
                    font-size: 18px;
                }
                .toast-success .toast-content i {
                    color: var(--success-color);
                }
                .toast-warning .toast-content i {
                    color: var(--warning-color);
                }
                .toast-error .toast-content i,
                .toast-danger .toast-content i {
                    color: var(--danger-color);
                }
                .toast-info .toast-content i {
                    color: var(--info-color);
                }
                .toast-close {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 5px;
                    margin-left: 10px;
                }
                .toast-close:hover {
                    color: var(--text-primary);
                }
            `;
            document.head.appendChild(style);
        }
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('active');
        }, 10);
        
        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            removeToast(toast);
        }, 5000);
        
        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            removeToast(toast);
        });
        
        function removeToast(toastElement) {
            toastElement.classList.remove('active');
            setTimeout(() => {
                if (toastElement.parentNode) {
                    toastElement.parentNode.removeChild(toastElement);
                }
            }, 300);
        }
    }
    
    function getToastIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'error':
            case 'danger': return 'fa-times-circle';
            default: return 'fa-info-circle';
        }
    }
    
    // Initialize tooltips
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[title]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function(e) {
                const title = this.getAttribute('title');
                if (!title) return;
                
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = title;
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
                
                this.removeAttribute('title');
                this.dataset.originalTitle = title;
                
                // Add CSS for tooltip if not already present
                if (!document.querySelector('#tooltip-styles')) {
                    const style = document.createElement('style');
                    style.id = 'tooltip-styles';
                    style.textContent = `
                        .tooltip {
                            position: fixed;
                            background: var(--text-primary);
                            color: var(--bg-primary);
                            padding: 5px 10px;
                            border-radius: var(--radius-sm);
                            font-size: 12px;
                            z-index: 9999;
                            white-space: nowrap;
                            pointer-events: none;
                            box-shadow: var(--shadow-md);
                        }
                        .tooltip:after {
                            content: '';
                            position: absolute;
                            top: 100%;
                            left: 50%;
                            margin-left: -5px;
                            border-width: 5px;
                            border-style: solid;
                            border-color: var(--text-primary) transparent transparent transparent;
                        }
                    `;
                    document.head.appendChild(style);
                }
            });
            
            element.addEventListener('mouseleave', function() {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
                
                const originalTitle = this.dataset.originalTitle;
                if (originalTitle) {
                    this.setAttribute('title', originalTitle);
                    delete this.dataset.originalTitle;
                }
            });
        });
    }
    
    // Initialize tooltips
    initTooltips();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + N: Add new category
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            addCategoryBtn.click();
        }
        
        // Ctrl/Cmd + F: Focus search
        if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
            event.preventDefault();
            categorySearch.focus();
        }
        
        // Escape: Close modals
        if (event.key === 'Escape') {
            if (addCategoryModal.classList.contains('active')) {
                closeModal(addCategoryModal);
            }
            if (editCategoryModal.classList.contains('active')) {
                closeModal(editCategoryModal);
            }
            if (bulkActionsModal.classList.contains('active')) {
                closeModal(bulkActionsModal);
            }
            if (notificationPanel.classList.contains('active')) {
                notificationPanel.classList.remove('active');
            }
        }
    });
    
    // Export categories data (for demonstration)
    window.exportCategoriesData = function() {
        const categories = [];
        document.querySelectorAll('.category-card').forEach(card => {
            const category = {
                id: card.querySelector('.category-id').textContent.replace('ID: ', ''),
                name: card.querySelector('.category-name').textContent,
                description: card.querySelector('.category-description').textContent,
                events: parseInt(card.querySelector('.stat-value').textContent),
                status: card.querySelector('.status-badge.active, .status-badge.disabled, .status-badge.pending').textContent.toLowerCase(),
                featured: card.querySelector('.status-badge.featured') !== null
            };
            categories.push(category);
        });
        
        return categories;
    };
    
    // Initialize everything
    console.log('Evento Admin Categories page initialized successfully!');
});