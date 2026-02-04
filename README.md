# 📝 Task Tracker Pro

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/mongodb-active-green.svg)

**Task Tracker Pro** is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to help you manage your tasks efficiently. It features a clean, modern user interface and real-time alarm notifications to ensure you never miss a deadline.

---

## ✨ Features

- **✅ Task Management**: Create, Read, Update, and Delete (CRUD) tasks with ease.
- **⏰ Real-time Alarms**: Set due dates for your tasks and receive visual and audio alerts when they are due.
- **🎨 Modern UI**: Built with React and Tailwind CSS for a responsive and aesthetically pleasing experience.
- **🚀 RESTful API**: Robust backend API powered by Node.js and Express.

---

## 🛠️ Tech Stack

### Frontend

- **⚛️ React**: UI library for building interactive user interfaces.
- **⚡ Vite**: Next-generation frontend tooling for fast development.
- **🌬️ Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **📡 Axios**: Promise-based HTTP client for making API requests.

### Backend

- **🟢 Node.js**: JavaScript runtime environment.
- **🚂 Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **🍃 MongoDB**: NoSQL database for storing task data.
- **🔗 Mongoose**: Elegant mongodb object modeling for node.js.

---

## 🚀 Installation & Setup

Follow these instructions to set up the project locally.

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (Local instance or Atlas URI)

### 🔙 Backend Setup

1. **Navigate to the project root directory:**

    ```bash
    cd task-tracker-mern
    ```

2. **Install backend dependencies:**

    ```bash
    npm install
    ```

3. **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your MongoDB connection string and port:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    PORT=5000
    ```

4. **Start the backend server:**

    ```bash
    npm start
    # or for development with nodemon
    npm run dev
    ```

### 🖥️ Frontend Setup

1. **Navigate to the client directory:**

    ```bash
    cd client
    ```

2. **Install frontend dependencies:**

    ```bash
    npm install
    ```

3. **Configure Environment Variables (Optional):**
    Create a `.env` file in the `client` directory (defaults to localhost:5000):

    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

4. **Start the development server:**

    ```bash
    npm run dev
    ```

5. **Launch:** Open your browser and visit `http://localhost:5173` (or the port shown in your terminal).

---

## 📖 Usage

### Adding a Task

1. Enter a **Title** and **Description** for your task in the input fields.
2. Select a **Due Date and Time**.
3. Click the **"Add Task"** button.

### Managing Tasks

- **View**: All your tasks are listed below the form, sorted by due date.
- **Edit**: Click the **Edit** button on a task card to modify its details.
- **Delete**: Click the **Delete** button to remove a task permanently.

### 🔔 Alarms

- When a task's due date arrives, an **Alarm Popup** will appear on the screen.
- An audio alert will play to notify you.
- You can **Snooze** or **Dismiss** the alarm from the popup.

---

## 🔌 API Documentation

The backend exposes the following RESTful endpoints at `/api/tasks`:

| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Retrieve all tasks | N/A |
| `POST` | `/api/tasks` | Create a new task | `{ "title": "...", "description": "...", "dueDate": "..." }` |
| `PUT` | `/api/tasks/:id` | Update a task | `{ "title": "...", ... }` |
| `DELETE` | `/api/tasks/:id` | Delete a task | N/A |

---

## 📄 License

This project is licensed under the ISC License.

## 📚 Documentation

Detailed documentation and setup guides can be found in the [docs](./docs) folder.
