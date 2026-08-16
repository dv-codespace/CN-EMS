// admin-settings.js - Evento Admin Settings Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // ===== GLOBAL VARIABLES =====
    let settings = {};
    let unsavedChanges = false;
    let currentSettingsTab = 'general';
    let confirmActionCallback = null;
    let adminProfileImageBase64 = "";

    async function fetchAdminProfile() {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        try {
            const response = await fetch("http://localhost:3000/admin/auth/profile", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const admin = data.admin;
                
                const nameInput = document.getElementById("adminNameInput");
                const phoneInput = document.getElementById("adminPhoneInput");
                const bioInput = document.getElementById("adminBioInput");
                const previewImg = document.getElementById("adminAvatarPreview");
                
                if (nameInput) nameInput.value = admin.name || "";
                if (phoneInput) phoneInput.value = admin.phone || "";
                if (bioInput) bioInput.value = admin.bio || "";
                
                if (admin.profileImage) {
                    adminProfileImageBase64 = admin.profileImage;
                    if (previewImg) previewImg.src = admin.profileImage;
                }
            }
        } catch (e) {
            console.error("Error fetching admin profile:", e);
        }
    }

    function setupAdminPhotoUpload() {
        const changeBtn = document.getElementById("changeAdminPhotoBtn");
        const removeBtn = document.getElementById("removeAdminPhotoBtn");
        const previewImg = document.getElementById("adminAvatarPreview");

        if (changeBtn) {
            changeBtn.addEventListener("click", (e) => {
                e.preventDefault();
                const fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*";
                fileInput.onchange = function(event) {
                    const file = event.target.files[0];
                    if (!file) return;

                    if (file.size > 200 * 1024) {
                        showToast("Image must be smaller than 200KB", "error");
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = function(e) {
                        adminProfileImageBase64 = e.target.result;
                        if (previewImg) previewImg.src = adminProfileImageBase64;
                        showToast("Admin photo loaded locally. Click Save All to upload to database.", "success");
                    };
                    reader.readAsDataURL(file);
                };
                fileInput.click();
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener("click", (e) => {
                e.preventDefault();
                if (confirm("Remove your profile picture and use default avatar?")) {
                    adminProfileImageBase64 = "";
                    if (previewImg) previewImg.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin";
                    showToast("Admin photo removed locally. Click Save All to update in database.", "success");
                }
            });
        }
    }

    // ===== INITIALIZATION =====
    initializeSettingsPage();
    setupAdminPhotoUpload();

    // ===== MOBILE MENU TOGGLE =====
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('sidebar-active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                sidebar.classList.remove('active');
                mainContent.classList.remove('sidebar-active');
            }
        }
    });

    // ===== SETTINGS TAB NAVIGATION =====
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsSections = document.querySelectorAll('.settings-section');

    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            currentSettingsTab = tabId;
            
            // Update active tab
            settingsTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            settingsSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === tabId + 'Section') {
                    section.classList.add('active');
                }
            });
            
            // Scroll to top of settings
            document.querySelector('.settings-content').scrollTop = 0;
        });
    });

    // ===== SETTINGS MANAGEMENT =====
    // Save All button
    const saveAllBtn = document.getElementById('saveAllBtn');
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', saveAllSettings);
    }

    // Refresh Settings button
    const refreshBtn = document.getElementById('refreshSettingsBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            showToast('Refreshing settings...', 'info');
            setTimeout(() => {
                loadSettings();
                showToast('Settings refreshed successfully!', 'success');
                unsavedChanges = false;
            }, 1000);
        });
    }

    // Reset Defaults button
    const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');
    if (resetDefaultsBtn) {
        resetDefaultsBtn.addEventListener('click', function() {
            showConfirmationModal(
                'Reset All Settings',
                'Are you sure you want to reset all settings to their default values? This action cannot be undone.',
                resetToDefaults
            );
        });
    }

    // ===== GENERAL SETTINGS =====
    // Password length range
    const passwordLengthRange = document.getElementById('minPasswordLength');
    const passwordLengthValue = document.getElementById('passwordLengthValue');
    
    if (passwordLengthRange && passwordLengthValue) {
        passwordLengthRange.addEventListener('input', function() {
            passwordLengthValue.textContent = this.value + ' characters';
            unsavedChanges = true;
            updateSetting('minPasswordLength', this.value);
        });
    }

    // Color picker
    const primaryColor = document.getElementById('primaryColor');
    const colorValue = document.querySelector('.color-value');
    
    if (primaryColor && colorValue) {
        primaryColor.addEventListener('input', function() {
            colorValue.textContent = this.value;
            unsavedChanges = true;
            updateSetting('primaryColor', this.value);
        });
    }

    // File uploads
    const logoUploadBtn = document.getElementById('uploadLogoBtn');
    const logoUpload = document.getElementById('logoUpload');
    const logoPreview = document.getElementById('logoPreview');
    const removeLogoBtn = document.getElementById('removeLogoBtn');
    
    if (logoUploadBtn && logoUpload) {
        logoUploadBtn.addEventListener('click', () => logoUpload.click());
        logoUpload.addEventListener('change', handleFileUpload);
    }
    
    if (removeLogoBtn) {
        removeLogoBtn.addEventListener('click', function() {
            showConfirmationModal(
                'Remove Logo',
                'Are you sure you want to remove the system logo?',
                function() {
                    logoPreview.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evento';
                    showToast('Logo removed successfully!', 'success');
                    unsavedChanges = true;
                    updateSetting('logoUrl', '');
                }
            );
        });
    }

    // Favicon upload
    const faviconUploadBtn = document.getElementById('uploadFaviconBtn');
    const faviconUpload = document.getElementById('faviconUpload');
    
    if (faviconUploadBtn && faviconUpload) {
        faviconUploadBtn.addEventListener('click', () => faviconUpload.click());
        faviconUpload.addEventListener('change', handleFileUpload);
    }

    // ===== SECURITY SETTINGS =====
    // Password expiry toggle
    const passwordExpiryCheckbox = document.getElementById('passwordExpiry');
    const passwordExpiryOptions = document.getElementById('passwordExpiryOptions');
    
    if (passwordExpiryCheckbox && passwordExpiryOptions) {
        passwordExpiryCheckbox.addEventListener('change', function() {
            passwordExpiryOptions.style.display = this.checked ? 'block' : 'none';
            unsavedChanges = true;
            updateSetting('passwordExpiry', this.checked);
        });
    }

    // Geo blocking toggle
    const geoBlockingCheckbox = document.getElementById('geoBlocking');
    const geoBlockingOptions = document.getElementById('geoBlockingOptions');
    
    if (geoBlockingCheckbox && geoBlockingOptions) {
        geoBlockingCheckbox.addEventListener('change', function() {
            geoBlockingOptions.style.display = this.checked ? 'block' : 'none';
            unsavedChanges = true;
            updateSetting('geoBlocking', this.checked);
        });
    }

    // Security scan button
    const securityScanBtn = document.getElementById('securityScanBtn');
    if (securityScanBtn) {
        securityScanBtn.addEventListener('click', function() {
            showToast('Starting security scan...', 'info');
            
            // Simulate security scan
            setTimeout(() => {
                const vulnerabilities = Math.floor(Math.random() * 3);
                if (vulnerabilities === 0) {
                    showToast('Security scan completed: No vulnerabilities found!', 'success');
                } else {
                    showToast(`Security scan completed: Found ${vulnerabilities} potential issue(s)`, 'warning');
                }
            }, 2000);
        });
    }

    // ===== PAYMENT SETTINGS =====
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Copy to clipboard buttons
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-clipboard-target');
            const target = document.querySelector(targetId);
            
            if (target) {
                navigator.clipboard.writeText(target.value)
                    .then(() => {
                        const originalText = this.innerHTML;
                        this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        showToast('Copied to clipboard!', 'success');
                        
                        setTimeout(() => {
                            this.innerHTML = originalText;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                        showToast('Failed to copy to clipboard', 'error');
                    });
            }
        });
    });

    // Test Stripe connection
    const testStripeBtn = document.getElementById('testStripeConnectionBtn');
    if (testStripeBtn) {
        testStripeBtn.addEventListener('click', function() {
            showToast('Testing Stripe connection...', 'info');
            
            // Simulate API call
            setTimeout(() => {
                showToast('Stripe connection successful!', 'success');
            }, 1500);
        });
    }

    // Open Stripe dashboard
    const stripeDashboardBtn = document.getElementById('stripeDashboardBtn');
    if (stripeDashboardBtn) {
        stripeDashboardBtn.addEventListener('click', function() {
            window.open('https://dashboard.stripe.com', '_blank');
        });
    }

    // Connect PayPal
    const connectPayPalBtn = document.getElementById('connectPayPalBtn');
    if (connectPayPalBtn) {
        connectPayPalBtn.addEventListener('click', function() {
            showToast('Connecting to PayPal...', 'info');
            
            // Simulate connection process
            setTimeout(() => {
                const statusElement = document.getElementById('paypalStatus');
                statusElement.textContent = 'Connected';
                statusElement.className = 'integration-status active';
                showToast('PayPal connected successfully!', 'success');
                unsavedChanges = true;
                updateSetting('paypalConnected', true);
            }, 2000);
        });
    }

    // ===== EMAIL & NOTIFICATIONS =====
    // Test SendGrid button
    const testSendGridBtn = document.getElementById('testSendGridBtn');
    if (testSendGridBtn) {
        testSendGridBtn.addEventListener('click', function() {
            document.getElementById('testEmailModal').style.display = 'flex';
        });
    }

    // ===== API & INTEGRATIONS =====
    // Generate API Key
    const generateApiKeyBtn = document.getElementById('generateApiKeyBtn');
    if (generateApiKeyBtn) {
        generateApiKeyBtn.addEventListener('click', generateApiKey);
    }

    // Add Integration button
    const addIntegrationBtn = document.getElementById('addIntegrationBtn');
    if (addIntegrationBtn) {
        addIntegrationBtn.addEventListener('click', function() {
            showToast('Integration management feature coming soon!', 'info');
        });
    }

    // Manage Webhooks button
    const manageWebhooksBtn = document.getElementById('manageWebhooksBtn');
    if (manageWebhooksBtn) {
        manageWebhooksBtn.addEventListener('click', function() {
            showToast('Webhook management feature coming soon!', 'info');
        });
    }

    // ===== PERFORMANCE SETTINGS =====
    // Flush cache button
    const flushCacheBtn = document.getElementById('flushCacheBtn');
    if (flushCacheBtn) {
        flushCacheBtn.addEventListener('click', function() {
            showConfirmationModal(
                'Flush Cache',
                'Are you sure you want to flush all cached data? This may temporarily affect performance.',
                function() {
                    showToast('Flushing cache...', 'info');
                    setTimeout(() => {
                        showToast('Cache flushed successfully!', 'success');
                    }, 1000);
                }
            );
        });
    }

    // Test DB connection
    const testDbBtn = document.getElementById('testDbConnectionBtn');
    if (testDbBtn) {
        testDbBtn.addEventListener('click', function() {
            showToast('Testing database connection...', 'info');
            
            setTimeout(() => {
                showToast('Database connection successful!', 'success');
            }, 1500);
        });
    }

    // Image quality range
    const imageQualityRange = document.getElementById('imageQuality');
    const imageQualityValue = document.getElementById('imageQualityValue');
    
    if (imageQualityRange && imageQualityValue) {
        imageQualityRange.addEventListener('input', function() {
            imageQualityValue.textContent = this.value + '%';
            unsavedChanges = true;
            updateSetting('imageQuality', this.value);
        });
    }

    // View logs button
    const viewLogsBtn = document.getElementById('viewLogsBtn');
    if (viewLogsBtn) {
        viewLogsBtn.addEventListener('click', function() {
            window.location.href = 'auditlogs.html';
        });
    }

    // ===== BACKUP & MAINTENANCE =====
    // Backup now button
    const backupNowBtn = document.getElementById('backupNowBtn');
    if (backupNowBtn) {
        backupNowBtn.addEventListener('click', function() {
            showConfirmationModal(
                'Create Backup',
                'Are you sure you want to create a system backup now?',
                function() {
                    showToast('Creating backup... This may take a few minutes.', 'info');
                    
                    // Simulate backup process
                    let progress = 0;
                    const interval = setInterval(() => {
                        progress += 10;
                        if (progress <= 100) {
                            showToast(`Backup in progress: ${progress}%`, 'info');
                        } else {
                            clearInterval(interval);
                            showToast('Backup created successfully!', 'success');
                        }
                    }, 500);
                }
            );
        });
    }

    // Test S3 connection
    const testS3Btn = document.getElementById('testS3ConnectionBtn');
    if (testS3Btn) {
        testS3Btn.addEventListener('click', function() {
            showToast('Testing S3 connection...', 'info');
            
            setTimeout(() => {
                showToast('S3 connection successful!', 'success');
            }, 1500);
        });
    }

    // Check for updates
    const checkUpdatesBtn = document.getElementById('checkUpdatesBtn');
    if (checkUpdatesBtn) {
        checkUpdatesBtn.addEventListener('click', function() {
            showToast('Checking for updates...', 'info');
            
            setTimeout(() => {
                showToast('System is up to date!', 'success');
            }, 2000);
        });
    }

    // View changelog
    const viewChangelogBtn = document.getElementById('viewChangelogBtn');
    if (viewChangelogBtn) {
        viewChangelogBtn.addEventListener('click', function() {
            showToast('Changelog feature coming soon!', 'info');
        });
    }

    // ===== ADVANCED SETTINGS =====
    // System commands
    const executeCommandBtn = document.getElementById('executeCommandBtn');
    const systemCommand = document.getElementById('systemCommand');
    
    if (executeCommandBtn && systemCommand) {
        executeCommandBtn.addEventListener('click', function() {
            const command = systemCommand.value.trim();
            if (command) {
                executeSystemCommand(command);
                systemCommand.value = '';
            }
        });
        
        systemCommand.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const command = systemCommand.value.trim();
                if (command) {
                    executeSystemCommand(command);
                    systemCommand.value = '';
                }
            }
        });
    }

    // Quick command buttons
    document.querySelectorAll('.command-btn').forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            executeSystemCommand(command);
        });
    });

    // Clear output button
    const clearOutputBtn = document.querySelector('.clear-output-btn');
    if (clearOutputBtn) {
        clearOutputBtn.addEventListener('click', function() {
            const outputContent = document.querySelector('.output-content');
            outputContent.innerHTML = '<div class="output-line">Output cleared.</div>';
        });
    }

    // Custom code preview
    const previewCustomCodeBtn = document.getElementById('previewCustomCodeBtn');
    if (previewCustomCodeBtn) {
        previewCustomCodeBtn.addEventListener('click', function() {
            showToast('Custom code preview feature coming soon!', 'info');
        });
    }

    // Reset custom code
    const resetCustomCodeBtn = document.getElementById('resetCustomCodeBtn');
    if (resetCustomCodeBtn) {
        resetCustomCodeBtn.addEventListener('click', function() {
            showConfirmationModal(
                'Reset Custom Code',
                'Are you sure you want to reset all custom CSS/JS to default?',
                function() {
                    document.getElementById('customCSS').value = '';
                    document.getElementById('customJS').value = '';
                    showToast('Custom code reset successfully!', 'success');
                    unsavedChanges = true;
                    updateSetting('customCSS', '');
                    updateSetting('customJS', '');
                }
            );
        });
    }

    // Danger zone actions
    const confirmDangerInput = document.getElementById('confirmDanger');
    const dangerButtons = document.querySelectorAll('.danger-btn');
    
    if (confirmDangerInput) {
        confirmDangerInput.addEventListener('input', function() {
            const isEnabled = this.value === 'CONFIRM';
            dangerButtons.forEach(btn => {
                btn.disabled = !isEnabled;
            });
        });
    }

    // Purge data button
    const purgeDataBtn = document.getElementById('purgeDataBtn');
    if (purgeDataBtn) {
        purgeDataBtn.addEventListener('click', function() {
            if (confirmDangerInput.value === 'CONFIRM') {
                showConfirmationModal(
                    'Purge All Data',
                    'WARNING: This will permanently delete ALL users, events, and transactions. This action is irreversible!',
                    function() {
                        showToast('Purging all data...', 'info');
                        setTimeout(() => {
                            showToast('All data has been purged. The system will now restart.', 'success');
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                        }, 3000);
                    }
                );
            } else {
                showToast('Please type "CONFIRM" to enable this action', 'warning');
            }
        });
    }

    // Factory reset button
    const factoryResetBtn = document.getElementById('factoryResetBtn');
    if (factoryResetBtn) {
        factoryResetBtn.addEventListener('click', function() {
            if (confirmDangerInput.value === 'CONFIRM') {
                showConfirmationModal(
                    'Factory Reset',
                    'This will reset ALL settings to factory defaults. All custom configurations will be lost!',
                    resetToDefaults
                );
            } else {
                showToast('Please type "CONFIRM" to enable this action', 'warning');
            }
        });
    }

    // Uninstall button
    const uninstallBtn = document.getElementById('uninstallBtn');
    if (uninstallBtn) {
        uninstallBtn.addEventListener('click', function() {
            if (confirmDangerInput.value === 'CONFIRM') {
                showConfirmationModal(
                    'Uninstall System',
                    'CRITICAL: This will completely remove the Evento platform. All data will be permanently deleted!',
                    function() {
                        showToast('Uninstalling system... This may take a few moments.', 'info');
                        setTimeout(() => {
                            showToast('System uninstalled successfully. Redirecting...', 'success');
                            setTimeout(() => {
                                window.location.href = '../../index.html';
                            }, 2000);
                        }, 3000);
                    }
                );
            } else {
                showToast('Please type "CONFIRM" to enable this action', 'warning');
            }
        });
    }

    // ===== MODAL HANDLERS =====
    // Confirmation modal
    const confirmationModal = document.getElementById('confirmationModal');
    const closeConfirmationModal = document.getElementById('closeConfirmationModal');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const confirmModalBtn = document.getElementById('confirmModalBtn');
    
    if (closeConfirmationModal) {
        closeConfirmationModal.addEventListener('click', () => {
            confirmationModal.style.display = 'none';
        });
    }
    
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', () => {
            confirmationModal.style.display = 'none';
        });
    }
    
    if (confirmModalBtn) {
        confirmModalBtn.addEventListener('click', function() {
            if (confirmActionCallback) {
                confirmActionCallback();
            }
            confirmationModal.style.display = 'none';
        });
    }

    // Test email modal
    const testEmailModal = document.getElementById('testEmailModal');
    const closeTestEmailModal = document.getElementById('closeTestEmailModal');
    const cancelTestEmailBtn = document.getElementById('cancelTestEmailBtn');
    const testEmailForm = document.getElementById('testEmailForm');
    
    if (closeTestEmailModal) {
        closeTestEmailModal.addEventListener('click', () => {
            testEmailModal.style.display = 'none';
        });
    }
    
    if (cancelTestEmailBtn) {
        cancelTestEmailBtn.addEventListener('click', () => {
            testEmailModal.style.display = 'none';
        });
    }
    
    if (testEmailForm) {
        testEmailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const recipient = document.getElementById('testEmailRecipient').value;
            const subject = document.getElementById('testEmailSubject').value;
            
            showToast(`Sending test email to ${recipient}...`, 'info');
            
            // Simulate email sending
            setTimeout(() => {
                showToast(`Test email "${subject}" sent successfully!`, 'success');
                testEmailModal.style.display = 'none';
            }, 2000);
        });
    }

    // API key modal
    const apiKeyModal = document.getElementById('apiKeyModal');
    const closeApiKeyModal = document.getElementById('closeApiKeyModal');
    const closeApiKeyBtn = document.getElementById('closeApiKeyBtn');
    const copyApiKeyBtn = document.getElementById('copyApiKeyBtn');
    
    if (closeApiKeyModal) {
        closeApiKeyModal.addEventListener('click', () => {
            apiKeyModal.style.display = 'none';
        });
    }
    
    if (closeApiKeyBtn) {
        closeApiKeyBtn.addEventListener('click', () => {
            apiKeyModal.style.display = 'none';
        });
    }
    
    if (copyApiKeyBtn) {
        copyApiKeyBtn.addEventListener('click', function() {
            const apiKey = document.getElementById('generatedApiKey').textContent;
            navigator.clipboard.writeText(apiKey)
                .then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                });
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
        if (event.target === testEmailModal) {
            testEmailModal.style.display = 'none';
        }
        if (event.target === apiKeyModal) {
            apiKeyModal.style.display = 'none';
        }
    });

    // ===== FORM HANDLERS =====
    // Track changes in all form elements
    document.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('change', function() {
            unsavedChanges = true;
            updateSetting(this.id, this.type === 'checkbox' ? this.checked : this.value);
        });
        
        element.addEventListener('input', function() {
            if (this.tagName === 'INPUT' && this.type !== 'checkbox' && this.type !== 'radio') {
                unsavedChanges = true;
                updateSetting(this.id, this.value);
            }
        });
    });

    // ===== SEARCH FUNCTIONALITY =====
    const settingsSearch = document.getElementById('settingsSearch');
    if (settingsSearch) {
        settingsSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm.length < 2) {
                // Show all settings
                document.querySelectorAll('.settings-section').forEach(section => {
                    section.style.display = section.classList.contains('active') ? 'block' : 'none';
                });
                document.querySelectorAll('.settings-card').forEach(card => {
                    card.style.display = 'block';
                });
                return;
            }
            
            // Search through settings
            let foundInActiveSection = false;
            
            document.querySelectorAll('.settings-section').forEach(section => {
                let foundInSection = false;
                
                section.querySelectorAll('.settings-card').forEach(card => {
                    const cardText = card.textContent.toLowerCase();
                    const cardTitle = card.querySelector('h4')?.textContent.toLowerCase() || '';
                    
                    if (cardText.includes(searchTerm) || cardTitle.includes(searchTerm)) {
                        card.style.display = 'block';
                        foundInSection = true;
                        if (section.classList.contains('active')) {
                            foundInActiveSection = true;
                        }
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Show section if it has matches
                section.style.display = foundInSection ? 'block' : 'none';
            });
            
            // If nothing found in active section, show message
            if (!foundInActiveSection && searchTerm) {
                showToast(`No matches found for "${searchTerm}" in current tab`, 'info');
            }
        });
    }

    // ===== WINDOW EVENT HANDLERS =====
    // Warn before leaving with unsaved changes
    window.addEventListener('beforeunload', function(e) {
        if (unsavedChanges) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        }
    });

    // ===== INITIALIZATION FUNCTIONS =====
    function initializeSettingsPage() {
        // Set current date
        updateCurrentDate();
        
        // Load saved settings
        loadSettings();
        
        // Initialize UI elements
        initializeUI();
        
        // Fetch Admin profile from backend
        fetchAdminProfile();
    }

    function updateCurrentDate() {
        const currentDateElement = document.getElementById('currentDate');
        if (currentDateElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            currentDateElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    function loadSettings() {
        try {
            const savedSettings = localStorage.getItem('evento_settings');
            if (savedSettings) {
                settings = JSON.parse(savedSettings);
                applySettings();
            } else {
                loadDefaultSettings();
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            loadDefaultSettings();
        }
    }

    function loadDefaultSettings() {
        // Default settings
        settings = {
            systemName: 'Evento Platform',
            systemUrl: 'https://evento.example.com',
            systemTimezone: 'America/New_York',
            defaultLanguage: 'en',
            dateFormat: 'YYYY-MM-DD',
            timeFormat: '12h',
            weekStartDay: '1',
            themeMode: 'light',
            primaryColor: '#4f46e5',
            allowRegistration: true,
            emailVerification: true,
            adminApproval: true,
            defaultUserRole: 'user',
            minPasswordLength: '8',
            sessionTimeout: '60',
            maxLoginAttempts: '5',
            lockoutDuration: '15',
            requireStrongPasswords: true,
            passwordExpiry: true,
            passwordExpiryDays: '90',
            enable2FA: true,
            enable2FAUsers: false,
            backupCodeCount: '10',
            enableCSP: true,
            enableHSTS: true,
            enableXSSProtection: true,
            enableFrameOptions: true,
            enableReferrerPolicy: true,
            paymentMode: 'live',
            defaultCurrency: 'USD',
            autoCurrencyConversion: true,
            exchangeRateProvider: 'openexchangerates',
            serviceFeePercentage: '10',
            minimumFee: '1.00',
            maximumFee: '50.00',
            organizerPayoutDelay: '7',
            enableAutomaticPayouts: true,
            showFeesSeparately: true,
            emailService: 'sendgrid',
            fromEmail: 'noreply@evento.example.com',
            fromName: 'Evento Platform',
            adminEmail: 'admin@evento.example.com',
            supportEmail: 'support@evento.example.com',
            notifyNewUser: true,
            notifyNewEvent: true,
            notifyNewTransaction: true,
            notifyTicketPurchase: true,
            notifyEventReminder: false,
            notifySystemAlerts: true,
            notificationFrequency: 'daily',
            digestTime: '09:00',
            enableSMS: false,
            smsProvider: 'twilio',
            enablePushNotifications: false,
            pushProvider: 'firebase',
            notificationSounds: 'disabled',
            enableAPI: true,
            apiVersion: 'v1',
            apiRateLimit: '60',
            enableWebhooks: true,
            webhookTimeout: '10',
            webhookRetries: '3',
            facebookPage: '',
            twitterHandle: '',
            instagramProfile: '',
            linkedinCompany: '',
            enableSocialSharing: true,
            enableCaching: true,
            cacheDriver: 'redis',
            cacheTTL: '600',
            redisHost: '127.0.0.1',
            redisPort: '6379',
            dbConnection: 'mysql',
            dbHost: 'localhost',
            dbName: 'evento_db',
            dbUsername: 'evento_user',
            enableGzip: true,
            enableMinification: true,
            enableCDN: false,
            cdnUrl: '',
            imageOptimization: 'lossy',
            imageQuality: '85',
            enableMonitoring: true,
            monitoringService: 'sentry',
            logLevel: 'info',
            logRetention: '30',
            enableAutoBackup: true,
            backupFrequency: 'daily',
            backupTime: '02:00',
            backupRetention: '30',
            backupStorage: 's3',
            storageDriver: 's3',
            s3Bucket: 'evento-files',
            s3Region: 'us-east-1',
            maintenanceMode: false,
            maintenanceMessage: 'The system is currently undergoing maintenance. Please check back later.',
            autoUpdate: true,
            updateChannel: 'stable',
            enableCustomCode: true,
            customCSS: '',
            customJS: '',
            enableWebSockets: false,
            enableGraphQL: false,
            enableAI: false,
            enableBlockchain: false,
            enableBetaFeatures: false
        };
        
        saveSettings();
        applySettings();
    }

    function applySettings() {
        // Apply settings to form elements
        Object.keys(settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = settings[key];
                } else if (element.type === 'range') {
                    element.value = settings[key];
                    // Update display values for range inputs
                    if (key === 'minPasswordLength') {
                        document.getElementById('passwordLengthValue').textContent = settings[key] + ' characters';
                    } else if (key === 'imageQuality') {
                        document.getElementById('imageQualityValue').textContent = settings[key] + '%';
                    }
                } else if (element.type === 'color') {
                    element.value = settings[key];
                    document.querySelector('.color-value').textContent = settings[key];
                } else {
                    element.value = settings[key];
                }
            }
        });
        
        // Show/hide dependent options
        updateDependentOptions();
    }

    function updateDependentOptions() {
        // Show/hide password expiry options
        const passwordExpiryCheckbox = document.getElementById('passwordExpiry');
        const passwordExpiryOptions = document.getElementById('passwordExpiryOptions');
        if (passwordExpiryCheckbox && passwordExpiryOptions) {
            passwordExpiryOptions.style.display = passwordExpiryCheckbox.checked ? 'block' : 'none';
        }
        
        // Show/hide geo blocking options
        const geoBlockingCheckbox = document.getElementById('geoBlocking');
        const geoBlockingOptions = document.getElementById('geoBlockingOptions');
        if (geoBlockingCheckbox && geoBlockingOptions) {
            geoBlockingOptions.style.display = geoBlockingCheckbox.checked ? 'block' : 'none';
        }
    }

    function initializeUI() {
        // Initialize toggle switches
        updateDependentOptions();
        
        // Set danger buttons to disabled initially
        document.querySelectorAll('.danger-btn').forEach(btn => {
            btn.disabled = true;
        });
    }

    function updateSetting(key, value) {
        settings[key] = value;
        saveSettings();
    }

    function saveSettings() {
        try {
            localStorage.setItem('evento_settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
            showToast('Error saving settings to local storage', 'error');
        }
    }

    // ===== SETTINGS ACTIONS =====
    async function saveAllSettings() {
        showToast('Saving all settings...', 'info');
        
        // Save Admin profile first
        const token = localStorage.getItem("adminToken");
        if (token) {
            try {
                const nameInput = document.getElementById("adminNameInput");
                const phoneInput = document.getElementById("adminPhoneInput");
                const bioInput = document.getElementById("adminBioInput");
                
                const response = await fetch("http://localhost:3000/admin/auth/profile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: nameInput ? nameInput.value.trim() : "",
                        phone: phoneInput ? phoneInput.value.trim() : "",
                        bio: bioInput ? bioInput.value.trim() : "",
                        profileImage: adminProfileImageBase64
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem("adminToken", data.token);
                    
                    // Update current page sidebar elements
                    const payload = JSON.parse(atob(data.token.split('.')[1]));
                    const adminNameEl = document.querySelector(".sidebar .user-profile .user-info h3");
                    if (adminNameEl) adminNameEl.textContent = payload.name || payload.email || "Admin User";
                    const adminAvatarImg = document.querySelector(".sidebar .user-profile .avatar img");
                    if (adminAvatarImg && payload.profileImage) adminAvatarImg.src = payload.profileImage;
                } else {
                    console.error("Failed to save admin profile to database");
                }
            } catch (e) {
                console.error("Error saving admin profile:", e);
            }
        }
        
        // Simulate API call for system settings
        setTimeout(() => {
            saveSettings();
            unsavedChanges = false;
            showToast('All settings saved successfully!', 'success');
        }, 1500);
    }

    function resetToDefaults() {
        showToast('Resetting to defaults...', 'info');
        
        // Simulate reset process
        setTimeout(() => {
            localStorage.removeItem('evento_settings');
            loadDefaultSettings();
            unsavedChanges = false;
            showToast('Settings reset to defaults successfully!', 'success');
        }, 2000);
    }

    // ===== FILE UPLOAD =====
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const fileType = event.target.id;
        
        if (!file.type.match('image.*')) {
            showToast('Please select an image file', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showToast('File size must be less than 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            if (fileType === 'logoUpload') {
                document.getElementById('logoPreview').src = e.target.result;
                updateSetting('logo', e.target.result);
            } else if (fileType === 'faviconUpload') {
                document.getElementById('faviconPreview').src = e.target.result;
                updateSetting('favicon', e.target.result);
            }
            
            showToast('File uploaded successfully!', 'success');
            unsavedChanges = true;
        };
        reader.readAsDataURL(file);
    }

    // ===== API KEY GENERATION =====
    function generateApiKey() {
        showToast('Generating API key...', 'info');
        
        // Simulate API key generation
        setTimeout(() => {
            // Generate a random API key (JWT-like format)
            const apiKey = generateRandomApiKey();
            document.getElementById('generatedApiKey').textContent = apiKey;
            
            // Generate key details
            const keyId = 'ak_' + Math.random().toString(36).substr(2, 12);
            document.getElementById('apiKeyId').textContent = keyId;
            
            // Show modal
            document.getElementById('apiKeyModal').style.display = 'flex';
            showToast('API key generated successfully!', 'success');
            unsavedChanges = true;
            updateSetting('lastApiKeyGenerated', new Date().toISOString());
        }, 1000);
    }

    function generateRandomApiKey() {
        // This is a simplified version - in production, use proper JWT generation
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            sub: Math.random().toString(36).substr(2, 9),
            iat: Date.now(),
            exp: 'never'
        }));
        const signature = Math.random().toString(36).substr(2, 43);
        
        return `${header}.${payload}.${signature}`;
    }

    // ===== SYSTEM COMMANDS =====
    function executeSystemCommand(command) {
        const outputContent = document.querySelector('.output-content');
        
        // Add command to output
        const commandLine = document.createElement('div');
        commandLine.className = 'output-line command';
        commandLine.textContent = `$ ${command}`;
        outputContent.appendChild(commandLine);
        
        // Simulate command execution
        let response = '';
        
        switch(command) {
            case 'cache:clear':
                response = 'Cache cleared successfully.';
                showToast('Cache cleared!', 'success');
                break;
            case 'queue:restart':
                response = 'Queue worker restarted successfully.';
                showToast('Queue restarted!', 'success');
                break;
            case 'migrate:status':
                response = 'No pending migrations. Database is up to date.';
                break;
            case 'storage:link':
                response = 'The [public/storage] directory has been linked.';
                showToast('Storage linked!', 'success');
                break;
            case 'help':
                response = 'Available commands: cache:clear, queue:restart, migrate:status, storage:link';
                break;
            default:
                response = `Command "${command}" not recognized. Type "help" for available commands.`;
        }
        
        // Add response to output
        setTimeout(() => {
            const responseLine = document.createElement('div');
            responseLine.className = 'output-line response';
            responseLine.textContent = response;
            outputContent.appendChild(responseLine);
            
            // Scroll to bottom
            outputContent.scrollTop = outputContent.scrollHeight;
        }, 500);
    }

    // ===== MODAL FUNCTIONS =====
    function showConfirmationModal(title, message, callback) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        confirmActionCallback = callback;
        document.getElementById('confirmationModal').style.display = 'flex';
    }

    function showToast(message, type = 'info') {
        toastr[type](message);
    }

    // ===== TOASTR CONFIGURATION =====
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
});