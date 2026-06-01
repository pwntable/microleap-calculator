# MicroLEAP Portfolio Tracker

A premium, client-side peer-to-peer (P2P) investment tracking and predictive simulation dashboard customized for the **MicroLEAP** platform. This application allows investors to easily monitor cashflows, manage note details, upload PDF term sheets for automated extraction, and project portfolio growth using dynamic parameters.

---

## 🌟 Key Features

- **Interactive Onboarding User Guide**: A beautiful, multi-step onboarding modal built directly into the UI that walks new users through automated PDF note parsing, growth compounding simulation, and PWA setup. Accessible anytime via the pulsing "User Guide" button in the header.
- **Automated PDF Parsing**: Drag and drop or upload MicroLEAP Investment Note PDFs to automatically extract the Note Reference/Title, Disbursed Date, Yield (Profit Rate), Tenure, Principal Amount, and Repayment Type (Monthly Amortized vs Bullet).
- **Portfolio Metrics Dashboard**: View lifetime investments, active capital, projected unlocked profit, net valuation (accounting for standard 1% investor fees), and weighted average portfolio yield.
- **Maturity Calendar**: Interactive monthly and yearly grouping of asset cashouts to help plan and anticipate liquidity.
- **Growth Projection Simulator**: A dynamic month-by-month forecasting engine to model future portfolio value based on monthly contributions, target yield rate, simulation duration, and reinvestment/compound interest modes.
- **Client-Side Privacy**: All operations are run securely in the browser. Financial note details are saved locally in the browser's `localStorage` and never sent to any external server.
- **Premium Aesthetics**: Features a modern, high-contrast dashboard with dark mode toggles, micro-animations, custom interactive SVG graphs, responsive sidebar layouts, and a clean, clutter-free P2P note management system.

---

## 📁 Project Structure

The project has been split into separate modular files for cleaner code organization and easier troubleshooting:

```
microleap/
├── index.html                   # Entry HTML skeleton importing stylesheets & React/Babel CDNs
├── styles.css                   # Custom stylesheets, range inputs, and pulse animations
├── app.jsx                      # React application code, state management, and PDF parsing engine
├── package.json                 # Project scripts and Vite dev dependency
├── README.md                    # Project documentation (this file)
└── microLEAP.pdf / microLEAP2.pdf # Sample investment notes for PDF extraction testing
```

---

## 🚀 Getting Started

### Prerequisites

To run the project locally, make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone or download this project folder.
2. Open a terminal and navigate to the project directory:
   ```bash
   cd /Users/mac/Downloads/microleap
   ```
3. Install the development server:
   ```bash
   npm install
   ```

### Running the Application

Start the local development server:

```bash
npm run dev
```

The application will be served at `http://localhost:5173`. Open this URL in your web browser to view the portfolio tracker.

---

## 📄 How to Use the PDF Uploader

1. Click the **Track Investment** button in the top right corner.
2. In the modal, you can drag and drop your MicroLEAP Investment Note PDF (e.g., `microLEAP.pdf` or `microLEAP2.pdf`) into the upload zone, or click to browse files.
3. The client-side parser will inspect the text, pull the target details (including the full note name such as `NT-2604-00012 - EPSB 31`), and populate the form fields automatically.
4. Verify the details and click **Track Asset Allocation** to add it to your portfolio tracker.
