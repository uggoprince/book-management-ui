# Books Dashboard - Frontend

A React SPA for managing books with Chakra UI and Auth0 authentication.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Chakra UI** - Component library
- **Apollo Client** - GraphQL client
- **Auth0** - Authentication
- **React Router** - Client-side routing

## Prerequisites

- Node.js 18+
- npm or yarn
- Auth0 account (see backend README for setup)

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your Auth0 credentials
```

## Configuration

Edit the `.env` file with your Auth0 credentials:

```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-spa-client-id
VITE_AUTH0_AUDIENCE=https://books-dashboard-api
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

### Auth0 Application Settings

In your Auth0 Application settings, configure the following URLs. You can provide a comma-separated list including both local development and deployed URLs:

- **Allowed Callback URLs**: `http://localhost:5173, https://yourdomain.com`
- **Allowed Logout URLs**: `http://localhost:5173, https://yourdomain.com`
- **Allowed Web Origins**: `http://localhost:5173, https://yourdomain.com`

Replace `https://yourdomain.com` with your actual deployed application URL. Auth0 will accept authentication requests from any URL in these lists.

## Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at: http://localhost:3000

## Features

### Authentication

- **Sign Up**: Create a new account via Auth0
- **Sign In**: Log in with existing Auth0 credentials
- **Sign Out**: Securely log out and clear session

### Books Management

- **View Books**: Table display of all books with pagination
- **Create Book**: Add new books via modal form
- **Edit Book**: Update existing book details
- **Delete Book**: Remove books with confirmation dialog

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx           # Navigation bar with auth controls
│   ├── BookModal.tsx        # Create/Edit book modal
│   └── DeleteConfirmModal.tsx # Delete confirmation dialog
├── graphql/
│   └── operations.ts        # GraphQL queries and mutations
├── hooks/
│   └── useForm.ts           # Custom form handling hook
├── pages/
│   ├── Dashboard.tsx        # Main books dashboard page
│   └── LoginPage.tsx        # Login/signup landing page
├── types/
│   └── book.ts              # TypeScript interfaces
├── App.tsx                  # Main app component with routing
├── main.tsx                 # Entry point with providers
└── vite-env.d.ts            # Vite environment types
```

## Deployment

For deployment to Netlify:

1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables in Netlify dashboard

For deployment to Vercel:

1. Import your GitHub repository
2. Framework preset: Vite
3. Set environment variables in Vercel dashboard

## Styling

The application uses Chakra UI with a custom brand color scheme:

- Primary color: Blue (`brand.500`)
- Light backgrounds with subtle shadows
- Consistent spacing and typography

## License

MIT
