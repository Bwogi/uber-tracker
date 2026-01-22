# Quick Start Guide

## Running the Application

1. **Navigate to the project directory:**
   ```bash
   cd uber-tracker
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Visit http://localhost:3000

## First Steps

### 1. Add Your First Income Entry
- Click on "Income" in the navigation
- Enter today's date and your earnings
- Add any notes about the day
- Click "Add Income"

### 2. Track Your Charging Expenses
- Go to "Expenses"
- Select "Charging" as the type
- Enter the amount you spent on charging
- Click "Add Expense"

### 3. Add a Loan (if applicable)
- Navigate to "Loans"
- Enter the loan name (e.g., "Car Payment")
- Enter the principal amount
- Add interest rate and due date (optional)
- Click "Add Loan"

### 4. Log Your Working Hours
- Click on "Hours"
- Enter the date and hours worked
- Optionally add start/end times
- Click "Log Hours"

### 5. Check Your Dashboard
- Return to the Dashboard (home page)
- View your financial overview
- See your net profit and hourly rate
- Monitor your financial health metrics

## Tips

- **Daily Tracking**: Make it a habit to log your data at the end of each day
- **Consistency**: Track everything consistently for accurate analytics
- **Review Weekly**: Check your dashboard weekly to monitor progress
- **Payment Schedule**: Set reminders to make loan payments regularly
- **Backup**: The database file `uber-tracker.db` contains all your data - consider backing it up regularly

## Troubleshooting

### Server won't start
- Make sure you're in the correct directory: `cd uber-tracker`
- Check if another process is using port 3000
- Try stopping any running servers and restart

### Database issues
- The database is automatically created on first run
- If you need to reset, delete `uber-tracker.db` and restart the server

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version: `node --version` (should be v20+)

## Keyboard Shortcuts

- **Dashboard**: Click "Uber Tracker" logo or navigate to `/`
- **Income**: Navigate to `/income`
- **Expenses**: Navigate to `/expenses`
- **Loans**: Navigate to `/loans`
- **Hours**: Navigate to `/hours`

## Sample Workflow

**Monday Morning:**
1. Log yesterday's income
2. Add any charging expenses from yesterday
3. Log hours worked yesterday

**Weekly:**
1. Review dashboard
2. Make loan payments if due
3. Analyze profit margins

**Monthly:**
1. Review total income vs expenses
2. Check if you're meeting hourly rate goals
3. Adjust working hours or expenses as needed

Enjoy tracking your Uber finances! 🚗💰
