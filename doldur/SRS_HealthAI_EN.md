# Software Requirements Specification (SRS)

## HEALTH AI Co-Creation & Innovation Platform

| Field | Value |
|---|---|
| Project Name | HEALTH AI Co-Creation & Innovation Platform |
| Course | SENG 430 |
| Group No / Name | Eagles |
| Group Members | Eagles Group |
| Submission Date | 06/05/2026 |
| Version | 1.0 |

### Revision History

| Date | Version | Change Description | Author |
|---|---|---|---|
| 06/05/2026 | 1.0 | Initial version | Eagles Group |

---

## Table of Contents

1. Introduction
2. Overall Description
3. Functional Requirements
4. Non-Functional Requirements
5. Use Cases
6. Data Model
7. Interface Requirements
8. Requirements Traceability Matrix
9. Appendices

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document defines the functional and non-functional requirements for the HEALTH AI Co-Creation & Innovation Platform. It serves as the authoritative reference for the development team and course instructors, capturing what the system must do and under what constraints it must operate.

### 1.2 Scope

The platform enables structured partner discovery between healthcare professionals and engineers by providing announcement-based collaboration posts, a secure meeting request workflow with NDA acceptance, and an administrative oversight panel. The system does not provide financial transactions, contract management, medical advice, or hosted video meetings. External meeting tools (Zoom, Teams) are used for actual collaboration sessions.

### 1.3 Definitions and Abbreviations

| Term | Definition |
|---|---|
| SRS | Software Requirements Specification |
| RBAC | Role-Based Access Control |
| GDPR | General Data Protection Regulation |
| NDA | Non-Disclosure Agreement |
| JWT | JSON Web Token — used for stateless session management |
| WCAG | Web Content Accessibility Guidelines |
| API | Application Programming Interface |
| REST | Representational State Transfer |
| FR | Functional Requirement |
| NFR | Non-Functional Requirement |
| UC | Use Case |
| MVP | Minimum Viable Product |
| TTL | Time-To-Live (MongoDB index for automatic document expiry) |

### 1.4 Intended Audience

This document is intended for the development team (frontend, backend engineers), the course instructor assessing the project, and future maintainers of the platform.

---

## 2. Overall Description

### 2.1 Product Perspective

Current health-tech innovation collaboration relies on informal networks, conferences, and chance encounters, creating barriers for early-stage projects. The HEALTH AI platform addresses this by providing a structured, privacy-first digital space where engineers and healthcare professionals can announce collaboration needs, discover matching partners, and initiate secure first contact through a governed meeting request workflow.

### 2.2 User Roles

| Role | Description | Key Permissions |
|---|---|---|
| Engineer | Technical professionals (software engineers, ML engineers, biomedical engineers, etc.) seeking healthcare domain expertise | Register, create/edit/delete own posts, browse all posts, send meeting requests, manage profile, export/delete own data |
| Healthcare Professional | Clinicians, researchers, or healthcare domain specialists seeking technical partners | Register, create/edit/delete own posts, browse all posts, send meeting requests, manage profile, export/delete own data |
| Admin | Platform administrators with elevated access | All user permissions plus: view all users, suspend/reactivate accounts, delete any post, view and export audit logs, view platform statistics |

### 2.3 Assumptions and Dependencies

- All users possess a valid institutional `.edu` email address from a recognized university (validated against the Hipo dataset of 9,500+ universities).
- Users have access to a modern web browser with JavaScript enabled.
- The MongoDB database is available and accessible via Docker Compose.
- External meeting platforms (Zoom, Teams) are used for actual meetings; the platform only facilitates scheduling.
- The system is deployed in a Docker containerized environment.

### 2.4 Constraints

- No patient data of any kind is stored on the platform.
- File uploads (documents, images) are not supported in the current version.
- Email notification delivery is planned but not implemented in the current version.
- The platform stores session data in browser `localStorage` only; no tracking cookies are used.
- Audit logs are automatically deleted after 24 months in compliance with GDPR data minimization.

---

## 3. Functional Requirements

### 3.1 User Registration & Access Control

| ID | Requirement Description | Priority | Source |
|---|---|---|---|
| FR-01 | The system shall only allow registration with institutional `.edu` email addresses. The email domain must be present in the Hipo university domain dataset (9,500+ institutions). | High | Brief 4.1 |
| FR-02 | The system shall require users to select a role during registration: Engineer or Healthcare Professional. | High | Brief 4.1 |
| FR-03 | The system shall enforce role-based access control (RBAC). Admin routes shall be accessible only to users with the Admin role. Post editing/deletion shall be restricted to the post author and Admin. | High | Brief 4.1 |
| FR-04 | The system shall issue a JWT upon successful login and require this token for all protected endpoints. | High | Brief 4.1 |
| FR-05 | The system shall allow users to update their profile (name, institution, city, country, bio, expertise tags) via a dedicated profile page. | Medium | Brief 4.1 |
| FR-06 | The system shall allow users to permanently delete their account and all associated data (GDPR right to erasure). | High | Brief 4.1 / GDPR |
| FR-07 | The system shall allow users to export their personal data (profile + posts) as a JSON file (GDPR right to data portability). | High | Brief 4.1 / GDPR |
| FR-08 | The system shall automatically expire user sessions after 30 minutes of inactivity, redirecting the user to the login page. | Medium | Brief 4.1 |
| FR-09 | The system shall prevent login for suspended accounts and display an appropriate error message. | High | Brief 4.1 |

### 3.2 Post Management

| ID | Requirement Description | Priority | Source |
|---|---|---|---|
| FR-10 | The system shall allow authenticated users to create collaboration posts with the following required fields: title, medical domain, expertise required, description, and project stage. | High | Brief 4.2 |
| FR-11 | The system shall support the following optional post fields: commitment level, collaboration type, confidentiality level, city, country, and expiry date. | Medium | Brief 4.2 |
| FR-12 | The system shall support the following post statuses: Draft, Active, Meeting Scheduled, Partner Found, Expired. | High | Brief 4.2 |
| FR-13 | The system shall allow post authors to save a post as a Draft (not visible to other users) before publishing. | Medium | Brief 4.2 |
| FR-14 | The system shall allow the post author (or Admin) to edit any field of a post. | High | Brief 4.2 |
| FR-15 | The system shall allow the post author (or Admin) to delete a post. All associated meeting requests shall be removed with the post. | High | Brief 4.2 |
| FR-16 | The system shall allow the post author to mark a post as "Partner Found", changing the status to Partner Found and preventing further meeting requests. | High | Brief 4.2 |
| FR-17 | The system shall automatically expire posts whose `expiresAt` date has passed, setting their status to Expired via a MongoDB TTL index. | Medium | Brief 4.2 |

### 3.3 Search & Matching

| ID | Requirement Description | Priority | Source |
|---|---|---|---|
| FR-20 | The system shall display all Active and Meeting Scheduled posts to authenticated users on the Dashboard. | High | Brief 4.3 |
| FR-21 | The system shall support full-text keyword search across post title, description, and expertise required fields. | High | Brief 4.3 |
| FR-22 | The system shall support filtering posts by medical domain and project stage. | High | Brief 4.3 |
| FR-23 | The system shall highlight posts from the same city as the logged-in user with a visual badge ("Near You") and a distinct card border. | Medium | Brief 4.3 |

### 3.4 Meeting Request Workflow

| ID | Requirement Description | Priority | Source |
|---|---|---|---|
| FR-30 | The system shall allow authenticated users to send a meeting request to an Active post that is not their own. | High | Brief 4.4 |
| FR-31 | The system shall require NDA acceptance before allowing a meeting request to be submitted. The acceptance shall be recorded in the database. | High | Brief 4.4 |
| FR-32 | The system shall allow the requester to include a message and up to 3 proposed time slots with a meeting request. | Medium | Brief 4.4 |
| FR-33 | The system shall prevent duplicate pending meeting requests (one per user per post). | High | Brief 4.4 |
| FR-34 | The system shall allow the post owner to accept or decline meeting requests. Accepting a request shall require the owner to confirm a meeting date/time, changing the post status to Meeting Scheduled. | High | Brief 4.4 |
| FR-35 | The system shall support meeting request statuses: Pending, Accepted, Declined, Cancelled. | High | Brief 4.4 |

### 3.5 Administrative Dashboard

| ID | Requirement Description | Priority | Source |
|---|---|---|---|
| FR-40 | The system shall provide an Admin Panel accessible only to Admin-role users. | High | Brief 4.5 |
| FR-41 | The Admin Panel shall display platform statistics: total users, engineers, healthcare professionals, total posts, active posts, and closed posts. | Medium | Brief 4.5 |
| FR-42 | The Admin Panel shall allow admins to list, filter (by role and suspension status), and suspend/reactivate user accounts. | High | Brief 4.5 |
| FR-43 | The Admin Panel shall allow admins to list, filter (by domain and status), and permanently delete any post. | High | Brief 4.5 |

### 3.6 Activity Logging & Audit Trail

| ID | Requirement Description | Priority | Source |
|---|---|---|---|
| FR-50 | The system shall log the following events to an audit trail: LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, REGISTER, POST_CREATE, POST_UPDATE, POST_DELETE, POST_CLOSE, MEETING_REQUEST_SENT, MEETING_REQUEST_ACCEPTED, MEETING_REQUEST_DECLINED, ADMIN_SUSPEND_USER, ADMIN_DELETE_POST, PROFILE_UPDATE, ACCOUNT_DELETE, DATA_EXPORT, SECURITY_EVENT. | High | Brief 4.6 |
| FR-51 | Each audit log entry shall record: timestamp, user ID, user email, user role, action type, target entity ID, target entity type, result (SUCCESS/FAILURE), and anonymized IP address (first 3 octets only). | High | Brief 4.6 |
| FR-52 | The Admin Panel shall allow admins to search and filter audit logs by user email, action type, and date range. Logs shall be exportable as a CSV file. | High | Brief 4.6 |
| FR-53 | Audit logs shall be automatically deleted after 24 months via a MongoDB TTL index. | Medium | Brief 4.6 / GDPR |

---

## 4. Non-Functional Requirements

| ID | Requirement | Metric / Target | Category |
|---|---|---|---|
| NFR-01 | Search results shall be returned within a specified time. | < 1.5 seconds for filtered post queries under normal load | Performance |
| NFR-02 | Page load time shall be acceptable for end users. | < 3 seconds for initial dashboard load on broadband | Performance |
| NFR-03 | Passwords shall be stored using a strong hashing algorithm. | bcrypt with cost factor 12 | Security |
| NFR-04 | The system shall use stateless token-based authentication. | JWT signed with HS256; token validity 30 minutes inactivity timeout | Security |
| NFR-05 | The system shall comply with GDPR requirements. | Right to erasure (FR-06), right to portability (FR-07), data minimization, 24-month log retention (FR-53) | GDPR/Privacy |
| NFR-06 | The system shall implement rate limiting on authentication endpoints. | Max 100 requests / 15 minutes per IP on login/register endpoints | Security |
| NFR-07 | The user interface shall be responsive across device sizes. | Fully functional on screen widths ≥ 320px (mobile) through 1920px (desktop) | Usability |
| NFR-08 | The API shall respond with appropriate HTTP status codes and JSON error messages. | 400 for validation errors, 401 for unauthenticated, 403 for forbidden, 404 for not found, 500 for server errors | Usability |

---

## 5. Use Cases

### 5.1 UC-01: Engineer Creates a Collaboration Post

| Field | Description |
|---|---|
| **Name** | UC-01: Engineer Creates a Collaboration Post |
| **Actor(s)** | Engineer (or Healthcare Professional) |
| **Precondition** | The user must be logged in with a valid JWT. |
| **Main Flow** | 1. The user clicks "Post Project" on the Dashboard. 2. The Create Post form is displayed. 3. The user fills in required fields: title, domain, expertise required, description, stage. 4. The user optionally fills in: commitment level, collaboration type, confidentiality, city, country, expiry date. 5. The user clicks "Publish Project". 6. The system creates the post with status "Active" and redirects to My Projects. |
| **Postcondition** | A new post with status Active is visible to all authenticated users on the Dashboard. |
| **Alternative Flow** | 4a. User clicks "Save as Draft" — post is created with status Draft and is not visible to other users. 5a. If a required field is missing, the system displays a validation error and the form is not submitted. |

### 5.2 UC-02: Healthcare Professional Sends a Meeting Request

| Field | Description |
|---|---|
| **Name** | UC-02: Healthcare Professional Sends a Meeting Request |
| **Actor(s)** | Healthcare Professional (or Engineer) |
| **Precondition** | The user is logged in. The target post has status Active. The user has not already sent a pending request to this post. |
| **Main Flow** | 1. The user browses the Dashboard and clicks on a post they are interested in. 2. The Post Detail page loads. 3. The user clicks "Express Interest" in the sidebar. 4. The user writes a message explaining their interest and experience. 5. The user proposes up to 3 available meeting time slots. 6. The user checks the NDA acceptance checkbox. 7. The user clicks "Send Request". 8. The system stores the meeting request with status Pending and logs MEETING_REQUEST_SENT. |
| **Postcondition** | A Pending meeting request is attached to the post. The post owner can view it in the Meeting Requests panel. |
| **Alternative Flow** | 6a. If the NDA checkbox is not checked, the system displays an error: "You must accept the NDA before sending a meeting request." 7a. If the user has already submitted a pending request, the system returns an error: "You already have a pending meeting request for this post." |

### 5.3 UC-03: Post Owner Responds to a Meeting Request

| Field | Description |
|---|---|
| **Name** | UC-03: Post Owner Responds to a Meeting Request |
| **Actor(s)** | Post Owner (Engineer or Healthcare Professional) |
| **Precondition** | The user is logged in. The user is the author of the post. At least one meeting request exists with status Pending. |
| **Main Flow** | 1. The post owner opens their post's detail page. 2. Scrolls to the Meeting Requests panel. 3. Reviews the requester's message and proposed time slots. 4. Clicks "Accept". 5. Enters a confirmed meeting date/time in the date-time picker. 6. Clicks "Confirm Meeting". 7. The system sets the meeting request status to Accepted, stores the confirmed slot, and changes the post status to Meeting Scheduled. The system logs MEETING_REQUEST_ACCEPTED. |
| **Postcondition** | The meeting request status is Accepted. The post status is Meeting Scheduled. The confirmed meeting time is stored. |
| **Alternative Flow** | 4a. Post owner clicks "Decline" — meeting request status changes to Declined. MEETING_REQUEST_DECLINED is logged. Post status remains Active. |

### 5.4 UC-04: Admin Suspends a User Account

| Field | Description |
|---|---|
| **Name** | UC-04: Admin Suspends a User Account |
| **Actor(s)** | Admin |
| **Precondition** | The acting user has the Admin role and is logged in. |
| **Main Flow** | 1. Admin navigates to Admin Panel → Users tab. 2. Optionally filters by role or suspension status. 3. Locates the target user in the table. 4. Clicks "Suspend". 5. The system toggles the user's `isSuspended` flag to true and logs ADMIN_SUSPEND_USER. 6. The suspended user is blocked from logging in. |
| **Postcondition** | The user account is suspended. The user cannot log in and receives a suspension message. |
| **Alternative Flow** | 4a. If the user is already suspended, the button shows "Reactivate". Clicking it sets `isSuspended` to false. |

---

## 6. Data Model

| Entity | Key Fields | Relationships |
|---|---|---|
| **User** | `_id` (ObjectId), `name` (String), `email` (String, unique), `password` (String, hashed), `role` (Engineer / Healthcare Professional / Admin), `institution` (String), `city` (String), `country` (String), `bio` (String, max 500), `expertiseTags` ([String]), `isVerified` (Boolean), `isSuspended` (Boolean), `lastLoginAt` (Date), `createdAt`, `updatedAt` | One User → many Posts (as author); One User → many MeetingRequests (as fromUser) |
| **Post** | `_id` (ObjectId), `title` (String, max 200), `domain` (Enum), `expertiseRequired` (String), `description` (String, max 3000), `stage` (Enum), `commitmentLevel` (Enum), `collaborationType` (Enum), `confidentiality` (Enum), `city` (String), `country` (String), `status` (Enum), `expiresAt` (Date), `author` (ObjectId ref User), `authorEmail`, `authorRole`, `authorName`, `meetingRequests` (embedded), `createdAt`, `updatedAt` | Many Posts → one User (author); One Post → many embedded MeetingRequests |
| **MeetingRequest** (embedded in Post) | `_id` (ObjectId), `fromUser` (ObjectId ref User), `fromName`, `fromEmail`, `fromRole`, `message` (String, max 1000), `ndaAccepted` (Boolean), `proposedSlots` ([String] ISO dates), `status` (Pending / Accepted / Declined / Cancelled), `confirmedSlot` (String), `createdAt`, `updatedAt` | Embedded in Post document; references User via fromUser |
| **AuditLog** | `_id` (ObjectId), `userId` (ObjectId ref User), `userEmail` (String), `userRole` (String), `action` (Enum, 19 types), `targetEntity` (String), `targetType` (String), `result` (SUCCESS / FAILURE), `details` (String), `ipAddress` (String, anonymized), `createdAt` (TTL 24 months) | Standalone collection; references User via userId |

---

## 7. Interface Requirements

### 7.1 User Interface (UI)

The platform is a single-page application (SPA) with the following main screens:

- **Landing Page** — Public homepage with platform description, features, and registration/login CTAs.
- **Registration Page** — Form with name, email (.edu validated), password, role selector, institution, city, country.
- **Login Page** — Form with email and password fields; displays error messages for invalid credentials or suspended accounts.
- **Dashboard** — Post feed with search bar, stage dropdown filter, domain pills filter; "All Projects" and "My Projects" tabs; "Post Project" button.
- **Create/Edit Post** — Multi-field form supporting both create and edit modes (edit mode pre-fills existing data).
- **Post Detail Page** — Full post information, meeting request form (for non-owners), owner controls (Edit, Delete, Mark as Partner Found), Meeting Requests management panel (for owner only).
- **Profile Page** — Editable profile fields, GDPR export button, account deletion section.
- **Admin Panel** — Stats tab, Users tab (with suspend/reactivate), Posts tab (with delete), Logs tab (with CSV export).
- **Privacy Policy Page** — Full GDPR-compliant privacy policy.

### 7.2 External System Interfaces

| System | Interface Type | Purpose |
|---|---|---|
| MongoDB | Database driver (Mongoose ORM) | Persistent data storage for all collections |
| Hipo University Domain Dataset | Static JSON file (9,500+ universities) | Validate `.edu` email domains during registration |
| External Meeting Platforms (Zoom, Teams) | None (link sharing only) | Actual meeting sessions are conducted externally |
| Browser localStorage | Browser Web Storage API | Store JWT token and user profile on client side |

---

## 8. Requirements Traceability Matrix

| Req. ID | Requirement Summary | Source (Brief) | Related Use Case |
|---|---|---|---|
| FR-01 | .edu email restriction with Hipo dataset | Brief 4.1 | UC-01, UC-02 |
| FR-02 | Role selection at registration | Brief 4.1 | UC-01, UC-02 |
| FR-03 | RBAC enforcement | Brief 4.1 | UC-01, UC-02, UC-03, UC-04 |
| FR-04 | JWT authentication | Brief 4.1 | UC-01, UC-02, UC-03, UC-04 |
| FR-05 | Profile editing | Brief 4.1 | — |
| FR-06 | Account deletion (GDPR) | Brief 4.1 / GDPR | — |
| FR-07 | Data export (GDPR) | Brief 4.1 / GDPR | — |
| FR-08 | Session timeout (30 min) | Brief 4.1 | UC-01, UC-02, UC-03 |
| FR-09 | Suspended account login block | Brief 4.1 | UC-04 |
| FR-10 | Post creation (required fields) | Brief 4.2 | UC-01 |
| FR-11 | Post optional fields | Brief 4.2 | UC-01 |
| FR-12 | Post lifecycle statuses | Brief 4.2 | UC-01, UC-03 |
| FR-13 | Draft mode | Brief 4.2 | UC-01 |
| FR-14 | Post editing | Brief 4.2 | UC-01 |
| FR-15 | Post deletion | Brief 4.2 | UC-01 |
| FR-16 | Mark as Partner Found | Brief 4.2 | UC-03 |
| FR-17 | Post auto-expiry | Brief 4.2 | — |
| FR-20 | Post feed display | Brief 4.3 | UC-02 |
| FR-21 | Full-text keyword search | Brief 4.3 | UC-02 |
| FR-22 | Domain and stage filters | Brief 4.3 | UC-02 |
| FR-23 | City-based matching highlight | Brief 4.3 | UC-02 |
| FR-30 | Send meeting request | Brief 4.4 | UC-02 |
| FR-31 | NDA acceptance | Brief 4.4 | UC-02 |
| FR-32 | Message + time slots | Brief 4.4 | UC-02 |
| FR-33 | Duplicate request prevention | Brief 4.4 | UC-02 |
| FR-34 | Accept meeting + confirm slot | Brief 4.4 | UC-03 |
| FR-35 | Meeting request statuses | Brief 4.4 | UC-02, UC-03 |
| FR-40 | Admin Panel access | Brief 4.5 | UC-04 |
| FR-41 | Platform statistics | Brief 4.5 | UC-04 |
| FR-42 | User suspend/reactivate | Brief 4.5 | UC-04 |
| FR-43 | Admin post deletion | Brief 4.5 | UC-04 |
| FR-50 | Audit event logging | Brief 4.6 | UC-01, UC-02, UC-03, UC-04 |
| FR-51 | Audit log fields | Brief 4.6 | — |
| FR-52 | Log search and CSV export | Brief 4.6 | UC-04 |
| FR-53 | Log auto-deletion (24 months) | Brief 4.6 / GDPR | — |
| NFR-01 | Search < 1.5s | Brief 5 | UC-02 |
| NFR-02 | Page load < 3s | Brief 5 | UC-01 |
| NFR-03 | bcrypt password hashing | Brief 5 | UC-01 |
| NFR-04 | JWT session management | Brief 5 | UC-01–04 |
| NFR-05 | GDPR compliance | Brief 5 / GDPR | FR-06, FR-07, FR-53 |
| NFR-06 | Rate limiting | Brief 5 | — |
| NFR-07 | Responsive UI | Brief 5 | All UCs |
| NFR-08 | Proper HTTP error codes | Brief 5 | All UCs |

---

## 9. Appendices

### A. Supported Medical Domains

Cardiology · Radiology · Neurology · General Surgery · Software Development · Genomics · Oncology · Orthopedics · Ophthalmology · Psychiatry · Other

### B. Supported Project Stages

Idea · Concept Validation · Prototype · Pilot Testing · Pre-Deployment · MVP

### C. Post Status Transitions

Draft → Active (publish) → Meeting Scheduled (request accepted) → Partner Found (owner closes) / Active → Expired (TTL)

### D. Meeting Request Status Transitions

Pending → Accepted (owner confirms slot) → post becomes Meeting Scheduled
Pending → Declined (owner declines)
