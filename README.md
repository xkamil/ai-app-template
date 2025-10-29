# AI App Template

A modern React application template for building AI-powered applications. This template is configured to build into a single, self-contained HTML file with all styles and JavaScript embedded.

## Features

- **React 18.3** - Latest version of React with modern features
- **Bootstrap 5.3** - Responsive design framework
- **Single File Build** - Outputs a standalone HTML file with no external dependencies
- **Vite** - Fast development and optimized production builds
- **GitHub Pages** - Automatic deployment via GitHub Actions

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open your browser to the URL shown in the terminal (typically http://localhost:5173)

### Build

Create a production build:

```bash
npm run build
```

The build output will be in the `dist/` directory as a single `index.html` file with all assets embedded.

### Preview Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
ai-app-template/
├── src/
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
├── vite.config.js       # Vite configuration for single-file build
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Configuration

The project follows rules defined in `.clinerules`:

1. Uses newest version of React.js
2. Uses Bootstrap for styling
3. Builds to a single HTML file with embedded styles and JavaScript

## Deployment

### GitHub Pages

This project includes a GitHub Actions workflow that automatically builds and deploys your app to GitHub Pages.

#### Setup Instructions

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Build and deployment" > "Source", select "GitHub Actions"

2. **Push to master branch:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin master
   ```

3. **Automatic deployment:**
   - The workflow will automatically trigger on every push to the master branch
   - You can also manually trigger it from the Actions tab
   - Once deployed, your app will be available at: `https://[username].github.io/[repository-name]/`

#### Workflow Details

The workflow (`.github/workflows/deploy.yml`) performs these steps:
- Checks out the code
- Sets up Node.js 20
- Installs dependencies
- Builds the project
- Deploys the `dist/` directory to GitHub Pages

You can view deployment status in the Actions tab of your repository.

## Customization

To customize the welcome page, edit `src/App.jsx`. The component uses Bootstrap classes for styling and is fully responsive.

## License

MIT
