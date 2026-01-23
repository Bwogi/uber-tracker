"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Official Header Bar */}
      <div className="bg-slate-800 dark:bg-slate-900 text-white py-2 px-4 text-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="font-medium">Fluxera — Gig Economy Financial Tracker</span>
          <span className="text-slate-300">IRS Mileage Rate: $0.67/mile (2024)</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-slate-700 dark:bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Fluxera: Financial Tracking for Gig Economy Drivers
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed">
              A free, secure tool to track your earnings, expenses, mileage deductions, 
              and calculate your true hourly rate. Designed specifically for Uber, Lyft, 
              and gig economy workers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button className="text-base px-8 py-6 bg-blue-600 hover:bg-blue-700 font-semibold">
                  Access Dashboard
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" className="text-base px-8 py-6 border-white text-white hover:bg-slate-600 font-semibold">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">100%</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Free to Use</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">Local</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Data Storage</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">IRS</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Compliant Rates</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">No</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Account Required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Key Features
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-10 border-b border-slate-200 dark:border-slate-700 pb-6">
            Everything you need to understand your rideshare business finances.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                $
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                Net Profit Calculation
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Automatically calculates your actual take-home after all business expenses including fuel, maintenance, and phone costs.
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                ⏱
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                True Hourly Rate
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                See your real earnings per hour after expenses—not the inflated figures shown in driver apps.
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                🚗
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                IRS Mileage Deduction
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Track odometer readings and automatically calculate your standard mileage deduction at the current IRS rate of $0.67/mile.
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                📊
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                Tax Report Generation
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Generate comprehensive tax reports with income, expenses, and mileage summaries ready for tax filing.
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                💳
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                Loan Management
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Track vehicle loans and payments. See payoff progress and how debt affects your net earnings.
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                📝
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                Quick Daily Logging
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Log income, hours, mileage, and expenses in one simple form. Takes less than 30 seconds per day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-100 dark:bg-slate-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
            How to Use This Tool
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-10 border-b border-slate-300 dark:border-slate-600 pb-6">
            Three simple steps to financial clarity.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-slate-700 dark:bg-slate-600 text-white flex items-center justify-center font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">
                  Record Daily Activity
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Enter your earnings, odometer reading, hours worked, and any expenses at the end of each driving session.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-slate-700 dark:bg-slate-600 text-white flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">
                  Review Your Dashboard
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  View calculated metrics including net profit, true hourly rate, and accumulated mileage deductions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-slate-700 dark:bg-slate-600 text-white flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">
                  Generate Reports
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Export tax-ready reports for your records or accountant. All data stays on your device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Important Information
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-10 border-b border-slate-200 dark:border-slate-700 pb-6">
            What you should know before using this tool.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">Data Privacy</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                All data is stored locally on your device. No information is transmitted to external servers. 
                You maintain complete control over your financial records.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">Tax Disclaimer</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                This tool provides estimates for informational purposes. Consult a qualified tax professional 
                for advice specific to your situation. IRS mileage rates are updated annually.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">Supported Platforms</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Designed for drivers using Uber, Lyft, DoorDash, Instacart, and other gig economy platforms. 
                Works with any rideshare or delivery service.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">No Account Required</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Start using immediately without registration. No email, no password, no personal information required. 
                Simply access the dashboard and begin tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-700 dark:bg-slate-800 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Understand Your Real Earnings?
          </h2>
          <p className="text-slate-300 mb-8">
            Access the dashboard now. No signup required.
          </p>
          <Link href="/dashboard">
            <Button className="text-base px-8 py-6 bg-blue-600 hover:bg-blue-700 font-semibold">
              Access Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 dark:bg-slate-900 text-slate-400 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-bold text-white mb-3">Fluxera</h4>
              <p>A free resource for independent rideshare and delivery drivers to track earnings and expenses.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/log" className="hover:text-white">Log Entry</Link></li>
                <li><Link href="/reports" className="hover:text-white">Tax Reports</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><a href="https://www.irs.gov/tax-professionals/standard-mileage-rates" target="_blank" rel="noopener noreferrer" className="hover:text-white">IRS Mileage Rates</a></li>
                <li><a href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center" target="_blank" rel="noopener noreferrer" className="hover:text-white">IRS Self-Employment Guide</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-6 text-center text-xs">
            <p>This tool is not affiliated with Uber, Lyft, or any rideshare company. For informational purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
