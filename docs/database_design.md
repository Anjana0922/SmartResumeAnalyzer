# Smart Resume Analyzer - Database Design

1. Users Table

Attributes:
- user_id (Primary Key)
- full_name
- email
- password
- phone
- user_category
- created_at


2. Resume Table

Attributes:
- resume_id (Primary Key)
- user_id (Foreign Key)
- file_name
- file_path
- upload_date
- status


3. Resume Details Table

Attributes:
- detail_id (Primary Key)
- resume_id (Foreign Key)
- name
- email
- phone
- education
- skills
- projects
- experience
- certifications
- achievements
- languages
- github
- linkedin
- about
- custom_sections
- metadata


4. Resume Analysis Table

Attributes:
- analysis_id (Primary Key)
- resume_id (Foreign Key)
- overall_score
- suggestions


5. Portfolio Table

Attributes:
- portfolio_id (Primary Key)
- resume_id (Foreign Key)
- template_name
- portfolio_link
- html_path
- generated_date


Relationships:

- One User can upload multiple Resumes.
- One Resume has one Resume Details entry.
- One Resume has one Resume Analysis entry.
- One Resume can have multiple Portfolio templates.