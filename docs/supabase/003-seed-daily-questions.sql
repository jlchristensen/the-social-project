-- Seed daily questions for the first two weeks
-- Run this AFTER 002-community-tables.sql
-- Dates start from April 14, 2026 — adjust if needed

insert into public.daily_questions (question_text, category, active_date) values

-- Week 1
('What''s the last thing that made you laugh so hard it hurt?',
 'icebreaker', '2026-04-14'),

('What''s one friendship you wish you had invested more time in?',
 'reflection', '2026-04-15'),

('Describe a moment when a stranger made your entire day better.',
 'connection', '2026-04-16'),

('What would you tell someone who just moved to a new city and knows no one?',
 'advice', '2026-04-17'),

('Unpopular opinion: the best way to make friends as an adult is...',
 'hot-take', '2026-04-18'),

('Name one person who showed up for you this week — and what they did.',
 'gratitude', '2026-04-19'),

('If you could have dinner with anyone, living or dead, who would it be and what would you ask them?',
 'hypothetical', '2026-04-20'),

-- Week 2
('What''s something you used to be embarrassed about that you''ve learned to embrace?',
 'reflection', '2026-04-21'),

('What''s the best conversation you''ve had in the last month?',
 'connection', '2026-04-22'),

('What''s a small daily habit that has genuinely made your life better?',
 'advice', '2026-04-23'),

('Hot take: social media has made us better at staying in touch but worse at...',
 'hot-take', '2026-04-24'),

('What''s a simple pleasure that never gets old for you?',
 'icebreaker', '2026-04-25'),

('Who is someone in your life that deserves more credit than they get?',
 'gratitude', '2026-04-26'),

('If you could instantly master any skill that would help you connect with others, what would it be?',
 'hypothetical', '2026-04-27');
