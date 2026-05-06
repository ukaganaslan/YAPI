# User Guide
## HEALTH AI Co-Creation & Innovation Platform

| Field | Value |
|---|---|
| Project Name | HEALTH AI Co-Creation & Innovation Platform |
| Course | SENG 430 |
| Group No / Name | Eagles |
| Submission Date | 06/05/2026 |
| Version | 1.0 |

### Revision History

| Date | Version | Change Description | Author |
|---|---|---|---|
| 06/05/2026 | 1.0 | Initial version | Eagles Group |

---

## Table of Contents

1. Introduction
2. Getting Started
3. Post Management
4. Search & Partner Discovery
5. Meeting Request Process
6. Profile Management
7. Admin Panel
8. Notifications
9. Frequently Asked Questions (FAQ)
10. Troubleshooting
11. Contact & Support

---

## 1. Introduction

### 1.1 Document Purpose

This User Guide provides step-by-step instructions for all user roles to effectively use the HEALTH AI Co-Creation & Innovation Platform. It covers registration, post management, partner discovery, the meeting request workflow, profile management, and the administrative panel.

### 1.2 Target Audience

| User Role | Description | Relevant Sections |
|---|---|---|
| Engineer | Creates posts, searches for healthcare partners | Sections 2–6, 8 |
| Healthcare Professional | Browses posts, sends meeting requests | Sections 2–6, 8 |
| Admin | Manages users, posts, and views system logs | Sections 2, 7 |

### 1.3 Platform Overview

HEALTH AI is a secure, GDPR-compliant web platform designed to eliminate randomness in health-tech innovation. It connects engineers and healthcare professionals through structured announcement-based partner discovery. Users register with institutional .edu email addresses, post collaboration opportunities, and initiate first contact through a secure meeting request workflow with NDA acceptance. The platform facilitates the first contact only — meetings are conducted externally via Zoom or Teams.

### 1.4 System Requirements

| Requirement | Details |
|---|---|
| Web Browser | Google Chrome (latest), Firefox (latest), Edge (latest), Safari (latest) |
| Internet Connection | Stable broadband connection required |
| Screen Resolution | Minimum 1280×720, recommended 1920×1080 |
| Email | A valid institutional .edu email address is required for registration |

---

## 2. Getting Started

### 2.1 Registration

| Step | Description |
|---|---|
| 1 | Navigate to `http://localhost:5173` (or the deployed URL) in your web browser. |
| 2 | Click the **"Get Started"** button on the homepage navigation bar. |
| 3 | Enter your full name and your **institutional .edu email address** (e.g., `yourname@university.edu`). Only emails from accredited universities are accepted — the platform validates against a database of 9,500+ institutional domains. |
| 4 | Choose a password of at least 6 characters. |
| 5 | Select your role: **Engineer** or **Healthcare Professional**. |
| 6 | Optionally enter your institution, city, and country. |
| 7 | Click **"Create Account"**. You will be automatically redirected to your Dashboard. |

> **Note:** Personal email providers (Gmail, Outlook, Yahoo, etc.) are not accepted. Only valid `.edu` institutional emails are permitted.

### 2.2 Login

| Step | Description |
|---|---|
| 1 | Navigate to the HEALTH AI platform URL and click **"Sign In"** in the navigation bar. |
| 2 | Enter your registered .edu email address and password. |
| 3 | Click **"Sign In"**. You will be redirected to your Dashboard. |

> **Security:** Sessions automatically expire after **30 minutes of inactivity**. You will be redirected to the login page automatically.

### 2.3 Dashboard Overview

After login, you are taken to the **Research Projects Dashboard**. The dashboard consists of:

- **Navigation Bar (top):** Logo, Dashboard link, New Project link, Admin Panel link (Admin only), and your profile avatar with a dropdown menu.
- **Page Header:** Title, total project count, and a "Post Project" button.
- **Tabs:** "All Projects" — shows all active posts from all users; "My Projects" — shows only your own posts.
- **Search & Filters:** A search bar for keyword search, a Stage dropdown, and Domain filter pills.
- **Post Cards:** Each card shows the domain, status, title, stage, city (if set), expertise needed, and a "Near You" badge if the post's city matches yours.

---

## 3. Post Management

### 3.1 Creating a New Post

| Step | Description |
|---|---|
| 1 | Click the **"Post Project"** button on the Dashboard or **"New Project"** in the navigation bar. |
| 2 | Fill in all required fields (see Section 3.2 below). |
| 3 | Choose to **"Save as Draft"** (not visible to others) or **"Publish Project"** (immediately visible). |
| 4 | Click your chosen action. You will be redirected to **My Projects**. |

### 3.2 Post Form Fields

| Field | Description | Required | Example |
|---|---|---|---|
| Project Title | A clear, descriptive title | Yes | "AI-Powered ECG Arrhythmia Detection" |
| Medical Domain | The medical or engineering domain | Yes | Cardiology, Radiology, Neurology, etc. |
| Expertise Needed | The expertise you are looking for | Yes | "Machine Learning, Signal Processing" |
| Project Stage | Current stage of the project | Yes | Idea / Concept Validation / Prototype / Pilot Testing / Pre-Deployment / MVP |
| Project Description | Detailed description (min. 30 characters) | Yes | Free text up to 500 characters |
| Commitment Level | Expected time commitment from the partner | No | Low / Medium / High / Full-Time |
| Collaboration Type | Type of collaboration sought | No | Advisor / Co-Founder / Research Partner / Contractor |
| Confidentiality | Level of information disclosed publicly | No | Public / Details in Meeting |
| City | Your location for city-based matching | No | Boston, Ankara, etc. |
| Country | Your country | No | United States, Turkey, etc. |
| Expiry Date | Date after which the post auto-expires | No | Any future date |

### 3.3 Editing a Post

| Step | Description |
|---|---|
| 1 | Open the post from the Dashboard or **"My Projects"** tab. |
| 2 | Click the **"Edit"** button (pencil icon) in the post header. |
| 3 | Modify the desired fields. |
| 4 | Click **"Save Changes"**. |

> Only the post's author (or an Admin) can edit a post.

### 3.4 Post Status Guide

| Status | Meaning | Visual Indicator |
|---|---|---|
| Draft | Post is saved but not visible to other users | Gray badge |
| Active | Post is published and visible. Other users can express interest. | Green badge with pulse dot |
| Meeting Scheduled | A meeting request has been accepted. | Blue badge |
| Partner Found | A collaboration partner has been found. Post is closed. | Purple badge |
| Expired | Post has passed its expiry date. | Red badge |

### 3.5 Marking Partner Found

| Step | Description |
|---|---|
| 1 | Open the post for which you found a partner. |
| 2 | In the right-hand sidebar, click **"✓ Mark as Partner Found"**. |
| 3 | The post status changes to **"Partner Found"** and will no longer accept new meeting requests. |

### 3.6 Deleting a Post

| Step | Description |
|---|---|
| 1 | Open the post from the Dashboard. |
| 2 | Click the **"Delete"** button (trash icon) in the post header. |
| 3 | A confirmation dialog appears. Click **"Delete"** to permanently remove the post. |

> This action cannot be undone. All associated meeting requests are also removed.

---

## 4. Search & Partner Discovery

### 4.1 Browsing Posts

The Dashboard displays all **Active** and **Meeting Scheduled** posts from the entire platform. Click any post card to view its full details, including description, expertise sought, collaboration type, and commitment level.

### 4.2 Filtering Options

| Filter | Description |
|---|---|
| Search bar | Full-text search across post title, description, and expertise required |
| Stage dropdown | Filter by project stage (Idea, Prototype, MVP, etc.) |
| Domain pills | Filter by medical/engineering domain (Cardiology, Radiology, Software Development, etc.) |

### 4.3 City-Based Matching

When your profile includes a **City**, the Dashboard automatically highlights posts from the same city with:

- A **green border** around the post card
- A **"📍 Near You"** badge next to the domain tag

This helps you identify potential partners in your geographic area. To enable this feature, add your city in your Profile page (see Section 6.1).

---

## 5. Meeting Request Process

### 5.1 Expressing Interest

| Step | Description |
|---|---|
| 1 | Open the post detail page of a post you are interested in. |
| 2 | Click **"Express Interest"** in the right-hand sidebar. |
| 3 | Write a short message introducing yourself and explaining your interest. |
| 4 | Optionally propose up to **3 available time slots** for the meeting. |
| 5 | Accept the NDA (see Section 5.2). |
| 6 | Click **"Send Request"**. |

> You cannot send a meeting request to your own post. Only one pending request per post per user is allowed.

### 5.2 NDA Acceptance

Before submitting a meeting request, you must check the **NDA acceptance checkbox**:

> *"I accept the Non-Disclosure Agreement and understand that sensitive project details will only be shared in the meeting."*

This is mandatory. The NDA acceptance is logged in the platform's audit system.

### 5.3 Proposing & Accepting Time Slots

| Step | Description |
|---|---|
| 1 | The **requester** proposes up to 3 preferred date/time slots when sending the request. |
| 2 | The **post owner** opens the post detail page and scrolls to the **Meeting Requests** section. |
| 3 | The owner reviews the request message and proposed slots, then clicks **"Accept"**. |
| 4 | The owner enters a **confirmed meeting date/time** and clicks **"Confirm Meeting"**. |
| 5 | The post status changes to **"Meeting Scheduled"**. |

To **decline** a request, the post owner clicks **"Decline"** on the meeting request card.

> **Note:** Meetings take place externally (Zoom, Teams, Google Meet, etc.). The platform does not host or record meetings.

### 5.4 After the Meeting

After the external meeting, if a collaboration is formed:

1. The post owner opens their post.
2. Clicks **"✓ Mark as Partner Found"**.
3. The post is closed and removed from active listings.

If no collaboration is formed, the post remains **Active** and continues to accept new meeting requests.

---

## 6. Profile Management

### 6.1 Editing Your Profile

| Step | Description |
|---|---|
| 1 | Click your avatar in the top-right navigation bar. |
| 2 | Select **"Profile & Settings"** from the dropdown menu. |
| 3 | Update your **Full Name**, **Institution**, **City**, **Country**, **Bio**, or **Expertise Tags**. |
| 4 | Click **"Save Changes"**. |

> **Tip:** Adding your city enables the city-based matching feature on the Dashboard (Section 4.3).

Fields editable in profile:
- Full Name
- Institution
- City
- Country
- Bio (max 500 characters)
- Expertise Tags (comma-separated, e.g., "Machine Learning, Python, Computer Vision")

> Your **email address** and **role** cannot be changed after registration.

### 6.2 Deleting Your Account (GDPR)

| Step | Description |
|---|---|
| 1 | Navigate to **Profile & Settings** via the top-right menu. |
| 2 | Scroll to the **"Privacy & Data"** section. |
| 3 | Click **"Delete"** under "Delete Account". |
| 4 | A confirmation dialog appears warning that the action is permanent. |
| 5 | Click **"Delete Forever"** to permanently delete your account and all associated data. |

Under GDPR Article 17, users have the **Right to Erasure**. All personal data, posts, and meeting request records are permanently removed upon account deletion.

### 6.3 Exporting Your Data

| Step | Description |
|---|---|
| 1 | Navigate to **Profile & Settings**. |
| 2 | Scroll to the **"Privacy & Data"** section. |
| 3 | Click **"Export"** under "Export My Data". |
| 4 | A JSON file (`healthai-my-data.json`) is downloaded to your device. |

The export file contains:
- Your full profile information
- All posts you have created

This fulfills the GDPR **Right to Data Portability** (Article 20).

---

## 7. Admin Panel

> This section is only available to users with the **Admin** role.

To access the Admin Panel, click **"Admin Panel"** in the navigation bar or the profile dropdown menu.

### 7.1 Post Management

| Step | Description |
|---|---|
| 1 | Navigate to **Admin Panel → Posts** tab. |
| 2 | Use the **Status** dropdown to filter posts by Active, Draft, Meeting Scheduled, Partner Found, or Expired. |
| 3 | Browse the posts table showing: title, domain, author email, status, and creation date. |
| 4 | Click **"Delete"** to permanently remove an inappropriate post. A confirmation dialog appears before deletion. |

### 7.2 User Management

| Step | Description |
|---|---|
| 1 | Navigate to **Admin Panel → Users** tab. |
| 2 | Use the **Role** dropdown (Engineer / Healthcare Professional / Admin) and **Status** dropdown (Active / Suspended) to filter users. |
| 3 | The users table shows: name, email, role, institution, status, and registration date. |
| 4 | Click **"Suspend"** to suspend a user account. The button toggles to **"Reactivate"** for already suspended accounts. |

> Suspended users cannot log in and will receive a "Your account has been suspended" message.

### 7.3 Activity Logs & Statistics

**Statistics tab:**

The Stats tab displays platform-wide metrics:
- Total Users
- Engineers
- Healthcare Professionals
- Total Posts
- Active Posts
- Partners Found

**Logs tab:**

| Step | Description |
|---|---|
| 1 | Navigate to **Admin Panel → Logs** tab. |
| 2 | Use the **Search** field to filter by user email or keywords. |
| 3 | Use the **Action** dropdown to filter by event type (LOGIN_SUCCESS, POST_CREATE, MEETING_REQUEST_SENT, etc.). |
| 4 | Review the log entries showing: timestamp, user email, action, result, details, and anonymized IP. |
| 5 | Click **"Export CSV"** to download all filtered logs as a CSV file. |

> Audit logs are retained for **24 months** and then automatically deleted. Only Admin users can access logs.

---

## 8. Notifications

> **Note:** In-app and email notification delivery is currently in development. The following table describes the planned notification types per the platform specification.

| Notification Type | Description | Channel |
|---|---|---|
| Interest Received | Someone expressed interest in your post | Email / In-App |
| Meeting Request | A meeting request has been sent or received | Email / In-App |
| Meeting Confirmed | A meeting time has been accepted by both parties | Email / In-App |
| Post Status Changed | A post you're involved with changed status | In-App |
| Account Activity | Login from new device, password change, etc. | Email |

---

## 9. Frequently Asked Questions (FAQ)

| Question | Answer |
|---|---|
| My .edu email is not accepted. What should I do? | Ensure you are using an institutional email with a `.edu` extension. The platform validates against a database of 9,500+ known university domains. If your institution is not recognized, contact support. |
| Can I edit a published post? | Yes. Open the post detail page and click the **"Edit"** button. You can edit any field while the post is in Active or Draft status. |
| How do I delete my account and all my data? | Go to **Profile & Settings → Privacy & Data → Delete Account**. This action is permanent and cannot be undone. |
| Are meetings held on the platform? | No. Meetings are conducted on external platforms (Zoom, Teams, Google Meet, etc.). The platform only facilitates scheduling and first contact. |
| Can I send multiple meeting requests? | You can send one pending meeting request per post. Once accepted or declined, you may send a new request to a different post. |
| What happens when a post expires? | Posts with an expiry date are automatically removed from active listings when the date passes. The post status changes to "Expired". |
| Can I have multiple active posts? | Yes. There is no limit on the number of active posts per user. |
| What is the NDA checkbox for? | Before sending a meeting request, you must acknowledge the Non-Disclosure Agreement. This confirms you understand that confidential project details will only be shared during the meeting, not on the platform. |
| My session ended unexpectedly. | The platform automatically logs out users after **30 minutes of inactivity** for security purposes. Simply log in again. |
| Can I change my role after registration? | No. Your role (Engineer or Healthcare Professional) is set at registration and cannot be changed. Contact an administrator if a role change is required. |

---

## 10. Troubleshooting

| Problem | Possible Cause | Solution |
|---|---|---|
| Page is not loading | Internet connection issue or server downtime | Check your connection. Refresh the page. Try again in a few minutes. |
| Session closed unexpectedly | 30-minute inactivity timeout | Log in again. |
| Filters return no results | No posts match the selected criteria | Try broader filter settings or click "Clear all filters". |
| Cannot submit meeting request | Post is no longer Active, or you haven't accepted the NDA | Refresh the post page and check the NDA checkbox. Verify the post status is "Active". |
| .edu email not accepted | Email domain not in the university database | Use your official institutional email. Contact support if the domain is missing. |
| "Email already registered" error | An account exists with that email | Use the Sign In page instead. Use a different email if you need a new account. |
| Export button does nothing | Browser blocking file downloads | Check your browser's download settings and allow downloads from this site. |
| Admin panel not visible | Your account does not have the Admin role | Contact an existing administrator to grant Admin access. |

---

## 11. Contact & Support

| Channel | Details |
|---|---|
| Platform Admin | Contact the platform administrator via the Admin Panel. |
| Privacy / GDPR Requests | Use the Profile → Export My Data or Profile → Delete Account features for self-service data rights. For other GDPR inquiries, contact the platform administrator. |
| Bug Reports | Report issues to the development team via the project repository. |

---

## 12. Appendices

### A. Supported Medical Domains

Cardiology · Radiology · Neurology · General Surgery · Software Development · Genomics · Oncology · Orthopedics · Ophthalmology · Psychiatry · Other

### B. Supported Project Stages

Idea · Concept Validation · Prototype · Pilot Testing · Pre-Deployment · MVP

### C. Collaboration Types

Advisor · Co-Founder · Research Partner · Contractor

### D. Commitment Levels

Low · Medium · High · Full-Time

### E. Audit Log Event Types

| Event | Description |
|---|---|
| LOGIN_SUCCESS | Successful user login |
| LOGIN_FAILED | Failed login attempt |
| REGISTER | New account created |
| POST_CREATE | New post published |
| POST_UPDATE | Post edited |
| POST_DELETE | Post deleted |
| POST_CLOSE | Post marked as Partner Found |
| MEETING_REQUEST_SENT | Meeting request submitted |
| MEETING_REQUEST_ACCEPTED | Meeting request accepted by post owner |
| MEETING_REQUEST_DECLINED | Meeting request declined by post owner |
| PROFILE_UPDATE | User profile updated |
| ADMIN_SUSPEND_USER | User account suspended by admin |
| ADMIN_DELETE_POST | Post removed by admin |
| DATA_EXPORT | User exported their personal data |
| ACCOUNT_DELETE | User account permanently deleted |
| SECURITY_EVENT | Security-related platform event |
