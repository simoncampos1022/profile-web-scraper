# Vercel Deployment Guide

## Environment Variables

Set these environment variables in your Vercel dashboard:

### Required Variables:
- `MONGODB_URI` - Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/scraper`)
- `JWT_SECRET` - A secure random string for JWT token signing (e.g., `your-super-secret-jwt-key-here`)

### How to Set Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string
   - **Environment**: Production, Preview, Development (select all)
   
   - **Name**: `JWT_SECRET`
   - **Value**: A secure random string (at least 32 characters)
   - **Environment**: Production, Preview, Development (select all)

## Deployment Steps:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set the environment variables as described above
4. Deploy!

## Build Configuration:

The project is configured to:
- Use Yarn as the package manager (package-lock.json has been removed)
- Build with Next.js 15.0.1
- Pass all ESLint checks
- Generate optimized production builds

## Database Setup:

Make sure your MongoDB database:
- Has the "scraper" database
- Contains "profiles" and "users" collections
- Is accessible from Vercel's servers (use MongoDB Atlas for cloud hosting)

## Troubleshooting:

If deployment fails:
1. Check that all environment variables are set
2. Verify MongoDB connection string is correct
3. Ensure database is accessible from external IPs
4. Check Vercel build logs for specific errors
