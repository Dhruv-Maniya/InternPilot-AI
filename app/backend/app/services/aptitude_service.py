from agents import Runner

from app.schemas.aptitude import AptitudeQuestion
from app.agents.aptitude_agent import aptitude_agent

APTITUDE_QUESTIONS = [
    # ---------------------------------------------------------
    # Quantitative Aptitude - Beginner (Campus Standard)
    # ---------------------------------------------------------
    AptitudeQuestion(
        id=1,
        category="Quantitative Aptitude",
        difficulty="Beginner",
        question="A company offers a 20% discount on an analytics software certification listed at $100. What is the discount amount in dollars?",
        options=["10", "20", "30", "40"],
        correct_answer="20"
    ),
    AptitudeQuestion(
        id=2,
        category="Quantitative Aptitude",
        difficulty="Beginner",
        question="In a cohort of 50 engineering interns, exactly 80% successfully completed their project milestone. How many interns completed the milestone?",
        options=["30", "35", "40", "45"],
        correct_answer="40"
    ),

    # ---------------------------------------------------------
    # Quantitative Aptitude - Intermediate
    # ---------------------------------------------------------
    AptitudeQuestion(
        id=7,
        category="Quantitative Aptitude",
        difficulty="Intermediate",
        question="A data pipeline processes 1,800 records in 15 minutes. At this constant rate, how many records will it process in 45 minutes?",
        options=["3,600", "5,400", "7,200", "9,000"],
        correct_answer="5,400"
    ),
    AptitudeQuestion(
        id=8,
        category="Quantitative Aptitude",
        difficulty="Intermediate",
        question="If the ratio of frontend engineers to backend engineers in a team is 3:5 and there are 24 frontend engineers, what is the total number of engineers?",
        options=["40", "56", "64", "72"],
        correct_answer="64"
    ),
    AptitudeQuestion(
        id=9,
        category="Quantitative Aptitude",
        difficulty="Intermediate",
        question="An algorithm's execution time was reduced from 250 milliseconds to 200 milliseconds after query optimization. What was the percentage reduction in execution time?",
        options=["15%", "20%", "25%", "30%"],
        correct_answer="20%"
    ),

    # ---------------------------------------------------------
    # Quantitative Aptitude - Advanced
    # ---------------------------------------------------------
    AptitudeQuestion(
        id=10,
        category="Quantitative Aptitude",
        difficulty="Advanced",
        question="Two database server replicas, A and B, together complete a batch sync job in 12 hours. If Server A alone completes the job in 20 hours, how many hours would Server B take alone?",
        options=["24 hours", "30 hours", "32 hours", "36 hours"],
        correct_answer="30 hours"
    ),
    AptitudeQuestion(
        id=11,
        category="Quantitative Aptitude",
        difficulty="Advanced",
        question="A tech startup received an initial seed funding of $5,000 compounding annually at 10%. What is the total valuation amount after 2 years?",
        options=["$5,500", "$6,000", "$6,050", "$6,100"],
        correct_answer="$6,050"
    ),
    AptitudeQuestion(
        id=12,
        category="Quantitative Aptitude",
        difficulty="Advanced",
        question="A container holds 60 liters of a chemical mixture. If 12 liters are replaced with pure water, what is the concentration percentage of the original solution remaining?",
        options=["70%", "75%", "80%", "85%"],
        correct_answer="80%"
    ),

    # ---------------------------------------------------------
    # Logical Reasoning - Beginner (Campus Standard)
    # ---------------------------------------------------------
    AptitudeQuestion(
        id=3,
        category="Logical Reasoning",
        difficulty="Beginner",
        question="Find the next number in the arithmetic progression sequence: 2, 4, 6, 8, ?",
        options=["9", "10", "11", "12"],
        correct_answer="10"
    ),
    AptitudeQuestion(
        id=4,
        category="Logical Reasoning",
        difficulty="Beginner",
        question="Statements: All software engineers are analytical thinkers. Alex is a software engineer. What is the logically sound conclusion?",
        options=["Alex is an architect", "Alex is an analytical thinker", "Alex is a manager", "Alex is not an engineer"],
        correct_answer="Alex is an analytical thinker"
    ),
    AptitudeQuestion(
        id=13,
        category="Logical Reasoning",
        difficulty="Beginner",
        question="If CLOUD is coded as DMNVE (each letter shifted forward by 1 position in the alphabet), how is DATA coded in the same pattern?",
        options=["EBUB", "EZSZ", "EBPU", "ECVB"],
        correct_answer="EBUB"
    ),

    # ---------------------------------------------------------
    # Logical Reasoning - Intermediate
    # ---------------------------------------------------------
    AptitudeQuestion(
        id=14,
        category="Logical Reasoning",
        difficulty="Intermediate",
        question="Pointing to an engineer in a team photo, Priya says: 'His father is the only son of my grandfather.' How is the engineer related to Priya?",
        options=["Cousin", "Brother", "Uncle", "Father"],
        correct_answer="Brother"
    ),
    AptitudeQuestion(
        id=15,
        category="Logical Reasoning",
        difficulty="Intermediate",
        question="In a sprint planning seating arrangement, A sits to the immediate left of B, and C sits to the immediate right of B. Who is sitting in the center?",
        options=["A", "B", "C", "Cannot be determined"],
        correct_answer="B"
    ),
    AptitudeQuestion(
        id=16,
        category="Logical Reasoning",
        difficulty="Intermediate",
        question="Statements: Some data analysts write Python scripts. All Python script writers understand algorithms. Which conclusion logically follows?",
        options=["All data analysts understand algorithms", "Some data analysts understand algorithms", "No data analysts understand algorithms", "All algorithm writers are data analysts"],
        correct_answer="Some data analysts understand algorithms"
    ),

    # ---------------------------------------------------------
    # Logical Reasoning - Advanced
    # ---------------------------------------------------------
    AptitudeQuestion(
        id=17,
        category="Logical Reasoning",
        difficulty="Advanced",
        question="Five microservices (M1, M2, M3, M4, M5) are deployed sequentially. M3 deploys before M1 but after M2. M5 deploys before M2. Which microservice was deployed first?",
        options=["M1", "M2", "M3", "M5"],
        correct_answer="M5"
    ),
    AptitudeQuestion(
        id=18,
        category="Logical Reasoning",
        difficulty="Advanced",
        question="If 'A + B' means A is the brother of B, 'A - B' means A is the sister of B, and 'A * B' means A is the father of B, which expression proves that P is the paternal uncle of Q?",
        options=["P + R * Q", "P - R * Q", "P * R + Q", "Q + R * P"],
        correct_answer="P + R * Q"
    ),
    AptitudeQuestion(
        id=19,
        category="Logical Reasoning",
        difficulty="Advanced",
        question="In a secret telemetry code, '134' means 'good clean data', '478' means 'see good visual', and '729' means 'visual is clear'. Which digit stands for 'see'?",
        options=["4", "7", "8", "9"],
        correct_answer="8"
    ),

    # ---------------------------------------------------------
    # Verbal Ability - Beginner (Campus Standard)
    # ---------------------------------------------------------
    AptitudeQuestion(
        id=5,
        category="Verbal Ability",
        difficulty="Beginner",
        question="Select the most accurate synonym for the professional adjective 'Diligent':",
        options=["Careless", "Industrious", "Hesitant", "Superficial"],
        correct_answer="Industrious"
    ),
    AptitudeQuestion(
        id=20,
        category="Verbal Ability",
        difficulty="Beginner",
        question="Choose the correct preposition to complete the sentence: 'The engineering squad is committed ___ delivering the production release on schedule.'",
        options=["to", "for", "with", "at"],
        correct_answer="to"
    ),
    AptitudeQuestion(
        id=21,
        category="Verbal Ability",
        difficulty="Beginner",
        question="Identify the antonym of the word 'Transparent' in system design context:",
        options=["Clear", "Lucid", "Opaque", "Vivid"],
        correct_answer="Opaque"
    ),

    # ---------------------------------------------------------
    # Verbal Ability - Intermediate
    # ---------------------------------------------------------
    AptitudeQuestion(
        id=22,
        category="Verbal Ability",
        difficulty="Intermediate",
        question="Choose the correctly spelled architectural term:",
        options=["Asynchronous", "Asynchrounous", "Asyncronous", "Asynchronus"],
        correct_answer="Asynchronous"
    ),
    AptitudeQuestion(
        id=23,
        category="Verbal Ability",
        difficulty="Intermediate",
        question="Identify the grammatical error: 'Neither the lead architect nor the backend engineers was available during the server outage.'",
        options=["Neither", "nor the backend engineers", "was available", "during the server outage"],
        correct_answer="was available"
    ),
    AptitudeQuestion(
        id=24,
        category="Verbal Ability",
        difficulty="Intermediate",
        question="In software engineering discussions, what is the meaning of the idiomatic phrase 'to cut corners'?",
        options=["To take shortcuts or do something poorly to save time", "To write modular code", "To change system specifications", "To refactor legacy methods"],
        correct_answer="To take shortcuts or do something poorly to save time"
    ),

    # ---------------------------------------------------------
    # Verbal Ability - Advanced
    # ---------------------------------------------------------
    AptitudeQuestion(
        id=25,
        category="Verbal Ability",
        difficulty="Advanced",
        question="Identify the correct analogy: ALGORITHM : SOFTWARE :: BLUEPRINT : ?",
        options=["FOUNDATION", "BUILDING", "BRICK", "ARCHITECT"],
        correct_answer="BUILDING"
    ),
    AptitudeQuestion(
        id=26,
        category="Verbal Ability",
        difficulty="Advanced",
        question="Select the phrase that best captures the meaning of: 'A pragmatic engineer balances technical debt against business deadlines.'",
        options=["An idealistic and rigid approach", "A practical and realistic approach", "A theoretical and slow approach", "A careless and rushed approach"],
        correct_answer="A practical and realistic approach"
    ),
    AptitudeQuestion(
        id=27,
        category="Verbal Ability",
        difficulty="Advanced",
        question="Rearrange the sentence fragments into a coherent statement: (P) in microservices architecture, (Q) enables independent deployment, (R) decoupling data stores, (S) and improves system resilience.",
        options=["R-P-Q-S", "P-R-Q-S", "Q-S-P-R", "S-R-Q-P"],
        correct_answer="R-P-Q-S"
    ),

    # ---------------------------------------------------------
    # Data Interpretation - Beginner (Campus Standard)
    # ---------------------------------------------------------
    AptitudeQuestion(
        id=6,
        category="Data Interpretation",
        difficulty="Beginner",
        question="An incident dashboard logged the following ticket counts: Monday: 10, Tuesday: 20, Wednesday: 15. What is the average number of incidents per day?",
        options=["12", "15", "18", "20"],
        correct_answer="15"
    ),
    AptitudeQuestion(
        id=28,
        category="Data Interpretation",
        difficulty="Beginner",
        question="A chart displays quarterly intern intake: Q1: 40, Q2: 60, Q3: 50, Q4: 50. What percentage of the annual intern intake joined in Q2?",
        options=["25%", "30%", "35%", "40%"],
        correct_answer="30%"
    ),
    AptitudeQuestion(
        id=29,
        category="Data Interpretation",
        difficulty="Beginner",
        question="Telemetry reports show that 150 out of 500 total API requests experienced latency greater than 200ms. What percentage of requests experienced high latency?",
        options=["20%", "25%", "30%", "35%"],
        correct_answer="30%"
    ),

    # ---------------------------------------------------------
    # Data Interpretation - Intermediate
    # ---------------------------------------------------------
    AptitudeQuestion(
        id=30,
        category="Data Interpretation",
        difficulty="Intermediate",
        question="A pie chart allocates cloud infrastructure spend: Compute 40%, Storage 25%, Network 20%, Monitoring 15%. If total monthly budget is $80,000, what is allocated to Storage?",
        options=["$16,000", "$18,000", "$20,000", "$24,000"],
        correct_answer="$20,000"
    ),
    AptitudeQuestion(
        id=31,
        category="Data Interpretation",
        difficulty="Intermediate",
        question="In a quarterly SaaS report, recurring revenue grew from $400,000 in Q1 to $500,000 in Q2. What was the percentage increase in recurring revenue?",
        options=["20%", "25%", "30%", "33%"],
        correct_answer="25%"
    ),
    AptitudeQuestion(
        id=32,
        category="Data Interpretation",
        difficulty="Intermediate",
        question="Team A resolved 120 out of 150 assigned defects (80%), while Team B resolved 140 out of 200 defects (70%). What is the difference in resolution percentage between the two teams?",
        options=["8%", "10%", "12%", "15%"],
        correct_answer="10%"
    ),

    # ---------------------------------------------------------
    # Data Interpretation - Advanced
    # ---------------------------------------------------------
    AptitudeQuestion(
        id=33,
        category="Data Interpretation",
        difficulty="Advanced",
        question="A telemetry graph shows monthly active API users: Month 1: 100k, Month 2: 120k, Month 3: 150k. What is the compound monthly growth rate (CMGR) from Month 1 to Month 3 (rounded)?",
        options=["20.5%", "22.5%", "25.0%", "28.0%"],
        correct_answer="22.5%"
    ),
    AptitudeQuestion(
        id=34,
        category="Data Interpretation",
        difficulty="Advanced",
        question="An e-commerce analytics funnel reports that out of 50,000 site visits, 2,500 users add items to cart, and 1,000 users complete the checkout. What is the conversion rate from cart addition to completed purchase?",
        options=["2%", "20%", "35%", "40%"],
        correct_answer="40%"
    ),
    AptitudeQuestion(
        id=35,
        category="Data Interpretation",
        difficulty="Advanced",
        question="Cloud infrastructure benchmarks: Cluster X costs $2,000/month at 10,000 RPS. Cluster Y costs $3,000/month at 18,000 RPS. Which cluster provides better cost efficiency per 1,000 RPS?",
        options=["Cluster X ($200 per 1k RPS)", "Cluster Y ($166.67 per 1k RPS)", "Both have equal cost efficiency", "Cannot be determined"],
        correct_answer="Cluster Y ($166.67 per 1k RPS)"
    ),
]


def get_questions(
    category: str,
    difficulty: str
) -> list[AptitudeQuestion]:
    """Return aptitude questions matching category and difficulty."""

    cat_clean = category.strip().lower()
    diff_clean = difficulty.strip().lower()

    # Exact match for category and difficulty
    matched = [
        question
        for question in APTITUDE_QUESTIONS
        if question.category.lower() == cat_clean
        and question.difficulty.lower() == diff_clean
    ]
    if matched:
        return matched

    # Fallback to category if difficulty has no exact match but category is valid
    category_matched = [
        question
        for question in APTITUDE_QUESTIONS
        if question.category.lower() == cat_clean
    ]
    return category_matched


def calculate_result(
    questions: list[AptitudeQuestion],
    answers: dict[int, str]
) -> dict:
    """Calculate aptitude test score and performance."""

    total_questions = len(questions)
    correct_answers = 0

    for question in questions:
        submitted_answer = answers.get(question.id)

        if submitted_answer is not None:
            if submitted_answer.strip().lower() == question.correct_answer.lower():
                correct_answers += 1

    incorrect_answers = total_questions - correct_answers

    if total_questions > 0:
        accuracy = round(
            (correct_answers / total_questions) * 100,
            2
        )
    else:
        accuracy = 0.0

    score = correct_answers

    if accuracy < 50:
        weak_area = questions[0].category if questions else None
    else:
        weak_area = None

    return {
        "total_questions": total_questions,
        "correct_answers": correct_answers,
        "incorrect_answers": incorrect_answers,
        "score": score,
        "accuracy": accuracy,
        "weak_area": weak_area
    }

async def analyze_aptitude_result(
    category: str,
    total_questions: int,
    correct_answers: int,
    score: int,
    accuracy: float,
    weak_area: str | None
) -> str:
    """Analyze a student's aptitude test performance using the AI agent."""

    user_message = f"""
Aptitude Test Performance:

Category:
{category}

Total Questions:
{total_questions}

Correct Answers:
{correct_answers}

Score:
{score}

Accuracy:
{accuracy}%

Weak Area:
{weak_area or "None"}

Analyze the student's aptitude performance according to your instructions.
"""

    result = await Runner.run(
        aptitude_agent,
        user_message
    )

    return result.final_output