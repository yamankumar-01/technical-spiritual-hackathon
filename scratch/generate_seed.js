import fs from 'fs';
import path from 'path';

const psData = [
  {
    code: 'TSH-PS-01',
    title: 'Pseudo Mirror – AI/AR-Based Self-Awareness Experience',
    category: 'AR & Soul Consciousness',
    background: 'When looking in a standard mirror, we only see our physical body. Beyond physical appearance, reflective technology can help users explore self-awareness, calmness, and positive identity.',
    challenge: 'Develop an Augmented Reality (AR) "Pseudo Mirror" web or mobile application that transforms a live camera feed to visually reflect three distinct stages of self-awareness and positive identity in real time.',
    keyRequirements: [
      'Soul Consciousness (Point of Light): Real-time face tracking to pinpoint the exact center of the forehead (Ajna/Yin Tang location). Overlay a glowing, radiant point of light representing the soul. Include a calm pulsing visual effect synchronized with a soft breathing cycle.',
      'Angelic Form Overlay: Apply a real-time visual transformation layer over the user\'s reflection. Add a soft, glowing aura around the body, subtle light rays, and angelic visual effects to represent spiritual purity and the subtle body.',
      'Deity Attire Filter: A dynamic 2D/3D filter overlay representing divine attire, crowns, or traditional ornaments. Aligns seamlessly with the user\'s head and body movements to symbolize divine virtues and divine self-image.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-02',
    title: 'Mindful News Tracker – AI-Powered Information & Well-Being Platform',
    category: 'Mindful Media & Information Ethics',
    background: 'Standard newspapers are packed with noise, sensationalism, and negative stories that overwhelm students and drain their mental energy. Mindful information consumption can help students reduce information overload and make more conscious choices about the content they consume.',
    challenge: 'Design a custom newspaper curation system that lets students filter real-world news based on their personal growth goals, extracting only high-value content while enriching good news with value-based insights.',
    keyRequirements: [
      'Custom News Abstraction & Filtering: Students select specific topics or categories they want to read (e.g., Science, Positive Human Actions, Innovations, Global Peace). The tool automatically filters out sensational/negative noise and presents clean, concise summaries tailored to the student\'s selected interests.',
      'Spiritual Insights Engine: Automatically pairs every positive news story with a spiritual takeaway or inner-strength lesson (e.g., linking a story about a community build-project to the virtue of Cooperation and Unity).',
      'Mindful Reading & Reflection Dashboard: Tracks daily reading habits and presents a simple summary showing how much positive, virtue-focused content the student consumed compared to mental noise.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-03',
    title: 'Value-Based Book & Insight Tracker',
    category: 'Wisdom & Practical Living',
    background: 'Students often read books passively without putting the teachings into practice, or struggle to find books that address their specific mental and spiritual challenges. Knowledge becomes more meaningful when learners can connect what they read with practical reflection and positive action.',
    challenge: 'Design a book discovery and reflection platform that matches students with books based on their personal growth goals, providing concise summaries alongside real-world activities and positive acts to apply the book\'s core virtues.',
    keyRequirements: [
      'Need-Based Book Matching: Students select their current focus or inner challenge (e.g., overcoming overthinking, building leadership, anger management, deep focus). Recommends specific books tailored to those core values and spiritual goals.',
      'Life-Value & Insight Summaries: Summarizes each book by highlighting Core Virtue (the main spiritual value taught), Key Insights (top 3 life-changing principles), and Life Transformation (how the lesson changes perspective).',
      'Actionable Activities & Positive Acts: Extracts concrete, step-by-step activities and daily positive acts from the book, such as Self-Reflective Activity exercises to practice inner discipline (e.g., a 5-minute silent observation of thoughts).'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-04',
    title: 'Mindful Task & Time Management Platform',
    category: 'Self-Sovereignty & Time Mastery',
    background: 'Many students set daily goals but struggle with procrastination, unorganized priorities, and making self-justifying excuses when tasks are missed. Self-management depends on discipline, time awareness, and alignment between planned commitments and actual actions.',
    challenge: 'Develop an intelligent To-Do web or mobile app that combines structured goal tracking, excuse-logging, points-based rewards, and field-specific guidance to help students master time management and spiritual self-discipline.',
    keyRequirements: [
      'Smart To-Do Creation & Field Suggestions: Priority Matrix (Urgent, Important, Long-Term Growth), Domain-Based Prompts (Engineering, Design, Management, Competitive Exams), and Best-Practice Guidance breaking large goals into small micro-steps.',
      'Deadline Tracking & "Excuse Log": Set specific deadlines for every task throughout the day. If a deadline is missed, the system prompts the student to log their reason/excuse (distraction, poor estimation, lack of energy) before pushing or closing the task.',
      'Points & Integrity Scoring: Earn reward points upon successfully completing tasks within deadlines. Tracks "Self-Promise Integrity" rating based on percentage of self-made promises kept versus missed.',
      'Periodic Accountability Reports: Generates clean weekly, monthly, and yearly reports showing total tasks promised vs completed, common patterns in logged excuses, and time distribution across priorities.',
      'Self-Mastery Score (Swarajya Score): A simple progress score that goes up every time you keep a promise to yourself, showing how strong your willpower and self-control are becoming.',
      'Excuse Analyzer: Automatically separates missed-task excuses into outside control vs mindset issues, providing a quick 1-line spiritual tip on how to handle that distraction next time.',
      '2-Minute Morning & Evening Reflection: Morning 2-minute calm start to plan with focus, and evening peaceful review to celebrate what went well without guilt or self-blame.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-05',
    title: 'Character & Habit Builder',
    category: 'Character & Habit Formation',
    background: 'Our daily habits shape our character and ultimate destiny. Long-term character development starts with small, conscious changes in daily thoughts, routines, and habits. Great goals are achieved not by sudden leaps, but through small, consistent habits practiced every day.',
    challenge: 'Develop a comprehensive Habit Tracker platform that helps students map their long-term ambitions to daily micro-habits, replace negative routines with positive values, log excuses, and track long-term growth through periodic reports.',
    keyRequirements: [
      'Goal-to-Habit Engine (Ambition Mapping): Students enter long-term ambitions (top coder, public speaking, inner peace). The platform breaks these into recommended daily micro-habits tailored to their target field.',
      'Habit Transformation Matrix (Swap & Build): Habits to Quit (identify negative routines) and Habits to Build (pair each old habit with a positive replacement, e.g. replace 15 mins scrolling with 5 mins peaceful reflection).',
      'Daily Tracking & Excuse Logging: Simple daily check-in ("Did I follow this habit today?"). If No, logs excuse/reason to build self-awareness without self-guilt.',
      'Periodic Growth Reports: Generates clean weekly, monthly, and yearly habit-consistency reports tracking streaks, success rates, and common habit-breaking triggers.',
      'Master of Self (Swarajya) Level-Up: Progress bar leveling up as habit consistency grows, reminding students of mind mastery.',
      'Mindful Excuse Reflection: Analyzes logged excuses to reveal whether missed habits were external or internal mindset blocks, giving a 1-line tip for improvement.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-06',
    title: 'RTU & Mid-Term Exam (MTT) Smart Study Tracker',
    category: 'Academic Excellence & Smart Learning',
    background: 'Engineering students affiliated with Rajasthan Technical University (RTU) often struggle to manage their time between Mid-Term Tests (MTTs) and end-term university exams. While syllabus topics and notes are available, students lack a structured system that breaks down massive unit syllabi into manageable daily targets aligned with specific exam patterns (Part A, B, and C questions).',
    challenge: 'Develop an all-in-one web/mobile academic tracking platform tailored for RTU engineering students that maps branch-wise syllabi, provides embedded notes, tracks study deadlines for both MTTs and RTU main exams, and integrates smart exam-oriented features.',
    keyRequirements: [
      'Branch & Unit-Wise Syllabus Mapping: Dropdown selection for Branch (CSE, AI & DS, ECE, ME, Civil, EE, etc.), Year/Semester, and Subjects with an interactive unit-by-unit topic checklist and attached notes (PDFs, drive links, video references).',
      'Dual Exam Deadline Tracker (MTT vs RTU): MTT Mode for Mid-Term 1 or 2 with short-term completion deadlines, and RTU Main Exam Mode with master deadline timer for complete 5-unit syllabus with weightage indicators.',
      'Progress Dashboard: Real-time visual progress bars showing percentage of topics completed per subject and overall semester readiness.',
      'Previous Year Question (PYQ) Integration: Tag each topic with past RTU exam questions (e.g. "Asked in RTU 2023, 2025 - 8 Marks") with an Important Topics / Repeated Questions filter.',
      'RTU Paper Pattern Prep Tool: Categorize notes into Part A (2-Mark concise), Part B (Medium/Derivations), and Part C (12/15-Mark long numericals/design).',
      'Smart Revision Scheduler (Spaced Repetition) & Peer Note-Sharing Hub: Automated revision reminders 3 days and 1 day before exam, plus peer note upload and voting hub.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-07',
    title: 'Student Healthy Diet & Clean Food Companion',
    category: 'Sattvic Lifestyle & Nutrition',
    background: 'Students frequently rely on unhygienic street food or mess meals cooked with repeatedly reused oil and low-quality ingredients, leading to long-term health and energy issues. In Raj Yoga, pure food (Sattvic Aahar) is directly connected to a calm and energetic mind ("Jaisa Ann, Waisa Mann").',
    challenge: 'Develop a web or mobile application that helps students transition away from unhygienic junk food by organizing healthy diets, suggesting affordable nutrient-dense recipes, offering step-by-step cooking manuals, and educating them on nutritional benefits.',
    keyRequirements: [
      'Food Categorization & Diet Planner: Divide daily food intake into clear categories: Energy (Breakfast), Vitality (Lunch), Focus (Snacks), and Light Recovery (Dinner) tailored to student routine and budget.',
      'Student-Friendly Recipe & Preparation Manuals: Recommend healthy, fast, and low-cost dishes cooked easily in a hostel room or PG setup (kettle, induction, single stove) with detailed preparation manuals, time estimates, and ingredients.',
      'Nutritional & Health Value Breakdown: Clear profiles for proteins, vitamins, healthy fats, calories, explicitly highlighting how each meal boosts mental clarity, stamina, and physical vitality.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-08',
    title: 'Resource, Library & Creative Project Tracker',
    category: 'Campus Resource Management',
    background: 'The Social Responsibility Cell (SRC) Club manages a wide variety of unique resources—value-based books, educational games, value-based study materials, activity kits, and project reports/copies created by students. Because these materials are frequently used for workshops, sessions, and student projects, tracking what is available, what is currently being created, and where items are stored becomes challenging without a centralized system.',
    challenge: 'Develop an all-in-one resource and inventory tracking application for the campus club to manage its library, track production/creation counts of value-based games and study kits, monitor student project copies, and streamline item issuance.',
    keyRequirements: [
      'SRC Library & Study Material Catalog: Searchable digital catalog for value-based books, spiritual literature, AV materials, with issue & return tracking and automated due-date reminders.',
      'Creative Production & Quantity Tracker ("Creation Hub"): Real-time counter tracking units created/assembled (e.g. Value-Game Kits created: 50/100, Handouts printed: 500) and raw supply logs.',
      'Student Project & Activity Archive: Centralized ledger for all student project copies and reports categorized by year, domain, and lead student/mentor.',
      'Value-Games & Activity Kit Management: Dedicated inventory tracking game condition, missing components, and current location (In Lab / Out for Workshop).'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-09',
    title: 'Diverse Dialogue & Keynote Session Manager',
    category: 'Wisdom Archive & Event Coordination',
    background: 'The campus club regularly hosts distinguished personalities, thought leaders, industry experts, and social changemakers for "Diverse Dialogue" guidance and personality development sessions. Currently, inviting guests, gathering their profiles, generating post-event reports, and archiving their key messages is done manually across scattered files, leading to disorganization and lost institutional memory.',
    challenge: 'Develop an all-in-one web or mobile platform with simple form-based entry that automatically generates formal invitation emails and standardized post-event reports for all "Diverse Dialogue" guest sessions.',
    keyRequirements: [
      'Guest Profile & Event Entry Form: Fields for Guest Name, Role, Organization, Societal Service, Achievements, Date/Time, Core Topic, with toggle between Pre-Event (Invitation) and Post-Event (Reporting).',
      'One-Click Formal Email Generator: Automatically inserts details into formal templates to generate ready-to-send Invitation Emails, Follow-up Reminders, and Thank-You Letters.',
      'Automated Post-Event Report Generator: Compiles speech takeaways, attendance count, and media links into a standardized, beautifully formatted Event Report PDF.',
      'Speaker & Wisdom Archive: Searchable repository storing past guest profiles, generated reports, and key wisdom shared for future student batches.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-10',
    title: 'Mindful Traffic Control & Hourly Meditation Companion',
    category: 'Mindfulness & Meditation Tech',
    background: 'In our fast-paced daily routines, continuous mental activity causes stress, focus loss, and decision fatigue. A practical mindfulness approach, often described as Traffic Control of the Mind (Man Ka Traffic Control), encourages short intentional pauses where individuals pause for just 1 minute every hour. This brief pause stops the automatic flow of thoughts, resets mental energy, and grounds the mind in peace, resilience, and clarity before resuming work.',
    challenge: 'Develop a mobile application that automates customizable hourly "Traffic Control" breaks, plays powerful 1-minute guided audio commentaries and soothing music, and offers an on-demand library of mindfulness and meditation sessions for quick mental re-energizing throughout the day.',
    keyRequirements: [
      'Customizable Hourly "Traffic Control" Chimes: Set custom pause schedules with soft peaceful chimes or gentle notifications ("Time for a 1-Minute Mindful Pause").',
      '1-Minute Power Meditation Engine: Automated audio launch playing 1-minute guided commentaries on Inner Peace, Power, Purity, Calmness, with calming ambient visuals.',
      'On-Demand Meditation & Commentary Hub: Mood-based commentaries (Stress Relief, Pre-Exam Focus, Deep Sleep) and soothing background frequencies (flutes, soundscapes, binaural beats).',
      'Daily Mindful Streak & Energy Log: Tracks pauses completed throughout the day with simple 1-tap post-meditation check-in (Energized / Calm / Focused).'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-11',
    title: 'Offline Counseling & Well-Being Booking Portal',
    category: 'Mental Health & Confidential Booking',
    background: 'Students frequently face academic stress, emotional burnout, personal challenges, and career confusion. The campus club offers dedicated, confidential, in-person (offline) counseling sessions at the Raj Yoga Thought Lab. However, managing paper-based or verbal appointments manually leads to crowded waiting areas, scheduling overlaps, and a lack of privacy for students seeking guidance.',
    challenge: 'Develop a simple, streamlined booking application for students to request private offline counseling sessions at the Thought Lab, while enabling counselors to accept requests, manage room schedules, and share post-session guidance points.',
    keyRequirements: [
      'Simple Offline Booking System: Request in-person sessions at the Thought Lab by selecting preferred date, time slot, and core concern (Academic Stress, Emotional Balance, Relationships, Self-Discipline) with privacy first.',
      'Counselor Dashboard & Slot Manager: Review incoming requests, accept, reschedule, or allocate specific rooms/counselors with a single click, and send automated confirmation venue passes.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-12',
    title: 'Soft Skills, Resource Vault & Adaptive AI Growth Hub',
    category: 'AI Communication & Career Readiness',
    background: 'Many college students struggle with Spoken English, public speaking, body language, and overall confidence—limiting placement success and personal growth. While many wish to improve, existing platforms lack a closed-loop system that identifies specific speech flaws, auto-recommends targeted exercises to fix those gaps, and provides curated resources alongside peer success roadmaps.',
    challenge: 'Develop an adaptive web/mobile learning portal featuring AI speech analysis, automated gap detection that instantly triggers personalized practice activities, a comprehensive resource vault, peer success stories, and progress analytics.',
    keyRequirements: [
      'Gap-Detection & Adaptive Practice Engine: Pinpoints communication gaps (filler words, speaking pace >160 WPM, low vocabulary, monotone pitch) and auto-assigns targeted practice modules.',
      'Daily Skill-Building Activities & Action Tasks: Structured daily execution tasks with an interactive planner for listening, speaking, and reading exercises.',
      'Comprehensive Soft Skills Resource Vault: Hand-picked course playlists, downloadable PDF cheat sheets, professional email templates, and grammar guides.',
      'Practice & AI Feedback Studio: Interactive AI conversation partner for mock interviews and video/audio speech analysis with actionable correction points.',
      'Peer Inspiration & Success Blueprints: "Zero to Hero" alumni stories and peer reviews.',
      'Progress Analytics & Smart PDF Reports: Visual metrics tracking streaks, vocabulary expansion, speech clarity, and adaptive performance summary reports.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-13',
    title: 'Campus Venue & Event Collision Management Portal',
    category: 'Smart Campus & Facility Operations',
    background: 'Colleges host numerous events across auditoriums, seminar halls, and grounds managed by different clubs, departments, and student bodies. Currently, offline or informal booking leads to venue collisions, sudden cancellations when management events take priority, and confusion regarding key contacts, hall capacity, and open/close timings.',
    challenge: 'Develop an all-in-one venue booking and event management platform that prevents schedule collisions, enforces priority-based approvals, manages deadline-based faculty sign-offs, and provides complete venue operational guidelines.',
    keyRequirements: [
      'Conflict-Free Schedule & Priority Engine: Real-time availability calendar and priority hierarchy where institutional events override student club events with instant alerts.',
      'Deadline-Driven Approval Workflow: Faculty sign-off cutoff timers with auto-release logic if approval is not granted before the deadline.',
      'Complete Venue Operational Directory: Displays hall capacity, AV/projection setup, seating charts, and caretaker contact info.',
      'OD (On-Duty) & Attendance Policy Module: Digital OD request generation with capacity caps, plus Clean Venue Pledge (Swachh Campus) pre- and post-event photo check-in, and energy usage tracking.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-14',
    title: 'Swayamkrut – Daily Goodness Journal & Positive Thought Platform',
    category: 'Digital Well-Being & Positive Deeds',
    background: 'In a digital environment dominated by negative news and social media comparison, students are rarely encouraged to reflect on goodness, daily virtues, and positive deeds (Punya Karma). While many engage in small acts of kindness or experience inspiring reflections throughout their day, they lack a dedicated, uplifting platform to document, reflect upon, and share these micro-stories with their campus community.',
    challenge: 'Develop a web/mobile micro-blogging app where students log their daily acts of goodness (Swayamkrut) and uplifting reflections, featuring a community-selected "Thought of the Day" headline, photo-journaling capabilities, and privacy-conscious story sharing.',
    keyRequirements: [
      'Daily "Thought of the Day" Banner: Highlights one golden thought of the day on the home screen as the daily community headline, curated by peer upvotes or rotation.',
      'Photo-Blog Journaling ("Story of Goodness"): Micro-blog editor for short narrative posts capturing acts of goodness with privacy-conscious scenic/nature photo uploads.',
      'Community Feed of Positivity: Clutter-free feed with zero-hate pure appreciation reactions (Inspired, Pure Vibe, Grateful, Compassionate).',
      'Personal "Goodness Ledger" (Punya Khata): Private timeline of reflections, 21-Day Goodness Streak Challenge, and Ripple of Inspiration mechanism allowing peers to adopt good deeds.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-15',
    title: 'Global MindHub – Inter-Lab Network & Resource Portal',
    category: 'Collaborative Networks & Lab Operations',
    background: 'The Raj Yoga Thought Lab initiative has expanded from its origin to 8–10 regional locations, with plans to establish centers across major cities. Currently, each Thought Lab operates as an isolated node. There is no unified system to share assets, coordinate joint events, track national student impact, or facilitate seamless communication between directors, mentors, and student coordinators across different campuses.',
    challenge: 'Develop a centralized web and mobile management platform that connects all regional and future Raj Yoga Thought Labs into a unified digital network—enabling inter-lab resource sharing, real-time communication, joint event management, and network-wide impact analytics.',
    keyRequirements: [
      'Centralized Multi-Lab Management Directory: Geolocation map showing all Thought Labs with facility specs, lead contacts, and role-based access control.',
      'Inter-Lab Resource & Asset Exchange: Shared asset registry (VR headsets, meditation headsets, decor) with loaner transfer requests between labs.',
      'Unified Communication & Knowledge Forum: Channel-based messaging for lab leads and a centralized content bank for meditation tracks, workshop slides, and guides.',
      'Synchronized Events & "Global Pause" Orchestrator: Joint session scheduling and national impact analytics (total meditation minutes, students mentored, sessions conducted).'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-16',
    title: 'Interactive Self-Awareness & 7 Virtues IoT Touch Wheel',
    category: 'IoT Hardware & Experiential Philosophy',
    background: 'The foundational lesson of Raj Yoga is "Soul Consciousness"—understanding that we are peaceful souls controlling a physical body, driven by 7 Eternal Virtues (Knowledge, Purity, Peace, Love, Joy, Bliss, and Power). Every life problem stems from a temporary drop in one of these original virtues. While the concept is profound, students benefit from a simple, tactile physical interface that gives immediate audio-visual explanations to encourage reflection and self-awareness.',
    challenge: 'Develop a simple physical touch-wheel installation for Thought Labs (paired with an integrated screen or speaker) where touching any of the 7 virtue segments instantly triggers a full audio-visual explanation of that virtue, its connection to the soul, and practical steps to embody it.',
    keyRequirements: [
      'Physical Touch-Sensing Virtue Wheel (Hardware): 7-segment capacitive touch circular installation with ambient LED backlighting behind each section.',
      'Simple Tactile Activation: Touching any virtue segment illuminates that section and activates the paired display/speaker.',
      'Instant Interactive Explanation Engine: Engaging audio commentary and on-screen visual diagrams (e.g. Driver & Car analogy for Soul Consciousness) explaining the virtue and practical embodiment steps.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-17',
    title: 'Anubhav – Interactive Course & Multi-Lab Learning Portal',
    category: 'Interactive E-Learning & Experiential Courses',
    background: 'The traditional 7-step Raj Yoga Meditation Course (Understanding the Self, Understanding the Supreme, The World Stage, Raj Yoga, Karma Philosophy, Journey from Hell to Heaven, and Aim of Human Life) is deeply transformative. However, modern students often struggle to relate to abstract spiritual terms without practical analogies, student stories, and shared peer experiences. Furthermore, students need structured, hands-on activities with clear visual guides to apply these concepts, while Thought Lab coordinators lack a standardized digital platform to manage course resources across campuses.',
    challenge: 'Develop an interactive web/mobile Raj Yoga Course application that translates the 7 core steps into real-life analogies, features an isolated activity hub with demo video guides, highlights peer experience-sharing, manages Thought Lab learning assets, and connects multi-campus Thought Lab networks under a single umbrella.',
    keyRequirements: [
      '7-Step Analogy-Driven Course Player: Real-life analogy framework (Soul as Driver of Body/Car; Karma as Input/Output in Code) across short videos, audio commentaries, and story-cards.',
      'Dedicated Course Activity Hub & Demo Videos: Standalone activity module listing all practical mind exercises with short video tutorials and visual guides.',
      'Peer Experience & Beneficiary Showcase ("Anubhav" Wall): Student testimonials, impact metrics, and experiential learning badges logging real-life concept applications.',
      'Multi-Thought Lab Resource & Administrative Engine: Central repository for facilitators to manage slides and connect online learning with offline branch sessions.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-18',
    title: 'Thoughts to Destiny – Gamified Habit & Character Building Platform',
    category: 'Gamification & Character Building',
    background: 'External achievements (grades, placements, status) are merely secondary outcomes. True long-term success is built on inner mastery—a positive mindset, determination, self-control, and purposeful fire (Willpower). As shown in the Raj Yoga growth ladder (Thoughts → Feelings → Attitude → Actions → Habits → Personality → Destiny), true transformation begins at the thought level. However, students lack a structured, engaging way to practice daily micro-habits and internalize these steps into a powerful personality.',
    challenge: 'Develop a gamified web/mobile app that turns character development into a step-by-step quest—offering daily micro-tasks, short video coaching sessions for every stage of the ladder, and progress tracking to help students master their mind and unlock their ultimate potential.',
    keyRequirements: [
      'Gamified "Path to Destiny" Quest Engine: 7-level progression (Thought Mastery → Emotional Balance → Right Attitude → Purposeful Action → Habit Building → Integrated Personality → Master of Destiny) with daily micro-tasks.',
      'Stage-Wise Video Masterclasses: Guided insight sessions unlocking short high-impact videos on psychology and practical demos (handling failure, exam focus, overcoming laziness).',
      'Inner Power & Streak Analytics Dashboard: Mindset metrics tracking quest streaks, Willpower Points, and virtual rewards/badges redeemable at the Thought Lab.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-19',
    title: 'Tree of Consciousness – Interactive IoT Touch Display & Audio-Visual Game',
    category: 'IoT Hardware & Mind Transformation',
    background: 'The human state of mind can be represented as a tree—rooted either in Body Consciousness (vices like anger, greed, ego, lust, and fear) or Soul Consciousness (virtues like peace, wisdom, love, joy, and spiritual power). Students often struggle to recognize how operating from negative emotions poisons their actions, while constructive choices yield positive mental fruit. A visual, tactile game is needed to clearly demonstrate this contrast in real time.',
    challenge: 'Develop an interactive hardware-software installation (IoT touch board paired with a display/app) featuring the "Tree of Consciousness." When a user touches or clicks any emotion/face icon (e.g., volcano/anger, crown/ego, peaceful meditating figure, empowered hero), the system automatically triggers an audio-visual narration explaining its root cause, life consequences, and how to shift from reactive states toward more constructive awareness.',
    keyRequirements: [
      'Interactive IoT Physical Touch Board & Digital Screen: Capacitive touch nodes representing emotional states (Left: Anger/Volcano, Ego/Crown, Greed, Fear; Right: Focus, Joy, Courage, Peace) with a dual-tree visualizer illuminating decaying vs blooming branches.',
      'Auto-Play Audio-Visual Explanation Engine: Video/audio narration explaining root cause, impact on decisions/health, and practical Raj Yoga reflections to transform negative states.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-20',
    title: '16 Divine Virtues – Interactive IoT Display & Cultivation Guide',
    category: 'IoT Hardware & Virtue Cultivation',
    background: 'In value-based philosophy, inner excellence is embodied by 16 foundational virtues (such as Humility, Sweetness, Patience, Tolerance, Courage, and Contentment). While students understand these values conceptually, they often find it difficult to recognize when a specific virtue is lacking or how to systematically cultivate it in response to real-life campus stresses, conflicts, and academic pressure.',
    challenge: 'Develop an interactive hardware-software installation (IoT touch board paired with a display/app) featuring the 16 Divine Virtues. When a user touches or clicks any virtue button, the system automatically triggers an audio-visual breakdown explaining its core meaning, real-life relevance, and actionable methods to develop that virtue daily.',
    keyRequirements: [
      '16-Node IoT Touch Interface (Hardware & Software): Tactile panel featuring 16 illuminated touch nodes representing specific divine virtues (Sweetness, Patience, Honesty, Courage) with active backlighting on the console and digital screen.',
      'Auto-Play Explanation & Development Engine: Audio-visual guide explaining Core Meaning, Depletion Signs (e.g. lack of patience causing frustration), and 3 clear actionable steps to cultivate that virtue daily.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-21',
    title: '16 Essential Life Skills – Interactive IoT Training Board & Skill Builder',
    category: 'IoT Hardware & Life Skills Training',
    background: 'Beyond academic knowledge, holistic success requires 16 essential life and soft skills (such as Active Listening, Conflict Resolution, Time Mastery, Emotional Regulation, Decision Making, and Adaptability). Students frequently encounter situations requiring these skills but lack a quick, interactive medium to learn how each skill works and how to actively build it.',
    challenge: 'Develop an interactive hardware-software installation (IoT touch board paired with a display/app) featuring the 16 Essential Life Skills. Touching any skill button triggers an immediate audio-visual lesson explaining the skill, why it matters in academic and professional life, and step-by-step practical exercises to master it.',
    keyRequirements: [
      '16-Skill IoT Interactive Console: Touch-sensitive skill matrix organized into 16 core skill buttons (Stress Management, Communication, Critical Thinking, Team Leadership) synchronized with visual on-screen modules.',
      'Auto-Play Explanation & Action Plan Engine: Engaging visual breakdown detailing Skill Definition with student analogies, Real-World Impact on placements, and a step-by-step Skill-Building Framework.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-22',
    title: 'Shikhar – Legend\'s Journey & Resilience Masterclass Portal',
    category: 'Inspirational Learning & Resilience',
    background: 'Modern students often feel overwhelmed and give up when facing small setbacks, academic stress, or personal failures. They lack perspective on how legendary figures (e.g., Dr. A.P.J. Abdul Kalam, Mother Teresa, iconic athletes, and social pioneers) overcame immense struggles, poverty, and repeated rejections to achieve greatness. These icons didn\'t succeed because they faced no problems; they succeeded because their inner resilience, purpose, and values prevented them from giving up.',
    challenge: 'Develop an interactive graphical web and mobile app featuring a visual "Struggle-to-Success" journey map for legendary personalities—complete with rich infographics, curated video links, personal quotes, documented hardship stories, and reflection tools showing how they faced adversity without compromising their values.',
    keyRequirements: [
      'Interactive Visual "Struggle-to-Success" Graph Engine: Node-based dual journey timeline with Red Nodes for major life crises and Green Nodes for breakthroughs.',
      'Click-to-Reveal Story & Videos: Clicking crisis nodes reveals the hardship, the thought pattern/mindset that kept them going, and curated historical media clips.',
      'Problem-Versus-Perspective Comparison Engine: "My Struggle vs. Their Struggle" matching student setbacks to historical parallels faced by legends.',
      'Quote & Wisdom Repository & Reflection Journal: Searchable repository categorized by resilience, faith, failure, discipline, with reflection logs.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-23',
    title: 'Swayam-Sanyam – AI Digital Detox, Multi-Timeline Analytics & Goal Alignment App',
    category: 'AI Digital Detox & Focus Tech',
    background: 'Excessive smartphone usage and mindless scrolling degrade attention spans, increase mental fatigue, and derail students from their core goals. Often, high screen time isn\'t purely "wasteful"—students use devices for genuine study, project work, or skill development. Existing app-blockers fail to distinguish productive usage from distracting habits, lack long-term goal-alignment analytics, and do not proactively alert users when screen thresholds are exceeded.',
    challenge: 'Develop an intelligent web/mobile digital detox application that analyzes screen-time patterns, categorizes productive vs. distracting app usage based on user intent, provides weekly, monthly, and yearly goal-alignment graphs, triggers real-time alerts for excess screen usage, and delivers spiritual micro-breaks (Raj Yoga mindfulness and virtue resets) to maintain focus.',
    keyRequirements: [
      'Contextual App Usage & Intent Classifier: Purpose-tagging system distinguishing screen time spent advancing core goals versus unproductive scrolling.',
      'Multi-Timeline Graphical Analytics Engine: Visual dashboards (Line Charts, Heatmaps) tracking Goal Alignment Index, Long-Term Usage Trends, and Daily Focus Scores.',
      'Smart Excess Alerts & Mindful Interventions: Push notifications when limits are exceeded, triggering 2-minute pattern-based Raj Yoga micro-breaks with guided breathing routines and virtue-recharge affirmations.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-24',
    title: 'Hell to Heaven – Physical/IoT Remote-Controlled Path Board Game',
    category: 'Physical/IoT Board Games & Ethics',
    background: 'The Raj Yoga philosophy illustrates the soul\'s journey along an S-curved path moving from lower states of suffering and vice (Hell / Iron Age) upward to states of purity, peace, and perfection (Heaven / Golden Age). Abstract concepts can be challenging to grasp through reading alone; physical, tactile games—like maneuvering a ball along a winding path—offer an engaging, hands-on way to understand how choices, virtues, and vices propel or derail personal growth.',
    challenge: 'Develop a physical wooden/platform-based maze board representing the winding S-path from "Hell to Heaven." Players guide a ball (representing the soul) along the track using physical tilt mechanics, remote controllers, or smart joystick interfaces. Navigating past obstacles (vices) unlocks explanatory audio-visual cues or screen prompts explaining how positive virtues help the soul reach the highest state of peace.',
    keyRequirements: [
      'Physical S-Curve Platform Track (Hardware): Crafted multi-stage wooden/plastic S-path with obstacles representing vices (Anger, Greed, Ego), navigated via joystick, Bluetooth remote, or dual-axis tilt knobs.',
      'Smart Checkpoints & Audio-Visual Feedback: Magnetic or light sensors along the track detecting the ball to trigger audio explanations of virtue checkpoints vs vice pitfalls.',
      'Demonstrational Prototype Model: Open reference design for physical mechanical wooden balance boards and smart remote-controlled IoT installations.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-25',
    title: 'The World Cycle – Interactive Mind Activity & Platform Board Game',
    category: 'Mind Activity Platform Games',
    background: 'The World Drama Cycle (Satyug, Treta, Dwapar, and Kaliyug) represents the 4-age cycle of time and human consciousness in Raj Yoga. Understanding how human virtues gradually shift from complete purity (Satyug) to confusion and conflict (Kaliyug), and how to transform back through the Confluence Age (Sangamyug), provides profound perspective on life. Students need an interactive, platform-based mind game to explore these four quadrants and test their knowledge of spiritual time cycles.',
    challenge: 'Develop a wooden or physical platform-based mind activity game (with optional digital software support) centered on the World Drama Cycle. Players complete mind puzzles, strategic token placements, or platform movements across the 4 age quadrants to learn the characteristics, history, and life and value-based lessons of each era.',
    keyRequirements: [
      '4-Quadrant Circular Platform Board (Hardware / Physical): Modular circular board divided into Satyug, Treta, Dwapar, Kaliyug, and Sangamyug apex, where players move tokens to progress.',
      'Mind Puzzles & Era Challenges: Scenario cards and digital app prompts representing the mental climate of each era with Confluence Bridge strategy.',
      'Flexible Hybrid Design: Adaptable as a physical wooden tabletop game, IoT-assisted board with glowing LEDs, or companion web/mobile app.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-26',
    title: 'AuraSpace – AI Voice-Driven Smart Well-Being Room & Environment System',
    category: 'Smart Environment & Voice AI',
    background: 'The Thought Lab features a dedicated meditation room where students visit to recharge, practice Raj Yoga, and reduce stress. However, every individual requires a different combination of ambient audio, guided commentary, and lighting/visualization to reach a deep state of peace. Traditional static playlists lack personalization, and manually navigating screens or buttons breaks the meditative, calm mindset. An intuitive, hands-free conversational interface is needed to personalize the room\'s atmosphere instantly.',
    challenge: 'Develop an AI-powered smart room control system for the meditation space that allows students to customize their meditation experience entirely through natural voice interaction. Upon entering and activating the system, users can speak with an ambient AI assistant to dynamically curate ambient background music, guided Raj Yoga commentaries, visual projection themes, and lighting colors based on their current mood or preference.',
    keyRequirements: [
      'AI Voice Conversational Interface: Hands-free ambient microphone/speaker system activated by wake phrase ("Hello Aura" / "Start Meditation") translating speech into custom presets.',
      'Multi-Sensory Room Synchronization: Synchronizes ambient background audio, Raj Yoga commentaries, IoT RGB LED smart lighting, and visual wall projections.',
      'Mood-Driven AI Recommendation System: State-based presets (e.g. "I\'m feeling very stressed before an exam" -> soft blue lighting, relaxing rain audio, 3-minute peace commentary).',
      'Session Timer & Silent Transition: Smooth audio fade-out and gentle lighting brightening at the end of the session.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-27',
    title: 'Sanskar Khel – Value-Based Group Game Innovation Platform',
    category: 'Experiential Learning & Group Game Design',
    background: 'Experiential learning through games is one of the most powerful ways to internalize core values, life skills, and value-based principles. Traditional group activities often focus solely on competition or physical speed, missing opportunities to build empathy, teamwork, and moral clarity. Students need an open innovation framework to conceptualize, design, and demonstrate original value-based games—ranging from simple instruction-led physical icebreakers to card and board games.',
    challenge: 'Develop an open innovation platform and showcase framework where students design and present original value-based group games (instructional games, card games, or board games). Participants submit their concepts using structured PPT decks, short demo video executions, or live physical game prototypes to demonstrate how play can foster values like cooperation, tolerance, trust, and self-control.',
    keyRequirements: [
      'Multi-Format Game Design Categories: Instruction-Only Physical Games (icebreakers, coordination), Value-Based Card Games (strategic deck-building on ethics), and Interactive Board Games.',
      'Standardized Submission & Evaluation Module: Structured PPT template engine detailing Game Objective, Target Value, Rules, and Debrief Prompts, plus video upload hub.',
      'Peer Playtesting & Feedback Loop: Playtesting portal allowing Thought Lab teams to rate engagement and moral impact.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-28',
    title: 'AuraCompanion – Smart IoT Voice-Enabled Home Meditation Device',
    category: 'IoT Hardware & Consumer Electronics',
    background: 'While campus meditation spaces like Thought Labs offer ideal conditions for mindfulness, maintaining a consistent daily meditation practice at home remains a major challenge for students and families. Distractions, busy schedules, and the effort of manually searching for meditation tracks on smartphones disrupt the peaceful mindset needed for meditation. There is a need for a dedicated, standalone home IoT hardware product—featuring iconic Raj Yoga visual symbolism (such as the red glowing Supreme Light emblem)—that acts as an ambient conversational voice guide for personal meditation routines.',
    challenge: 'Develop a compact, consumer-ready smart IoT desktop device featuring an illuminated Supreme Light medallion display, high-fidelity audio, and a conversational AI voice engine. The device operates entirely hands-free, processing natural speech commands to play customized meditation music, deliver guided audio commentaries, set smart meditation reminders, and create a peaceful atmosphere in any home environment.',
    keyRequirements: [
      'Standalone Voice-Activated Smart Console (Hardware & IoT): Desktop unit with illuminated glowing Supreme Light medallion (Drishti point) and far-field mic array.',
      'Conversational AI Voice & Meditation Assistant: Natural speech processing to play commentaries, flute music, or Amrit Vela alarms.',
      'Smart Scheduling & Daily Routine Manager: Natural voice reminders with soft pulsing light cues for scheduled breaks.',
      'Offline & Cloud Hybrid System: Built-in local offline commentaries so users can meditate without active internet.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-29',
    title: 'Ashtashakti – Interactive IoT Touch Wheel & Audio-Visual Power Activation Portal',
    category: 'IoT Hardware & 8 Spiritual Powers',
    background: 'In Raj Yoga philosophy, the soul possesses 8 spiritual powers (Ashtashakti): Power to Withdraw (Sametne ki Shakti), Power to Pack Up, Power to Tolerate (Sahan karne ki Shakti), Power to Adjust (Samaye ki Shakti), Power to Discern (Parakhne ki Shakti), Power to Judge (Nirnay karne ki Shakti), Power to Face (Samna karne ki Shakti), and Power to Cooperate (Sahyog karne ki Shakti). While represented visually using clear symbols (e.g., the tortoise for withdrawing, scales for judgment, a tree for tolerance), students often struggle to apply these powers during real-life college stress, peer pressure, or decision paralysis.',
    challenge: 'Develop an interactive hardware-software installation (an IoT touch wheel paired with a screen/app) featuring the 8 Powers of the Soul. Clicking or touching any power node triggers an immediate audio-visual lesson explaining the power\'s core meaning, its visual symbolism, and practical Raj Yoga exercises to inherit and activate that power in daily life.',
    keyRequirements: [
      '8-Node Interactive IoT Touch Wheel: Octagonal touch console matching the 8 visual symbols (Tortoise, Luggage, Tree, Ocean/River, Magnifying Glass, Scales, Storm/Walker, Helping Hands).',
      'Active Backlighting: Tapping a node illuminates that power and updates the screen interface.',
      'Auto-Play Explanation & Activation Engine: Audio-visual breakdown covering Symbolic Meaning, Real-Life Campus Scenarios, and Inheritance Meditation Framework.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-30',
    title: 'Raj Yoga Pillars & Benefits – Interactive IoT Console & Audio-Visual Transformation Hub',
    category: 'IoT Hardware & Lifestyle Transformation',
    background: 'The foundation of Raj Yoga rests on four core pillars (Divya Gyan / Divine Knowledge, Raj Yoga Meditation, Satvik Ahar / Pure Lifestyle, and Divya Guna / Divine Virtues), which yield multifaceted benefits across mental, physical, emotional, and social life (such as stress control, enhanced focus, pure relationships, and decision-making clarity). Students often view lifestyle discipline as rigid or restrictive without understanding the direct, positive life outcomes each pillar produces.',
    challenge: 'Develop an interactive hardware-software installation (an IoT touch console paired with a display/app) featuring the 4 Pillars and their surrounding Benefits. Touching any pillar or benefit node triggers an immediate audio-visual lesson explaining the connection between lifestyle choices, inner peace, and real-world student benefits, alongside practical steps to integrate these pillars daily.',
    keyRequirements: [
      'Dual-Tier Interactive IoT Touch Console: Central 4 Core Pillar nodes and 12 outer benefit nodes (Stress Control, Better Sleep, Improved Focus, Healthy Habits).',
      'Dynamic Lighting Connections: Tapping a pillar illuminates its corresponding benefit nodes on the console and display.',
      'Auto-Play Explanation & Integration Engine: Video/audio commentary explaining Core Concept, Student Impact, and 3 micro-habits for daily college life.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-31',
    title: 'Kalpavriksha – 3D Smart AI Tree of Virtues & Ambient Meditation Hub',
    category: '3D Design, AI & Embedded Hardware',
    background: 'The Tree of Virtues represents how fundamental human values (such as Love, Compassion, Peace, Truth, Patience, and Purity) branch out to create a harmonious mental climate. While static posters depict these concepts visually, modern students engage far better with interactive, multi-sensory physical objects. There is a need for a hands-on student hardware project combining 3D product design, embedded AI, touch sensors, and dynamic audio-visual feedback to bring this virtue tree to life.',
    challenge: 'Design and build a 3D physical/digital model of the "Tree of Virtues" equipped with capacitive touch leaves, embedded AI, dynamic LED illumination, and custom meditation audio streams. When a user interacts with a specific virtue leaf (e.g., Peace, Compassion, Patience), the AI engine analyzes the choice, plays targeted meditation music/commentaries mapped to that virtue, and provides conversational guidance to cultivate that quality.',
    keyRequirements: [
      '3D Physical Tree Model & Touch Leaves: Sculpted/3D-printed installation with capacitive touch leaves mapped to 11+ virtues with individual micro-LED backlighting.',
      'Embedded AI Conversational Engine & Music Mapper: Voice and touch interaction mapping virtues to specialized ambient meditation tracks and guided commentaries.',
      'Mood Diagnostic & Personalized Recommendations: AI diagnoses feelings and lights up the antidote leaf (e.g. Patience leaf for stress).',
      'Dynamic Audio Sync & QR Track Downloader: Base QR code to transfer meditation audio streams to smartphones.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-32',
    title: 'Karma Wheel – Interactive Cause-and-Effect Game Engine & Platform Hub',
    category: 'Game Design & Cause-and-Effect Systems',
    background: 'The Law of Karma (As you sow, so shall you reap) is a core pillar of value-based philosophy. Every thought, word, and action generates a corresponding reaction—shaping personal peace, relationships, and mental state. However, students often treat actions as isolated events, ignoring how small daily choices compound over time. To internalize this, students need an open creation platform to design software, IoT hardware, wooden tabletop, or card-based games that simulate cause-and-effect loops in real time.',
    challenge: 'Develop an open game-design framework and multi-format submission platform focused on the "Law of Karma." Student teams create original games (digital apps, IoT smart boards, physical wooden maze games, or strategic card decks) where every player action produces an immediate, visible consequence—teaching cause and effect, moral decision-making, and long-term accountability.',
    keyRequirements: [
      'Category A: Software & Digital Sims (interactive choice-driven RPGs where choices alter world/stats).',
      'Category B: Tactile IoT & Smart Hardware Boards (sensors and tracks reacting to positive/vice tokens).',
      'Category C: Wooden Tabletop & Platform Games (craft-based mechanical maze and marble runs).',
      'Category D: Action-Reaction Card Games (strategic deck-building trading short-term gains for harmony).'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-33',
    title: 'Swayam-Drishti – AI-Powered Dynamic Personal & Scenario SWOT Analysis Engine',
    category: 'AI Self-Analysis & Decision Support',
    background: 'While students frequently encounter the concept of SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis in management and personal growth modules, traditional SWOT exercises are static, one-time paper activities. When facing real-world campus situations (e.g., career decisions, project failures, or team conflicts), students struggle to update their analysis dynamically or translate identified weaknesses into practical, virtue-aligned action plans based on their evolving circumstances.',
    challenge: 'Develop an intelligent web and mobile application featuring an AI-driven SWOT analysis engine. Students input their current personal profile alongside specific real-time scenarios (e.g., preparing for a major interview, managing exam stress, or resolving a team dispute). The AI dynamically generates tailored SWOT matrices and offers situational, virtue-based strategies to turn threats into opportunities and weaknesses into actionable strengths.',
    keyRequirements: [
      'Scenario-Based Dynamic SWOT Matrix Generator: Contextual input with dynamic 4-quadrant interactive dashboard.',
      'Real-Time AI Solution Engine: Situational step-by-step action plans that adapt as scenarios or deadlines change.',
      'Spiritual & Character-Building Integration: Virtue-strengthening nudges and meditation routines targeted at weaknesses and threats.',
      'Progress & Evolution Tracker: Historical visual logs showing how weaknesses diminish and strengths expand.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-34',
    title: 'Marg-Darshan & Smriti-Kosh – Senior Knowledge Preservation & Career Insights Portal',
    category: 'Knowledge Management & Alumni Mentorship',
    background: 'Every year when a batch graduates, years of hands-on experience, technical project insights, event organizing wisdom, and valuable lessons learned from mistakes leave the campus with them. Lower-year students often end up repeating the exact same errors in capstone projects, events, and placement drives due to a lack of institutional memory. A dedicated digital portal is needed to capture, structure, and permanently store this senior wisdom for future generations.',
    challenge: 'Develop a web and mobile platform that allows graduating 4th-year students and alumni to document their interview experiences, project blueprints, event execution post-mortems, and common pitfalls. The system serves as a searchable knowledge repository for lower-year students to access structured roadmaps, interview questions, and practical project advice.',
    keyRequirements: [
      'Senior Content Creation & Experience Logging: Placement interview logs, project/capstone blueprints, and event execution post-mortems.',
      'Categorized Knowledge Repository & Search Engine: Multi-filter discovery by company, domain, event, or year, with structured skill roadmaps.',
      'Interactive Discussion & Bookmarking: Q&A threads and personal study dashboard with bookmarks.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-35',
    title: 'Pustak-Setu – Student-to-Student Textbook & Study Material Exchange Network',
    category: 'Campus Marketplace & Resource Sharing',
    background: 'At the end of every semester, senior students are left with valuable paper resources—such as expensive core course textbooks, printed study notes, reference guides, and previous years\' question (PYQ) books—that sit unused in hostel rooms. Meanwhile, junior students entering the new semester spend significant money buying these exact materials brand new. Without a dedicated, organized campus marketplace, finding or passing down these physical study resources relies on scattered social media posts or luck.',
    challenge: 'Develop an easy-to-use web and mobile application that acts as a direct student-to-student exchange portal for academic materials. The platform allows students to list books, notes, and PYQs for sale or donation, complete with item details and seller contact information, allowing buyers to quickly connect, negotiate, and exchange materials directly on campus.',
    keyRequirements: [
      'Simple Item Listing & Seller Profile: Quick form for item type, condition, price/donation, and verified seller contact.',
      'Smart Search & Semester Filtering: Filter by department, semester, resource type, with direct WhatsApp/call connect button.',
      'In-Hand Photo & Verification: Up to 3 preview photos to verify book condition before meeting on campus.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-36',
    title: 'Vichar-Vani – Campus Reflection Board & Daily Display System',
    category: 'Campus Displays & Daily Inspiration',
    background: 'The Spiritual Research Cell (SRC) curates and shares daily inspiring thoughts, virtue reflections, and uplifting quotes across WhatsApp community groups and social media. However, students walking through campus are often distracted by digital notifications and miss these daily insights. A dedicated physical display board placed in high-traffic campus zones—such as the Thought Lab, library entrance, canteen, or academic blocks—provides a physical focal point that delivers daily positivity directly into the offline student environment.',
    challenge: 'Design and build a versatile campus display board—either as a handcrafted decorated wooden board or an ambient digital screen enclosure—that can be installed anywhere on campus. The solution must provide a clear, standardized fabrication method using simple materials (plywood, varnish, clips) or basic screen setups (tablets, kiosk browsers) so student teams can easily construct, deploy, and maintain these boards across campus without complexity.',
    keyRequirements: [],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-37',
    title: 'Mantra-Break – Browser Extension for Mindful Micro-Pauses',
    category: 'Digital Well-Being & Browser Tools',
    background: 'Students spend long, uninterrupted hours staring at laptop screens to complete assignments, research projects, and prepare for exams. This prolonged screen exposure frequently leads to eye strain, mental fatigue, and digital burnout. While elaborate meditation apps exist, students rarely leave their active study sessions to use them. A lightweight, ambient intervention is needed directly within their browsing workflow to promote regular mental resets without disrupting academic productivity.',
    challenge: 'Develop a lightweight browser extension (for Google Chrome and Microsoft Edge) that gently encourages students to take 30-second "Mindful Pauses" after fixed periods of continuous browsing. When triggered, the extension softly dims the active browser tab, plays a subtle audio chime, and displays a single virtue-based reflection cue before automatically allowing the student to resume work.',
    keyRequirements: [
      'Intelligent Screen-Time Tracker & Gentle Overlay: Customizable micro-pause timer (default: 30 seconds every 45 minutes) with ambient dimming effect over current webpage without closing tabs.',
      'Virtue Cue & Audio Chime System: Randomized single-sentence contemplation cue mapped to daily values like Peace, Patience, and Focus, with soft bell/bowl chime at start and end.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-38',
    title: 'Ahimsa-Aahar – Simple Hostel Mess Eco-Waste Board & Tracker',
    category: 'Eco-Waste & Ambient Well-Being',
    background: 'Modern campus spaces, hostel rooms, and meditation centers are usually designed for static utility rather than emotional and spiritual well-being. While smart technology often demands continuous visual attention, it rarely works in the background to foster inner peace. There is a need for an intelligent system that transforms ordinary rooms into calm, focused, and calm and uplifting environments by dynamically controlling lighting, sound, and physical illuminated wall structures.',
    challenge: 'Develop an integrated hardware and software system that can be set up in rooms, meditation halls, or large campus spaces to create calm and well-being-oriented ambience. The system should combine environmental sensors with custom-controlled lighting, soothing audio, and physical wall structures (e.g., LED-lit geometric mandalas, backlit virtue panels, or sacred geometry wall installations) that selectively turn on, dim, or alternate based on the selected spiritual mode or environmental triggers.',
    keyRequirements: [
      'Multi-Mode Atmosphere & Light-Sound Engine: 🧘 Meditation Mode (warm golden hues, flowing water, singing bowls), 🧠 Focus Mode (crisp task lighting, brown noise), 😌 Relaxation Mode (dimmed lighting with breathing-light transitions), 😊 Positive Mode (bright uplifting colors, inspirational panels), 🌙 Mindful Evening Mode (warm sunset hues supporting rest).',
      'Control Portal & Personalization (Software): Clean web dashboard to switch modes, set timers, adjust levels, with automated scheduling learning user time preferences.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-39',
    title: '"Prithvi-Kosh" — Campus Carbon Footprint Tracker & Micro-Carbon Credit System',
    category: 'Sustainability & Carbon Credits',
    background: 'Educational institutions generate significant carbon emissions through daily electricity consumption, paper usage, single-use plastics, and personal transport. While students are taught climate change theory, they lack a tangible, real-time mechanism to measure their personal or campus-wide carbon footprint. Without visible environmental feedback or positive incentives, adopting sustainable habits often feels abstract rather than actionable.',
    challenge: 'Develop a web and mobile application that calculates and visualizes individual and campus carbon footprints based on daily habits (e.g., travel mode, electricity usage, waste generation). The platform integrates a gamified "Campus Carbon Credit" system where students earn green credits for verified eco-friendly acts (such as using bicycles, participating in tree plantation drives, or using reusable water bottles), which can be redeemed for campus recognition or perks.',
    keyRequirements: [],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-40',
    title: '"Swa-Swachhta" — Decentralized Campus Solid & Organic Waste Management System',
    category: 'Clean Campus & Waste Management',
    background: 'Colleges generate substantial daily non-liquid waste—ranging from classroom paper, cardboard packaging, and canteen food scraps to discarded electronic items and lab material. Beyond liquid sewage treatment, solid waste management across campus facilities is often unsegregated, inefficient, and reactive. Bulk waste frequently ends up overflowing in common areas or sent directly to municipal landfills, missing critical opportunities for on-campus material recovery, organic composting, and responsible recycling.',
    challenge: 'Design and implement a complete, decentralized campus solid waste management system (excluding sewage treatment) that addresses the flow of dry, organic, and hazardous/e-waste across various campus zones. The solution must address real-time monitoring of waste collection points, ensure effective source segregation at high-volume areas (such as hostels, canteens, and academic blocks), and establish a sustainable workflow to process or divert solid waste away from landfills—empowering campus communities to manage their waste footprint locally and responsibly.',
    keyRequirements: [],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-41',
    title: '"Tarukosh" — Occasion-Based Tree Plantation & Green Credit Incentive Framework',
    category: 'Ecological Stewardship & Green Credits',
    background: 'Personal milestones—such as birthdays, anniversaries, family celebrations, community festivals, and corporate events—are traditionally marked by gift-giving and celebrations that often generate short-term waste and a net negative environmental footprint. While many people express a desire to contribute to green cover, individual tree planting initiatives in general society frequently suffer from low long-term participation because planting is seen as a isolated, one-off chore without ongoing personal connection or tangible recognition. Bridging personal life achievements with environmental stewardship offers a powerful way to expand green cover across cities and rural communities, yet society lacks a structured system that actively incentivizes, tracks, and rewards citizens for celebrating life events through tree planting and sustained sapling care.',
    challenge: 'Develop an occasion-based tree plantation and stewardship framework for general society that empowers individuals, families, and community groups to dedicate, plant, and nurture trees to mark personal milestones and public events. The solution must establish a verifiable mechanism to log planting efforts, monitor ongoing sapling survival, and convert these verified green acts into redeemable "green credits." These credits must integrate into a broader partner ecosystem—enabling citizens to redeem them for discounts, perks, and rewards across real-world commercial platforms, retail outlets, and civic services, thereby turning personal celebrations into sustained environmental action across society.',
    keyRequirements: [],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-42',
    title: '"Dhara-Drishti" — High-Precision Tree Geotagging & Forestation Mapping',
    category: 'Geospatial Tech & Forestation',
    background: 'Governments, non-profit organizations, and community groups plant millions of saplings every year to combat deforestation and urban heat islands. However, a significant percentage of these saplings die within the first few months due to lack of follow-up care, mismanaged maintenance schedules, and duplicate logging. Traditional plantation records rely on manual counts or vague region-level reports, making it nearly impossible to pinpoint, monitor, or verify the survival of individual trees over time. Without exact spatial accountability, environmental investments lose transparency, and care teams cannot efficiently navigate to specific trees needing water, protection, or medical intervention.',
    challenge: 'Develop a high-precision tree mapping and geotagging framework that establishes an exact digital identity and pinpoint physical location for every planted sapling across diverse urban and rural landscapes. The system must enable field volunteers, forest officers, and civic workers to uniquely tag trees with pinpoint spatial accuracy, log health updates seamlessly during maintenance visits, and provide transparent visual mapping so stewards can easily locate, track, and care for specific trees throughout their growth lifecycle.',
    keyRequirements: [],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-43',
    title: '"Anusandhan-SDG" — Campus Sustainability Compliance & SDG Alignment Platform',
    category: 'UN SDGs & Institutional Compliance',
    background: 'Higher education institutions generate vast amounts of environmental data—from energy and water consumption to waste management, green cover, and social outreach projects. While colleges actively run various green initiatives, these efforts are often recorded in disconnected departmental silos. Consequently, institutions struggle to map their daily campus activities to the United Nations Sustainable Development Goals (SDGs) and comply with national environmental accreditation frameworks. Without a unified, transparent method to track compliance and align campus initiatives with global sustainability metrics, colleges miss opportunities to showcase their ecological impact and improve institutional sustainability rankings.',
    challenge: 'Develop an integrated institutional sustainability compliance and SDG mapping platform that consolidates, verifies, and categorizes diverse campus initiatives against specific UN Sustainable Development Goals (such as SDG 6: Clean Water, SDG 7: Affordable & Clean Energy, SDG 11: Sustainable Cities, and SDG 13: Climate Action). The solution must streamline regulatory compliance reporting for institutional audits, track real-time resource utilization benchmarks across departments, and provide a transparent public-facing dashboard that highlights the college\'s verified contributions toward global sustainability targets.',
    keyRequirements: [],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-44',
    title: '"Arogya-Setu & Nidan" — Intelligent Botanical Disease Predictor, Remedy Provider & Treatment Timeline Analyzer',
    category: 'AI Agri-Tech & Botanical Health',
    background: 'Plant diseases, pest infestations, and nutrient deficiencies severely threaten crop yields, campus green belts, and community forestry projects. When plants show signs of distress—such as leaf discoloration, wilting, or fungal spots—gardeners, farmers, and campus eco-volunteers often lack immediate expert knowledge to identify the exact disease. Incorrect or delayed diagnosis frequently leads to mismanaged treatments, over-use of harmful chemical pesticides, or complete loss of the plant. Furthermore, even when a remedy is identified, growers rarely have access to structured treatment schedules or timeline analyzers to monitor recovery stages and ensure proper long-term care.',
    challenge: 'Develop an intelligent botanical health analysis system that accurately predicts plant diseases from early physical symptoms, suggests eco-friendly and targeted treatment solutions, and provides a structured, time-bound recovery analyzer. The solution must allow users to input or capture visual and environmental plant symptoms, instantly receive a precise diagnostic report with verified remedies (organic, biological, or chemical), and track a personalized day-by-day treatment timeline that guides caretakers through specific care actions at critical recovery intervals.',
    keyRequirements: [],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-45',
    title: 'AI-Based Urban Noise Mapping & Quiet-Zone System',
    category: 'AI Urban Acoustics & Quiet-Zones',
    background: 'Urban noise from traffic, construction, events, and other activities can affect concentration, comfort, and quality of life, yet noise levels are rarely visible to the people experiencing them. A technology-driven system can convert scattered sound observations into an understandable environmental picture and help communities identify areas where quieter practices are needed.',
    challenge: 'Develop a web/mobile platform that uses distributed sound measurements and AI-assisted analysis to map noise levels, identify recurring high-noise zones, and provide practical recommendations for creating healthier and more peaceful surroundings.',
    keyRequirements: [
      'Real-Time Noise Monitoring & Mapping: Collect sound-level readings from supported mobile or IoT sensors. Display noise intensity on an interactive location-based map. Identify recurring high-noise areas and time periods.',
      'AI-Based Noise Pattern Analysis: Classify likely noise sources from available contextual or sensor data. Detect unusual or sustained noise patterns and generate alerts. Provide trend analysis for selected locations.',
      'Mindful Environment & Action Dashboard: Suggest practical actions for reducing unnecessary noise. Show personal and community-level progress toward quieter surroundings. Encourage awareness of silence, consideration, and respectful use of shared spaces.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-46',
    title: 'AI Wildlife Crossing & Road-Safety Alert System',
    category: 'AI Ecological Safety & Wildlife Protection',
    background: 'Roads, railways, and other infrastructure can create dangerous barriers for wildlife, particularly near forests and ecological corridors. People often receive little warning when animals are active near a crossing. Technology can help identify risk zones and provide timely information so that human movement and wildlife movement can coexist more safely.',
    challenge: 'Develop an AI-enabled system that detects or predicts wildlife movement near roads and other infrastructure and provides location-specific alerts to drivers, authorities, or conservation teams.',
    keyRequirements: [
      'Wildlife Detection & Risk-Zone Identification: Use camera feeds, motion sensors, or other supported inputs to detect animal presence. Identify frequently used wildlife crossing locations. Create a map of high-risk human-wildlife interaction zones.',
      'Real-Time Alert & Warning Engine: Generate alerts when wildlife is detected near a monitored route. Provide configurable warnings for drivers, campus/security teams, or local authorities. Maintain event logs for later analysis.',
      'Coexistence & Conservation Dashboard: Visualize wildlife movement patterns and incident trends. Suggest safer crossing or traffic-management measures. Promote responsible coexistence, care, and respect for living systems.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-47',
    title: 'Microplastic Source Detection & Reduction Platform',
    category: 'Environmental Data & Microplastic Reduction',
    background: 'Microplastics can enter the environment through everyday products, synthetic materials, packaging, and other human activities. The problem is difficult to address when people cannot see where potential sources originate or how their choices contribute to the issue. A practical digital platform can turn scattered information into understandable source-level insights and reduction actions.',
    challenge: 'Develop a data-driven platform that helps users or institutions identify potential microplastic sources in daily activities, track reduction measures, and discover lower-impact alternatives.',
    keyRequirements: [
      'Microplastic Source Identification: Create a searchable database of common products and activities associated with microplastic release. Allow users to log relevant consumption or usage patterns. Categorize potential sources by environment, activity, and material type.',
      'AI-Assisted Risk & Alternative Suggestions: Analyze logged activities to highlight higher-priority sources for reduction. Recommend practical alternatives or behavior changes. Explain the reasoning behind each recommendation in simple language.',
      'Reduction & Awareness Tracker: Track actions taken to reduce selected sources over time. Show individual or institutional progress through clear metrics. Provide short reflection prompts encouraging conscious consumption and responsible choices.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-48',
    title: 'Smart Water-Body Health Monitoring System',
    category: 'IoT Aquatic Health & Water Conservation',
    background: 'Lakes, ponds, rivers, and other local water bodies can deteriorate because of pollution, changing water conditions, and unmanaged human activity. Conventional monitoring may be periodic and difficult for communities to understand. Continuous, accessible environmental information can help people recognize deterioration earlier and support timely action.',
    challenge: 'Develop an IoT and analytics platform for monitoring the health of local water bodies using measurable water-quality and environmental parameters, with simple alerts and trend visualization for communities and authorities.',
    keyRequirements: [
      'Multi-Parameter Water Monitoring: Collect supported parameters such as pH, temperature, turbidity, or dissolved-oxygen-related readings through sensors. Store time-stamped readings for each monitored water body. Provide a simple health-status view based on configured thresholds.',
      'Water Health Analytics & Alerts: Visualize historical trends and sudden changes. Generate alerts when monitored parameters move outside configured ranges. Compare locations or time periods to identify recurring issues.',
      'Community Awareness & Responsible Action: Present technical readings in an easy-to-understand public dashboard. Allow authorized users to record observations or suspected pollution events. Provide practical conservation guidance that promotes respect and responsible use of water resources.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  },
  {
    code: 'TSH-PS-49',
    title: 'E-Waste Lifecycle & Responsible Disposal Network',
    category: 'Circular Economy & E-Waste Lifecycle',
    background: 'Electronic devices are replaced frequently, while unused phones, laptops, chargers, batteries, and other electronics can remain stored or be disposed of improperly. The environmental impact can be reduced when people can understand a device\'s lifecycle and are given convenient pathways for reuse, repair, refurbishment, and responsible recycling.',
    challenge: 'Develop a digital platform that tracks electronic items from ownership to reuse, repair, donation, refurbishment, or authorized recycling, helping users make informed decisions before disposing of devices.',
    keyRequirements: [
      'Device Lifecycle Registry: Allow users or institutions to register electronic items with basic device and condition information. Track status such as in-use, repair-needed, reusable, donated, refurbished, or recycled. Provide reminders for responsible end-of-life action.',
      'Reuse, Repair & Recycling Matching: Suggest repair, reuse, donation, refurbishment, or recycling pathways based on device condition. Match usable devices with potential recipients or institutional reuse programs where available. Maintain transaction or handover records for traceability.',
      'Responsible Consumption Dashboard: Show how many devices were repaired, reused, donated, or recycled. Estimate avoided disposal through platform-recorded actions. Encourage mindful purchasing, longer device use, reuse, and responsible stewardship of technology.'
    ],
    totalSeats: 5,
    seatsAvailable: 5
  }
];

const seedFileContent = `import { ProblemStatement } from '../models/ProblemStatement.js';
import { User } from '../models/User.js';
import { Team } from '../models/Team.js';

export const allProblemStatementsData = ${JSON.stringify(psData, null, 2)};

export const seedDatabase = async (forceReseed = false) => {
  try {
    // 1. Clean previous user registrations and teams (reset state)
    await Team.deleteMany({});
    console.log('🧹 Cleaned all registered teams.');

    // Remove all non-admin users to clear logged in/test user data
    await User.deleteMany({ role: { $ne: 'admin' } });
    console.log('🧹 Cleaned all non-admin participant accounts.');

    // 2. Ensure admin exists
    const adminExists = await User.findOne({ email: 'admin@tsh.edu' });
    if (!adminExists) {
      await User.create({
        name: 'TSH Administrator',
        email: 'admin@tsh.edu',
        password: 'Admin@12345',
        phone: '+91 9876543210',
        college: 'TSH Organizing University',
        role: 'admin',
      });
      console.log('👑 Default admin account seeded: admin@tsh.edu / Admin@12345');
    }

    // 3. Seed sample participant account for quick fill
    const sampleLeader = await User.create({
      name: 'Sample Team Leader',
      email: 'leader@college.edu',
      password: 'Password@123',
      phone: '+91 9876543211',
      college: 'National Institute of Technology',
      role: 'user',
    });
    console.log('👤 Sample participant account seeded: leader@college.edu / Password@123');

    // 4. Wipe out old Problem Statements and Seed the complete 50 official Problem Statements with 5 seats each
    console.log(\`🌱 Updating Problem Statements repository (\${allProblemStatementsData.length} total)...\`);
    await ProblemStatement.deleteMany({});
    await ProblemStatement.insertMany(allProblemStatementsData);
    console.log(\`✅ All \${allProblemStatementsData.length} official Problem Statements inserted with 5 seats each!\`);
  } catch (error) {
    console.error('Seeding error:', error);
  }
};
`;

const targetPath = path.resolve('backend/src/config/seed.js');
fs.writeFileSync(targetPath, seedFileContent, 'utf-8');
console.log('Written successfully to', targetPath);
