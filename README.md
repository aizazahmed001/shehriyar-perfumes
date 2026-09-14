<div align="center">

# 🖤 SHEHRIYAR PERFUME

  <p>
    <strong>A high-end, minimalist monochrome e-commerce platform for premium perfumes.</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>

  <p>
    <a href="#-design-philosophy">Design</a> •
    <a href="#-technology-stack">Tech Stack</a> •
    <a href="#-features">Features</a> •
    <a href="#-installation--setup">Installation</a> •
    <a href="#-admin-credentials">Credentials</a>
  </p>
</div>

---

## 💎 Design Philosophy

Shehriyar Perfume isn't just an online store; it's a premium fragrance experience. The application is designed with a strong focus on:

* **Luxury Aesthetic**: A high-contrast, black-and-white visual identity inspired by premium fragrance brands and editorial design.
* **Elegant Typography**: Serif headings and minimalist sans-serif labels create a sophisticated visual hierarchy.
* **Seamless Interaction**: Glassmorphism navigation, balanced spacing, and subtle micro-animations provide a premium shopping experience.

---

## 🚀 Technology Stack

### 🖥️ Frontend

* **React.js**: Modern component-based architecture for a dynamic user interface.
* **Tailwind CSS**: Utility-first styling with a customized design system.
* **Lucide React**: Minimalist and consistent iconography.
* **Vite**: Fast development and build environment.

### ⚙️ Backend

* **Node.js & Express**: Scalable server-side RESTful API.
* **MongoDB**: NoSQL database for product and order management.
* **Socket.io**: Real-time order processing and status synchronization.

---

## ✨ Features

### 🛍️ Customer Experience

* **Perfume Collection**: Elegant shop interface with filtering and browsing options.
* **Detailed Product Profiles**: Product information, fragrance descriptions, specifications, and pricing.
* **Secure Checkout**: Streamlined shopping cart and checkout experience.
* **Order Tracking**: Real-time order status and logistical information through the customer dashboard.

### 🛡️ Admin Control Panel

* **Inventory Management**: Complete control over products, stock, and product information.
* **Order Management**: Monitor and process customer orders in real time using Socket.io.
* **Analytics Dashboard**: Overview of store performance and order-related metrics.

---

## 🛠️ Installation & Setup

### 1. Requirements

Before you begin, ensure you have the following installed:

* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* [MongoDB](https://www.mongodb.com/) (Running locally or via Atlas)
* [Git](https://git-scm.com/)

### 2. Clone the Repository

```bash
git clone https://github.com/mitulaghara/perfume-store-using-mernstack.git
cd perfume-store-using-mernstack
```

### 3. Configure MongoDB

Create `server/.env` with a MongoDB connection string:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/perfume-store?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
PORT=5001
```

For MongoDB Atlas, create a free cluster, create a database user, add your current IP in **Network Access**, then copy the URI from **Connect > Drivers**. Replace `<username>` and `<password>` with the database user credentials.

Keep `server/.env` private; it is ignored by Git.

For a local MongoDB installation, use:

```env
MONGO_URI=mongodb://127.0.0.1:27017/perfume-store
```

Start the MongoDB service before running the application.

### 4. Install Dependencies

Install dependencies for both the client and server.

**Client Setup:**

```bash
cd client
npm install
```

**Server Setup:**

```bash
cd ../server
npm install
```

---

## 🏃‍♂️ Running the Application

To run the application locally, you will need two terminal windows/tabs.

### 1. Start the Backend Server

```bash
cd server
npm start
```

### 2. Start the Frontend Client

```bash
cd client
npm run dev
```

---

## 🔐 Admin Credentials

Access the **Admin Control Panel** using the following credentials:

> **Email:** `admin@gmail.com`
> **Password:** `admin123`

---

## 📄 Licensing

**Exclusive Distribution** for the Shehriyar Perfume brand. All rights reserved.

<br>

<div align="center">
  <p><i>Built with passion for elegant code & beautiful design.</i></p>
</div>
