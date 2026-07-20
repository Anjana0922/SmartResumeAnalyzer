# Database Design

## Users Table
- user_id
- full_name
- email
- password
- phone

## Resume Table
- resume_id
- user_id
- file_name
- upload_date

## Resume Details Table
- detail_id
- resume_id
- education
- skills
- projects
- experience
- certifications

## Resume Analysis Table
- analysis_id
- resume_id
- overall_score
- recommendations

## Portfolio Table
- portfolio_id
- resume_id
- template_name
- portfolio_link
