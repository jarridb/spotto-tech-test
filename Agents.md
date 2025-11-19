# AI Workflow: Cloud Resource Tagging System

## AI Workflow Documentation

### 1. Architechure descisions

**Prompt:** 'Review the readme archicture, add versions, look for any gaps, adjument formatting and add reasons why'
**Tool:** Claude
**Result:** updated Readme.md
**Time Saved:** ~1 hour

### 2. Defining what we are building

**Prompt:** 'Review the my sketches wiresframes and describe based on how I have started document the `#What we are building` in the attached Spec.md, describe the rest of the features. We are using shadcn components'
**Tool:** Claude
**Result:** updated Readme.md
**Time Saved:** ~1 hour

### 2. Datamodel

**Prompt:** 'Based on the seed data and the description of the application in spec.md, define the datamodels, the list should make use of the seeddata, but the dashboard will need data models for the dashboard cards'
**Tool:** Cursor
**Result:** Updated Spec.md
**Time Saved:** ~1 hour

### 3. Endpoints

**Prompt:** 'Based on the seed data and the description of the application in spec.md, defined the api endpoints'
**Tool:** Cursor
**Result:** Updated Spec.md
**Time Saved:** ~1 hour


### 4. Refine spec.md

**Prompt:** 'Review the spec.md and refine it and flesh out the details'
**Tool:** Cursor
**Result:** Updated spec.md
**Time Saved:** ~1 hour

### 5. Spec the Setup

**Prompt:** '/speckit.specify use the @SPEC.md and hte @README.md setup the repo with step 1, each sub task in the list group of tasks. the backend / front split are part will be seperate commits.
**Tool:** Cursor
**Result:** Updated spec/
**Time Saved:** ~1 hour

### 5. Spec the Resources

**Prompt:** '/speckit.specify use the @SPEC.md and hte @README.md to build the resouces list see step 2, each sub task in the list group of tasks. the backend / front split are part will be seperate commits.
**Tool:** Cursor
**Result:** Updated spec/
**Time Saved:** ~1 hour

### 6. Spec the dashbaord

**Prompt:** '/speckit.implement @001-resources-list phase as a commit which I can review before going to the next phase. Prompt me to continue or request prompts to change
**Tool:** Cursor
**Result:** Updated Spec.md
**Time Saved:** ~1 hour

### 7. Build the basic setup for application

**Prompt:** '/speckit.implement 001-setup-repo-basics. Setup required files, config and a basic hello world for the application. Prompt me to continue or request prompts to change'
**Tool:** Cursor
**Result:** Updated Spec.md
**Time Saved:** ~4 hour

### 8. Add Cors

**Prompt:** 'Add middleware for the backend to use for cors so the frontend can access it correctly. Create environment variable th for the the port, host and url the the frontend and backend run on. we should have 1 env file for backend and frontend in the root that both workspaces share, The env variables should be used in the dev server and the corMiddleware for the backend. propose the best way to handle this in in both backend and frontend adn reduce the number of env variabels if possible. add instructions to the @README.md under Initial Setup, after # 3. Install dependencies'
**Tool:** Cursor
**Result:** Updated instructions, cors setup, vite setup, added .env example
**Time Saved:** ~30 min
