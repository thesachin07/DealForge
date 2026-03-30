# DealCraft - AI Negotiation Arena

An interactive negotiation game where players try to outsmart an AI seller (powered by Mistral) to secure the lowest possible price on a premium product. Features user authentication, global leaderboard, and ranking system.

## Project Structure

```
dealcraft/
├── frontend/                          # React + Vite frontend
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── ChatArea.jsx          # Chat message display with auto-scroll
│   │   │   ├── ProductCard.jsx       # Product info and pricing display
│   │   │   ├── TacticsBar.jsx        # Negotiation tactics buttons
│   │   │   ├── DealScreen.jsx        # Deal completion screen
│   │   │   ├── Leaderboard.jsx       # Global leaderboard with rank tiers
│   │   │   ├── NameInputScreen.jsx   # Player name input for leaderboard
│   │   │   └── StartScreen.jsx       # Game intro screen
│   │   ├── constants/                # Constants and configurations
│   │   │   ├── product.js            # PRODUCT object, TACTICS array
│   │   │   └── ranks.js              # getRank(), RANK_TIERS config
│   │   ├── services/                 # API and external service calls
│   │   │   ├── mistralApi.js         # callMistral(), SELLER_SYSTEM prompt
│   │   │   └── leaderboard.js        # loadLeaderboard(), saveToLeaderboard()
│   │   ├── styles/                   # CSS styling
│   │   │   └── game.css              # All game styling
│   │   ├── utils/                    # Utility functions
│   │   │   └── negotiation.js        # parseDeal(), cleanMessage(), extractPrice()
│   │   ├── App.jsx                   # Main app component with state & routing
│   │   └── main.jsx                  # React entry point
│   ├── index.html                    # HTML template
│   ├── package.json                  # Frontend dependencies
│   └── vite.config.js                # Vite configuration
│
├── backend/                          # Express + MongoDB backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── leaderboard.js        # GET/POST /leaderboard endpoints
│   │   │   └── negotiate.js          # POST /negotiate proxy to Mistral API
│   │   ├── models/
│   │   │   └── Score.js              # Mongoose schema (name, price, rounds, rank)
│   │   ├── middleware/
│   │   │   └── rateLimit.js          # Express rate limiting config
│   │   └── server.js                 # Express app setup, MongoDB connection
│   ├── .env                          # Environment variables
│   └── package.json                  # Backend dependencies
│
└── README.md                         # This file
```

## Features

### Frontend
- **User Authentication**: Register and login with username, email, and password
- **Interactive Chat Interface**: Real-time negotiation with Mistral AI seller
- **Tactical Buttons**: Quick-apply negotiation tactics (competitor pricing, bulk order, reviews, etc.)
- **Live Price Tracking**: See current offer, savings, and discount percentage
- **Global Leaderboard**: Track top 50 deals with ranking tiers (Legendary, Elite, Expert, etc.)
- **Personal Score History**: View your best negotiation deals
- **Dark Theme UI**: Modern, responsive design with glassmorphism effects
- **Game States**: Auth → Start → Playing → Done

### Backend
- **RESTful API**: Endpoints for leaderboard management and negotiation
### Backend
- **User Authentication**: JWT-based registration and login system
- **MongoDB Integration**: Persistent user and score storage
- **Rate Limiting**: Protect API from abuse
- **Mistral API Proxy**: Secure negotiation endpoint
- **Password Security**: bcrypt hashing for user passwords

### Game Mechanics
- **8-Round Limit**: Players have up to 8 rounds to close a deal
- **AI Seller Personality**: ARIA (AI sales agent) with dynamic pricing strategy
- **Rank Tiers**: 6-tier ranking system based on final negotiated price
- **Deal Validation**: Confirms deal with `DEAL_CONFIRMED:$[price]` protocol

---

## Setup & Installation

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   MISTRAL_API_KEY=your_mistral_api_key
   MONGO_URI=mongodb://localhost:27017/dealcraft
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

4. Start the server:
   ```bash
   npm start
   ```

   Or with nodemon for development:
   ```bash
   npm run dev
   ```

---

## API Endpoints

### Authentication

- **POST /api/auth/register**
  - Register a new user
  - Body: `{ username, email, password }`
  - Response: `{ token, user: { id, username, email } }`

- **POST /api/auth/login**
  - Login user
  - Body: `{ email, password }`
  - Response: `{ token, user: { id, username, email } }`

- **GET /api/auth/me**
  - Get current user info (requires auth)
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ user: { id, username, email } }`

### Leaderboard

- **GET /api/leaderboard**
  - Retrieve top 50 scores sorted by price (lowest first)
  - Response: Array of score objects

- **POST /api/leaderboard**
  - Save a new score (requires auth)
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ name, price, savings, rounds, rank }`
  - Response: Updated leaderboard

- **GET /api/leaderboard/user**
  - Get user's personal scores (requires auth)
  - Headers: `Authorization: Bearer {token}`
  - Response: Array of user's score objects

### Negotiation

- **POST /api/negotiate**
  - Proxy negotiation request to Mistral API
  - Body: `{ messages: [...] }`
  - Response: Mistral API response

### Health Check

- **GET /api/health**
  - Simple health check endpoint
  - Response: `{ status: "ok" }`

---

## Game Rules

1. **Starting Price**: $599 (list price for AXIOM X1 Smartwatch)
2. **Minimum Price**: $189 (AI seller's absolute floor)
3. **Target Price**: $519 (AI seller's ideal price)
4. **Max Rounds**: 8 rounds of negotiation
5. **Deal Confirmation**: AI seller confirms with "DEAL_CONFIRMED:$[price]"
6. **Rank Tiers**:
   - 👑 LEGENDARY: ≤ $200
   - 💎 ELITE: $201–$250
   - 🔷 EXPERT: $251–$300
   - ⚡ SKILLED: $301–$350
   - 📊 AVERAGE: $351–$420
   - 🌱 ROOKIE: > $420

---

## Technologies Used

## Technologies Used

- **Frontend**: React 18, Vite, CSS3
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **AI**: Mistral AI API (Large model)
- **Security**: Express rate limiting, CORS, JWT authentication
- **Storage**: MongoDB for persistent users and leaderboard

---

## Future Enhancements

- [ ] WebSocket support for real-time multiplayer
- [ ] Different product categories
- [ ] Player profiles and statistics
- [ ] Achievement badges
- [ ] Replay game history
- [ ] A/B testing different AI personalities
- [ ] Seasonal leaderboards

---

## License

MIT License - Feel free to use and modify!
