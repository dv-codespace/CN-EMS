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
    const categoriesGrid = document.getElementById('categoriesGrid');
    const tagsContainer = document.getElementById('tagsContainer');
    const searchBtn = document.getElementById('searchBtn');
    const createCategoryBtn = document.getElementById('createCategoryBtn');
    const addTagBtn = document.getElementById('addTagBtn');
    
    // Modal elements
    const categoryModal = document.getElementById('categoryModal');
    const modalTitle = document.getElementById('modalTitle');
    const categoryForm = document.getElementById('categoryForm');
    const categoryName = document.getElementById('categoryName');
    const categoryDescription = document.getElementById('categoryDescription');
    const categoryColor = document.getElementById('categoryColor');
    const categoryIcon = document.getElementById('categoryIcon');
    const categoryFeatured = document.getElementById('categoryFeatured');
    const selectedIcon = document.getElementById('selectedIcon');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeModal = document.getElementById('closeModal');
    
    // Search elements
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const closeSearch = document.getElementById('closeSearch');
    
    // View options
    const viewOptions = document.querySelectorAll('.view-option');
    
    // Chart filter
    const chartFilter = document.getElementById('chartFilter');
    
    // Color presets
    const colorPresets = document.querySelectorAll('.color-preset');
    
    // Sample data
    const categoriesData = [
        {
            id: 1,
            name: 'Technology',
            description: 'Tech conferences, workshops, and IT events',
            color: '#4361ee',
            icon: 'fas fa-laptop-code',
            events: 12,
            attendees: 1250,
            featured: true
        },
        {
            id: 2,
            name: 'Music',
            description: 'Concerts, festivals, and music performances',
            color: '#f472b6',
            icon: 'fas fa-music',
            events: 8,
            attendees: 3500,
            featured: true
        },
        {
            id: 3,
            name: 'Education',
            description: 'Workshops, seminars, and training sessions',
            color: '#4cc9f0',
            icon: 'fas fa-graduation-cap',
            events: 6,
            attendees: 800,
            featured: false
        },
        {
            id: 4,
            name: 'Business',
            description: 'Networking, conferences, and corporate events',
            color: '#4ade80',
            icon: 'fas fa-briefcase',
            events: 9,
            attendees: 2200,
            featured: false
        },
        {
            id: 5,
            name: 'Health & Wellness',
            description: 'Fitness classes, wellness workshops, health seminars',
            color: '#f87171',
            icon: 'fas fa-heart',
            events: 5,
            attendees: 600,
            featured: false
        },
        {
            id: 6,
            name: 'Food & Drink',
            description: 'Food festivals, cooking classes, wine tastings',
            color: '#fbbf24',
            icon: 'fas fa-utensils',
            events: 7,
            attendees: 1200,
            featured: false
        },
        {
            id: 7,
            name: 'Sports',
            description: 'Sporting events, tournaments, fitness challenges',
            color: '#a78bfa',
            icon: 'fas fa-futbol',
            events: 4,
            attendees: 2800,
            featured: false
        },
        {
            id: 8,
            name: 'Arts & Culture',
            description: 'Art exhibitions, theater, cultural festivals',
            color: '#ec4899',
            icon: 'fas fa-palette',
            events: 3,
            attendees: 900,
            featured: false
        }
    ];
    
    const tagsData = [
        { id: 1, name: 'Conference', count: 15, popular: true },
        { id: 2, name: 'Workshop', count: 12, popular: true },
        { id: 3, name: 'Networking', count: 8, popular: false },
        { id: 4, name: 'Virtual', count: 6, popular: true },
        { id: 5, name: 'Free', count: 10, popular: false },
        { id: 6, name: 'Beginner', count: 7, popular: false },
        { id: 7, name: 'Advanced', count: 5, popular: false },
        { id: 8, name: 'Certification', count: 3, popular: false },
        { id: 9, name: 'Charity', count: 4, popular: false },
        { id: 10, name: 'Family', count: 9, popular: false }
    ];
    
    // Current mode for modal
    let currentModalMode = 'create'; // 'create' or 'edit'
    let currentEditingId = null;
    
    // Initialize the page
    function initCategories() {
        // Update date display
        updateDateDisplay();
        
        // Load categories
        loadCategories();
        
        // Load tags
        loadTags();
        
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
    
    // Load categories
    function loadCategories() {
        categoriesGrid.innerHTML = '';
        
        categoriesData.forEach(category => {
            const categoryCard = createCategoryCard(category);
            categoriesGrid.appendChild(categoryCard);
        });
    }
    
    // Create category card element
    function createCategoryCard(category) {
        const card = document.createElement('div');
        card.className = `category-card ${category.featured ? 'featured' : ''}`;
        card.dataset.id = category.id;
        
        card.innerHTML = `
            ${category.featured ? '<span class="featured-badge">Featured</span>' : ''}
            <div class="category-header">
                <div style="display: flex; align-items: flex-start;">
                    <div class="category-icon" style="background-color: ${category.color}">
                        <i class="${category.icon}"></i>
                    </div>
                    <div class="category-info">
                        <h4 class="category-title">${category.name}</h4>
                        <p class="category-description">${category.description}</p>
                    </div>
                </div>
            </div>
            
            <div class="category-stats">
                <div class="stat">
                    <span class="stat-value">${category.events}</span>
                    <span class="stat-label">Events</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${category.attendees.toLocaleString()}</span>
                    <span class="stat-label">Attendees</span>
                </div>
            </div>
            
            <div class="category-actions">
                <button class="category-btn edit" data-action="edit">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="category-btn delete" data-action="delete">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        `;
        
        // Add event listeners to action buttons
        const editBtn = card.querySelector('.category-btn.edit');
        const deleteBtn = card.querySelector('.category-btn.delete');
        
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openEditModal(category);
        });
        
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteCategory(category);
        });
        
        // Add click event to view category
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.category-btn')) {
                showCategoryDetails(category);
            }
        });
        
        return card;
    }
    
    // Load tags
    function loadTags() {
        tagsContainer.innerHTML = '';
        
        tagsData.forEach(tag => {
            const tagElement = createTagElement(tag);
            tagsContainer.appendChild(tagElement);
        });
    }
    
    // Create tag element
    function createTagElement(tag) {
        const tagEl = document.createElement('div');
        tagEl.className = `tag ${tag.popular ? 'tag-popular' : ''}`;
        tagEl.dataset.id = tag.id;
        
        tagEl.innerHTML = `
            <span>${tag.name}</span>
            <span class="tag-count">(${tag.count})</span>
            <span class="tag-remove">
                <i class="fas fa-times"></i>
            </span>
        `;
        
        // Add event listeners
        const removeBtn = tagEl.querySelector('.tag-remove');
        
        tagEl.addEventListener('click', function(e) {
            if (!e.target.closest('.tag-remove')) {
                filterByTag(tag.name);
            }
        });
        
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            removeTag(tag.id);
        });
        
        return tagEl;
    }
    
    // Open create modal
    function openCreateModal() {
        currentModalMode = 'create';
        modalTitle.textContent = 'New Category';
        categoryForm.reset();
        categoryColor.value = '#4361ee';
        categoryIcon.value = 'fas fa-laptop-code';
        categoryFeatured.checked = false;
        updateSelectedIcon();
        categoryModal.classList.add('active');
        categoryName.focus();
    }
    
    // Open edit modal
    function openEditModal(category) {
        currentModalMode = 'edit';
        currentEditingId = category.id;
        modalTitle.textContent = 'Edit Category';
        
        // Fill form with category data
        categoryName.value = category.name;
        categoryDescription.value = category.description;
        categoryColor.value = category.color;
        categoryIcon.value = category.icon;
        categoryFeatured.checked = category.featured;
        
        updateSelectedIcon();
        categoryModal.classList.add('active');
        categoryName.focus();
    }
    
    // Show category details
    function showCategoryDetails(category) {
        showNotification(`Viewing category: ${category.name} (${category.events} events)`);
    }
    
    // Delete category
    function deleteCategory(category) {
        if (confirm(`Are you sure you want to delete the category "${category.name}"? This will affect ${category.events} events.`)) {
            showNotification(`Category "${category.name}" has been deleted`);
            // In a real app, this would make an API call
            // Then reload categories
            setTimeout(() => {
                loadCategories();
            }, 1000);
        }
    }
    
    // Filter by tag
    function filterByTag(tagName) {
        showNotification(`Filtering events by tag: ${tagName}`);
        // In a real app, this would filter the events list
    }
    
    // Remove tag
    function removeTag(tagId) {
        if (confirm('Are you sure you want to remove this tag?')) {
            showNotification('Tag removed successfully');
            // In a real app, this would make an API call
            // Then reload tags
            setTimeout(() => {
                loadTags();
            }, 1000);
        }
    }
    
    // Update selected icon preview
    function updateSelectedIcon() {
        const iconClass = categoryIcon.value;
        selectedIcon.innerHTML = `<i class="${iconClass}"></i>`;
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
        
        // Create category button
        createCategoryBtn.addEventListener('click', openCreateModal);
        
        // Add tag button
        addTagBtn.addEventListener('click', function() {
            const tagName = prompt('Enter new tag name:');
            if (tagName && tagName.trim()) {
                showNotification(`New tag "${tagName}" added`);
                // In a real app, this would add the tag
            }
        });
        
        // Search button
        searchBtn.addEventListener('click', function() {
            searchModal.classList.add('active');
            searchInput.focus();
        });
        
        // View options
        viewOptions.forEach(option => {
            option.addEventListener('click', function() {
                const viewType = this.dataset.view;
                
                // Update active state
                viewOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Update grid layout
                if (viewType === 'list') {
                    categoriesGrid.style.gridTemplateColumns = '1fr';
                } else {
                    categoriesGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
                }
            });
        });
        
        // Chart filter
        chartFilter.addEventListener('change', function() {
            showNotification(`Chart updated for: ${this.options[this.selectedIndex].text}`);
        });
        
        // Form submission
        categoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveCategory();
        });
        
        // Cancel button
        cancelBtn.addEventListener('click', function() {
            categoryModal.classList.remove('active');
        });
        
        // Close modal buttons
        closeModal.addEventListener('click', function() {
            categoryModal.classList.remove('active');
        });
        
        categoryModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
        
        // Icon change
        categoryIcon.addEventListener('change', updateSelectedIcon);
        
        // Color presets
        colorPresets.forEach(preset => {
            preset.addEventListener('click', function() {
                const color = this.dataset.color;
                categoryColor.value = color;
            });
        });
        
        // Search functionality
        closeSearch.addEventListener('click', function() {
            searchModal.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        });
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            
            if (searchTerm.length >= 2) {
                showSearchResults(searchTerm);
            } else {
                searchResults.innerHTML = '';
            }
        });
        
        // Close search when clicking outside
        searchModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                searchInput.value = '';
                searchResults.innerHTML = '';
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', handleResize);
        
        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
                if (categoryModal.classList.contains('active')) {
                    categoryModal.classList.remove('active');
                }
                if (searchModal.classList.contains('active')) {
                    searchModal.classList.remove('active');
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                }
            }
        });
    }
    
    // Save category
    function saveCategory() {
        const categoryData = {
            name: categoryName.value.trim(),
            description: categoryDescription.value.trim(),
            color: categoryColor.value,
            icon: categoryIcon.value,
            featured: categoryFeatured.checked
        };
        
        // Validation
        if (!categoryData.name) {
            showNotification('Please enter a category name', 'error');
            categoryName.focus();
            return;
        }
        
        // Simulate API call
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveBtn.disabled = true;
        
        setTimeout(() => {
            if (currentModalMode === 'create') {
                showNotification(`Category "${categoryData.name}" created successfully`);
            } else {
                showNotification(`Category "${categoryData.name}" updated successfully`);
            }
            
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Category';
            saveBtn.disabled = false;
            categoryModal.classList.remove('active');
            
            // In a real app, this would reload categories from server
            setTimeout(() => {
                loadCategories();
            }, 500);
        }, 1500);
    }
    
    // Show search results
    function showSearchResults(searchTerm) {
        // Search in categories
        const categoryResults = categoriesData.filter(category => 
            category.name.toLowerCase().includes(searchTerm) ||
            category.description.toLowerCase().includes(searchTerm)
        );
        
        // Search in tags
        const tagResults = tagsData.filter(tag =>
            tag.name.toLowerCase().includes(searchTerm)
        );
        
        searchResults.innerHTML = '';
        
        if (categoryResults.length === 0 && tagResults.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No categories or tags found matching your search.</p>';
            return;
        }
        
        // Add category results
        if (categoryResults.length > 0) {
            const categoryHeader = document.createElement('h4');
            categoryHeader.textContent = 'Categories';
            categoryHeader.style.marginBottom = '10px';
            categoryHeader.style.color = 'var(--text-primary)';
            searchResults.appendChild(categoryHeader);
            
            categoryResults.forEach(category => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 30px; height: 30px; background: ${category.color}; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white;">
                            <i class="${category.icon}" style="font-size: 14px;"></i>
                        </div>
                        <div>
                            <h5 style="margin: 0; font-size: 14px;">${category.name}</h5>
                            <p style="margin: 0; font-size: 12px; color: var(--text-secondary);">${category.description}</p>
                        </div>
                    </div>
                `;
                
                resultItem.addEventListener('click', function() {
                    searchModal.classList.remove('active');
                    searchInput.value = '';
                    openEditModal(category);
                });
                
                searchResults.appendChild(resultItem);
            });
        }
        
        // Add tag results
        if (tagResults.length > 0) {
            if (categoryResults.length > 0) {
                const separator = document.createElement('div');
                separator.style.height = '1px';
                separator.style.background = 'var(--border-color)';
                separator.style.margin = '15px 0';
                searchResults.appendChild(separator);
            }
            
            const tagHeader = document.createElement('h4');
            tagHeader.textContent = 'Tags';
            tagHeader.style.marginBottom = '10px';
            tagHeader.style.color = 'var(--text-primary)';
            searchResults.appendChild(tagHeader);
            
            tagResults.forEach(tag => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 30px; height: 30px; background: var(--primary-light); border-radius: 15px; display: flex; align-items: center; justify-content: center; color: var(--primary-color);">
                            <i class="fas fa-tag" style="font-size: 12px;"></i>
                        </div>
                        <div>
                            <h5 style="margin: 0; font-size: 14px;">${tag.name}</h5>
                            <p style="margin: 0; font-size: 12px; color: var(--text-secondary);">Used in ${tag.count} events</p>
                        </div>
                    </div>
                `;
                
                resultItem.addEventListener('click', function() {
                    searchModal.classList.remove('active');
                    searchInput.value = '';
                    filterByTag(tag.name);
                });
                
                searchResults.appendChild(resultItem);
            });
        }
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
    function showNotification(message, type = 'success') {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification-toast');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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
                    border-left-color: var(--primary-color);
                }
                
                .notification-toast.error {
                    border-left-color: var(--danger-color);
                }
                
                .notification-toast i {
                    font-size: 18px;
                }
                
                .notification-toast.success i {
                    color: var(--primary-color);
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
    
    // Initialize the page
    initCategories();
    handleResize();
});