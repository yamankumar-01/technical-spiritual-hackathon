-- ============================================================================
-- Techno Spiritual Hackathon (TSH) 2026 - PostgreSQL Seed Data
-- 50 Official Problem Statements, Default Admin & Sample Accounts
-- ============================================================================

-- 1. Insert Default Administrator (tsh@admin / srcjecrc@123)
INSERT INTO users (name, email, password_hash, role, phone, college)
VALUES 
  (
    'TSH Administrator', 
    'tsh@admin', 
    -- Verified bcrypt hash for 'srcjecrc@123'
    '$2b$10$rxR.V8l0aiQ5FDtLz4YEeOCsUlAg.lESRjCUOOrotVymycgB0KNr.', 
    'admin', 
    '+91 9876543210', 
    'TSH Organizing University'
  )
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role;

-- 2. Insert 50 Official Problem Statements

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  1,
  'TSH-PS-01',
  'Pseudo Mirror – AI/AR-Based Self-Awareness Experience',
  'AR & Soul Consciousness',
  'When looking in a standard mirror, we only see our physical body. Beyond physical appearance, reflective technology can help users explore self-awareness, calmness, and positive identity.',
  'Develop an Augmented Reality (AR) "Pseudo Mirror" web or mobile application that transforms a live camera feed to visually reflect three distinct stages of self-awareness and positive identity in real time.',
  '["Soul Consciousness (Point of Light): Real-time face tracking to pinpoint the exact center of the forehead (Ajna/Yin Tang location). Overlay a glowing, radiant point of light representing the soul with a calm pulsing visual effect synchronized with a soft breathing cycle.","Angelic Form Overlay: Apply a real-time visual transformation layer over the user''s reflection. Add a soft, glowing aura around the body, subtle light rays, and angelic visual effects to represent spiritual purity and the subtle body.","Deity Attire Filter: A dynamic 2D/3D filter overlay representing divine attire, crowns, or traditional ornaments. Aligns seamlessly with the user''s head and body movements to symbolize divine virtues and divine self-image."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  2,
  'TSH-PS-02',
  'Mindful News Tracker – AI-Powered Information & Well-Being Platform',
  'Mindful Media & Information Ethics',
  'Standard newspapers are packed with noise, sensationalism, and negative stories that overwhelm students and drain their mental energy. Mindful information consumption can help students reduce information overload and make more conscious choices about the content they consume.',
  'Design a custom newspaper curation system that lets students filter real-world news based on their personal growth goals, extracting only high-value content while enriching good news with value-based insights.',
  '["Custom News Abstraction & Filtering: Students select specific topics or categories they want to read (e.g., Science, Positive Human Actions, Innovations, Global Peace). The tool automatically filters out sensational/negative noise and presents clean, concise summaries tailored to the student''s selected interests.","Spiritual Insights Engine: Automatically pairs every positive news story with a spiritual takeaway or inner-strength lesson (e.g., linking a story about a community build-project to the virtue of Cooperation and Unity).","Mindful Reading & Reflection Dashboard: Tracks daily reading habits and presents a simple summary showing how much positive, virtue-focused content the student consumed compared to mental noise."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  3,
  'TSH-PS-03',
  'Value-Based Book & Insight Tracker',
  'Wisdom & Practical Living',
  'Students often read books passively without putting the teachings into practice, or struggle to find books that address their specific mental and spiritual challenges. Knowledge becomes more meaningful when learners can connect what they read with practical reflection and positive action.',
  'Design a book discovery and reflection platform that matches students with books based on their personal growth goals, providing concise summaries alongside real-world activities and positive acts to apply the book''s core virtues.',
  '["Need-Based Book Matching: Students select their current focus or inner challenge (e.g., overcoming overthinking, building leadership, anger management, deep focus). Recommends specific books tailored to those core values and spiritual goals.","Life-Value & Insight Summaries: Summarizes each book highlighting Core Virtue (the main spiritual value taught), Key Insights (top 3 life-changing principles), and Life Transformation (how the lesson changes perspective and state of mind).","Self-Reflective Activity: Extracts concrete, step-by-step activities and daily positive acts from the book to practice inner discipline (e.g., a 5-minute silent observation of thoughts)."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  4,
  'TSH-PS-04',
  'Mindful Task & Time Management Platform',
  'Self-Sovereignty & Time Mastery',
  'Many students set daily goals but struggle with procrastination, unorganized priorities, and making self-justifying excuses when tasks are missed. Self-management depends on discipline, time awareness, and alignment between planned commitments and actual actions.',
  'Develop an intelligent To-Do web or mobile app that combines structured goal tracking, excuse-logging, points-based rewards, and field-specific guidance to help students master time management and spiritual self-discipline.',
  '["Smart To-Do Creation & Field Suggestions: Priority Matrix (Urgent, Important, Long-Term Growth), Domain-Based Prompts (Engineering, Design, Management, Competitive Exams), and Best-Practice Guidance breaking large goals into micro-steps.","Deadline Tracking & \"Excuse Log\": Specific deadlines for tasks throughout the day; if missed, system prompts student to log reason/excuse (distraction, poor estimation, lack of energy) before pushing or closing.","Points & Integrity Scoring: Earn reward points upon completing tasks within deadlines. Tracks \"Self-Promise Integrity\" rating based on promises kept vs missed.","Periodic Accountability Reports: Generates clean weekly, monthly, and yearly reports showing total tasks promised vs completed, common excuse patterns, and time distribution across priorities.","Self-Mastery Score (Swarajya Score): Progress score that goes up every time you keep a promise to yourself, reflecting willpower and self-control growth.","Excuse Analyzer: Automatically separates missed-task excuses into external factors (power outage) vs mindset issues (scrolling) with a 1-line spiritual tip.","2-Minute Morning & Evening Reflection: Quick 2-minute morning start to plan day with focus; peaceful evening review to celebrate wins and learn without guilt."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  5,
  'TSH-PS-05',
  'Character & Habit Builder',
  'Habit Transformation & Character',
  'Our daily habits shape our character and ultimate destiny. Long-term character development starts with small, conscious changes in daily thoughts, routines, and habits. Great goals are achieved not by sudden leaps, but through small, consistent habits practiced every day.',
  'Develop a comprehensive Habit Tracker platform that helps students map their long-term ambitions to daily micro-habits, replace negative routines with positive values, log excuses, and track long-term growth through periodic reports.',
  '["Goal-to-Habit Engine (Ambition Mapping): Students enter long-term ambitions (e.g., Become top coder, Improve public speaking, Achieve inner peace); breaks them into bite-sized daily micro-habits.","Habit Transformation Matrix (Swap & Build): Habits to Quit (e.g., late-night scrolling, reactive anger) paired with Habits to Build (e.g., replace 15 mins scrolling with 5 mins peaceful reflection).","Daily Tracking & Excuse Logging: Simple check-in: \"Did I follow this habit today?\" (Yes/No). If \"No,\" log excuse to build self-awareness without self-guilt.","Periodic Growth Reports: Clean weekly, monthly, and yearly reports tracking streak counts, success rates, and common habit-breaking triggers over time.","Master of Self (Swarajya) Level-Up: Progress bar that levels up as consistency grows, reminding students they are mastering mind and senses.","Mindful Excuse Reflection: Analyzes excuses to reveal whether missed habits were due to external factors or mindset blocks, giving a 1-line tip for improvement."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  6,
  'TSH-PS-06',
  'RTU & Mid-Term Exam (MTT) Smart Study Tracker',
  'Academic Excellence & Exam Mastery',
  'Engineering students affiliated with Rajasthan Technical University (RTU) often struggle to manage their time between Mid-Term Tests (MTTs) and end-term university exams. While syllabus topics and notes are available, students lack a structured system that breaks down massive unit syllabi into manageable daily targets aligned with specific exam patterns (Part A, B, and C questions).',
  'Develop an all-in-one web/mobile academic tracking platform tailored for RTU engineering students that maps branch-wise syllabi, provides embedded notes, tracks study deadlines for both MTTs and RTU main exams, and integrates smart exam-oriented features.',
  '["Branch & Unit-Wise Syllabus Mapping: Dropdown for Branch (CSE, AI & DS, ECE, ME, Civil, EE), Year/Semester, and Subjects with interactive unit checklist and attached notes (PDFs, drive links, video references).","Dual Exam Deadline Tracker (MTT vs. RTU): MTT Mode with short-term deadlines for assigned units; RTU Main Exam Mode with master deadline timer for the full 5-unit syllabus with weightage indicators.","Progress Dashboard: Real-time visual progress bars showing percentage of topics completed per subject and overall semester readiness.","Previous Year Question (PYQ) Integration: Tag each syllabus topic with past RTU exam questions (e.g., \"Asked in RTU 2023, 2025 - 8 Marks\") with an \"Important Topics / Repeated Questions\" revision filter.","RTU Paper Pattern Prep Tool: Categorize notes into Part A (2-Mark concise answers), Part B (Medium answers/Derivations), and Part C (12/15-Mark long numericals/design problems).","Smart Revision Scheduler (Spaced Repetition): Automatically schedule revision reminders 3 days and 1 day before exams for topics marked \"Hard\" or \"Incomplete\".","Peer Note-Sharing Hub: Allow students to upload, vote, and share quality handwritten notes or solved unit assignments."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  7,
  'TSH-PS-07',
  'Student Healthy Diet & Clean Food Companion',
  'Sattvic Nutrition & Student Vitality',
  'Students frequently rely on unhygienic street food or mess meals cooked with repeatedly reused oil and low-quality ingredients, leading to long-term health and energy issues. In Raj Yoga, pure food (Sattvic Aahar) is directly connected to a calm and energetic mind ("Jaisa Ann, Waisa Mann").',
  'Develop a web or mobile application that helps students transition away from unhygienic junk food by organizing healthy diets, suggesting affordable nutrient-dense recipes, offering step-by-step cooking manuals, and educating them on nutritional benefits.',
  '["Food Categorization & Diet Planner: Divide daily food intake into clear categories: Energy (Breakfast), Vitality (Lunch), Focus (Snacks), and Light Recovery (Dinner) tailored to student routine, budget, and health goals.","Student-Friendly Recipe & Preparation Manuals: Recommend healthy, fast, and low-cost dishes cooked easily in hostel room/PG setup (kettle, induction, single stove) with step-by-step preparation manuals.","Nutritional & Health Value Breakdown: Clear nutritional profiles for every dish (proteins, vitamins, healthy fats, calories) explicitly highlighting how each meal boosts mental clarity, stamina, and physical vitality."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  8,
  'TSH-PS-08',
  'Resource, Library & Creative Project Tracker',
  'Campus Resource & Inventory Systems',
  'The Social Responsibility Cell (SRC) Club manages a wide variety of unique resources—value-based books, educational games, value-based study materials, activity kits, and project reports/copies created by students. Because these materials are frequently used for workshops, sessions, and student projects, tracking what is available, what is currently being created, and where items are stored becomes challenging without a centralized system.',
  'Develop an all-in-one resource and inventory tracking application for the campus club to manage its library, track production/creation counts of value-based games and study kits, monitor student project copies, and streamline item issuance.',
  '["SRC Library & Study Material Catalog: Searchable digital catalog for all value-based books, spiritual study literature, audio-visual materials, and reference guides with simple issue/return tracking and automated due-date reminders.","Creative Production & Quantity Tracker (\"Creation Hub\"): Real-time counter to track units being created or assembled by the club (e.g., Value-Game Kits created: 50/100, Activity Handouts printed: 500) and raw supply requirement logs.","Student Project & Activity Archive: Centralized ledger for all student project copies, reports, and value-activity submissions categorized by year, domain (Mental Wellness, Sustainability, Social Outreach), and lead student/mentor.","Value-Games & Activity Kit Management: Dedicated inventory for educational and spiritual workshop games, tracking condition, missing components, and current location (In Lab / Out for Workshop)."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  9,
  'TSH-PS-09',
  'Diverse Dialogue & Keynote Session Manager',
  'Event Management & Wisdom Archiving',
  'The campus club regularly hosts distinguished personalities, thought leaders, industry experts, and social changemakers for "Diverse Dialogue" guidance and personality development sessions. Currently, inviting guests, gathering their profiles, generating post-event reports, and archiving their key messages is done manually across scattered files, leading to disorganization and lost institutional memory.',
  'Develop an all-in-one web or mobile platform with simple form-based entry that automatically generates formal invitation emails and standardized post-event reports for all "Diverse Dialogue" guest sessions.',
  '["Guest Profile & Event Entry Form: Input fields for Guest Name, Designation/Role, Organization, Societal Contributions/Service, Achievements, Event Date/Time, Core Topic, and event stage toggle (Pre-Event or Post-Event).","One-Click Formal Email Generator: Automatically inserts details into formal templates for ready-to-send Invitation Emails, Follow-up Reminders, and Post-Event Thank-You Letters with copy button or direct mail trigger.","Automated Post-Event Report Generator: Coordinator enters speech takeaways, student attendance count, and media links; app compiles into a standardized, beautifully formatted Event Report PDF.","Speaker & Wisdom Archive: Searchable repository storing all past guest profiles, generated reports, and key wisdom shared for future reference by student batches."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  10,
  'TSH-PS-10',
  'Mindful Traffic Control & Hourly Meditation Companion',
  'Hourly Mindfulness & Traffic Control',
  'In our fast-paced daily routines, continuous mental activity causes stress, focus loss, and decision fatigue. A practical mindfulness approach, often described as Traffic Control of the Mind (Man Ka Traffic Control), encourages short intentional pauses where individuals pause for just 1 minute every hour. This brief pause stops the automatic flow of thoughts, resets mental energy, and grounds the mind in peace, resilience, and clarity before resuming work.',
  'Develop a mobile application that automates customizable hourly "Traffic Control" breaks, plays powerful 1-minute guided audio commentaries and soothing music, and offers an on-demand library of mindfulness and meditation sessions for quick mental re-energizing throughout the day.',
  '["Customizable Hourly \"Traffic Control\" Chimes: Custom pause schedules (e.g., Every 60 minutes between 9:00 AM and 8:00 PM or custom intervals) with soft chime alerting user: \"Time for a 1-Minute Mindful Pause.\"","1-Minute Power Meditation Engine: Automated audio launch playing 1-minute guided commentary (Inner Peace, Power, Purity, Calmness, Concentration) with visually calming screen (breathing lotus, soft glowing light waves).","On-Demand Meditation & Commentary Hub: Mood-based commentaries (Stress Relief, Pre-Exam Focus, Anger Management, Deep Sleep) and spiritual background sitar, flutes, ambient soundscapes, and binaural beats.","Daily Mindful Streak & Energy Log: Tracks total \"Mindful Pauses\" completed throughout the day and 1-tap post-meditation check-in: \"How do you feel now?\" (Energized / Calm / Focused)."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  11,
  'TSH-PS-11',
  'Offline Counseling & Well-Being Booking Portal',
  'Confidential Mental Health & Counseling',
  'Students frequently face academic stress, emotional burnout, personal challenges, and career confusion. The campus club offers dedicated, confidential, in-person (offline) counseling sessions at the Raj Yoga Thought Lab. However, managing paper-based or verbal appointments manually leads to crowded waiting areas, scheduling overlaps, and a lack of privacy for students seeking guidance.',
  'Develop a simple, streamlined booking application for students to request private offline counseling sessions at the Thought Lab, while enabling counselors to accept requests, manage room schedules, and share post-session guidance points.',
  '["Simple Offline Booking System: Students request in-person sessions at Thought Lab by selecting preferred date, time slot, and core concern (Academic Stress, Emotional Balance, Relationships, Self-Discipline) with privacy-first discreet booking.","Counselor Dashboard & Slot Manager: Counselors review incoming offline requests and accept, reschedule, or allocate specific Thought Lab rooms/counselors with a single click.","Instant Venue Pass: Automated confirmation notifications sent to students displaying confirmed time slot and designated counseling room."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  12,
  'TSH-PS-12',
  'Soft Skills, Resource Vault & Adaptive AI Growth Hub',
  'AI Speech & Personality Development',
  'Many college students struggle with Spoken English, public speaking, body language, and overall confidence—limiting placement success and personal growth. While many wish to improve, existing platforms lack a closed-loop system that identifies specific speech flaws, auto-recommends targeted exercises to fix those gaps, and provides curated resources alongside peer success roadmaps.',
  'Develop an adaptive web/mobile learning portal featuring AI speech analysis, automated gap detection that instantly triggers personalized practice activities, a comprehensive resource vault, peer success stories, and progress analytics.',
  '["Gap-Detection & Adaptive Practice Engine: Targeted weakness identification (Excessive Filler Words, Speaking Pace >160 WPM, Low Vocabulary Diversity, Monotone Pitch) with smart remedial assignments (e.g., auto-assign \"The Pause & Breathe Method\").","Daily Skill-Building Activities & Action Tasks: Structured daily execution tasks (Day 1: 60s intro without fillers, Day 2: Read-aloud pause control, Day 3: 2-minute impromptu speech) and interactive task planner.","Comprehensive Soft Skills Resource Vault: Hand-picked free YouTube courses organized into structured learning paths (Spoken English, Public Speaking, Business Etiquette, Body Language, Interview Prep) and downloadable study notes/cheat sheets.","Practice & AI Feedback Studio: Interactive AI conversation partner for mock interviews and discussions; video/audio speech analysis evaluating tone, pace, fluency, filler words, and grammar.","Peer Inspiration & Success Blueprints: \"Zero to Hero\" alumni success roadmaps and community review/advice wall.","Progress Analytics & Smart PDF Reports: Live dashboard tracking daily streaks, vocabulary, clarity scores, confidence levels, and adaptive PDF performance summaries."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  13,
  'TSH-PS-13',
  'Campus Venue & Event Collision Management Portal',
  'Campus Operations & Venue Scheduling',
  'Colleges host numerous events across auditoriums, seminar halls, and grounds managed by different clubs, departments, and student bodies. Currently, offline or informal booking leads to venue collisions, sudden cancellations when management events take priority, and confusion regarding key contacts, hall capacity, and open/close timings.',
  'Develop an all-in-one venue booking and event management platform that prevents schedule collisions, enforces priority-based approvals, manages deadline-based faculty sign-offs, and provides complete venue operational guidelines.',
  '["Conflict-Free Schedule & Priority Engine: Real-time availability calendar for auditoriums, seminar halls, and grounds with automated override logic where Institutional events take precedence with instant notifications.","Deadline-Driven Approval Workflow: Requests remain provisionally held until approved by designated faculty before a strict cutoff (e.g., 48h prior), with auto-release logic to waiting clubs if unapproved.","Complete Venue Operational Directory: Displays venue specifications (capacity, AV/projection, seating, stage) and in-charge contact details with official operating hours.","OD (On-Duty) & Attendance Policy Module: Displays OD eligibility rules, capacity caps, and automatically generates official digital OD request forms based on verified attendee counts.","Clean Venue Pledge (Swachh Campus) & Responsible Resource Usage: Digital pre/post-event photo check-in confirming cleanliness and tracking energy consumption (lighting, AC duration)."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  14,
  'TSH-PS-14',
  'Swayamkrut – Daily Goodness Journal & Positive Thought Platform',
  'Positive Deeds & Campus Community',
  'In a digital environment dominated by negative news and social media comparison, students are rarely encouraged to reflect on goodness, daily virtues, and positive deeds (Punya Karma). While many engage in small acts of kindness or experience inspiring reflections throughout their day, they lack a dedicated, uplifting platform to document, reflect upon, and share these micro-stories with their campus community.',
  'Develop a web/mobile micro-blogging app where students log their daily acts of goodness (Swayamkrut) and uplifting reflections, featuring a community-selected "Thought of the Day" headline, photo-journaling capabilities, and privacy-conscious story sharing.',
  '["Daily \"Thought of the Day\" Banner (Main Headline): Highlights one Golden Thought of the Day as the daily community headline, curated by peer appreciation upvotes or automated rotation for 24 hours.","Photo-Blog Journaling (\"Story of Goodness\"): Micro-blog editor for short narrative posts capturing acts of goodness performed or witnessed, with privacy-enforcing natural media uploads (blurring faces).","Community Feed of Positivity: Clutter-free feed with zero-hate interaction, replacing likes with pure appreciation reactions (Inspired, Pure Vibe, Grateful, Compassionate).","Personal \"Goodness Ledger\" (Punya Khata): Private scrapbook of past reflections, 21-Day Goodness Streak Challenge, and Ripple of Inspiration allowing peers to adopt and recreate acts within 48 hours.","Pure Intentions & Humility (Nishkam Seva) & Positive Vibrations (Subhavna): Focuses on inner feeling over ego and fosters looking for goodness daily in oneself and others."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  15,
  'TSH-PS-15',
  'Global MindHub – Inter-Lab Network & Resource Portal',
  'Thought Lab Network & Asset Sharing',
  'The Raj Yoga Thought Lab initiative has expanded from its origin to 8–10 regional locations, with plans to establish centers across major cities. Currently, each Thought Lab operates as an isolated node. There is no unified system to share assets, coordinate joint events, track national student impact, or facilitate seamless communication between directors, mentors, and student coordinators across different campuses.',
  'Develop a centralized web and mobile management platform that connects all regional and future Raj Yoga Thought Labs into a unified digital network—enabling inter-lab resource sharing, real-time communication, joint event management, and network-wide impact analytics.',
  '["Centralized Multi-Lab Management Directory: Nationwide operational Thought Labs map with coordinator contacts, facility specs, hours, membership counts, and role-based access control.","Inter-Lab Resource & Asset Exchange: Shared catalog of physical and digital assets (VR headsets, meditation headsets, libraries, decor, exhibition panels) with inter-lab loaner transfer requests.","Unified Communication & Knowledge Forum: Channel-based messaging for lab leads and centralized content bank of standardized meditation tracks, slides, audio, and promo templates.","Synchronized Events & \"Global Pause\" Orchestrator: Multi-lab event scheduling and national impact analytics dashboard aggregating meditation minutes, students mentored, and offline counseling sessions."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  16,
  'TSH-PS-16',
  'Interactive Self-Awareness & 7 Virtues IoT Touch Wheel',
  'IoT & Soul Consciousness Hardware',
  'The foundational lesson of Raj Yoga is "Soul Consciousness"—understanding that we are peaceful souls controlling a physical body, driven by 7 Eternal Virtues (Knowledge, Purity, Peace, Love, Joy, Bliss, and Power). Every life problem stems from a temporary drop in one of these original virtues. While the concept is profound, students benefit from a simple, tactile physical interface that gives immediate audio-visual explanations to encourage reflection and self-awareness.',
  'Develop a simple physical touch-wheel installation for Thought Labs (paired with an integrated screen or speaker) where touching any of the 7 virtue segments instantly triggers a full audio-visual explanation of that virtue, its connection to the soul, and practical steps to embody it.',
  '["Physical Touch-Sensing Virtue Wheel (Hardware): 7-segment circular installation divided into the 7 Virtues (Knowledge, Purity, Peace, Love, Joy, Bliss, Power) with capacitive touch sensors and ambient LED backlighting behind each section.","Simple Tactile Activation: Touching any virtue segment instantly illuminates that specific section and activates the paired display/speaker.","Instant Interactive Explanation Engine: Full audio-visual breakdown playing engaging audio commentary accompanied by visual diagrams (e.g., Driver & Car analogy for Soul Consciousness)."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  17,
  'TSH-PS-17',
  'Anubhav – Interactive Course & Multi-Lab Learning Portal',
  'Interactive Spiritual Courses & Analogy Learning',
  'The traditional 7-step Raj Yoga Meditation Course (Understanding the Self, Understanding the Supreme, The World Stage, Raj Yoga, Karma Philosophy, Journey from Hell to Heaven, and Aim of Human Life) is deeply transformative. However, modern students often struggle to relate to abstract spiritual terms without practical analogies, student stories, and shared peer experiences. Furthermore, students need structured, hands-on activities with clear visual guides to apply these concepts, while Thought Lab coordinators lack a standardized digital platform to manage course resources across campuses.',
  'Develop an interactive web/mobile Raj Yoga Course application that translates the 7 core steps into real-life analogies, features an isolated activity hub with demo video guides, highlights peer experience-sharing, manages Thought Lab learning assets, and connects multi-campus Thought Lab networks under a single umbrella.',
  '["7-Step Analogy-Driven Course Player: Pairs spiritual philosophy with clear practical analogies (Soul as Driver of Body/Car, Karma as Input/Output in Programming) with video modules, audio, and illustrated story-cards.","Dedicated Course Activity Hub & Demo Videos: Standalone module listing practical activities, mind exercises, reflection tasks, and step-by-step video demonstration guides.","Peer Experience & Beneficiary Showcase (\"Anubhav\" Wall): Student-contributed video/text testimonials, impact metrics, and experiential learning badges.","Multi-Thought Lab Resource & Administrative Engine: Facilitator repository for verified slides/audio and cross-lab integration allowing students to transition from digital to offline lab sessions."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  18,
  'TSH-PS-18',
  'Thoughts to Destiny – Gamified Habit & Character Building Platform',
  'Gamification & Mindset Mastery',
  'External achievements (grades, placements, status) are merely secondary outcomes. True long-term success is built on inner mastery—a positive mindset, determination, self-control, and purposeful fire (Willpower). As shown in the Raj Yoga growth ladder (Thoughts → Feelings → Attitude → Actions → Habits → Personality → Destiny), true transformation begins at the thought level. However, students lack a structured, engaging way to practice daily micro-habits and internalize these steps into a powerful personality.',
  'Develop a gamified web/mobile app that turns character development into a step-by-step quest—offering daily micro-tasks, short video coaching sessions for every stage of the ladder, and progress tracking to help students master their mind and unlock their ultimate potential.',
  '["Gamified \"Path to Destiny\" Quest Engine: 7-level progression (Thought Mastery, Emotional Balance, Right Attitude, Purposeful Action, Habit Building, Integrated Personality, Master of Destiny) with actionable daily micro-tasks.","Stage-Wise Video Masterclasses: Guided insight sessions explaining psychology and self-control, with practical \"How-To\" demos for exam stress, handling failure, and overcoming laziness.","Inner Power & Streak Analytics Dashboard: Tracks consistency via quest streaks, Willpower/Fire Points, and reflection logs, unlocking virtual treasure rewards, audio commentaries, and Thought Lab badges."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  19,
  'TSH-PS-19',
  'Tree of Consciousness – Interactive IoT Touch Display & Audio-Visual Game',
  'IoT & Consciousness Education',
  'The human state of mind can be represented as a tree—rooted either in Body Consciousness (vices like anger, greed, ego, lust, and fear) or Soul Consciousness (virtues like peace, wisdom, love, joy, and spiritual power). Students often struggle to recognize how operating from negative emotions poisons their actions, while constructive choices yield positive mental fruit. A visual, tactile game is needed to clearly demonstrate this contrast in real time.',
  'Develop an interactive hardware-software installation (IoT touch board paired with a display/app) featuring the "Tree of Consciousness." When a user touches or clicks any emotion/face icon (e.g., volcano/anger, crown/ego, peaceful meditating figure, empowered hero), the system automatically triggers an audio-visual narration explaining its root cause, life consequences, and how to shift from reactive states toward more constructive awareness.',
  '["Interactive IoT Physical Touch Board & Digital Screen: Capacitive touch face nodes (Left: Anger/Volcano, Ego/Crown, Greed, Fear; Right: Focus, Joy, Courage, Peace, Gratitude).","Dual-Tree Visualizer: Illuminates left side (decaying, toxic branches) for negative emotions and right side (blooming, vibrant fruit) for positive virtues upon interaction.","Auto-Play Audio-Visual Explanation Engine: Explains root causes, life consequences on decisions/health/relationships, and practical Raj Yoga reflections to shift toward soul consciousness."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  20,
  'TSH-PS-20',
  '16 Divine Virtues – Interactive IoT Display & Cultivation Guide',
  'IoT & Divine Virtues',
  'In value-based philosophy, inner excellence is embodied by 16 foundational virtues (such as Humility, Sweetness, Patience, Tolerance, Courage, and Contentment). While students understand these values conceptually, they often find it difficult to recognize when a specific virtue is lacking or how to systematically cultivate it in response to real-life campus stresses, conflicts, and academic pressure.',
  'Develop an interactive hardware-software installation (IoT touch board paired with a display/app) featuring the 16 Divine Virtues. When a user touches or clicks any virtue button, the system automatically triggers an audio-visual breakdown explaining its core meaning, real-life relevance, and actionable methods to develop that virtue daily.',
  '["16-Node IoT Touch Interface (Hardware & Software): Tactile panel with 16 illuminated touch nodes representing specific virtues (Sweetness, Patience, Honesty, Courage, etc.) with active backlighting synchronized with screen.","Auto-Play Explanation & Development Engine: Audio-visual guide covering Core Meaning, Depletion Signs (how life looks when the virtue is absent), and 3 Practical Cultivation Steps for everyday college life."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  21,
  'TSH-PS-21',
  '16 Essential Life Skills – Interactive IoT Training Board & Skill Builder',
  'IoT & Essential Life Skills',
  'Beyond academic knowledge, holistic success requires 16 essential life and soft skills (such as Active Listening, Conflict Resolution, Time Mastery, Emotional Regulation, Decision Making, and Adaptability). Students frequently encounter situations requiring these skills but lack a quick, interactive medium to learn how each skill works and how to actively build it.',
  'Develop an interactive hardware-software installation (IoT touch board paired with a display/app) featuring the 16 Essential Life Skills. Touching any skill button triggers an immediate audio-visual lesson explaining the skill, why it matters in academic and professional life, and step-by-step practical exercises to master it.',
  '["16-Skill IoT Interactive Console: Touch-sensitive skill matrix organized into 16 core skill buttons (Stress Management, Communication, Critical Thinking, Team Leadership, etc.) with visual module sync on screen.","Auto-Play Explanation & Action Plan Engine: Visual masterclass detailing Skill Definition with relatable student analogies, Real-World Impact (placements, group projects, well-being), and practical daily exercises."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  22,
  'TSH-PS-22',
  'Shikhar – Legend''s Journey & Resilience Masterclass Portal',
  'Resilience & Role Models',
  'Modern students often feel overwhelmed and give up when facing small setbacks, academic stress, or personal failures. They lack perspective on how legendary figures (e.g., Dr. A.P.J. Abdul Kalam, Mother Teresa, iconic athletes, and social pioneers) overcame immense struggles, poverty, and repeated rejections to achieve greatness. These icons didn''t succeed because they faced no problems; they succeeded because their inner resilience, purpose, and values prevented them from giving up.',
  'Develop an interactive graphical web and mobile app featuring a visual "Struggle-to-Success" journey map for legendary personalities—complete with rich infographics, curated video links, personal quotes, documented hardship stories, and reflection tools showing how they faced adversity without compromising their values.',
  '["Interactive Visual \"Struggle-to-Success\" Graph Engine: Node-based dual journey line split into Red Nodes for major crises and Green Nodes for ultimate breakthroughs. Click-to-reveal hardship details, mindset beliefs, and verified media clips.","Problem-Versus-Perspective Comparison Engine: \"My Struggle vs. Their Struggle\" feature matching student setbacks with historical struggles of icons, showing patient responses.","Quote & Wisdom Repository & Inner Strength Logs: Searchable bank of authentic quotes sorted by Resilience, Faith, Failure, Discipline, and Selfless Service, paired with mindset reflection journaling."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  23,
  'TSH-PS-23',
  'Swayam-Sanyam – AI Digital Detox, Multi-Timeline Analytics & Goal Alignment App',
  'Digital Detox & Self-Regulation',
  'Excessive smartphone usage and mindless scrolling degrade attention spans, increase mental fatigue, and derail students from their core goals. Often, high screen time isn''t purely "wasteful"—students use devices for genuine study, project work, or skill development. Existing app-blockers fail to distinguish productive usage from distracting habits, lack long-term goal-alignment analytics, and do not proactively alert users when screen thresholds are exceeded.',
  'Develop an intelligent web/mobile digital detox application that analyzes screen-time patterns, categorizes productive vs. distracting app usage based on user intent, provides weekly, monthly, and yearly goal-alignment graphs, triggers real-time alerts for excess screen usage, and delivers spiritual micro-breaks (Raj Yoga mindfulness and virtue resets) to maintain focus.',
  '["Contextual App Usage & Intent Classifier: 1-tap intent tagging (studying, research, entertainment) differentiating productive screen time advancing core goals from unproductive scrolling.","Multi-Timeline Graphical Analytics Engine: Goal definitions and milestone tracking visualized via Goal Alignment Index (% matching targets), long-term trends, and focus scores.","Smart Excess Alerts & Mindful Interventions: Real-time threshold notifications when exceeding limits, paired with pattern-triggered 2-minute Raj Yoga micro-breaks and guided breathing/affirmations."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  24,
  'TSH-PS-24',
  'Hell to Heaven – Physical/IoT Remote-Controlled Path Board Game',
  'IoT & Platform Games',
  'The Raj Yoga philosophy illustrates the soul''s journey along an S-curved path moving from lower states of suffering and vice (Hell / Iron Age) upward to states of purity, peace, and perfection (Heaven / Golden Age). Abstract concepts can be challenging to grasp through reading alone; physical, tactile games—like maneuvering a ball along a winding path—offer an engaging, hands-on way to understand how choices, virtues, and vices propel or derail personal growth.',
  'Develop a physical wooden/platform-based maze board representing the winding S-path from "Hell to Heaven." Players guide a ball (representing the soul) along the track using physical tilt mechanics, remote controllers, or smart joystick interfaces. Navigating past obstacles (vices) unlocks explanatory audio-visual cues or screen prompts explaining how positive virtues help the soul reach the highest state of peace.',
  '["Physical S-Curve Platform Track (Hardware): Multi-stage wooden/plastic S-path rising from Iron Age to Golden Age with vice pitfalls (Anger, Greed, Ego) and joystick/remote/tilt controls.","Smart Checkpoints & Audio-Visual Feedback: Magnetic or light sensors along the track triggering audio explanations upon hitting vice obstacles or reaching virtue checkpoints.","Demonstrational Prototype Model: Open reference design for mechanical wooden balance boards or smart remote-controlled IoT installations."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  25,
  'TSH-PS-25',
  'The World Cycle – Interactive Mind Activity & Platform Board Game',
  'Spiritual Time Cycles & Board Games',
  'The World Drama Cycle (Satyug, Treta, Dwapar, and Kaliyug) represents the 4-age cycle of time and human consciousness in Raj Yoga. Understanding how human virtues gradually shift from complete purity (Satyug) to confusion and conflict (Kaliyug), and how to transform back through the Confluence Age (Sangamyug), provides profound perspective on life. Students need an interactive, platform-based mind game to explore these four quadrants and test their knowledge of spiritual time cycles.',
  'Develop a wooden or physical platform-based mind activity game (with optional digital software support) centered on the World Drama Cycle. Players complete mind puzzles, strategic token placements, or platform movements across the 4 age quadrants to learn the characteristics, history, and life and value-based lessons of each era.',
  '["4-Quadrant Circular Platform Board (Hardware / Physical): Circular board divided into Satyug, Treta, Dwapar, and Kaliyug with Sangamyug at top apex, using token and spatial puzzle mechanics.","Mind Puzzles & Era Challenges: Scenario challenge cards / digital app prompts representing the mental climate of each era and interactive strategy to cross the \"Confluence Bridge\".","Flexible Hybrid Design: Physical tabletop game, IoT-assisted board with LEDs, or companion mobile/web app providing digital cards and timers."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  26,
  'TSH-PS-26',
  'AuraSpace – AI Voice-Driven Smart Well-Being Room & Environment System',
  'Smart Room Automation & Voice AI',
  'The Thought Lab features a dedicated meditation room where students visit to recharge, practice Raj Yoga, and reduce stress. However, every individual requires a different combination of ambient audio, guided commentary, and lighting/visualization to reach a deep state of peace. Traditional static playlists lack personalization, and manually navigating screens or buttons breaks the meditative, calm mindset. An intuitive, hands-free conversational interface is needed to personalize the room''s atmosphere instantly.',
  'Develop an AI-powered smart room control system for the meditation space that allows students to customize their meditation experience entirely through natural voice interaction. Upon entering and activating the system, users can speak with an ambient AI assistant to dynamically curate ambient background music, guided Raj Yoga commentaries, visual projection themes, and lighting colors based on their current mood or preference.',
  '["AI Voice Conversational Interface: Hands-free smart microphone/speaker with wake phrase (\"Hello Aura\"), asking calming questions to translate natural speech into custom room presets.","Multi-Sensory Room Synchronization: Dynamic layering of ambient audio (flutes, binaural beats) with Raj Yoga commentaries, synchronized with RGB smart lighting and visual wall projections.","Mood-Driven AI Recommendations & Timers: State-based presets (e.g. Stress Release: soft blue light, gentle rain, 3-min peace commentary) with gentle audio fade-out and light brightening at session end."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  27,
  'TSH-PS-27',
  'Sanskar Khel – Value-Based Group Game Innovation Platform',
  'Experiential Games & Value Education',
  'Experiential learning through games is one of the most powerful ways to internalize core values, life skills, and value-based principles. Traditional group activities often focus solely on competition or physical speed, missing opportunities to build empathy, teamwork, and moral clarity. Students need an open innovation framework to conceptualize, design, and demonstrate original value-based games—ranging from simple instruction-led physical icebreakers to card and board games.',
  'Develop an open innovation platform and showcase framework where students design and present original value-based group games (instructional games, card games, or board games). Participants submit their concepts using structured PPT decks, short demo video executions, or live physical game prototypes to demonstrate how play can foster values like cooperation, tolerance, trust, and self-control.',
  '["Multi-Format Game Design Categories: Category A: Instruction-Only Physical Games (icebreakers, trust exercises); Category B: Value-Based Card Games (ethics, virtue trade-offs); Category C: Interactive Board Games.","Standardized Submission & Evaluation Module: Built-in presentation format (objectives, target values, rules, setup, debrief prompts) and demo video upload repository.","Peer Playtesting & Feedback Loop: Thought Lab teams playtest submissions, rate moral impact and engagement, and suggest enhancements."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  28,
  'TSH-PS-28',
  'AuraCompanion – Smart IoT Voice-Enabled Home Meditation Device',
  'IoT Consumer Hardware & Meditation Assistants',
  'While campus meditation spaces like Thought Labs offer ideal conditions for mindfulness, maintaining a consistent daily meditation practice at home remains a major challenge for students and families. Distractions, busy schedules, and the effort of manually searching for meditation tracks on smartphones disrupt the peaceful mindset needed for meditation. There is a need for a dedicated, standalone home IoT hardware product—featuring iconic Raj Yoga visual symbolism (such as the red glowing Supreme Light emblem)—that acts as an ambient conversational voice guide for personal meditation routines.',
  'Develop a compact, consumer-ready smart IoT desktop device featuring an illuminated Supreme Light medallion display, high-fidelity audio, and a conversational AI voice engine. The device operates entirely hands-free, processing natural speech commands to play customized meditation music, deliver guided audio commentaries, set smart meditation reminders, and create a peaceful atmosphere in any home environment.',
  '["Standalone Voice-Activated Smart Console (Hardware & IoT): Desktop unit with illuminated glowing emblem (red circular Supreme Light focal point for Drishti), far-field microphone array, and warm speaker.","Conversational AI Voice & Meditation Assistant: Responds to natural voice prompts for meditation music, commentaries, and Amrit Vela alarms, with pre-loaded and cloud-synced library.","Smart Scheduling & Soft Light Guidance: Natural voice reminder schedules and soft light pulsing at meditation times.","Offline & Cloud Hybrid System: Essential offline commentaries and local voice processing for offline use."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  29,
  'TSH-PS-29',
  'Ashtashakti – Interactive IoT Touch Wheel & Audio-Visual Power Activation Portal',
  'IoT & 8 Spiritual Powers',
  'In Raj Yoga philosophy, the soul possesses 8 spiritual powers (Ashtashakti): Power to Withdraw (Sametne ki Shakti), Power to Pack Up, Power to Tolerate (Sahan karne ki Shakti), Power to Adjust (Samaye ki Shakti), Power to Discern (Parakhne ki Shakti), Power to Judge (Nirnay karne ki Shakti), Power to Face (Samna karne ki Shakti), and Power to Cooperate (Sahyog karne ki Shakti). While represented visually using clear symbols (e.g., the tortoise for withdrawing, scales for judgment, a tree for tolerance), students often struggle to apply these powers during real-life college stress, peer pressure, or decision paralysis.',
  'Develop an interactive hardware-software installation (an IoT touch wheel paired with a screen/app) featuring the 8 Powers of the Soul. Clicking or touching any power node triggers an immediate audio-visual lesson explaining the power''s core meaning, its visual symbolism, and practical Raj Yoga exercises to inherit and activate that power in daily life.',
  '["8-Node Interactive IoT Touch Wheel (Hardware & Software): Octagonal console with 8 illuminated nodes representing the symbols (Tortoise, Luggage, Tree, Ocean, Magnifying Glass, Balance Scales, Storm Walker, Helping Hands) with active backlighting.","Auto-Play Explanation & Activation Engine: Animated breakdowns covering Symbolic & Core Meaning, Real-Life Campus Scenario, and Raj Yoga Inheritance Framework to absorb that power."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  30,
  'TSH-PS-30',
  'Raj Yoga Pillars & Benefits – Interactive IoT Console & Audio-Visual Transformation Hub',
  'IoT & Raj Yoga Lifestyle',
  'The foundation of Raj Yoga rests on four core pillars (Divya Gyan / Divine Knowledge, Raj Yoga Meditation, Satvik Ahar / Pure Lifestyle, and Divya Guna / Divine Virtues), which yield multifaceted benefits across mental, physical, emotional, and social life (such as stress control, enhanced focus, pure relationships, and decision-making clarity). Students often view lifestyle discipline as rigid or restrictive without understanding the direct, positive life outcomes each pillar produces.',
  'Develop an interactive hardware-software installation (an IoT touch console paired with a display/app) featuring the 4 Pillars and their surrounding Benefits. Touching any pillar or benefit node triggers an immediate audio-visual lesson explaining the connection between lifestyle choices, inner peace, and real-world student benefits, alongside practical steps to integrate these pillars daily.',
  '["Dual-Tier Interactive IoT Touch Console: 4 Central Pillar Nodes (Knowledge, Yoga, Pure Diet, Virtues) and 12 outer benefit nodes (Stress Control, Better Sleep, Improved Focus, Resilience, Healthy Habits) with dynamic lighting connections.","Auto-Play Explanation & Integration Engine: Video/audio commentary explaining core concepts, student impact, and 3 clear micro-habits to cultivate each benefit."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  31,
  'TSH-PS-31',
  'Kalpavriksha – 3D Smart AI Tree of Virtues & Ambient Meditation Hub',
  '3D Design & Embedded AI',
  'The Tree of Virtues represents how fundamental human values (such as Love, Compassion, Peace, Truth, Patience, and Purity) branch out to create a harmonious mental climate. While static posters depict these concepts visually, modern students engage far better with interactive, multi-sensory physical objects. There is a need for a hands-on student hardware project combining 3D product design, embedded AI, touch sensors, and dynamic audio-visual feedback to bring this virtue tree to life.',
  'Design and build a 3D physical/digital model of the "Tree of Virtues" equipped with capacitive touch leaves, embedded AI, dynamic LED illumination, and custom meditation audio streams. When a user interacts with a specific virtue leaf (e.g., Peace, Compassion, Patience), the AI engine analyzes the choice, plays targeted meditation music/commentaries mapped to that virtue, and provides conversational guidance to cultivate that quality.',
  '["3D Physical Tree Model & Touch Leaves: Sculpted/3D-printed installation with leaf-shaped capacitive touch nodes mapped to virtues (Love, Peace, Honesty, Patience, Purity, Truth, Cooperation, Compassion) with individual micro-LED backlighting.","Embedded AI Conversational Engine & Music Mapper: Voice and touch interaction mapping each virtue leaf to ambient meditation music and 1-minute Raj Yoga guided commentaries.","Mood Diagnostic & Personalized Recommendations: AI diagnoses feelings and illuminates the corresponding virtue leaf as an antidote.","Dynamic Audio Sync & QR Track Downloader: Scan QR code at the tree''s base to transfer audio stream and reflection to personal smartphone."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  32,
  'TSH-PS-32',
  'Karma Wheel – Interactive Cause-and-Effect Game Engine & Platform Hub',
  'Cause & Effect Philosophy & Game Design',
  'The Law of Karma (As you sow, so shall you reap) is a core pillar of value-based philosophy. Every thought, word, and action generates a corresponding reaction—shaping personal peace, relationships, and mental state. However, students often treat actions as isolated events, ignoring how small daily choices compound over time. To internalize this, students need an open creation platform to design software, IoT hardware, wooden tabletop, or card-based games that simulate cause-and-effect loops in real time.',
  'Develop an open game-design framework and multi-format submission platform focused on the "Law of Karma." Student teams create original games (digital apps, IoT smart boards, physical wooden maze games, or strategic card decks) where every player action produces an immediate, visible consequence—teaching cause and effect, moral decision-making, and long-term accountability.',
  '["Multi-Format Karma Game Categories: Category A: Software & Digital RPG/narrative sims; Category B: Tactile IoT & Smart Hardware Boards with reactive sensors; Category C: Wooden Tabletop & Platform mechanical balance games; Category D: Action-Reaction Card Games.","Immediate Visible Consequence Engine: Every choice produces clear cause-and-effect outcomes, teaching moral decision making and personal accountability."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  33,
  'TSH-PS-33',
  'Swayam-Drishti – AI-Powered Dynamic Personal & Scenario SWOT Analysis Engine',
  'AI Personal Growth & SWOT Diagnostics',
  'While students frequently encounter the concept of SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis in management and personal growth modules, traditional SWOT exercises are static, one-time paper activities. When facing real-world campus situations (e.g., career decisions, project failures, or team conflicts), students struggle to update their analysis dynamically or translate identified weaknesses into practical, virtue-aligned action plans based on their evolving circumstances.',
  'Develop an intelligent web and mobile application featuring an AI-driven SWOT analysis engine. Students input their current personal profile alongside specific real-time scenarios (e.g., preparing for a major interview, managing exam stress, or resolving a team dispute). The AI dynamically generates tailored SWOT matrices and offers situational, virtue-based strategies to turn threats into opportunities and weaknesses into actionable strengths.',
  '["Scenario-Based Dynamic SWOT Matrix Generator: Contextual input analysis dynamically populating an interactive 4-quadrant SWOT dashboard.","Real-Time AI Solution Engine: Situational action plans combining inner strengths with identified weaknesses, refreshing dynamically as conditions change.","Spiritual & Character-Building Integration: Suggests Raj Yoga meditation routines, 8 Powers activation exercises, and micro-tasks targeted at weaknesses and threats.","Progress & Evolution Tracker: Historical log tracking weakness reduction and strength expansion over time."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  34,
  'TSH-PS-34',
  'Marg-Darshan & Smriti-Kosh – Senior Knowledge Preservation & Career Insights Portal',
  'Senior Knowledge Transfer & Institutional Memory',
  'Every year when a batch graduates, years of hands-on experience, technical project insights, event organizing wisdom, and valuable lessons learned from mistakes leave the campus with them. Lower-year students often end up repeating the exact same errors in capstone projects, events, and placement drives due to a lack of institutional memory. A dedicated digital portal is needed to capture, structure, and permanently store this senior wisdom for future generations.',
  'Develop a web and mobile platform that allows graduating 4th-year students and alumni to document their interview experiences, project blueprints, event execution post-mortems, and common pitfalls. The system serves as a searchable knowledge repository for lower-year students to access structured roadmaps, interview questions, and practical project advice.',
  '["Senior Content Creation & Experience Logging: Placement & interview breakdowns (company names, rounds, questions, prep), Capstone post-mortems (tech stack, architecture, pitfalls), Event & Club execution learnings (logistics, vendors, budgets).","Categorized Knowledge Repository & Search Engine: Multi-filter discovery by company, domain, event type, or academic year, alongside structured preparation roadmaps.","Interactive Discussion & Bookmarking: Q&A comment threads for junior-senior clarity and personal dashboard bookmarking for quick access."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  35,
  'TSH-PS-35',
  'Pustak-Setu – Student-to-Student Textbook & Study Material Exchange Network',
  'Peer Academic Marketplace & Resource Circulation',
  'At the end of every semester, senior students are left with valuable paper resources—such as expensive core course textbooks, printed study notes, reference guides, and previous years'' question (PYQ) books—that sit unused in hostel rooms. Meanwhile, junior students entering the new semester spend significant money buying these exact materials brand new. Without a dedicated, organized campus marketplace, finding or passing down these physical study resources relies on scattered social media posts or luck.',
  'Develop an easy-to-use web and mobile application that acts as a direct student-to-student exchange portal for academic materials. The platform allows students to list books, notes, and PYQs for sale or donation, complete with item details and seller contact information, allowing buyers to quickly connect, negotiate, and exchange materials directly on campus.',
  '["Simple Item Listing & Seller Profile: Quick listing form for resource type (Textbook, Notes, PYQ, Lab Manual), subject, semester, condition, and price (or \"Free/Donation\") with verified student contact info.","Smart Search & Semester Filtering: Targeted discovery by course code, department, semester, or resource type with 1-click Direct Connect button (WhatsApp/phone link).","In-Hand Photo & Verification: Up to 3 photos of cover and interior pages to evaluate quality before meeting on campus."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  36,
  'TSH-PS-36',
  'Vichar-Vani – Campus Reflection Board & Daily Display System',
  'Physical Campus Displays & Reflection',
  'The Spiritual Research Cell (SRC) curates and shares daily inspiring thoughts, virtue reflections, and uplifting quotes across WhatsApp community groups and social media. However, students walking through campus are often distracted by digital notifications and miss these daily insights. A dedicated physical display board placed in high-traffic campus zones—such as the Thought Lab, library entrance, canteen, or academic blocks—provides a physical focal point that delivers daily positivity directly into the offline student environment.',
  'Design and build a versatile campus display board—either as a handcrafted decorated wooden board or an ambient digital screen enclosure—that can be installed anywhere on campus. The solution must provide a clear, standardized fabrication method using simple materials (plywood, varnish, clips) or basic screen setups (tablets, kiosk browsers) so student teams can easily construct, deploy, and maintain these boards across campus without complexity.',
  '[]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  37,
  'TSH-PS-37',
  'Mantra-Break – Browser Extension for Mindful Micro-Pauses',
  'Browser Tools & Digital Mindfulness',
  'Students spend long, uninterrupted hours staring at laptop screens to complete assignments, research projects, and prepare for exams. This prolonged screen exposure frequently leads to eye strain, mental fatigue, and digital burnout. While elaborate meditation apps exist, students rarely leave their active study sessions to use them. A lightweight, ambient intervention is needed directly within their browsing workflow to promote regular mental resets without disrupting academic productivity.',
  'Develop a lightweight browser extension (for Google Chrome and Microsoft Edge) that gently encourages students to take 30-second "Mindful Pauses" after fixed periods of continuous browsing. When triggered, the extension softly dims the active browser tab, plays a subtle audio chime, and displays a single virtue-based reflection cue before automatically allowing the student to resume work.',
  '["Intelligent Screen-Time Tracker & Gentle Overlay: Customizable micro-pause timer (default: 30 seconds every 45 minutes) with ambient translucent dimming overlay without closing or refreshing open tabs.","Virtue Cue & Audio Chime System: Displays randomized single-sentence contemplation cues mapped to values like Peace, Patience, and Focus, with soft bell/singing bowl audio chime at start and end."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  38,
  'TSH-PS-38',
  'Ahimsa-Aahar – Simple Hostel Mess Eco-Waste Board & Tracker',
  'Ahimsa & Food Waste Analytics',
  'Food wastage in hostel messes is a massive operational and ethical issue. Students often scoop more food than needed simply because there is no visual feedback showing the collective impact of daily waste. In Raj Yoga, pure respect for sustenance (Ann Devta) and living lightly on the Earth (Ahimsa) begins with conscious eating.',
  'Develop an ultra-simple digital logging system for hostel mess halls. At the end of each meal, mess staff input the total weight of wasted food into a simple tablet dashboard. The system displays this data on a screen at the mess entrance, translating kilograms of wasted food into equivalent missed meals and environmental impact metrics (e.g., water wasted).',
  '["Easy numeric input interface for mess staff at the end of meals.","Daily and weekly visual charts displayed at mess entrances.","Impact conversion formulas translating kg of waste into missed meals and wasted water.","Grounded in Ahimsa (Non-violence towards resources) & Daya (Compassion)."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  39,
  'TSH-PS-39',
  'Ahimsa-Aahar (Space) – Ambient Well-Being Room & Light-Sound Environment System',
  'Ambient Space Automation & Light-Sound Therapy',
  'Modern campus spaces, hostel rooms, and meditation centers are usually designed for static utility rather than emotional and spiritual well-being. While smart technology often demands continuous visual attention, it rarely works in the background to foster inner peace. There is a need for an intelligent system that transforms ordinary rooms into calm, focused, and uplifting environments by dynamically controlling lighting, sound, and physical illuminated wall structures.',
  'Develop an integrated hardware and software system that can be set up in rooms, meditation halls, or large campus spaces to create calm and well-being-oriented ambience. The system should combine environmental sensors with custom-controlled lighting, soothing audio, and physical wall structures (e.g., LED-lit geometric mandalas, backlit virtue panels, or sacred geometry wall installations) that selectively turn on, dim, or alternate based on the selected spiritual mode or environmental triggers.',
  '["Meditation Mode: Soft, warm golden/orange hues with backlit wall structures glowing gently alongside peaceful natural audio (flowing water, singing bowls).","Focus Mode: Crisp, comfortable task lighting with minimal physical wall distractions and subtle brown noise or ambient drone sounds.","Relaxation Mode: Warm, deeply dimmed lighting with gentle breathing-light transitions on wall fixtures.","Positive Mode: Gentle, bright uplifting colors and full illumination of inspirational wall panels for group reflection or social spaces.","Mindful Evening Mode: Gradually dimming, warm sunset hues that turn off major wall fixtures to support a peaceful transition toward rest.","Control Portal & Personalization (Software): Clean web/mobile dashboard to switch modes, set custom timers, or adjust brightness/sound levels with automated time-based learning."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  40,
  'TSH-PS-40',
  '"Prithvi-Kosh" — Campus Carbon Footprint Tracker & Micro-Carbon Credit System',
  'Campus Carbon Footprint & Micro-Credits',
  'Educational institutions generate significant carbon emissions through daily electricity consumption, paper usage, single-use plastics, and personal transport. While students are taught climate change theory, they lack a tangible, real-time mechanism to measure their personal or campus-wide carbon footprint. Without visible environmental feedback or positive incentives, adopting sustainable habits often feels abstract rather than actionable.',
  'Develop a web and mobile application that calculates and visualizes individual and campus carbon footprints based on daily habits (e.g., travel mode, electricity usage, waste generation). The platform integrates a gamified "Campus Carbon Credit" system where students earn green credits for verified eco-friendly acts (such as using bicycles, participating in tree plantation drives, or using reusable water bottles), which can be redeemed for campus recognition or perks.',
  '[]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  41,
  'TSH-PS-41',
  '"Swa-Swachhta" — Decentralized Campus Solid & Organic Waste Management System',
  'Decentralized Solid & Organic Waste Management',
  'Colleges generate substantial daily non-liquid waste—ranging from classroom paper, cardboard packaging, and canteen food scraps to discarded electronic items and lab material. Beyond liquid sewage treatment, solid waste management across campus facilities is often unsegregated, inefficient, and reactive. Bulk waste frequently ends up overflowing in common areas or sent directly to municipal landfills, missing critical opportunities for on-campus material recovery, organic composting, and responsible recycling.',
  'Design and implement a complete, decentralized campus solid waste management system (excluding sewage treatment) that addresses the flow of dry, organic, and hazardous/e-waste across various campus zones. The solution must address real-time monitoring of waste collection points, ensure effective source segregation at high-volume areas (such as hostels, canteens, and academic blocks), and establish a sustainable workflow to process or divert solid waste away from landfills—empowering campus communities to manage their waste footprint locally and responsibly.',
  '[]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  42,
  'TSH-PS-42',
  '"Tarukosh" — Occasion-Based Tree Plantation & Green Credit Incentive Framework',
  'Community Afforestation & Green Credits',
  'Personal milestones—such as birthdays, anniversaries, family celebrations, community festivals, and corporate events—are traditionally marked by gift-giving and celebrations that often generate short-term waste and a net negative environmental footprint. While many people express a desire to contribute to green cover, individual tree planting initiatives in general society frequently suffer from low long-term participation because planting is seen as a isolated, one-off chore without ongoing personal connection or tangible recognition. Bridging personal life achievements with environmental stewardship offers a powerful way to expand green cover across cities and rural communities, yet society lacks a structured system that actively incentivizes, tracks, and rewards citizens for celebrating life events through tree planting and sustained sapling care.',
  'Develop an occasion-based tree plantation and stewardship framework for general society that empowers individuals, families, and community groups to dedicate, plant, and nurture trees to mark personal milestones and public events. The solution must establish a verifiable mechanism to log planting efforts, monitor ongoing sapling survival, and convert these verified green acts into redeemable "green credits." These credits must integrate into a broader partner ecosystem—enabling citizens to redeem them for discounts, perks, and rewards across real-world commercial platforms, retail outlets, and civic services, thereby turning personal celebrations into sustained environmental action across society.',
  '[]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  43,
  'TSH-PS-43',
  '"Dhara-Drishti" — High-Precision Tree Geotagging & Forestation Mapping',
  'Geotagging & Precision Forestation Mapping',
  'Governments, non-profit organizations, and community groups plant millions of saplings every year to combat deforestation and urban heat islands. However, a significant percentage of these saplings die within the first few months due to lack of follow-up care, mismanaged maintenance schedules, and duplicate logging. Traditional plantation records rely on manual counts or vague region-level reports, making it nearly impossible to pinpoint, monitor, or verify the survival of individual trees over time. Without exact spatial accountability, environmental investments lose transparency, and care teams cannot efficiently navigate to specific trees needing water, protection, or medical intervention.',
  'Develop a high-precision tree mapping and geotagging framework that establishes an exact digital identity and pinpoint physical location for every planted sapling across diverse urban and rural landscapes. The system must enable field volunteers, forest officers, and civic workers to uniquely tag trees with pinpoint spatial accuracy, log health updates seamlessly during maintenance visits, and provide transparent visual mapping so stewards can easily locate, track, and care for specific trees throughout their growth lifecycle.',
  '[]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  44,
  'TSH-PS-44',
  '"Anusandhan-SDG" — Campus Sustainability Compliance & SDG Alignment Platform',
  'Institutional Sustainability & UN SDGs',
  'Higher education institutions generate vast amounts of environmental data—from energy and water consumption to waste management, green cover, and social outreach projects. While colleges actively run various green initiatives, these efforts are often recorded in disconnected departmental silos. Consequently, institutions struggle to map their daily campus activities to the United Nations Sustainable Development Goals (SDGs) and comply with national environmental accreditation frameworks. Without a unified, transparent method to track compliance and align campus initiatives with global sustainability metrics, colleges miss opportunities to showcase their ecological impact and improve institutional sustainability rankings.',
  'Develop an integrated institutional sustainability compliance and SDG mapping platform that consolidates, verifies, and categorizes diverse campus initiatives against specific UN Sustainable Development Goals (such as SDG 6: Clean Water, SDG 7: Affordable & Clean Energy, SDG 11: Sustainable Cities, and SDG 13: Climate Action). The solution must streamline regulatory compliance reporting for institutional audits, track real-time resource utilization benchmarks across departments, and provide a transparent public-facing dashboard that highlights the college''s verified contributions toward global sustainability targets.',
  '[]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  45,
  'TSH-PS-45',
  '"Arogya-Setu & Nidan" — Intelligent Botanical Disease Predictor, Remedy Provider & Treatment Timeline Analyzer',
  'Botanical Diagnostics & Plant Disease Recovery',
  'Plant diseases, pest infestations, and nutrient deficiencies severely threaten crop yields, campus green belts, and community forestry projects. When plants show signs of distress—such as leaf discoloration, wilting, or fungal spots—gardeners, farmers, and campus eco-volunteers often lack immediate expert knowledge to identify the exact disease. Incorrect or delayed diagnosis frequently leads to mismanaged treatments, over-use of harmful chemical pesticides, or complete loss of the plant. Furthermore, even when a remedy is identified, growers rarely have access to structured treatment schedules or timeline analyzers to monitor recovery stages and ensure proper long-term care.',
  'Develop an intelligent botanical health analysis system that accurately predicts plant diseases from early physical symptoms, suggests eco-friendly and targeted treatment solutions, and provides a structured, time-bound recovery analyzer. The solution must allow users to input or capture visual and environmental plant symptoms, instantly receive a precise diagnostic report with verified remedies (organic, biological, or chemical), and track a personalized day-by-day treatment timeline that guides caretakers through specific care actions at critical recovery intervals.',
  '[]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  46,
  'TSH-PS-46',
  'AI-Based Urban Noise Mapping & Quiet-Zone System',
  'Urban Noise Mapping & Quiet Zones',
  'Urban noise from traffic, construction, events, and other activities can affect concentration, comfort, and quality of life, yet noise levels are rarely visible to the people experiencing them. A technology-driven system can convert scattered sound observations into an understandable environmental picture and help communities identify areas where quieter practices are needed.',
  'Develop a web/mobile platform that uses distributed sound measurements and AI-assisted analysis to map noise levels, identify recurring high-noise zones, and provide practical recommendations for creating healthier and more peaceful surroundings.',
  '["Real-Time Noise Monitoring & Mapping: Collect sound-level readings from supported mobile or IoT sensors, display noise intensity on an interactive location-based map, and identify recurring high-noise areas and time periods.","AI-Based Noise Pattern Analysis: Classify likely noise sources from available contextual or sensor data, detect unusual or sustained noise patterns, and generate alerts and trend analysis for selected locations.","Mindful Environment & Action Dashboard: Suggest practical actions for reducing unnecessary noise, show personal and community-level progress toward quieter surroundings, and encourage awareness of silence and respectful use of shared spaces."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  47,
  'TSH-PS-47',
  'AI Wildlife Crossing & Road-Safety Alert System',
  'Wildlife Protection & Road Safety',
  'Roads, railways, and other infrastructure can create dangerous barriers for wildlife, particularly near forests and ecological corridors. People often receive little warning when animals are active near a crossing. Technology can help identify risk zones and provide timely information so that human movement and wildlife movement can coexist more safely.',
  'Develop an AI-enabled system that detects or predicts wildlife movement near roads and other infrastructure and provides location-specific alerts to drivers, authorities, or conservation teams.',
  '["Wildlife Detection & Risk-Zone Identification: Use camera feeds, motion sensors, or other supported inputs to detect animal presence, identify frequently used wildlife crossing locations, and map high-risk human-wildlife interaction zones.","Real-Time Alert & Warning Engine: Generate alerts when wildlife is detected near a monitored route, provide configurable warnings for drivers, campus/security teams, or local authorities, and maintain event logs for analysis.","Coexistence & Conservation Dashboard: Visualize wildlife movement patterns and incident trends, suggest safer crossing or traffic-management measures, and promote responsible coexistence, care, and respect for living systems."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  48,
  'TSH-PS-48',
  'Microplastic Source Detection & Reduction Platform',
  'Environmental Microplastics & Conscious Consumption',
  'Microplastics can enter the environment through everyday products, synthetic materials, packaging, and other human activities. The problem is difficult to address when people cannot see where potential sources originate or how their choices contribute to the issue. A practical digital platform can turn scattered information into understandable source-level insights and reduction actions.',
  'Develop a data-driven platform that helps users or institutions identify potential microplastic sources in daily activities, track reduction measures, and discover lower-impact alternatives.',
  '["Microplastic Source Identification: Create a searchable database of common products and activities associated with microplastic release, allow users to log consumption patterns, and categorize potential sources by environment, activity, and material.","AI-Assisted Risk & Alternative Suggestions: Analyze logged activities to highlight higher-priority sources for reduction, recommend practical alternatives or behavior changes, and explain reasoning in simple language.","Reduction & Awareness Tracker: Track actions taken to reduce selected sources over time, show individual or institutional progress through clear metrics, and provide short reflection prompts encouraging conscious consumption."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  49,
  'TSH-PS-49',
  'Smart Water-Body Health Monitoring System',
  'Water Conservation & IoT Analytics',
  'Lakes, ponds, rivers, and other local water bodies can deteriorate because of pollution, changing water conditions, and unmanaged human activity. Conventional monitoring may be periodic and difficult for communities to understand. Continuous, accessible environmental information can help people recognize deterioration earlier and support timely action.',
  'Develop an IoT and analytics platform for monitoring the health of local water bodies using measurable water-quality and environmental parameters, with simple alerts and trend visualization for communities and authorities.',
  '["Multi-Parameter Water Monitoring: Collect parameters such as pH, temperature, turbidity, or dissolved-oxygen-related readings through sensors, store time-stamped readings, and provide simple health-status views based on configured thresholds.","Water Health Analytics & Alerts: Visualize historical trends and sudden changes, generate alerts when monitored parameters move outside configured ranges, and compare locations/periods to identify recurring issues.","Community Awareness & Responsible Action: Present technical readings in an easy-to-understand public dashboard, allow authorized users to record observations or suspected pollution events, and provide practical conservation guidance."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  50,
  'TSH-PS-50',
  'E-Waste Lifecycle & Responsible Disposal Network',
  'E-Waste Lifecycle & Circular Economy',
  'Electronic devices are replaced frequently, while unused phones, laptops, chargers, batteries, and other electronics can remain stored or be disposed of improperly. The environmental impact can be reduced when people can understand a device''s lifecycle and are given convenient pathways for reuse, repair, refurbishment, and responsible recycling.',
  'Develop a digital platform that tracks electronic items from ownership to reuse, repair, donation, refurbishment, or authorized recycling, helping users make informed decisions before disposing of devices.',
  '["Device Lifecycle Registry: Allow users or institutions to register electronic items with basic device and condition information, track statuses (in-use, repair-needed, reusable, donated, refurbished, recycled), and provide reminders for responsible end-of-life action.","Reuse, Repair & Recycling Matching: Suggest repair, reuse, donation, refurbishment, or recycling pathways based on device condition; match usable devices with potential recipients or institutional programs with transaction traceability.","Responsible Consumption Dashboard: Show how many devices were repaired, reused, donated, or recycled, estimate avoided disposal through platform-recorded actions, and encourage mindful purchasing, longer device use, and technology stewardship."]'::jsonb,
  5,
  5
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;

-- Verification query
SELECT COUNT(*) AS total_seeded_problem_statements FROM problem_statements;
