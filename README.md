# AI-Agents-Capstone
This project provides a solution to the recurring challenge of creating a CV by introducing an agent that generates a tailored document after interviewing the user about their background. When applying for jobs, people often need to create a new CV for each application, which can be a repetitive and time consuming task. This agent simplifies that process and makes CV creation significantly easier.

The initial idea was to build an agent that tailors an existing CV to a specific job advertisement. However, it became clear that the first step should be generating a high quality CV based on the user’s background and chosen field of application. As a result, this project focuses on an agent that creates a CV from scratch after interviewing the user and allowing them to select their field—technical, creative, executive, academic, or general.

This work is part of the Concierge Agents track. Because people frequently need customised CVs for job applications, this solution has the potential to streamline their workflow and free up valuable time.
The agent was created using Antigravity. The initial prompt provided to Antigravity was: “I would like to build an agent that builds a CV Word document based on grilling the user, and based on a field of CV to choose the right format for the CV.”

Antigravity suggested building a web app, but another option was chosen instead: “An MCP server or custom Antigravity agent/skill that integrates directly into Antigravity, allowing Antigravity to do the grilling and file generation.”

Antigravity generated a SKILL.md file as part of this setup.

### Setup Instructions
Please see also a diagram of project structure: Project-Structure.PNG
This project is designed to work within Antigravity:
1.	Download and install Antigravity 2.0
2.	Create the folder: %USERPROFILE%/agy2-projects/my-first-project/
3.	Inside my-first-project, create: .agents/skills/cv-builder/
4.	Inside my-first-project, create: scripts/
5.	Download SKILL.md from this repository and place it in cv-builder/
6.	Download generate_cv.js and place it in scripts/
7.	Download package.json and place it in my-first-project/
8.	In Antigravity, create a new project and link it to my-first-project folder

Please note: During development, the model quota was reached, preventing further testing and refinement. I have not uploaded any dependencies to the repository. One known dependency is docx. You may also need to install Node.js if it is not already installed.

The solution includes a SKILL.md file for the Antigravity agent and a generate_cv.js file responsible for creating the CV document. Refer to the setup instructions above to use this agent within Antigravity.

After completing this agent, it became clear that a web app might ultimately be a more suitable implementation. However, due to reaching the model quota on Antigravity, further development was not possible at this stage.

I have used Copilot to edit my project description and to create the project structure diagram attached.
