#  Evento — Cloud-Native Event Management Platform

Evento is a **cloud-native, centralized event management platform** designed to handle the complete lifecycle of events — from creation and discovery to registration and real-time interaction — across multiple domains.

The platform supports **all types of events**, including entertainment, educational, political, organizational, and city-wide events, through a single, unified system.

---

##  Problem Statement

Event management today is often fragmented across messaging apps, spreadsheets, and static websites. These approaches lack scalability, real-time updates, centralized control, and proper access management.

Evento addresses this problem by providing a **single cloud-based platform** that enables efficient event organization, discovery, and participation with scalability and security built in.

---

##  Objectives

- Centralize management of all event types in one platform
- Enable easy event creation, publishing, and registration
- Support role-based access for different user types
- Ensure scalability and reliability using cloud-native principles
- Provide a smooth, modern, and interactive user experience
- Design the system for future extensibility and real-world usage

---

##  Domain Overview

**Domain:** Cloud Computing & Web Applications

Evento is built using **cloud-native architecture principles**, focusing on:
- Stateless backend services
- Event-driven workflows
- Scalable and reliable cloud infrastructure
- Secure access control and monitoring

---

##  User Roles

- **Admin** – Manages platform-level configurations and monitoring
- **Organizer** – Creates, publishes, and manages events
- **User / Attendee** – Discovers events and registers to participate

---

##  How Evento Works

1. **Create Events**  
   Organizers create events with essential details such as category, date, location, and description.

2. **Publish & Manage**  
   Events are published to the platform and managed from a centralized dashboard.

3. **Discover & Register**  
   Users explore events by category and register seamlessly.

4. **Live Updates & Insights**  
   The platform delivers real-time updates and participation insights for better coordination.

---

##  Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Responsive and interactive UI

### Backend
- Node.js
- Express.js
- RESTful APIs

### Database
- NoSQL (AWS DynamoDB / MongoDB – planned)

### Cloud Platform
- Amazon Web Services (AWS)
  - S3 (Static hosting)
  - EC2 / Lambda (Backend services)
  - API Gateway
  - IAM (Role-based access)
  - CloudWatch (Monitoring)

### Tools
- Git & GitHub
- Postman (API testing)

---

##  Key Features

- Centralized system for all event domains
- Role-based access control
- Cloud-native, scalable architecture
- Real-time interaction readiness
- Modern, interactive UI
- Secure and extensible design

---

## 📁 Project Structure

```text
Evento/
├── frontend/                        # Client-Side Application
│   ├── index.html                   # Public Landing Page
│   ├── auth.html                    # User & Organizer Login/Signup
│   ├── auth-man.html                # Admin Login/Signup
│   ├── index-man.html               # Admin Portal Landing
│   │
│   ├── pages/                       # Role-Specific Portals
│   │   ├── user/                    # Attendee / User Portal (usr-*.html)
│   │   ├── organizer/               # Organizer Portal (org-*.html)
│   │   └── admin/                   # System Admin Portal (man-*.html)
│   │
│   ├── css/                         # Modular Stylesheets
│   │   ├── common/                  # Base & Auth styles (index.css, auth.css)
│   │   ├── user/                    # User portal styles (usr-*.css)
│   │   ├── organizer/               # Organizer portal styles (org-*.css)
│   │   └── admin/                   # Admin portal styles (man-*.css)
│   │
│   ├── js/                          # Modular Scripts
│   │   ├── core/                    # Core modules (api.js, auth.js, index.js)
│   │   ├── user/                    # User portal logic (usr-*.js)
│   │   ├── organizer/               # Organizer logic (org-*.js, org-auth-helper.js)
│   │   └── admin/                   # Admin logic (man-*.js, man-auth-helper.js)
│   │
│   └── assets/                      # Static Media & Graphics
│       ├── icons/                   # Icons and SVG avatars
│       └── media/                   # Videos and branding media
│
├── backend/                         # Cloud-Native REST API & Lambda Functions
│   ├── src/
│   │   ├── config/                  # dynamo.js
│   │   ├── controllers/             # auth, admin.auth, event controllers
│   │   ├── middleware/              # JWT RBAC middleware (authUser, authOrganizer, authAdmin)
│   │   ├── routes/                  # Express route definitions
│   │   ├── services/                # Business logic & DynamoDB operations
│   │   ├── app.js                   # Express application setup
│   │   └── handler.js               # Serverless AWS Lambda handler
│   ├── .env
│   ├── package.json
│   ├── server.js                    # Local development runner
│   └── serverless.yml               # AWS Serverless deployment config
│
├── docs/                            # Documentation & Architecture
│   ├── diagrams/                    # System architecture & tech stack diagrams
│   └── presentations/               # Review slides, literature survey, reports
│
└── README.md
```

---

## 🚀 Project Status

-  Zeroth Review Completed  
-  UI & Authentication Module in Progress  
-  Backend APIs & Cloud Deployment

---

##  Future Enhancements

- Real-time notifications (Email / Push)
- Analytics dashboard for organizers
- CI/CD pipeline integration
- Containerized deployment
- Advanced authentication and authorization

---

##  License

This project is developed for **academic and learning purposes** and is open for future enhancements.

---

##  Author

**Evento**  
Cloud-Native Event Management Platform  
Built with  and  by a Cloud & Software Engineering enthusiast