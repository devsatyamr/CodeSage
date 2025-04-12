from flask import Flask, request, jsonify
from flask_cors import CORS
from agents import (
    project_manager, crew, create_initial_tasks, Task,
    save_agent_output, save_project_state
)
import threading
import time
from queue import Queue

app = Flask(__name__)
CORS(app)

# Global variables to track state
product_info = None
initial_tasks_completed = False
project_status = None
project_specifics = None
project_context = None
response_queue = Queue()  # Queue to store agent updates

def send_agent_update(agent_name, delay=0):
    """Helper function to send agent updates with optional delay"""
    if delay:
        time.sleep(delay)
    response_queue.put(f"[Agent: {agent_name}] is analyzing your request")

@app.route('/api/agent-updates', methods=['GET'])
def get_agent_updates():
    """Endpoint to get real-time agent updates"""
    try:
        # Non-blocking get from queue with timeout
        update = response_queue.get(timeout=1)
        return jsonify({'response': update})
    except:
        return jsonify({'response': None})

@app.route('/api/chat', methods=['POST'])
def chat():
    global product_info, initial_tasks_completed, project_status, project_specifics, project_context
    
    try:
        data = request.get_json()
        message = data.get('message', '').lower()
        
        # First message - Product Information
        if product_info is None:
            product_info = message
            project_context = message

            # Simulate agent sequence with delays
            def run_initial_analysis():
                # Business Analyst starts
                send_agent_update("Business Analyst")
                time.sleep(2)  # Simulate work time
                
                # Designer starts after Business Analyst
                send_agent_update("Designer", delay=3)
                time.sleep(2)
                
                # Developer starts after Designer
                send_agent_update("Software Developer", delay=3)
                time.sleep(2)
                
                # Tester starts after Developer
                send_agent_update("Software Tester", delay=3)
                
                # Create and execute initial tasks
                initial_tasks = create_initial_tasks(product_info)
                crew.tasks = initial_tasks
                result = str(crew.kickoff())
                
                # Save outputs for each agent
                for task in initial_tasks:
                    save_agent_output(
                        task.agent.role,
                        task.expected_output,
                        "initial_analysis"
                    )
                
                global initial_tasks_completed
                initial_tasks_completed = True
                project_status = "Initial setup completed"
                save_project_state(project_context, project_status, None)
                
                # Final completion message
                response_queue.put("Thank you for providing the product information. Initial analysis is complete.")

            # Start analysis in background thread
            threading.Thread(target=run_initial_analysis).start()
            
            return jsonify({
                'response': 'Starting project analysis...',
                'status': 'processing'
            })
        
        # Subsequent messages - Handle specific queries
        if initial_tasks_completed:
            if "project status" in message:
                def run_status_check():
                    send_agent_update("Project Manager")
                    
                    status_task = Task(
                        description=(
                            f"Analyzing the current status of {project_context} project...\n"
                            "1. Current development phase\n"
                            "2. Completed milestones\n"
                            "3. Ongoing tasks\n"
                            "4. Any challenges or blockers\n"
                            "5. Timeline status"
                        ),
                        expected_output="Detailed project status report",
                        agent=project_manager
                    )
                    
                    crew.tasks = [status_task]
                    result = str(crew.kickoff())
                    
                    # Format and send final response
                    formatted_response = f"""Status: Project Overview for {project_context}

Current Progress:
{result}

Project Phases:
- Requirements Analysis: {'Completed' if 'requirements' in result.lower() else 'In Progress'}
- Design: {'Completed' if 'design' in result.lower() else 'In Progress'}
- Development: {'Completed' if 'development' in result.lower() else 'Pending'}
- Testing: {'Completed' if 'testing' in result.lower() else 'Pending'}"""
                    
                    response_queue.put(formatted_response)
                
                threading.Thread(target=run_status_check).start()
                return jsonify({
                    'response': 'Checking project status...',
                    'status': 'processing'
                })
                
            elif "project specifics" in message:
                def run_specifics_check():
                    send_agent_update("Project Manager")
                    
                    specifics_task = Task(
                        description=(
                            f"Providing detailed information about the {project_context} project...\n"
                            "1. Core features and functionalities\n"
                            "2. Technical architecture and design decisions\n"
                            "3. Database schema and data flow\n"
                            "4. User interface and experience design\n"
                            "5. Implementation progress and challenges"
                        ),
                        expected_output="Detailed project information",
                        agent=project_manager
                    )
                    
                    crew.tasks = [specifics_task]
                    result = str(crew.kickoff())
                    response_queue.put(f"Specifics: {project_context} Project Details\n{result}")
                
                threading.Thread(target=run_specifics_check).start()
                return jsonify({
                    'response': 'Gathering project specifics...',
                    'status': 'processing'
                })
            
            else:
                return jsonify({
                    'response': "I can help you with 'project status' or 'project specifics'. Please specify what you'd like to know."
                })
        else:
            return jsonify({
                'response': "Still processing the initial setup. Please wait a moment before asking about project details."
            })
            
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'response': f"An error occurred: {str(e)}. Please try again."
        }), 500

if __name__ == '__main__':
    app.run(debug=True)