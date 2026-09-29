# Mohammad Sheraz — Senior Flutter Developer Portfolio

An interactive, responsive portfolio and resume web application showcasing cross-platform mobile apps, architectural expertise, and engineering projects built with Flutter & Dart.

![Portfolio Banner](assets/images/portfolio-optimized.jpg)

---

## 🌟 Highlights & Features

- **Interactive 3D Experience**: Dynamic interactive 3D smartphone model powered by [Three.js](https://threejs.org/) with orbit controls and fallback rendering.
- **Dual-View Resume**: Switch seamlessly between a clean ATS-friendly printable document view and a high-resolution visual layout.
- **Project Deep Dives**: Showcase cards detailing production Flutter apps, state management solutions (Bloc, Provider, Riverpod), architecture, and live links.
- **Performance & SEO Optimized**: Meta tags, OpenGraph social cards, structured JSON-LD data, and clean responsive CSS.
- **Zero-Dependency Dev Server**: Built-in lightweight Node.js static file server for local preview and debugging.

---

## 📁 Project Structure

```text
Resume/
├── .vscode/
│   └── launch.json             # Chrome debugger configuration
├── assets/
│   ├── css/
│   │   └── style.css           # Core styling, responsive typography & animations
│   ├── images/
│   │   ├── hero-3d-phone.jpg   # 3D fallback and showcase graphic
│   │   ├── portfolio-optimized.jpg # Social preview / OG card image
│   │   ├── resume-preview.png  # Resume visual document preview
│   │   ├── sheraz-portrait.jpg # Profile headshot
│   │   └── Gemini_Generated_Image_xliyayxliyayxliy.jpg # Concept mockup
│   └── js/
│       ├── main.js             # Portfolio interactions, 3D viewport, navigation
│       └── resume-data.js      # Structured CV data and print controller
├── index.html                  # Main portfolio landing page
├── project.html                # Project detail & case study showcase
├── resume.html                 # Interactive online CV & PDF export view
├── server.js                   # Lightweight zero-dependency HTTP server
├── package.json                # Project scripts and metadata
├── .gitignore                  # Git ignore rules
└── README.md                   # Repository documentation
```

---

## 🚀 Quick Start & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later) installed, or any static HTTP file server.

### 1. Run with Node.js
```bash
# Clone the repository
git clone https://github.com/Mian-Sheraz/Flutter-Portfolio.git
cd Flutter-Portfolio

# Start the local development server
npm start
```
The server will start and listen on:
- [http://localhost:8080](http://localhost:8080)
- [http://localhost:3000](http://localhost:3000)

### 2. Run with VS Code Debugger
Open the project in VS Code and press **F5** (or use the *Launch Chrome against localhost* configuration in `.vscode/launch.json`).

### 3. Open directly in Browser
You can also open `index.html` directly in any modern web browser.

---

## 🛠️ Built With

- **HTML5 & Vanilla CSS3**: Custom design system, CSS variables, flexbox/grid layout, and CSS keyframe animations.
- **Vanilla JavaScript**: Lightweight, performant DOM handling and view management.
- **Three.js**: WebGL rendering for 3D smartphone model presentation.
- **Node.js**: Embedded static server for instant local deployment.

---

## 👤 Author

**Mohammad Sheraz**
- **Title**: Senior Flutter Developer · Cross-Platform Engineer
- **GitHub**: [@Mian-Sheraz](https://github.com/Mian-Sheraz)
- **Email**: [miansheraz8448@gmail.com](mailto:miansheraz8448@gmail.com)
- **Location**: Faisalabad, Pakistan

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
