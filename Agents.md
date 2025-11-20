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

### 8. Build the resources list

**Prompt:** '/speckit.implement @002-resources-list using a MVP First strategy delivering each phase as a commit which I can review before going to the next phase. Prompt me to continue or request prompts to change'
**Tool:** Cursor
**Result:** 002-resources-list spec
**Time Saved:** ~3 hour

### 10. Fixes and Bugfixes for resources implementation

**Prompt:** `
/speckit.specify
Please review and update the implementation of @002-resources-list to address the following issues across bulk add/edit, delete, and detail views:

- The coverage tag should show x/5 tags, not 3 (3 required + 2 optional).
- Each tag should have its own column in the list.
- Add, edit, and delete should use popovers like the filters, listing available tags (already added tags should appear but be greyed out).
- The remove tag functionality should have a backend DELETE endpoint and work as intended.
- In bulk mode, show previews as soon as a tag value is edited (before save).
- The endpoints for the detail view should be working and reflect updates immediately.
- Combine add/edit actions into a single button, with options split into 2 groups: Required and Optional (all tags shown).
- Bulk remove actions should show a menu split for optional tags only, and only optional tags present among selected resources should be shown.
- Bulk edit buttons above the table should use dropdown menus (no greyed out options).
- Both add/edit and delete sheets should not include tag type selects—the tag is selected via the button that opens the sheet.
- Resources should not update until the user hits "Apply".
- For add/edit sheets, show a preview of tag changes for each resource, including:
  - A message like: "5 resources will be updated, 2 already have this tag" or "5 resources will be updated" if none have it.
  - Under each resource, display what the tags will be after saving.
- For delete tag modals, show a message: "5 resources will be updated, x do not have this tag".
- On detail pages, clicking edit or a tag value should open a popover for editing and saving that tag.

Additionally, address the following bugs with bulk add/edit and delete:

1. Fix issue where opening the sheet for add/edit with an enum value causes immediate submission and continuous rerendering (preview should show before any submission).
2. Fix issue where opening the sheet for add/edit with a string value causes continuous rerender and prevents preview.
3. Fix issue where opening the modal for delete causes immediate submission and rerendering with no preview.

Open a browser session to confirm these fixes are effective.
`
**Tool:** Cursor  
**Result:** 002-resources-list spec updated  
**Time Saved:** ~4.5 hours
