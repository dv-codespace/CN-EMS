// js/upcoming.js - Fetch and render upcoming events and calendar for Attendee
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../../auth.html";
        return;
    }

    const myEventsList = document.getElementById("myEventsList");
    const template = document.getElementById("registeredEventTemplate");
    const placeholder = document.querySelector(".no-events-placeholder");

    // Calendar Elements
    const calendarDays = document.getElementById('calendarDays');
    const currentMonth = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentCalendarDate = new Date();
    let userRegisteredDates = new Set(); // Store "YYYY-MM-DD" of registered events

    // Filters (Optional, keeping them if they still exist in HTML)
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const dateFilter = document.getElementById("dateFilter");
    const sortFilter = document.getElementById("sortFilter");
    const resetFilters = document.getElementById("resetFilters");

    let registrations = [];

    // Setup Calendar Listeners
    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            generateCalendar();
        });
        nextMonthBtn.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            generateCalendar();
        });
    }

    if (searchInput) searchInput.addEventListener("input", renderAll);
    if (categoryFilter) categoryFilter.addEventListener("change", renderAll);
    if (dateFilter) dateFilter.addEventListener("change", renderAll);
    if (sortFilter) sortFilter.addEventListener("change", renderAll);
    if (resetFilters) resetFilters.addEventListener("click", () => {
        if(searchInput) searchInput.value = "";
        if(categoryFilter) categoryFilter.value = "all";
        if(dateFilter) dateFilter.value = "all";
        if(sortFilter) sortFilter.value = "date-asc";
        renderAll();
    });

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
                
                // Populate userRegisteredDates
                registrations.forEach(reg => {
                    if (reg.event && reg.event.date) {
                        const date = new Date(reg.event.date);
                        const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                        userRegisteredDates.add(dateStr);
                    }
                });

                renderAll();
                generateCalendar();
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

        // Apply filters
        const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const catVal = categoryFilter ? categoryFilter.value.toLowerCase() : "all";
        const dateVal = dateFilter ? dateFilter.value : "all";

        let filtered = upcoming.filter(reg => {
            const event = reg.event;
            
            const matchesSearch = !searchVal || 
                event.title.toLowerCase().includes(searchVal) || 
                (event.description && event.description.toLowerCase().includes(searchVal)) ||
                (event.location && event.location.toLowerCase().includes(searchVal));

            const matchesCat = catVal === "all" || (event.category && event.category.toLowerCase() === catVal);

            let matchesDate = true;
            if (dateVal !== "all" && event.date) {
                const eventDate = new Date(event.date);
                const today = new Date();
                today.setHours(0,0,0,0);
                const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
                const endOfWeek = new Date(today); endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay()));
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                if (dateVal === "today") matchesDate = eventDate.toDateString() === today.toDateString();
                else if (dateVal === "tomorrow") matchesDate = eventDate.toDateString() === tomorrow.toDateString();
                else if (dateVal === "week") matchesDate = eventDate >= today && eventDate <= endOfWeek;
                else if (dateVal === "month") matchesDate = eventDate >= today && eventDate <= endOfMonth;
            }

            return matchesSearch && matchesCat && matchesDate;
        });

        const sortVal = sortFilter ? sortFilter.value : "date-asc";
        filtered.sort((a, b) => {
            const eventA = a.event;
            const eventB = b.event;
            if (sortVal === "date-asc") return new Date(eventA.date) - new Date(eventB.date);
            if (sortVal === "date-desc") return new Date(eventB.date) - new Date(eventA.date);
            if (sortVal === "name") return eventA.title.localeCompare(eventB.title);
            return 0;
        });

        if (!myEventsList) return;
        myEventsList.innerHTML = ""; // Clear existing

        if (filtered.length === 0) {
            if (placeholder) {
                myEventsList.appendChild(placeholder.cloneNode(true));
            } else {
                myEventsList.innerHTML = `<p>No events found.</p>`;
            }
            return;
        }

        filtered.forEach(reg => {
            const event = reg.event;
            const eventDate = new Date(event.date);
            
            const clone = template.content.cloneNode(true);
            
            clone.querySelector('.month').textContent = eventDate.toLocaleString('default', { month: 'short' });
            clone.querySelector('.day').textContent = eventDate.getDate();
            clone.querySelector('.event-title').textContent = event.title;
            clone.querySelector('.event-location span').textContent = event.location || 'TBA';
            
            const timeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            clone.querySelector('.event-time span').textContent = timeStr;

            myEventsList.appendChild(clone);
        });
    }

    function generateCalendar() {
        if (!calendarDays || !currentMonth) return;
        
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        
        const monthOptions = { month: 'long', year: 'numeric' };
        currentMonth.textContent = currentCalendarDate.toLocaleDateString('en-US', monthOptions);
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        calendarDays.innerHTML = '';
        
        for (let i = 0; i < startingDay; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day other-month';
            dayEl.textContent = '';
            calendarDays.appendChild(dayEl);
        }
        
        const today = new Date();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;
            
            // Check if today
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayEl.classList.add('today');
            }
            
            // Check if user has event
            const dateStr = `${year}-${month}-${day}`;
            if (userRegisteredDates.has(dateStr)) {
                dayEl.classList.add('event'); // Highlight registered events
            }
            
            calendarDays.appendChild(dayEl);
        }
    }
});
