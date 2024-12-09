# Twitter Clone

A simple Twitter-like application built with **Node.js**, **Express**, **MongoDB**, and **JWT** for authentication. This project allows users to register, log in, create, edit, delete tweets, and view tweets from other users.

---

## Features

- **User Authentication**: Secure registration and login using JWT.
- **Tweet Management**: Create, update, and delete tweets.
- **Public Tweets**: View tweets from all users without authentication.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/twitter-clone.git
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
   JWT_SECRET=your_secret_key
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

#### `POST /auth/register`
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

#### `POST /auth/login`
- **Description**: Logs in a user and returns a JWT.
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
      "token": "<jwt_token>",
      "message": "Login successful"
  }
  ```

---

### **Tweets**

#### `GET /tweets`
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

#### `POST /tweets`
- **Description**: Creates a new tweet (requires authentication).
- **Headers**:
  ```json
  {
      "Authorization": "Bearer <jwt_token>"
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

#### `PUT /tweets/:id`
- **Description**: Updates an existing tweet (requires authentication and ownership).
- **Headers**:
  ```json
  {
      "Authorization": "Bearer <jwt_token>"
  }
  ```
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

#### `DELETE /tweets/:id`
- **Description**: Deletes a tweet (requires authentication and ownership).
- **Headers**:
  ```json
  {
      "Authorization": "Bearer <jwt_token>"
  }
  ```
- **Response**:
  ```json
  {
      "message": "Tweet deleted successfully"
  }
  ```

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

