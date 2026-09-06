# RisePath

> Peer mentorship for career, focus, and confidence.

RisePath is a mobile-first mentorship platform designed to connect students aged **17–23** with relatable peer mentors aged **24–30**. It focuses on helping students navigate career uncertainty, distractions, low confidence, and the transition into adult life.

🔗 **Live demo:** https://rise-path-connect.vercel.app/

---

## Problem

Many students struggle with:

- Finding a clear career direction
- Staying focused and overcoming distraction
- Building confidence and managing self-doubt
- Accessing guidance that feels relatable rather than generic

RisePath connects them with mentors who have recently faced similar challenges and can provide practical, human support.

---

## Features

### For students

- Guided mentor-matching flow with three quick questions
- Support areas for career clarity, focus, and confidence
- Mentor profiles and personalised matching experience
- Mentor-request submission flow
- Waitlist signup

### For mentors

- Mentor application flow
- Availability and profile inputs
- Opportunity to support students through one-to-one peer mentorship

### Admin dashboard

- Private admin interface
- View mentor applications
- Review student mentor requests
- Track waitlist signups
- Authentication-based access control

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML | Application structure and UI |
| CSS | Mobile-first responsive design and animations |
| JavaScript | Client-side interactions and user flows |
| Supabase | Database, authentication, and data storage |
| PostgreSQL / PLpgSQL | Database schema and policies |
| Vercel | Deployment and hosting |

---

## Project Structure

```text
RisePath/
├── index.html             # Main public-facing student and mentor experience
├── admin.html             # Private admin dashboard
├── risepath-config.js     # App configuration and Supabase connection settings
├── risepath-data.js       # Shared authentication and data-storage layer
├── supabase-schema.sql    # Supabase tables and security policies
├── SETUP.md               # Detailed setup notes
└── vercel.json            # Vercel deployment configuration
```

---

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/vedp9/RisePath.git
cd RisePath
```

2. Create a Supabase project.

3. Open the Supabase SQL Editor and run:

```text
supabase-schema.sql
```

4. Update `risepath-config.js` with your Supabase project URL, anon key, and admin email.

5. In Supabase Authentication:

- Enable Email / Magic Link authentication
- Add your deployed `admin.html` URL to the allowed redirect URLs

6. Run the application locally using a static server, for example:

```bash
python3 -m http.server 8000
```

7. Open:

```text
http://localhost:8000
```

---

## Deployment

This project can be deployed as a static website using Vercel.

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Deploy with the default static-site settings.
4. Add your production admin URL to Supabase Auth redirect URLs.

---

## Security Note

This is an MVP. The public frontend communicates with Supabase using an anon key, which is appropriate for prototyping when Row Level Security policies are correctly configured.

Before production, consider adding:

- Server-side APIs or Supabase Edge Functions for sensitive writes
- Rate limiting and bot protection
- Stronger input validation
- Email verification and moderation workflows
- Error monitoring and analytics
- A safer approach for administrator configuration

---

## Future Improvements

- Real mentor-matching algorithm
- Session scheduling and calendar integration
- In-app chat or messaging
- Mentor verification and profile review
- Progress tracking for student goals
- Notifications and reminder system
- Mentor ratings and feedback
- Analytics dashboard for engagement and outcomes

---

## Author

Built by [Veda Praneeth](https://github.com/vedp9)
