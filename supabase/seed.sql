INSERT INTO exams (name, slug, category, description, total_topics, sections, is_active)
VALUES (
  'IBPS PO',
  'ibps-po',
  'Banking',
  'IBPS PO (Probationary Officer) is one of India''s most popular banking exams conducted by the Institute of Banking Personnel Selection. The exam has Prelims and Mains stages.',
  65,
  '[
    {
      "name": "Quantitative Aptitude",
      "weightage": 35,
      "topics": [
        {"name": "Number System", "hours": 4, "subtopics": [{"name": "Number System Basics", "hours": 1}, {"name": "Advanced Number System", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 1},
        {"name": "Simplification & Approximation", "hours": 4, "subtopics": [{"name": "Simplification & Approximation Basics", "hours": 1}, {"name": "Advanced Simplification & Approximation", "hours": 2}],  "difficulty": "easy", "tier": "prelims", "prerequisites": [], "order": 2},
        {"name": "Percentage", "hours": 5, "subtopics": [{"name": "Percentage Basics", "hours": 1}, {"name": "Advanced Percentage", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Number System"], "order": 3},
        {"name": "Ratio & Proportion", "hours": 4, "subtopics": [{"name": "Ratio & Proportion Basics", "hours": 1}, {"name": "Advanced Ratio & Proportion", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Percentage"], "order": 4},
        {"name": "Average", "hours": 3, "subtopics": [{"name": "Average Basics", "hours": 1}, {"name": "Advanced Average", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 5},
        {"name": "Profit & Loss", "hours": 5, "subtopics": [{"name": "Profit & Loss Basics", "hours": 1}, {"name": "Advanced Profit & Loss", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Percentage"], "order": 6},
        {"name": "Simple & Compound Interest", "hours": 5, "subtopics": [{"name": "Simple & Compound Interest Basics", "hours": 1}, {"name": "Advanced Simple & Compound Interest", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Percentage"], "order": 7},
        {"name": "Time & Work", "hours": 5, "subtopics": [{"name": "Time & Work Basics", "hours": 1}, {"name": "Advanced Time & Work", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Ratio & Proportion"], "order": 8},
        {"name": "Pipes & Cisterns", "hours": 3, "subtopics": [{"name": "Pipes & Cisterns Basics", "hours": 1}, {"name": "Advanced Pipes & Cisterns", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Time & Work"], "order": 9},
        {"name": "Time, Speed & Distance", "hours": 5, "subtopics": [{"name": "Time, Speed & Distance Basics", "hours": 1}, {"name": "Advanced Time, Speed & Distance", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 10},
        {"name": "Boat & Stream", "hours": 3, "subtopics": [{"name": "Boat & Stream Basics", "hours": 1}, {"name": "Advanced Boat & Stream", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Time, Speed & Distance"], "order": 11},
        {"name": "Partnership", "hours": 3, "subtopics": [{"name": "Partnership Basics", "hours": 1}, {"name": "Advanced Partnership", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Ratio & Proportion"], "order": 12},
        {"name": "Mixture & Alligation", "hours": 4, "subtopics": [{"name": "Mixture & Alligation Basics", "hours": 1}, {"name": "Advanced Mixture & Alligation", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": ["Ratio & Proportion", "Average"], "order": 13},
        {"name": "Probability", "hours": 4, "subtopics": [{"name": "Probability Basics", "hours": 1}, {"name": "Advanced Probability", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": ["Percentage"], "order": 14},
        {"name": "Permutation & Combination", "hours": 4, "subtopics": [{"name": "Permutation & Combination Basics", "hours": 1}, {"name": "Advanced Permutation & Combination", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": [], "order": 15},
        {"name": "Number Series", "hours": 6, "subtopics": [{"name": "Number Series Basics", "hours": 1}, {"name": "Advanced Number Series", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": [], "order": 16},
        {"name": "Quadratic Equations", "hours": 3, "subtopics": [{"name": "Quadratic Equations Basics", "hours": 1}, {"name": "Advanced Quadratic Equations", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 17},
        {"name": "Data Interpretation (Prelims Level)", "hours": 10, "subtopics": [{"name": "Data Interpretation (Prelims Level) Basics", "hours": 1}, {"name": "Advanced Data Interpretation (Prelims Level)", "hours": 2}],  "difficulty": "medium", "tier": "prelims", "prerequisites": ["Percentage", "Ratio & Proportion"], "order": 18},
        {"name": "Data Analysis & Interpretation (Mains)", "hours": 20, "subtopics": [{"name": "Data Analysis & Interpretation (Mains) Basics", "hours": 1}, {"name": "Advanced Data Analysis & Interpretation (Mains)", "hours": 2}],  "difficulty": "hard", "tier": "mains", "prerequisites": ["Percentage", "Ratio & Proportion", "Data Interpretation (Prelims Level)"], "order": 19},
        {"name": "Data Sufficiency", "hours": 6, "subtopics": [{"name": "Data Sufficiency Basics", "hours": 1}, {"name": "Advanced Data Sufficiency", "hours": 2}],  "difficulty": "hard", "tier": "mains", "prerequisites": ["Data Interpretation (Prelims Level)"], "order": 20}
      ]
    },
    {
      "name": "Reasoning Ability",
      "weightage": 35,
      "topics": [
        {"name": "Coding-Decoding", "hours": 3, "subtopics": [{"name": "Coding-Decoding Basics", "hours": 1}, {"name": "Advanced Coding-Decoding", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 1},
        {"name": "Direction Sense", "hours": 2, "subtopics": [{"name": "Direction Sense Basics", "hours": 1}, {"name": "Advanced Direction Sense", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 2},
        {"name": "Ordering & Ranking", "hours": 2, "subtopics": [{"name": "Ordering & Ranking Basics", "hours": 1}, {"name": "Advanced Ordering & Ranking", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 3},
        {"name": "Blood Relations", "hours": 3, "subtopics": [{"name": "Blood Relations Basics", "hours": 1}, {"name": "Advanced Blood Relations", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 4},
        {"name": "Syllogism", "hours": 5, "subtopics": [{"name": "Syllogism Basics", "hours": 1}, {"name": "Advanced Syllogism", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 5},
        {"name": "Inequalities", "hours": 4, "subtopics": [{"name": "Inequalities Basics", "hours": 1}, {"name": "Advanced Inequalities", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 6},
        {"name": "Alphanumeric Series", "hours": 3, "subtopics": [{"name": "Alphanumeric Series Basics", "hours": 1}, {"name": "Advanced Alphanumeric Series", "hours": 2}],  "difficulty": "medium", "tier": "prelims", "prerequisites": [], "order": 7},
        {"name": "Input-Output", "hours": 6, "subtopics": [{"name": "Input-Output Basics", "hours": 1}, {"name": "Advanced Input-Output", "hours": 2}],  "difficulty": "medium", "tier": "mains", "prerequisites": [], "order": 8},
        {"name": "Linear Seating Arrangement", "hours": 7, "subtopics": [{"name": "Linear Seating Arrangement Basics", "hours": 1}, {"name": "Advanced Linear Seating Arrangement", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": [], "order": 9},
        {"name": "Circular Seating Arrangement", "hours": 7, "subtopics": [{"name": "Circular Seating Arrangement Basics", "hours": 1}, {"name": "Advanced Circular Seating Arrangement", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": ["Linear Seating Arrangement"], "order": 10},
        {"name": "Floor-Based Puzzles", "hours": 8, "subtopics": [{"name": "Floor-Based Puzzles Basics", "hours": 1}, {"name": "Advanced Floor-Based Puzzles", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": [], "order": 11},
        {"name": "Box-Based Puzzles", "hours": 6, "subtopics": [{"name": "Box-Based Puzzles Basics", "hours": 1}, {"name": "Advanced Box-Based Puzzles", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": [], "order": 12},
        {"name": "Scheduling & Comparison Puzzles", "hours": 6, "subtopics": [{"name": "Scheduling & Comparison Puzzles Basics", "hours": 1}, {"name": "Advanced Scheduling & Comparison Puzzles", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": [], "order": 13},
        {"name": "Logical Reasoning (Mains)", "hours": 8, "subtopics": [{"name": "Logical Reasoning (Mains) Basics", "hours": 1}, {"name": "Advanced Logical Reasoning (Mains)", "hours": 2}],  "difficulty": "hard", "tier": "mains", "prerequisites": [], "order": 14},
        {"name": "Data Sufficiency (Reasoning)", "hours": 5, "subtopics": [{"name": "Data Sufficiency (Reasoning) Basics", "hours": 1}, {"name": "Advanced Data Sufficiency (Reasoning)", "hours": 2}],  "difficulty": "hard", "tier": "mains", "prerequisites": [], "order": 15},
        {"name": "Critical Reasoning (Mains)", "hours": 6, "subtopics": [{"name": "Critical Reasoning (Mains) Basics", "hours": 1}, {"name": "Advanced Critical Reasoning (Mains)", "hours": 2}],  "difficulty": "hard", "tier": "mains", "prerequisites": [], "order": 16}
      ]
    },
    {
      "name": "English Language",
      "weightage": 15,
      "topics": [
        {"name": "Vocabulary & Idioms", "hours": 8, "subtopics": [{"name": "Vocabulary & Idioms Basics", "hours": 1}, {"name": "Advanced Vocabulary & Idioms", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 1},
        {"name": "Grammar Basics", "hours": 6, "subtopics": [{"name": "Grammar Basics Basics", "hours": 1}, {"name": "Advanced Grammar Basics", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 2},
        {"name": "Fill in the Blanks", "hours": 4, "subtopics": [{"name": "Fill in the Blanks Basics", "hours": 1}, {"name": "Advanced Fill in the Blanks", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Vocabulary & Idioms"], "order": 3},
        {"name": "Error Spotting", "hours": 6, "subtopics": [{"name": "Error Spotting Basics", "hours": 1}, {"name": "Advanced Error Spotting", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Grammar Basics"], "order": 4},
        {"name": "Sentence Improvement", "hours": 5, "subtopics": [{"name": "Sentence Improvement Basics", "hours": 1}, {"name": "Advanced Sentence Improvement", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Grammar Basics"], "order": 5},
        {"name": "Cloze Test", "hours": 5, "subtopics": [{"name": "Cloze Test Basics", "hours": 1}, {"name": "Advanced Cloze Test", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Vocabulary & Idioms"], "order": 6},
        {"name": "Para Jumbles", "hours": 6, "subtopics": [{"name": "Para Jumbles Basics", "hours": 1}, {"name": "Advanced Para Jumbles", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 7},
        {"name": "Reading Comprehension (Prelims)", "hours": 10, "subtopics": [{"name": "Reading Comprehension (Prelims) Basics", "hours": 1}, {"name": "Advanced Reading Comprehension (Prelims)", "hours": 2}],  "difficulty": "medium", "tier": "prelims", "prerequisites": [], "order": 8},
        {"name": "Advanced Reading Comprehension (Mains)", "hours": 15, "subtopics": [{"name": "Advanced Reading Comprehension (Mains) Basics", "hours": 1}, {"name": "Advanced Advanced Reading Comprehension (Mains)", "hours": 2}],  "difficulty": "hard", "tier": "mains", "prerequisites": ["Reading Comprehension (Prelims)"], "order": 9},
        {"name": "Sentence Connectors", "hours": 4, "subtopics": [{"name": "Sentence Connectors Basics", "hours": 1}, {"name": "Advanced Sentence Connectors", "hours": 2}],  "difficulty": "hard", "tier": "mains", "prerequisites": [], "order": 10},
        {"name": "Descriptive English (Letter/Essay)", "hours": 10, "subtopics": [{"name": "Descriptive English (Letter/Essay) Basics", "hours": 1}, {"name": "Advanced Descriptive English (Letter/Essay)", "hours": 2}],  "difficulty": "medium", "tier": "mains", "prerequisites": ["Grammar Basics", "Vocabulary & Idioms"], "order": 11}
      ]
    },
    {
      "name": "General Awareness",
      "weightage": 15,
      "topics": [
        {"name": "Static GK (India)", "hours": 6, "subtopics": [{"name": "Static GK (India) Basics", "hours": 1}, {"name": "Advanced Static GK (India)", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 1},
        {"name": "Banking Awareness", "hours": 12, "subtopics": [{"name": "Banking Awareness Basics", "hours": 1}, {"name": "Advanced Banking Awareness", "hours": 2}],  "difficulty": "medium", "tier": "mains", "prerequisites": [], "order": 2},
        {"name": "Financial Awareness", "hours": 8, "subtopics": [{"name": "Financial Awareness Basics", "hours": 1}, {"name": "Advanced Financial Awareness", "hours": 2}],  "difficulty": "medium", "tier": "mains", "prerequisites": [], "order": 3},
        {"name": "Economy Basics", "hours": 6, "subtopics": [{"name": "Economy Basics Basics", "hours": 1}, {"name": "Advanced Economy Basics", "hours": 2}],  "difficulty": "medium", "tier": "mains", "prerequisites": [], "order": 4},
        {"name": "Government Schemes", "hours": 8, "subtopics": [{"name": "Government Schemes Basics", "hours": 1}, {"name": "Advanced Government Schemes", "hours": 2}],  "difficulty": "medium", "tier": "mains", "prerequisites": [], "order": 5},
        {"name": "Current Affairs (Monthly)", "hours": 40, "subtopics": [{"name": "Current Affairs (Monthly) Basics", "hours": 1}, {"name": "Advanced Current Affairs (Monthly)", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 6, "recurring": true}
      ]
    },
    {
      "name": "Computer Aptitude",
      "weightage": 10,
      "topics": [
        {"name": "Computer Hardware & Software", "hours": 3, "subtopics": [{"name": "Computer Hardware & Software Basics", "hours": 1}, {"name": "Advanced Computer Hardware & Software", "hours": 2}],  "difficulty": "easy", "tier": "mains", "prerequisites": [], "order": 1},
        {"name": "Operating System Basics", "hours": 3, "subtopics": [{"name": "Operating System Basics Basics", "hours": 1}, {"name": "Advanced Operating System Basics", "hours": 2}],  "difficulty": "easy", "tier": "mains", "prerequisites": [], "order": 2},
        {"name": "MS Office Suite", "hours": 5, "subtopics": [{"name": "MS Office Suite Basics", "hours": 1}, {"name": "Advanced MS Office Suite", "hours": 2}],  "difficulty": "medium", "tier": "mains", "prerequisites": [], "order": 3},
        {"name": "Internet & Networking", "hours": 4, "subtopics": [{"name": "Internet & Networking Basics", "hours": 1}, {"name": "Advanced Internet & Networking", "hours": 2}],  "difficulty": "medium", "tier": "mains", "prerequisites": [], "order": 4},
        {"name": "Cyber Security Basics", "hours": 2, "subtopics": [{"name": "Cyber Security Basics Basics", "hours": 1}, {"name": "Advanced Cyber Security Basics", "hours": 2}],  "difficulty": "easy", "tier": "mains", "prerequisites": [], "order": 5}
      ]
    }
  ]'::jsonb,
  true
);

INSERT INTO exams (name, slug, category, description, total_topics, sections, is_active)
VALUES (
  'SSC CGL',
  'ssc-cgl',
  'SSC',
  'Staff Selection Commission - Combined Graduate Level Examination, often referred to as SSC CGL is an examination conducted to recruit staff to various posts in ministries, departments and organisations of the Government of India.',
  65,
  '[
    {
      "name": "Quantitative Aptitude",
      "weightage": 25,
      "topics": [
        {"name": "Whole Numbers", "hours": 3, "subtopics": [{"name": "Whole Numbers Basics", "hours": 1}, {"name": "Advanced Whole Numbers", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 1},
        {"name": "Decimals and Fractions", "hours": 3, "subtopics": [{"name": "Decimals and Fractions Basics", "hours": 1}, {"name": "Advanced Decimals and Fractions", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 2},
        {"name": "Relationship between Numbers", "hours": 2, "subtopics": [{"name": "Relationship between Numbers Basics", "hours": 1}, {"name": "Advanced Relationship between Numbers", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": ["Whole Numbers"], "order": 3},
        {"name": "Percentages", "hours": 5, "subtopics": [{"name": "Percentages Basics", "hours": 1}, {"name": "Advanced Percentages", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 4},
        {"name": "Ratio & Proportion", "hours": 4, "subtopics": [{"name": "Ratio & Proportion Basics", "hours": 1}, {"name": "Advanced Ratio & Proportion", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Percentages"], "order": 5},
        {"name": "Square Roots", "hours": 3, "subtopics": [{"name": "Square Roots Basics", "hours": 1}, {"name": "Advanced Square Roots", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 6},
        {"name": "Averages", "hours": 3, "subtopics": [{"name": "Averages Basics", "hours": 1}, {"name": "Advanced Averages", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 7},
        {"name": "Interest", "hours": 4, "subtopics": [{"name": "Interest Basics", "hours": 1}, {"name": "Advanced Interest", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Percentages"], "order": 8},
        {"name": "Profit and Loss", "hours": 5, "subtopics": [{"name": "Profit and Loss Basics", "hours": 1}, {"name": "Advanced Profit and Loss", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Percentages"], "order": 9},
        {"name": "Discount", "hours": 3, "subtopics": [{"name": "Discount Basics", "hours": 1}, {"name": "Advanced Discount", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": ["Profit and Loss"], "order": 10},
        {"name": "Partnership Business", "hours": 3, "subtopics": [{"name": "Partnership Business Basics", "hours": 1}, {"name": "Advanced Partnership Business", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Ratio & Proportion"], "order": 11},
        {"name": "Mixture and Alligation", "hours": 4, "subtopics": [{"name": "Mixture and Alligation Basics", "hours": 1}, {"name": "Advanced Mixture and Alligation", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Ratio & Proportion"], "order": 12},
        {"name": "Time and Distance", "hours": 5, "subtopics": [{"name": "Time and Distance Basics", "hours": 1}, {"name": "Advanced Time and Distance", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 13},
        {"name": "Time & Work", "hours": 5, "subtopics": [{"name": "Time & Work Basics", "hours": 1}, {"name": "Advanced Time & Work", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 14},
        {"name": "Basic Algebraic Identities", "hours": 6, "subtopics": [{"name": "Basic Algebraic Identities Basics", "hours": 1}, {"name": "Advanced Basic Algebraic Identities", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 15},
        {"name": "Trigonometry (Heights and Distances)", "hours": 5, "subtopics": [{"name": "Trigonometry (Heights and Distances) Basics", "hours": 1}, {"name": "Advanced Trigonometry (Heights and Distances)", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": [], "order": 16},
        {"name": "Geometry (Lines & Angles, Triangles, Circles)", "hours": 10, "subtopics": [{"name": "Geometry (Lines & Angles, Triangles, Circles) Basics", "hours": 1}, {"name": "Advanced Geometry (Lines & Angles, Triangles, Circles)", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": [], "order": 17},
        {"name": "Mensuration (Cubes, Spheres, Cylinders)", "hours": 8, "subtopics": [{"name": "Mensuration (Cubes, Spheres, Cylinders) Basics", "hours": 1}, {"name": "Advanced Mensuration (Cubes, Spheres, Cylinders)", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": ["Geometry (Lines & Angles, Triangles, Circles)"], "order": 18},
        {"name": "Statistical Charts / DI", "hours": 6, "subtopics": [{"name": "Statistical Charts / DI Basics", "hours": 1}, {"name": "Advanced Statistical Charts / DI", "hours": 2}],  "difficulty": "medium", "tier": "prelims", "prerequisites": ["Percentages", "Averages"], "order": 19},
        {"name": "Statistics & Probability (Mains Focus)", "hours": 8, "subtopics": [{"name": "Statistics & Probability (Mains Focus) Basics", "hours": 1}, {"name": "Advanced Statistics & Probability (Mains Focus)", "hours": 2}],  "difficulty": "hard", "tier": "mains", "prerequisites": [], "order": 20}
      ]
    },
    {
      "name": "General Intelligence & Reasoning",
      "weightage": 25,
      "topics": [
        {"name": "Analogies (Semantic, Symbolic, Number)", "hours": 4, "subtopics": [{"name": "Analogies (Semantic, Symbolic, Number) Basics", "hours": 1}, {"name": "Advanced Analogies (Semantic, Symbolic, Number)", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 1},
        {"name": "Similarities & Differences", "hours": 3, "subtopics": [{"name": "Similarities & Differences Basics", "hours": 1}, {"name": "Advanced Similarities & Differences", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 2},
        {"name": "Space Visualization", "hours": 3, "subtopics": [{"name": "Space Visualization Basics", "hours": 1}, {"name": "Advanced Space Visualization", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 3},
        {"name": "Spatial Orientation", "hours": 3, "subtopics": [{"name": "Spatial Orientation Basics", "hours": 1}, {"name": "Advanced Spatial Orientation", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 4},
        {"name": "Problem Solving & Analysis", "hours": 5, "subtopics": [{"name": "Problem Solving & Analysis Basics", "hours": 1}, {"name": "Advanced Problem Solving & Analysis", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 5},
        {"name": "Judgment & Decision Making", "hours": 4, "subtopics": [{"name": "Judgment & Decision Making Basics", "hours": 1}, {"name": "Advanced Judgment & Decision Making", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 6},
        {"name": "Visual Memory & Discrimination", "hours": 3, "subtopics": [{"name": "Visual Memory & Discrimination Basics", "hours": 1}, {"name": "Advanced Visual Memory & Discrimination", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 7},
        {"name": "Observation & Relationship Concepts", "hours": 3, "subtopics": [{"name": "Observation & Relationship Concepts Basics", "hours": 1}, {"name": "Advanced Observation & Relationship Concepts", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 8},
        {"name": "Arithmetical Reasoning", "hours": 5, "subtopics": [{"name": "Arithmetical Reasoning Basics", "hours": 1}, {"name": "Advanced Arithmetical Reasoning", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 9},
        {"name": "Figural Classification", "hours": 3, "subtopics": [{"name": "Figural Classification Basics", "hours": 1}, {"name": "Advanced Figural Classification", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 10},
        {"name": "Arithmetic Number Series", "hours": 4, "subtopics": [{"name": "Arithmetic Number Series Basics", "hours": 1}, {"name": "Advanced Arithmetic Number Series", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 11},
        {"name": "Non-Verbal Series", "hours": 4, "subtopics": [{"name": "Non-Verbal Series Basics", "hours": 1}, {"name": "Advanced Non-Verbal Series", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 12},
        {"name": "Coding and Decoding", "hours": 4, "subtopics": [{"name": "Coding and Decoding Basics", "hours": 1}, {"name": "Advanced Coding and Decoding", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 13},
        {"name": "Statement conclusion", "hours": 4, "subtopics": [{"name": "Statement conclusion Basics", "hours": 1}, {"name": "Advanced Statement conclusion", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 14},
        {"name": "Syllogistic Reasoning", "hours": 5, "subtopics": [{"name": "Syllogistic Reasoning Basics", "hours": 1}, {"name": "Advanced Syllogistic Reasoning", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 15},
        {"name": "Critical Thinking & Emotional Intelligence", "hours": 5, "subtopics": [{"name": "Critical Thinking & Emotional Intelligence Basics", "hours": 1}, {"name": "Advanced Critical Thinking & Emotional Intelligence", "hours": 2}],  "difficulty": "hard", "tier": "mains", "prerequisites": [], "order": 16}
      ]
    },
    {
      "name": "English Language & Comprehension",
      "weightage": 25,
      "topics": [
        {"name": "Vocabulary (Synonyms & Antonyms)", "hours": 8, "subtopics": [{"name": "Vocabulary (Synonyms & Antonyms) Basics", "hours": 1}, {"name": "Advanced Vocabulary (Synonyms & Antonyms)", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 1},
        {"name": "Grammar (Parts of Speech)", "hours": 6, "subtopics": [{"name": "Grammar (Parts of Speech) Basics", "hours": 1}, {"name": "Advanced Grammar (Parts of Speech)", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": [], "order": 2},
        {"name": "Sentence Structure", "hours": 4, "subtopics": [{"name": "Sentence Structure Basics", "hours": 1}, {"name": "Advanced Sentence Structure", "hours": 2}],  "difficulty": "easy", "tier": "both", "prerequisites": ["Grammar (Parts of Speech)"], "order": 3},
        {"name": "Idioms & Phrases", "hours": 6, "subtopics": [{"name": "Idioms & Phrases Basics", "hours": 1}, {"name": "Advanced Idioms & Phrases", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 4},
        {"name": "One word substitution", "hours": 5, "subtopics": [{"name": "One word substitution Basics", "hours": 1}, {"name": "Advanced One word substitution", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Vocabulary (Synonyms & Antonyms)"], "order": 5},
        {"name": "Improvement of Sentences", "hours": 5, "subtopics": [{"name": "Improvement of Sentences Basics", "hours": 1}, {"name": "Advanced Improvement of Sentences", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Grammar (Parts of Speech)", "Sentence Structure"], "order": 6},
        {"name": "Active/Passive Voice", "hours": 4, "subtopics": [{"name": "Active/Passive Voice Basics", "hours": 1}, {"name": "Advanced Active/Passive Voice", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Grammar (Parts of Speech)"], "order": 7},
        {"name": "Direct/Indirect Narration", "hours": 4, "subtopics": [{"name": "Direct/Indirect Narration Basics", "hours": 1}, {"name": "Advanced Direct/Indirect Narration", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": ["Grammar (Parts of Speech)"], "order": 8},
        {"name": "Shuffling of Sentence parts", "hours": 4, "subtopics": [{"name": "Shuffling of Sentence parts Basics", "hours": 1}, {"name": "Advanced Shuffling of Sentence parts", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 9},
        {"name": "Cloze Passage", "hours": 6, "subtopics": [{"name": "Cloze Passage Basics", "hours": 1}, {"name": "Advanced Cloze Passage", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": ["Vocabulary (Synonyms & Antonyms)", "Grammar (Parts of Speech)"], "order": 10},
        {"name": "Comprehension Passage", "hours": 8, "subtopics": [{"name": "Comprehension Passage Basics", "hours": 1}, {"name": "Advanced Comprehension Passage", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": [], "order": 11}
      ]
    },
    {
      "name": "General Awareness",
      "weightage": 25,
      "topics": [
        {"name": "History & Culture", "hours": 12, "subtopics": [{"name": "History & Culture Basics", "hours": 1}, {"name": "Advanced History & Culture", "hours": 2}],  "difficulty": "hard", "tier": "both", "prerequisites": [], "order": 1},
        {"name": "Geography", "hours": 10, "subtopics": [{"name": "Geography Basics", "hours": 1}, {"name": "Advanced Geography", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 2},
        {"name": "Economic Scene", "hours": 8, "subtopics": [{"name": "Economic Scene Basics", "hours": 1}, {"name": "Advanced Economic Scene", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 3},
        {"name": "General Policy & Scientific Research", "hours": 8, "subtopics": [{"name": "General Policy & Scientific Research Basics", "hours": 1}, {"name": "Advanced General Policy & Scientific Research", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 4},
        {"name": "Current Affairs (National/International)", "hours": 20, "subtopics": [{"name": "Current Affairs (National/International) Basics", "hours": 1}, {"name": "Advanced Current Affairs (National/International)", "hours": 2}],  "difficulty": "medium", "tier": "both", "prerequisites": [], "order": 5, "recurring": true}
      ]
    },
    {
      "name": "Computer Knowledge",
      "weightage": 10,
      "topics": [
        {"name": "Computer Organization & Backup", "hours": 3, "subtopics": [{"name": "Computer Organization & Backup Basics", "hours": 1}, {"name": "Advanced Computer Organization & Backup", "hours": 2}],  "difficulty": "easy", "tier": "mains", "prerequisites": [], "order": 1},
        {"name": "Software & Operating Systems", "hours": 4, "subtopics": [{"name": "Software & Operating Systems Basics", "hours": 1}, {"name": "Advanced Software & Operating Systems", "hours": 2}],  "difficulty": "medium", "tier": "mains", "prerequisites": [], "order": 2},
        {"name": "MS Office (Word, Excel, PowerPoint)", "hours": 5, "subtopics": [{"name": "MS Office (Word, Excel, PowerPoint) Basics", "hours": 1}, {"name": "Advanced MS Office (Word, Excel, PowerPoint)", "hours": 2}],  "difficulty": "medium", "tier": "mains", "prerequisites": [], "order": 3},
        {"name": "Internet & E-mail", "hours": 3, "subtopics": [{"name": "Internet & E-mail Basics", "hours": 1}, {"name": "Advanced Internet & E-mail", "hours": 2}],  "difficulty": "easy", "tier": "mains", "prerequisites": [], "order": 4},
        {"name": "Networking & Cyber Security", "hours": 4, "subtopics": [{"name": "Networking & Cyber Security Basics", "hours": 1}, {"name": "Advanced Networking & Cyber Security", "hours": 2}],  "difficulty": "medium", "tier": "mains", "prerequisites": [], "order": 5}
      ]
    }
  ]'::jsonb,
  true
);

