const API_BASE = "http://localhost:3000";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../../auth.html";
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    const editEventId = localStorage.getItem("editEventId");

    if (editEventId) {
        loadEventForEditing(editEventId);
    }
    
    const token = localStorage.getItem("token");

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
    
        const profileName = document.getElementById("profileName");
        if (profileName) profileName.textContent = payload.name || payload.email || "User";

        const sidebarAvatar = document.querySelector(".sidebar .user-profile .avatar img");
        if (sidebarAvatar && payload.profileImage) {
            sidebarAvatar.src = payload.profileImage;
        }

    }
    
    // Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const currentDate = document.getElementById('currentDate');
    const createEventForm = document.getElementById('createEventForm');
    const previewBtn = document.getElementById('previewBtn');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const publishBtn = document.getElementById('publishBtn');
    
    // Step navigation elements
    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    
    // Form fields
    const eventTitle = document.getElementById('eventTitle');
    const eventType = document.getElementById('eventType');
    const eventCategory = document.getElementById('eventCategory');
    const eventDescription = document.getElementById('eventDescription');
    const eventImage = document.getElementById('eventImage');
    const imageUploadPlaceholder = document.getElementById('imageUploadPlaceholder');
    const imagePreview = document.getElementById('imagePreview');
    const eventTags = document.getElementById('eventTags');
    const tagsContainer = document.getElementById('tagsContainer');
    const startDate = document.getElementById('startDate');
    const startTime = document.getElementById('startTime');
    const endDate = document.getElementById('endDate');
    const endTime = document.getElementById('endTime');
    const timezone = document.getElementById('timezone');
    const eventFormat = document.getElementById('eventFormat');
    const eventLocation = document.getElementById('eventLocation');
    const capacityRange = document.getElementById('capacityRange');
    const eventCapacity = document.getElementById('eventCapacity');
    const currency = document.getElementById('currency');
    const refundPolicy = document.getElementById('refundPolicy');
    const customRefundPolicy = document.getElementById('customRefundPolicy');
    const publishOption = document.querySelectorAll('input[name="publishOption"]');
    const publishDate = document.getElementById('publishDate');
    const scheduleDate = document.getElementById('scheduleDate');
    
    // Ticket elements
    const addTicketBtn = document.getElementById('addTicketBtn');
    const ticketTypesList = document.getElementById('ticketTypesList');
    const noTickets = document.getElementById('noTickets');
    
    // Template elements
    const templateCards = document.querySelectorAll('.template-card');
    
    // Modal elements
    const previewModal = document.getElementById('previewModal');
    const closePreview = document.getElementById('closePreview');
    const previewContainer = document.getElementById('previewContainer');
    const ticketModal = document.getElementById('ticketModal');
    const ticketModalTitle = document.getElementById('ticketModalTitle');
    const ticketForm = document.getElementById('ticketForm');
    const ticketName = document.getElementById('ticketName');
    const ticketPrice = document.getElementById('ticketPrice');
    const ticketQuantity = document.getElementById('ticketQuantity');
    const ticketDescription = document.getElementById('ticketDescription');
    const saleStart = document.getElementById('saleStart');
    const saleEnd = document.getElementById('saleEnd');
    const ticketFeatured = document.getElementById('ticketFeatured');
    const closeTicketModal = document.getElementById('closeTicketModal');
    const cancelTicketBtn = document.getElementById('cancelTicketBtn');
    const saveTicketBtn = document.getElementById('saveTicketBtn');
    
    // Review elements
    const reviewTitle = document.getElementById('reviewTitle');
    const reviewType = document.getElementById('reviewType');
    const reviewCategory = document.getElementById('reviewCategory');
    const reviewDescription = document.getElementById('reviewDescription');
    const reviewDateTime = document.getElementById('reviewDateTime');
    const reviewFormat = document.getElementById('reviewFormat');
    const reviewLocation = document.getElementById('reviewLocation');
    const reviewCapacity = document.getElementById('reviewCapacity');
    const reviewTickets = document.getElementById('reviewTickets');
    const reviewRevenue = document.getElementById('reviewRevenue');
    const reviewCurrency = document.getElementById('reviewCurrency');
    
    // State variables
    let currentStep = 1;
    let tags = [];
    let ticketTypes = [];
    let editingTicketIndex = -1;
    let selectedImage = null;
    
    // Initialize the page
    function initCreateEvent() {
        // Set current date
        updateDateDisplay();
        setDefaultDates();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize form
        initializeForm();
        
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
    
    // Set default dates
    function setDefaultDates() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Format dates for date inputs
        const formatDate = (date) => date.toISOString().split('T')[0];
        const formatTime = (date) => {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        };
        
        startDate.value = formatDate(tomorrow);
        startTime.value = '09:00';
        endDate.value = formatDate(tomorrow);
        endTime.value = '17:00';
        
        // Set min date to today
        const today = formatDate(now);
        startDate.min = today;
        endDate.min = today;
    }
    
    // Initialize form
    function initializeForm() {
        // Set currency symbol based on selected currency
        updateCurrencySymbol();
        
        // Update capacity sync
        updateCapacitySync();
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
        
        // Step navigation
        steps.forEach(step => {
            step.addEventListener('click', function() {
                const stepNumber = parseInt(this.dataset.step);
                goToStep(stepNumber);
            });
        });
        
        // Next buttons
        nextBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const nextStep = parseInt(this.dataset.next);
                if (validateStep(currentStep)) {
                    goToStep(nextStep);
                }
            });
        });
        
        // Previous buttons
        prevBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const prevStep = parseInt(this.dataset.prev);
                goToStep(prevStep);
            });
        });
        
        // Image upload
        imageUploadPlaceholder.addEventListener('click', function() {
            eventImage.click();
        });
        
        eventImage.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                selectedImage = file;
                previewImage(file);
            }
        });
        
        // Tags input
        eventTags.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag(this.value.trim());
                this.value = '';
            }
        });
        
        // Event format change
        eventFormat.addEventListener('change', function() {
            updateLocationPlaceholder();
        });
        
        // Capacity sync
        capacityRange.addEventListener('input', function() {
            eventCapacity.value = this.value;
        });
        
        eventCapacity.addEventListener('input', function() {
            capacityRange.value = this.value;
        });
        
        // Currency change
        currency.addEventListener('change', updateCurrencySymbol);
        
        // Refund policy change
        refundPolicy.addEventListener('change', function() {
            customRefundPolicy.style.display = this.value === 'custom' ? 'block' : 'none';
        });
        
        // Publish options
        publishOption.forEach(option => {
            option.addEventListener('change', function() {
                scheduleDate.style.display = this.value === 'schedule' ? 'block' : 'none';
            });
        });
        
        // Ticket management
        addTicketBtn.addEventListener('click', openTicketModal);
        
        // Template cards
        templateCards.forEach(card => {
            card.addEventListener('click', function() {
                const template = this.dataset.template;
                applyTemplate(template);
            });
        });
        
        // Preview button
        previewBtn.addEventListener('click', showPreview);
        
        // Save draft button
        saveDraftBtn.addEventListener('click', saveAsDraft);
        
        // Form submission
        createEventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            publishEvent();
        });
        
        // Preview modal
        closePreview.addEventListener('click', function() {
            previewModal.classList.remove('active');
        });
        
        previewModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
        
        // Ticket modal
        closeTicketModal.addEventListener('click', function() {
            ticketModal.classList.remove('active');
            resetTicketForm();
        });
        
        cancelTicketBtn.addEventListener('click', function() {
            ticketModal.classList.remove('active');
            resetTicketForm();
        });
        
        ticketModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                resetTicketForm();
            }
        });
        
        ticketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveTicket();
        });
        
        // Handle window resize
        window.addEventListener('resize', handleResize);
        
        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
                if (previewModal.classList.contains('active')) {
                    previewModal.classList.remove('active');
                }
                if (ticketModal.classList.contains('active')) {
                    ticketModal.classList.remove('active');
                    resetTicketForm();
                }
            }
        });
        
        // Update review on step 4
        document.querySelector('[data-next="4"]').addEventListener('click', updateReview);
    }
    
    async function loadEventForEditing(eventId) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/organizer/events", {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        const data = await response.json();
        const event = data.events.find(e => e.eventId === eventId);

        if (!event) return;

        // Fill form fields
        eventTitle.value = event.title;
        eventDescription.value = event.description;
        eventCategory.value = event.category;
        eventLocation.value = event.location;

        if (event.date) {
            const parts = event.date.split(" ");
            startDate.value = parts[0] || "";
            startTime.value = parts[1] || "";
        }


    } catch (error) {
        console.error(error);
    }
}

    // Go to specific step
    function goToStep(stepNumber) {
        // Update current step
        currentStep = stepNumber;
        
        // Update step indicators
        steps.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            if (stepNum === stepNumber) {
                step.classList.add('active');
            } else if (stepNum < stepNumber) {
                step.classList.remove('active');
                step.classList.add('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        // Show/hide form steps
        formSteps.forEach(step => {
            const stepId = step.id.replace('step', '');
            if (parseInt(stepId) === stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Scroll to top of form
        document.querySelector('.create-event-container').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Validate current step
    function validateStep(step) {
        switch(step) {
            case 1:
                if (!eventTitle.value.trim()) {
                    showNotification('Please enter an event title', 'error');
                    eventTitle.focus();
                    return false;
                }
                if (!eventType.value) {
                    showNotification('Please select an event type', 'error');
                    eventType.focus();
                    return false;
                }
                if (!eventCategory.value) {
                    showNotification('Please select a category', 'error');
                    eventCategory.focus();
                    return false;
                }
                if (!eventDescription.value.trim()) {
                    showNotification('Please enter an event description', 'error');
                    eventDescription.focus();
                    return false;
                }
                return true;
                
            case 2:
                if (!startDate.value || !startTime.value) {
                    showNotification('Please select start date and time', 'error');
                    return false;
                }
                if (!eventFormat.value) {
                    showNotification('Please select event format', 'error');
                    eventFormat.focus();
                    return false;
                }
                if (!eventLocation.value.trim()) {
                    showNotification('Please enter event location', 'error');
                    eventLocation.focus();
                    return false;
                }
                return true;
                
            case 3:
                if (ticketTypes.length === 0) {
                    showNotification('Please add at least one ticket type', 'error');
                    return false;
                }
                return true;
                
            default:
                return true;
        }
    }
    
    // Update location placeholder based on format
    function updateLocationPlaceholder() {
        const format = eventFormat.value;
        switch(format) {
            case 'in-person':
                eventLocation.placeholder = 'Venue address (e.g., 123 Main St, City, State)';
                break;
            case 'virtual':
                eventLocation.placeholder = 'Meeting link (e.g., https://meet.example.com/event)';
                break;
            case 'hybrid':
                eventLocation.placeholder = 'Venue address and/or meeting link';
                break;
            default:
                eventLocation.placeholder = 'Venue name or virtual meeting link';
        }
    }
    
    // Update currency symbol
    function updateCurrencySymbol() {
        const selectedCurrency = currency.value;
        let symbol = '$';
        
        switch(selectedCurrency) {
            case 'EUR': symbol = '€'; break;
            case 'GBP': symbol = '£'; break;
            case 'INR': symbol = '₹'; break;
            case 'CAD': symbol = 'C$'; break;
            case 'AUD': symbol = 'A$'; break;
        }
        
        document.querySelector('.currency-symbol').textContent = symbol;
        
        // Update ticket prices if any
        updateTicketCurrency(symbol);
    }
    
    // Update ticket currency
    function updateTicketCurrency(symbol) {
        const ticketPrices = document.querySelectorAll('.ticket-price');
        ticketPrices.forEach(price => {
            const currentPrice = price.textContent.replace(/[^0-9.]/g, '');
            price.textContent = `${symbol}${currentPrice}`;
        });
    }
    
    // Update capacity sync
    function updateCapacitySync() {
        capacityRange.value = eventCapacity.value;
    }
    
    // Preview image
    function previewImage(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Event image preview">`;
                imagePreview.style.display = 'block';
                imageUploadPlaceholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            showNotification('Please select an image file', 'error');
        }
    }
    
    // Add tag
    function addTag(tagText) {
        if (tagText && !tags.includes(tagText.toLowerCase())) {
            tags.push(tagText.toLowerCase());
            
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.innerHTML = `
                <span>${tagText}</span>
                <span class="tag-remove" data-tag="${tagText}">
                    <i class="fas fa-times"></i>
                </span>
            `;
            
            tagsContainer.appendChild(tagElement);
            
            // Add remove event listener
            tagElement.querySelector('.tag-remove').addEventListener('click', function() {
                const tagToRemove = this.dataset.tag;
                tags = tags.filter(t => t !== tagToRemove.toLowerCase());
                tagElement.remove();
            });
        }
    }
    
    // Open ticket modal
    function openTicketModal(ticketIndex = -1) {
        editingTicketIndex = ticketIndex;
        
        if (ticketIndex >= 0) {
            // Editing existing ticket
            const ticket = ticketTypes[ticketIndex];
            ticketModalTitle.textContent = 'Edit Ticket Type';
            ticketName.value = ticket.name;
            ticketPrice.value = ticket.price;
            ticketQuantity.value = ticket.quantity || '';
            ticketDescription.value = ticket.description || '';
            saleStart.value = ticket.saleStart || '';
            saleEnd.value = ticket.saleEnd || '';
            ticketFeatured.checked = ticket.featured || false;
        } else {
            // Creating new ticket
            ticketModalTitle.textContent = 'Add Ticket Type';
            ticketForm.reset();
        }
        
        ticketModal.classList.add('active');
        ticketName.focus();
    }
    
    // Reset ticket form
    function resetTicketForm() {
        ticketForm.reset();
        editingTicketIndex = -1;
    }
    
    // Save ticket
    function saveTicket() {
        const ticketData = {
            name: ticketName.value.trim(),
            price: parseFloat(ticketPrice.value) || 0,
            quantity: ticketQuantity.value ? parseInt(ticketQuantity.value) : null,
            description: ticketDescription.value.trim(),
            saleStart: saleStart.value || null,
            saleEnd: saleEnd.value || null,
            featured: ticketFeatured.checked
        };
        
        if (!ticketData.name) {
            showNotification('Please enter a ticket name', 'error');
            ticketName.focus();
            return;
        }
        
        if (ticketData.price < 0) {
            showNotification('Price cannot be negative', 'error');
            ticketPrice.focus();
            return;
        }
        
        // Update or add ticket
        if (editingTicketIndex >= 0) {
            ticketTypes[editingTicketIndex] = ticketData;
        } else {
            ticketTypes.push(ticketData);
        }
        
        // Update UI
        updateTicketList();
        
        // Close modal and reset form
        ticketModal.classList.remove('active');
        resetTicketForm();
        
        showNotification(`Ticket "${ticketData.name}" saved successfully`);
    }
    
    // Update ticket list
    function updateTicketList() {
        ticketTypesList.innerHTML = '';
        
        if (ticketTypes.length === 0) {
            noTickets.style.display = 'block';
            return;
        }
        
        noTickets.style.display = 'none';
        
        ticketTypes.forEach((ticket, index) => {
            const ticketCard = document.createElement('div');
            ticketCard.className = `ticket-card ${ticket.featured ? 'featured' : ''}`;
            
            const currencySymbol = document.querySelector('.currency-symbol').textContent;
            const quantityText = ticket.quantity ? `${ticket.quantity} available` : 'Unlimited';
            
            ticketCard.innerHTML = `
                <div class="ticket-info">
                    <h4>${ticket.name}</h4>
                    ${ticket.description ? `<p>${ticket.description}</p>` : ''}
                    <div class="ticket-price">${currencySymbol}${ticket.price.toFixed(2)}</div>
                    <div class="ticket-quantity">${quantityText}</div>
                </div>
                <div class="ticket-actions">
                    <button class="ticket-action-btn edit" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="ticket-action-btn delete" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add event listeners
            ticketCard.querySelector('.edit').addEventListener('click', function() {
                openTicketModal(parseInt(this.dataset.index));
            });
            
            ticketCard.querySelector('.delete').addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (confirm(`Delete ticket "${ticketTypes[index].name}"?`)) {
                    ticketTypes.splice(index, 1);
                    updateTicketList();
                    showNotification('Ticket deleted');
                }
            });
            
            ticketTypesList.appendChild(ticketCard);
        });
    }
    
    // Apply template
    function applyTemplate(template) {
        switch(template) {
            case 'conference':
                eventTitle.value = 'Tech Conference 2024';
                eventType.value = 'conference';
                eventCategory.value = 'technology';
                eventDescription.value = 'Join us for the biggest tech conference of the year! Featuring industry leaders, workshops, and networking opportunities.';
                eventFormat.value = 'in-person';
                eventLocation.value = 'Convention Center, 123 Tech Street, San Francisco';
                eventCapacity.value = '500';
                showNotification('Conference template applied');
                break;
                
            case 'workshop':
                eventTitle.value = 'Web Development Workshop';
                eventType.value = 'workshop';
                eventCategory.value = 'education';
                eventDescription.value = 'Hands-on web development workshop covering HTML, CSS, JavaScript, and modern frameworks.';
                eventFormat.value = 'hybrid';
                eventLocation.value = 'Online + Tech Hub, 456 Learning Ave';
                eventCapacity.value = '50';
                showNotification('Workshop template applied');
                break;
                
            case 'meeting':
                eventTitle.value = 'Team Quarterly Meeting';
                eventType.value = 'meeting';
                eventCategory.value = 'business';
                eventDescription.value = 'Quarterly team meeting to discuss progress, goals, and strategy for the upcoming quarter.';
                eventFormat.value = 'virtual';
                eventLocation.value = 'https://meet.company.com/q1-meeting';
                eventCapacity.value = '25';
                showNotification('Meeting template applied');
                break;
                
            case 'webinar':
                eventTitle.value = 'Digital Marketing Webinar';
                eventType.value = 'webinar';
                eventCategory.value = 'business';
                eventDescription.value = 'Learn the latest digital marketing strategies and trends from industry experts.';
                eventFormat.value = 'virtual';
                eventLocation.value = 'https://webinar.marketing.com/register';
                eventCapacity.value = '1000';
                showNotification('Webinar template applied');
                break;
        }
        
        // Update capacity range
        capacityRange.value = eventCapacity.value;
        
        // Update review if on step 4
        if (currentStep === 4) {
            updateReview();
        }
    }
    
    // Update review section
    function updateReview() {
        // Basic information
        reviewTitle.textContent = eventTitle.value || '-';
        reviewType.textContent = eventType.options[eventType.selectedIndex]?.text || '-';
        reviewCategory.textContent = eventCategory.options[eventCategory.selectedIndex]?.text || '-';
        reviewDescription.textContent = eventDescription.value ? 
            (eventDescription.value.length > 100 ? 
             eventDescription.value.substring(0, 100) + '...' : 
             eventDescription.value) : '-';
        
        // Date & time
        if (startDate.value && startTime.value) {
            const start = new Date(`${startDate.value}T${startTime.value}`);
            let dateTimeText = start.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) + ' at ' + startTime.value;
            
            if (endDate.value && endTime.value) {
                const end = new Date(`${endDate.value}T${endTime.value}`);
                dateTimeText += ' to ' + endTime.value;
            }
            
            reviewDateTime.textContent = dateTimeText;
        } else {
            reviewDateTime.textContent = '-';
        }
        
        // Location
        reviewFormat.textContent = eventFormat.options[eventFormat.selectedIndex]?.text || '-';
        reviewLocation.textContent = eventLocation.value || '-';
        reviewCapacity.textContent = eventCapacity.value === '0' ? 'Unlimited' : `${eventCapacity.value} attendees`;
        
        // Tickets
        if (ticketTypes.length > 0) {
            const ticketNames = ticketTypes.map(t => t.name).join(', ');
            reviewTickets.textContent = `${ticketTypes.length} types: ${ticketNames}`;
            
            // Calculate revenue potential
            const currencySymbol = document.querySelector('.currency-symbol').textContent;
            let totalRevenue = 0;
            ticketTypes.forEach(ticket => {
                if (ticket.quantity) {
                    totalRevenue += ticket.price * ticket.quantity;
                }
            });
            reviewRevenue.textContent = `${currencySymbol}${totalRevenue.toFixed(2)}`;
        } else {
            reviewTickets.textContent = 'No tickets added';
            reviewRevenue.textContent = '$0.00';
        }
        
        reviewCurrency.textContent = currency.options[currency.selectedIndex]?.text || '-';
    }
    
    // Show preview
    function showPreview() {
        if (!validateStep(currentStep)) {
            goToStep(1);
            return;
        }
        
        const previewHTML = `
            <div class="preview-event">
                <div class="preview-header">
                    <h2>${eventTitle.value || 'Event Title'}</h2>
                    <div class="preview-meta">
                        <span class="preview-type">${eventType.options[eventType.selectedIndex]?.text || 'Event Type'}</span>
                        <span class="preview-category">${eventCategory.options[eventCategory.selectedIndex]?.text || 'Category'}</span>
                    </div>
                </div>
                
                ${selectedImage ? 
                    `<div class="preview-image">
                        <img src="${URL.createObjectURL(selectedImage)}" alt="Event preview">
                    </div>` : ''
                }
                
                <div class="preview-body">
                    <h3>Description</h3>
                    <p>${eventDescription.value || 'No description provided.'}</p>
                    
                    <div class="preview-details">
                        <div class="detail">
                            <i class="fas fa-calendar"></i>
                            <div>
                                <strong>Date & Time</strong>
                                <p>${startDate.value && startTime.value ? 
                                    new Date(`${startDate.value}T${startTime.value}`).toLocaleString() : 
                                    'Not set'}</p>
                            </div>
                        </div>
                        
                        <div class="detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <strong>Location</strong>
                                <p>${eventLocation.value || 'Not set'}</p>
                            </div>
                        </div>
                        
                        <div class="detail">
                            <i class="fas fa-users"></i>
                            <div>
                                <strong>Capacity</strong>
                                <p>${eventCapacity.value === '0' ? 'Unlimited' : eventCapacity.value + ' attendees'}</p>
                            </div>
                        </div>
                    </div>
                    
                    ${ticketTypes.length > 0 ? `
                        <h3>Tickets</h3>
                        <div class="preview-tickets">
                            ${ticketTypes.map(ticket => `
                                <div class="preview-ticket">
                                    <h4>${ticket.name}</h4>
                                    <p>${ticket.description || ''}</p>
                                    <div class="ticket-price">$${ticket.price.toFixed(2)}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${tags.length > 0 ? `
                        <h3>Tags</h3>
                        <div class="preview-tags">
                            ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        previewContainer.innerHTML = previewHTML;
        previewModal.classList.add('active');
    }
    
    // Save as draft
    async function saveAsDraft() {
    if (!validateStep(currentStep)) return;

    try {
        saveDraftBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveDraftBtn.disabled = true;

        const eventData = collectEventData("DRAFT");

        let response;
        const editEventId = localStorage.getItem("editEventId");
        const isEditing = !!editEventId;

        if (isEditing) {
            response = await fetch(`${API_BASE}/organizer/events/${editEventId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify(eventData)
            });

            localStorage.removeItem("editEventId");

        } else {
            response = await fetch(`${API_BASE}/organizer/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify(eventData)
            });
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        showNotification(
            isEditing ? "Draft updated successfully" : "Event saved as draft successfully",
            "success"
        );

    } catch (error) {
        console.error(error);
        showNotification("Failed to save draft", "error");
    } finally {
        saveDraftBtn.innerHTML = '<i class="fas fa-save"></i> Save Draft';
        saveDraftBtn.disabled = false;
    }
}
    
    // Publish event
    async function publishEvent() {
    if (!validateStep(4)) {
        goToStep(1);
        return;
    }

    try {
        publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
        publishBtn.disabled = true;

        const publishOptionValue = document.querySelector('input[name="publishOption"]:checked').value;

        let status = "PUBLISHED";
        if (publishOptionValue === "draft") {
            status = "DRAFT";
        }

        const eventData = collectEventData(status);

        let response;

        // 🔵 If editing → UPDATE
        const editEventId = localStorage.getItem("editEventId");
        const isEditing = !!editEventId;
        if (isEditing) {

            response = await fetch(`${API_BASE}/organizer/events/${editEventId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify(eventData)
            });

            localStorage.removeItem("editEventId");

        } else {

            // 🟢 If new → CREATE
            response = await fetch(`${API_BASE}/organizer/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify(eventData)
            });
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        showNotification(
            isEditing ? "Event updated successfully!" : "Event created successfully!",
            "success"
        );

        setTimeout(() => {
            window.location.href = "org-myevents.html";
        }, 1500);

    } catch (error) {
        console.error(error);
        showNotification("Failed to publish event", "error");
    } finally {
        publishBtn.innerHTML = '<i class="fas fa-rocket"></i> Publish Event';
        publishBtn.disabled = false;
    }
}


function collectEventData(status) {
    return {
        title: eventTitle.value.trim(),
        description: eventDescription.value.trim(),
        category: eventCategory.value,
        date: `${startDate.value} ${startTime.value}`,
        location: eventLocation.value.trim(),
        status: status,
        tickets: ticketTypes,
        tags: tags,
        capacity: eventCapacity.value,
        format: eventFormat.value
    };
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
    
    // Initialize the page
    initCreateEvent();
    handleResize();
});