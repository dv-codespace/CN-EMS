// js/auth-helper.js - Automatic Admin authentication and sidebar profile synchronization
document.addEventListener("DOMContentLoaded", () => {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
        window.location.href = "../../auth.html";
        return;
    }

    try {
        const payload = JSON.parse(atob(adminToken.split('.')[1]));
        updateSidebar(payload.name || payload.email || "Admin User", payload.profileImage);
    } catch (e) {
        console.error("Error decoding admin token:", e);
    }

    fetchFreshAdminProfile();

    async function fetchFreshAdminProfile() {
        try {
            const response = await fetch("http://localhost:3000/admin/auth/profile", {
                headers: {
                    "Authorization": `Bearer ${adminToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const admin = data.admin;
                if (admin) {
                    updateSidebar(admin.name || admin.email || "Admin User", admin.profileImage);
                }
            }
        } catch (e) {
            console.error("Error fetching admin profile:", e);
        }
    }

    function updateSidebar(name, profileImage) {
        // Update sidebar profile name
        const adminNameEl = document.querySelector(".sidebar .user-profile .user-info h3");
        if (adminNameEl) {
            adminNameEl.textContent = name;
        }

        // Update sidebar profile image
        const adminAvatarImg = document.querySelector(".sidebar .user-profile .avatar img");
        if (adminAvatarImg) {
            adminAvatarImg.src = profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin";
        }
    }
});
