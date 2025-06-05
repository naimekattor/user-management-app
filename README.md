# 🛡️ User Management System — Next.js, MongoDB Atlas, JWT Authentication

A **secure, scalable, and production-ready user management system** built using **Next.js**, **MongoDB Atlas**, **Mongoose**, and **JWT Authentication**. Designed with best practices for modern web applications, this system offers robust user management capabilities with a clean and responsive UI.

---

## 🚀 Key Features

- 🔐 **Secure User Authentication**

  - Password hashing using **bcrypt**
  - **JWT-based session management** for authentication and route protection

- 📧 **Database-Level Unique Email Enforcement**

  - Duplicate check handled via **MongoDB indices**, not manually
  - Automatic `11000` error catch with meaningful frontend feedback

- 🛠️ **Admin Dashboard (Protected)**

  - Fully protected with JWT
  - Features **user listing**, **multi-select**, **block/unblock**, and **deletion**
  - Intelligent UI with human-readable timestamps

- 🕒 **Friendly Time Stamps**

  - Shows `lastLogin` like:
    - `less than a minute ago`
    - `2 hours ago`
    - `5 months ago`

- ☁️ **Cloud-native Storage**
  - Uses **MongoDB Atlas**
  - Includes **visible indexes** for consistency and performance

---

## 🧱 Tech Stack

| Technology        | Purpose                         |
| ----------------- | ------------------------------- |
| **Next.js**       | Full-stack React framework      |
| **MongoDB Atlas** | Cloud-hosted NoSQL database     |
| **Mongoose**      | MongoDB object modeling (ODM)   |
| **JWT**           | Stateless authentication        |
| **bcryptjs**      | Secure password hashing         |
| **Tailwind CSS**  | Utility-first styling           |
| **React Icons**   | Icon library for UI enhancement |
| **date-fns**      | Date formatting utilities       |

---

## ⚙️ User Registration

- Emails and passwords are validated.
- Passwords are securely hashed using `bcrypt` before being stored in the database.
- Email uniqueness is strictly enforced by MongoDB’s index:

```ts
email: {
  type: String,
  required: true,
  unique: true, // ✅ Index-enforced constraint
  lowercase: true,
  trim: true,
}
```

### 📌 Index Verification

MongoDB automatically creates the following indexes:

```js
db.users.getIndexes();
```

**Output:**

```js
[
  { key: { _id: 1 }, name: "_id_" },
  { key: { email: 1 }, name: "email_1", unique: true },
];
```

✅ You can visually verify this in **MongoDB Atlas** under your cluster’s **Indexes** tab.

---

## ❌ Duplicate Email Handling

- On email conflict, MongoDB throws error **`11000`**.
- The backend catches the error and returns **HTTP 409 Conflict**.

```ts
if (error.code === 11000 && error.keyPattern?.email) {
  return res.status(409).json({ message: "Email already exists" });
}
```

- The frontend captures and displays user-friendly feedback:

```js
if (!res.ok) {
  alert(data.message); // "Email already exists"
}
```

No manual `findOne()` call is used — the solution purely relies on the database's index constraint.

---

## 🛡️ Admin Dashboard

A **JWT-protected dashboard** that allows administrators to efficiently manage users.

### 🔧 Features:

- ✅ Responsive, sortable user table
- ✅ Multi-select users
- 🔒 Block / Unblock actions
- 🗑️ Delete users
- 🕒 See **last login** in readable format

---

## 📦 Setup Instructions

### 1. Clone & Install

```sh
git clone https://github.com/naimekattor/user-management-app.git
cd user-management-app
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydb
JWT_SECRET=your_jwt_secret
```

### 3. Run the Project Locally

```sh
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🎬 Demo Checklist (Required for Evaluation)

✅ Show unique `email_1` index in MongoDB Atlas  
✅ Attempt registration with duplicate email to trigger `409 Conflict`  
✅ Confirm backend catch of `11000` error code  
✅ Show frontend alert: _"Email already exists"_  
✅ Demonstrate DB-index constraint (no manual lookup)  
✅ Show `lastLogin` in human-readable form via UI

---

## 🔮 Future Improvements

- [ ] Role-based access control (Admin/User)
- [ ] User pagination, search, and filtering
- [ ] Email verification & forgot/reset password
- [ ] Export to CSV functionality
- [ ] Real-time updates with WebSockets

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙋‍♂️ Author

**Naim Hossen**  
Frontend Developer | React | Tailwind | Next.js  
[Portfolio](#) (Insert Link)

---

Would you like this formatted for Markdown (README.md), converted to PDF, or to include GitHub badges/screenshots? Let me know!
