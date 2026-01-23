<div align="center">

# Uber Tracker
### Professional Financial Management for Rideshare Drivers

[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Documentation](#documentation) • [Support](#support)

</div>

---

## Overview

Uber Tracker is a comprehensive financial management system designed specifically for rideshare drivers. Built with modern web technologies, it provides real-time insights into your earnings, expenses, and profitability—helping you make informed decisions to maximize your income.

### Why Uber Tracker?

- **📊 Complete Financial Picture**: Track income, expenses, loans, and hours in one place
- **💡 Intelligent Analysis**: Automated calculations for hourly rate, profit margins, and efficiency metrics
- **📱 Accessible Anywhere**: Works on desktop, tablet, and mobile devices on your local network
- **🌓 Theme Support**: Professional light and dark modes for any environment
- **📈 Detailed Reports**: Generate comprehensive financial reports with actionable insights
- **🔒 Privacy First**: All data stored locally on your device—no cloud, no tracking

## Features

### Core Modules

#### 💰 Income Tracking
- Log daily Uber earnings with date and amount
- Add notes for trip details, bonuses, or promotions
- View comprehensive income history
- Calculate averages and totals automatically

#### 💸 Expense Management
- Separate tracking for charging costs and other expenses
- Categorized expense breakdown and percentages
- Identify cost patterns and optimization opportunities
- Track expense-to-income ratios

#### 📝 Loan Management
- Track multiple loans with principal, interest, and balances
- Record payments and view payment history
- Automatic balance calculations
- Payment progress tracking with percentages
- Estimate payoff timeline based on current profit

#### ⏰ Work Hours Tracking
- **Smart Time Calculation**: Automatically calculates hours from start/end times
- **Overnight Shift Support**: Handles shifts that cross midnight
- Real-time hour calculations with minute precision
- Track start and end times with notes
- Calculate hourly earning rates automatically

#### 📊 Financial Dashboard
- Real-time overview of all financial metrics
- Net profit calculations (income - expenses - loans)
- Hourly rate analysis
- Profit margin and expense ratio visualization
- Quick stats and financial health indicators

#### 📄 Professional Reports
- **Multiple Report Types**: Summary, Income, Expenses, Loans, Hours
- **Date Range Filtering**: Custom periods or preset ranges (weekly, monthly)
- **Export Formats**:
  - Text reports for easy reading
  - CSV files for Excel/Google Sheets analysis
  - Print-ready formatted documents
- **Intelligent Analysis**:
  - Profitability metrics and trends
  - Productivity analysis (hours vs income)
  - Efficiency ratios and cost per hour
  - Loan impact on take-home profit
  - Actionable insights and recommendations
- **Professional Naming**: Auto-generated filenames with report type, date range, and timestamp

### User Interface

- **Modern Design**: Clean, intuitive Aceternity UI components
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Dark/Light Themes**: Toggle between themes with preferences saved
- **Smooth Animations**: Framer Motion for polished interactions
- **Accessible**: WCAG-compliant design with proper contrast and labels

## Technology Stack

| Category | Technology | Purpose |
|----------|------------|----------|
| **Framework** | Next.js 16.1.4 with App Router | Modern React framework with server components |
| **Language** | TypeScript 5.0 | Type-safe development |
| **Database** | SQLite with better-sqlite3 | Lightweight, local data storage |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework |
| **UI Components** | Aceternity UI | Modern, animated components |
| **Animation** | Framer Motion | Smooth, professional animations |
| **Runtime** | Node.js 20+ | JavaScript runtime |

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js**: v20.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Terminal**: Command-line access (Terminal on macOS, CMD/PowerShell on Windows)

### Quick Start

1. **Clone or download** this repository to your local machine

2. **Navigate to the project directory**:
   ```bash
   cd uber-tracker
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - **Local**: http://localhost:3000
   - **Network**: http://[YOUR_IP]:3000 (see [Network Access](#network-access))

### Production Deployment

For better performance and stability:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Network Access

The app is configured to run on your local network by default:
- Access from your phone/tablet on the same WiFi
- Your network URL: http://[YOUR_LOCAL_IP]:3000
- Find your IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`

See [NETWORK_ACCESS.md](./NETWORK_ACCESS.md) for detailed setup instructions.

## Usage Guide

### Getting Started

#### First Time Setup
1. **Start the application** as described in [Installation](#installation)
2. **Navigate to Dashboard** - You'll see $0.00 for all metrics initially
3. **Add your first income** entry to begin tracking
4. **Explore each section** using the navigation menu

### Core Workflows

#### Daily Routine (Recommended)
```
1. End of shift → Log Income (date, amount, notes)
2. → Log Expenses (charging costs, other expenses)
3. → Log Hours (start time, end time, auto-calculated)
4. → Check Dashboard for daily earnings and hourly rate
```

#### Weekly Review
```
1. Navigate to Reports
2. Set date range to past week
3. Generate Summary report
4. Review Key Insights section
5. Adjust strategy based on findings
```

#### Monthly Financial Review
```
1. Generate monthly Summary report
2. Export CSV for detailed analysis
3. Review profit margins and expense ratios
4. Make loan payments if due
5. Set goals for next month
```

### Feature Details

#### 💰 Income Page
**Purpose**: Track all your Uber earnings

**How to use**:
1. Click **Income** in the navigation
2. Select the date you earned the income
3. Enter the amount (automatically formats as currency)
4. Add notes (optional): "Weekend bonus", "Airport trips", etc.
5. Click **Add Income**

**Tips**:
- Log income daily for accurate tracking
- Use notes to identify high-earning patterns
- Review total income displayed in the header

#### 💸 Expenses Page
**Purpose**: Track operating costs

**How to use**:
1. Click **Expenses** in the navigation
2. Select date and expense type:
   - **Charging**: Electricity costs for EV charging
   - **Other**: Maintenance, car wash, tolls, etc.
3. Enter amount and optional notes
4. Click **Add Expense**

**Tips**:
- Separate charging from other costs for better analysis
- Track everything—small expenses add up
- Review expense breakdown percentages

#### ⏰ Hours Page
**Purpose**: Track work time and calculate hourly rates

**How to use**:
1. Click **Hours** in the navigation
2. Select the date you worked
3. Enter **Start Time** (e.g., 22:00 for 10 PM)
4. Enter **End Time** (e.g., 04:00 for 4 AM)
5. **Check "Work continues into next day"** if your shift crossed midnight
6. Hours are **automatically calculated**
7. Review the calculation, manually adjust if needed
8. Add notes about your shift (optional)
9. Click **Log Hours**

**Tips**:
- Hours auto-calculate as you type times
- The app handles overnight shifts automatically
- Manual override available if needed
- Track start/end times for pattern analysis

#### 📝 Loans Page
**Purpose**: Manage debt and track payments

**How to use**:

**Adding a loan**:
1. Click **Loans** in the navigation
2. Enter loan details:
   - Name: "Car Payment", "Personal Loan", etc.
   - Principal Amount: Original loan amount
   - Interest Rate: Annual percentage (optional)
   - Due Date: Payment deadline (optional)
3. Click **Add Loan**

**Making a payment**:
1. Find your loan in the list
2. Enter payment amount in the input field
3. Click **Make Payment**
4. Balance updates automatically
5. Loan marked as "paid" when balance reaches $0

**Tips**:
- Track all loans to see total obligation
- Regular payments reduce loan burden
- Reports show months to payoff at current rate

#### 📊 Dashboard
**Purpose**: Real-time financial overview

**What you see**:
- **Total Income**: All earnings in the system
- **Total Expenses**: Charging + other costs
- **Active Loans**: Outstanding balance owed
- **Net Profit**: Income - Expenses - Loan Payments
- **Total Hours**: Time worked
- **Hourly Rate**: Income ÷ Hours worked

**Understanding the metrics**:
- **Profit Margin**: What % of income is profit
- **Expense Ratio**: What % goes to costs
- **Loan Burden**: Loan impact on profitability

**Tips**:
- Check daily to monitor performance
- Green values = good, Red = needs attention
- Use Quick Stats for at-a-glance review

#### 📄 Reports Page
**Purpose**: Generate detailed financial analysis

**How to use**:
1. Click **Reports** in the navigation
2. Select **Report Type**:
   - **Summary**: All data + analysis (recommended)
   - **Income Only**: Just earnings
   - **Expenses Only**: Just costs
   - **Loans Only**: Debt information
   - **Hours Only**: Time tracking
3. Set **Date Range** (defaults to current month)
4. Preview report on the right
5. Export:
   - **📄 Download Text Report**: For reading (.txt)
   - **📊 Download CSV**: For Excel/analysis (.csv)
   - **🖨️ Print Report**: Physical copy with header/footer

**Report features**:
- Professional filename with dates and timestamp
- Profitability analysis with percentages
- Productivity metrics (hours vs income)
- Efficiency ratios (cost per hour)
- Loan impact calculations
- Key insights with recommendations

**Tips**:
- Generate monthly reports for records
- Use CSV for tax preparation
- Compare week-to-week for trends
- Act on Key Insights section

See [REPORTS_GUIDE.md](./REPORTS_GUIDE.md) for comprehensive documentation.

## Data Storage

### Database

Uber Tracker uses **SQLite** for local data storage:
- **File**: `uber-tracker.db` (created automatically on first run)
- **Location**: Project root directory
- **Size**: Minimal (typically < 1 MB)
- **Backup**: Simply copy the .db file

### Database Schema

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `income` | Daily earnings | date, amount, notes |
| `expenses` | Operating costs | date, type, amount, notes |
| `work_hours` | Time tracking | date, hours_worked, start_time, end_time |
| `loans` | Debt management | name, principal, balance, status |
| `loan_payments` | Payment history | loan_id, amount, payment_date |

### Data Privacy

- ✅ **All data stored locally** on your device
- ✅ **No cloud sync** - complete privacy
- ✅ **No external APIs** or tracking
- ✅ **No user accounts** required
- ✅ **No internet connection** needed (except for initial install)

### Backup & Export

**Manual Backup**:
```bash
# Copy database file
cp uber-tracker.db uber-tracker-backup-$(date +%Y%m%d).db
```

**Export Data**:
- Use Reports → Download CSV for spreadsheet-compatible export
- All data exported in readable format
- Import CSV into Excel, Google Sheets, or accounting software

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (with network access) |
| `npm run dev:local` | Start development server (localhost only) |
| `npm run build` | Build for production |
| `npm start` | Start production server (with network access) |
| `npm run start:local` | Start production server (localhost only) |
| `npm run lint` | Run ESLint for code quality |

### Environment

- **Node Version**: 20.0.0 or higher required
- **Port**: 3000 (default), automatically uses 3001 if 3000 is busy
- **Network Binding**: 0.0.0.0 (accessible on local network)
- **Hot Reload**: Enabled in development mode

## Project Structure

```
uber-tracker/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes (RESTful endpoints)
│   │   ├── income/           # Income CRUD operations
│   │   ├── expenses/         # Expense CRUD operations
│   │   ├── loans/            # Loan management + payments
│   │   ├── hours/            # Work hours tracking
│   │   └── stats/            # Dashboard statistics
│   ├── income/page.tsx       # Income tracking UI
│   ├── expenses/page.tsx     # Expense tracking UI
│   ├── loans/page.tsx        # Loan management UI
│   ├── hours/page.tsx        # Hours tracking UI
│   ├── reports/page.tsx      # Report generation UI
│   ├── layout.tsx            # Root layout + navigation
│   ├── page.tsx              # Dashboard (home)
│   └── globals.css           # Global styles + themes
├── components/               # Reusable React components
│   ├── ui/                   # Aceternity UI components
│   │   ├── card.tsx          # Card component
│   │   ├── button.tsx        # Button with animations
│   │   └── input.tsx         # Form inputs
│   ├── Navigation.tsx        # App navigation bar
│   ├── ThemeProvider.tsx     # Light/dark theme context
│   └── ThemeToggle.tsx       # Theme switch button
├── lib/                      # Utilities and configuration
│   ├── db.ts                 # SQLite database connection
│   ├── types.ts              # TypeScript interfaces
│   └── utils.ts              # Helper functions
├── public/                   # Static assets
├── NETWORK_ACCESS.md         # Network setup guide
├── REPORTS_GUIDE.md          # Reports documentation
├── QUICKSTART.md             # Getting started guide
└── uber-tracker.db           # SQLite database (auto-generated)
```

## Documentation

Comprehensive guides are available:

- **[QUICKSTART.md](./QUICKSTART.md)**: First-time setup and daily workflows
- **[NETWORK_ACCESS.md](./NETWORK_ACCESS.md)**: Local network configuration and mobile access
- **[REPORTS_GUIDE.md](./REPORTS_GUIDE.md)**: Complete guide to reports and financial analysis

## Best Practices

### For Maximum Profitability

1. **Daily Tracking**
   - Log income, expenses, and hours at end of each shift
   - Consistent data = accurate insights
   - Takes less than 2 minutes per day

2. **Weekly Reviews**
   - Generate weekly Summary reports
   - Track hourly rate trends
   - Identify best earning times/days
   - Adjust schedule accordingly

3. **Cost Management**
   - Monitor charging expenses closely
   - Find cheapest charging locations
   - Track expense ratio (keep under 30%)
   - Cut unnecessary costs

4. **Loan Strategy**
   - Make regular payments to reduce burden
   - Use reports to see payoff timeline
   - Prioritize high-interest loans
   - Free up profit by paying down debt

5. **Performance Optimization**
   - Target minimum hourly rate (e.g., $25/hr)
   - Work during peak hours for higher earnings
   - Use efficiency metrics from reports
   - Balance hours worked vs. profit margin

### Financial Health Goals

- ✅ **Hourly Rate**: $20-30/hr (varies by market)
- ✅ **Expense Ratio**: Under 30% of income
- ✅ **Profit Margin**: 60-70% or higher
- ✅ **Loan Burden**: Under 20% of monthly income

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or let Next.js use an alternative port (3001)
```

**Database locked error**
```bash
# Close all app instances
# Delete lock file
rm -rf .next/dev/lock
```

**Changes not showing**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Can't access from other devices**
- Ensure devices are on same WiFi network
- Check firewall settings (see NETWORK_ACCESS.md)
- Verify your local IP address hasn't changed

## Support

For issues or questions:
1. Check the [Documentation](#documentation) section
2. Review [Troubleshooting](#troubleshooting) above
3. Verify your Node.js version: `node --version`
4. Check the console for error messages

## Contributing

This is a personal financial management tool. Feel free to fork and customize for your needs.

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Aceternity UI](https://ui.aceternity.com/)
- Icons and animations by [Framer Motion](https://www.framer.com/motion/)

---

<div align="center">

**Track Smart. Drive Profitable. Succeed.**

Made for rideshare drivers who take their business seriously.

</div>
