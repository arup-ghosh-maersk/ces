# CES Angular Application - Commands & Reference Guide

## Project Location
```
/Users/sanchari/Downloads/tt/ces-inspection-system
```

## Development Commands

### Initial Setup
```bash
# Navigate to project
cd /Users/sanchari/Downloads/tt/ces-inspection-system

# Install dependencies
npm install

# Start development server
ng serve

# Open in browser
# http://localhost:4200/
```

### Running the Application
```bash
# Development server with live reload
ng serve

# Development server on specific port
ng serve --port 4300

# Build for production
ng build --configuration production

# Serve production build locally
ng serve --configuration production --port 4300
```

## Project Structure Navigation

```bash
# View project structure
tree -L 3 -I 'node_modules'

# List all components
find src/app/components -name "*.ts" -type f

# List all services
find src/app/services -name "*.ts" -type f

# View file sizes
du -sh src/app/*
```

## Development Workflows

### Creating a New Component
```bash
ng generate component components/my-component

# Or use shorthand
ng g c components/my-component
```

### Creating a New Service
```bash
ng generate service services/my-service

# Or use shorthand
ng g s services/my-service
```

### Creating a New Model
```bash
# Create new file in models directory
# Add your interface definitions
```

## Testing

```bash
# Run unit tests
ng test

# Run tests with code coverage
ng test --code-coverage

# Run E2E tests
ng e2e

# Run specific test file
ng test --include='**/my.service.spec.ts'
```

## Code Quality

```bash
# Run linter
ng lint

# Format code with prettier (if installed)
npm run format

# Check for security vulnerabilities
npm audit
```

## Building & Deployment

```bash
# Development build
ng build

# Production build (optimized)
ng build --configuration production

# Build with source maps (for debugging)
ng build --source-map

# Build with stats file
ng build --stats-json

# Analyze bundle size
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/ces-inspection-system/stats.json
```

## Server Commands (if using SSR)

```bash
# Build for SSR
ng build --configuration development
ng build --configuration production

# Serve SSR build locally
node dist/ces-inspection-system/server.mjs
```

## Useful npm Scripts

```bash
# List all available scripts
npm run

# Common scripts
npm start          # Same as ng serve
npm test          # Same as ng test
npm run build     # Same as ng build --configuration production
```

## Angular CLI Global Commands

```bash
# Check Angular version
ng version

# Get help on specific command
ng help
ng help serve

# Update Angular
ng update @angular/cli @angular/core

# Create a new workspace (not needed here)
ng new my-project

# Analyze bundle
ng build --stats-json
```

## File Editing Quick Reference

### Edit Components
```bash
# Dashboard
nano src/app/components/dashboard/dashboard.component.ts

# Assets
nano src/app/components/asset-list/asset-list.component.ts

# Templates
nano src/app/components/itp-templates/itp-templates.component.ts

# Jobs
nano src/app/components/inspection-jobs/inspection-jobs.component.ts
```

### Edit Services
```bash
# Asset Service
nano src/app/services/asset.service.ts

# ITP Template Service
nano src/app/services/itp-template.service.ts

# Inspection Job Service
nano src/app/services/inspection-job.service.ts
```

### Edit Configuration
```bash
# Global styles
nano src/styles.css

# Routing
nano src/app/app.routes.ts

# App config
nano src/app/app.config.ts

# Models
nano src/app/models/index.ts
```

## Package Management

```bash
# Install a package
npm install package-name

# Install package as dev dependency
npm install --save-dev package-name

# Update all packages
npm update

# Check for outdated packages
npm outdated

# Check installed packages
npm list

# Remove a package
npm uninstall package-name

# Clean install (removes node_modules)
rm -rf node_modules
npm install
```

## Debugging

```bash
# Run with debugging
ng serve --poll

# Chrome DevTools
# Open Chrome DevTools (F12)
# Go to Sources tab
# Find your TypeScript files

# Check network tab for API calls
# Monitor console for errors
```

## Performance Optimization

```bash
# Generate bundle analysis
ng build --stats-json

# Check bundle size
npm list

# Code splitting analysis
ng build --configuration production --stats-json

# View source maps
ng build --source-map
```

## Docker Commands (if using Docker)

```bash
# Build Docker image
docker build -t ces-inspection-system .

# Run Docker container
docker run -p 4200:4200 ces-inspection-system

# Push to registry
docker push your-registry/ces-inspection-system
```

## Useful Shortcuts in Code

### VSCode Shortcuts
```
Cmd+P          Open file quickly
Cmd+Shift+P    Command palette
Cmd+/          Toggle comment
Cmd+D          Select word
Cmd+Shift+F    Find in all files
Ctrl+Space     Auto-complete
```

### Angular Shortcuts
```
Generate component     ng g c name
Generate service       ng g s name
Generate module        ng g m name
Generate directive     ng g d name
Generate pipe          ng g p name
```

## Common Errors & Solutions

### Port Already in Use
```bash
# Find process on port 4200
lsof -i :4200

# Kill the process
kill -9 <PID>

# Or use different port
ng serve --port 4300
```

### Module Not Found
```bash
# Clear Angular cache
rm -rf .angular/cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Fails
```bash
# Clean build
ng build --configuration production --force

# Check TypeScript errors
npx tsc --noEmit
```

## Accessing Mock Data

### In Services
```typescript
// Data is initialized in each service
// Access via Observable
this.assetService.getAssets().subscribe(assets => {
  console.log(assets);
});
```

### In Components
```typescript
// Use async pipe in template
<table>
  <tr *ngFor="let item of items$ | async">
    <td>{{ item.name }}</td>
  </tr>
</table>
```

## API Integration Preparation

### When Ready for Backend:

1. **Update Service URLs**
```typescript
private apiUrl = 'http://api.example.com/assets';

getAssets(): Observable<Asset[]> {
  return this.http.get<Asset[]>(this.apiUrl);
}
```

2. **Add HttpClient**
```typescript
import { HttpClientModule } from '@angular/common/http';

// Add to app config
import { provideHttpClient } from '@angular/common/http';
```

3. **Remove Mock Data**
```typescript
// Comment out initializeMockData()
// Remove mock data from services
```

## Version Information

```bash
# Check installed versions
npm list @angular/core
npm list typescript
npm list rxjs

# Current versions in project
# Angular 18.x
# TypeScript 5.x
# RxJS 7.x
# Node 18.x
```

## Useful Links

- **Angular Docs**: https://angular.io/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **RxJS Docs**: https://rxjs.dev/
- **Angular CLI**: https://angular.io/cli

## Monitoring & Analytics

```bash
# View application logs
ng serve --verbose

# Check bundle stats
ng build --stats-json
ls -la dist/ces-inspection-system/

# Performance monitoring
# Use Chrome DevTools > Lighthouse tab
```

## Troubleshooting Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check Angular version
ng version

# Diagnose Angular CLI issues
ng version --verbose

# Check installed dependencies
npm list --depth=0

# Verify all dependencies are compatible
npm audit

# Check for peer dependency issues
npm ls
```

## Quick Reference Table

| Command | Purpose |
|---------|---------|
| `ng serve` | Start dev server |
| `ng build` | Build project |
| `ng test` | Run tests |
| `ng g c name` | Generate component |
| `ng g s name` | Generate service |
| `ng lint` | Check code quality |
| `npm install` | Install dependencies |
| `npm update` | Update packages |
| `npm audit` | Check vulnerabilities |

## File Watching

```bash
# Watch specific file type
ng build --watch

# Watch styles
ng serve --poll

# Manual watch with node
nodemon --exec "ng serve"
```

## Environment Variables

```bash
# Create environment file
# src/environments/environment.ts
# src/environments/environment.prod.ts

# Use in code
import { environment } from '../environments/environment';

console.log(environment.production);
```

---

**Need help?** Refer to:
- PROJECT_DOCUMENTATION.md - System architecture
- QUICKSTART.md - Getting started
- IMPLEMENTATION_SUMMARY.md - What was built
