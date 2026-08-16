// js/auth-helper.js - Automatic Organizer authentication and sidebar profile synchronization
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "../../auth.html";
        return;
    }

    // Initial load from cached token
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        updateSidebar(payload.name || payload.email || "Organizer", payload.profileImage);
    } catch (e) {
        console.error("Error decoding organizer token:", e);
    }

    // Fetch fresh profile from DB
    fetchFreshProfile();

    async function fetchFreshProfile() {
        try {
            const response = await fetch("http://localhost:3000/auth/profile", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const user = data.user;
                if (user) {
                    updateSidebar(user.name || user.email || "Organizer", user.profileImage);
                }
            }
        } catch (e) {
            console.error("Error fetching organizer profile:", e);
        }
    }

    function updateSidebar(name, profileImage) {
        const profileName = document.getElementById("profileName");
        const profileName1 = document.getElementById("profileName1");
        if (profileName) profileName.textContent = name;
        if (profileName1) profileName1.textContent = name;

        const sidebarAvatar = document.querySelector(".sidebar .user-profile .avatar img");
        if (sidebarAvatar) {
            sidebarAvatar.src = profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
        }
        
        // Also update settings page avatar preview if on settings.html
        const settingsAvatar = document.getElementById("profileImage");
        if (settingsAvatar && profileImage) {
            settingsAvatar.src = profileImage;
        }
    }
});
