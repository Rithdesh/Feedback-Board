# Tech Stack:

    Frontend: React.js, TailwindCSS

    Backend: Node.js, Express.js

    Database: MongoDB (with Mongoose)

    Authentication: JWT (JSON Web Token)

    Image Uploads: Cloudinary + Multer

    Deployment:

    Backend → Render

    Frontend → Netlify

#  Features:

    User Authentication (Signup / Login / JWT protected routes)

    Post creation with image uploads (from file or image link)

    Users can edit and delete their own posts

    Feedback system:

    Users and Guests can leave feedback

    Option for Anonymous feedback

    Users can edit and delete their own feedback

    Profile page to manage My Posts and My Feedbacks

    Responsive design with Tailwind CSS 🎨

# Guide for running the project Locally
    1. Clone the repository:
        
        git clone https://github.com/Rithdesh/Feedback-Board.git
        cd TASK

    2. Backend Setup (/Backend):
       
        cd Backend
        npm install
    
    3. Create a .env file inside /Backend with:

    
        MONGO_URI=your_mongodb_connection_string
        SECRET=your_jwt_secret
        CLOUDINARY_CLOUD_NAME=your_cloud_name
        CLOUDINARY_API_KEY=your_api_key
        CLOUDINARY_API_SECRET=your_api_secret

        Run backend locally:

   
            npm start
            By default, backend runs on:
            http://localhost:8000

# Deployment Guide
     
    Backend (Render):
    Push backend code to GitHub

    In Render:

    Create a new web service

    Build command: npm install

    Start command: node Server.js

    Environment Variables: Same as .env

    Frontend (Netlify):
    Push frontend code to GitHub

    In Netlify:

    Create a new site from Git

    Build command: npm run build

    Publish directory: dist (if using Vite) or build (if using Create React App)

    Set Netlify Environment Variables (like backend API base URL)

#  Folder Structure:

        Root
        ├── Backend
        │ ├── Controllers
        │ ├── Models
        │ ├── Routes
        │ ├── Middleware
        │ └── Server.js
        └── Frontend
        ├── src
        │ ├── components (Navbar, Profile, etc.)
        │ └── pages (Home, Login, etc.)
        └── package.json
