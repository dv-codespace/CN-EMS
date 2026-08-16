const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === ""
    ? "http://localhost:3000"
    : "https://wzer1y5y48.execute-api.eu-north-1.amazonaws.com/dev";


// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    const token = localStorage.getItem("token");
    let profileImageBase64 = "";

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
    
        const profileName = document.getElementById("profileName");
        const profileName1 = document.getElementById("profileName1");
        if (profileName) profileName.textContent = payload.name || payload.email || "User";
        if (profileName1) profileName1.textContent = payload.name || payload.email || "User";

        const sidebarAvatar = document.querySelector(".sidebar .user-profile .avatar img");
        if (sidebarAvatar && payload.profileImage) {
            sidebarAvatar.src = payload.profileImage;
        }
        const mainProfileImage = document.getElementById("profileImage");
        if (mainProfileImage && payload.profileImage) {
            mainProfileImage.src = payload.profileImage;
        }
    }
    // Elements 
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const currentDate = document.getElementById('currentDate');
    const saveAllBtn = document.getElementById('saveAllBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Navigation elements
    const settingsNavBtns = document.querySelectorAll('.settings-nav-btn');
    const settingsSections = document.querySelectorAll('.settings-section');
    
    // Profile section
    const profileImage = document.getElementById('profileImage');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const removeAvatarBtn = document.getElementById('removeAvatarBtn');
    const profileForm = document.getElementById('profileForm');
    const cancelProfileBtn = document.getElementById('cancelProfileBtn');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const company = document.getElementById('company');
    const jobTitle = document.getElementById('jobTitle');
    const bio = document.getElementById('bio');
    const timezone = document.getElementById('timezone');
    const language = document.getElementById('language');

    // Account section
    const upgradePlanBtn = document.getElementById('upgradePlanBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const downgradePlanBtn = document.getElementById('downgradePlanBtn');
    const pauseAccountBtn = document.getElementById('pauseAccountBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    
    // Event settings
    const useTemplates = document.getElementById('useTemplates');
    const autoSave = document.getElementById('autoSave');
    const saveInterval = document.getElementById('saveInterval');
    const privacyRadios = document.querySelectorAll('input[name="privacy"]');
    const paymentCheckboxes = document.querySelectorAll('input[name="payments"]');
    const reminderTime = document.getElementById('reminderTime');
    const maxAttendees = document.getElementById('maxAttendees');
    const saveEventSettingsBtn = document.getElementById('saveEventSettingsBtn');
    
    // Notification settings
    const emailNotifications = document.getElementById('emailNotifications');
    const pushNotifications = document.getElementById('pushNotifications');
    const smsNotifications = document.getElementById('smsNotifications');
    const soundNotifications = document.getElementById('soundNotifications');
    const frequencyRadios = document.querySelectorAll('input[name="frequency"]');
    const quietHours = document.getElementById('quietHours');
    const quietStart = document.getElementById('quietStart');
    const quietEnd = document.getElementById('quietEnd');
    const saveNotificationSettingsBtn = document.getElementById('saveNotificationSettingsBtn');
    
    // Billing section
    const changePlanBtn = document.getElementById('changePlanBtn');
    const addPaymentBtn = document.getElementById('addPaymentBtn');
    const downloadInvoicesBtn = document.getElementById('downloadInvoicesBtn');
    const updateBillingInfoBtn = document.getElementById('updateBillingInfoBtn');
    
    // Security section
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const twoFactorBtn = document.getElementById('twoFactorBtn');
    const loginHistoryBtn = document.getElementById('loginHistoryBtn');
    const sessionsBtn = document.getElementById('sessionsBtn');
    const privacyBtn = document.getElementById('privacyBtn');
    const logoutAllBtn = document.getElementById('logoutAllBtn');
    const viewActivityBtn = document.getElementById('viewActivityBtn');
    
    // API & Integrations
    const generateApiKeyBtn = document.getElementById('generateApiKeyBtn');
    
    // Advanced settings
    const autoDeleteData = document.getElementById('autoDeleteData');
    const anonymizeData = document.getElementById('anonymizeData');
    const gdprCompliance = document.getElementById('gdprCompliance');
    const cacheDuration = document.getElementById('cacheDuration');
    const preloadData = document.getElementById('preloadData');
    const lazyLoading = document.getElementById('lazyLoading');
    const debugMode = document.getElementById('debugMode');
    const consoleLogs = document.getElementById('consoleLogs');
    const apiLogging = document.getElementById('apiLogging');
    const autoBackup = document.getElementById('autoBackup');
    const backupLocation = document.getElementById('backupLocation');
    const theme = document.getElementById('theme');
    const density = document.getElementById('density');
    const resetPreferencesBtn = document.getElementById('resetPreferencesBtn');
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    const resetAllBtn = document.getElementById('resetAllBtn');
    const saveAdvancedSettingsBtn = document.getElementById('saveAdvancedSettingsBtn');
    
    // Modals
    const changePasswordModal = document.getElementById('changePasswordModal');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const closePasswordModal = document.getElementById('closePasswordModal');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    const apiKeyModal = document.getElementById('apiKeyModal');
    const apiKeyForm = document.getElementById('apiKeyForm');
    const closeApiModal = document.getElementById('closeApiModal');
    const cancelApiBtn = document.getElementById('cancelApiBtn');
    const keyName = document.getElementById('keyName');
    
    const deleteAccountModal = document.getElementById('deleteAccountModal');
    const deleteAccountForm = document.getElementById('deleteAccountForm');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmEmail = document.getElementById('confirmEmail');
    const confirmPhrase = document.getElementById('confirmPhrase');
    
    // State variables
    let currentSection = 'profile';
    let settingsData = {};
    let isEditing = false;
    
    // Initialize settings page
    function initSettings() {
        // Update date display
        updateDateDisplay();
        
        // Load saved settings
        loadSettings();
        
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
    
    // Load saved settings from localStorage
    function loadSettings() {

        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));

            if (payload.name) {
                const nameParts = payload.name.split(" ");
                firstName.value = nameParts[0] || "";
                lastName.value = nameParts.slice(1).join(" ") || "";
            }
            email.value = payload.email || "";
            phone.value = payload.phone || "";
            company.value = payload.company || "";
            jobTitle.value = payload.jobTitle || "";
            bio.value = payload.bio || "";
            timezone.value = payload.timezone || "";
            language.value = payload.language || "";
            
            if (payload.profileImage) {
                profileImage.src = payload.profileImage;
            } else {
                profileImage.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=Alex`;
            }

        } else {
            // Set default settings
            settingsData = {
                profile: {
                    firstName: 'User',
                    lastName: '',
                    email: 'Enter your email',
                    phone: 'Enter your phone number',
                    company: 'Enter your company',
                    jobTitle: 'Event Organizer',
                    bio: 'Enter a short bio about yourself (Max 150 characters)',
                    timezone: 'America/New_York',
                    language: 'en',
                    avatar: 'Alex'
                },
                account: {
                    plan: 'professional',
                    status: 'active'
                },
                events: {
                    useTemplates: true,
                    templates: ['conference', 'workshop', 'festival'],
                    autoSave: true,
                    saveInterval: '5',
                    privacy: 'public',
                    payments: ['card', 'paypal'],
                    reminderTime: '7',
                    maxAttendees: '500'
                },
                notifications: {
                    email: true,
                    emailTypes: ['events', 'attendees', 'system'],
                    push: true,
                    pushTypes: ['urgent', 'reminders'],
                    sms: false,
                    smsTypes: [],
                    sound: true,
                    soundTypes: ['unread', 'high-priority'],
                    frequency: 'realtime',
                    quietHours: false,
                    quietStart: '22:00',
                    quietEnd: '07:00'
                },
                security: {
                    twoFactor: true,
                    lastPasswordChange: new Date(Date.now() - 2 * 24 * 3600000).toISOString()
                },
                advanced: {
                    autoDeleteData: false,
                    anonymizeData: false,
                    gdprCompliance: true,
                    cacheDuration: '24',
                    preloadData: true,
                    lazyLoading: true,
                    debugMode: false,
                    consoleLogs: false,
                    apiLogging: false,
                    autoBackup: true,
                    backupLocation: 'cloud',
                    theme: 'light',
                    density: 'compact'
                }
            };
            saveSettings();
        }
    }
    
    // Apply settings to UI
    function applySettingsToUI() {
        // Profile settings
        if (settingsData.profile) {
            firstName.value = settingsData.profile.firstName || '';
            lastName.value = settingsData.profile.lastName || '';
            email.value = settingsData.profile.email || '';
            phone.value = settingsData.profile.phone || '';
            company.value = settingsData.profile.company || '';
            jobTitle.value = settingsData.profile.jobTitle || '';
            bio.value = settingsData.profile.bio || '';
            timezone.value = settingsData.profile.timezone || 'America/New_York';
            language.value = settingsData.profile.language || 'en';
            
            // Update profile image
            if (settingsData.profile.avatar) {
                profileImage.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${settingsData.profile.avatar}`;
            }
        }
        
        // Event settings
        if (settingsData.events) {
            useTemplates.checked = settingsData.events.useTemplates || false;
            autoSave.checked = settingsData.events.autoSave || false;
            saveInterval.value = settingsData.events.saveInterval || '5';
            reminderTime.value = settingsData.events.reminderTime || '7';
            maxAttendees.value = settingsData.events.maxAttendees || '500';
            
            // Privacy radio
            const privacyValue = settingsData.events.privacy || 'public';
            document.querySelector(`input[name="privacy"][value="${privacyValue}"]`).checked = true;
            
            // Templates checkboxes
            document.querySelectorAll('input[name="templates"]').forEach(checkbox => {
                checkbox.checked = settingsData.events.templates?.includes(checkbox.value) || false;
            });
            
            // Payment checkboxes
            document.querySelectorAll('input[name="payments"]').forEach(checkbox => {
                checkbox.checked = settingsData.events.payments?.includes(checkbox.value) || false;
            });
        }
        
        // Notification settings
        if (settingsData.notifications) {
            emailNotifications.checked = settingsData.notifications.email || false;
            pushNotifications.checked = settingsData.notifications.push || false;
            smsNotifications.checked = settingsData.notifications.sms || false;
            soundNotifications.checked = settingsData.notifications.sound || false;
            quietHours.checked = settingsData.notifications.quietHours || false;
            quietStart.value = settingsData.notifications.quietStart || '22:00';
            quietEnd.value = settingsData.notifications.quietEnd || '07:00';
            
            // Email types
            document.querySelectorAll('input[name="emailTypes"]').forEach(checkbox => {
                checkbox.checked = settingsData.notifications.emailTypes?.includes(checkbox.value) || false;
            });
            
            // Push types
            document.querySelectorAll('input[name="pushTypes"]').forEach(checkbox => {
                checkbox.checked = settingsData.notifications.pushTypes?.includes(checkbox.value) || false;
            });
            
            // SMS types
            document.querySelectorAll('input[name="smsTypes"]').forEach(checkbox => {
                checkbox.checked = settingsData.notifications.smsTypes?.includes(checkbox.value) || false;
            });
            
            // Sound types
            document.querySelectorAll('input[name="soundTypes"]').forEach(checkbox => {
                checkbox.checked = settingsData.notifications.soundTypes?.includes(checkbox.value) || false;
            });
            
            // Frequency radio
            const frequencyValue = settingsData.notifications.frequency || 'realtime';
            document.querySelector(`input[name="frequency"][value="${frequencyValue}"]`).checked = true;
        }
        
        // Advanced settings
        if (settingsData.advanced) {
            autoDeleteData.checked = settingsData.advanced.autoDeleteData || false;
            anonymizeData.checked = settingsData.advanced.anonymizeData || false;
            gdprCompliance.checked = settingsData.advanced.gdprCompliance || false;
            cacheDuration.value = settingsData.advanced.cacheDuration || '24';
            preloadData.checked = settingsData.advanced.preloadData || false;
            lazyLoading.checked = settingsData.advanced.lazyLoading || false;
            debugMode.checked = settingsData.advanced.debugMode || false;
            consoleLogs.checked = settingsData.advanced.consoleLogs || false;
            apiLogging.checked = settingsData.advanced.apiLogging || false;
            autoBackup.checked = settingsData.advanced.autoBackup || false;
            backupLocation.value = settingsData.advanced.backupLocation || 'cloud';
            theme.value = settingsData.advanced.theme || 'light';
            density.value = settingsData.advanced.density || 'compact';
        }
    }
    
    // Save all settings to localStorage
    function saveSettings() {
        // Collect current settings from UI
        const currentSettings = {
            profile: {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                phone: phone.value,
                company: company.value,
                jobTitle: jobTitle.value,
                bio: bio.value,
                timezone: timezone.value,
                language: language.value,
                avatar: settingsData.profile?.avatar || 'Alex'
            },
            events: {
                useTemplates: useTemplates.checked,
                templates: Array.from(document.querySelectorAll('input[name="templates"]:checked')).map(cb => cb.value),
                autoSave: autoSave.checked,
                saveInterval: saveInterval.value,
                privacy: document.querySelector('input[name="privacy"]:checked')?.value || 'public',
                payments: Array.from(document.querySelectorAll('input[name="payments"]:checked')).map(cb => cb.value),
                reminderTime: reminderTime.value,
                maxAttendees: maxAttendees.value
            },
            notifications: {
                email: emailNotifications.checked,
                emailTypes: Array.from(document.querySelectorAll('input[name="emailTypes"]:checked')).map(cb => cb.value),
                push: pushNotifications.checked,
                pushTypes: Array.from(document.querySelectorAll('input[name="pushTypes"]:checked')).map(cb => cb.value),
                sms: smsNotifications.checked,
                smsTypes: Array.from(document.querySelectorAll('input[name="smsTypes"]:checked')).map(cb => cb.value),
                sound: soundNotifications.checked,
                soundTypes: Array.from(document.querySelectorAll('input[name="soundTypes"]:checked')).map(cb => cb.value),
                frequency: document.querySelector('input[name="frequency"]:checked')?.value || 'realtime',
                quietHours: quietHours.checked,
                quietStart: quietStart.value,
                quietEnd: quietEnd.value
            },
            advanced: {
                autoDeleteData: autoDeleteData.checked,
                anonymizeData: anonymizeData.checked,
                gdprCompliance: gdprCompliance.checked,
                cacheDuration: cacheDuration.value,
                preloadData: preloadData.checked,
                lazyLoading: lazyLoading.checked,
                debugMode: debugMode.checked,
                consoleLogs: consoleLogs.checked,
                apiLogging: apiLogging.checked,
                autoBackup: autoBackup.checked,
                backupLocation: backupLocation.value,
                theme: theme.value,
                density: density.value
            }
        };
        
        // Merge with existing settings
        settingsData = { ...settingsData, ...currentSettings };
        
        // Save to localStorage
        localStorage.setItem('eventoSettings', JSON.stringify(settingsData));
        
        showToast('Settings saved successfully!');
    }
    
    // Reset settings to defaults
    function resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default values? This cannot be undone.')) {
            localStorage.removeItem('eventoSettings');
            settingsData = {};
            loadSettings();
            showToast('Settings reset to defaults');
        }
    }
    
    // Change settings section
    function changeSection(sectionId) {
        // Update navigation buttons
        settingsNavBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === sectionId);
        });
        
        // Update sections
        settingsSections.forEach(section => {
            section.classList.toggle('active', section.id === `${sectionId}Section`);
        });
        
        // Update current section
        currentSection = sectionId;
        
        // Scroll to top of section
        document.querySelector('.settings-content').scrollTop = 0;
    }
    
    // Change avatar
    function changeAvatar(e) {
        if (e) e.preventDefault();
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = function(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (file.size > 200 * 1024) {
                showToast("Image must be smaller than 200KB");
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                profileImageBase64 = e.target.result;
                profileImage.src = profileImageBase64;
                showToast("Photo loaded. Click Save All Changes to upload to database.");
            };
            reader.readAsDataURL(file);
        };
        fileInput.click();
    }
    
    // Remove avatar
    function removeAvatar(e) {
        if (e) e.preventDefault();
        if (confirm('Remove your profile picture and use default avatar?')) {
            profileImageBase64 = "";
            profileImage.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=Alex`;
            showToast('Avatar removed locally. Click Save All Changes to update in database.');
        }
    }
    
    // Check password strength
    function checkPasswordStrength(password) {
        let strength = 0;
        let text = 'Very Weak';
        let color = '#f87171';
        
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        switch(strength) {
            case 1:
                text = 'Very Weak';
                color = '#f87171';
                break;
            case 2:
                text = 'Weak';
                color = '#fb923c';
                break;
            case 3:
                text = 'Fair';
                color = '#fbbf24';
                break;
            case 4:
                text = 'Good';
                color = '#4ade80';
                break;
            case 5:
                text = 'Strong';
                color = '#16a34a';
                break;
        }
        
        strengthBar.style.width = `${strength * 20}%`;
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }
    
    // Show toast notification
    function showToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-color);
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
        
        // Save all button
        saveAllBtn.addEventListener('click', function() {
            saveSettings();
        });
        
        // Reset button
        resetBtn.addEventListener('click', function() {
            resetSettings();
        });
        
        // Navigation buttons
        settingsNavBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                changeSection(this.dataset.section);
            });
        });
        
        // Profile section
        changeAvatarBtn.addEventListener('click', changeAvatar);
        removeAvatarBtn.addEventListener('click', removeAvatar);
        
       profileForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/auth/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                name: firstName.value.trim() + " " + lastName.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                company: company.value.trim(),
                jobTitle: jobTitle.value.trim(),
                bio: bio.value.trim(),
                timezone: timezone.value,
                language: language.value,
                profileImage: profileImageBase64 || (token ? JSON.parse(atob(token.split('.')[1])).profileImage : "") || ""
            })
        });

        const data = await response.json();

        console.log("Response:", data);  // 🔥 DEBUG

        if (!response.ok) {
            throw new Error(data.message || "Update failed");
        }

        // 🔥 Replace token
        localStorage.setItem("token", data.token);

        showToast("Profile updated successfully!");

    } catch (error) {
        console.error(error);
        showToast("Profile update failed!");
    }
});


        
        cancelProfileBtn.addEventListener('click', function() {
            applySettingsToUI();
            showToast('Changes cancelled');
        });
        
        // Account section buttons
        upgradePlanBtn.addEventListener('click', function() {
            showToast('Plan upgrade feature coming soon!');
        });
        
        exportDataBtn.addEventListener('click', function() {
            showToast('Data export started. You will receive an email when it\'s ready.');
        });
        
        downgradePlanBtn.addEventListener('click', function() {
            showToast('Plan change feature coming soon!');
        });
        
        pauseAccountBtn.addEventListener('click', function() {
            if (confirm('Pause your account? You won\'t be billed, but you won\'t be able to access your events.')) {
                showToast('Account paused successfully');
            }
        });
        
        deleteAccountBtn.addEventListener('click', function() {
            deleteAccountModal.classList.add('active');
            confirmEmail.value = email.value;
        });
        
        // Event settings
        saveEventSettingsBtn.addEventListener('click', function() {
            saveSettings();
        });
        
        // Notification settings
        saveNotificationSettingsBtn.addEventListener('click', function() {
            saveSettings();
        });
        
        // Billing section buttons
        changePlanBtn.addEventListener('click', function() {
            showToast('Plan change feature coming soon!');
        });
        
        addPaymentBtn.addEventListener('click', function() {
            showToast('Add payment method feature coming soon!');
        });
        
        downloadInvoicesBtn.addEventListener('click', function() {
            showToast('Downloading all invoices...');
        });
        
        updateBillingInfoBtn.addEventListener('click', function() {
            showToast('Update billing info feature coming soon!');
        });
        
        // Security section buttons
        changePasswordBtn.addEventListener('click', function() {
            changePasswordModal.classList.add('active');
            currentPassword.focus();
        });
        
        twoFactorBtn.addEventListener('click', function() {
            const enabled = settingsData.security?.twoFactor || false;
            const action = enabled ? 'disable' : 'enable';
            if (confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} two-factor authentication?`)) {
                settingsData.security = settingsData.security || {};
                settingsData.security.twoFactor = !enabled;
                saveSettings();
                showToast(`Two-factor authentication ${enabled ? 'disabled' : 'enabled'}!`);
            }
        });
        
        loginHistoryBtn.addEventListener('click', function() {
            showToast('Login history feature coming soon!');
        });
        
        sessionsBtn.addEventListener('click', function() {
            showToast('Active sessions feature coming soon!');
        });
        
        privacyBtn.addEventListener('click', function() {
            showToast('Privacy settings feature coming soon!');
        });
        
        logoutAllBtn.addEventListener('click', function() {
            if (confirm('Log out from all devices? You will need to log in again on this device.')) {
                showToast('Logged out from all devices successfully!');
            }
        });
        
        viewActivityBtn.addEventListener('click', function() {
            showToast('Viewing all activity...');
        });
        
        // API & Integrations
        generateApiKeyBtn.addEventListener('click', function() {
            apiKeyModal.classList.add('active');
            keyName.focus();
        });
        
        // Advanced settings
        saveAdvancedSettingsBtn.addEventListener('click', function() {
            saveSettings();
        });
        
        resetPreferencesBtn.addEventListener('click', function() {
            if (confirm('Reset all preferences to default?')) {
                const currentTheme = theme.value;
                const currentDensity = density.value;
                
                // Reset only preferences
                autoDeleteData.checked = false;
                anonymizeData.checked = false;
                gdprCompliance.checked = true;
                cacheDuration.value = '24';
                preloadData.checked = true;
                lazyLoading.checked = true;
                debugMode.checked = false;
                consoleLogs.checked = false;
                apiLogging.checked = false;
                autoBackup.checked = true;
                backupLocation.value = 'cloud';
                
                // Keep theme and density
                theme.value = currentTheme;
                density.value = currentDensity;
                
                showToast('Preferences reset to defaults');
            }
        });
        
        clearCacheBtn.addEventListener('click', function() {
            if (confirm('Clear all cached data?')) {
                showToast('Cache cleared successfully!');
            }
        });
        
        resetAllBtn.addEventListener('click', function() {
            if (confirm('Reset ALL settings to factory defaults? This cannot be undone.')) {
                resetSettings();
            }
        });
        
        // Copy API key buttons
        document.addEventListener('click', function(e) {
            if (e.target.closest('.copy-key-btn')) {
                const btn = e.target.closest('.copy-key-btn');
                const keyCode = btn.parentElement.querySelector('code');
                
                // Copy to clipboard
                navigator.clipboard.writeText(keyCode.textContent)
                    .then(() => {
                        const originalText = btn.innerHTML;
                        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        setTimeout(() => {
                            btn.innerHTML = originalText;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                    });
            }
        });
        
        // Change password modal
        closePasswordModal.addEventListener('click', function() {
            changePasswordModal.classList.remove('active');
            changePasswordForm.reset();
            strengthBar.style.width = '0%';
            strengthText.textContent = 'Password strength';
        });
        
        cancelPasswordBtn.addEventListener('click', function() {
            changePasswordModal.classList.remove('active');
            changePasswordForm.reset();
            strengthBar.style.width = '0%';
            strengthText.textContent = 'Password strength';
        });
        
        newPassword.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
        
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (newPassword.value !== confirmPassword.value) {
                alert('New passwords do not match!');
                return;
            }
            
            if (newPassword.value.length < 8) {
                alert('Password must be at least 8 characters long!');
                return;
            }
            
            // In a real app, you would validate current password and update it
            console.log('Password changed successfully');
            
            // Update last password change date
            settingsData.security = settingsData.security || {};
            settingsData.security.lastPasswordChange = new Date().toISOString();
            saveSettings();
            
            changePasswordModal.classList.remove('active');
            changePasswordForm.reset();
            strengthBar.style.width = '0%';
            strengthText.textContent = 'Password strength';
            
            showToast('Password changed successfully!');
        });
        
        // API key modal
        closeApiModal.addEventListener('click', function() {
            apiKeyModal.classList.remove('active');
            apiKeyForm.reset();
        });
        
        cancelApiBtn.addEventListener('click', function() {
            apiKeyModal.classList.remove('active');
            apiKeyForm.reset();
        });
        
        apiKeyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Generate a mock API key
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let apiKey = 'sk_live_';
            for (let i = 0; i < 24; i++) {
                apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            
            // Show the generated key
            alert(`API Key Generated!\n\n${apiKey}\n\nMake sure to copy it now. You won't be able to see it again!`);
            
            apiKeyModal.classList.remove('active');
            apiKeyForm.reset();
            
            showToast('API key generated successfully!');
        });
        
        // Delete account modal
        closeDeleteModal.addEventListener('click', function() {
            deleteAccountModal.classList.remove('active');
            deleteAccountForm.reset();
        });
        
        cancelDeleteBtn.addEventListener('click', function() {
            deleteAccountModal.classList.remove('active');
            deleteAccountForm.reset();
        });
        
        deleteAccountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (confirmEmail.value !== email.value) {
                alert('Email does not match your account email!');
                return;
            }
            
            if (confirmPhrase.value !== 'DELETE MY ACCOUNT') {
                alert('Confirmation phrase is incorrect!');
                return;
            }
            
            if (confirm('This is your last chance to cancel. Are you ABSOLUTELY sure you want to delete your account?')) {
                // In a real app, you would delete the account here
                console.log('Account deletion requested');
                
                deleteAccountModal.classList.remove('active');
                deleteAccountForm.reset();
                
                showToast('Account deletion scheduled. You will receive a confirmation email.');
                
                // Redirect to home page after 3 seconds
                setTimeout(() => {
                    window.location.href = '../../index.html';
                }, 3000);
            }
        });
        
        // Modal close on outside click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
                if (e.target.id === 'changePasswordModal') {
                    changePasswordForm.reset();
                    strengthBar.style.width = '0%';
                    strengthText.textContent = 'Password strength';
                } else if (e.target.id === 'apiKeyModal') {
                    apiKeyForm.reset();
                } else if (e.target.id === 'deleteAccountModal') {
                    deleteAccountForm.reset();
                }
            }
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                changePasswordModal.classList.remove('active');
                apiKeyModal.classList.remove('active');
                deleteAccountModal.classList.remove('active');
                
                changePasswordForm.reset();
                apiKeyForm.reset();
                deleteAccountForm.reset();
                
                strengthBar.style.width = '0%';
                strengthText.textContent = 'Password strength';
            }
        });
        
        // Integration toggle switches
        document.addEventListener('change', function(e) {
            if (e.target.type === 'checkbox' && e.target.closest('.integration-card')) {
                const integrationName = e.target.closest('.integration-card').querySelector('h5').textContent;
                const action = e.target.checked ? 'connected' : 'disconnected';
                showToast(`${integrationName} ${action} successfully!`);
            }
        });
        
        // Payment method actions
        document.addEventListener('click', function(e) {
            if (e.target.closest('.payment-action-btn')) {
                const btn = e.target.closest('.payment-action-btn');
                const method = btn.closest('.payment-method').querySelector('h5').textContent;
                
                if (btn.classList.contains('danger-btn')) {
                    if (confirm(`Remove ${method} from your payment methods?`)) {
                        showToast(`${method} removed successfully!`);
                    }
                } else {
                    showToast(`Edit ${method} - feature coming soon!`);
                }
            }
        });
        
        // Download invoice buttons
        document.addEventListener('click', function(e) {
            if (e.target.closest('.invoice-btn')) {
                const btn = e.target.closest('.invoice-btn');
                const date = btn.closest('.table-row').querySelector('.table-cell').textContent;
                showToast(`Downloading invoice for ${date}...`);
            }
        });
    }
    
    // Initialize the page
    initSettings();
});