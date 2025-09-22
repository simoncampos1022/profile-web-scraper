# Cofounder Search Platform Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/scraper

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here
```

## Database Setup

The application uses MongoDB with the database name "scraper" and two collections:

1. **profiles** - Stores cofounder profiles scraped from Y Combinator
2. **users** - Stores registered platform users

## Features Implemented

### Authentication
- ✅ User signup with email, password, and confirm password
- ✅ User signin with email and password
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ Logout functionality

### Profile Status Tracking
- ✅ Added "viewers" field to Profile model (Map<string, boolean>)
- ✅ Status dropdown in ProfileTable with three options:
  - **Yet** (Gray) - Not viewed or no status set
  - **Good** (Green) - Positive evaluation
  - **Bad** (Red) - Negative evaluation
- ✅ API endpoint to update profile viewer status
- ✅ Real-time status updates in the UI

### User Interface
- ✅ Updated Navbar with authentication state
- ✅ Protected dashboard route
- ✅ User-specific profile status tracking
- ✅ Responsive design with Tailwind CSS

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Profile Status
- `PUT /api/profiles/status` - Update profile viewer status

## Usage

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:5555`
3. Register a new account or login
4. Browse profiles and set status using the dropdown
5. Your status preferences are saved per profile

## Database Schema

### Profile Model
```typescript
{
  userId: string,
  name: string,
  location: string,
  // ... other profile fields
  viewers: Map<string, boolean> // userId -> status (true=Good, false=Bad, undefined=Yet)
}
```

### User Model
```typescript
{
  email: string,
  name: string,
  password: string, // hashed with bcrypt
  enabled: boolean,
  date: Date
}
```
