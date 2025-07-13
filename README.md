# WanderLust_Online_Hotel_Booking

# 🌍 WanderLust

**WanderLust** is a full-stack Node.js application for listing and exploring travel destinations. It offers a simple interface for users to view and manage travel listings using an MVC architecture and MongoDB for persistent storage.

---

## 🚀 Features

* 🏞 Create, read, update, and delete travel listings
* 🔍 Search listings by location
* 📷 Add images to listings
* 🌐 Responsive UI with EJS templates

---

## 📁 Project Structure

```
Project WanderLust
├── app.js                # Main server file
├── package.json          # Project metadata & dependencies
├── init/                 # DB seeding scripts
├── models/               # Mongoose models
├── views/                # EJS templates
├── public/               # Static files (CSS, JS, images)
├── utils/                # Utility functions
└── .vscode/              # VS Code settings
```

---

## 🛠 Installation

1. **Clone the repo**

```bash
git clone https://github.com/yourusername/wanderlust.git
cd wanderlust
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment**
   Create a `.env` file and configure MongoDB URI and PORT:

```env
MONGODB_URI=mongodb://localhost:27017/wanderlust
PORT=3000
```

4. **Run seed script (optional)**

```bash
node init/index.js
```

5. **Start the server**

```bash
npm start
```

Visit: `http://localhost:3000`

---

## 🧱 Built With

* Node.js + Express
* MongoDB + Mongoose
* EJS for templating
* Bootstrap for styling

---

