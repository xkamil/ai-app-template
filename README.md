# AI App Template

A modern React application template for building AI-powered applications. This template is configured to build into a single, self-contained HTML file with all styles and JavaScript embedded.

## Features

- **React 18.3** - Latest version of React with modern features
- **Bootstrap 5.3** - Responsive design framework
- **Single File Build** - Outputs a standalone HTML file with no external dependencies
- **Vite** - Fast development and optimized production builds

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

## Customization

To customize the welcome page, edit `src/App.jsx`. The component uses Bootstrap classes for styling and is fully responsive.

## License

MIT
