// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Add custom profile input styles to document head for rich aesthetics
    if (!document.getElementById('custom-profile-input-styles')) {
        const style = document.createElement('style');
        style.id = 'custom-profile-input-styles';
        style.textContent = `
            .profile-info input.profile-edit-input {
                padding: 10px 15px;
                border: 1px solid var(--border-color, #e2e8f0);
                border-radius: var(--radius-md, 8px);
                background: var(--bg-primary, #ffffff);
                color: var(--text-primary, #1e293b);
                font-size: 14px;
                font-family: 'Poppins', sans-serif;
                width: 100%;
                max-width: 320px;
                transition: var(--transition, all 0.3s ease);
                box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
            }
            .profile-info input.profile-edit-input:focus {
                outline: none;
                border-color: var(--primary-color, #06b6d4);
                box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
            }
        `;
        document.head.appendChild(style);
    }

    // Elements
    const settingsNavBtns = document.querySelectorAll('.settings-nav-btn');
    const settingsSections = document.querySelectorAll('.settings-section');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const resetSettingsBtn = document.getElementById('resetSettings');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeConfirmationModal = document.getElementById('closeConfirmationModal');
    const confirmSaveBtn = document.getElementById('confirmSave');
    const editProfileBtn = document.querySelector('.btn-edit');
    const avatarUploadBtn = document.querySelector('.avatar-upload');
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    const connectButtons = document.querySelectorAll('.btn-connect');
    const disconnectButtons = document.querySelectorAll('.btn-disconnect');
    const radioOptions = document.querySelectorAll('input[type="radio"]');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const selects = document.querySelectorAll('select');
    const timeInputs = document.querySelectorAll('input[type="time"]');
    const searchInput = document.getElementById('searchInput');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    
    // User settings and state
    let currentUser = null;
    let isEditingProfile = false;
    let profileImageBase64 = "";
    let settingsState = {
        account: {},
        notifications: {},
        privacy: {},
        preferences: {},
        billing: {},
        security: {},
        help: {},
        about: {}
    };
    
    // Initialize
    initSettingsPage();
    
    function initSettingsPage() {
        setupEventListeners();
        loadSettings();
        fetchUserProfile();
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

    // Fetch user profile from DB
    async function fetchUserProfile() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                showNotification("Please login again", "error");
                return;
            }

            const response = await fetch("http://localhost:3000/auth/profile", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch profile details");
            }

            const data = await response.json();
            currentUser = data.user;
            updateProfileUI();

        } catch (error) {
            console.error("Error fetching user profile:", error);
            showNotification("Failed to load profile details", "error");
        }
    }

    // Update frontend labels with fetched user details
    function updateProfileUI() {
        if (!currentUser) return;

        // Sidebar name
        const sidebarName = document.querySelector(".sidebar .user-profile .user-info h3");
        if (sidebarName) sidebarName.textContent = currentUser.name || "User";

        // Sidebar image
        const sidebarAvatar = document.querySelector(".sidebar .user-profile .avatar img");
        if (sidebarAvatar && currentUser.profileImage) {
            sidebarAvatar.src = currentUser.profileImage;
        }

        // Settings page large avatar
        const largeAvatar = document.querySelector(".avatar-large img");
        if (largeAvatar && currentUser.profileImage) {
            largeAvatar.src = currentUser.profileImage;
        }

        // Account status Member since
        const memberSince = document.querySelector(".settings-stats .stat-item:nth-child(1) .stat-value");
        if (memberSince && currentUser.createdAt) {
            const joinedDate = new Date(currentUser.createdAt);
            memberSince.textContent = joinedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }

        // Standard fields (when not in edit mode)
        if (!isEditingProfile) {
            const profileFullName = document.getElementById("profileFullName");
            const profileEmail = document.getElementById("profileEmail");
            const profilePhone = document.getElementById("profilePhone");
            const profileLocation = document.getElementById("profileLocation");

            if (profileFullName) profileFullName.textContent = currentUser.name || "";
            if (profileEmail) profileEmail.textContent = currentUser.email || "";
            if (profilePhone) profilePhone.textContent = currentUser.phone || "";
            if (profileLocation) profileLocation.textContent = currentUser.company || "";
        }
    }

    // Toggle between static fields and editable form inputs
    function toggleProfileEditMode() {
        const container = document.getElementById("profileInfoContainer");
        if (!container || !currentUser) return;

        isEditingProfile = !isEditingProfile;

        if (isEditingProfile) {
            editProfileBtn.textContent = "Cancel";
            editProfileBtn.style.background = "var(--border-color)";
            editProfileBtn.style.color = "var(--text-primary)";
            editProfileBtn.style.borderColor = "var(--border-color)";

            // Render form inputs
            container.innerHTML = `
                <div class="info-row">
                    <span class="label">Full Name</span>
                    <input type="text" id="editName" class="profile-edit-input" value="${currentUser.name || ''}" placeholder="Full Name">
                </div>
                <div class="info-row">
                    <span class="label">Email</span>
                    <input type="email" id="editEmail" class="profile-edit-input" value="${currentUser.email || ''}" placeholder="Email Address">
                </div>
                <div class="info-row">
                    <span class="label">Phone</span>
                    <input type="text" id="editPhone" class="profile-edit-input" value="${currentUser.phone || ''}" placeholder="Phone Number">
                </div>
                <div class="info-row">
                    <span class="label">Location</span>
                    <input type="text" id="editLocation" class="profile-edit-input" value="${currentUser.company || ''}" placeholder="Location">
                </div>
            `;
        } else {
            editProfileBtn.textContent = "Edit";
            editProfileBtn.style.background = "";
            editProfileBtn.style.color = "";
            editProfileBtn.style.borderColor = "";

            // Restore preview rows
            container.innerHTML = `
                <div class="info-row">
                    <span class="label">Full Name</span>
                    <span class="value" id="profileFullName">${currentUser.name || ''}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email</span>
                    <span class="value" id="profileEmail">${currentUser.email || ''}</span>
                </div>
                <div class="info-row">
                    <span class="label">Phone</span>
                    <span class="value" id="profilePhone">${currentUser.phone || ''}</span>
                </div>
                <div class="info-row">
                    <span class="label">Location</span>
                    <span class="value" id="profileLocation">${currentUser.company || ''}</span>
                </div>
            `;
        }
    }

    // Update profile in backend DB
    async function updateProfile() {
        const editName = document.getElementById("editName");
        const editEmail = document.getElementById("editEmail");
        const editPhone = document.getElementById("editPhone");
        const editLocation = document.getElementById("editLocation");

        if (!editName || !editEmail) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                showNotification("Please login again", "error");
                return;
            }

            const response = await fetch("http://localhost:3000/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: editName.value.trim(),
                    email: editEmail.value.trim(),
                    phone: editPhone.value.trim(),
                    company: editLocation.value.trim(), // Mapping company to Location
                    profileImage: profileImageBase64 || currentUser.profileImage || ""
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            // Save new token containing updated user attributes
            localStorage.setItem("token", data.token);
            currentUser = data.user;
            
            // Turn off edit mode and update views
            isEditingProfile = false;
            
            // Restore edit button state
            editProfileBtn.textContent = "Edit";
            editProfileBtn.style.background = "";
            editProfileBtn.style.color = "";
            editProfileBtn.style.borderColor = "";

            updateProfileUI();

            showNotification("Profile updated successfully!", "success");

        } catch (error) {
            console.error("Error updating profile:", error);
            showNotification(error.message, "error");
        }
    }

    // Delete user account from database
    async function deleteAccount() {
        if (!confirm("Are you absolutely sure you want to delete your account? This will permanently erase your user profile and all registered data.")) {
            return;
        }
        if (!confirm("This is your FINAL warning. Once deleted, you will lose access immediately. Proceed?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch("http://localhost:3000/auth/profile", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete account");
            }

            showNotification("Your account has been deleted successfully.", "success");

            setTimeout(() => {
                localStorage.clear();
                window.location.href = "../../auth.html";
            }, 2000);

        } catch (error) {
            console.error("Error deleting account:", error);
            showNotification(error.message, "error");
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Settings navigation
        settingsNavBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');
                switchSection(sectionId);
            });
        });
        
        // Save settings
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', function() {
                if (isEditingProfile) {
                    updateProfile();
                } else {
                    saveSettings();
                }
            });
        }
        
        // Reset settings
        if (resetSettingsBtn) {
            resetSettingsBtn.addEventListener('click', function() {
                resetSettings();
            });
        }

        // Delete Account button
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', function(e) {
                e.preventDefault();
                deleteAccount();
            });
        }
        
        // Modal close
        if (closeConfirmationModal) {
            closeConfirmationModal.addEventListener('click', function() {
                closeModal(confirmationModal);
            });
        }
        
        // Confirm save
        if (confirmSaveBtn) {
            confirmSaveBtn.addEventListener('click', function() {
                closeModal(confirmationModal);
                showNotification('Settings have been updated successfully!', 'success');
            });
        }
        
        // Edit profile toggle
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleProfileEditMode();
            });
        }
        
        // Avatar upload
        if (avatarUploadBtn) {
            avatarUploadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*";
                fileInput.onchange = function(event) {
                    const file = event.target.files[0];
                    if (!file) return;

                    if (file.size > 200 * 1024) {
                        showNotification("Image must be smaller than 200KB", "warning");
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = function(e) {
                        profileImageBase64 = e.target.result;
                        const avatarImg = document.querySelector(".avatar-large img");
                        if (avatarImg) {
                            avatarImg.src = profileImageBase64;
                        }
                        showNotification("Photo loaded. Click Edit -> Save Changes to upload to database.", "success");
                    };
                    reader.readAsDataURL(file);
                };
                fileInput.click();
            });
        }
        
        // Toggle switches
        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('change', function() {
                const settingName = this.parentElement.parentElement.querySelector('h4').textContent;
                showNotification(`${settingName}: ${this.checked ? 'Enabled' : 'Disabled'}`);
            });
        });
        
        // Connect/Disconnect buttons
        connectButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const accountInfo = this.closest('.connected-account').querySelector('h4').textContent;
                this.textContent = 'Connecting...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = 'Connected';
                    this.style.background = 'var(--success-color)';
                    showNotification(`${accountInfo} connected successfully!`, 'success');
                }, 1000);
            });
        });
        
        disconnectButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const accountInfo = this.closest('.connected-account').querySelector('h4').textContent;
                if (confirm(`Are you sure you want to disconnect ${accountInfo}?`)) {
                    this.textContent = 'Disconnecting...';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        this.textContent = 'Connect';
                        this.style.background = 'var(--primary-color)';
                        this.disabled = false;
                        showNotification(`${accountInfo} disconnected successfully!`, 'success');
                    }, 1000);
                }
            });
        });
        
        // Radio options
        radioOptions.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    const groupName = this.getAttribute('name');
                    const label = this.parentElement.querySelector('.radio-label').textContent;
                    showNotification(`${groupName}: ${label} selected`);
                }
            });
        });
        
        // Checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const label = this.parentElement.querySelector('span').textContent;
                showNotification(`${label}: ${this.checked ? 'Enabled' : 'Disabled'}`);
            });
        });
        
        // Selects
        selects.forEach(select => {
            select.addEventListener('change', function() {
                const label = this.previousElementSibling ? 
                    this.previousElementSibling.querySelector('h4').textContent : 
                    'Setting';
                showNotification(`${label}: ${this.options[this.selectedIndex].text} selected`);
            });
        });
        
        // Time inputs
        timeInputs.forEach(input => {
            input.addEventListener('change', function() {
                const label = this.parentElement.querySelector('label').textContent;
                showNotification(`${label}: ${this.value} set`);
            });
        });
        
        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                if (searchTerm.length > 2) {
                    searchSettings(searchTerm);
                } else if (searchTerm.length === 0) {
                    resetSearch();
                }
            });
        }
        
        // Close modal when clicking outside
        if (confirmationModal) {
            confirmationModal.addEventListener('click', function(e) {
                if (e.target === confirmationModal) {
                    closeModal(confirmationModal);
                }
            });
        }
        
        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && confirmationModal && confirmationModal.classList.contains('active')) {
                closeModal(confirmationModal);
            }
        });
    }
    
    // Switch settings section
    function switchSection(sectionId) {
        // Update active navigation button
        settingsNavBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === sectionId) {
                btn.classList.add('active');
            }
        });
        
        // Show selected section
        settingsSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `${sectionId}-section`) {
                section.classList.add('active');
            }
        });
        
        // Save current section to state
        settingsState.currentSection = sectionId;
        showNotification(`Viewing ${sectionId.replace('-', ' ')} settings`);
    }
    
    // Save settings (fallback for non-profile fields)
    function saveSettings() {
        collectSettings();
        
        // Show confirmation modal
        if (confirmationModal) {
            confirmationModal.classList.add('active');
            confirmationModal.style.display = 'flex';
        }
        
        console.log('Settings saved:', settingsState);
    }
    
    // Collect settings from form
    function collectSettings() {
        toggleSwitches.forEach(toggle => {
            const sectionEl = toggle.closest('.settings-section');
            if (!sectionEl) return;
            const section = sectionEl.id.replace('-section', '');
            const headingEl = toggle.parentElement.parentElement.querySelector('h4');
            if (!headingEl) return;
            const name = headingEl.textContent;
            if (!settingsState[section]) settingsState[section] = {};
            settingsState[section][name] = toggle.checked;
        });
        
        radioOptions.forEach(radio => {
            if (radio.checked) {
                const sectionEl = radio.closest('.settings-section');
                if (!sectionEl) return;
                const section = sectionEl.id.replace('-section', '');
                const group = radio.getAttribute('name');
                const labelEl = radio.parentElement.querySelector('.radio-label');
                if (!labelEl) return;
                const value = labelEl.textContent;
                if (!settingsState[section]) settingsState[section] = {};
                settingsState[section][group] = value;
            }
        });
        
        checkboxes.forEach(checkbox => {
            const sectionEl = checkbox.closest('.settings-section');
            if (!sectionEl) return;
            const section = sectionEl.id.replace('-section', '');
            const spanEl = checkbox.parentElement.querySelector('span');
            if (!spanEl) return;
            const name = spanEl.textContent;
            if (!settingsState[section]) settingsState[section] = {};
            settingsState[section][name] = checkbox.checked;
        });
        
        selects.forEach(select => {
            const sectionEl = select.closest('.settings-section');
            if (!sectionEl) return;
            const section = sectionEl.id.replace('-section', '');
            const labelEl = select.previousElementSibling ? select.previousElementSibling.querySelector('h4') : null;
            const name = labelEl ? labelEl.textContent : 'select-' + Math.random();
            if (!settingsState[section]) settingsState[section] = {};
            settingsState[section][name] = select.value;
        });
    }
    
    // Load settings from local storage
    function loadSettings() {
        const savedSettings = localStorage.getItem('evento-settings');
        if (savedSettings) {
            settingsState = JSON.parse(savedSettings);
            applySettings();
        }
    }
    
    // Apply settings to form
    function applySettings() {
        toggleSwitches.forEach(toggle => {
            const sectionEl = toggle.closest('.settings-section');
            if (!sectionEl) return;
            const section = sectionEl.id.replace('-section', '');
            const headingEl = toggle.parentElement.parentElement.querySelector('h4');
            if (!headingEl) return;
            const name = headingEl.textContent;
            if (settingsState[section] && settingsState[section][name] !== undefined) {
                toggle.checked = settingsState[section][name];
            }
        });
        
        radioOptions.forEach(radio => {
            const sectionEl = radio.closest('.settings-section');
            if (!sectionEl) return;
            const section = sectionEl.id.replace('-section', '');
            const group = radio.getAttribute('name');
            const labelEl = radio.parentElement.querySelector('.radio-label');
            if (!labelEl) return;
            const value = labelEl.textContent;
            if (settingsState[section] && settingsState[section][group] === value) {
                radio.checked = true;
            }
        });
        
        checkboxes.forEach(checkbox => {
            const sectionEl = checkbox.closest('.settings-section');
            if (!sectionEl) return;
            const section = sectionEl.id.replace('-section', '');
            const spanEl = checkbox.parentElement.querySelector('span');
            if (!spanEl) return;
            const name = spanEl.textContent;
            if (settingsState[section] && settingsState[section][name] !== undefined) {
                checkbox.checked = settingsState[section][name];
            }
        });
        
        selects.forEach(select => {
            const sectionEl = select.closest('.settings-section');
            if (!sectionEl) return;
            const section = sectionEl.id.replace('-section', '');
            const labelEl = select.previousElementSibling ? select.previousElementSibling.querySelector('h4') : null;
            const name = labelEl ? labelEl.textContent : '';
            if (settingsState[section] && settingsState[section][name]) {
                select.value = settingsState[section][name];
            }
        });
    }
    
    // Reset settings to default values
    function resetSettings() {
        if (confirm('This will reset all settings to their default values. Continue?')) {
            toggleSwitches.forEach(toggle => {
                toggle.checked = toggle.defaultChecked;
            });
            
            radioOptions.forEach(radio => {
                radio.checked = radio.defaultChecked;
            });
            
            checkboxes.forEach(checkbox => {
                checkbox.checked = checkbox.defaultChecked;
            });
            
            selects.forEach(select => {
                select.value = select.options[0].value;
            });
            
            localStorage.removeItem('evento-settings');
            settingsState = {
                account: {},
                notifications: {},
                privacy: {},
                preferences: {},
                billing: {},
                security: {},
                help: {},
                about: {}
            };
            
            showNotification('All settings have been reset to default values', 'success');
        }
    }
    
    // Search settings
    function searchSettings(searchTerm) {
        let found = false;
        
        settingsSections.forEach(section => {
            const header = section.querySelector('h2');
            if (header && header.textContent.toLowerCase().includes(searchTerm)) {
                const sectionId = section.id.replace('-section', '');
                switchSection(sectionId);
                found = true;
                return;
            }
        });
        
        if (!found) {
            const allHeadings = document.querySelectorAll('h3, h4');
            for (let heading of allHeadings) {
                if (heading.textContent.toLowerCase().includes(searchTerm)) {
                    const section = heading.closest('.settings-section');
                    if (section) {
                        const sectionId = section.id.replace('-section', '');
                        switchSection(sectionId);
                        
                        heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        heading.style.background = 'var(--primary-light)';
                        setTimeout(() => {
                            heading.style.background = '';
                        }, 2000);
                        
                        found = true;
                        break;
                    }
                }
            }
        }
        
        if (!found) {
            showNotification(`No settings found for "${searchTerm}"`, 'warning');
        }
    }
    
    // Reset search highlights
    function resetSearch() {
        const highlighted = document.querySelectorAll('[style*="background"]');
        highlighted.forEach(el => {
            if (el.style.background.includes('primary-light')) {
                el.style.background = '';
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
    
    // Show notification helper
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification-toast');
        if (existingNotification) {
            existingNotification.remove();
        }
        
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
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
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
