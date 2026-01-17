# Tunisia Nightlife Heat Map 🇹🇳

A dynamic, interactive heatmap visualizing nightlife activity across Tunisia's governorates. This application aggregates event data from various platforms and community suggestions to provide a real-time "activity score" for each region.

![Tunisia Nightlife Heat Map Banner](public/globe.svg) *Note: Replace with actual screenshot*

## 🚀 Features

*   **Interactive Heatmap**: Visualizes nightlife intensity by region (Low, Medium, High, Very High) using color-coded overlays.
*   **Region Details**: Click on any governorate to see specific activity scores, event counts, and a list of upcoming events.
*   **Real-time Event Data**: Powered by a backend scraper that collects event information from major nightlife platforms.
*   **Community Driven**: Registered users can suggest new events to be added to the map.
*   **User Authentication**: Secure login and registration system for community features.
*   **Responsive Design**: Optimized for both desktop and mobile viewing with a modern UI built on Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Maps**: [React Leaflet](https://react-leaflet.js.org/) & [Leaflet](https://leafletjs.com/)
*   **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)

### Backend (Integrated)
*   **API**: Flask (Python)
*   **Data Processing**: Custom event scrapers
*   **Database**: SQLite / CSV storage

## 📦 Getting Started

### Prerequisites
*   Node.js 18+ installed
*   Backend API running (see Backend documentation)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/tn-bynight.git
    cd tn-bynight
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Configure Environment Variables:
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```
    *Adjust the URL to match your Flask backend address.*

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗺️ How It Works

1.  **Data Collection**: The backend scrapes event data from social media and ticketing platforms.
2.  **Scoring**: Regions are assigned an "activity score" based on the volume and type of events.
3.  **Visualization**: The frontend fetches this data and renders the heatmap using GeoJSON for Tunisia's governorates.
4.  **Interaction**: Users interact with the map to discover events or contribute data.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
