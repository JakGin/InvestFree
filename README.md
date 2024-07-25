# InvestFree

## Invest in market stocks for free in a real world simulation

# Overview

This project is a stock investing simulator where you start with $1,000,000 and can buy and sell shares of popular American stocks such as NVDA, TSLA, AMZN, and AAPL. The stock prices are synced with real-time market data. You can track your profit and compare it with others, competing to become the best investor. This web application allows users to practice and improve their investing skills without the risk of losing real money. It's an excellent way for beginners to get familiar with stock investing.

# How to Run?

The steps below provide exemplary commands to achieve certain operations. Keep in mind that the commands might vary slightly depending on your environment/operating system. These commands were tested on Windows using the Git Bash shell. If you are using a different environment, you might need to use slightly different commands.

## Running the Web App Locally

### Download the Repository

1. Download the repository from GitHub and unzip it.

### Run Backend

#### Prerequisites

- Ensure you have [Python](https://www.python.org/) installed.

1. Open a new terminal and navigate to the backend folder located in the root of the project.
2. Create a `.env` file for environment variables in the backend folder.
3. Add the following variables to the `.env` file:

   - `SECRET_KEY`: A random string of characters.
   - `DEBUG=True`
   - `POLYGON_STOCK_API_KEY`: Your API key for stock data, obtainable for free by creating an account on [Polygon](https://polygon.io/).

   Note: You can skip the `POLYGON_STOCK_API_KEY` step since the source code already contains stock data for one day. The application will run, but the data will not be synced with real-world data and won't update.

4. Create a new Python virtual environment: `python -m venv venv`
5. Activate the environment: `source venv/Scripts/activate`
6. Install the necessary packages: `pip install -r requirements.txt`
7. Create database migrations: `python manage.py makemigrations`
8. Apply the migrations: `python manage.py migrate`
9. (Optional) Create a superuser account to access the admin dashboard: `python manage.py createsuperuser`
10. Run the server: `python manage.py runserver`

    If the server is running successfully, you should see a message indicating that "Debug mode is on, skipping stock data fetch." This means the stock data is not being fetched from the API because `DEBUG=True` is set in the `.env` file. To fetch current stock data, set `DEBUG=False` and run the server once to fetch and save new data. Then, you can switch back to `DEBUG=True`.

### Run Frontend

#### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/en) installed.

1. Open a new terminal and navigate to the frontend folder.
2. Create a `.env` file for environment variables in the frontend folder.
3. Add the following line to the `.env` file: `VITE_BACKEND_URL=http://127.0.0.1:8000`
4. Install the necessary packages: `npm install`
5. Run the app: `npm run dev`
6. The app should run on `http://127.0.0.1:5173/` or a similar URL.

# Project specification

## Backend

## Frontend

# Project Screenshots

# Short video presenting project
