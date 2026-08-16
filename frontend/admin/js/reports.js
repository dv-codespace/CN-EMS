// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const currentDate = document.getElementById('currentDate');
    const newReportBtn = document.getElementById('newReportBtn');
    const refreshReportsBtn = document.getElementById('refreshReportsBtn');
    const reportsSearch = document.getElementById('reportsSearch');
    
    // Category buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Template generate buttons
    const generateBtns = document.querySelectorAll('.generate-btn');
    
    // Report actions
    const viewAllReportsBtn = document.getElementById('viewAllReports');
    const scheduleNewReportBtn = document.getElementById('scheduleNewReport');
    
    // Report filter
    const recentFilter = document.getElementById('recentFilter');
    const statsPeriod = document.getElementById('statsPeriod');
    
    // Report items and actions
    const reportItems = document.querySelectorAll('.report-item');
    const scheduledItems = document.querySelectorAll('.scheduled-item');
    
    // Modals
    const reportModal = document.getElementById('reportModal');
    const scheduleModal = document.getElementById('scheduleModal');
    const closeReportModal = document.getElementById('closeReportModal');
    const closeScheduleModal = document.getElementById('closeScheduleModal');
    const cancelReportBtn = document.getElementById('cancelReportBtn');
    const cancelScheduleBtn = document.getElementById('cancelScheduleBtn');
    
    // Forms
    const reportForm = document.getElementById('reportForm');
    const scheduleForm = document.getElementById('scheduleForm');
    
    // Schedule frequency
    const scheduleFrequency = document.getElementById('scheduleFrequency');
    const customScheduleOptions = document.getElementById('customScheduleOptions');
    
    // State variables
    let reports = [];
    let scheduledReports = [];
    
    // Initialize reports page
    function initReportsPage() {
        // Update date display
        updateDateDisplay();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize report data
        initReportData();
        
        // Update date every minute
        setInterval(updateDateDisplay, 60000);
        
        // Simulate report updates
        simulateReportUpdates();
    }
    
    // Update date display
    function updateDateDisplay() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        currentDate.textContent = now.toLocaleDateString('en-US', options) + ' • ' + now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});
    }
    
    // Initialize report data
    function initReportData() {
        // Initialize sample reports data
        reports = [
            {
                id: 1,
                name: 'Q3 Financial Report 2024',
                type: 'financial',
                status: 'completed',
                date: 'Oct 15, 2024',
                generatedBy: 'Admin',
                format: 'PDF',
                size: '2.4 MB'
            },
            {
                id: 2,
                name: 'Monthly User Growth Report',
                type: 'user',
                status: 'completed',
                date: 'Oct 10, 2024',
                generatedBy: 'System',
                format: 'CSV',
                size: '1.8 MB'
            },
            {
                id: 3,
                name: 'Event Performance Analysis',
                type: 'event',
                status: 'processing',
                date: 'Oct 5, 2024',
                generatedBy: 'Admin',
                format: 'Excel',
                size: '3.2 MB'
            },
            {
                id: 4,
                name: 'System Performance Report',
                type: 'system',
                status: 'completed',
                date: 'Oct 1, 2024',
                generatedBy: 'System',
                format: 'PDF',
                size: '1.5 MB'
            },
            {
                id: 5,
                name: 'Transaction Summary',
                type: 'financial',
                status: 'completed',
                date: 'Sep 30, 2024',
                generatedBy: 'System',
                format: 'PDF',
                size: '0.8 MB'
            }
        ];
        
        // Initialize sample scheduled reports
        scheduledReports = [
            {
                id: 1,
                name: 'Weekly Event Summary',
                type: 'event',
                status: 'active',
                frequency: 'weekly',
                time: 'Monday at 9:00 AM',
                recipients: 'admin@evento.com',
                format: 'PDF'
            },
            {
                id: 2,
                name: 'Monthly Financial Report',
                type: 'financial',
                status: 'active',
                frequency: 'monthly',
                time: '1st of every month',
                recipients: 'finance@evento.com',
                format: 'Excel'
            },
            {
                id: 3,
                name: 'Daily User Analytics',
                type: 'user',
                status: 'paused',
                frequency: 'daily',
                time: 'Daily at 6:00 AM',
                recipients: 'analytics@evento.com',
                format: 'CSV'
            }
        ];
    }
    
    // Filter reports by category
    function filterReports(category) {
        reportItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Generate report from template
    function generateReportFromTemplate(template) {
        showToast(`Generating ${template} report...`, 'info');
        
        // Simulate report generation
        setTimeout(() => {
            // Add new report to the list
            const newReport = {
                id: reports.length + 1,
                name: `${template.charAt(0).toUpperCase() + template.slice(1)} Report`,
                type: template,
                status: 'processing',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                generatedBy: 'Admin',
                format: 'PDF',
                size: '1.5 MB'
            };
            
            reports.unshift(newReport);
            updateRecentReports();
            
            // Update processing status after delay
            setTimeout(() => {
                const index = reports.findIndex(r => r.id === newReport.id);
                if (index !== -1) {
                    reports[index].status = 'completed';
                    updateRecentReports();
                    showToast(`${template} report generated successfully!`);
                }
            }, 3000);
        }, 1000);
    }
    
    // Update recent reports list
    function updateRecentReports() {
        const reportsList = document.querySelector('.reports-list');
        const filterValue = recentFilter.value;
        
        // Clear current list
        reportsList.innerHTML = '';
        
        // Filter reports
        const filteredReports = filterValue === 'all' 
            ? reports 
            : reports.filter(report => report.type === filterValue);
        
        // Add reports to list (limit to 5)
        filteredReports.slice(0, 5).forEach(report => {
            const reportItem = createReportItem(report);
            reportsList.appendChild(reportItem);
        });
        
        // Reattach event listeners
        attachReportItemListeners();
    }
    
    // Create report item element
    function createReportItem(report) {
        const item = document.createElement('div');
        item.className = 'report-item';
        item.dataset.category = report.type;
        
        let icon = 'fas fa-file-alt';
        switch(report.type) {
            case 'financial':
                icon = 'fas fa-chart-line';
                break;
            case 'user':
                icon = 'fas fa-user-chart';
                break;
            case 'event':
                icon = 'fas fa-calendar-check';
                break;
            case 'system':
                icon = 'fas fa-server';
                break;
        }
        
        let statusClass = '';
        switch(report.status) {
            case 'completed':
                statusClass = 'completed';
                break;
            case 'processing':
                statusClass = 'processing';
                break;
            case 'failed':
                statusClass = 'failed';
                break;
        }
        
        item.innerHTML = `
            <div class="report-icon">
                <i class="${icon}"></i>
            </div>
            <div class="report-content">
                <div class="report-header">
                    <h4>${report.name}</h4>
                    <span class="report-status ${statusClass}">${report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span>
                </div>
                <p>${getReportDescription(report.type)}</p>
                <div class="report-meta">
                    <span><i class="fas fa-calendar"></i> ${report.date}</span>
                    <span><i class="fas fa-user"></i> Generated by ${report.generatedBy}</span>
                    <span><i class="fas fa-file-${report.format.toLowerCase()}"></i> ${report.format}, ${report.size}</span>
                </div>
            </div>
            <div class="report-actions">
                <button class="action-icon view-btn" title="View Report" ${report.status === 'processing' ? 'disabled' : ''}>
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-icon download-btn" title="Download" ${report.status === 'processing' ? 'disabled' : ''}>
                    <i class="fas fa-download"></i>
                </button>
                ${report.status === 'processing' 
                    ? '<button class="action-icon cancel-btn" title="Cancel Processing"><i class="fas fa-times"></i></button>'
                    : '<button class="action-icon share-btn" title="Share"><i class="fas fa-share-alt"></i></button><button class="action-icon delete-btn" title="Delete"><i class="fas fa-trash"></i></button>'
                }
            </div>
        `;
        
        return item;
    }
    
    // Get report description based on type
    function getReportDescription(type) {
        const descriptions = {
            financial: 'Revenue, expenses, and profit analysis',
            user: 'User acquisition, retention, and activity metrics',
            event: 'Event success metrics and attendance analysis',
            system: 'System performance and uptime metrics',
            organizer: 'Organizer metrics and revenue contribution',
            marketing: 'Campaign performance and ROI analysis'
        };
        
        return descriptions[type] || 'System report';
    }
    
    // Attach event listeners to report items
    function attachReportItemListeners() {
        document.querySelectorAll('.report-item').forEach(item => {
            const actions = item.querySelector('.report-actions');
            
            // View button
            const viewBtn = actions.querySelector('.view-btn');
            if (viewBtn && !viewBtn.disabled) {
                viewBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const reportName = item.querySelector('h4').textContent;
                    showToast(`Opening "${reportName}"...`, 'info');
                });
            }
            
            // Download button
            const downloadBtn = actions.querySelector('.download-btn');
            if (downloadBtn && !downloadBtn.disabled) {
                downloadBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const reportName = item.querySelector('h4').textContent;
                    showToast(`Downloading "${reportName}"...`, 'info');
                    
                    // Simulate download
                    setTimeout(() => {
                        showToast(`"${reportName}" downloaded successfully!`);
                    }, 1500);
                });
            }
            
            // Share button
            const shareBtn = actions.querySelector('.share-btn');
            if (shareBtn) {
                shareBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const reportName = item.querySelector('h4').textContent;
                    showToast(`Sharing options for "${reportName}" would open here`, 'info');
                });
            }
            
            // Delete button
            const deleteBtn = actions.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const reportName = item.querySelector('h4').textContent;
                    
                    if (confirm(`Are you sure you want to delete "${reportName}"?`)) {
                        item.style.opacity = '0.5';
                        item.style.pointerEvents = 'none';
                        
                        setTimeout(() => {
                            item.remove();
                            showToast(`"${reportName}" deleted successfully`, 'success');
                            updateReportsCount();
                        }, 300);
                    }
                });
            }
            
            // Cancel button
            const cancelBtn = actions.querySelector('.cancel-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const reportName = item.querySelector('h4').textContent;
                    
                    if (confirm(`Cancel processing of "${reportName}"?`)) {
                        item.style.opacity = '0.5';
                        item.style.pointerEvents = 'none';
                        
                        setTimeout(() => {
                            item.remove();
                            showToast(`"${reportName}" processing cancelled`, 'warning');
                            updateReportsCount();
                        }, 300);
                    }
                });
            }
        });
    }
    
    // Update reports count
    function updateReportsCount() {
        const totalReports = document.querySelectorAll('.report-item').length;
        const countElement = document.querySelector('.stat-content h3');
        if (countElement) {
            countElement.textContent = totalReports + reports.length - 5; // Adjust for displayed items
        }
    }
    
    // Simulate report updates
    function simulateReportUpdates() {
        // Randomly update report statuses
        setInterval(() => {
            const processingReports = reports.filter(r => r.status === 'processing');
            if (processingReports.length > 0) {
                const randomReport = processingReports[Math.floor(Math.random() * processingReports.length)];
                const index = reports.findIndex(r => r.id === randomReport.id);
                if (index !== -1) {
                    reports[index].status = 'completed';
                    updateRecentReports();
                    
                    // Show notification if new report completed
                    showToast(`Report "${randomReport.name}" completed`, 'success');
                }
            }
        }, 30000);
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
        
        // New report button
        newReportBtn.addEventListener('click', function() {
            reportModal.classList.add('active');
        });
        
        // Refresh reports button
        refreshReportsBtn.addEventListener('click', function() {
            showToast('Refreshing reports...', 'info');
            
            // Simulate refresh
            setTimeout(() => {
                updateRecentReports();
                showToast('Reports refreshed successfully!');
            }, 1000);
        });
        
        // Category buttons
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter reports
                const category = this.dataset.category;
                filterReports(category);
            });
        });
        
        // Template generate buttons
        generateBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const template = this.dataset.template;
                generateReportFromTemplate(template);
            });
        });
        
        // View all reports button
        viewAllReportsBtn.addEventListener('click', function() {
            showToast('Opening all reports...', 'info');
        });
        
        // Schedule new report button
        scheduleNewReportBtn.addEventListener('click', function() {
            scheduleModal.classList.add('active');
        });
        
        // Report filter change
        recentFilter.addEventListener('change', function() {
            updateRecentReports();
            showToast(`Filtering reports by ${this.value}`, 'info');
        });
        
        // Stats period change
        statsPeriod.addEventListener('change', function() {
            showToast(`Showing statistics for ${this.value}`, 'info');
            // In real app, update statistics based on period
        });
        
        // Schedule frequency change
        scheduleFrequency.addEventListener('change', function() {
            if (this.value === 'custom') {
                customScheduleOptions.style.display = 'block';
            } else {
                customScheduleOptions.style.display = 'none';
            }
        });
        
        // Report form submission
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const reportType = document.getElementById('reportType').value;
            const dateFrom = document.getElementById('dateFrom').value;
            const dateTo = document.getElementById('dateTo').value;
            const reportName = document.getElementById('reportName').value;
            
            // Get selected formats
            const formats = Array.from(document.querySelectorAll('input[name="format"]:checked'))
                .map(input => input.value);
            
            // Get selected sections
            const sections = Array.from(document.querySelectorAll('input[name="sections"]:checked'))
                .map(input => input.value);
            
            // In a real app, you would generate the report here
            console.log('Generating report:', { 
                reportType, 
                dateFrom, 
                dateTo, 
                reportName, 
                formats, 
                sections 
            });
            
            reportModal.classList.remove('active');
            reportForm.reset();
            
            // Simulate report generation
            showToast(`Generating "${reportName}"...`, 'info');
            
            setTimeout(() => {
                // Add to reports list
                const newReport = {
                    id: reports.length + 1,
                    name: reportName,
                    type: reportType,
                    status: 'processing',
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    generatedBy: 'Admin',
                    format: formats[0] ? formats[0].toUpperCase() : 'PDF',
                    size: '1.2 MB'
                };
                
                reports.unshift(newReport);
                updateRecentReports();
                
                // Update status after delay
                setTimeout(() => {
                    const index = reports.findIndex(r => r.id === newReport.id);
                    if (index !== -1) {
                        reports[index].status = 'completed';
                        updateRecentReports();
                        showToast(`Report "${reportName}" generated successfully!`);
                    }
                }, 3000);
            }, 1000);
        });
        
        // Schedule form submission
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const scheduleType = document.getElementById('scheduleReportType').value;
            const frequency = document.getElementById('scheduleFrequency').value;
            const recipients = document.getElementById('recipients').value;
            const scheduleName = document.getElementById('scheduleName').value;
            
            // In a real app, you would save the schedule here
            console.log('Saving schedule:', { 
                scheduleType, 
                frequency, 
                recipients, 
                scheduleName 
            });
            
            scheduleModal.classList.remove('active');
            scheduleForm.reset();
            
            showToast(`Schedule "${scheduleName}" saved successfully!`);
            
            // Add to scheduled list
            const newSchedule = {
                id: scheduledReports.length + 1,
                name: scheduleName,
                type: scheduleType,
                status: 'active',
                frequency: frequency,
                time: frequency === 'custom' ? 'Custom schedule' : `${frequency} schedule`,
                recipients: recipients,
                format: document.getElementById('scheduleFormat').value.toUpperCase()
            };
            
            scheduledReports.push(newSchedule);
            
            // In real app, you would update the UI with the new schedule
            setTimeout(() => {
                showToast('Scheduled reports list updated', 'info');
            }, 500);
        });
        
        // Modal close buttons
        closeReportModal.addEventListener('click', function() {
            reportModal.classList.remove('active');
            reportForm.reset();
        });
        
        closeScheduleModal.addEventListener('click', function() {
            scheduleModal.classList.remove('active');
            scheduleForm.reset();
            customScheduleOptions.style.display = 'none';
        });
        
        cancelReportBtn.addEventListener('click', function() {
            reportModal.classList.remove('active');
            reportForm.reset();
        });
        
        cancelScheduleBtn.addEventListener('click', function() {
            scheduleModal.classList.remove('active');
            scheduleForm.reset();
            customScheduleOptions.style.display = 'none';
        });
        
        // Search functionality
        reportsSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                showToast(`Searching reports for "${this.value}"...`, 'info');
                this.value = '';
            }
        });
        
        // Quick switch link
        document.querySelector('.quick-switch').addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Switch to Organizer View? You will be redirected to the organizer dashboard.')) {
                showToast('Switching to organizer view...', 'info');
                // In real app, redirect to organizer dashboard
                // window.location.href = '../../index.html';
            }
        });
        
        // Modal close on outside click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
                if (e.target.id === 'reportModal') {
                    reportForm.reset();
                } else if (e.target.id === 'scheduleModal') {
                    scheduleForm.reset();
                    customScheduleOptions.style.display = 'none';
                }
            }
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                reportModal.classList.remove('active');
                scheduleModal.classList.remove('active');
                reportForm.reset();
                scheduleForm.reset();
                customScheduleOptions.style.display = 'none';
            }
        });
        
        // Scheduled report actions
        scheduledItems.forEach(item => {
            const actions = item.querySelector('.scheduled-actions');
            
            // Edit button
            const editBtn = actions.querySelector('.edit-btn');
            if (editBtn) {
                editBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const scheduleName = item.querySelector('h4').textContent;
                    showToast(`Editing schedule "${scheduleName}"...`, 'info');
                });
            }
            
            // Pause/Play button
            const pauseBtn = actions.querySelector('.pause-btn');
            const playBtn = actions.querySelector('.play-btn');
            
            if (pauseBtn) {
                pauseBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const scheduleName = item.querySelector('h4').textContent;
                    const statusElement = item.querySelector('.schedule-status');
                    
                    if (statusElement.classList.contains('active')) {
                        statusElement.textContent = 'Paused';
                        statusElement.classList.remove('active');
                        statusElement.classList.add('paused');
                        this.innerHTML = '<i class="fas fa-play"></i>';
                        this.title = 'Resume Schedule';
                        showToast(`Schedule "${scheduleName}" paused`, 'warning');
                    }
                });
            }
            
            if (playBtn) {
                playBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const scheduleName = item.querySelector('h4').textContent;
                    const statusElement = item.querySelector('.schedule-status');
                    
                    if (statusElement.classList.contains('paused')) {
                        statusElement.textContent = 'Active';
                        statusElement.classList.remove('paused');
                        statusElement.classList.add('active');
                        showToast(`Schedule "${scheduleName}" resumed`, 'success');
                    }
                });
            }
            
            // Delete button
            const deleteBtn = actions.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const scheduleName = item.querySelector('h4').textContent;
                    
                    if (confirm(`Are you sure you want to delete schedule "${scheduleName}"?`)) {
                        item.style.opacity = '0.5';
                        item.style.pointerEvents = 'none';
                        
                        setTimeout(() => {
                            item.remove();
                            showToast(`Schedule "${scheduleName}" deleted`, 'success');
                        }, 300);
                    }
                });
            }
        });
        
        // Attach report item listeners
        attachReportItemListeners();
        
        // Set default dates in report form
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        
        document.getElementById('dateFrom').valueAsDate = lastWeek;
        document.getElementById('dateTo').valueAsDate = today;
    }
    
    // Initialize the reports page
    initReportsPage();
});