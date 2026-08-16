// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const searchInput = document.getElementById('searchInput');
    const matchFilter = document.getElementById('matchFilter');
    const dateFilter = document.getElementById('dateFilter');
    const resetFilters = document.getElementById('resetFilters');
    const refreshRecommendationsBtn = document.getElementById('refreshRecommendations');
    const managePreferencesBtn = document.getElementById('managePreferences');
    const insightInfoBtn = document.getElementById('insightInfo');
    const quickBookmarkButtons = document.querySelectorAll('.quick-bookmark');
    const moreOptionsButtons = document.querySelectorAll('.more-options');
    const loadMoreBtn = document.getElementById('loadMoreRecommendations');
    const editProfileBtn = document.getElementById('editProfile');
    const improveProfileBtn = document.querySelector('.btn-improve-profile');
    const followEventButtons = document.querySelectorAll('.btn-follow-event');
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');
    const updateProfileBtn = document.getElementById('updateProfileBtn');
    const closeEventModal = document.getElementById('closeEventModal');
    const eventModal = document.getElementById('eventModal');
    const closePreferencesModal = document.getElementById('closePreferencesModal');
    const preferencesModal = document.getElementById('preferencesModal');
    const cancelPreferencesBtn = document.getElementById('cancelPreferences');
    const savePreferencesBtn = document.getElementById('savePreferences');
    const priceRangeSlider = document.getElementById('priceRange');
    const currentPriceSpan = document.getElementById('currentPrice');
    
    // Recommendation data
    let recommendationCards = [];
    let allEvents = [];

    const categoryMap = {
        'Technology': { class: 'tech', icon: 'fas fa-laptop-code', label: 'Tech' },
        'Tech': { class: 'tech', icon: 'fas fa-laptop-code', label: 'Tech' },
        'Music': { class: 'music', icon: 'fas fa-music', label: 'Music' },
        'Food': { class: 'food', icon: 'fas fa-utensils', label: 'Food' },
        'Food & Drink': { class: 'food', icon: 'fas fa-utensils', label: 'Food' },
        'Arts': { class: 'arts', icon: 'fas fa-palette', label: 'Arts' },
        'Business': { class: 'business', icon: 'fas fa-briefcase', label: 'Business' },
        'Sports': { class: 'sports', icon: 'fas fa-futbol', label: 'Sports' }
    };
    
    // Initialize recommendations page
    fetchEvents();
    initRecommendationsPage();

    async function fetchEvents() {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const userNameEl = document.querySelector('.user-profile .user-info h3');
                    if (userNameEl) {
                        userNameEl.textContent = payload.name || payload.email || "Alex Johnson";
                    }
                } catch (e) {
                    console.error("Error decoding token:", e);
                }
            }

            const response = await fetch("http://localhost:3000/api/events", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch events from backend");
            }

            const events = await response.json();
            allEvents = events || [];
            renderEvents(allEvents);

        } catch (error) {
            console.error("Error fetching events:", error);
            showNotification("Failed to load events from server", "error");
        }
    }   
    
    function renderEvents(events) {
        const container = document.getElementById("eventsContainer");
        if (!container) return;
        container.innerHTML = "";

        if (!events || events.length === 0) {
            checkEmptyState();
            return;
        }

        events.forEach((event, index) => {
            const categoryData = categoryMap[event.category] || { class: 'other', icon: 'fas fa-calendar-alt', label: event.category || 'Event' };
            
            const images = {
                tech: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
                music: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
                food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
                arts: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80',
                business: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
                sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
                other: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80'
            };
            const imageUrl = images[categoryData.class] || images.other;

            const simulatedMatch = 75 + (index * 7) % 25; // 75% to 99%
            const matchClass = simulatedMatch >= 90 ? 'high-match' : 'medium-match';
            const matchLabel = simulatedMatch >= 90 ? 'Trending Event' : 'Recommended';

            // Determine event Date Filter tag based on actual date
            let dateTag = 'month'; // default
            if (event.date) {
                const evDate = new Date(event.date);
                const today = new Date();
                const tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);

                if (evDate.toDateString() === today.toDateString()) {
                    dateTag = 'today';
                } else if (evDate.toDateString() === tomorrow.toDateString()) {
                    dateTag = 'tomorrow';
                } else {
                    const oneWeek = new Date();
                    oneWeek.setDate(today.getDate() + 7);
                    if (evDate <= oneWeek) {
                        dateTag = 'week';
                    }
                }
            }

            const priceDisplay = event.price ? (typeof event.price === 'number' || !isNaN(event.price) ? `₹${event.price}` : event.price) : 'Free';

            const eventCard = `
                <div class="recommendation-card ${matchClass}" data-match="${simulatedMatch}" data-date="${dateTag}">
                    <div class="recommendation-header">
                        <div class="match-label">${matchLabel}</div>
                        <div class="match-score">
                            <span class="score-value">${simulatedMatch}%</span>
                            <span class="score-label">Match</span>
                        </div>
                    </div>

                    <div class="recommendation-content">
                        <div class="event-image">
                            <img src="${imageUrl}" alt="${event.title}">
                            <div class="event-category ${categoryData.class}">
                                <i class="${categoryData.icon}"></i> ${categoryData.label}
                            </div>
                        </div>

                        <div class="event-details">
                            <h4>${event.title}</h4>
                            <p class="event-description">
                                ${event.description || 'No description provided.'}
                            </p>

                            <div class="event-info">
                                <div class="info-item">
                                    <i class="fas fa-calendar"></i> ${event.date || 'Date TBD'}
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-map-marker-alt"></i> ${event.location || 'Location TBD'}
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-ticket-alt"></i> ${priceDisplay}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="recommendation-footer">
                        <button class="btn-view-details" data-id="${event.eventId}">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn-book-now" data-id="${event.eventId}">
                            <i class="fas fa-ticket-alt"></i> Register
                        </button>
                    </div>
                </div>
            `;
            container.innerHTML += eventCard;
        });

        // Re-evaluate list of cards for filter controls
        recommendationCards = document.querySelectorAll('#eventsContainer .recommendation-card');

        updateRecommendationCounts();
        checkEmptyState();
        attachDynamicEventListeners();
    }

    async function registerEvent(eventId) {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                showNotification("You must login first", "error");
                return;
            }

            // Show temporary status
            showNotification("Processing registration...", "info");

            const response = await fetch(
                "http://localhost:3000/api/events/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ eventId })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            showNotification(data.message || "Registration successful!", "success");

            // Find matching card register buttons and disable them
            const registerBtns = document.querySelectorAll(`.btn-book-now[data-id="${eventId}"]`);
            registerBtns.forEach(btn => {
                btn.innerHTML = '<i class="fas fa-check"></i> Registered';
                btn.disabled = true;
                btn.style.opacity = '0.7';
                
                // Update match score to 100% on the card
                const card = btn.closest('.recommendation-card');
                if (card) {
                    const scoreVal = card.querySelector('.score-value');
                    if (scoreVal) {
                        scoreVal.textContent = '100%';
                        scoreVal.style.color = 'var(--success-color)';
                    }
                }
            });

        } catch (error) {
            console.error("Registration failed:", error);
            showNotification(error.message, "error");
        }
    }

    function initRecommendationsPage() {
        // Setup event listeners
        setupEventListeners();
        
        // Update counts
        updateRecommendationCounts();
        
        // Initialize price range
        initPriceRange();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Filter controls
        if (matchFilter) matchFilter.addEventListener('change', filterRecommendations);
        if (dateFilter) dateFilter.addEventListener('change', filterRecommendations);
        
        // Reset filters
        if (resetFilters) {
            resetFilters.addEventListener('click', function() {
                if (matchFilter) matchFilter.value = 'all';
                if (dateFilter) dateFilter.value = 'all';
                filterRecommendations();
                showNotification('Filters reset to default');
            });
        }
        
        // Search input
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                if (searchTerm.length > 2 || searchTerm.length === 0) {
                    filterRecommendations();
                }
            });
        }
        
        // Refresh recommendations
        if (refreshRecommendationsBtn) {
            refreshRecommendationsBtn.addEventListener('click', function() {
                showNotification('Refreshing events from database...', 'info');
                
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
                this.disabled = true;
                
                fetchEvents().then(() => {
                    this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
                    this.disabled = false;
                    showNotification('Events refreshed successfully!', 'success');
                }).catch(e => {
                    this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
                    this.disabled = false;
                });
            });
        }
        
        // Manage preferences
        if (managePreferencesBtn) {
            managePreferencesBtn.addEventListener('click', function() {
                openPreferencesModal();
            });
        }
        
        // Insight info
        if (insightInfoBtn) {
            insightInfoBtn.addEventListener('click', function() {
                showNotification('Recommendations are based on your event history, interests, friends activity, and trending events in your area.', 'info');
            });
        }
        
        // Quick bookmark buttons
        quickBookmarkButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const recommendationCard = this.closest('.recommendation-card');
                const eventName = recommendationCard.querySelector('h4').textContent;
                const isBookmarked = this.querySelector('i').classList.contains('fas');
                
                if (isBookmarked) {
                    this.innerHTML = '<i class="far fa-bookmark"></i>';
                    showNotification(`Removed ${eventName} from bookmarks`, 'info');
                } else {
                    this.innerHTML = '<i class="fas fa-bookmark"></i>';
                    this.style.color = 'var(--warning-color)';
                    showNotification(`Added ${eventName} to bookmarks`, 'success');
                }
            });
        });
        
        // More options buttons
        moreOptionsButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const recommendationCard = this.closest('.recommendation-card');
                const eventName = recommendationCard.querySelector('h4').textContent;
                showMoreOptions(eventName, recommendationCard);
            });
        });
        
        // Load more recommendations
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                showNotification('Loading more recommendations...', 'info');
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-check"></i> All Recommendations Loaded';
                    this.style.opacity = '0.7';
                    showNotification('All recommendations loaded', 'success');
                }, 1000);
            });
        }
        
        // Edit profile
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function() {
                showNotification('Opening profile editor...', 'info');
            });
        }
        
        // Improve profile
        if (improveProfileBtn) {
            improveProfileBtn.addEventListener('click', function() {
                showNotification('Improving your profile...', 'info');
                setTimeout(() => {
                    showNotification('Profile strength improved to 95%!', 'success');
                    const profileScore = document.querySelector('.profile-score-circle .score-value');
                    if (profileScore) profileScore.textContent = '95%';
                    const ring = document.querySelector('.profile-score-circle .score-ring-fill');
                    if (ring) ring.style.strokeDashoffset = '37.68';
                }, 1000);
            });
        }
        
        // Follow event buttons
        followEventButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const friendRecommendation = this.closest('.friend-recommendation');
                const friendName = friendRecommendation.querySelector('h5').textContent;
                const eventName = friendRecommendation.querySelector('.friend-event').textContent;
                
                showNotification(`Following ${friendName}'s event: ${eventName}`, 'info');
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.disabled = true;
                this.style.opacity = '0.7';
            });
        });
        
        // Quick action buttons
        quickActionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.querySelector('span').textContent;
                switch(action) {
                    case 'Discover Similar':
                        showNotification('Finding similar events...', 'info');
                        break;
                    case 'Save Search':
                        showNotification('Saving your search preferences...', 'info');
                        break;
                    case 'Get Alerts':
                        showNotification('Setting up recommendation alerts...', 'info');
                        break;
                    case 'Share Profile':
                        showNotification('Sharing your interests profile...', 'info');
                        break;
                }
            });
        });
        
        // Update profile button
        if (updateProfileBtn) {
            updateProfileBtn.addEventListener('click', function() {
                openPreferencesModal();
            });
        }
        
        // Close event modal
        if (closeEventModal) {
            closeEventModal.addEventListener('click', function() {
                closeModal(eventModal);
            });
        }
        
        // Close modal when clicking outside
        if (eventModal) {
            eventModal.addEventListener('click', function(e) {
                if (e.target === eventModal) {
                    closeModal(eventModal);
                }
            });
        }
        
        // Preferences modal functionality
        if (closePreferencesModal) {
            closePreferencesModal.addEventListener('click', function() {
                closeModal(preferencesModal);
            });
        }
        
        if (preferencesModal) {
            preferencesModal.addEventListener('click', function(e) {
                if (e.target === preferencesModal) {
                    closeModal(preferencesModal);
                }
            });
        }
        
        if (cancelPreferencesBtn) {
            cancelPreferencesBtn.addEventListener('click', function() {
                closeModal(preferencesModal);
            });
        }
        
        if (savePreferencesBtn) {
            savePreferencesBtn.addEventListener('click', function() {
                showNotification('Preferences saved successfully!', 'success');
                closeModal(preferencesModal);
                updateRecommendationCounts();
            });
        }
        
        // Price range slider
        if (priceRangeSlider) {
            priceRangeSlider.addEventListener('input', function() {
                if (currentPriceSpan) currentPriceSpan.textContent = `$${this.value}`;
            });
        }
    }
    
    // Attach dynamic listeners to freshly rendered events
    function attachDynamicEventListeners() {
        const cards = document.querySelectorAll('#eventsContainer .recommendation-card');
        cards.forEach(card => {
            const viewBtn = card.querySelector('.btn-view-details');
            const registerBtn = card.querySelector('.btn-book-now');
            if (!registerBtn) return;
            
            const eventId = registerBtn.getAttribute('data-id');
            
            if (viewBtn) {
                viewBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openEventModalById(eventId);
                });
            }
            
            registerBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                registerEvent(eventId);
            });
            
            card.addEventListener('click', function(e) {
                if (!e.target.closest('button')) {
                    openEventModalById(eventId);
                }
            });
        });
    }

    function openEventModalById(eventId) {
        const event = allEvents.find(e => e.eventId === eventId);
        if (!event) return;

        const modalTitle = document.getElementById('modalEventTitle');
        const modalContent = document.getElementById('modalEventContent');
        if (!modalTitle || !modalContent) return;
        
        modalTitle.textContent = event.title;
        
        const categoryData = categoryMap[event.category] || { class: 'other', icon: 'fas fa-calendar-alt', label: event.category || 'Event' };
        const priceDisplay = event.price ? (typeof event.price === 'number' || !isNaN(event.price) ? `₹${event.price}` : event.price) : 'Free';
        
        const index = allEvents.indexOf(event);
        const simulatedMatch = 75 + (index * 7) % 25;

        const infoHTML = `
            <p><i class="fas fa-calendar"></i> ${event.date || 'Date TBD'}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${event.location || 'Location TBD'}</p>
            <p><i class="fas fa-ticket-alt"></i> ${priceDisplay}</p>
        `;
        
        const reasonsHTML = `
            <h5>Why this is recommended for you:</h5>
            <ul>
                <li>Matches your interest in ${categoryData.label}</li>
                <li>Highly popular in your location (${event.location || 'nearby'})</li>
                <li>Trending among other users with similar profiles</li>
            </ul>
        `;
        
        modalContent.innerHTML = `
            <div class="event-modal-content">
                <div class="event-modal-header">
                    <div class="match-badge">
                        <span class="match-percent">${simulatedMatch}% Match</span>
                        <span class="match-label">${simulatedMatch >= 90 ? 'Excellent Match' : 'Good Match'}</span>
                    </div>
                </div>
                
                <div class="event-modal-description">
                    <h4>About This Event</h4>
                    <p>${event.description || 'No description provided.'}</p>
                </div>
                
                <div class="event-modal-info">
                    <h4>Event Information</h4>
                    ${infoHTML}
                </div>
                
                <div class="event-modal-match">
                    ${reasonsHTML}
                </div>
                
                <div class="event-modal-actions">
                    <button class="btn-book-now-modal" data-id="${event.eventId}">
                        <i class="fas fa-shopping-cart"></i> Register Now
                    </button>
                    <button class="btn-save-event">
                        <i class="fas fa-bookmark"></i> Save for Later
                    </button>
                    <button class="btn-share-event">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
            </div>
        `;
        
        eventModal.classList.add('active');
        eventModal.style.display = 'flex';
        
        // Add event listeners to modal buttons
        setTimeout(() => {
            const bookNowBtn = modalContent.querySelector('.btn-book-now-modal');
            const saveEventBtn = modalContent.querySelector('.btn-save-event');
            const shareBtn = modalContent.querySelector('.btn-share-event');
            
            if (bookNowBtn) {
                bookNowBtn.addEventListener('click', function() {
                    registerEvent(event.eventId);
                    closeModal(eventModal);
                });
            }
            
            if (saveEventBtn) {
                saveEventBtn.addEventListener('click', function() {
                    showNotification(`Saving ${event.title} to bookmarks...`, 'info');
                    this.innerHTML = '<i class="fas fa-check"></i> Saved';
                    this.disabled = true;
                    this.style.opacity = '0.7';
                });
            }
            
            if (shareBtn) {
                shareBtn.addEventListener('click', function() {
                    showNotification(`Sharing ${event.title}...`, 'info');
                });
            }
        }, 100);
    }
    
    // Initialize price range
    function initPriceRange() {
        if (priceRangeSlider && currentPriceSpan) {
            currentPriceSpan.textContent = `$${priceRangeSlider.value}`;
        }
    }
    
    // Filter recommendations based on selected filters
    function filterRecommendations() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const matchType = matchFilter ? matchFilter.value : 'all';
        const dateType = dateFilter ? dateFilter.value : 'all';
        
        let totalCount = 0;
        let highMatchCount = 0;
        let visibleCount = 0;
        
        recommendationCards.forEach(card => {
            const eventName = card.querySelector('h4').textContent.toLowerCase();
            const eventDescription = card.querySelector('.event-description').textContent.toLowerCase();
            const matchScore = parseInt(card.getAttribute('data-match'));
            const eventDate = card.getAttribute('data-date');
            
            const matchesSearch = searchTerm === '' || 
                eventName.includes(searchTerm) || 
                eventDescription.includes(searchTerm);
            
            let matchesMatch = true;
            switch(matchType) {
                case 'high':
                    matchesMatch = matchScore >= 90;
                    break;
                case 'medium':
                    matchesMatch = matchScore >= 70 && matchScore <= 89;
                    break;
                case 'friends':
                    matchesMatch = matchScore % 3 === 0; // Simulated
                    break;
                case 'trending':
                    matchesMatch = matchScore > 85;
                    break;
            }
            
            let matchesDate = true;
            if (dateType !== 'all') {
                matchesDate = eventDate === dateType;
            }
            
            if (matchesSearch && matchesMatch && matchesDate) {
                card.style.display = 'block';
                visibleCount++;
                totalCount++;
                if (matchScore >= 90) {
                    highMatchCount++;
                }
            } else {
                card.style.display = 'none';
            }
        });
        
        updateFilteredCounts(totalCount, highMatchCount);
        checkEmptyState();
    }
    
    // Update recommendation counts
    function updateRecommendationCounts() {
        const totalRecommendations = recommendationCards.length;
        if (totalRecommendations === 0) return;
        
        const highMatchCount = Array.from(recommendationCards).filter(card => 
            parseInt(card.getAttribute('data-match')) >= 90).length;
        
        let totalMatchScore = 0;
        recommendationCards.forEach(card => {
            totalMatchScore += parseInt(card.getAttribute('data-match'));
        });
        const avgMatchScore = Math.round(totalMatchScore / totalRecommendations) || 0;
        
        const friendsCount = Math.round(totalRecommendations * 1.5);
        const interestsCount = 8;
        
        const personalCountEl = document.getElementById('personalizedCount');
        const matchScoreEl = document.getElementById('matchScore');
        const friendsAttendingEl = document.getElementById('friendsAttending');
        const topInterestsEl = document.getElementById('topInterests');
        
        if (personalCountEl) personalCountEl.textContent = totalRecommendations;
        if (matchScoreEl) matchScoreEl.textContent = `${avgMatchScore}%`;
        if (friendsAttendingEl) friendsAttendingEl.textContent = friendsCount;
        if (topInterestsEl) topInterestsEl.textContent = interestsCount;
        
        const footerMatchesEl = document.getElementById('footerMatches');
        const footerMatchScoreEl = document.getElementById('footerMatchScore');
        const footerFriendsEl = document.getElementById('footerFriends');
        
        if (footerMatchesEl) footerMatchesEl.textContent = totalRecommendations;
        if (footerMatchScoreEl) footerMatchScoreEl.textContent = `${avgMatchScore}%`;
        if (footerFriendsEl) footerFriendsEl.textContent = friendsCount;
        
        const sidebarMatchesEl = document.querySelector('.sidebar-footer .stat-item:nth-child(1) .stat-value');
        const sidebarInterestsEl = document.querySelector('.sidebar-footer .stat-item:nth-child(2) .stat-value');
        
        if (sidebarMatchesEl) sidebarMatchesEl.textContent = totalRecommendations;
        if (sidebarInterestsEl) sidebarInterestsEl.textContent = interestsCount;
    }
    
    function updateFilteredCounts(total, highMatches) {
        const personalCountEl = document.getElementById('personalizedCount');
        const matchScoreEl = document.getElementById('matchScore');
        
        if (personalCountEl) personalCountEl.textContent = total;
        if (matchScoreEl) {
            const score = total > 0 ? Math.round((highMatches / total) * 100) : 0;
            matchScoreEl.textContent = `${score}%`;
        }
    }
    
    function checkEmptyState() {
        const visibleRecommendations = Array.from(recommendationCards)
            .filter(card => card.style.display !== 'none').length;
        
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            if (visibleRecommendations === 0) {
                emptyState.style.display = 'flex';
            } else {
                emptyState.style.display = 'none';
            }
        }
    }
    
    function showMoreOptions(eventName, recommendationCard) {
        const options = [
            'Not Interested',
            'Hide Similar Events',
            'Report Inappropriate',
            'View Event Website',
            'Contact Organizer',
            'Compare with Similar'
        ];
        showNotification(`More options for ${eventName}: ${options.join(', ')}`, 'info');
    }
    
    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    function showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(`${type}: ${message}`);
            
            // Native Toast container implementation
            let toastContainer = document.querySelector('.toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.className = 'toast-container';
                document.body.appendChild(toastContainer);
                
                const style = document.createElement('style');
                style.textContent = `
                    .toast-container {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        z-index: 9999;
                    }
                    .custom-toast {
                        background: var(--bg-primary, #ffffff);
                        border-left: 4px solid var(--primary-color, #06b6d4);
                        padding: 12px 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        font-family: 'Poppins', sans-serif;
                        font-size: 14px;
                        color: var(--text-primary, #1e293b);
                        animation: slideIn 0.3s ease;
                    }
                    .custom-toast.success { border-left-color: var(--success-color, #10b981); }
                    .custom-toast.error { border-left-color: var(--danger-color, #ef4444); }
                    .custom-toast.info { border-left-color: var(--info-color, #3b82f6); }
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            const toast = document.createElement('div');
            toast.className = `custom-toast ${type}`;
            toast.innerHTML = `<span>${message}</span>`;
            toastContainer.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    }
    
    // Initialize
    updateRecommendationCounts();
    checkEmptyState();
});

// Custom Dropdown Logic
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    
    dropdowns.forEach(dropdown => {
        const selected = dropdown.querySelector('.dropdown-selected');
        const selectedText = selected.querySelector('span');
        const options = dropdown.querySelectorAll('.dropdown-option');
        
        if (!selected) return;
        
        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close all other dropdowns
            document.querySelectorAll('.custom-dropdown.active').forEach(d => {
                if(d !== dropdown) d.classList.remove('active');
            });
            dropdown.classList.toggle('active');
        });
        
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                // Remove active class from all options
                options.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                option.classList.add('active');
                
                // Update selected text
                selectedText.textContent = option.textContent;
                
                // Close dropdown
                dropdown.classList.remove('active');
            });
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });
});
