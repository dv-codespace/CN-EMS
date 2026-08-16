// js/tickets.js - Fetch and render tickets for Attendee
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../../auth.html";
        return;
    }

    const activeList = document.getElementById("activeTicketList");
    const usedGrid = document.getElementById("usedTicketGrid");
    const activeBadge = document.getElementById("activeBadge");
    const usedBadge = document.getElementById("usedBadge");

    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const typeFilter = document.getElementById("typeFilter");
    const sortFilter = document.getElementById("sortFilter");
    const resetFilters = document.getElementById("resetFilters");

    const ticketModal = document.getElementById("ticketModal");
    const closeTicketModal = document.getElementById("closeTicketModal");
    const modalContent = document.getElementById("modalTicketContent");

    let registrations = [];

    // Fetch user registrations
    fetchRegistrations();

    async function fetchRegistrations() {
        try {
            const response = await fetch("http://localhost:3000/api/events/registrations", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                registrations = await response.json();
                renderAll();
            } else {
                console.error("Failed to fetch registrations:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching registrations:", error);
        }
    }

    function renderAll() {
        const now = new Date();

        // Apply filters
        const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const typeVal = typeFilter ? typeFilter.value.toLowerCase() : "all";
        const statusVal = statusFilter ? statusFilter.value.toLowerCase() : "all";

        let filtered = registrations.filter(reg => {
            const event = reg.event;
            if (!event) return false;

            // Search filter
            const matchesSearch = !searchVal || 
                event.title.toLowerCase().includes(searchVal) || 
                (event.description && event.description.toLowerCase().includes(searchVal)) ||
                (event.location && event.location.toLowerCase().includes(searchVal));

            // Type filter (VIP vs General Admission vs Early Bird)
            let matchesType = true;
            if (typeVal !== "all") {
                const calculatedType = event.price > 100 ? "vip" : (event.price > 50 ? "early" : "general");
                matchesType = calculatedType === typeVal;
            }

            // Status filter
            const isUpcoming = new Date(event.date) >= now;
            let matchesStatus = true;
            if (statusVal === "active" || statusVal === "upcoming") {
                matchesStatus = isUpcoming;
            } else if (statusVal === "used") {
                matchesStatus = !isUpcoming;
            }

            return matchesSearch && matchesType && matchesStatus;
        });

        // Apply sorting
        const sortVal = sortFilter ? sortFilter.value : "date-desc";
        filtered.sort((a, b) => {
            const dateA = new Date(a.event.date);
            const dateB = new Date(b.event.date);
            
            if (sortVal === "date-asc") {
                return dateA - dateB;
            } else if (sortVal === "date-desc") {
                return dateB - dateA;
            } else if (sortVal === "price") {
                return b.event.price - a.event.price;
            } else if (sortVal === "event") {
                return a.event.title.localeCompare(b.event.title);
            }
            return 0;
        });

        // Separate active vs used
        const activeTickets = filtered.filter(reg => new Date(reg.event.date) >= now);
        const usedTickets = filtered.filter(reg => new Date(reg.event.date) < now);

        // Update badges
        if (activeBadge) activeBadge.textContent = `${activeTickets.length} ticket${activeTickets.length !== 1 ? 's' : ''}`;
        if (usedBadge) usedBadge.textContent = `${usedTickets.length} ticket${usedTickets.length !== 1 ? 's' : ''}`;

        // Render Active Tickets
        if (activeList) {
            activeList.innerHTML = "";
            if (activeTickets.length === 0) {
                activeList.innerHTML = `
                    <div class="empty-state" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        <i class="fas fa-ticket-alt" style="font-size: 48px; margin-bottom: 15px; color: var(--primary-color);"></i>
                        <p>No active tickets found.</p>
                    </div>
                `;
            } else {
                activeTickets.forEach(reg => {
                    const event = reg.event;
                    const eventDate = new Date(event.date);
                    const formattedDate = eventDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                    }) + " • " + eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                    const typeStr = event.price > 100 ? "VIP Pass" : (event.price > 50 ? "Early Bird" : "General Admission");
                    const typeClass = event.price > 100 ? "vip" : (event.price > 50 ? "early" : "general");

                    let catIcon = "fa-laptop-code";
                    let catClass = "tech";
                    const categoryLower = event.category ? event.category.toLowerCase() : "";
                    if (categoryLower.includes("music")) { catIcon = "fa-music"; catClass = "music"; }
                    else if (categoryLower.includes("food")) { catIcon = "fa-utensils"; catClass = "food"; }
                    else if (categoryLower.includes("sport")) { catIcon = "fa-running"; catClass = "sports"; }
                    else if (categoryLower.includes("art")) { catIcon = "fa-palette"; catClass = "arts"; }

                    const ticketDiv = document.createElement("div");
                    ticketDiv.className = "ticket-item active";
                    ticketDiv.innerHTML = `
                        <div class="ticket-header">
                            <div class="ticket-status active">
                                <i class="fas fa-check-circle"></i>
                                <span>Active</span>
                            </div>
                            <div class="ticket-actions">
                                <button class="icon-btn quick-view" title="Quick View">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="ticket-content">
                            <div class="ticket-event">
                                <div class="event-icon ${catClass}">
                                    <i class="fas ${catIcon}"></i>
                                </div>
                                <div class="event-details">
                                    <h4>${event.title}</h4>
                                    <p class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location || 'Online'}</p>
                                    <p class="event-date"><i class="fas fa-calendar"></i> ${formattedDate}</p>
                                </div>
                            </div>
                            <div class="ticket-details">
                                <div class="detail-row">
                                    <div class="detail-item">
                                        <span class="label">Ticket No:</span>
                                        <span class="value">${reg.registerationId.slice(0, 8).toUpperCase()}-${event.eventId.slice(0, 4).toUpperCase()}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="label">Type:</span>
                                        <span class="value ${typeClass}">${typeStr}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="label">Price:</span>
                                        <span class="value">$${event.price ? Number(event.price).toFixed(2) : '0.00'}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="ticket-qr">
                                <div class="qr-code">
                                    <div class="qr-placeholder">
                                        <i class="fas fa-qrcode"></i>
                                        <p>Scan for entry</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ticket-footer">
                            <div class="ticket-actions-full">
                                <button class="btn-view-ticket"><i class="fas fa-expand"></i> View Full Ticket</button>
                                <button class="btn-download-ticket"><i class="fas fa-download"></i> Download</button>
                            </div>
                        </div>
                    `;

                    // Wire events
                    ticketDiv.querySelector(".quick-view").addEventListener("click", () => openFullTicket(reg));
                    ticketDiv.querySelector(".btn-view-ticket").addEventListener("click", () => openFullTicket(reg));
                    ticketDiv.querySelector(".btn-download-ticket").addEventListener("click", () => showNotification("Downloading ticket PDF...", "success"));

                    activeList.appendChild(ticketDiv);
                });
            }
        }

        // Render Used Tickets
        if (usedGrid) {
            usedGrid.innerHTML = "";
            if (usedTickets.length === 0) {
                usedGrid.innerHTML = `
                    <div class="empty-state" style="text-align: center; padding: 40px; color: var(--text-secondary); width: 100%;">
                        <i class="fas fa-history" style="font-size: 48px; margin-bottom: 15px; color: var(--primary-color);"></i>
                        <p>No used tickets found.</p>
                    </div>
                `;
            } else {
                usedTickets.forEach(reg => {
                    const event = reg.event;
                    const eventDate = new Date(event.date);
                    const formattedDate = eventDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    });

                    let catIcon = "fa-laptop-code";
                    let catClass = "tech";
                    const categoryLower = event.category ? event.category.toLowerCase() : "";
                    if (categoryLower.includes("music")) { catIcon = "fa-music"; catClass = "music"; }
                    else if (categoryLower.includes("food")) { catIcon = "fa-utensils"; catClass = "food"; }
                    else if (categoryLower.includes("sport")) { catIcon = "fa-running"; catClass = "sports"; }
                    else if (categoryLower.includes("art")) { catIcon = "fa-palette"; catClass = "arts"; }

                    const ticketCard = document.createElement("div");
                    ticketCard.className = "ticket-card used";
                    ticketCard.innerHTML = `
                        <div class="ticket-card-header">
                            <div class="event-icon ${catClass} small">
                                <i class="fas ${catIcon}"></i>
                            </div>
                            <div class="ticket-card-status used">
                                <i class="fas fa-check-circle"></i>
                                <span>Used</span>
                            </div>
                        </div>
                        <div class="ticket-card-body">
                            <h4>${event.title}</h4>
                            <p class="event-date"><i class="fas fa-calendar"></i> ${formattedDate}</p>
                            <p class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location || 'Online'}</p>
                            <div class="ticket-no">No: ${reg.registerationId.slice(0, 8).toUpperCase()}</div>
                        </div>
                        <div class="ticket-card-footer">
                            <button class="btn-view-details" style="width: 100%;"><i class="fas fa-info-circle"></i> Details</button>
                        </div>
                    `;

                    ticketCard.querySelector(".btn-view-details").addEventListener("click", () => openFullTicket(reg));
                    usedGrid.appendChild(ticketCard);
                });
            }
        }
    }

    function openFullTicket(reg) {
        if (!ticketModal || !modalContent) return;
        const event = reg.event;
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }) + " • " + eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const typeStr = event.price > 100 ? "VIP Admission" : (event.price > 50 ? "Early Bird" : "General Admission");

        let catIcon = "fa-laptop-code";
        let catClass = "tech";
        const categoryLower = event.category ? event.category.toLowerCase() : "";
        if (categoryLower.includes("music")) { catIcon = "fa-music"; catClass = "music"; }
        else if (categoryLower.includes("food")) { catIcon = "fa-utensils"; catClass = "food"; }
        else if (categoryLower.includes("sport")) { catIcon = "fa-running"; catClass = "sports"; }
        else if (categoryLower.includes("art")) { catIcon = "fa-palette"; catClass = "arts"; }

        modalContent.innerHTML = `
            <div class="ticket-modal-header" style="display: flex; gap: 20px; align-items: center; margin-bottom: 25px;">
                <div class="event-icon large ${catClass}">
                    <i class="fas ${catIcon}"></i>
                </div>
                <div class="ticket-modal-title">
                    <h4>${event.title}</h4>
                    <p class="ticket-modal-subtitle">${event.category || 'General'}</p>
                </div>
            </div>
            
            <div class="ticket-modal-details">
                <div class="details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="detail-item">
                        <span class="label">Date & Time</span>
                        <span class="value" style="font-size: 14px;">${formattedDate}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Location</span>
                        <span class="value" style="font-size: 14px;">${event.location || 'Online'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Ticket Number</span>
                        <span class="value">${reg.registerationId.toUpperCase()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Ticket Type</span>
                        <span class="value">${typeStr}</span>
                    </div>
                </div>
            </div>
            
            <div class="ticket-modal-qr" style="display: flex; flex-direction: column; align-items: center; gap: 15px; background: var(--bg-secondary); padding: 20px; border-radius: var(--radius-lg);">
                <i class="fas fa-qrcode" style="font-size: 100px; color: var(--primary-color);"></i>
                <p style="font-size: 14px; font-weight: 500;">Scan this QR code at the entry gate</p>
                <small style="color: var(--text-secondary);">Registered on ${new Date(reg.registeredAt).toLocaleDateString()}</small>
            </div>
        `;

        ticketModal.style.display = "flex";
        ticketModal.classList.add("active");
    }

    if (closeTicketModal) {
        closeTicketModal.addEventListener("click", () => {
            ticketModal.classList.remove("active");
            ticketModal.style.display = "none";
        });
    }

    // Set up filter change listeners
    if (searchInput) searchInput.addEventListener("input", renderAll);
    if (statusFilter) statusFilter.addEventListener("change", renderAll);
    if (typeFilter) typeFilter.addEventListener("change", renderAll);
    if (sortFilter) sortFilter.addEventListener("change", renderAll);

    if (resetFilters) {
        resetFilters.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (statusFilter) statusFilter.value = "all";
            if (typeFilter) typeFilter.value = "all";
            if (sortFilter) sortFilter.value = "date-desc";
            renderAll();
        });
    }

    function showNotification(message, type = "info") {
        if (typeof window.showNotification === "function") {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
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
