// js/usr-upcoming.js - Fetch and render upcoming events for Attendee
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../../auth.html";
        return;
    }

    const confirmedContainer = document.getElementById("confirmedEventsContainer");
    const pendingContainer = document.getElementById("pendingEventsContainer");
    const confirmedBadge = document.getElementById("confirmedBadge");
    const pendingBadge = document.getElementById("pendingBadge");
    const confirmedCountEl = document.getElementById("confirmedCount");
    const pendingCountEl = document.getElementById("pendingCount");

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const dateFilter = document.getElementById("dateFilter");
    const sortFilter = document.getElementById("sortFilter");
    const resetFilters = document.getElementById("resetFilters");

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
        // Filter upcoming events (date >= today)
        let upcoming = registrations.filter(r => r.event && new Date(r.event.date) >= now);

        // Hide pending section or clear it since DB doesn't have pending state
        if (pendingContainer) {
            pendingContainer.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <i class="fas fa-hourglass-half" style="font-size: 48px; margin-bottom: 15px; color: var(--primary-color);"></i>
                    <p>No pending events at the moment.</p>
                </div>
            `;
        }
        if (pendingBadge) pendingBadge.textContent = "0 events";
        if (pendingCountEl) pendingCountEl.textContent = "0";

        // Apply filters
        const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const catVal = categoryFilter ? categoryFilter.value.toLowerCase() : "all";
        const dateVal = dateFilter ? dateFilter.value : "all";

        let filtered = upcoming.filter(reg => {
            const event = reg.event;
            
            // Search filter
            const matchesSearch = !searchVal || 
                event.title.toLowerCase().includes(searchVal) || 
                (event.description && event.description.toLowerCase().includes(searchVal)) ||
                (event.location && event.location.toLowerCase().includes(searchVal));

            // Category filter
            const matchesCat = catVal === "all" || (event.category && event.category.toLowerCase() === catVal);

            // Date filter
            let matchesDate = true;
            if (dateVal !== "all" && event.date) {
                const eventDate = new Date(event.date);
                const today = new Date();
                today.setHours(0,0,0,0);
                
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                
                const endOfWeek = new Date(today);
                endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay()));
                
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                if (dateVal === "today") {
                    matchesDate = eventDate.toDateString() === today.toDateString();
                } else if (dateVal === "tomorrow") {
                    matchesDate = eventDate.toDateString() === tomorrow.toDateString();
                } else if (dateVal === "week") {
                    matchesDate = eventDate >= today && eventDate <= endOfWeek;
                } else if (dateVal === "month") {
                    matchesDate = eventDate >= today && eventDate <= endOfMonth;
                }
            }

            return matchesSearch && matchesCat && matchesDate;
        });

        // Apply sorting
        const sortVal = sortFilter ? sortFilter.value : "date-asc";
        filtered.sort((a, b) => {
            const eventA = a.event;
            const eventB = b.event;

            if (sortVal === "date-asc") {
                return new Date(eventA.date) - new Date(eventB.date);
            } else if (sortVal === "date-desc") {
                return new Date(eventB.date) - new Date(eventA.date);
            } else if (sortVal === "name") {
                return eventA.title.localeCompare(eventB.title);
            } else {
                return 0; // default
            }
        });

        // Update counts
        if (confirmedCountEl) confirmedCountEl.textContent = filtered.length;
        if (confirmedBadge) confirmedBadge.textContent = `${filtered.length} event${filtered.length !== 1 ? 's' : ''}`;

        // Render cards
        if (!confirmedContainer) return;
        confirmedContainer.innerHTML = "";

        if (filtered.length === 0) {
            confirmedContainer.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <i class="fas fa-calendar-times" style="font-size: 48px; margin-bottom: 15px; color: var(--primary-color);"></i>
                    <p>No upcoming events found matching your criteria.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(reg => {
            const event = reg.event;
            const eventDate = new Date(event.date);
            const dateStr = eventDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });

            // Map categories to FontAwesome icons and classes
            let catIcon = "fa-laptop-code";
            let catClass = "tech";
            const categoryLower = event.category ? event.category.toLowerCase() : "";
            if (categoryLower.includes("music") || categoryLower.includes("concert")) {
                catIcon = "fa-music";
                catClass = "music";
            } else if (categoryLower.includes("food") || categoryLower.includes("drink") || categoryLower.includes("wine")) {
                catIcon = "fa-utensils";
                catClass = "food";
            } else if (categoryLower.includes("sport") || categoryLower.includes("fitness")) {
                catIcon = "fa-running";
                catClass = "sports";
            } else if (categoryLower.includes("art") || categoryLower.includes("paint") || categoryLower.includes("culture")) {
                catIcon = "fa-palette";
                catClass = "arts";
            } else if (categoryLower.includes("business") || categoryLower.includes("marketing") || categoryLower.includes("finance")) {
                catIcon = "fa-briefcase";
                catClass = "business";
            } else if (categoryLower.includes("workshop") || categoryLower.includes("learning") || categoryLower.includes("education")) {
                catIcon = "fa-graduation-cap";
                catClass = "workshop";
            }

            const card = document.createElement("div");
            card.className = "event-card confirmed";
            card.innerHTML = `
                <div class="event-card-header">
                    <div class="event-category ${catClass}">
                        <i class="fas ${catIcon}"></i>
                        <span>${event.category || 'General'}</span>
                    </div>
                    <div class="event-actions">
                        <button class="icon-btn share-btn" title="Share" data-id="${event.eventId}">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="event-card-content">
                    <h4>${event.title}</h4>
                    <p class="event-description">${event.description || 'No description available.'}</p>
                    <div class="event-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${dateStr}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location || 'Online'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-tag"></i>
                            <span>$${event.price ? Number(event.price).toFixed(2) : '0.00'}</span>
                        </div>
                    </div>
                </div>
                <div class="event-card-footer">
                    <div class="event-buttons" style="width: 100%; display: flex; gap: 10px;">
                        <button class="btn-view-ticket" style="flex: 1;" onclick="window.location.href='usr-tickets.html'"><i class="fas fa-ticket-alt"></i> View Ticket</button>
                    </div>
                </div>
            `;

            confirmedContainer.appendChild(card);
        });
    }

    // Set up event listeners for filters
    if (searchInput) searchInput.addEventListener("input", renderAll);
    if (categoryFilter) categoryFilter.addEventListener("change", renderAll);
    if (dateFilter) dateFilter.addEventListener("change", renderAll);
    if (sortFilter) sortFilter.addEventListener("change", renderAll);
    if (resetFilters) {
        resetFilters.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (categoryFilter) categoryFilter.value = "all";
            if (dateFilter) dateFilter.value = "all";
            if (sortFilter) sortFilter.value = "date-asc";
            renderAll();
        });
    }
});
