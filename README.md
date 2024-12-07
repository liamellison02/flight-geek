# Flight Price Tracker

Flight Price Tracker is a web application that allows users to monitor and track flight prices over time. It offers a user-friendly interface, displays historical price data, current prices, predicts future prices, and provides a 'deal rating' system based on historical trends and other factors.

## Features
- **Flight Price Monitoring:** Track prices for specific flights over time.
- **Historical Data Visualization:** View historical price trends with charts and graphs.
- **Price Prediction:** Get future price predictions using historical trends and models.
- **Deal Rating System:** Evaluate whether current prices are good deals based on past trends.
- **User-Friendly Interface:** Simplified and intuitive design.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Golang (JSON API)
- **Database:** PostgreSQL
- **Other Tools:** Celery for scheduled jobs (potential integration), AWS S3 & Amplify for hosting and storage.

## Setup Instructions

### Prerequisites
- Node.js and npm
- Golang
- PostgreSQL
- AWS CLI (optional, for S3 integration)

### Frontend

Clone the repository and navigate to the frontend directory:

```bash
git clone https://github.com/your-repo/flight-price-tracker.git
cd flight-price-tracker/frontend
