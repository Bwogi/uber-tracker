# Uber Income & Loan Tracker

A comprehensive financial tracking application built with Next.js to help you manage your Uber income, expenses, loans, and working hours. This app helps you stay on top of your finances and ensure profitability.

## Features

- **Dashboard**: Get an overview of your financial health with key metrics like total income, expenses, net profit, and hourly rate
- **Income Tracking**: Log your daily Uber earnings with notes
- **Expense Tracking**: Track charging costs and other expenses separately
- **Loan Management**: Manage multiple loans with payment tracking and balance updates
- **Hours Tracking**: Record your daily working hours with start/end times
- **Financial Analytics**: View profit margins, expense ratios, and loan burden percentages

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: SQLite with better-sqlite3
- **UI**: Aceternity UI components with Tailwind CSS
- **Language**: TypeScript
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js v20 or higher
- npm

### Installation

1. Install dependencies (if not already done):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and visit:
```
http://localhost:3000
```

## Usage

### Dashboard
The dashboard provides a comprehensive overview of your finances:
- Total income from Uber
- Total expenses (broken down by charging and other)
- Active loan balances
- Net profit calculation
- Total hours worked
- Hourly rate calculation
- Financial health metrics (profit margin, expense ratio, loan burden)

### Income Tracking
1. Navigate to the "Income" page
2. Enter the date, amount, and optional notes
3. Click "Add Income" to save
4. View all your income entries in the history panel

### Expense Tracking
1. Go to the "Expenses" page
2. Select the expense type (Charging or Other)
3. Enter the date, amount, and optional notes
4. Click "Add Expense" to save
5. Track charging vs. other expenses separately

### Loan Management
1. Visit the "Loans" page
2. Add a new loan with name, principal amount, interest rate, and due date
3. Make payments by entering an amount and clicking "Make Payment"
4. The app automatically updates the balance and marks loans as "paid" when fully paid
5. View payment history and track progress

### Hours Tracking
1. Go to the "Hours" page
2. Log your daily working hours
3. Optionally add start time, end time, and notes
4. View your total hours worked over time

## Database

The application uses SQLite for data storage. The database file (`uber-tracker.db`) is automatically created in the project root when you first run the app.

### Tables
- `income`: Daily Uber earnings
- `expenses`: Charging and other costs
- `loans`: Loan information and balances
- `work_hours`: Daily working hours
- `loan_payments`: Payment history for loans

## Development

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint
```bash
npm run lint
```

## Project Structure

```
uber-tracker/
├── app/
│   ├── api/           # API routes for CRUD operations
│   ├── expenses/      # Expenses tracking page
│   ├── hours/         # Hours tracking page
│   ├── income/        # Income tracking page
│   ├── loans/         # Loan management page
│   ├── layout.tsx     # Root layout with navigation
│   └── page.tsx       # Dashboard page
├── components/
│   ├── ui/            # Aceternity UI components
│   └── Navigation.tsx # Navigation component
├── lib/
│   ├── db.ts          # Database connection and schema
│   ├── types.ts       # TypeScript interfaces
│   └── utils.ts       # Utility functions
└── public/            # Static assets
```

## Tips for Maximum Profitability

1. **Track Daily**: Log your income, expenses, and hours every day for accurate insights
2. **Monitor Charging Costs**: Keep a close eye on charging expenses as they can eat into profits
3. **Manage Loans**: Make regular payments to reduce loan burden and free up more profit
4. **Analyze Hourly Rate**: Use the dashboard to ensure your hourly rate meets your goals
5. **Review Profit Margin**: Aim to keep your profit margin healthy by controlling expenses
# uber-tracker
