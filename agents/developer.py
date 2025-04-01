from crewai import Agent, Task, Crew, LLM
from dotenv import load_dotenv


# Load environment variables
load_dotenv()

# Initialize Gemini-2.0-flash LLM
llm = LLM(model="gemini/gemini-2.0-flash")

# Create Developer Agent
developer_agent = Agent(
    role="A.U.R.A. Senior Full-Stack Developer",
    goal="Deliver high-quality, maintainable code with proper documentation",
    backstory=("Expert in full-stack development with 10+ years experience, "
              "specializing in clean architecture and best practices"),
    verbose=True,
    llm=llm
)

# Define Tasks
code_generation_task = Task(
    description=("Implement {feature} based on provided technical specifications. "
                "Generate code in {language} with unit tests."),
    agent=developer_agent,
    expected_output="Production-ready code with test cases"
)

code_review_task = Task(
    description=("Analyze {code} for bugs, standards compliance, "
                "and performance optimizations"),
    agent=developer_agent,
    expected_output="Detailed code review report with improvement suggestions"
)

integration_task = Task(
    description=("Integrate {components} ensuring proper API implementation "
                "and conflict resolution"),
    agent=developer_agent,
    expected_output="Integrated system with working API endpoints"
)

documentation_task = Task(
    description=("Create comprehensive documentation for {codebase} "
                "including deployment procedures"),
    agent=developer_agent,
    expected_output="Technical documentation with code comments and guides"
)

# Create Crew
dev_crew = Crew(
    agents=[developer_agent],
    tasks=[code_generation_task, code_review_task, 
           integration_task, documentation_task],
    verbose=True
)

# Execute workflow
# print("Enter details for the development workflow:")
# feature = input("Feature to implement: ")
# language = input("Programming language: ")
# components = input("Components to integrate (comma separated): ").split(',')
# codebase = input("Codebase name: ")
# code = input("Code to review: ")

# result = dev_crew.kickoff(inputs={
#     'feature': feature,
#     'language': language,
#     'components': components,
#     'codebase': codebase,
#     'code': code
# })

result = dev_crew.kickoff(inputs={
    'feature': 'user authentication system',
    'language': 'Python',
    'components': ['auth_service', 'user_db', 'api_gateway'],
    'codebase': 'authentication microservice',
    'code' : 'auth_micro'
})

print("## Development Results")
print(result)

