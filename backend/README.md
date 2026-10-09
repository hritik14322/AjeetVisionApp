# New Ajeet Vision - Backend API

This is the Node.js/Express REST API for the New Ajeet Vision application. It handles authentication (via Firebase OTP), secure purchasing, loyalty points, Razorpay VIP memberships, and the ₹1,00,000 reward system.

## 🚀 Tech Stack
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (Database)
- **Firebase Admin SDK** (For secure OTP verification)
- **Razorpay** (Payment Gateway for VIP Memberships)
- **JWT** (Session Management via HttpOnly Cookies)

## 📁 Project Structure
- `/config` - Database and Firebase configurations.
- `/controllers` - Core business logic for endpoints.
- `/middlewares` - Authentication, Role validation, and Error handling.
- `/models` - Mongoose database schemas.
- `/routes` - Express route definitions.

## ⚙️ Environment Variables (.env)
Before running the project, ensure your `.env` file contains the following valid credentials:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/new-ajeet-vision
JWT_SECRET=your_jwt_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## 🛠️ Scripts
- `npm run dev`: Starts the server in development mode using nodemon.
- `npm start`: Starts the server in production mode.

## 🔗 Key API Modules
1. **Auth** (`/api/auth`): Firebase token verification and session management.
2. **Users** (`/api/users`): Customer profile retrieval and updates.
3. **Purchases** (`/api/purchases`): Secure invoice generation. Automatically updates reward progress and writes to the loyalty ledger.
4. **Loyalty** (`/api/loyalty`): Immutable points ledger and card assignments.
5. **VIP** (`/api/vip`): Razorpay order creation and cryptographic payment verification.
6. **Rewards** (`/api/rewards`): Secure, server-side verified reward claims.
