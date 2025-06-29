# WeatherProject
# WeatherCast

![WeatherCast Screenshot](https://github.com/your-username/your-repo-name/blob/main/path/to/your/screenshot.png?raw=true)
*Replace this placeholder image with an actual screenshot of your deployed app.*

## Project Name

**WeatherCast**

## Author

[Your Name/GitHub Username] (e.g., `John Doe` or `@johndoe`)

## Description of Project

WeatherCast is a modern, responsive web application designed to provide users with accurate and up-to-date weather information. It offers current weather conditions, a detailed 7-day forecast, and the ability to search for weather in any city worldwide. Users can also save their favorite locations for quick access, enhancing their ability to plan their day and travels effectively.

### Key Features:

* **Current Weather Display:** Shows real-time temperature, weather conditions (sunny, rainy, etc.), humidity, wind speed, and atmospheric pressure for a selected city or the user's current location.
* **City Search Functionality:** Allows users to search for weather conditions in any city across the globe.
* **7-Day Forecast:** Provides a detailed outlook for the next seven days, including high and low temperatures and weather conditions for each day.
* **Favorite Cities Management:** Users can add and remove cities from their favorites list, with persistence handled by `json-server`. Clicking on a favorited city instantly loads its weather.
* **Responsive User Interface:** Designed to work seamlessly across various devices, including mobile, tablet, and desktop.
* **Dynamic Weather Icons:** Visual cues representing different weather types for easy interpretation.
* **Dark/Light Mode Toggle:** A user-friendly switch to change between dark and light themes, with preference saved locally.
* **Single-Page Application (SPA):** All interactions occur on a single page without redirects, providing a smooth user experience.
* **Navigation Bar:** Quick links to jump between Current Weather, 7-Day Forecast, and Favorite Cities sections.

### User Stories

As a user, I can:

* See the current weather in my location so I can dress appropriately.
* Search the weather for different cities so I can check conditions before traveling.
* View the 7-day weather forecast so I can plan my week.
* See detailed weather data like humidity, wind speed, and pressure.
* Save and manage a list of my favorite cities so I can quickly access their weather.
* Toggle between dark and light modes for a personalized viewing experience.

## Project Setup Instructions

To get a local copy up and running, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```
    *(Replace `your-username/your-repo-name` with your actual GitHub repository details)*

2.  **Install `json-server` (if you haven't already):**
    `json-server` is used to simulate a backend API for persisting favorite cities.
    ```bash
    npm install -g json-server
    ```

3.  **Start `json-server`:**
    Navigate to the project's root directory in your terminal and run:
    ```bash
    json-server --watch db.json
    ```
    This will start the API server, usually accessible at `http://localhost:3000`. Ensure this server is running whenever you are using the application locally.

4.  **Open the application in your browser:**
    Simply open the `index.html` file located in the project's root directory using your preferred web browser.

    *Note: Some browsers might have security restrictions for `file://` URLs trying to fetch from `localhost`. If you encounter issues, consider using a simple local web server (e.g., Live Server VS Code extension) or ensure your browser allows these connections.*

## Live Site

You can view the live demo of WeatherCast deployed on GitHub Pages here:

[**Live Demo Link**](https://your-username.github.io/your-repo-name/)
*(Replace `https://your-username.github.io/your-repo-name/` with your actual GitHub Pages URL)*

## Public API Used

* **Open-Meteo API**: Used for fetching current, hourly, and daily weather forecast data, including temperature, conditions, humidity, wind speed, and atmospheric pressure.
    * API Documentation: [https://www.open-meteo.com/](https://www.open-meteo.com/)
    * Geocoding API (for city coordinates): [https://open-meteo.com/en/docs/geocoding-api](https://open-meteo.com/en/docs/geocoding-api)

* **`json-server`**: Used as a local mock API to manage and persist the user's list of favorite cities.

## Copyright and License Information

© 2025 [Your Name or Company Name]. All rights reserved.

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.