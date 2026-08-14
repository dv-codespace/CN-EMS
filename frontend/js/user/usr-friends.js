// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements specific to friends page
    const friendFilter = document.getElementById('friendFilter');
    const addFriendsBtn = document.getElementById('addFriendsBtn');
    const createGroupBtn = document.getElementById('createGroupBtn');
    const inviteFriendsBtn = document.getElementById('inviteFriendsBtn');
    const syncContactsBtn = document.getElementById('syncContactsBtn');
    const messageButtons = document.querySelectorAll('.btn-message');
    const inviteButtons = document.querySelectorAll('.btn-invite');
    const acceptButtons = document.querySelectorAll('.btn-accept');
    const declineButtons = document.querySelectorAll('.btn-decline');
    const viewGroupButtons = document.querySelectorAll('.btn-view-group');
    const addFriendButtons = document.querySelectorAll('.btn-add-friend');
    const friendItems = document.querySelectorAll('.friend-item');
    const requestItems = document.querySelectorAll('.request-item');
    const groupItems = document.querySelectorAll('.group-item');
    const suggestionItems = document.querySelectorAll('.suggestion-item');
    
    // Initialize
    initFriendsPage();
    
    function initFriendsPage() {
        setupEventListeners();
        updateDateDisplay();
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
        const currentDateElement = document.getElementById('currentDate');
        if (currentDateElement) {
            currentDateElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Friend filter
        if (friendFilter) {
            friendFilter.addEventListener('change', function() {
                const filterValue = this.value;
                showNotification(`Filtering friends by: ${filterValue}`);
                
                // Add filtering logic here
                filterFriends(filterValue);
            });
        }
        
        // Add friends button
        if (addFriendsBtn) {
            addFriendsBtn.addEventListener('click', function() {
                showNotification('Opening friend search...');
            });
        }
        
        // Create group button
        if (createGroupBtn) {
            createGroupBtn.addEventListener('click', function() {
                showNotification('Opening group creation...');
            });
        }
        
        // Invite friends button
        if (inviteFriendsBtn) {
            inviteFriendsBtn.addEventListener('click', function() {
                showNotification('Opening event invitation...');
            });
        }
        
        // Sync contacts button
        if (syncContactsBtn) {
            syncContactsBtn.addEventListener('click', function() {
                showNotification('Syncing contacts...');
            });
        }
        
        // Message buttons
        messageButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const friendItem = this.closest('.friend-item, .request-item, .suggestion-item');
                const friendName = friendItem ? friendItem.querySelector('h4').textContent : 'Friend';
                showNotification(`Opening chat with ${friendName}`);
            });
        });
        
        // Invite buttons
        inviteButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const friendItem = this.closest('.friend-item');
                const friendName = friendItem ? friendItem.querySelector('h4').textContent : 'Friend';
                showNotification(`Inviting ${friendName} to event...`);
            });
        });
        
        // Accept friend request buttons
        acceptButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const requestItem = this.closest('.request-item');
                const friendName = requestItem ? requestItem.querySelector('h4').textContent : 'User';
                
                // Update UI
                requestItem.style.opacity = '0.5';
                this.textContent = 'Accepted!';
                this.disabled = true;
                
                // Update the button next to it
                const declineBtn = requestItem.querySelector('.btn-decline');
                if (declineBtn) {
                    declineBtn.textContent = 'Remove';
                }
                
                showNotification(`Friend request from ${friendName} accepted`);
                
                // Update notification count
                updateNotificationCount(-1);
                
                // Update friend count
                updateFriendCount(1);
            });
        });
        
        // Decline friend request buttons
        declineButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const requestItem = this.closest('.request-item');
                const friendName = requestItem ? requestItem.querySelector('h4').textContent : 'User';
                
                if (this.textContent === 'Remove') {
                    // Remove the request item
                    requestItem.style.opacity = '0';
                    setTimeout(() => {
                        if (requestItem.parentNode) {
                            requestItem.remove();
                        }
                    }, 300);
                    showNotification(`${friendName} removed from requests`);
                } else {
                    // Decline the request
                    requestItem.style.opacity = '0.5';
                    this.textContent = 'Declined!';
                    this.disabled = true;
                    
                    // Update the accept button
                    const acceptBtn = requestItem.querySelector('.btn-accept');
                    if (acceptBtn) {
                        acceptBtn.textContent = 'Undo';
                        acceptBtn.style.background = 'var(--warning-color)';
                        acceptBtn.addEventListener('click', function() {
                            requestItem.style.opacity = '1';
                            btn.textContent = 'Decline';
                            btn.disabled = false;
                            this.textContent = 'Accept';
                            this.disabled = false;
                            this.style.background = 'var(--primary-color)';
                        });
                    }
                    
                    showNotification(`Friend request from ${friendName} declined`);
                    updateNotificationCount(-1);
                }
            });
        });
        
        // View group buttons
        viewGroupButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const groupItem = this.closest('.group-item');
                const groupName = groupItem ? groupItem.querySelector('h4').textContent : 'Group';
                showNotification(`Opening group: ${groupName}`);
            });
        });
        
        // Add friend buttons
        addFriendButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const suggestionItem = this.closest('.suggestion-item');
                const friendName = suggestionItem ? suggestionItem.querySelector('h4').textContent : 'User';
                
                // Update UI
                this.textContent = 'Request Sent!';
                this.disabled = true;
                this.style.opacity = '0.7';
                
                showNotification(`Friend request sent to ${friendName}`);
            });
        });
        
        // Friend item clicks
        friendItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.closest('button')) {
                    const friendName = this.querySelector('h4').textContent;
                    showNotification(`Viewing profile: ${friendName}`);
                }
            });
        });
        
        // Request item clicks
        requestItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.closest('button')) {
                    const friendName = this.querySelector('h4').textContent;
                    showNotification(`Viewing profile: ${friendName}`);
                }
            });
        });
        
        // Group item clicks
        groupItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.closest('button')) {
                    const groupName = this.querySelector('h4').textContent;
                    showNotification(`Viewing group: ${groupName}`);
                }
            });
        });
        
        // Suggestion item clicks
        suggestionItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.closest('button')) {
                    const personName = this.querySelector('h4').textContent;
                    showNotification(`Viewing profile: ${personName}`);
                }
            });
        });
        
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                if (searchTerm.length > 2) {
                    filterFriendsBySearch(searchTerm);
                } else if (searchTerm.length === 0) {
                    resetFriendFilter();
                }
            });
        }
    }
    
    // Filter friends by search term
    function filterFriendsBySearch(searchTerm) {
        friendItems.forEach(item => {
            const friendName = item.querySelector('h4').textContent.toLowerCase();
            if (friendName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        suggestionItems.forEach(item => {
            const personName = item.querySelector('h4').textContent.toLowerCase();
            if (personName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Reset friend filter
    function resetFriendFilter() {
        friendItems.forEach(item => {
            item.style.display = 'flex';
        });
        
        suggestionItems.forEach(item => {
            item.style.display = 'flex';
        });
    }
    
    // Filter friends by category
    function filterFriends(filter) {
        // This would be connected to actual data filtering logic
        switch(filter) {
            case 'attending':
                showNotification('Showing friends attending events');
                break;
            case 'recent':
                showNotification('Showing recently active friends');
                break;
            case 'nearby':
                showNotification('Showing friends nearby');
                break;
            default:
                showNotification('Showing all friends');
        }
    }
    
    // Update notification count
    function updateNotificationCount(change) {
        const notificationCount = document.querySelector('.notification-count');
        if (notificationCount) {
            let currentCount = parseInt(notificationCount.textContent);
            currentCount = Math.max(0, currentCount + change);
            notificationCount.textContent = currentCount;
        }
    }
    
    // Update friend count
    function updateFriendCount(change) {
        const friendStat = document.querySelector('.stat-content h3');
        if (friendStat) {
            let currentCount = parseInt(friendStat.textContent);
            currentCount = Math.max(0, currentCount + change);
            friendStat.textContent = currentCount;
        }
    }
    
    // Show notification (reuse from dashboard)
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
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
});