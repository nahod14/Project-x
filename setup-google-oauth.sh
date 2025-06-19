#!/bin/bash

echo "🚀 Google OAuth Setup Script for Price Tracker"
echo "=============================================="
echo ""

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env file not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "📋 Current .env configuration:"
echo "------------------------------"
cat backend/.env
echo ""
echo "------------------------------"
echo ""

echo "🔧 To complete Google OAuth setup:"
echo ""
echo "1. Go to Google Cloud Console: https://console.cloud.google.com/"
echo "2. Create a new project or select existing one"
echo "3. Enable Google+ API and Google Identity Services API"
echo "4. Configure OAuth consent screen"
echo "5. Create OAuth 2.0 credentials with redirect URI:"
echo "   http://localhost:3001/api/auth/google/callback"
echo ""

read -p "Do you have your Google Client ID? (y/n): " has_client_id

if [ "$has_client_id" = "y" ] || [ "$has_client_id" = "Y" ]; then
    read -p "Enter your Google Client ID: " client_id
    read -p "Enter your Google Client Secret: " client_secret
    
    # Update .env file
    sed -i.bak "s/GOOGLE_CLIENT_ID=.*/GOOGLE_CLIENT_ID=$client_id/" backend/.env
    sed -i.bak "s/GOOGLE_CLIENT_SECRET=.*/GOOGLE_CLIENT_SECRET=$client_secret/" backend/.env
    
    # Generate random secrets
    jwt_secret=$(openssl rand -base64 32)
    session_secret=$(openssl rand -base64 32)
    
    sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$jwt_secret/" backend/.env
    sed -i.bak "s/SESSION_SECRET=.*/SESSION_SECRET=$session_secret/" backend/.env
    
    # Remove backup file
    rm backend/.env.bak
    
    echo ""
    echo "✅ Google OAuth credentials configured!"
    echo "✅ JWT and Session secrets generated!"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Start MongoDB: docker run -d -p 27017:27017 mongo:6.0"
    echo "2. Start backend: cd backend && npm run dev"
    echo "3. Start frontend: cd frontend && npm run dev"
    echo "4. Test Google OAuth at: http://localhost:5173"
    echo ""
else
    echo ""
    echo "📖 Please follow the setup guide in GOOGLE_OAUTH_SETUP.md"
    echo "Then run this script again with your credentials."
fi 