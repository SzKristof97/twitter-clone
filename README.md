# Twitter Clone

A simple Twitter-like application built with **Node.js**, **Express**, **MongoDB**, and **Express-Session** for authentication. This project allows users to register, log in, create, edit, delete tweets, view tweets from other users, and share tweets via a modern interface.

---

## Features

- **User Authentication**: Secure registration and login using sessions.
- **Tweet Management**: Create, update, and delete tweets.
- **Public Tweets**: View tweets from all users without authentication.
- **Modern UI**: Share tweets with a dynamic, user-friendly interface.
- **Session Handling**: "Share Your Tweet" section and protected routes only accessible to logged-in users.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/SzKristof97/twitter-clone.git
cd twitter-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

1. Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```
2. Add the following variables to the `.env` file:
   ```plaintext
   PORT=3000
   SESSION_SECRET=your_secret_key
   MONGO_URI=mongodb://localhost:27017/twitter_clone
   MONGO_URI_TEST=mongodb://localhost:27017/twitter_clone_test
   ```

### 4. Start the Application

- **Development Mode**:
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

---

## Database

This project uses **MongoDB** as the database. Ensure MongoDB is installed and running on your system or use a cloud-based MongoDB instance (e.g., MongoDB Atlas).

---

## API Endpoints

### **Authentication**

#### `POST /api/auth/register`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
      "name": "John Doe",
      "email": "johndoe@example.com",
      "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
      "message": "User registered successfully"
  }
  ```

#### `POST /api/auth/login`
- **Description**: Logs in a user and starts a session.
- **Request Body**:
  ```json
  {
      "email": "johndoe@example.com",
      "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
      "message": "Login successful"
  }
  ```

#### `POST /api/auth/logout`
- **Description**: Logs out a user and destroys the session.
- **Response**:
  ```json
  {
      "message": "Logged out successfully"
  }
  ```

---

### **Tweets**

#### `GET /api/tweets`
- **Description**: Fetches all tweets from all users.
- **Response**:
  ```json
  {
      "tweets": [
          {
              "_id": "tweet_id",
              "content": "This is a tweet",
              "userId": {
                  "_id": "user_id",
                  "name": "John Doe",
                  "email": "johndoe@example.com"
              },
              "createdAt": "timestamp"
          }
      ]
  }
  ```

#### `POST /api/tweets`
- **Description**: Creates a new tweet (requires authentication).
- **Headers**:
  ```json
  {
      "Authorization": "Session-Based Authentication"
  }
  ```
- **Request Body**:
  ```json
  {
      "content": "This is my new tweet"
  }
  ```
- **Response**:
  ```json
  {
      "message": "Tweet created successfully",
      "tweet": {
          "_id": "tweet_id",
          "content": "This is my new tweet",
          "userId": "user_id",
          "createdAt": "timestamp"
      }
  }
  ```

#### `PUT /api/tweets/:id`
- **Description**: Updates an existing tweet (requires authentication and ownership).
- **Request Body**:
  ```json
  {
      "content": "Updated tweet content"
  }
  ```
- **Response**:
  ```json
  {
      "message": "Tweet updated successfully",
      "tweet": {
          "_id": "tweet_id",
          "content": "Updated tweet content",
          "userId": "user_id",
          "createdAt": "timestamp"
      }
  }
  ```

#### `DELETE /api/tweets/:id`
- **Description**: Deletes a tweet (requires authentication and ownership).
- **Response**:
  ```json
  {
      "message": "Tweet deleted successfully"
  }
  ```

#### `POST /api/tweets/:id/like`
- **Description**: Likes a tweet (requires authentication).
- **Response**:
  ```json
  {
      "like": 10
  }
  ```

#### `POST /api/tweets/:id/dislike`
- **Description**: Dislikes a tweet (requires authentication).
- **Response**:
  ```json
  {
      "dislike": 5
  }
  ```

---

## UI Features

### **Share Your Tweet Section**
- **Visible only to logged-in users.**
- Allows users to write and submit tweets via a form.
- Dynamically updates the tweets section after submission.

---

## Testing

### Run Tests
1. Ensure you have set up the test database in `.env`:
   ```plaintext
   MONGO_URI_TEST=mongodb://localhost:27017/twitter_clone_test
   ```
2. Run the tests:
   ```bash
   npm test
   ```

---

## Notes

- Replace `your_secret_key` in the `.env` file with a strong, secure key.
- Ensure MongoDB is running before starting the application.
- Use Postman or a similar tool to test the API endpoints.

