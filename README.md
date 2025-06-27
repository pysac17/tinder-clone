# Tinder Clone

A modern dating application clone built with React, Node.js, and Firebase, replicating core Tinder functionalities like swiping, matching, and real-time messaging.

## Features

- Swipe left/right to like or pass on profiles
- Real-time chat with matched users
- Secure authentication with Firebase
- Responsive design for mobile and desktop
- Dark/Light mode support
- Photo upload and profile customization
- Real-time updates and notifications

## Tech Stack

- **Frontend**: React, React Router, Material-UI
- **Backend**: Node.js, Express
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Deployment**: Vercel/Netlify (Frontend), Heroku (Backend)
- **State Management**: React Context API
- **Styling**: CSS Modules, Styled Components

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or Yarn
- Firebase account
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/tinder-clone.git
cd tinder-clone
```

### 2. Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Start the Development Server

```bash
# Start the client
cd client
npm start

# In a new terminal, start the server
cd ../server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

```
tinder-clone/
├── client/                 # Frontend React application
├── server/                 # Backend Node.js server
├── public/                # Static files
├── src/                   # Source files
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers
│   ├── pages/             # Application pages
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── .env                  # Environment variables
├── package.json          # Project dependencies
└── README.md            # Project documentation
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Create React App](https://create-react-app.dev/)
- [Firebase](https://firebase.google.com/)
- [Material-UI](https://mui.com/)
- [React Tinder Card](https://github.com/3DJakob/react-tinder-card)

---

Made with ❤️ by [Your Name] | [![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2Fyourusername)](https://twitter.com/yourusername)
