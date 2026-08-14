// js/usr-past.js - Fetch and render past events for Attendee
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../../auth.html";
        return;
    }

    const timelineContainer = document.getElementById("pastTimelineContainer");
    const timelineCountEl = document.getElementById("timelineCount");
    const currentYearEl = document.getElementById("currentYear");
    const prevYearBtn = document.getElementById("prevYear");
    const nextYearBtn = document.getElementById("nextYear");

    const searchInput = document.getElementById("searchInput");
    const timeFilter = document.getElementById("timeFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");
    const resetFilters = document.getElementById("resetFilters");

    const eventModal = document.getElementById("eventModal");
    const closeEventModal = document.getElementById("closeEventModal");
    const modalEventContent = document.getElementById("modalEventContent");

    const reviewModal = document.getElementById("reviewModal");
    const closeReviewModal = document.getElementById("closeReviewModal");
    const cancelReviewBtn = document.getElementById("cancelReview");
    const submitReviewBtn = document.getElementById("submitReview");
    const starRatingContainer = document.querySelector(".stars");
    const ratingValue = document.querySelector(".rating-value");

    let registrations = [];
    let currentYear = 2026;
    let selectedRating = 0;

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
        // Filter past events (date < now)
        let past = registrations.filter(r => r.event && new Date(r.event.date) < now);

        // Apply filters
        const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const catVal = categoryFilter ? categoryFilter.value.toLowerCase() : "all";
        const timeVal = timeFilter ? timeFilter.value : "all";

        let filtered = past.filter(reg => {
            const event = reg.event;
            const eventDate = new Date(event.date);

            // Year filter matching currentYear
            if (eventDate.getFullYear() !== currentYear) return false;

            // Search filter
            const matchesSearch = !searchVal || 
                event.title.toLowerCase().includes(searchVal) || 
                (event.description && event.description.toLowerCase().includes(searchVal)) ||
                (event.location && event.location.toLowerCase().includes(searchVal));

            // Category filter
            const matchesCat = catVal === "all" || (event.category && event.category.toLowerCase() === catVal);

            // Time filter
            let matchesTime = true;
            if (timeVal !== "all") {
                const diffTime = Math.abs(now - eventDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (timeVal === "30days") {
                    matchesTime = diffDays <= 30;
                } else if (timeVal === "6months") {
                    matchesTime = diffDays <= 180;
                } else if (timeVal === "year") {
                    matchesTime = diffDays <= 365;
                }
            }

            return matchesSearch && matchesCat && matchesTime;
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
            } else if (sortVal === "name") {
                return a.event.title.localeCompare(b.event.title);
            }
            return 0;
        });

        // Update year display
        if (currentYearEl) currentYearEl.textContent = currentYear;

        // Update counts
        if (timelineCountEl) {
            timelineCountEl.textContent = `${filtered.length} event${filtered.length !== 1 ? 's' : ''}`;
        }

        // Render timeline
        if (!timelineContainer) return;
        timelineContainer.innerHTML = "";

        if (filtered.length === 0) {
            timelineContainer.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <i class="fas fa-history" style="font-size: 48px; margin-bottom: 15px; color: var(--primary-color);"></i>
                    <p>No past events found for ${currentYear} matching your criteria.</p>
                </div>
            `;
            return;
        }

        // Group by month
        const groups = {};
        filtered.forEach(reg => {
            const eventDate = new Date(reg.event.date);
            const monthName = eventDate.toLocaleString("en-US", { month: "long" });
            const groupName = `${monthName} ${eventDate.getFullYear()}`;
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(reg);
        });

        Object.keys(groups).forEach(groupName => {
            const groupEvents = groups[groupName];
            const monthHeader = document.createElement("div");
            monthHeader.className = "timeline-month";
            monthHeader.innerHTML = `
                <div class="month-header">
                    <h4>${groupName}</h4>
                    <span class="month-count">${groupEvents.length} event${groupEvents.length !== 1 ? 's' : ''}</span>
                </div>
            `;

            const itemsContainer = document.createElement("div");
            itemsContainer.style.display = "flex";
            itemsContainer.style.flexDirection = "column";
            itemsContainer.style.gap = "20px";
            itemsContainer.style.marginTop = "15px";

            groupEvents.forEach(reg => {
                const event = reg.event;
                const eventDate = new Date(event.date);
                const dayStr = eventDate.toLocaleString("en-US", { month: "short", day: "numeric" });
                
                let catClass = "tech";
                const categoryLower = event.category ? event.category.toLowerCase() : "";
                if (categoryLower.includes("music")) catClass = "music";
                else if (categoryLower.includes("food")) catClass = "food";
                else if (categoryLower.includes("sport")) catClass = "sports";
                else if (categoryLower.includes("art")) catClass = "arts";
                else if (categoryLower.includes("business")) catClass = "business";

                const timelineItem = document.createElement("div");
                timelineItem.className = "timeline-item attended";
                timelineItem.innerHTML = `
                    <div class="timeline-date">
                        <span class="day">${dayStr}</span>
                        <span class="year">${eventDate.getFullYear()}</span>
                    </div>
                    <div class="timeline-content">
                        <div class="event-summary">
                            <h5>${event.title}</h5>
                            <div class="event-meta">
                                <span class="category ${catClass}">${event.category || 'General'}</span>
                                <span class="rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <span>5.0</span>
                                </span>
                            </div>
                            <p class="event-note">${event.description || 'Attended successfully!'}</p>
                        </div>
                        <div class="timeline-actions">
                            <button class="icon-btn view-details" title="View Details" data-id="${event.eventId}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="icon-btn share-event" title="Share" data-id="${event.eventId}">
                                <i class="fas fa-share-alt"></i>
                            </button>
                            <button class="icon-btn add-memories" title="Review Event" data-id="${event.eventId}">
                                <i class="fas fa-star"></i>
                            </button>
                        </div>
                    </div>
                `;

                // Wire up actions
                timelineItem.querySelector(".view-details").addEventListener("click", () => openEventDetails(event));
                timelineItem.querySelector(".share-event").addEventListener("click", () => showNotification("Share link copied to clipboard!", "success"));
                timelineItem.querySelector(".add-memories").addEventListener("click", () => openReviewForm(event));

                itemsContainer.appendChild(timelineItem);
            });

            monthHeader.appendChild(itemsContainer);
            timelineContainer.appendChild(monthHeader);
        });
    }

    // Modal controls
    function openEventDetails(event) {
        if (!eventModal || !modalEventContent) return;
        const eventDate = new Date(event.date);
        modalEventContent.innerHTML = `
            <div class="event-modal-header-desc" style="padding: 20px; line-height: 1.6;">
                <h3>${event.title}</h3><br>
                <p><i class="fas fa-calendar-alt" style="color: var(--primary-color);"></i> <b>Date:</b> ${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p><i class="fas fa-map-marker-alt" style="color: var(--primary-color);"></i> <b>Location:</b> ${event.location || 'Online'}</p>
                <p><i class="fas fa-tags" style="color: var(--primary-color);"></i> <b>Category:</b> ${event.category || 'General'}</p><br>
                <p><b>Description:</b></p>
                <p>${event.description || 'No description available.'}</p>
            </div>
        `;
        eventModal.style.display = "flex";
        eventModal.classList.add("active");
    }

    if (closeEventModal) {
        closeEventModal.addEventListener("click", () => {
            eventModal.classList.remove("active");
            eventModal.style.display = "none";
        });
    }

    function openReviewForm(event) {
        if (!reviewModal) return;
        document.getElementById("reviewEvent").value = event.title;
        selectedRating = 5;
        updateStars(5);
        reviewModal.style.display = "flex";
        reviewModal.classList.add("active");
    }

    if (closeReviewModal) {
        closeReviewModal.addEventListener("click", () => {
            reviewModal.classList.remove("active");
            reviewModal.style.display = "none";
        });
    }
    if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener("click", () => {
            reviewModal.classList.remove("active");
            reviewModal.style.display = "none";
        });
    }

    if (submitReviewBtn) {
        submitReviewBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showNotification("Thank you for your rating!", "success");
            reviewModal.classList.remove("active");
            reviewModal.style.display = "none";
        });
    }

    // Star rating selection
    if (starRatingContainer) {
        const stars = starRatingContainer.querySelectorAll("i");
        stars.forEach((star, index) => {
            star.addEventListener("click", () => {
                selectedRating = index + 1;
                updateStars(selectedRating);
            });
        });
    }

    function updateStars(rating) {
        if (!starRatingContainer) return;
        const stars = starRatingContainer.querySelectorAll("i");
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.replace("far", "fas");
            } else {
                star.classList.replace("fas", "far");
            }
        });
        if (ratingValue) ratingValue.textContent = `${rating}/5`;
    }

    // Set up filter change listeners
    if (searchInput) searchInput.addEventListener("input", renderAll);
    if (categoryFilter) categoryFilter.addEventListener("change", renderAll);
    if (timeFilter) timeFilter.addEventListener("change", renderAll);
    if (sortFilter) sortFilter.addEventListener("change", renderAll);

    if (prevYearBtn) {
        prevYearBtn.addEventListener("click", () => {
            currentYear--;
            renderAll();
        });
    }
    if (nextYearBtn) {
        nextYearBtn.addEventListener("click", () => {
            currentYear++;
            renderAll();
        });
    }

    if (resetFilters) {
        resetFilters.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (categoryFilter) categoryFilter.value = "all";
            if (timeFilter) timeFilter.value = "all";
            if (sortFilter) sortFilter.value = "date-desc";
            currentYear = 2026;
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