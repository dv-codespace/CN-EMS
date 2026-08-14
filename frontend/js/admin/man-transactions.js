// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const currentDate = document.getElementById('currentDate');
    const refreshTransactionsBtn = document.getElementById('refreshTransactionsBtn');
    const exportTransactionsBtn = document.getElementById('exportTransactionsBtn');
    const issueRefundBtn = document.getElementById('issueRefundBtn');
    const transactionsSearch = document.getElementById('transactionsSearch');
    
    // Filters
    const dateRange = document.getElementById('dateRange');
    const customDates = document.getElementById('customDates');
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const paymentMethodFilter = document.getElementById('paymentMethodFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    
    // Table elements
    const transactionsTable = document.getElementById('transactionsTable');
    const selectAll = document.getElementById('selectAll');
    const selectRows = document.querySelectorAll('.select-row');
    const itemsPerPage = document.getElementById('itemsPerPage');
    const visibleCount = document.getElementById('visibleCount');
    const totalCount = document.getElementById('totalCount');
    
    // Bulk actions
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.getElementById('selectedCount');
    const bulkExportBtn = document.getElementById('bulkExportBtn');
    const bulkRefundBtn = document.getElementById('bulkRefundBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    
    // Details sidebar
    const detailsSidebar = document.getElementById('detailsSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const viewButtons = document.querySelectorAll('.view-btn');
    const refundButtons = document.querySelectorAll('.refund-btn');
    
    // Refund modal
    const refundModal = document.getElementById('refundModal');
    const closeRefundModal = document.getElementById('closeRefundModal');
    const cancelRefundBtn = document.getElementById('cancelRefundBtn');
    const refundForm = document.getElementById('refundForm');
    const refundType = document.getElementById('refundType');
    const partialAmountGroup = document.getElementById('partialAmountGroup');
    const refundAmountInput = document.getElementById('refundAmountInput');
    const summaryRefundAmount = document.getElementById('summaryRefundAmount');
    const summaryTotal = document.getElementById('summaryTotal');
    
    // Transaction details elements
    const detailId = document.getElementById('detailId');
    const detailDateTime = document.getElementById('detailDateTime');
    const detailStatus = document.getElementById('detailStatus');
    const detailType = document.getElementById('detailType');
    const detailUserName = document.getElementById('detailUserName');
    const detailUserEmail = document.getElementById('detailUserEmail');
    const detailEventName = document.getElementById('detailEventName');
    const detailEventOrganizer = document.getElementById('detailEventOrganizer');
    const detailAmount = document.getElementById('detailAmount');
    const detailPaymentMethod = document.getElementById('detailPaymentMethod');
    const refundTransactionBtn = document.getElementById('refundTransactionBtn');
    const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');
    const voidTransactionBtn = document.getElementById('voidTransactionBtn');
    
    // State variables
    let transactions = [];
    let selectedTransactions = new Set();
    let currentTransactionId = null;
    
    // Initialize transactions page
    function initTransactionsPage() {
        // Update date display
        updateDateDisplay();
        
        // Set default dates
        setDefaultDates();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize transaction data
        initTransactionData();
        
        // Initialize DataTable
        initDataTable();
        
        // Update date every minute
        setInterval(updateDateDisplay, 60000);
        
        // Simulate transaction updates
        simulateTransactionUpdates();
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
    
    // Set default dates for filters
    function setDefaultDates() {
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        
        dateFrom.valueAsDate = lastWeek;
        dateTo.valueAsDate = today;
    }
    
    // Initialize transaction data
    function initTransactionData() {
        transactions = [
            {
                id: 'TXN-7845-2024',
                date: 'Oct 15, 2024',
                time: '14:30:22',
                user: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    avatar: 'JohnDoe'
                },
                event: {
                    name: 'Tech Summit 2024',
                    organizer: 'TechCorp Events'
                },
                amount: 125.00,
                fee: 12.50,
                status: 'successful',
                type: 'ticket',
                paymentMethod: 'credit_card',
                cardLast4: '4582',
                cardBrand: 'visa'
            },
            {
                id: 'TXN-7844-2024',
                date: 'Oct 15, 2024',
                time: '13:45:18',
                user: {
                    name: 'Sarah Smith',
                    email: 'sarah@example.com',
                    avatar: 'SarahSmith'
                },
                event: {
                    name: 'Music Festival',
                    organizer: 'MusicPro Events'
                },
                amount: 89.99,
                fee: 8.99,
                status: 'pending',
                type: 'ticket',
                paymentMethod: 'paypal',
                cardLast4: '',
                cardBrand: 'paypal'
            },
            {
                id: 'TXN-7843-2024',
                date: 'Oct 15, 2024',
                time: '12:15:42',
                user: {
                    name: 'Mike Chen',
                    email: 'mike@example.com',
                    avatar: 'MikeChen'
                },
                event: {
                    name: 'Business Conference',
                    organizer: 'StartupHub'
                },
                amount: 75.00,
                fee: 7.50,
                status: 'refunded',
                type: 'ticket',
                paymentMethod: 'bank_transfer',
                cardLast4: '',
                cardBrand: 'bank'
            },
            {
                id: 'TXN-7842-2024',
                date: 'Oct 15, 2024',
                time: '11:30:15',
                user: {
                    name: 'Emma Wilson',
                    email: 'emma@example.com',
                    avatar: 'EmmaWilson'
                },
                event: {
                    name: 'Art Exhibition',
                    organizer: 'Art Gallery Inc.'
                },
                amount: 45.00,
                fee: 4.50,
                status: 'failed',
                type: 'ticket',
                paymentMethod: 'credit_card',
                cardLast4: '7845',
                cardBrand: 'mastercard'
            },
            {
                id: 'TXN-7841-2024',
                date: 'Oct 14, 2024',
                time: '16:20:33',
                user: {
                    name: 'David Brown',
                    email: 'david@example.com',
                    avatar: 'DavidBrown'
                },
                event: {
                    name: 'Workshop Pro Series',
                    organizer: 'Workshop Pro'
                },
                amount: 199.99,
                fee: 19.99,
                status: 'successful',
                type: 'ticket',
                paymentMethod: 'wallet',
                cardLast4: '',
                cardBrand: 'google'
            },
            {
                id: 'TXN-7840-2024',
                date: 'Oct 14, 2024',
                time: '15:10:28',
                user: {
                    name: 'Lisa Taylor',
                    email: 'lisa@example.com',
                    avatar: 'LisaTaylor'
                },
                event: {
                    name: 'Food Festival',
                    organizer: 'Foodie Events'
                },
                amount: 65.00,
                fee: 6.50,
                status: 'disputed',
                type: 'ticket',
                paymentMethod: 'credit_card',
                cardLast4: '1234',
                cardBrand: 'amex'
            }
        ];
    }
    
    // Initialize DataTable
    function initDataTable() {
        // In a real app, you would use DataTables plugin
        // For now, we'll handle basic functionality manually
        
        // Update visible count
        const visibleRows = transactionsTable.querySelectorAll('tbody tr:not([style*="display: none"])').length;
        visibleCount.textContent = visibleRows;
        totalCount.textContent = '2,847'; // Total transactions
    }
    
    // Filter transactions
    function filterTransactions() {
        const selectedStatus = Array.from(statusFilter.selectedOptions).map(opt => opt.value);
        const selectedTypes = Array.from(typeFilter.selectedOptions).map(opt => opt.value);
        const selectedMethods = Array.from(paymentMethodFilter.selectedOptions).map(opt => opt.value);
        
        const rows = transactionsTable.querySelectorAll('tbody tr');
        let visibleCount = 0;
        
        rows.forEach(row => {
            const status = row.dataset.status;
            const type = 'ticket'; // In real app, this would come from data attribute
            const paymentMethod = 'credit_card'; // In real app, this would come from data attribute
            
            const statusMatch = selectedStatus.length === 0 || selectedStatus.includes(status);
            const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(type);
            const methodMatch = selectedMethods.length === 0 || selectedMethods.includes(paymentMethod);
            
            if (statusMatch && typeMatch && methodMatch) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        // Update visible count
        updateVisibleCount(visibleCount);
    }
    
    // Update visible count
    function updateVisibleCount(count) {
        visibleCount.textContent = count;
    }
    
    // Update bulk actions
    function updateBulkActions() {
        const selectedCountValue = selectedTransactions.size;
        
        if (selectedCountValue > 0) {
            bulkActions.style.display = 'flex';
            selectedCount.textContent = selectedCountValue;
        } else {
            bulkActions.style.display = 'none';
        }
    }
    
    // Show transaction details
    function showTransactionDetails(transactionId) {
        // Find transaction
        const transaction = transactions.find(t => t.id === transactionId);
        if (!transaction) return;
        
        currentTransactionId = transactionId;
        
        // Update details
        detailId.textContent = transaction.id;
        detailDateTime.textContent = `${transaction.date} ${transaction.time}`;
        detailStatus.textContent = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);
        detailStatus.className = `status-badge ${transaction.status}`;
        detailType.textContent = 'Ticket Purchase';
        detailUserName.textContent = transaction.user.name;
        detailUserEmail.textContent = transaction.user.email;
        detailEventName.textContent = transaction.event.name;
        detailEventOrganizer.textContent = transaction.event.organizer;
        detailAmount.textContent = `$${transaction.amount.toFixed(2)}`;
        
        // Update payment method
        let paymentMethodIcon = 'fas fa-credit-card';
        let paymentMethodText = 'Credit Card';
        
        switch(transaction.paymentMethod) {
            case 'paypal':
                paymentMethodIcon = 'fab fa-paypal';
                paymentMethodText = 'PayPal';
                break;
            case 'bank_transfer':
                paymentMethodIcon = 'fas fa-university';
                paymentMethodText = 'Bank Transfer';
                break;
            case 'wallet':
                paymentMethodIcon = 'fab fa-google-wallet';
                paymentMethodText = 'Google Pay';
                break;
            case 'credit_card':
                if (transaction.cardBrand === 'visa') {
                    paymentMethodIcon = 'fab fa-cc-visa';
                    paymentMethodText = `Visa •••• ${transaction.cardLast4}`;
                } else if (transaction.cardBrand === 'mastercard') {
                    paymentMethodIcon = 'fab fa-cc-mastercard';
                    paymentMethodText = `Mastercard •••• ${transaction.cardLast4}`;
                } else if (transaction.cardBrand === 'amex') {
                    paymentMethodIcon = 'fab fa-cc-amex';
                    paymentMethodText = `Amex •••• ${transaction.cardLast4}`;
                }
                break;
        }
        
        detailPaymentMethod.innerHTML = `<i class="${paymentMethodIcon}"></i> ${paymentMethodText}`;
        
        // Show sidebar
        detailsSidebar.style.display = 'flex';
        
        // Update refund modal details
        document.getElementById('refundTxnId').textContent = transaction.id;
        document.getElementById('refundAmount').textContent = `$${transaction.amount.toFixed(2)}`;
        document.getElementById('refundCustomer').textContent = transaction.user.name;
        document.getElementById('summaryRefundAmount').textContent = `$${transaction.amount.toFixed(2)}`;
        document.getElementById('summaryFee').textContent = `$${transaction.fee.toFixed(2)}`;
        document.getElementById('summaryTotal').textContent = `$${(transaction.amount + transaction.fee).toFixed(2)}`;
        
        // Set max amount for partial refund
        refundAmountInput.max = transaction.amount;
        refundAmountInput.value = transaction.amount;
    }
    
    // Show refund modal
    function showRefundModal(transactionId = null) {
        if (transactionId) {
            // Show for specific transaction
            const transaction = transactions.find(t => t.id === transactionId);
            if (transaction) {
                document.getElementById('refundTxnId').textContent = transaction.id;
                document.getElementById('refundAmount').textContent = `$${transaction.amount.toFixed(2)}`;
                document.getElementById('refundCustomer').textContent = transaction.user.name;
                refundAmountInput.max = transaction.amount;
                refundAmountInput.value = transaction.amount;
            }
        }
        
        refundModal.classList.add('active');
    }
    
    // Process refund
    function processRefund(transactionId, amount, reason) {
        // Find transaction
        const index = transactions.findIndex(t => t.id === transactionId);
        if (index === -1) return;
        
        // Update transaction status
        transactions[index].status = 'refunded';
        
        // Update table row
        const row = document.querySelector(`tr[data-transaction-id="${transactionId}"]`);
        if (row) {
            row.dataset.status = 'refunded';
            row.querySelector('.status-badge').textContent = 'Refunded';
            row.querySelector('.status-badge').className = 'status-badge refunded';
            row.querySelector('.transaction-amount').classList.add('refunded');
            row.querySelector('.transaction-amount .amount').textContent = `-$${amount.toFixed(2)}`;
        }
        
        // Show success message
        showToast(`Refund of $${amount.toFixed(2)} processed successfully!`);
    }
    
    // Simulate transaction updates
    function simulateTransactionUpdates() {
        // Update pending transactions every 30 seconds
        setInterval(() => {
            const pendingRows = document.querySelectorAll('tr[data-status="pending"]');
            if (pendingRows.length > 0) {
                const randomRow = pendingRows[Math.floor(Math.random() * pendingRows.length)];
                const transactionId = randomRow.querySelector('.transaction-id span').textContent;
                
                // Find transaction
                const index = transactions.findIndex(t => t.id === transactionId);
                if (index !== -1 && Math.random() > 0.3) { // 70% chance of success
                    // Update to successful
                    transactions[index].status = 'successful';
                    randomRow.dataset.status = 'successful';
                    
                    const statusBadge = randomRow.querySelector('.status-badge');
                    statusBadge.textContent = 'Successful';
                    statusBadge.className = 'status-badge success';
                    
                    // Update actions
                    const actions = randomRow.querySelector('.table-actions');
                    actions.innerHTML = `
                        <button class="action-icon view-btn" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-icon refund-btn" title="Issue Refund">
                            <i class="fas fa-undo"></i>
                        </button>
                        <button class="action-icon download-btn" title="Download Receipt">
                            <i class="fas fa-download"></i>
                        </button>
                    `;
                    
                    // Reattach event listeners
                    attachRowEventListeners(randomRow);
                    
                    // Show notification
                    showToast(`Transaction ${transactionId} completed successfully`, 'success');
                }
            }
        }, 30000);
    }
    
    // Attach event listeners to table rows
    function attachRowEventListeners(row) {
        // View button
        const viewBtn = row.querySelector('.view-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const transactionId = row.querySelector('.transaction-id span').textContent;
                showTransactionDetails(transactionId);
            });
        }
        
        // Refund button
        const refundBtn = row.querySelector('.refund-btn');
        if (refundBtn) {
            refundBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const transactionId = row.querySelector('.transaction-id span').textContent;
                showRefundModal(transactionId);
            });
        }
        
        // Download button
        const downloadBtn = row.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const transactionId = row.querySelector('.transaction-id span').textContent;
                showToast(`Downloading receipt for ${transactionId}...`, 'info');
            });
        }
        
        // Cancel button
        const cancelBtn = row.querySelector('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const transactionId = row.querySelector('.transaction-id span').textContent;
                
                if (confirm(`Cancel transaction ${transactionId}?`)) {
                    row.style.opacity = '0.5';
                    row.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        row.remove();
                        updateVisibleCount(transactionsTable.querySelectorAll('tbody tr:not([style*="display: none"])').length);
                        showToast(`Transaction ${transactionId} cancelled`, 'warning');
                    }, 300);
                }
            });
        }
        
        // Retry button
        const retryBtn = row.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const transactionId = row.querySelector('.transaction-id span').textContent;
                showToast(`Retrying payment for ${transactionId}...`, 'info');
                
                // Simulate retry
                setTimeout(() => {
                    row.dataset.status = 'successful';
                    row.querySelector('.status-badge').textContent = 'Successful';
                    row.querySelector('.status-badge').className = 'status-badge success';
                    
                    // Update actions
                    const actions = row.querySelector('.table-actions');
                    actions.innerHTML = `
                        <button class="action-icon view-btn" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-icon refund-btn" title="Issue Refund">
                            <i class="fas fa-undo"></i>
                        </button>
                        <button class="action-icon download-btn" title="Download Receipt">
                            <i class="fas fa-download"></i>
                        </button>
                    `;
                    
                    // Reattach event listeners
                    attachRowEventListeners(row);
                    
                    showToast(`Payment for ${transactionId} succeeded!`, 'success');
                }, 2000);
            });
        }
        
        // Resolve button
        const resolveBtn = row.querySelector('.resolve-btn');
        if (resolveBtn) {
            resolveBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const transactionId = row.querySelector('.transaction-id span').textContent;
                showToast(`Resolving dispute for ${transactionId}...`, 'info');
            });
        }
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
        
        // Refresh transactions button
        refreshTransactionsBtn.addEventListener('click', function() {
            showToast('Refreshing transactions...', 'info');
            
            // Simulate refresh
            setTimeout(() => {
                initDataTable();
                showToast('Transactions refreshed successfully!');
            }, 1000);
        });
        
        // Export transactions button
        exportTransactionsBtn.addEventListener('click', function() {
            showToast('Exporting transactions...', 'info');
            
            // Simulate export
            setTimeout(() => {
                showToast('Transactions exported successfully!');
            }, 1500);
        });
        
        // Issue refund button
        issueRefundBtn.addEventListener('click', function() {
            showRefundModal();
        });
        
        // Date range selector
        dateRange.addEventListener('change', function() {
            if (this.value === 'custom') {
                customDates.style.display = 'flex';
            } else {
                customDates.style.display = 'none';
            }
        });
        
        // Apply filters button
        applyFiltersBtn.addEventListener('click', function() {
            filterTransactions();
            showToast('Filters applied successfully', 'success');
        });
        
        // Clear filters button
        clearFiltersBtn.addEventListener('click', function() {
            // Reset all filters
            dateRange.value = 'week';
            customDates.style.display = 'none';
            
            Array.from(statusFilter.options).forEach(option => {
                option.selected = option.value === 'successful';
            });
            
            Array.from(typeFilter.options).forEach(option => {
                option.selected = option.value === 'ticket';
            });
            
            Array.from(paymentMethodFilter.options).forEach(option => {
                option.selected = option.value === 'credit_card';
            });
            
            // Show all rows
            const rows = transactionsTable.querySelectorAll('tbody tr');
            rows.forEach(row => {
                row.style.display = '';
            });
            
            // Update visible count
            updateVisibleCount(rows.length);
            
            showToast('All filters cleared', 'info');
        });
        
        // Select all checkbox
        selectAll.addEventListener('change', function() {
            const isChecked = this.checked;
            selectRows.forEach(checkbox => {
                checkbox.checked = isChecked;
                
                const row = checkbox.closest('tr');
                const transactionId = row.querySelector('.transaction-id span').textContent;
                
                if (isChecked) {
                    selectedTransactions.add(transactionId);
                } else {
                    selectedTransactions.delete(transactionId);
                }
            });
            
            updateBulkActions();
        });
        
        // Individual row checkboxes
        selectRows.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const row = this.closest('tr');
                const transactionId = row.querySelector('.transaction-id span').textContent;
                
                if (this.checked) {
                    selectedTransactions.add(transactionId);
                } else {
                    selectedTransactions.delete(transactionId);
                    selectAll.checked = false;
                }
                
                updateBulkActions();
            });
        });
        
        // Items per page selector
        itemsPerPage.addEventListener('change', function() {
            showToast(`Showing ${this.value} transactions per page`, 'info');
        });
        
        // Bulk export button
        bulkExportBtn.addEventListener('click', function() {
            if (selectedTransactions.size > 0) {
                showToast(`Exporting ${selectedTransactions.size} selected transactions...`, 'info');
                
                // Clear selection
                selectedTransactions.clear();
                selectAll.checked = false;
                selectRows.forEach(checkbox => {
                    checkbox.checked = false;
                });
                updateBulkActions();
            }
        });
        
        // Bulk refund button
        bulkRefundBtn.addEventListener('click', function() {
            if (selectedTransactions.size > 0) {
                showToast(`Preparing refund for ${selectedTransactions.size} transactions...`, 'info');
                // In real app, open bulk refund modal
            }
        });
        
        // Bulk delete button
        bulkDeleteBtn.addEventListener('click', function() {
            if (selectedTransactions.size > 0) {
                if (confirm(`Delete ${selectedTransactions.size} selected transactions? This action cannot be undone.`)) {
                    showToast(`Deleting ${selectedTransactions.size} transactions...`, 'info');
                    
                    // Clear selection
                    selectedTransactions.clear();
                    selectAll.checked = false;
                    selectRows.forEach(checkbox => {
                        checkbox.checked = false;
                    });
                    updateBulkActions();
                    
                    setTimeout(() => {
                        showToast('Selected transactions deleted successfully', 'success');
                    }, 1000);
                }
            }
        });
        
        // Close sidebar button
        closeSidebar.addEventListener('click', function() {
            detailsSidebar.style.display = 'none';
            currentTransactionId = null;
        });
        
        // View transaction details buttons
        viewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const transactionId = row.querySelector('.transaction-id span').textContent;
                showTransactionDetails(transactionId);
            });
        });
        
        // Refund buttons
        refundButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const transactionId = row.querySelector('.transaction-id span').textContent;
                showRefundModal(transactionId);
            });
        });
        
        // Refund type change
        refundType.addEventListener('change', function() {
            if (this.value === 'partial') {
                partialAmountGroup.style.display = 'block';
            } else {
                partialAmountGroup.style.display = 'none';
            }
        });
        
        // Refund amount input
        refundAmountInput.addEventListener('input', function() {
            const maxAmount = parseFloat(this.max);
            const currentAmount = parseFloat(this.value) || 0;
            
            if (currentAmount > maxAmount) {
                this.value = maxAmount;
            }
            
            // Update summary
            summaryRefundAmount.textContent = `$${(parseFloat(this.value) || 0).toFixed(2)}`;
            const fee = 12.50; // In real app, this would come from transaction data
            summaryTotal.textContent = `$${((parseFloat(this.value) || 0) + fee).toFixed(2)}`;
        });
        
        // Refund form submission
        refundForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const refundTypeValue = document.getElementById('refundType').value;
            const refundReason = document.getElementById('refundReason').value;
            const refundNotes = document.getElementById('refundNotes').value;
            
            let refundAmount = 125.00; // Default from transaction
            
            if (refundTypeValue === 'partial') {
                refundAmount = parseFloat(refundAmountInput.value) || 0;
            }
            
            if (!currentTransactionId) {
                currentTransactionId = 'TXN-7845-2024'; // Default for bulk refund
            }
            
            // Process refund
            processRefund(currentTransactionId, refundAmount, refundReason);
            
            // Close modal
            refundModal.classList.remove('active');
            refundForm.reset();
            partialAmountGroup.style.display = 'none';
            
            // Close sidebar if open
            detailsSidebar.style.display = 'none';
            currentTransactionId = null;
        });
        
        // Close refund modal buttons
        closeRefundModal.addEventListener('click', function() {
            refundModal.classList.remove('active');
            refundForm.reset();
            partialAmountGroup.style.display = 'none';
        });
        
        cancelRefundBtn.addEventListener('click', function() {
            refundModal.classList.remove('active');
            refundForm.reset();
            partialAmountGroup.style.display = 'none';
        });
        
        // Sidebar action buttons
        refundTransactionBtn.addEventListener('click', function() {
            if (currentTransactionId) {
                showRefundModal(currentTransactionId);
            }
        });
        
        downloadReceiptBtn.addEventListener('click', function() {
            if (currentTransactionId) {
                showToast(`Downloading receipt for ${currentTransactionId}...`, 'info');
            }
        });
        
        voidTransactionBtn.addEventListener('click', function() {
            if (currentTransactionId) {
                if (confirm(`Void transaction ${currentTransactionId}? This action cannot be undone.`)) {
                    showToast(`Voiding transaction ${currentTransactionId}...`, 'info');
                    
                    setTimeout(() => {
                        // Update transaction status
                        const index = transactions.findIndex(t => t.id === currentTransactionId);
                        if (index !== -1) {
                            transactions[index].status = 'voided';
                        }
                        
                        // Close sidebar
                        detailsSidebar.style.display = 'none';
                        showToast(`Transaction ${currentTransactionId} voided successfully`, 'success');
                        currentTransactionId = null;
                    }, 1000);
                }
            }
        });
        
        // Search functionality
        transactionsSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                showToast(`Searching transactions for "${this.value}"...`, 'info');
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
                if (e.target.id === 'refundModal') {
                    refundForm.reset();
                    partialAmountGroup.style.display = 'none';
                }
            }
        });
        
        // Escape key to close modals and sidebar
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                refundModal.classList.remove('active');
                refundForm.reset();
                partialAmountGroup.style.display = 'none';
                
                if (detailsSidebar.style.display === 'flex') {
                    detailsSidebar.style.display = 'none';
                    currentTransactionId = null;
                }
            }
        });
        
        // Attach event listeners to all table rows
        const rows = transactionsTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            attachRowEventListeners(row);
            
            // Add transaction ID data attribute
            const transactionId = row.querySelector('.transaction-id span').textContent;
            row.setAttribute('data-transaction-id', transactionId);
        });
        
        // Pagination buttons
        document.querySelectorAll('.pagination-btn:not(:disabled)').forEach(button => {
            button.addEventListener('click', function() {
                if (!this.classList.contains('active')) {
                    document.querySelectorAll('.pagination-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');
                    showToast(`Loading page ${this.textContent}...`, 'info');
                }
            });
        });
        
        // Jump to page
        document.querySelector('.jump-btn').addEventListener('click', function() {
            const pageInput = document.querySelector('.pagination-jump input');
            const page = parseInt(pageInput.value) || 1;
            
            if (page >= 1 && page <= 50) {
                showToast(`Jumping to page ${page}...`, 'info');
                // In real app, load the page
            } else {
                showToast('Please enter a valid page number (1-50)', 'error');
            }
        });
    }
    
    // Initialize the transactions page
    initTransactionsPage();
});