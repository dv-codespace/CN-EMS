// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    const resetFilters = document.getElementById('resetFilters');
    const bulkActionsBtn = document.getElementById('bulkActions');
    const exportBookmarksBtn = document.getElementById('exportBookmarks');
    const shareBookmarksBtn = document.getElementById('shareBookmarks');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const removeBookmarkButtons = document.querySelectorAll('.remove-bookmark');
    const moreOptionsButtons = document.querySelectorAll('.more-options');
    const viewTicketButtons = document.querySelectorAll('.btn-view-ticket');
    const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
    const bookNowButtons = document.querySelectorAll('.btn-book-now');
    const loadMoreBtn = document.getElementById('loadMoreBookmarks');
    const refreshOverviewBtn = document.getElementById('refreshOverview');
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');
    const bookmarkSimilarButtons = document.querySelectorAll('.btn-bookmark-similar');
    const exploreEventsBtn = document.getElementById('exploreEventsBtn');
    const closeEventModal = document.getElementById('closeEventModal');
    const eventModal = document.getElementById('eventModal');
    const closeCollectionModal = document.getElementById('closeCollectionModal');
    const collectionModal = document.getElementById('collectionModal');
    const closeBulkModal = document.getElementById('closeBulkModal');
    const bulkActionsModal = document.getElementById('bulkActionsModal');
    const cancelCollectionBtn = document.getElementById('cancelCollection');
    const createCollectionBtn = document.getElementById('createCollectionBtn');
    const bulkActionButtons = document.querySelectorAll('.bulk-action-btn');
    const colorOptions = document.querySelectorAll('.color-option');
    
    // Bookmarks data
    const bookmarkCards = document.querySelectorAll('.bookmark-card');
    let selectedColor = '#06b6d4';
    
    // Initialize bookmarks page
    initBookmarksPage();
    
    function initBookmarksPage() {
        // Setup event listeners
        setupEventListeners();
        
        // Update counts
        updateBookmarkCounts();
        
        // Initialize color options
        initColorOptions();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Filter controls
        categoryFilter.addEventListener('change', filterBookmarks);
        statusFilter.addEventListener('change', filterBookmarks);
        sortFilter.addEventListener('change', sortBookmarks);
        
        // Reset filters
        resetFilters.addEventListener('click', function() {
            categoryFilter.value = 'all';
            statusFilter.value = 'all';
            sortFilter.value = 'date-added';
            filterBookmarks();
            showNotification('Filters reset to default');
        });
        
        // Search input
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length > 2) {
                filterBookmarks();
            } else if (searchTerm.length === 0) {
                filterBookmarks();
            }
        });
        
        // Bulk actions
        bulkActionsBtn.addEventListener('click', function() {
            openBulkActionsModal();
        });
        
        // Export bookmarks
        exportBookmarksBtn.addEventListener('click', function() {
            showNotification('Exporting bookmarks...', 'info');
            
            // Simulate export process
            setTimeout(() => {
                showNotification('Bookmarks exported successfully!', 'success');
            }, 2000);
        });
        
        // Share bookmarks
        shareBookmarksBtn.addEventListener('click', function() {
            showNotification('Sharing bookmarks list...', 'info');
        });
        
        // Category tabs
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                if (this.classList.contains('more-categories')) {
                    showNotification('Opening more categories...', 'info');
                    return;
                }
                
                // Update active tab
                categoryTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                filterByCategory(category);
            });
        });
        
        // Remove bookmark buttons
        removeBookmarkButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const bookmarkCard = this.closest('.bookmark-card');
                const eventName = bookmarkCard.querySelector('h4').textContent;
                
                if (confirm(`Remove "${eventName}" from bookmarks?`)) {
                    // Animate removal
                    bookmarkCard.style.opacity = '0.5';
                    bookmarkCard.style.transform = 'translateX(-100%)';
                    
                    setTimeout(() => {
                        bookmarkCard.remove();
                        updateBookmarkCounts();
                        checkEmptyState();
                        showNotification(`"${eventName}" removed from bookmarks`, 'success');
                    }, 300);
                }
            });
        });
        
        // More options buttons
        moreOptionsButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const bookmarkCard = this.closest('.bookmark-card');
                const eventName = bookmarkCard.querySelector('h4').textContent;
                showMoreOptions(eventName, bookmarkCard);
            });
        });
        
        // View ticket buttons
        viewTicketButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const bookmarkCard = this.closest('.bookmark-card');
                const eventName = bookmarkCard.querySelector('h4').textContent;
                showNotification(`Opening ticket for ${eventName}...`, 'info');
            });
        });
        
        // View details buttons
        viewDetailsButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const bookmarkCard = this.closest('.bookmark-card');
                const eventName = bookmarkCard.querySelector('h4').textContent;
                const eventDescription = bookmarkCard.querySelector('.event-description').textContent;
                const eventInfo = bookmarkCard.querySelectorAll('.info-item');
                openEventModal(eventName, eventDescription, eventInfo);
            });
        });
        
        // Book now buttons
        bookNowButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const bookmarkCard = this.closest('.bookmark-card');
                const eventName = bookmarkCard.querySelector('h4').textContent;
                
                showNotification(`Booking tickets for ${eventName}...`, 'info');
                
                // Change button state
                this.innerHTML = '<i class="fas fa-check"></i> Booked';
                this.disabled = true;
                this.style.opacity = '0.7';
                
                // Update status
                const statusBadge = bookmarkCard.querySelector('.bookmark-status');
                statusBadge.innerHTML = '<i class="fas fa-check-circle"></i><span>Booked</span>';
                statusBadge.className = 'bookmark-status booked';
                
                setTimeout(() => {
                    showNotification(`Successfully booked ${eventName}!`, 'success');
                }, 1500);
            });
        });
        
        // Load more bookmarks
        loadMoreBtn.addEventListener('click', function() {
            showNotification('Loading more bookmarks...', 'info');
            
            // Simulate loading
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                // In a real app, this would load more bookmarks from API
                this.innerHTML = '<i class="fas fa-check"></i> All Bookmarks Loaded';
                this.style.opacity = '0.7';
                showNotification('All bookmarks loaded', 'success');
            }, 2000);
        });
        
        // Refresh overview
        refreshOverviewBtn.addEventListener('click', function() {
            showNotification('Refreshing overview...', 'info');
            
            // Animate refresh
            this.style.transform = 'rotate(360deg)';
            this.style.transition = 'transform 0.5s ease';
            
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
                showNotification('Overview refreshed', 'success');
            }, 500);
        });
        
        // Quick action buttons
        quickActionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.querySelector('h5').textContent;
                switch(action) {
                    case 'Create Collection':
                        openCollectionModal();
                        break;
                    case 'Set Reminders':
                        showNotification('Setting reminders for bookmarked events...', 'info');
                        break;
                    case 'Compare Events':
                        showNotification('Opening event comparison...', 'info');
                        break;
                    case 'Share with Friends':
                        showNotification('Sharing bookmarks with friends...', 'info');
                        break;
                }
            });
        });
        
        // Bookmark similar events
        bookmarkSimilarButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const similarEvent = this.closest('.similar-event');
                const eventName = similarEvent.querySelector('h5').textContent;
                
                // Toggle bookmark state
                const isBookmarked = this.querySelector('i').classList.contains('fas');
                
                if (isBookmarked) {
                    this.innerHTML = '<i class="far fa-bookmark"></i>';
                    showNotification(`Removed ${eventName} from bookmarks`, 'info');
                } else {
                    this.innerHTML = '<i class="fas fa-bookmark"></i>';
                    this.style.color = 'var(--primary-color)';
                    showNotification(`Added ${eventName} to bookmarks`, 'success');
                    
                    // Update counts
                    updateBookmarkCounts();
                }
            });
        });
        
        // Explore events button
        exploreEventsBtn.addEventListener('click', function() {
            showNotification('Opening events explorer...', 'info');
        });
        
        // Bookmark card clicks
        bookmarkCards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('button') && !e.target.closest('.icon-btn')) {
                    const eventName = this.querySelector('h4').textContent;
                    const eventDescription = this.querySelector('.event-description').textContent;
                    const eventInfo = this.querySelectorAll('.info-item');
                    openEventModal(eventName, eventDescription, eventInfo);
                }
            });
        });
        
        // Close event modal
        closeEventModal.addEventListener('click', function() {
            closeModal(eventModal);
        });
        
        // Close modal when clicking outside
        eventModal.addEventListener('click', function(e) {
            if (e.target === eventModal) {
                closeModal(eventModal);
            }
        });
        
        // Collection modal functionality
        closeCollectionModal.addEventListener('click', function() {
            closeModal(collectionModal);
        });
        
        collectionModal.addEventListener('click', function(e) {
            if (e.target === collectionModal) {
                closeModal(collectionModal);
            }
        });
        
        cancelCollectionBtn.addEventListener('click', function() {
            closeModal(collectionModal);
        });
        
        createCollectionBtn.addEventListener('click', function() {
            const collectionName = document.getElementById('collectionName').value;
            const collectionDescription = document.getElementById('collectionDescription').value;
            
            if (!collectionName.trim()) {
                showNotification('Please enter a collection name', 'error');
                return;
            }
            
            // Create collection logic
            showNotification(`Collection "${collectionName}" created successfully!`, 'success');
            closeModal(collectionModal);
            
            // Reset form
            document.getElementById('collectionName').value = '';
            document.getElementById('collectionDescription').value = '';
            document.getElementById('collectionPrivacy').value = 'private';
            
            // Reset color options
            colorOptions.forEach(option => option.classList.remove('active'));
            colorOptions[0].classList.add('active');
            selectedColor = '#06b6d4';
        });
        
        // Bulk actions modal functionality
        closeBulkModal.addEventListener('click', function() {
            closeModal(bulkActionsModal);
        });
        
        bulkActionsModal.addEventListener('click', function(e) {
            if (e.target === bulkActionsModal) {
                closeModal(bulkActionsModal);
            }
        });
        
        // Bulk action buttons
        bulkActionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.querySelector('h4').textContent;
                showNotification(`Preparing ${action.toLowerCase()}...`, 'info');
                closeModal(bulkActionsModal);
            });
        });
    }
    
    // Initialize color options
    function initColorOptions() {
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                selectedColor = this.getAttribute('data-color');
            });
        });
        
        // Set first color as active by default
        if (colorOptions.length > 0) {
            colorOptions[0].classList.add('active');
        }
    }
    
    // Filter bookmarks based on selected filters
    function filterBookmarks() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const status = statusFilter.value;
        
        let totalCount = 0;
        let upcomingCount = 0;
        let bookedCount = 0;
        let visibleCount = 0;
        
        bookmarkCards.forEach(card => {
            const eventName = card.querySelector('h4').textContent.toLowerCase();
            const eventDescription = card.querySelector('.event-description').textContent.toLowerCase();
            const eventCategory = card.getAttribute('data-category');
            const eventStatus = card.getAttribute('data-status');
            
            // Search filter
            const matchesSearch = searchTerm === '' || 
                eventName.includes(searchTerm) || 
                eventDescription.includes(searchTerm);
            
            // Category filter
            const matchesCategory = category === 'all' || eventCategory === category;
            
            // Status filter
            const matchesStatus = status === 'all' || eventStatus === status;
            
            // Show/hide card
            if (matchesSearch && matchesCategory && matchesStatus) {
                card.style.display = 'block';
                visibleCount++;
                
                // Update counts
                totalCount++;
                if (eventStatus === 'booked') {
                    bookedCount++;
                }
                if (eventStatus === 'interested' || eventStatus === 'upcoming') {
                    upcomingCount++;
                }
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update stats
        document.getElementById('totalBookmarks').textContent = totalCount;
        document.getElementById('upcomingBookmarks').textContent = upcomingCount;
        document.getElementById('bookedBookmarks').textContent = bookedCount;
        
        // Check empty state
        checkEmptyState();
        
        if (searchTerm || category !== 'all' || status !== 'all') {
            showNotification(`Found ${visibleCount} bookmarks matching your filters`, 'info');
        }
    }
    
    // Filter by category tab
    function filterByCategory(category) {
        bookmarkCards.forEach(card => {
            const eventCategory = card.getAttribute('data-category');
            
            if (category === 'all' || eventCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        checkEmptyState();
        showNotification(`Showing ${category === 'all' ? 'all' : category} bookmarks`, 'info');
    }
    
    // Sort bookmarks
    function sortBookmarks() {
        const sortBy = sortFilter.value;
        const bookmarksGrid = document.querySelector('.bookmarks-grid');
        
        const items = Array.from(bookmarkCards);
        
        items.sort((a, b) => {
            const aName = a.querySelector('h4').textContent;
            const bName = b.querySelector('h4').textContent;
            const aDate = a.querySelector('.info-item:nth-child(1) span').textContent;
            const bDate = b.querySelector('.info-item:nth-child(1) span').textContent;
            const aPrice = parseFloat(a.querySelector('.price')?.textContent.replace('$', '') || 0);
            const bPrice = parseFloat(b.querySelector('.price')?.textContent.replace('$', '') || 0);
            
            switch(sortBy) {
                case 'date-added':
                    // For demo, we'll sort by some arbitrary order
                    return Math.random() - 0.5;
                case 'date-event':
                    return new Date(aDate) - new Date(bDate);
                case 'popularity':
                    const aAttendees = parseInt(a.querySelector('.info-item:nth-child(3) span').textContent) || 0;
                    const bAttendees = parseInt(b.querySelector('.info-item:nth-child(3) span').textContent) || 0;
                    return bAttendees - aAttendees;
                case 'name':
                    return aName.localeCompare(bName);
                case 'price':
                    return aPrice - bPrice;
                default:
                    return 0;
            }
        });
        
        // Reorder in DOM
        items.forEach(item => {
            bookmarksGrid.appendChild(item);
        });
        
        showNotification(`Bookmarks sorted by ${sortFilter.options[sortFilter.selectedIndex].text}`, 'info');
    }
    
    // Update bookmark counts
    function updateBookmarkCounts() {
        const totalBookmarks = bookmarkCards.length;
        const bookedBookmarks = Array.from(bookmarkCards).filter(card => 
            card.getAttribute('data-status') === 'booked').length;
        
        // Count categories
        const categories = new Set();
        bookmarkCards.forEach(card => {
            categories.add(card.getAttribute('data-category'));
        });
        
        document.getElementById('totalBookmarks').textContent = totalBookmarks;
        document.getElementById('bookedBookmarks').textContent = bookedBookmarks;
        document.getElementById('categoriesCount').textContent = categories.size;
        document.getElementById('footerTotalBookmarks').textContent = totalBookmarks;
        document.getElementById('footerBookedBookmarks').textContent = bookedBookmarks;
        document.getElementById('footerCategories').textContent = categories.size;
        
        // Update sidebar stats
        document.querySelector('.sidebar-footer .stat-item:nth-child(1) .stat-value').textContent = totalBookmarks;
        document.querySelector('.sidebar-footer .stat-item:nth-child(2) .stat-value').textContent = categories.size;
    }
    
    // Check if empty state should be shown
    function checkEmptyState() {
        const visibleBookmarks = Array.from(bookmarkCards)
            .filter(card => card.style.display !== 'none').length;
        
        const emptyState = document.getElementById('emptyState');
        if (visibleBookmarks === 0) {
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';
        }
    }
    
    // Open event modal
    function openEventModal(eventName, description, infoItems) {
        const modalTitle = document.getElementById('modalEventTitle');
        const modalContent = document.getElementById('modalEventContent');
        
        modalTitle.textContent = eventName;
        
        // Create info HTML
        let infoHTML = '';
        infoItems.forEach(item => {
            infoHTML += `<p>${item.innerHTML}</p>`;
        });
        
        modalContent.innerHTML = `
            <div class="event-modal-content">
                <div class="event-modal-description">
                    <h4>About This Event</h4>
                    <p>${description}</p>
                </div>
                
                <div class="event-modal-info">
                    <h4>Event Information</h4>
                    ${infoHTML}
                </div>
                
                <div class="event-modal-actions">
                    <button class="btn-book-now-modal">
                        <i class="fas fa-shopping-cart"></i> Book Now
                    </button>
                    <button class="btn-share-event">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                    <button class="btn-set-reminder">
                        <i class="fas fa-bell"></i> Set Reminder
                    </button>
                </div>
            </div>
        `;
        
        // Add modal-specific styles if not already added
        if (!document.querySelector('#bookmarks-event-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'bookmarks-event-modal-styles';
            style.textContent = `
                .event-modal-description,
                .event-modal-info {
                    margin-bottom: 25px;
                }
                
                .event-modal-description h4,
                .event-modal-info h4 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    color: var(--text-primary);
                }
                
                .event-modal-description p {
                    color: var(--text-secondary);
                    line-height: 1.6;
                }
                
                .event-modal-info p {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 8px;
                    color: var(--text-primary);
                }
                
                .event-modal-info i {
                    color: var(--primary-color);
                    width: 16px;
                }
                
                .event-modal-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 30px;
                }
                
                .btn-book-now-modal,
                .btn-share-event,
                .btn-set-reminder {
                    flex: 1;
                    padding: 12px;
                    border-radius: var(--radius-md);
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                
                .btn-book-now-modal {
                    background: var(--success-color);
                    color: white;
                    border: none;
                }
                
                .btn-book-now-modal:hover {
                    background: #0da271;
                }
                
                .btn-share-event {
                    background: var(--primary-light);
                    color: var(--primary-color);
                    border: 1px solid var(--primary-color);
                }
                
                .btn-share-event:hover {
                    background: var(--primary-color);
                    color: white;
                }
                
                .btn-set-reminder {
                    background: white;
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                }
                
                .btn-set-reminder:hover {
                    background: var(--bg-secondary);
                }
                
                @media (max-width: 768px) {
                    .event-modal-actions {
                        flex-direction: column;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Show modal
        eventModal.classList.add('active');
        eventModal.style.display = 'flex';
        
        // Add event listeners to modal buttons
        setTimeout(() => {
            const bookNowBtn = modalContent.querySelector('.btn-book-now-modal');
            const shareBtn = modalContent.querySelector('.btn-share-event');
            const reminderBtn = modalContent.querySelector('.btn-set-reminder');
            
            if (bookNowBtn) {
                bookNowBtn.addEventListener('click', function() {
                    showNotification(`Booking ${eventName}...`, 'info');
                    closeModal(eventModal);
                });
            }
            
            if (shareBtn) {
                shareBtn.addEventListener('click', function() {
                    showNotification(`Sharing ${eventName}...`, 'info');
                });
            }
            
            if (reminderBtn) {
                reminderBtn.addEventListener('click', function() {
                    showNotification(`Setting reminder for ${eventName}...`, 'info');
                    this.innerHTML = '<i class="fas fa-check"></i> Reminder Set';
                    this.disabled = true;
                    this.style.opacity = '0.7';
                });
            }
        }, 100);
    }
    
    // Open collection modal
    function openCollectionModal() {
        collectionModal.classList.add('active');
        collectionModal.style.display = 'flex';
    }
    
    // Open bulk actions modal
    function openBulkActionsModal() {
        bulkActionsModal.classList.add('active');
        bulkActionsModal.style.display = 'flex';
    }
    
    // Show more options menu
    function showMoreOptions(eventName, bookmarkCard) {
        // In a real app, this would show a dropdown menu
        const options = [
            'Move to Collection',
            'Set Price Alert',
            'Share with Specific Friends',
            'Add to Calendar',
            'Compare with Similar Events',
            'View Event Website',
            'Contact Organizer'
        ];
        
        showNotification(`More options for ${eventName}: ${options.join(', ')}`, 'info');
    }
    
    // Close modal function
    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    // Show notification (using the same function from dashboard)
    function showNotification(message, type = 'info') {
        // Reuse the notification function from dashboard
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            // Fallback if dashboard function not available
            console.log(`${type}: ${message}`);
            alert(message);
        }
    }
    
    // Initialize on load
    updateBookmarkCounts();
    checkEmptyState();
});