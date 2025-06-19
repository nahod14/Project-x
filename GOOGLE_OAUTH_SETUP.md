# Google OAuth Setup Guide

## 🔧 Setting up Google OAuth Credentials

### Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `Price Tracker` (or any name you prefer)
4. Click "Create"

### Step 2: Enable Required APIs

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for and enable these APIs:
   - **Google+ API**
   - **Google Identity Services API**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** (unless you have a Google Workspace account)
3. Fill in the required fields:
   - **App name**: `Price Tracker`
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **Save and Continue** through all steps
5. Add test users (your email) if needed

### Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Set the name: `Price Tracker Web Client`
5. Add **Authorized redirect URIs**:
   ```
   http://localhost:3001/api/auth/google/callback
   ```
6. Click **Create**
7. **Copy the Client ID and Client Secret** - you'll need these!

## 🔑 Backend Environment Variables Setup

### Create backend/.env file with these variables:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/price-tracker

# Server
PORT=3001
NODE_ENV=development

# JWT Secret (change this to a secure random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google OAuth Credentials (replace with your actual credentials)
GOOGLE_CLIENT_ID=your-google-client-id-from-step-4
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-step-4

# Session Secret (change this to a secure random string in production)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

## 🚀 Testing the Setup

1. **Create the `.env` file** in the `backend/` directory with your actual credentials
2. **Restart the backend server**:
   ```bash
   cd backend
   npm run dev
   ```
3. **Test Google OAuth**:
   - Go to http://localhost:5173
   - Click "Sign up with Google" or "Sign in with Google"
   - You should be redirected to Google's OAuth consent screen
   - After authorization, you'll be redirected back to your app

## 🔒 Security Notes

- **Never commit your `.env` file** to version control
- **Use strong, unique secrets** for JWT_SECRET and SESSION_SECRET
- **In production**, use environment variables or a secure secret management service
- **Update redirect URIs** for production domains

## 🐛 Troubleshooting

### Common Issues:

1. **"OAuth not configured" error**:
   - Make sure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in `.env`
   - Restart the backend server after adding credentials

2. **"Redirect URI mismatch" error**:
   - Check that the redirect URI in Google Console matches exactly:
     `http://localhost:3001/api/auth/google/callback`

3. **"Access blocked" error**:
   - Make sure you've added your email as a test user in OAuth consent screen
   - Or publish your app (not recommended for development)

## ✅ Verification

Once set up correctly, you should see in the backend console:
```
Google OAuth configured successfully
Server running on port 3001
```

Instead of:
```
Google OAuth not configured - signup/login with Google will not work
``` 