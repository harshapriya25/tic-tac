# Tic-Tac-Toe — Running Project with CI/CD

A playable two-player Tic-Tac-Toe web application built with Node.js and HTML/CSS/JavaScript. It includes a GitHub Actions workflow for code checks, automated tests, a downloadable ZIP artifact, and optional deployment triggering.

## Requirements
- Node.js 20 or newer
- Git for GitHub workflow practice

No third-party npm packages are required.

## Run locally
1. Extract the ZIP file.
2. Open the extracted `tic-tac-toe-cicd-project` folder in VS Code.
3. Select Terminal → New Terminal.
4. Run `npm.cmd start` in Windows PowerShell (or `npm start` in a terminal that permits npm scripts).
5. Open http://localhost:3000.
6. Play with two players on the same device.

Stop the server with Ctrl+C.

## Test locally
```powershell
npm.cmd run check
npm.cmd test
```

## Features
- Two-player X/O gameplay
- Win, draw, and turn detection
- Winning squares highlighted
- Scoreboard and reset controls
- Node.js health endpoint at `/api/health`
- Winner-check API at `/api/check-winner`
- Automated Node.js tests

## GitHub setup
Create an empty GitHub repository, then run these commands in this project folder. Replace the example URL with your repository URL.

```powershell
git init
git add .
git commit -m "Add Tic-Tac-Toe game and CI/CD workflow"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

If you already have a Git repository, don't run `git init` or `git remote add origin` again. Copy the project files into your repository and commit/push them.

## CI/CD pipeline
`.github/workflows/main.yml` has these stages:
1. Code Quality — checks JavaScript syntax.
2. Automated Tests — checks winner logic and the health endpoint.
3. Package Application — creates and uploads `tic-tac-toe.zip`.
4. Optional Render Deployment — triggers a deploy only if the `RENDER_DEPLOY_HOOK` repository secret is configured.

Jobs use `needs` so each stage waits for the previous stage to succeed.

## Optional Render deployment
1. Create a Render Web Service connected to your GitHub repository.
2. Use `npm start` as the start command.
3. In GitHub, go to Settings → Secrets and variables → Actions → New repository secret.
4. Set the secret name to `RENDER_DEPLOY_HOOK` and paste the deploy hook URL as its value.
5. Push a new commit to `main`.

Never hard-code deployment secrets in source files. If the secret isn't configured, deployment is skipped while the checks and artifact job still run.

## Learning exercises
- Change the page title and push a commit.
- Introduce a syntax error to see the quality job fail, then fix it.
- Add a test for a different winning line.
- Download the artifact from a successful Actions run.
- Create a branch and pull request to see the pull-request workflow.
