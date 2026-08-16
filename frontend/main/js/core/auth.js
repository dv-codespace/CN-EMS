import { apiRequest } from './api.js';

// Authentication Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const loginToggle = document.getElementById('loginToggle');
    const signupToggle = document.getElementById('signupToggle');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toggleIndicator = document.querySelector('.toggle-indicator');
    const switchToLogin = document.getElementById('switchToLogin');
    const userRoleInput = document.getElementById('userRole');
    const organizationInfo = document.querySelector('.organization-info');
    const successModal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    const continueBtn = document.getElementById('continueBtn');
    
    // Form toggle functionality
    function switchForm(formType) {
        const isLogin = formType === 'login';
        
        // Update toggle buttons
        loginToggle.classList.toggle('active', isLogin);
        signupToggle.classList.toggle('active', !isLogin);
        
        // Move toggle indicator
        toggleIndicator.style.transform = isLogin 
            ? 'translateX(0)' 
            : 'translateX(100%)';
        
        // Show/hide forms
        loginForm.classList.toggle('active', isLogin);
        signupForm.classList.toggle('active', !isLogin);
        
        // Reset forms
        if (isLogin) {
            resetValidation(loginForm);
        } else {
            resetValidation(signupForm);
        }
    }
    
    // Toggle between login and signup
    loginToggle.addEventListener('click', () => switchForm('login'));
    signupToggle.addEventListener('click', () => switchForm('signup'));
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchForm('login');
    });
    
    // Role selection
    const roleOptions = document.querySelectorAll('.role-option');
    roleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const role = this.dataset.role;
            
            // Update UI
            roleOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            userRoleInput.value = role;
            
            // Show/hide organization field
            organizationInfo.classList.toggle('show', role === 'organizer');
        });
    });
    
    // Password strength indicator
    const passwordInput = document.getElementById('signupPassword');
    const strengthBar = document.querySelector('.strength-progress');
    const strengthText = document.querySelector('.strength-text');
    const passwordReqs = document.querySelectorAll('.password-requirements li');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        
        // Update strength bar
        strengthBar.style.width = strength.percentage + '%';
        strengthBar.style.background = strength.color;
        
        // Update text
        strengthText.textContent = strength.text;
        strengthText.style.color = strength.color;
        
        // Update requirements
        updatePasswordRequirements(password);
    });
    
    function checkPasswordStrength(password) {
        let score = 0;
        const requirements = [
            password.length >= 8,
            /[A-Z]/.test(password),
            /[0-9]/.test(password),
            /[^A-Za-z0-9]/.test(password)
        ];
        
        requirements.forEach(req => {
            if (req) score++;
        });
        
        const strengthMap = {
            0: { percentage: 0, color: '#ef4444', text: 'Very Weak' },
            1: { percentage: 25, color: '#f97316', text: 'Weak' },
            2: { percentage: 50, color: '#fbbf24', text: 'Fair' },
            3: { percentage: 75, color: '#a78bfa', text: 'Good' },
            4: { percentage: 100, color: '#10b981', text: 'Strong' }
        };
        
        return strengthMap[score];
    }
    
    function updatePasswordRequirements(password) {
        const requirements = [
            password.length >= 8,
            /[A-Z]/.test(password),
            /[0-9]/.test(password),
            /[^A-Za-z0-9]/.test(password)
        ];
        
        passwordReqs.forEach((req, index) => {
            if (requirements[index]) {
                req.classList.add('valid');
                req.querySelector('i').className = 'fas fa-check-circle';
            } else {
                req.classList.remove('valid');
                req.querySelector('i').className = 'fas fa-check';
            }
        });
    }
    
    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.closest('.input-group').querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
    
    // Form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/[^\d+]/g, ''));
    }
    
    function validatePassword(password) {
        const requirements = [
            password.length >= 8,
            /[A-Z]/.test(password),
            /[0-9]/.test(password),
            /[^A-Za-z0-9]/.test(password)
        ];
        return requirements.every(req => req);
    }
    
    // Real-time validation
    document.querySelectorAll('input[type="email"], input[type="text"], input[type="tel"]').forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            const group = this.closest('.input-group');
            group.classList.remove('valid', 'error');
            const feedback = group.nextElementSibling;
            feedback.textContent = '';
            feedback.className = 'input-feedback';
        });
    });
    
    function validateField(input) {
        const value = input.value.trim();
        const group = input.closest('.input-group');
        const feedback = group.nextElementSibling;
        
        group.classList.remove('valid', 'error');
        feedback.textContent = '';
        feedback.className = 'input-feedback';
        
        if (!value) return;
        
        let isValid = true;
        let message = '';
        
        switch(input.type) {
            case 'email':
                isValid = validateEmail(value);
                message = isValid ? 'Valid email address' : 'Please enter a valid email';
                break;
            case 'tel':
                isValid = validatePhone(value);
                message = isValid ? 'Valid phone number' : 'Please enter a valid phone number';
                break;
            case 'text':
                if (input.id === 'firstName' || input.id === 'lastName') {
                    isValid = value.length >= 2;
                    message = isValid ? 'Valid name' : 'Name must be at least 2 characters';
                }
                break;
        }
        
        if (isValid) {
            group.classList.add('valid');
            feedback.classList.add('success');
            feedback.textContent = message;
        } else {
            group.classList.add('error');
            feedback.classList.add('error');
            feedback.textContent = message;
        }
    }
    
    // Confirm password validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    confirmPasswordInput.addEventListener('input', function() {
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = this.value;
        const group = this.closest('.input-group');
        const feedback = group.nextElementSibling;
        
        if (!confirmPassword) return;
        
        if (password === confirmPassword) {
            group.classList.add('valid');
            group.classList.remove('error');
            feedback.textContent = 'Passwords match';
            feedback.className = 'input-feedback success';
        } else {
            group.classList.add('error');
            group.classList.remove('valid');
            feedback.textContent = 'Passwords do not match';
            feedback.className = 'input-feedback error';
        }
    });
    
    // Demo account buttons
    document.querySelectorAll('.demo-btn').forEach(button => {
        button.addEventListener('click', function() {
            const email = this.dataset.email;
            const password = this.dataset.password;
            
            document.getElementById('loginEmail').value = email;
            document.getElementById('loginPassword').value = password;
            
            // Highlight the filled fields
            ['loginEmail', 'loginPassword'].forEach(id => {
                const input = document.getElementById(id);
                input.style.animation = 'none';
                setTimeout(() => {
                    input.style.animation = 'highlight 1s ease';
                }, 10);
            });
            
            // Add highlight animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes highlight {
                    0%, 100% { background-color: var(--white); }
                    50% { background-color: var(--sky-blue-50); }
                }
            `;
            document.head.appendChild(style);
        });
    });
    
    // Form submission
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const submitBtn = this.querySelector(".submit-btn");
        submitBtn.classList.add("loading");

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {
            submitBtn.classList.remove("loading");
            showError("Please fill in all fields");
            return;
        }

        try {
            const result = await apiRequest("/auth/login", "POST", {
                email,
                password
            });

            submitBtn.classList.remove("loading");

            if (!result.success) {
                showError(result.message || "Invalid credentials");
                return;
            }

            // Store session info
            localStorage.setItem("token", result.token);
            localStorage.setItem("role", result.role);
            localStorage.setItem("userId", result.userId);

            showSuccess("Login successful!");

            // Role-based redirect
            if (result.role === "ORGANIZER") {
                window.location.href = "pages/organizer/dashboard.html";
            } else {
                window.location.href = "pages/user/dashboard.html";
            }

        } catch (error) {
        submitBtn.classList.remove("loading");
        showError("Server error. Please try again.");
        }
    });
    
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const submitBtn = this.querySelector(".submit-btn");
        submitBtn.classList.add("loading");

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const payload = {
            name: firstName + " " + lastName,
            email: document.getElementById("signupEmail").value.trim(),
            phone: document.getElementById("countryCode").value +
               document.getElementById("phoneNumber").value.trim(),
            password: document.getElementById("signupPassword").value,
            role: userRoleInput.value,
            organization: document.getElementById("organization").value.trim()
        };

        try {
            const result = await apiRequest("/auth/register", "POST", payload);
            submitBtn.classList.remove("loading");

            if (!result.success) {
                showError(result.message || "Signup failed");
                return;
            }

            successMessage.textContent =
                `Your ${payload.role} account has been created successfully!`;
                successModal.classList.add("show");

        } catch (error) {
            submitBtn.classList.remove("loading");
            showError("Server error during signup");
        }
    });

    
    
    // Continue to dashboard
    continueBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // Close modal when clicking outside
    successModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
        }
    });
    
    // Utility functions
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error-500);
            color: white;
            padding: 16px 24px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-500);
            color: white;
            padding: 16px 24px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => successDiv.remove(), 300);
        }, 3000);
    }
    
    function resetValidation(form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            const group = input.closest('.input-group');
            if (group) {
                group.classList.remove('valid', 'error');
                const feedback = group.nextElementSibling;
                if (feedback && feedback.classList.contains('input-feedback')) {
                    feedback.textContent = '';
                }
            }
        });
    }
    
    function animateModalStats() {
        const stats = document.querySelectorAll('.modal-stat');
        stats.forEach((stat, index) => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                stat.style.transition = 'all 0.5s ease';
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    // Initialize
    updatePasswordRequirements('');
});     