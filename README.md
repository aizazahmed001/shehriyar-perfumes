<div align="center">
  
  # 🖤 LUXE Fragrance Boutique

  <p>
    <strong>A high-end, minimalist monochrome e-commerce platform for curated perfume fragments.</strong>
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

Luxe Fragrance Boutique isn't just a store; it's an experience. We built this application with a heavy focus on:

- **Boutique Aesthetic**: A high-contrast, black-and-white visual identity inspired by luxury editorial design.
- **Editorial Typography**: Utilizing serif headers (`Playfair Display`) and minimalist tracking-heavy sans-serif labels (`Inter`).
- **Seamless Interaction**: Glassmorphism navigation, balanced spacing, and subtle micro-animations for a premium feel.

---

## 🚀 Technology Stack

### 🖥️ Frontend
- **React.js**: Modern component-based architecture for dynamic UI.
- **Tailwind CSS**: Custom utility-first styling with a bespoke design system.
- **Lucide React**: Minimalist, perfectly weighted iconography.
- **Vite**: Ultra-fast development and build environment.

### ⚙️ Backend
- **Node.js & Express**: Scalable server-side RESTful API.
- **MongoDB**: Flexible NoSQL database for product and order management.
- **Socket.io**: Real-time order processing and status synchronization.

---

## ✨ Features

### 🛍️ Client Experience
- **Curated Archive**: Minimalist shop interface with advanced filtering options.
- **Detailed Profiles**: In-depth fragment specifications and olfactory descriptions.
- **Secure Checkout**: Streamlined cart and membership management.
- **Order Manifests**: Real-time tracking and logistical information right to your dashboard.

### 🛡️ Admin Control Terminal
- **Inventory Oversight**: Complete control over product archiving, deployment, and stock.
- **Order Command**: Real-time manifest monitoring and status processing via Socket.io.
- **Analytical Dashboard**: Overview of boutique performance metrics at a glance.

---

## 🛠️ Installation & Setup

### 1. Requirements 
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (Running locally or via Atlas)
- [Git](https://git-scm.com/)

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

For MongoDB Atlas, create a free cluster, create a database user, add your current IP in **Network Access**, then copy the URI from **Connect > Drivers**. Replace `<username>` and `<password>` with the database user credentials. Keep `server/.env` private; it is ignored by Git.

For a local MongoDB installation, use `MONGO_URI=mongodb://127.0.0.1:27017/perfume-store` and start the MongoDB service first.

### 4. Install Dependencies
You need to install dependencies for the client, and server.

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

**1. Start the Backend Server**
```bash
cd server
npm start
```

**2. Start the Frontend Client**
```bash
cd client
npm run dev
```

---

## 🔐 Admin Credentials

Access the **Admin Terminal** using the following credentials:
> **Email:** `admin@gmail.com`
> **Password:** `admin123`

---

## 📄 Licensing

**Exclusive Distribution** for the Luxe Fragrance Boutique brand. All rights reserved.

<br>
<div align="center">
  <p><i>Built with passion for elegant code & beautiful design.</i></p>
</div>
