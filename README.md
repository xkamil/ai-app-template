# AI App Template

A modern React application template for building AI-powered applications. This template is configured to build into a single, self-contained HTML file with all styles and JavaScript embedded.

## Features

- **React 18.3** - Latest version of React with modern features
- **Bootstrap 5.3** - Responsive design framework
- **Single File Build** - Outputs a standalone HTML file with no external dependencies
- **Vite** - Fast development and optimized production builds
- **Supabase Authentication** - Email/password login with session persistence
- **Internationalization (i18n)** - Multi-language support (English & Polish) with auto-detection
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
│   ├── components/
│   │   ├── LanguageSwitcher.jsx # Language selection dropdown
│   │   └── PrivateRoute.jsx    # Protected route wrapper
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state management
│   │   └── LanguageContext.jsx # i18n state management
│   ├── lib/
│   │   └── supabase.js         # Supabase client configuration
│   ├── locales/
│   │   ├── en.js               # English translations
│   │   ├── pl.js               # Polish translations
│   │   └── index.js            # Supported languages export
│   ├── pages/
│   │   ├── LoginPage.jsx       # User login (default page)
│   │   ├── SignUpPage.jsx      # User registration
│   │   ├── PasswordResetPage.jsx # Password reset flow
│   │   └── DashboardPage.jsx   # Protected dashboard
│   ├── App.jsx                 # Main app with routing
│   └── main.jsx                # Application entry point
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions deployment
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration for single-file build
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Configuration

The project follows rules defined in `.clinerules`:

1. Uses newest version of React.js
2. Uses Bootstrap for styling
3. Builds to a single HTML file with embedded styles and JavaScript

## Internationalization (i18n)

The app supports multiple languages with automatic detection and manual switching.

### Supported Languages

- **English (en)** - Default language
- **Polish (pl)** - Polski

### Features

- **Auto-Detection** - Automatically detects browser language on first load
- **Manual Switching** - Language switcher dropdown in top-right corner
- **Persistent Preference** - Selected language saved to localStorage
- **Centralized Translations** - All text in `src/locales/` directory
- **Easy to Extend** - Add new languages by creating new translation files

### Adding New Languages

1. Create a new translation file in `src/locales/` (e.g., `de.js` for German)
2. Copy the structure from `en.js` and translate all values
3. Add the language to `src/locales/index.js`:
   ```javascript
   import de from './de'

   export const translations = {
     en,
     pl,
     de  // Add new language
   }

   export const supportedLanguages = [
     { code: 'en', name: 'English', flag: '🇬🇧' },
     { code: 'pl', name: 'Polski', flag: '🇵🇱' },
     { code: 'de', name: 'Deutsch', flag: '🇩🇪' }  // Add new language
   ]
   ```

### Translation Files

All translations are stored in `src/locales/`:
- `en.js` - English translations
- `pl.js` - Polish translations
- `index.js` - Exports all languages

### Usage in Components

```javascript
import { useLanguage } from '../context/LanguageContext'

function MyComponent() {
  const { t, currentLanguage, changeLanguage } = useLanguage()

  return <h1>{t('login.title')}</h1>
}
```

## Authentication

This template includes a complete authentication system powered by Supabase:

### Features

- **Email/Password Authentication** - Secure user login and registration
- **Session Persistence** - Sessions automatically saved to localStorage
- **Password Reset** - Complete password recovery flow
- **Protected Routes** - Dashboard accessible only to authenticated users
- **Auto-Restore Session** - User stays logged in after page refresh

### Supabase Configuration

The Supabase client is configured in `src/lib/supabase.js` with:
- Project URL: `https://ymyxknvebuomftpnvutj.supabase.co`
- Public API Key: Embedded in the code (safe for client-side use)

### Important: Supabase Setup Required

Before using authentication, configure your Supabase project:

1. **Enable Email Authentication:**
   - Go to Supabase Dashboard > Authentication > Providers
   - Enable "Email" provider
   - Configure email templates if desired

2. **Configure Redirect URLs:**
   - Go to Authentication > URL Configuration
   - Add your site URL to "Site URL"
   - Add redirect URLs for password reset:
     - Development: `http://localhost:5173/#/reset-password`
     - Production: `https://yourdomain.com/#/reset-password`

3. **Disable Email Confirmation (Optional):**
   - If you want immediate login without email verification:
   - Go to Authentication > Settings
   - Disable "Enable email confirmations"

### Routes

- `/` - Login page (default for non-authenticated users)
- `/#/signup` - Registration page
- `/#/reset-password` - Password reset request
- `/#/dashboard` - Protected dashboard (requires authentication)

### Session Management

Sessions are automatically:
- Stored in localStorage with key `ai-app-auth`
- Restored when the app loads
- Maintained across page refreshes
- Cleared on sign out

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

## How It Works

### Single-File Build with Routing

This project uses **hash-based routing** (`HashRouter`) which is fully compatible with the single-file build:

- URLs use the hash format: `index.html`, `index.html#/signup`, `index.html#/dashboard`
- No server-side configuration needed
- Works perfectly when distributed as a single HTML file
- All navigation happens client-side
- Default route (`/`) shows the login page

### Session Persistence

Supabase automatically handles session persistence:

1. When you log in, Supabase saves the session to `localStorage`
2. When the app loads, `AuthContext` checks `localStorage` for an existing session
3. If found, the user is automatically logged in
4. Sessions remain valid until explicitly logged out or expired

### Build Output

Running `npm run build` creates a single `dist/index.html` file:
- **Size:** ~682 KB (~164 KB gzipped)
- **Contains:** All HTML, CSS, JavaScript (including Bootstrap), translations, and dependencies
- **No external files needed** - fully self-contained
- **Ready to deploy** - upload anywhere, no server configuration required
- **Includes:** Both English and Polish translations embedded

### User Flow

1. **Non-authenticated user opens index.html:**
   - Login form displayed immediately
   - Can click "Sign up" to create account
   - Can click "Forgot password?" to reset password

2. **Authenticated user opens index.html:**
   - Automatically redirected to dashboard
   - Session restored from localStorage
   - Can sign out to return to login page

## Customization

- **Login Page:** Edit `src/pages/LoginPage.jsx`
- **Dashboard:** Edit `src/pages/DashboardPage.jsx`
- **Styling:** Modify Bootstrap classes or add custom CSS
- **Auth Pages:** Customize login/signup forms in `src/pages/`
- **Routing:** Add new routes in `src/App.jsx`

## License

MIT
