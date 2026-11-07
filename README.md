# HB+ – Cross-Platform Authentication App

A responsive authentication application built using React Native, React Native Web, Expo and Firebase Authentication.

## Project Overview

HB+ is an authentication-based application designed to provide secure access to authorized users through Google OAuth 2.0.

Only users with an official `@hbplus.fit` email address are allowed to access the application.

## Features

- Google OAuth 2.0 authentication
- Official email domain validation (`@hbplus.fit`)
- Firebase Authentication integration
- Persistent login session
- Protected dashboard access
- User account information
- Logout functionality
- Loading indicators
- Error handling
- Responsive user interface
- Cross-platform project structure using React Native and Expo

## Technology Stack

| Technology | Purpose |
|---|---|
| React Native | UI development |
| React Native Web | Web compatibility |
| Expo | Development environment |
| JavaScript | Application logic |
| Firebase Authentication | Google authentication |
| Google OAuth 2.0 | User sign-in |
| Git & GitHub | Version control |

## Project Structure

```text
hbplus-assessment/
│
├── assets/
│   ├── icon.png
│   ├── splash-icon.png
│   └── favicon.png
│
├── src/
│   └── firebase.js
│
├── App.js
├── app.json
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/ajay1223tiwari/hbplus-assessment.git
```

### 2. Navigate to the project directory

```bash
cd hbplus-assessment
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure Firebase

- Create a Firebase project.
- Register a Firebase Web App.
- Enable Google Authentication in Firebase Console.
- Add the required authorized domains.
- Configure Firebase credentials in `src/firebase.js`.

### 5. Start the application

For web development:

```bash
npx expo start --web
```

For Expo development:

```bash
npx expo start
```

## Authentication Flow

1. User enters an email address.
2. Application validates the email domain.
3. User signs in through Google.
4. Firebase authenticates the Google account.
5. The authenticated email is verified again.
6. Authorized users can access the dashboard.
7. Unauthorized users are denied access.
8. Firebase maintains the authentication session.
9. Users can securely sign out.

## Email Access Policy

Only email addresses ending with:

```text
@hbplus.fit
```

are authorized for application access.

## Responsive Design

The interface is designed to adapt to different screen sizes, including:

- Desktop and laptop screens
- Tablet screens
- Mobile screens

## Future Improvements

- Native Android and iOS Google authentication
- Backend-side authorization
- Admin and User role management
- Database integration
- Enhanced dashboard functionality

## Developer

**Ajay Tiwari**




