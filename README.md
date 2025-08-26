# The Living Room Signup - React Application

A modern React-based signup application for The Living Room private members club.

## Features

- **Two-Step Registration Process**: Email/TLR Code verification followed by user details
- **Modern UI/UX**: Clean, professional design with glass morphism effects
- **Form Validation**: Client-side validation using Zod schemas
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Works on desktop and mobile devices
- **API Integration**: Connects to the signup API endpoints

## Tech Stack

- **React 18** with TypeScript
- **React Hook Form** for form management
- **Zod** for schema validation
- **Lucide React** for icons
- **Custom CSS** for styling (no Tailwind dependencies)
- **Fetch API** for API calls

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Configure environment variables:
   ```bash
   # .env.local
   REACT_APP_API_URL=http://localhost:3001
   ```

### Development

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Building for Production

Build the application:
```bash
npm run build
```

The built files will be in the `build` directory.

## Project Structure

```
src/
├── App.tsx              # Main application component
├── App.css              # Global styles and custom CSS
├── services/
│   └── api.ts           # API service functions
└── utils/
    └── validation.ts    # Zod validation schemas
```

## API Integration

The application integrates with the signup API endpoints:

- `POST /api/signup/verify` - Verify email and TLR code
- `POST /api/signup/register` - Register user with full details

## Form Validation

### Step 1 Validation
- Email: Required, valid email format
- TLR Code: Required, exactly 3 digits

### Step 2 Validation
- First Name: Required, minimum 2 characters
- Last Name: Required, minimum 2 characters
- Phone: Required, minimum 9 digits
- NIF: Required, minimum 9 digits
- Address: Required, minimum 10 characters

## Styling

The application uses custom CSS with modern design principles:
- Glass morphism effects for modern appearance
- Responsive design for all screen sizes
- Consistent color scheme and typography
- Smooth transitions and hover effects
- Background image from The Living Room facade

## Environment Variables

- `REACT_APP_API_URL` - Base URL for the API server

## Deployment

The application can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3
- GitHub Pages

## License

© 2024 The Living Room. All rights reserved.
