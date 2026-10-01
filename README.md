# Smart Resume Analyzer and Portfolio Generator

### Analyze your resume, improve its ATS compatibility, and generate a professional portfolio from your resume.

**Smart Resume Analyzer and Portfolio Generator** is a web-based career platform that brings multiple resume and professional portfolio tools together in one application.

The system allows users to create and manage resumes, upload and analyze existing resumes, evaluate ATS compatibility, receive improvement suggestions, generate an ATS-friendly version of a resume, and create a professional portfolio from resume information.

Instead of using separate applications for each task, Smart Resume Analyzer and Portfolio Generator provides these activities through a single platform.

---

## 📌 Project Overview

A resume is one of the most important documents used during the job application process. However, creating a good resume involves more than simply entering personal and educational information.

A resume should:

- Present information in a clear and structured way.
- Contain relevant professional information.
- Be readable by Applicant Tracking Systems (ATS).
- Use appropriate sections and keywords.
- Maintain a professional format.
- Represent the candidate consistently across different platforms.

Smart Resume Analyzer and Portfolio Generator addresses these requirements by combining **resume creation, resume analysis, ATS optimization and portfolio generation** into one application.

---

## 🎯 Objectives

The main objectives of Smart Resume Analyzer and Portfolio Generator are:

1. To provide a simple platform for creating and managing resumes.
2. To extract structured information from uploaded resumes.
3. To analyze resumes for ATS compatibility.
4. To provide meaningful suggestions for improving resumes.
5. To generate an ATS-friendly version of a resume.
6. To automatically generate a professional portfolio from resume information.
7. To maintain consistency between resume information and the generated portfolio.
8. To provide authentication so users can access their own application features.

---

## ✨ Main Features

### 1. Resume Creation

Users can create and organize their professional resume information through the application.

The resume can contain information such as:

- Personal information
- Professional title
- Professional summary
- Education
- Skills
- Experience
- Projects
- Certifications
- Achievements
- Languages
- Other relevant information

---

### 2. Resume Upload and Extraction

Users can upload an existing resume to the application.

The system processes the uploaded resume and extracts relevant information into structured resume data.

The extracted information can then be used by other modules of the application.

The system is designed to handle resumes where information may be arranged in different layouts, including multi-column resumes.

---

### 3. ATS Analyzer

The ATS Analyzer evaluates the uploaded resume and generates an ATS compatibility score.

The analysis considers information such as:

- Resume structure
- Standard sections
- Skills
- Education
- Experience
- Certifications
- Contact information
- Other relevant resume content

The result is presented through an easy-to-understand score and analysis interface.

---

### 4. ATS Improvement Suggestions

After analyzing the resume, the system provides suggestions that can help improve the resume.

Examples include recommendations related to:

- Resume structure
- Missing information
- Skills
- Section organization
- Professional presentation
- ATS readability

The purpose is to help users understand areas that may be improved rather than simply displaying a numerical score.

---

### 5. ATS-Friendly Resume Generation

Smart Resume Analyzer and Portfolio Generator can generate an ATS-friendly version of an uploaded resume.

The generated version:

- Uses a clean single-column structure.
- Uses machine-readable/selectable text.
- Avoids unnecessary decorative elements.
- Uses standard resume sections.
- Preserves information extracted from the user's actual resume.
- Dynamically generates content from structured resume data.
- Does not use hardcoded candidate information.

This allows information from a visually complex resume to be presented in a cleaner ATS-compatible format.

---

### 6. Portfolio Generation

The application can transform structured resume information into a professional portfolio website.

The generated portfolio can include:

- Name and professional title
- Contact information
- About/profile information
- Education
- Experience
- Skills
- Certifications
- Languages
- Projects
- Other available resume information

The portfolio is generated using the user's actual resume data rather than requiring the user to manually enter the same information again.

---

### 7. Portfolio Templates

Users can select from available portfolio presentation options and customize how their professional information is displayed.

The objective is to provide a professional online representation of the information already present in the resume.

---

### 8. Authentication

The application provides user authentication through a login/signup flow.

The general flow is:

```text
Landing Page
      ↓
Get Started
      ↓
Login / Sign Up
      ↓
Authenticated User
      ↓
Dashboard
```

Users are required to go through the login interface rather than being automatically sent directly into the application from the landing page.

---

## 🔄 Complete Application Workflow

The overall application workflow can be represented as:

```text
       SMART RESUME ANALYZER & PORTFOLIO GENERATOR
                       │
             ┌─────────┴─────────┐
             │                   │
       Create Resume        Upload Resume
             │                   │
             │             Extract Information
             │                   │
             └─────────┬─────────┘
                       ↓
                Structured Data
                       ↓
                ATS Analysis
                       ↓
              ATS Score & Suggestions
                       ↓
              Improve Resume
                       ↓
             ATS-Friendly Resume
                       │
                       ↓
              Generate Portfolio
                       ↓
              Professional Profile
```

The application therefore follows the overall concept:

> **Create → Analyze → Improve → Present**

---

## 🛠️ Technologies Used

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- REST API

### Database

- SQLite

### Resume Processing

The backend uses resume-processing and text-extraction services to convert uploaded resume documents into structured information.

### PDF Generation

The application generates ATS-friendly PDF documents using a vector text layer so that the resulting content remains selectable and machine-readable.

### Authentication

The application includes user authentication for accessing the platform.

---

## 🏗️ System Architecture

The application follows a frontend-backend architecture.

```text
┌─────────────────────────────┐
│          Frontend           │
│        React + Vite         │
│                             │
│  Resume │ ATS │ Portfolio   │
└──────────────┬──────────────┘
               │
             HTTP/API
               │
┌──────────────▼──────────────┐
│           Backend           │
│       Node.js + Express     │
│                             │
│ Resume Processing           │
│ ATS Analysis                │
│ PDF Generation              │
│ Authentication              │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│          Database           │
│            SQLite           │
└─────────────────────────────┘
```

---

## 📂 Project Structure

```text
SmartResumeAnalyzer/
│
├── backend/
│   ├── routes/
│   │   └── atsRoutes.js
│   │
│   ├── services/
│   │   ├── aiParserService.js
│   │   ├── atsAnalyzerService.js
│   │   └── pdfService.js
│   │
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── databases/
│   └── SmartResumeAnalyzer.db
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ats/
│   │   │   └── portfolio/
│   │   │
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- Git

---

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SmartResumeAnalyzer
```

---

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Add the required environment variables used by the application, such as the configured API key for the parsing service.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

Do not commit private API keys to GitHub.

---

### 4. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

### 5. Start the Backend

From the `backend` directory:

```bash
node server.js
```

The backend runs on the configured backend port.

---

### 6. Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

The Vite development server will provide the local frontend URL.

---

## ▶️ How to Use

### Step 1 — Open the Application

Open the application and view the Smart Resume Analyzer and Portfolio Generator landing page.

### Step 2 — Login or Sign Up

Click **Get Started** and enter the login/signup flow.

### Step 3 — Create or Upload a Resume

The user can either create resume information through the application or upload an existing resume.

### Step 4 — Analyze the Resume

Open the ATS Analyzer to receive an ATS compatibility score and suggestions.

### Step 5 — Improve the Resume

Use the suggestions to identify areas that can be improved.

### Step 6 — Generate ATS-Friendly Resume

Generate and download a clean ATS-friendly PDF version.

### Step 7 — Generate Portfolio

Use the structured resume information to generate a professional portfolio.

---

## 🔐 Data and Security Considerations

The project uses environment variables for sensitive configuration such as API keys.

Sensitive information such as:

- API keys
- passwords
- private credentials

should not be committed to the Git repository.

A `.gitignore` file should be used to exclude environment files and temporary uploaded files where appropriate.

---

## 📊 Example Application Flow

```text
User
 │
 ▼
Smart Resume Analyzer
 │
 ▼
Login / Sign Up
 │
 ▼
Dashboard
 │
 ├── Create Resume
 │
 ├── Upload Resume
 │       │
 │       ▼
 │   Resume Extraction
 │       │
 │       ▼
 │   Structured Resume Data
 │       │
 │       ├── ATS Analyzer
 │       │       │
 │       │       ├── ATS Score
 │       │       └── Suggestions
 │       │
 │       ├── ATS-Friendly Resume
 │       │
 │       └── Portfolio Generator
 │
 ▼
Professional Profile
```

---

## 🎓 Academic Project

**Project Type:** MCA Mini Project

**Project Name:** Smart Resume Analyzer and Portfolio Generator

The project demonstrates the integration of:

- Web application development
- Frontend development
- Backend API development
- Database management
- Document processing
- Resume analysis
- ATS evaluation
- PDF generation
- Portfolio generation
- User authentication

---

## 🚀 Future Enhancements

Possible future improvements include:

- Additional resume templates
- Additional portfolio templates
- More advanced resume analytics
- Job-description-based ATS matching
- Keyword comparison between resumes and job descriptions
- More customization options for generated portfolios
- Cloud deployment
- Improved user profile management
- Additional export formats

---

## ⚠️ Current Scope

Smart Resume Analyzer and Portfolio Generator is designed as an academic project demonstrating an integrated approach to resume creation, resume analysis, ATS optimization and portfolio generation.

The ATS score and recommendations should be treated as guidance rather than a guarantee of acceptance by any particular company's Applicant Tracking System.

---

## 👩‍💻 Author

**Anjana M**

MCA Student

Rajiv Gandhi Institute of Technology

---

## 📄 License

This project is developed as an academic project.