from crewai import Agent, Task, Crew, LLM
from crewai_tools import ScrapeWebsiteTool
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize Gemini Pro
llm = LLM(model="gemini/gemini-2.0-flash", api_key=os.getenv("GOOGLE_API_KEY"))

# Create Business Analyst Agent
analyst_agent = Agent(
    role="A.U.R.A. Senior Business Analyst",
    goal="Generate insights based on industry standards and market research",
    backstory=("Expert in data-driven decision making with 8+ years experience "
              "in Fortune 500 companies, specializing in market trends and financial modeling"),
    tools=[ScrapeWebsiteTool()],  # Only keeping web scraping for market research
    allow_code_execution=False,
    verbose=True,
    llm=llm
)

manager_agent = Agent(
    role="A.U.R.A. Product Owner",
    goal="Ensure design artifacts meet project requirements",
    backstory="Experienced product leader coordinating design efforts",
    verbose=True,
    llm=llm
)

# Modify tasks to focus on user story creation
user_stories_core_task = Task(
    description=("Create user stories for core business analytics features including: "
                "1. Dashboard creation and customization "
                "2. Data visualization and reporting "
                "3. KPI tracking and alerts"),
    agent=analyst_agent,
    expected_output="User stories for core analytics features from a business perspective"
)

user_stories_integration_task = Task(
    description=("Create user stories for data integration needs including: "
                "1. Data source connections "
                "2. Data transformation workflows "
                "3. Real-time data processing"),
    agent=analyst_agent,
    expected_output="User stories for data integration requirements"
)

user_stories_ai_task = Task(
    description=("Create user stories for AI-powered analytics features including: "
                "1. Predictive analytics capabilities "
                "2. Automated insights generation "
                "3. Anomaly detection and alerts"),
    agent=analyst_agent,
    expected_output="User stories for AI-enhanced analytics features"
)

user_stories_business_task = Task(
    description=("Create user stories for business user needs including: "
                "1. Report sharing and collaboration "
                "2. Export and presentation features "
                "3. Role-based access control"),
    agent=analyst_agent,
    expected_output="User stories for business user requirements"
)

# Create Analytics Crew with new tasks
analytics_crew = Crew(
    agents=[analyst_agent],
    tasks=[
        user_stories_core_task,
        user_stories_integration_task,
        user_stories_ai_task,
        user_stories_business_task
    ],
    process='hierarchical',
    manager_llm=llm,
    verbose=True
)

# Execute Analysis
result = analytics_crew.kickoff()

print("## User Stories from Business Analysis")
print(result)

