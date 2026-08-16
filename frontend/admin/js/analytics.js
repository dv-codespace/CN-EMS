// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const currentDate = document.getElementById('currentDate');
    const refreshAnalyticsBtn = document.getElementById('refreshAnalyticsBtn');
    const exportAnalyticsBtn = document.getElementById('exportAnalyticsBtn');
    const timeRange = document.getElementById('timeRange');
    const lastUpdateTime = document.getElementById('lastUpdateTime');
    
    // Chart controls
    const userGrowthMetric = document.getElementById('userGrowthMetric');
    const userGrowthPeriod = document.getElementById('userGrowthPeriod');
    const eventCategoryPeriod = document.getElementById('eventCategoryPeriod');
    const performancePeriod = document.getElementById('performancePeriod');
    const revenueMetric = document.getElementById('revenueMetric');
    const revenuePeriod = document.getElementById('revenuePeriod');
    const geoMetric = document.getElementById('geoMetric');
    const devicePeriod = document.getElementById('devicePeriod');
    const apiPeriod = document.getElementById('apiPeriod');
    
    // Action buttons
    const generateReportBtn = document.getElementById('generateReportBtn');
    const exportCSVBtn = document.getElementById('exportCSVBtn');
    const scheduleReportBtn = document.getElementById('scheduleReportBtn');
    
    // Chart containers
    const userGrowthChart = document.getElementById('userGrowthChart');
    const revenueTrendChart = document.getElementById('revenueTrendChart');
    
    // Initialize analytics page
    function initAnalyticsPage() {
        // Update date display
        updateDateDisplay();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize charts
        initCharts();
        
        // Update date every minute
        setInterval(updateDateDisplay, 60000);
        
        // Simulate real-time updates for analytics
        simulateAnalyticsUpdates();
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
        
        // Update last updated time
        lastUpdateTime.textContent = now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});
    }
    
    // Initialize charts
    function initCharts() {
        // User Growth Chart
        createUserGrowthChart();
        
        // Event Categories Chart
        createEventCategoriesChart();
        
        // Revenue Trend Chart
        createRevenueTrendChart();
    }
    
    // Create User Growth Chart
    function createUserGrowthChart() {
        const chartBars = userGrowthChart.querySelector('.chart-bars');
        chartBars.innerHTML = '';
        
        // Generate sample data based on selected period
        const period = userGrowthPeriod.value;
        let days = 7;
        
        switch(period) {
            case '7d':
                days = 7;
                break;
            case '30d':
                days = 30;
                break;
            case '90d':
                days = 90;
                break;
            case '1y':
                days = 365;
                // For yearly view, show months instead of days
                createMonthlyUserGrowth();
                return;
        }
        
        // Create bars for each day
        for (let i = days; i > 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            // Generate random data
            const totalUsers = Math.floor(Math.random() * 100) + 100;
            const newUsers = Math.floor(Math.random() * 30) + 10;
            
            const barGroup = document.createElement('div');
            barGroup.className = 'chart-bar-group';
            barGroup.innerHTML = `
                <div class="bar-label">${dayLabel}</div>
                <div class="bar-container">
                    <div class="bar total" style="height: ${totalUsers}%;"></div>
                    <div class="bar new" style="height: ${newUsers}%; bottom: ${totalUsers - newUsers}%;"></div>
                </div>
                <div class="bar-value">${totalUsers}</div>
            `;
            
            chartBars.appendChild(barGroup);
        }
        
        // Add styles for stacked bars
        const style = document.createElement('style');
        style.textContent = `
            .bar.total { background: var(--admin-color); opacity: 0.8; }
            .bar.new { background: var(--success-color); position: absolute; width: 100%; }
            .bar-container { position: relative; }
        `;
        chartBars.appendChild(style);
    }
    
    // Create Monthly User Growth
    function createMonthlyUserGrowth() {
        const chartBars = userGrowthChart.querySelector('.chart-bars');
        chartBars.innerHTML = '';
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        months.forEach((month, index) => {
            // Generate random data
            const totalUsers = Math.floor(Math.random() * 500) + 500;
            const newUsers = Math.floor(Math.random() * 150) + 50;
            
            const barGroup = document.createElement('div');
            barGroup.className = 'chart-bar-group';
            barGroup.innerHTML = `
                <div class="bar-label">${month}</div>
                <div class="bar-container">
                    <div class="bar total" style="height: ${totalUsers / 10}%;"></div>
                    <div class="bar new" style="height: ${newUsers / 10}%; bottom: ${(totalUsers - newUsers) / 10}%;"></div>
                </div>
                <div class="bar-value">${totalUsers}</div>
            `;
            
            chartBars.appendChild(barGroup);
        });
    }
    
    // Create Event Categories Chart
    function createEventCategoriesChart() {
        const pieLegend = document.querySelector('.pie-legend');
        const pieSegments = document.querySelectorAll('.pie-segment');
        
        pieLegend.innerHTML = '';
        
        pieSegments.forEach(segment => {
            const category = segment.dataset.category;
            const value = segment.dataset.value;
            const color = getComputedStyle(segment).getPropertyValue('--color');
            
            const legendItem = document.createElement('div');
            legendItem.className = 'pie-legend-item';
            legendItem.innerHTML = `
                <span class="pie-legend-color" style="background: ${color}"></span>
                <span class="pie-legend-label">${category}</span>
                <span class="pie-legend-value">${value}%</span>
            `;
            
            pieLegend.appendChild(legendItem);
        });
    }
    
    // Create Revenue Trend Chart
    function createRevenueTrendChart() {
        const lineChart = revenueTrendChart.querySelector('.line-chart');
        lineChart.innerHTML = '';
        
        // Create grid
        const grid = document.createElement('div');
        grid.className = 'line-chart-grid';
        
        for (let i = 0; i < 50; i++) {
            const gridLine = document.createElement('div');
            gridLine.className = 'grid-line';
            grid.appendChild(gridLine);
        }
        
        lineChart.appendChild(grid);
        
        // Create line path (simplified version - in real app, use a charting library)
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.style.width = '100%';
        svg.style.height = '100%';
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', generateRandomLinePath());
        path.setAttribute('class', 'line-path');
        
        svg.appendChild(path);
        lineChart.appendChild(svg);
    }
    
    // Generate random line path for revenue chart
    function generateRandomLinePath() {
        let path = 'M 0,50 ';
        const points = 20;
        const height = 100;
        
        for (let i = 1; i <= points; i++) {
            const x = (i / points) * 100;
            const y = 50 + Math.sin(i * 0.5) * 30 + Math.random() * 10 - 5;
            path += `L ${x},${y} `;
        }
        
        return path;
    }
    
    // Simulate analytics updates
    function simulateAnalyticsUpdates() {
        // Update metrics every 30 seconds
        setInterval(() => {
            // Update overview metrics randomly
            const metrics = document.querySelectorAll('.metric-value');
            metrics.forEach(metric => {
                const currentValue = metric.textContent;
                const isCurrency = currentValue.includes('$');
                const isPercentage = currentValue.includes('%');
                
                if (!isCurrency && !isPercentage && !isNaN(parseInt(currentValue.replace(/,/g, '')))) {
                    const numericValue = parseInt(currentValue.replace(/,/g, ''));
                    const change = Math.floor(Math.random() * 10) - 2;
                    const newValue = Math.max(1, numericValue + change);
                    metric.textContent = newValue.toLocaleString();
                } else if (isPercentage) {
                    const numericValue = parseFloat(currentValue.replace('%', ''));
                    const change = Math.random() * 2 - 1;
                    const newValue = Math.max(0.1, Math.min(100, numericValue + change));
                    metric.textContent = newValue.toFixed(1) + '%';
                }
            });
            
            // Update last updated time
            const now = new Date();
            lastUpdateTime.textContent = now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});
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
        
        // Refresh analytics button
        refreshAnalyticsBtn.addEventListener('click', function() {
            showToast('Refreshing analytics data...', 'info');
            
            // Simulate refresh
            setTimeout(() => {
                initCharts();
                showToast('Analytics data refreshed successfully!');
                
                // Update last updated time
                const now = new Date();
                lastUpdateTime.textContent = now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});
            }, 1000);
        });
        
        // Export analytics button
        exportAnalyticsBtn.addEventListener('click', function() {
            showToast('Exporting analytics data...', 'info');
            
            // Simulate export
            setTimeout(() => {
                showToast('Analytics data exported successfully!');
            }, 1500);
        });
        
        // Time range selector
        timeRange.addEventListener('change', function() {
            if (this.value === 'custom') {
                // In real app, show custom date picker
                showToast('Custom date range selection would open here', 'info');
                // Reset to previous value
                setTimeout(() => {
                    this.value = 'week';
                }, 100);
            } else {
                showToast(`Showing analytics for ${this.value}`, 'info');
                // Refresh charts with new time range
                initCharts();
            }
        });
        
        // Chart control changes
        userGrowthMetric.addEventListener('change', function() {
            showToast(`User growth metric changed to ${this.value}`, 'info');
            createUserGrowthChart();
        });
        
        userGrowthPeriod.addEventListener('change', function() {
            showToast(`User growth period changed to ${this.value}`, 'info');
            createUserGrowthChart();
        });
        
        eventCategoryPeriod.addEventListener('change', function() {
            showToast(`Event category period changed to ${this.value}`, 'info');
            // In real app, update chart data
        });
        
        performancePeriod.addEventListener('change', function() {
            showToast(`Performance period changed to ${this.value}`, 'info');
            // In real app, update performance metrics
        });
        
        revenueMetric.addEventListener('change', function() {
            showToast(`Revenue metric changed to ${this.value}`, 'info');
            createRevenueTrendChart();
        });
        
        revenuePeriod.addEventListener('change', function() {
            showToast(`Revenue period changed to ${this.value}`, 'info');
            createRevenueTrendChart();
        });
        
        geoMetric.addEventListener('change', function() {
            showToast(`Geographic metric changed to ${this.value}`, 'info');
            // In real app, update geographic data
        });
        
        devicePeriod.addEventListener('change', function() {
            showToast(`Device period changed to ${this.value}`, 'info');
            // In real app, update device data
        });
        
        apiPeriod.addEventListener('change', function() {
            showToast(`API period changed to ${this.value}`, 'info');
            // In real app, update API data
        });
        
        // Action buttons
        generateReportBtn.addEventListener('click', function() {
            showToast('Generating PDF report...', 'info');
            
            // Simulate report generation
            setTimeout(() => {
                showToast('PDF report generated successfully!');
            }, 2000);
        });
        
        exportCSVBtn.addEventListener('click', function() {
            showToast('Exporting CSV data...', 'info');
            
            // Simulate CSV export
            setTimeout(() => {
                showToast('CSV data exported successfully!');
            }, 1500);
        });
        
        scheduleReportBtn.addEventListener('click', function() {
            showToast('Opening report scheduling...', 'info');
            
            // In real app, open scheduling modal
            setTimeout(() => {
                showToast('Report scheduling feature would open here', 'info');
            }, 500);
        });
        
        // Search functionality
        const analyticsSearch = document.getElementById('analyticsSearch');
        analyticsSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                showToast(`Searching analytics for "${this.value}"...`, 'info');
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
        
        // Escape key to close sidebar on mobile
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }
    
    // Initialize the analytics page
    initAnalyticsPage();
});