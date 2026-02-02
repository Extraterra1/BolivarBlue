# 🇻🇪 BolivarBlue

**BolivarBlue** is a modern, high-performance Progressive Web App (PWA) designed to provide real-time exchange rates for the Venezuelan Bolívar (VES). It features a sleek, responsive interface with support for multiple exchange sources, currency conversion, and offline capabilities.

[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![HeroUI](https://img.shields.io/badge/HeroUI-%23000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://heroui.com/)

---

## ✨ Features

- 🚀 **Real-time Rates**: Fetches official BCV (Central Bank of Venezuela) and Binance P2P rates.
- 📱 **Progressive Web App (PWA)**: Installable on mobile and desktop devices for a native-like experience.
- 🌍 **Multi-language Support**: Fully localized in **Spanish** and **English**.
- 🌓 **Dynamic Theming**: Seamless switching between **Light** and **Dark** modes.
- 🧮 **Currency Converter**: Built-in calculator to convert between USD, EUR, and Bs. (BCV/Binance).
- 📶 **Offline Compatibility**: Works without an internet connection using cached data.
- 🎨 **Premium UI**: Crafted with HeroUI (formerly NextUI) and Framer Motion for smooth animations and transitions.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **UI Components**: [HeroUI](https://heroui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- **API**: Axios with Vercel Serverless Functions (for scraping)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Extraterra1/BolivarBlue.git
   cd venezuela-rates-app
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

## 📁 Project Structure

```
├── api/                # Serverless functions (scrapers)
├── public/             # Static assets (logos, icons)
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # Theme and Language contexts
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   ├── utils/          # Formatting and translation helpers
│   ├── App.jsx         # Main application logic
│   └── main.jsx        # Entry point
├── tailwind.config.js  # Tailwind configuration
└── vite.config.js      # Vite & PWA configuration
```

## 🌐 Deployment

The app is optimized for deployment on **Vercel**, utilizing its Serverless Functions to handle API requests and scraping logic securely.

## 📄 License

This project is private and intended for personal use.

---

Made with ❤️ for Venezuela 🇻🇪
