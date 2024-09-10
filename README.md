# MERN Stack Twitter Clone

A Twitter clone built with the MERN (MongoDB, Express.js, React.js, Node.js) stack featuring user authentication, likes, following, posts, comments, and notifications. The frontend is styled using Tailwind CSS.

## Features

- User Authentication (Sign Up, Log In, Log Out)
- Create, Edit, and Delete Posts
- Like and Comment on Posts
- Follow and Unfollow Users
- Real-time Notifications
- Responsive Design with Tailwind CSS

## Tech Stack

- **Frontend:**
  - React.js
  - Tailwind CSS

- **Backend:**
  - Node.js
  - Express.js

- **Database:**
  - MongoDB

## Directory Structure
twitter-clone/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── App.js
    │   ├── index.js
    │   └── tailwind.config.js
    ├── public/
    ├── .env
    └── package.json
## Environment Variables
MONGO_URI
PORT
JWT_SECRET
NODE_ENV
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
