from crewai import Agent, Task, Crew, LLM
from crewai_tools import FileReadTool, FileWriterTool
from dotenv import load_dotenv
import os
import time


load_dotenv()

# Initialize Gemini-1.5-pro (using a more capable model)
llm = LLM(model="gemini/gemini-2.0-flash", api_key=os.getenv("GOOGLE_API_KEY"))

# Helper function to generate wireframe images from JSON description


# Create Designer Agent with reduced tools
designer_agent = Agent(
    role="Senior System Designer",
    goal="Create visual UI/UX designs and database diagrams",
    backstory="Expert designer with experience in creating intuitive interfaces and efficient database schemas",
    tools=[
        FileWriterTool(file_path='./ui_design.png'),
        FileWriterTool(file_path='./er_diagram.png')
    ],
    allow_code_execution=False,
    verbose=True,
    llm=llm
)

# Create a manager agent
manager_agent = Agent(
    role="A.U.R.A. Product Owner",
    goal="Ensure design artifacts meet project requirements",
    backstory="Experienced product leader coordinating design efforts",
    verbose=True,
    llm=llm
)

# Define simplified tasks
uiux_task = Task(
    description=("Create a simple UI wireframe for {app_type} application with the following pages: {pages}. "
                "Generate a clear PNG wireframe showing the main user interface elements."),
    agent=designer_agent,
    expected_output="UI/UX wireframe as PNG",
    output_file="ui_design.png"
)

er_diagram_task = Task(
    description=("Design a simple ER diagram for {app_type} application with these entities: {entities}. "
                "Show relationships between entities in a clear PNG diagram."),
    agent=designer_agent,
    expected_output="ER diagram as PNG",
    output_file="er_diagram.png"
)

# Create Design Crew with only 2 tasks
design_crew = Crew(
    agents=[designer_agent],
    tasks=[uiux_task, er_diagram_task],
    verbose=True,
    process='hierarchical',
    manager_agent=manager_agent
)

# Wait 10 seconds before starting
time.sleep(10)

result = design_crew.kickoff(inputs={
    'app_type': 'e-commerce',
    'pages': ['home', 'product details', 'cart', 'checkout'],
    'entities': ['user', 'product', 'order', 'payment']
})

print("## Design Output")
print(result)


