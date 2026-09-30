import React from 'react';
import { Sparkles } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 font-sans">

      {/* Main Page Container with Round Border & Frosted Cyber-Zen Look */}
      <div className="bg-white/92 dark:bg-slate-900/85 backdrop-blur-xl rounded-[28px] sm:rounded-[36px] border border-slate-200/90 dark:border-slate-800/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] p-6 sm:p-10 md:p-14 transition-all duration-300">
        
        {/* Document Header */}
        <header className="text-center pb-8 border-b border-slate-200/80 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase text-sky-600 dark:text-sky-400 bg-sky-500/10 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Official Roadmap 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 dark:from-sky-400 dark:via-cyan-300 dark:to-amber-400 bg-clip-text text-transparent font-display tracking-tight">
            Techno Spiritual Hackathon (TSH)
          </h1>
          <h2 className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-200 mt-1 font-display">
            (Step-by-Step Plan)
          </h2>
        </header>

        {/* Document Body */}
        <div className="pt-8 space-y-8 sm:space-y-10 text-slate-800 dark:text-slate-200 font-sans">
          
          {/* Section A */}
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">
              A. What is TSH?
            </h3>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-1 sm:pl-3">
              The Techno Spiritual Hackathon (TSH) is an event where students use modern technology (like apps, AI, and websites) to solve real-world problems related to mental wellness, human values, and spiritual wellbeing.
            </p>
          </section>

          {/* Section B */}
          <section className="space-y-6 sm:space-y-8">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">
              B. Step-by-Step Process
            </h3>

            <div className="space-y-6 sm:space-y-7 pl-1 sm:pl-3">
              
              {/* Step 1 */}
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-2.5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                  1. Decide Goals and Form Student Teams:{' '}
                  <span className="font-normal text-slate-600 dark:text-slate-300">
                    Setting goals and picking student leaders.
                  </span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-4 sm:pl-6 list-disc">
                  <li>Figure out the main goal of the hackathon.</li>
                  <li>
                    <span>Pick responsible student leads for three main jobs:</span>
                    <ul className="mt-1.5 space-y-1 pl-4 sm:pl-6 list-[circle]">
                      <li>
                        <strong className="text-slate-900 dark:text-white">Problem Statement (PS) Team:</strong> Creates the challenge topics.
                      </li>
                      <li>
                        <strong className="text-slate-900 dark:text-white">Website Team:</strong> Builds and manages the website.
                      </li>
                      <li>
                        <strong className="text-slate-900 dark:text-white">Logistics Team:</strong> Handles food, seating, and venue arrangements.
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-2.5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                  2. Build Website & Set Up Registration Flow:{' '}
                  <span className="font-normal text-slate-600 dark:text-slate-300">
                    How students register online.
                  </span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-4 sm:pl-6 list-disc">
                  <li>Create a website showing available problem statements and rules.</li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Registration Steps:</strong>
                    <ol className="mt-1.5 space-y-1.5 pl-4 sm:pl-6 list-decimal">
                      <li>Team leader opens the website and selects a Problem Statement.</li>
                      <li>Leader fills in details for all team members.</li>
                      <li>After submitting, the leader is added to an official WhatsApp group.</li>
                      <li>Payment details, timing, and location are shared in the group.</li>
                      <li>Students pay, send proof, and get their registration confirmed.</li>
                    </ol>
                  </li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-2.5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                  3. Create Mentor List & Refine Problem Statements:{' '}
                  <span className="font-normal text-slate-600 dark:text-slate-300">
                    Getting expert help.
                  </span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-4 sm:pl-6 list-disc">
                  <li>Collect a list of teachers, technical experts, and spiritual guides as mentors.</li>
                  <li>Show the problem statements to mentors so they can fix any mistakes and make the challenges better.</li>
                </ul>
              </div>

              {/* Step 4 */}
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-2.5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                  4. Open Registrations & Plan Event Setup:{' '}
                  <span className="font-normal text-slate-600 dark:text-slate-300">
                    Opening the form and planning logistics.
                  </span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-4 sm:pl-6 list-disc">
                  <li>Open registration for everyone on the website.</li>
                  <li>Set the dates for the hackathon evaluations.</li>
                  <li>Arrange basic needs for participants: food, water, Wi-Fi, tables, power outlets, and hall bookings.</li>
                </ul>
              </div>

              {/* Step 5 */}
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-2.5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                  5. Create Judges List:{' '}
                  <span className="font-normal text-slate-600 dark:text-slate-300">
                    Selecting judges.
                  </span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-4 sm:pl-6 list-disc">
                  <li>Invite judges (teachers or industry experts).</li>
                  <li>Assign specific judges to specific problem statements and halls.</li>
                </ul>
              </div>

              {/* Step 6 */}
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-2.5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                  6. Day 1 — PPT Round (Approx. 8:00 AM – 8:00 PM):{' '}
                  <span className="font-normal text-slate-600 dark:text-slate-300">
                    Presentation round.
                  </span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-4 sm:pl-6 list-disc">
                  <li>Students present their ideas through PPT slides to assigned judges in their allocated rooms.</li>
                  <li>Judges score the presentations.</li>
                  <li>By the end of the day (around 8:00 PM), announce which teams qualify for the final round.</li>
                </ul>
              </div>

              {/* Step 7 */}
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-2.5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                  7. Day 2 — Prototype Round & Winners (Approx. 8:00 AM – 8:00 PM):{' '}
                  <span className="font-normal text-slate-600 dark:text-slate-300">
                    Live demo and prizes.
                  </span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-4 sm:pl-6 list-disc">
                  <li>Shortlisted teams build and show their working prototypes (working apps/models) to the judges.</li>
                  <li>Judges test the working models.</li>
                  <li>Declare the final results (around 5:00 PM) and give out prizes, trophies, and certificates.</li>
                </ul>
              </div>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AboutPage;
