// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const currentDate = document.getElementById('currentDate');
    const exportBtn = document.getElementById('exportBtn');
    const dateRange = document.getElementById('dateRange');
    const revenueChartFilter = document.getElementById('revenueChartFilter');
    const ticketChartFilter = document.getElementById('ticketChartFilter');
    
    // Modal elements
    const exportModal = document.getElementById('exportModal');
    const exportForm = document.getElementById('exportForm');
    const closeExportModal = document.getElementById('closeExportModal');
    const cancelExportBtn = document.getElementById('cancelExportBtn');
    const exportSubmitBtn = document.getElementById('exportSubmitBtn');
    
    // Chart instances
    let revenueChart = null;
    let ticketSalesChart = null;
    let categoryChart = null;
    let ageChart = null;
    let genderChart = null;
    
    // Initialize analytics
    function initAnalytics() {
        // Update date display
        updateDateDisplay();
        
        // Initialize charts
        initCharts();
        
        // Setup event listeners
        setupEventListeners();
        
        // Update date every minute
        setInterval(updateDateDisplay, 60000);
        
        // Update activity time ago
        updateActivityTime();
        setInterval(updateActivityTime, 60000); // Update every minute
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
    
    // Update activity time ago
    function updateActivityTime() {
        const timeElements = document.querySelectorAll('.activity-time');
        timeElements.forEach(element => {
            // Simulate time updates
            const currentText = element.textContent;
            if (currentText.includes('just now')) {
                // Keep as is
            } else if (currentText.includes('minute')) {
                const minutes = parseInt(currentText);
                element.textContent = `${minutes + 1} minutes ago`;
            }
        });
    }
    
    // Initialize charts
    function initCharts() {
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Revenue',
                    data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
        // Ticket Sales Chart
        const ticketCtx = document.getElementById('ticketSalesChart').getContext('2d');
        ticketSalesChart = new Chart(ticketCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Tickets Sold',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: 'rgba(76, 201, 240, 0.6)',
                    borderColor: '#4cc9f0',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        },
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
        // Category Chart
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Technology', 'Music', 'Education', 'Business'],
                datasets: [{
                    data: [35, 30, 20, 15],
                    backgroundColor: [
                        '#4361ee',
                        '#f472b6',
                        '#4cc9f0',
                        '#4ade80'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
        
        // Age Chart
        const ageCtx = document.getElementById('ageChart').getContext('2d');
        ageChart = new Chart(ageCtx, {
            type: 'bar',
            data: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                datasets: [{
                    label: 'Age Distribution',
                    data: [25, 40, 20, 10, 5],
                    backgroundColor: 'rgba(67, 97, 238, 0.6)',
                    borderColor: '#4361ee',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
        // Gender Chart
        const genderCtx = document.getElementById('genderChart').getContext('2d');
        genderChart = new Chart(genderCtx, {
            type: 'pie',
            data: {
                labels: ['Male', 'Female', 'Other'],
                datasets: [{
                    data: [55, 42, 3],
                    backgroundColor: [
                        '#4361ee',
                        '#f472b6',
                        '#4cc9f0'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update revenue chart based on filter
    function updateRevenueChart(filter) {
        let labels, data;
        
        switch(filter) {
            case 'daily':
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                data = [1200, 1900, 3000, 5000, 2000, 3000, 4500];
                break;
            case 'weekly':
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                data = [8500, 9200, 7800, 10500];
                break;
            case 'monthly':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                data = [25000, 32000, 28000, 41000, 35000, 48000];
                break;
        }
        
        revenueChart.data.labels = labels;
        revenueChart.data.datasets[0].data = data;
        revenueChart.update();
    }
    
    // Update ticket chart based on filter
    function updateTicketChart(filter) {
        let labels, data;
        
        switch(filter) {
            case 'daily':
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                data = [65, 59, 80, 81, 56, 55, 40];
                break;
            case 'weekly':
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                data = [350, 420, 380, 450];
                break;
            case 'monthly':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                data = [1250, 1480, 1320, 1650, 1420, 1780];
                break;
        }
        
        ticketSalesChart.data.labels = labels;
        ticketSalesChart.data.datasets[0].data = data;
        ticketSalesChart.update();
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
        
        // Export button
        exportBtn.addEventListener('click', function() {
            exportModal.classList.add('active');
        });
        
        // Date range change
        dateRange.addEventListener('change', function() {
            const range = this.value;
            if (range === 'custom') {
                showNotification('Custom date range selector coming soon!');
                // In a real app, this would show a date picker
            } else {
                showNotification(`Analytics updated for ${this.options[this.selectedIndex].text}`);
                updateChartsForDateRange(range);
            }
        });
        
        // Chart filters
        revenueChartFilter.addEventListener('change', function() {
            updateRevenueChart(this.value);
        });
        
        ticketChartFilter.addEventListener('change', function() {
            updateTicketChart(this.value);
        });
        
        // Export modal
        closeExportModal.addEventListener('click', function() {
            exportModal.classList.remove('active');
        });
        
        cancelExportBtn.addEventListener('click', function() {
            exportModal.classList.remove('active');
        });
        
        exportModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
        
        // Export form submission
        exportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            exportData();
        });
        
        // View all links
        document.querySelectorAll('.view-all').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Detailed analytics view coming soon!');
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', handleResize);
        
        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
                if (exportModal.classList.contains('active')) {
                    exportModal.classList.remove('active');
                }
            }
        });
    }
    
    // Update charts for date range
    function updateChartsForDateRange(range) {
        // In a real app, this would fetch new data from API
        // For now, we'll just show a notification and update the charts with dummy data
        
        let revenueData, ticketData;
        
        switch(range) {
            case '7d':
                revenueData = [800, 1200, 1500, 2000, 1800, 2200, 2500];
                ticketData = [40, 55, 65, 70, 60, 75, 80];
                break;
            case '30d':
                revenueData = [1200, 1900, 3000, 5000, 2000, 3000, 4500];
                ticketData = [65, 59, 80, 81, 56, 55, 40];
                break;
            case '90d':
                revenueData = [4500, 5200, 4800, 6100, 5500, 6800, 7200];
                ticketData = [85, 79, 95, 91, 86, 90, 95];
                break;
            case '1y':
                revenueData = [8500, 9200, 8800, 10100, 9500, 10800, 11200];
                ticketData = [105, 99, 115, 111, 106, 110, 115];
                break;
        }
        
        // Update charts
        if (revenueChart) {
            revenueChart.data.datasets[0].data = revenueData;
            revenueChart.update();
        }
        
        if (ticketSalesChart) {
            ticketSalesChart.data.datasets[0].data = ticketData;
            ticketSalesChart.update();
        }
    }
    
    // Export data
    function exportData() {
        const format = document.getElementById('exportFormat').value;
        const dateRange = document.getElementById('exportDateRange').value;
        const email = document.getElementById('exportEmail').value;
        
        // Get selected data types
        const selectedData = Array.from(document.querySelectorAll('input[name="exportData"]:checked'))
            .map(input => input.value);
        
        if (selectedData.length === 0) {
            showNotification('Please select at least one data type to export', 'error');
            return;
        }
        
        // Simulate export process
        exportSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
        exportSubmitBtn.disabled = true;
        
        setTimeout(() => {
            exportSubmitBtn.innerHTML = '<i class="fas fa-check"></i> Exported!';
            
            if (email) {
                showNotification(`Export link has been sent to ${email}`);
            } else {
                showNotification(`Analytics data exported as ${format.toUpperCase()}`);
            }
            
            // Close modal after delay
            setTimeout(() => {
                exportModal.classList.remove('active');
                exportSubmitBtn.innerHTML = '<i class="fas fa-download"></i> Export Data';
                exportSubmitBtn.disabled = false;
                exportForm.reset();
            }, 1500);
        }, 2000);
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
        
        // Update charts on resize
        if (revenueChart) revenueChart.resize();
        if (ticketSalesChart) ticketSalesChart.resize();
        if (categoryChart) categoryChart.resize();
        if (ageChart) ageChart.resize();
        if (genderChart) genderChart.resize();
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
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
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
                    border-left-color: var(--success-color);
                }
                
                .notification-toast.error {
                    border-left-color: var(--danger-color);
                }
                
                .notification-toast i {
                    font-size: 18px;
                }
                
                .notification-toast.success i {
                    color: var(--success-color);
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
    
    // Initialize analytics
    initAnalytics();
    handleResize();
});