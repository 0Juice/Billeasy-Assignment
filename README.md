# 📚 BookReview API

A RESTful API built with Node.js, Express, MongoDB, and JWT authentication for managing books, user reviews, and secure user accounts.

---

## 🚀 Features

- User authentication with JWT
- CRUD operations on books and reviews
- Input validation with Zod
- Search functionality with case-insensitive, partial matching
- Secure password storage with hashing
- Pagination support for large data sets

---

## 📁 Project Structure
```
project/
│
├── .env # Environment variables
├── .env.example # Sample environment config
├── package.json
├── index.js # Entry point
│
├── database/
│ └── index.js # MongoDB connection
│
├── middlewares/
│ ├── authentication.js
│ └── validation.js
│
├── routes/
│ ├── auth.js
│ ├── books.js
│ ├── reviews.js
│ └── search.js
│
└── schemas/
└── index.js # Zod schemas
```


---

## ⚙️ Project Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd project
   ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Configure environment variables**
    Create a .env file based on .env.example:
    ```env
    MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/book-reviews-app
    JWT_SECRET=your_jwt_secret_key
    EXPRESS_PORT=3000
    ```

4. **Start the server**
    ```bash
    node index.js
    ```

▶️ Run Locally
After completing the setup above, the server will start on:
http://localhost:3000 by default or if .env changed then at the changed PORT
You can test endpoints using Postman or curl.

**📬 Example API Requests**

**🧾 Signup**
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "email": "john@example.com", "password": "password123"}'
```

**🔐 Login**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "john@example.com", "password": "password123"}'
```

**📚 Add a Book (Authenticated)**
```bash
curl -X POST http://localhost:3000/books \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Atomic Habits",
    "author": "James Clear",
    "description": "Build good habits and break bad ones",
    "genre": "Self-help",
    "publicationDate": "2018-10-16",
    "imageLink": "https://image.url"
  }'
```

**🔍 Search Books**
```bash
curl "http://localhost:3000/search?q=habits"
```

**✍️ Submit a Review**
```bash
curl -X POST http://localhost:3000/books/<book_id>/reviews \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "comment": "Amazing book!"}'
```

**📐 Design Decisions**

**Authentication**: JWT stored in Authorization header using the Bearer schema.

**Password Security**: Passwords are hashed using bcrypt with 10 salt rounds.

**Validation**: All inputs are validated using Zod.

**Database**: MongoDB with Mongoose schemas for enforcing model consistency.

**Authorization**: Users can only review a book once and only modify/delete their own reviews.

**Pagination**: Supported on book listings and reviews to improve performance on large datasets.

**🔍 Assumptions**

**User Login**: Users can log in using either email or username.

**User Signup**: Requires both email and username.

**Book Creation**: Only authenticated users can create books.

**Book Fields**: Fields like description, author, genre, publicationDate, and imageLink are optional.

**Reviews**: Once per user per book. Users can update or delete only their own reviews.

**📦 Database Schema**
This API uses MongoDB with Mongoose for object modeling. Three main collections are used:

🧑‍💻 Users
| Field            | Type   | Required | Unique | Description                                 |
| ---------------- | ------ | -------- | ------ | ------------------------------------------- |
| `username`       | String | ✅        | ✅      | Used for login and identity                 |
| `email`          | String | ✅        | ✅      | Used for login and notifications            |
| `hashedPassword` | String | ✅        | ❌      | Password hash using bcrypt (10 salt rounds) |

📚 Books
| Field             | Type   | Required | Unique | Description                 |
| ----------------- | ------ | -------- | ------ | --------------------------- |
| `title`           | String | ✅        | ✅      | Main identifier of the book |
| `description`     | String | ❌        | ❌      | Brief summary               |
| `author`          | String | ❌        | ❌      | Author’s name               |
| `genre`           | String | ❌        | ❌      | Genre/category              |
| `publicationDate` | Date   | ❌        | ❌      | Optional ISO date           |
| `imageLink`       | String | ❌        | ❌      | URL to book cover           |

📝 Reviews
| Field     | Type     | Required | Description                               |
| --------- | -------- | -------- | ----------------------------------------- |
| `userId`  | ObjectId | ✅        | References the user who posted the review |
| `bookId`  | ObjectId | ✅        | References the reviewed book              |
| `rating`  | Number   | ✅        | Integer between 1–5                       |
| `content` | String   | ✅        | User's written review                     |

**🔐 Constraint**: A compound index ensures a user can only review a book once:
index({ userId: 1, bookId: 1 }, { unique: true })

**✅ Input Validation (Zod)**
All incoming requests are validated with Zod to ensure type safety and clean error handling.

**User Login (/login)**

- Must provide either username or email

- password must be at least 8 characters

**User Signup (/signup)**

- Requires: username, email, password (min 8)

**Book Creation**

- title (max 256 chars) required

- Optional: description (max 500), author, genre, publicationDate (ISO), imageLink (valid URL)

**Book Search**

- Must provide either title or author

- Case-insensitive partial match

**Review Creation**

- Requires rating (1–5), content (max 500)

- Validates userId and bookId as Mongoose ObjectId

## 📸 API Endpoint Examples

### 👤 POST `/signup` – Register a new user

#### Successful Signup of User
![Signup 1](./img/Signup%201.png)
#### Failed Signup of Existing User
![Signup 2](./img/Signup%202.png)
#### Failed Signup of User due to failing Password Validation(Minimum 8 Characters). NOTE: This is the only screenshot with Failed Validation checks. Additional screenshots have been omitted to avoid overwhelming the document with excessive images.
![Signup 3](./img/Signup%203.png)

---

### 🔑 POST `/login` – Authenticate and get JWT token

#### Successful Login of User
![Login 1](./img/Login%201.png)
#### Failed Login of Non-existing User  
![Login 2](./img/Login%202.png)
#### Failed Login of User due to Invalid Credentials
![Login 3](./img/Login%203.png)

---

### 🔐 POST `/books` – Add a new book (Authenticated users only)

#### Successfully Added Book
![Create Book 1](./img/Create%20Book%201.png)
#### Duplicate Book Addition Failed  
![Create Book 2](./img/Create%20Book%202.png)

---

### 📖 GET `/books` – Get all books (with pagination and optional filters)

#### Successful Find of Books with Default Page as 1 and Offset 10
![Get Books 1](./img/Get%20Books%201.png)  
#### Successful Find of Books with User Input Page and Offset
![Get Books 2](./img/Get%20Books%202.png)  
#### Successful Find of Books with User Input Page and Offset and Author Filtering (Can also filter based on Genre)
![Get Books 3](./img/Get%20Books%203.png)  
#### Failed find of book when out of bounds or no books to find
![Get Books 4](./img/Get%20Books%204.png)

---

### 📘 GET `/books/:id` – Get book details by ID

#### Successful Find of Book with Default Page as 1 and Offset 10 for Reviews
![Get Book 1](./img/Get%20Book%201.png)  
#### Successful Find of Book with User Input Page and Offset for Reviews
![Get Book 2](./img/Get%20Book%202.png)
#### Failed find of book when no book to find
![Get Book 3](./img/Get%20Book%203.png)

---

### ✍️ POST `/books/:id/reviews` – Submit a review

#### Successful Create of Review
![Create Review 1](./img/Create%20Review%201.png)  
#### Failed Create of Duplicate Review
![Create Review 2](./img/Create%20Review%202.png)

---

### 📝 PUT `/reviews/:id` – Update your own review

#### Successful Update of Review
![Update Review 1](./img/Update%20Review%201.png)
#### Failed Update of Non-existing Review
![Update Review 2](./img/Update%20Review%202.png)

---

### ❌ DELETE `/reviews/:id` – Delete your own review

#### Successful Delete of Review
![Delete Review 1](./img/Delete%20Review%201.png)
#### Failed Delete of Non-existing Review
![Delete Review 2](./img/Delete%20Review%202.png)

---

### 🔍 GET `/search` – Search books by title or author

#### Successful Search of Books with Partial and Case-Insensitive Search
![Search 1](./img/Search%201.png)  
#### Failed Search of Books when no Partial or Case-Insensitive Match Found
![Search 2](./img/Search%202.png)

---

### 📊 ER Diagram

![ER Diagram](./img/ER%20Diagram.png)
