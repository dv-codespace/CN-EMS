// admin-logs.js - Evento Admin Audit Logs Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // ===== GLOBAL VARIABLES =====
    let logsData = [];
    let filteredLogs = [];
    let currentPage = 1;
    let rowsPerPage = 25;
    let totalPages = 1;
    let currentSort = { column: 'timestamp', direction: 'desc' };
    let selectedLogs = new Set();
    let activeFilters = {
        level: ['all'],
        user: 'all',
        action: ['all'],
        module: ['all'],
        dateRange: null,
        timeFilter: 'all'
    };
    let liveLogsInterval = null;
    let isLiveLogsActive = false;

    // ===== INITIALIZATION =====
    initializeAuditLogs();

    // ===== SIDEBAR & NAVIGATION =====
    // Mobile menu toggle
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

    // ===== DATE RANGE PICKER =====
    // Initialize date range picker
    $('#dateRange').daterangepicker({
        opens: 'left',
        drops: 'down',
        startDate: moment().subtract(7, 'days'),
        endDate: moment(),
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, function(start, end) {
        activeFilters.dateRange = {
            start: start.format('YYYY-MM-DD'),
            end: end.format('YYYY-MM-DD')
        };
    });

    // ===== FILTER HANDLERS =====
    // Apply filters button
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }

    // Time filter change
    const timeFilter = document.getElementById('timeFilter');
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            activeFilters.timeFilter = this.value;
            if (this.value === 'custom') {
                $('#dateRange').click();
            }
        });
    }

    // ===== LOGS ACTIONS =====
    // Export logs button
    const exportLogsBtn = document.getElementById('exportLogsBtn');
    if (exportLogsBtn) {
        exportLogsBtn.addEventListener('click', function() {
            document.getElementById('exportModal').style.display = 'flex';
        });
    }

    // Refresh logs button
    const refreshLogsBtn = document.getElementById('refreshLogsBtn');
    if (refreshLogsBtn) {
        refreshLogsBtn.addEventListener('click', refreshLogs);
    }

    // Clear old logs button
    const clearLogsBtn = document.getElementById('clearLogsBtn');
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', function() {
            showConfirmationModal(
                'Clear Old Logs',
                'Are you sure you want to delete logs older than 90 days? This action cannot be undone.',
                clearOldLogs
            );
        });
    }

    // ===== TABLE CONTROLS =====
    // Rows per page change
    const rowsPerPageSelect = document.getElementById('rowsPerPage');
    if (rowsPerPageSelect) {
        rowsPerPageSelect.addEventListener('change', function() {
            rowsPerPage = parseInt(this.value);
            currentPage = 1;
            renderLogsTable();
        });
    }

    // Pagination buttons
    const firstPageBtn = document.getElementById('firstPageBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const lastPageBtn = document.getElementById('lastPageBtn');

    if (firstPageBtn) firstPageBtn.addEventListener('click', () => goToPage(1));
    if (prevPageBtn) prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
    if (nextPageBtn) nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
    if (lastPageBtn) lastPageBtn.addEventListener('click', () => goToPage(totalPages));

    // Table sorting
    document.querySelectorAll('.logs-table th[data-sort]').forEach(th => {
        th.addEventListener('click', function() {
            const column = this.getAttribute('data-sort');
            sortTable(column);
        });
    });

    // Select all checkbox
    const selectAllCheckbox = document.getElementById('selectAllLogs');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.log-checkbox');
            const isChecked = this.checked;
            
            checkboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
                const logId = checkbox.value;
                if (isChecked) {
                    selectedLogs.add(logId);
                } else {
                    selectedLogs.delete(logId);
                }
            });
            
            updateSelectedCount();
        });
    }

    // Bulk actions
    const applyBulkActionBtn = document.getElementById('applyBulkActionBtn');
    if (applyBulkActionBtn) {
        applyBulkActionBtn.addEventListener('click', applyBulkAction);
    }

    // ===== LIVE LOGS PANEL =====
    const toggleLiveBtn = document.getElementById('toggleLiveBtn');
    const clearLiveBtn = document.getElementById('clearLiveBtn');
    const collapsePanelBtn = document.getElementById('collapsePanelBtn');
    const liveLogsPanel = document.getElementById('liveLogsPanel');

    if (toggleLiveBtn) {
        toggleLiveBtn.addEventListener('click', toggleLiveLogs);
    }

    if (clearLiveBtn) {
        clearLiveBtn.addEventListener('click', clearLiveLogs);
    }

    if (collapsePanelBtn) {
        collapsePanelBtn.addEventListener('click', function() {
            liveLogsPanel.classList.toggle('collapsed');
            const icon = this.querySelector('i');
            if (liveLogsPanel.classList.contains('collapsed')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    }

    // ===== MODAL HANDLERS =====
    // Log details modal
    const logDetailsModal = document.getElementById('logDetailsModal');
    const closeLogDetailsModal = document.getElementById('closeLogDetailsModal');
    
    if (closeLogDetailsModal) {
        closeLogDetailsModal.addEventListener('click', () => {
            logDetailsModal.style.display = 'none';
        });
    }

    // Export modal
    const exportModal = document.getElementById('exportModal');
    const closeExportModal = document.getElementById('closeExportModal');
    const cancelExportBtn = document.getElementById('cancelExportBtn');
    const exportForm = document.getElementById('exportForm');
    
    if (closeExportModal) {
        closeExportModal.addEventListener('click', () => {
            exportModal.style.display = 'none';
        });
    }
    
    if (cancelExportBtn) {
        cancelExportBtn.addEventListener('click', () => {
            exportModal.style.display = 'none';
        });
    }
    
    if (exportForm) {
        exportForm.addEventListener('submit', handleExport);
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === logDetailsModal) {
            logDetailsModal.style.display = 'none';
        }
        if (event.target === exportModal) {
            exportModal.style.display = 'none';
        }
    });

    // ===== SEARCH FUNCTIONALITY =====
    const logsSearch = document.getElementById('logsSearch');
    if (logsSearch) {
        logsSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterLogsBySearch(searchTerm);
        });
    }

    // ===== INITIALIZATION FUNCTIONS =====
    function initializeAuditLogs() {
        // Set current date
        updateCurrentDate();
        
        // Load logs data
        loadLogsData();
        
        // Initialize statistics
        updateStatistics();
        
        // Render initial table
        renderLogsTable();
        
        // Start with some sample data
        generateSampleLogs();
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

    function loadLogsData() {
        // In a real application, this would be an API call
        // For now, we'll use sample data
        try {
            const savedLogs = localStorage.getItem('evento_audit_logs');
            if (savedLogs) {
                logsData = JSON.parse(savedLogs);
            }
        } catch (error) {
            console.error('Error loading logs:', error);
            logsData = [];
        }
    }

    function generateSampleLogs() {
        if (logsData.length === 0) {
            const sampleLogs = [
                {
                    id: 'LOG-2024-001',
                    timestamp: new Date().toISOString(),
                    level: 'info',
                    user: 'Admin User',
                    userEmail: 'admin@evento.com',
                    action: 'login',
                    module: 'Authentication',
                    description: 'User successfully logged into the system',
                    ip: '192.168.1.100',
                    status: 'success',
                    sessionId: 'sess_7890123456',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    location: 'New York, US',
                    requestData: { email: 'admin@evento.com' },
                    responseData: { status: 'success', user_id: 'usr_123456' },
                    source: 'Web Application',
                    endpoint: '/api/v1/auth/login',
                    method: 'POST',
                    responseTime: '250ms'
                },
                {
                    id: 'LOG-2024-002',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    level: 'warning',
                    user: 'John Doe',
                    userEmail: 'john.doe@example.com',
                    action: 'login',
                    module: 'Authentication',
                    description: 'Failed login attempt - incorrect password',
                    ip: '203.0.113.45',
                    status: 'failed',
                    sessionId: null,
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                    location: 'London, UK',
                    requestData: { email: 'john.doe@example.com' },
                    responseData: { error: 'Invalid credentials' },
                    source: 'Web Application',
                    endpoint: '/api/v1/auth/login',
                    method: 'POST',
                    responseTime: '120ms'
                },
                {
                    id: 'LOG-2024-003',
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    level: 'security',
                    user: 'System',
                    userEmail: null,
                    action: 'security',
                    module: 'System',
                    description: 'Multiple failed login attempts detected from IP 203.0.113.45',
                    ip: '203.0.113.45',
                    status: 'alert',
                    sessionId: null,
                    userAgent: null,
                    location: 'London, UK',
                    requestData: { ip: '203.0.113.45', attempts: 5 },
                    responseData: { action: 'temporarily_blocked', duration: '15 minutes' },
                    source: 'Security System',
                    endpoint: null,
                    method: null,
                    responseTime: null
                },
                {
                    id: 'LOG-2024-004',
                    timestamp: new Date(Date.now() - 10800000).toISOString(),
                    level: 'info',
                    user: 'Admin User',
                    userEmail: 'admin@evento.com',
                    action: 'create',
                    module: 'Events',
                    description: 'Created new event "Tech Conference 2024"',
                    ip: '192.168.1.100',
                    status: 'success',
                    sessionId: 'sess_7890123456',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    location: 'New York, US',
                    requestData: { event_name: 'Tech Conference 2024', category: 'Technology' },
                    responseData: { event_id: 'evt_987654', status: 'created' },
                    source: 'Web Application',
                    endpoint: '/api/v1/events',
                    method: 'POST',
                    responseTime: '350ms'
                },
                {
                    id: 'LOG-2024-005',
                    timestamp: new Date(Date.now() - 14400000).toISOString(),
                    level: 'error',
                    user: 'System',
                    userEmail: null,
                    action: 'system',
                    module: 'System',
                    description: 'Database connection timeout',
                    ip: null,
                    status: 'failed',
                    sessionId: null,
                    userAgent: null,
                    location: null,
                    requestData: { query: 'SELECT * FROM users', timeout: 30 },
                    responseData: { error: 'Connection timeout' },
                    source: 'Database',
                    endpoint: null,
                    method: null,
                    responseTime: '30000ms'
                }
            ];
            
            logsData = sampleLogs;
            saveLogsData();
        }
    }

    function saveLogsData() {
        try {
            localStorage.setItem('evento_audit_logs', JSON.stringify(logsData));
        } catch (error) {
            console.error('Error saving logs:', error);
        }
    }

    // ===== FILTER FUNCTIONS =====
    function applyFilters() {
        // Collect filter values
        activeFilters.level = Array.from(document.getElementById('logLevelFilter').selectedOptions).map(opt => opt.value);
        activeFilters.user = document.getElementById('userFilter').value;
        activeFilters.action = Array.from(document.getElementById('actionTypeFilter').selectedOptions).map(opt => opt.value);
        activeFilters.module = Array.from(document.getElementById('moduleFilter').selectedOptions).map(opt => opt.value);
        activeFilters.timeFilter = document.getElementById('timeFilter').value;

        // Apply date range filter if set
        const dateRangeValue = document.getElementById('dateRange').value;
        if (dateRangeValue && dateRangeValue.includes(' - ')) {
            const [start, end] = dateRangeValue.split(' - ');
            activeFilters.dateRange = {
                start: moment(start, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                end: moment(end, 'MM/DD/YYYY').format('YYYY-MM-DD')
            };
        }

        // Filter logs
        filterLogs();
        
        // Show success message
        showToast('Filters applied successfully!', 'success');
    }

    function clearFilters() {
        // Reset filter controls
        document.getElementById('logLevelFilter').selectedIndex = 0;
        document.getElementById('userFilter').value = 'all';
        document.getElementById('actionTypeFilter').selectedIndex = 0;
        document.getElementById('moduleFilter').selectedIndex = 0;
        document.getElementById('timeFilter').value = 'all';
        document.getElementById('dateRange').value = '';
        
        // Reset active filters
        activeFilters = {
            level: ['all'],
            user: 'all',
            action: ['all'],
            module: ['all'],
            dateRange: null,
            timeFilter: 'all'
        };
        
        // Reset filtered logs
        filteredLogs = [...logsData];
        
        // Render table
        renderLogsTable();
        
        // Show success message
        showToast('All filters cleared!', 'success');
    }

    function filterLogs() {
        filteredLogs = logsData.filter(log => {
            // Filter by level
            if (!activeFilters.level.includes('all') && !activeFilters.level.includes(log.level)) {
                return false;
            }
            
            // Filter by user
            if (activeFilters.user !== 'all') {
                if (activeFilters.user === 'admin' && log.user !== 'Admin User') return false;
                if (activeFilters.user === 'system' && log.user !== 'System') return false;
                if (activeFilters.user === 'organizer' && !log.userEmail?.includes('organizer')) return false;
                if (activeFilters.user === 'user' && !log.userEmail?.includes('@')) return false;
            }
            
            // Filter by action
            if (!activeFilters.action.includes('all') && !activeFilters.action.includes(log.action)) {
                return false;
            }
            
            // Filter by module
            if (!activeFilters.module.includes('all') && !activeFilters.module.includes(log.module.toLowerCase())) {
                return false;
            }
            
            // Filter by date range
            if (activeFilters.dateRange) {
                const logDate = new Date(log.timestamp).toISOString().split('T')[0];
                if (logDate < activeFilters.dateRange.start || logDate > activeFilters.dateRange.end) {
                    return false;
                }
            }
            
            // Filter by time
            if (activeFilters.timeFilter !== 'all') {
                const logDate = new Date(log.timestamp);
                const now = new Date();
                
                switch(activeFilters.timeFilter) {
                    case 'today':
                        if (logDate.toDateString() !== now.toDateString()) return false;
                        break;
                    case 'yesterday':
                        const yesterday = new Date(now);
                        yesterday.setDate(yesterday.getDate() - 1);
                        if (logDate.toDateString() !== yesterday.toDateString()) return false;
                        break;
                    case 'week':
                        const weekAgo = new Date(now);
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        if (logDate < weekAgo) return false;
                        break;
                    case 'month':
                        const monthAgo = new Date(now);
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        if (logDate < monthAgo) return false;
                        break;
                }
            }
            
            return true;
        });
        
        // Sort filtered logs
        sortFilteredLogs();
        
        // Update statistics
        updateStatistics();
        
        // Reset to first page
        currentPage = 1;
        
        // Render table
        renderLogsTable();
    }

    function filterLogsBySearch(searchTerm) {
        if (!searchTerm) {
            filteredLogs = [...logsData];
        } else {
            filteredLogs = logsData.filter(log => {
                return Object.values(log).some(value => 
                    value && value.toString().toLowerCase().includes(searchTerm)
                );
            });
        }
        
        sortFilteredLogs();
        currentPage = 1;
        renderLogsTable();
    }

    // ===== SORTING FUNCTIONS =====
    function sortTable(column) {
        if (currentSort.column === column) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            currentSort.direction = 'asc';
        }
        
        sortFilteredLogs();
        renderLogsTable();
        
        // Update sort indicators
        updateSortIndicators();
    }

    function sortFilteredLogs() {
        filteredLogs.sort((a, b) => {
            let aValue = a[currentSort.column];
            let bValue = b[currentSort.column];
            
            // Handle special cases
            if (currentSort.column === 'timestamp') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }
            
            if (aValue < bValue) return currentSort.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return currentSort.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    function updateSortIndicators() {
        document.querySelectorAll('.logs-table th i').forEach(icon => {
            icon.className = 'fas fa-sort';
        });
        
        const currentHeader = document.querySelector(`.logs-table th[data-sort="${currentSort.column}"]`);
        if (currentHeader) {
            const icon = currentHeader.querySelector('i');
            icon.className = currentSort.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
        }
    }

    // ===== TABLE RENDERING =====
    function renderLogsTable() {
        const tableBody = document.getElementById('logsTableBody');
        if (!tableBody) return;
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, filteredLogs.length);
        const pageLogs = filteredLogs.slice(startIndex, endIndex);
        
        // Update pagination info
        updatePaginationInfo();
        
        // Create table rows
        pageLogs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = createLogRowHTML(log);
            tableBody.appendChild(row);
            
            // Add event listeners to row buttons
            addRowEventListeners(row, log);
        });
        
        // Update selected count
        updateSelectedCount();
    }

    function createLogRowHTML(log) {
        const time = new Date(log.timestamp).toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const date = new Date(log.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        return `
            <td>
                <input type="checkbox" class="log-checkbox" value="${log.id}" ${selectedLogs.has(log.id) ? 'checked' : ''}>
            </td>
            <td>
                <div class="timestamp-cell">
                    <div class="timestamp-date">${date}</div>
                    <div class="timestamp-time">${time}</div>
                </div>
            </td>
            <td><span class="log-level ${log.level}">${log.level.toUpperCase()}</span></td>
            <td>
                <div class="user-cell">
                    <div class="user-name">${log.user}</div>
                    <div class="user-email">${log.userEmail || 'System'}</div>
                </div>
            </td>
            <td><span class="action-badge">${log.action.toUpperCase()}</span></td>
            <td>${log.module}</td>
            <td class="description-cell">${log.description}</td>
            <td>${log.ip || 'N/A'}</td>
            <td><span class="log-status ${log.status}">${log.status.toUpperCase()}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn-small view-log-btn" data-log-id="${log.id}" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn-small copy-log-btn" data-log-id="${log.id}" title="Copy Log ID">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn-small danger-btn delete-log-btn" data-log-id="${log.id}" title="Delete Log">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    }

    function addRowEventListeners(row, log) {
        // View log button
        const viewBtn = row.querySelector('.view-log-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => showLogDetails(log));
        }
        
        // Copy log ID button
        const copyBtn = row.querySelector('.copy-log-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => copyLogId(log.id));
        }
        
        // Delete log button
        const deleteBtn = row.querySelector('.delete-log-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteLog(log.id));
        }
        
        // Checkbox
        const checkbox = row.querySelector('.log-checkbox');
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    selectedLogs.add(log.id);
                } else {
                    selectedLogs.delete(log.id);
                    document.getElementById('selectAllLogs').checked = false;
                }
                updateSelectedCount();
            });
        }
    }

    function updatePaginationInfo() {
        totalPages = Math.ceil(filteredLogs.length / rowsPerPage);
        
        // Update page info
        document.getElementById('showingCount').textContent = Math.min(rowsPerPage, filteredLogs.length);
        document.getElementById('totalCount').textContent = filteredLogs.length;
        document.getElementById('currentPage').textContent = currentPage;
        document.getElementById('totalPages').textContent = totalPages;
        
        // Update button states
        document.getElementById('firstPageBtn').disabled = currentPage === 1;
        document.getElementById('prevPageBtn').disabled = currentPage === 1;
        document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
        document.getElementById('lastPageBtn').disabled = currentPage === totalPages;
    }

    function goToPage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            renderLogsTable();
            window.scrollTo({ top: document.querySelector('.logs-table-container').offsetTop - 100, behavior: 'smooth' });
        }
    }

    // ===== STATISTICS FUNCTIONS =====
    function updateStatistics() {
        const total = filteredLogs.length;
        const warnings = filteredLogs.filter(log => log.level === 'warning').length;
        const errors = filteredLogs.filter(log => log.level === 'error' || log.level === 'critical').length;
        const security = filteredLogs.filter(log => log.level === 'security').length;
        
        // Count user activities in last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const userActivities = filteredLogs.filter(log => 
            log.user !== 'System' && new Date(log.timestamp) > twentyFourHoursAgo
        ).length;
        
        // Update statistics cards
        document.getElementById('totalLogsCount').textContent = total.toLocaleString();
        document.getElementById('warningLogsCount').textContent = warnings.toLocaleString();
        document.getElementById('errorLogsCount').textContent = errors.toLocaleString();
        document.getElementById('securityLogsCount').textContent = security.toLocaleString();
        document.getElementById('userActivityCount').textContent = userActivities.toLocaleString();
    }

    // ===== LOG DETAILS FUNCTIONS =====
    function showLogDetails(log) {
        // Populate modal with log details
        document.getElementById('detailLogId').textContent = log.id;
        document.getElementById('detailTimestamp').textContent = new Date(log.timestamp).toLocaleString();
        document.getElementById('detailLevel').textContent = log.level.toUpperCase();
        document.getElementById('detailLevel').className = `log-level ${log.level}`;
        document.getElementById('detailStatus').textContent = log.status.toUpperCase();
        document.getElementById('detailStatus').className = `log-status ${log.status}`;
        document.getElementById('detailUser').textContent = `${log.user} (${log.userEmail || 'System'})`;
        document.getElementById('detailUserRole').textContent = log.user === 'Admin User' ? 'Super Admin' : 'User';
        document.getElementById('detailSessionId').textContent = log.sessionId || 'N/A';
        document.getElementById('detailUserAgent').textContent = log.userAgent || 'N/A';
        document.getElementById('detailAction').textContent = log.action.toUpperCase();
        document.getElementById('detailModule').textContent = log.module;
        document.getElementById('detailDescription').textContent = log.description;
        document.getElementById('detailIp').textContent = log.ip || 'N/A';
        document.getElementById('detailLocation').textContent = log.location || 'Unknown';
        document.getElementById('detailRequestData').textContent = JSON.stringify(log.requestData, null, 2);
        document.getElementById('detailResponseData').textContent = JSON.stringify(log.responseData, null, 2);
        document.getElementById('detailSource').textContent = log.source || 'Unknown';
        document.getElementById('detailEndpoint').textContent = log.endpoint || 'N/A';
        document.getElementById('detailMethod').textContent = log.method || 'N/A';
        document.getElementById('detailResponseTime').textContent = log.responseTime || 'N/A';
        
        // Add event listeners to modal buttons
        document.getElementById('exportLogDetailBtn').onclick = () => exportSingleLog(log);
        document.getElementById('copyLogIdBtn').onclick = () => copyLogId(log.id);
        document.getElementById('deleteLogDetailBtn').onclick = () => deleteLog(log.id);
        
        // Show modal
        document.getElementById('logDetailsModal').style.display = 'flex';
    }

    function copyLogId(logId) {
        navigator.clipboard.writeText(logId)
            .then(() => {
                showToast('Log ID copied to clipboard!', 'success');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                showToast('Failed to copy Log ID', 'error');
            });
    }

    function deleteLog(logId) {
        showConfirmationModal(
            'Delete Log',
            'Are you sure you want to delete this log entry? This action cannot be undone.',
            () => {
                logsData = logsData.filter(log => log.id !== logId);
                filteredLogs = filteredLogs.filter(log => log.id !== logId);
                selectedLogs.delete(logId);
                saveLogsData();
                renderLogsTable();
                updateStatistics();
                showToast('Log deleted successfully!', 'success');
                
                // Close modal if open
                document.getElementById('logDetailsModal').style.display = 'none';
            }
        );
    }

    // ===== BULK ACTIONS =====
    function applyBulkAction() {
        const actionSelect = document.getElementById('bulkActionSelect');
        const action = actionSelect.value;
        
        if (!action) {
            showToast('Please select a bulk action', 'warning');
            return;
        }
        
        if (selectedLogs.size === 0) {
            showToast('No logs selected', 'warning');
            return;
        }
        
        switch(action) {
            case 'delete':
                showConfirmationModal(
                    'Delete Selected Logs',
                    `Are you sure you want to delete ${selectedLogs.size} log entries? This action cannot be undone.`,
                    deleteSelectedLogs
                );
                break;
                
            case 'export':
                exportSelectedLogs();
                break;
                
            case 'mark_read':
                // Mark selected logs as read
                showToast(`${selectedLogs.size} logs marked as read`, 'success');
                break;
                
            case 'mark_important':
                // Mark selected logs as important
                showToast(`${selectedLogs.size} logs marked as important`, 'success');
                break;
        }
        
        // Reset bulk action select
        actionSelect.value = '';
    }

    function deleteSelectedLogs() {
        logsData = logsData.filter(log => !selectedLogs.has(log.id));
        filteredLogs = filteredLogs.filter(log => !selectedLogs.has(log.id));
        selectedLogs.clear();
        saveLogsData();
        renderLogsTable();
        updateStatistics();
        showToast('Selected logs deleted successfully!', 'success');
    }

    // ===== EXPORT FUNCTIONS =====
    function handleExport(e) {
        e.preventDefault();
        
        const format = document.getElementById('exportFormat').value;
        const range = document.getElementById('exportRange').value;
        const fileName = document.getElementById('exportFileName').value || 'evento-audit-logs';
        
        let logsToExport = [];
        
        switch(range) {
            case 'current':
                const startIndex = (currentPage - 1) * rowsPerPage;
                const endIndex = Math.min(startIndex + rowsPerPage, filteredLogs.length);
                logsToExport = filteredLogs.slice(startIndex, endIndex);
                break;
                
            case 'selected':
                logsToExport = filteredLogs.filter(log => selectedLogs.has(log.id));
                break;
                
            case 'all':
                logsToExport = logsData;
                break;
                
            case 'filtered':
                logsToExport = filteredLogs;
                break;
        }
        
        // Collect selected fields
        const fields = [];
        if (document.getElementById('fieldTimestamp').checked) fields.push('timestamp');
        if (document.getElementById('fieldLevel').checked) fields.push('level');
        if (document.getElementById('fieldUser').checked) fields.push('user');
        if (document.getElementById('fieldAction').checked) fields.push('action');
        if (document.getElementById('fieldModule').checked) fields.push('module');
        if (document.getElementById('fieldDescription').checked) fields.push('description');
        if (document.getElementById('fieldIp').checked) fields.push('ip');
        if (document.getElementById('fieldStatus').checked) fields.push('status');
        
        // Export data
        exportData(logsToExport, fields, format, fileName);
        
        // Close modal
        exportModal.style.display = 'none';
    }

    function exportData(data, fields, format, fileName) {
        showToast(`Exporting ${data.length} logs as ${format.toUpperCase()}...`, 'info');
        
        // Simulate export process
        setTimeout(() => {
            let content, mimeType, extension;
            
            switch(format) {
                case 'csv':
                    content = convertToCSV(data, fields);
                    mimeType = 'text/csv';
                    extension = 'csv';
                    break;
                    
                case 'json':
                    content = JSON.stringify(data, null, 2);
                    mimeType = 'application/json';
                    extension = 'json';
                    break;
                    
                case 'pdf':
                case 'excel':
                    // In a real application, you would generate PDF/Excel files
                    showToast(`${format.toUpperCase()} export feature coming soon!`, 'info');
                    return;
            }
            
            // Create download link
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast(`Exported successfully as ${fileName}.${extension}`, 'success');
        }, 1500);
    }

    function convertToCSV(data, fields) {
        const headers = fields.join(',');
        const rows = data.map(log => {
            return fields.map(field => {
                let value = log[field] || '';
                // Handle special formatting
                if (field === 'timestamp') {
                    value = new Date(value).toLocaleString();
                }
                // Escape commas and quotes
                value = String(value).replace(/"/g, '""');
                if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                    value = `"${value}"`;
                }
                return value;
            }).join(',');
        });
        
        return [headers, ...rows].join('\n');
    }

    function exportSingleLog(log) {
        const fileName = `evento-log-${log.id}`;
        const content = JSON.stringify(log, null, 2);
        
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Log exported successfully!', 'success');
    }

    function exportSelectedLogs() {
        const selectedLogsArray = filteredLogs.filter(log => selectedLogs.has(log.id));
        if (selectedLogsArray.length === 0) {
            showToast('No logs selected for export', 'warning');
            return;
        }
        
        const fileName = `evento-selected-logs-${new Date().toISOString().split('T')[0]}`;
        const content = JSON.stringify(selectedLogsArray, null, 2);
        
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`${selectedLogsArray.length} logs exported successfully!`, 'success');
    }

    // ===== CLEAR OLD LOGS =====
    function clearOldLogs() {
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const oldLogsCount = logsData.filter(log => new Date(log.timestamp) < ninetyDaysAgo).length;
        
        logsData = logsData.filter(log => new Date(log.timestamp) >= ninetyDaysAgo);
        saveLogsData();
        filterLogs();
        
        showToast(`Deleted ${oldLogsCount} logs older than 90 days`, 'success');
    }

    // ===== LIVE LOGS FUNCTIONS =====
    function toggleLiveLogs() {
        const toggleBtn = document.getElementById('toggleLiveBtn');
        const liveIndicator = document.querySelector('.live-indicator');
        
        if (isLiveLogsActive) {
            // Stop live logs
            clearInterval(liveLogsInterval);
            liveLogsInterval = null;
            isLiveLogsActive = false;
            
            toggleBtn.innerHTML = '<i class="fas fa-play"></i> Start Live';
            toggleBtn.style.background = 'var(--success-color)';
            liveIndicator.style.background = '#ccc';
            
            showToast('Live logs monitoring stopped', 'info');
        } else {
            // Start live logs
            isLiveLogsActive = true;
            toggleBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Live';
            toggleBtn.style.background = 'var(--danger-color)';
            liveIndicator.style.background = 'var(--danger-color)';
            
            liveLogsInterval = setInterval(generateLiveLog, 3000);
            showToast('Live logs monitoring started', 'success');
        }
    }

    function generateLiveLog() {
        const liveLogsBody = document.getElementById('liveLogsBody');
        if (!liveLogsBody) return;
        
        const logTypes = [
            { level: 'info', message: 'User accessed dashboard' },
            { level: 'info', message: 'New event created' },
            { level: 'warning', message: 'API rate limit warning' },
            { level: 'security', message: 'Suspicious activity detected' },
            { level: 'info', message: 'Email notification sent' },
            { level: 'error', message: 'Database query failed' }
        ];
        
        const randomLog = logTypes[Math.floor(Math.random() * logTypes.length)];
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        
        const logEntry = document.createElement('div');
        logEntry.className = `live-log-entry ${randomLog.level}`;
        logEntry.innerHTML = `
            <span class="log-time">${time}</span>
            <span class="log-level ${randomLog.level}">${randomLog.level.toUpperCase()}</span>
            <span class="log-message">${randomLog.message}</span>
        `;
        
        liveLogsBody.prepend(logEntry);
        
        // Keep only last 10 entries
        const entries = liveLogsBody.querySelectorAll('.live-log-entry');
        if (entries.length > 10) {
            entries[entries.length - 1].remove();
        }
    }

    function clearLiveLogs() {
        const liveLogsBody = document.getElementById('liveLogsBody');
        if (liveLogsBody) {
            liveLogsBody.innerHTML = '';
            showToast('Live logs cleared', 'success');
        }
    }

    // ===== REFRESH LOGS =====
    function refreshLogs() {
        showToast('Refreshing logs...', 'info');
        
        // In a real application, this would fetch new logs from the server
        setTimeout(() => {
            // Add a sample new log
            const newLog = {
                id: `LOG-${new Date().getFullYear()}-${String(logsData.length + 1).padStart(3, '0')}`,
                timestamp: new Date().toISOString(),
                level: 'info',
                user: 'Admin User',
                userEmail: 'admin@evento.com',
                action: 'read',
                module: 'Audit Logs',
                description: 'Admin refreshed audit logs page',
                ip: '192.168.1.100',
                status: 'success',
                sessionId: 'sess_7890123456',
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                location: 'New York, US',
                requestData: { action: 'refresh_logs' },
                responseData: { count: logsData.length },
                source: 'Web Application',
                endpoint: '/api/v1/logs',
                method: 'GET',
                responseTime: '150ms'
            };
            
            logsData.unshift(newLog);
            saveLogsData();
            filterLogs();
            
            showToast('Logs refreshed successfully!', 'success');
        }, 1000);
    }

    // ===== HELPER FUNCTIONS =====
    function updateSelectedCount() {
        const selectedCountElement = document.getElementById('selectedCount');
        if (selectedCountElement) {
            selectedCountElement.textContent = selectedLogs.size;
        }
    }

    function showConfirmationModal(title, message, callback) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('confirmationModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.id = 'confirmationModal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <p>${message}</p>
                        <div class="modal-actions">
                            <button type="button" class="cancel-btn">Cancel</button>
                            <button type="button" class="confirm-btn">Confirm</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Add event listeners
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            modal.querySelector('.cancel-btn').addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            modal.querySelector('.confirm-btn').addEventListener('click', () => {
                callback();
                modal.style.display = 'none';
            });
            
            // Close when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        // Update content and show
        modal.querySelector('h3').textContent = title;
        modal.querySelector('p').textContent = message;
        modal.querySelector('.confirm-btn').onclick = () => {
            callback();
            modal.style.display = 'none';
        };
        
        modal.style.display = 'flex';
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

    // Initialize filters
    filterLogs();
});