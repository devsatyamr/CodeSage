import warnings
warnings.filterwarnings('ignore')
from crewai import Agent, Task, Crew, LLM
from dotenv import load_dotenv
import os
import json
from datetime import datetime
load_dotenv()

# Create artifacts directory if it doesn't exist
ARTIFACTS_DIR = "artifacts"
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

def save_agent_output(agent_role, output, task_type=""):
    """Save agent output to a file in the artifacts directory"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{agent_role.lower().replace(' ', '_')}_{task_type}_{timestamp}.txt"
    filepath = os.path.join(ARTIFACTS_DIR, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(f"Agent: {agent_role}\n")
        f.write(f"Task Type: {task_type}\n")
        f.write(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("-" * 50 + "\n")
        f.write(str(output))
    
    return filepath

def save_project_state(project_context, status, specifics):
    """Save current project state to a JSON file"""
    state = {
        "project_context": project_context,
        "status": status,
        "specifics": specifics,
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    filepath = os.path.join(ARTIFACTS_DIR, "project_state.json")
    with open(filepath, 'w') as f:
        json.dump(state, f, indent=2)

llm = LLM(model="gemini/gemini-2.0-flash", api_key=os.getenv("GOOGLE_API_KEY"))

business_analyst = Agent(
    llm=llm,
    role="Business Analyst",
    goal="Analyze client requirements and create documentation.",
    backstory="You're responsible for understanding client needs "
              "and transforming them into detailed project requirements. "
              "Your work ensures that the development team has a clear "
              "roadmap to follow.",
    allow_delegation=False,
    verbose=True
)

designer = Agent(
    llm=llm,
    role="Designer ",
    goal="Analyze the user stories and design the UI/UX for the need of the product.",
    backstory="You take the requirements provided by the Business Analyst "
              "generate UI design and ER diagram "
              "Your expertise ensures well designed UI"
              "generate diagrams of the ER diagram",
    allow_delegation=False,
    verbose=True
)

developer = Agent(
    llm=llm,
    role="Software Developer",
    goal="Develop software applications based on specifications.",
    backstory="You take the requirements provided by the Designer "
              "and develop a working application. Your expertise ensures "
              "efficient, scalable, and well-documented code.",
    allow_delegation=False,
    verbose=True
)

tester = Agent(
    llm=llm,
    role="Software Tester",
    goal="Test the software application and identify issues.",
    backstory="You are responsible for ensuring the software meets "
              "quality standards. You conduct functional and performance "
              "testing to identify and report bugs before deployment.",
    allow_delegation=False,
    verbose=True
)

project_manager = Agent(
    llm=llm,
    role="Project Manager",
    goal="Oversee project execution and ensure timely delivery.",
    backstory="You coordinate the efforts of all team members to ensure "
              "the project is completed on time and within scope. "
              "Your leadership helps resolve challenges and keeps the "
              "team on track.",
    allow_delegation=False,
    verbose=True
)

def create_initial_tasks(product_info):
    """Create initial tasks based on product information"""
    analyze_requirements = Task(
        description=(
            f"Analyze the following product requirements:\n{product_info}\n"
            "1. Gather and analyze client requirements.\n"
            "2. Identify key functional and non-functional requirements.\n"
            "3. Create a structured Software Requirement Specification (SRS) document.\n"
            "4. Ensure clarity and feasibility for developers and stakeholders."
        ),
        expected_output="A well-documented SRS detailing project requirements.",
        agent=business_analyst,
    )

    design_application = Task(
        description=(
            "Based on the analyzed requirements:\n"
            "1. Create wireframes and mockups for the UI.\n"
            "2. Generate ER diagrams for the database schema.\n"
            "3. Define the system architecture.\n"
            "4. Create necessary technical diagrams."
        ),
        expected_output="Complete system design with wireframes and diagrams.",
        agent=designer,
    )

    develop_application = Task(
        description=(
            "Based on the design specifications:\n"
            "1. Implement the application features.\n"
            "2. Set up the database and backend.\n"
            "3. Ensure code quality and documentation."
        ),
        expected_output="Working application implementation.",
        agent=developer,
    )

    test_application = Task(
        description=(
            "For the implemented application:\n"
            "1. Perform thorough testing.\n"
            "2. Document any issues found.\n"
            "3. Verify fixes and improvements."
        ),
        expected_output="Comprehensive test report and quality assessment.",
        agent=tester,
    )

    return [analyze_requirements, design_application, develop_application, test_application]

def create_crew():
    """Create a new crew instance without any tasks"""
    return Crew(
        agents=[business_analyst, designer, developer, tester, project_manager],
        tasks=[],
        verbose=True
    )

# Initialize crew without tasks
crew = create_crew()


