#!/bin/bash
# Script to add environment variables to Vercel
# Run this in your terminal after installing Vercel CLI

vercel env add PORT 3000
vercel env add MONGODB_URL "mongodb+srv://pcgameing712:DNxlHFpgYHtKxmQH@cluster0.92eqz.mongodb.net/QMS?retryWrites=true&w=majority&appName=Cluster0"
vercel env add JWT_SECRET "thisisasamplesecret"
vercel env add JWT_ACCESS_EXPIRATION_MINUTES 30
vercel env add JWT_REFRESH_EXPIRATION_DAYS 30
vercel env add JWT_RESET_PASSWORD_EXPIRATION_MINUTES 30
vercel env add JWT_VERIFY_EMAIL_EXPIRATION_MINUTES 30
vercel env add SMTP_HOST "smtp.gmail.com"
vercel env add SMTP_PORT 587
vercel env add SMTP_USERNAME "trdeveloper105@gmail.com"
vercel env add SMTP_PASSWORD "nesmpydxafppxrkh"
vercel env add EMAIL_FROM "trdeveloper105@gmail.com"
vercel env add COOKIE_SECRET "thisisasamplesecret"
vercel env add CLIENT_URL "https://your-frontend-domain.vercel.app"
vercel env add GOOGLE_CLIENT_ID "286738798829-dfvamrejoo1p7igioiaabj11scj6rv24.apps.googleusercontent.com"
vercel env add GOOGLE_CLIENT_SECRET "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"
vercel env add GOOGLE_REDIRECT_URI "https://your-api-domain.vercel.app/v1/users/login/google/callback"
vercel env add STRIPE_SECRET_ACCESS_KEY "sk_test_51RfdkPRI5cSMk8WFCObhMUVD9WbRQUWn6ZPnCaGjekfrWgfkXNKcIsjFSJpiWyy0oMQGUDj240uJJOwsRZNrcGLL00nEfgbxhR"
vercel env add STRIPE_PUBLISHABLE_KEY "pk_test_51RfdkPRI5cSMk8WFCObhMUVD9WbRQUWn6ZPnCaGjekfrWgfkXNKcIsjFSJpiWyy0oMQGUDj240uJJOwsRZNrcGLL00nEfgbxhR"
vercel env add STRIPE_WEBHOOK_SECRET "whsec_e6a5c02699c4420aa157e29867d92a8c5547df9305c67dabea3900640c572cb0"
vercel env add AWS_ACCESS_KEY_ID "AKIARLBZLNKDWRYCNE65"
vercel env add AWS_SECRET_ACCESS_KEY "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"
vercel env add AWS_STORAGE_BUCKET_NAME "bartztestbucket"
vercel env add REGION "us-east-2"
