import type { Step } from "react-joyride";

export type TourPage = "dashboard" | "transactions" | "accounts" | "settings";

// The tour is one story told across pages: the dashboard explains how the app
// fits together, then each page explains its own controls.
// Order the tour walks through the pages, and the route of each one.
export const tourOrder: TourPage[] = [
  "dashboard",
  "accounts",
  "settings",
  "transactions",
];

export const tourRoutes: Record<TourPage, string> = {
  dashboard: "/dashboard",
  accounts: "/accounts",
  settings: "/settings",
  transactions: "/transactions",
};

export const tourSteps: Record<TourPage, Step[]> = {
  dashboard: [
    {
      target: '[data-tour="page-header"]',
      title: "Welcome to Trackwise",
      content:
        "Here's a quick look at how everything fits together. The date picker on the right sets the period every widget shows.",
    },
    {
      target: '[data-tour="nav-accounts"]',
      title: "1. Add your accounts",
      content:
        "Start here. Add the places your money lives, such as bank accounts, e-wallets, cash and credit cards.",
      placement: "right",
    },
    {
      target: '[data-tour="nav-settings"]',
      title: "2. Set up categories",
      content:
        "Under Settings → Category, organise your spending and income and set a monthly limit on any category.",
      placement: "right",
    },
    {
      target: '[data-tour="nav-transactions"]',
      title: "3. Record transactions",
      content:
        "Log income, expenses and transfers between accounts. You can also schedule recurring bills so you never miss one.",
      placement: "right",
    },
    {
      target: '[data-tour="overview-widget"]',
      title: "Your balance",
      content:
        "Everything you record adds up here: your total balance across all accounts. The eye icon hides the amount.",
    },
    {
      target: '[data-tour="expense"]',
      title: "Expenses",
      content:
        "What you've spent in the selected period. The bar shows which categories it went to, and the bottom row compares it with the previous period.",
    },
    {
      target: '[data-tour="income"]',
      title: "Income",
      content:
        "What you've earned in the selected period, split by category. Hover over the bar to see each amount.",
    },
    {
      target: '[data-tour="due"]',
      title: "Upcoming bills",
      content: "Your scheduled payments, so you can see what's due and when.",
    },
    {
      target: '[data-tour="budget"]',
      title: "Budgets",
      content:
        "How much of each category limit you've used this period, so you can slow down before going over.",
    },
    {
      target: '[data-tour="recent-transactions"]',
      title: "Recent activity",
      content:
        "Your latest transactions at a glance. Next we'll visit each page.",
    },
  ],

  transactions: [
    {
      target: '[data-tour="type"]',
      title: "Transaction Type",
      content:
        "Switch between Expense, Income and Transfer to view and manage that kind of transaction.",
      placement: "bottom",
    },
    {
      target: '[data-tour="add"]',
      title: "Add Transaction",
      content:
        "Record a new transaction for the selected type: pick an account, category, amount and date.",
      placement: "bottom",
    },
    {
      target: '[data-tour="export"]',
      title: "Export Reports",
      content:
        "Download a report of your transactions so you can review or share them outside the app.",
      placement: "bottom",
    },
    {
      target: '[data-tour="filter"]',
      title: "Filter",
      content:
        "Narrow the list by description, category, account or status to find specific transactions.",
      placement: "bottom",
    },
    {
      target: '[data-tour="table"]',
      title: "Transaction History",
      content:
        "Your transactions appear here. Review, edit or delete any entry from this list.",
      placement: "top",
    },
    {
      target: '[data-tour="graph"]',
      title: "Category Breakdown",
      content:
        "See your total for the selected type and how it splits across categories.",
      placement: "left",
    },
    {
      target: '[data-tour="budget"]',
      title: "Budget Limits",
      content:
        "Set a spending limit per category and track how much you've used. Bars turn red when you go over.",
      placement: "top",
    },
    {
      target: '[data-tour="schedules"]',
      title: "Scheduled Transactions",
      content:
        "Manage recurring and upcoming transactions so they're recorded automatically.",
      placement: "top",
    },
  ],

  accounts: [
    {
      target: '[data-tour="add-account"]',
      title: "Add an account",
      content:
        "Create a bank account, e-wallet, cash or credit card. Every transaction you record belongs to one of these.",
      placement: "bottom",
    },
    {
      target: '[data-tour="account-stats"]',
      title: "Your net worth",
      content:
        "Assets minus liabilities for the selected period, plus how many accounts you have.",
      placement: "bottom",
    },
    {
      target: '[data-tour="account-list"]',
      title: "Your accounts",
      content:
        "Each card shows an account and its balance. Open one to edit it or archive it when you no longer use it.",
      placement: "top",
    },
  ],

  // `data.route` makes the tour navigate there before showing the step.
  settings: [
    {
      target: '[data-tour="settings-tabs"]',
      title: "Settings",
      content:
        "Everything you can customise lives in these tabs. Let's look at the ones worth knowing.",
      placement: "bottom",
      data: { route: "/settings" },
    },
    {
      target: '[data-tour="category-filter"]',
      title: "Categories",
      content:
        "Your categories are grouped by type. Switch between All, Expense, Income and Transfer to find the one you need.",
      placement: "bottom-start",
      data: { route: "/settings/category" },
    },
    {
      target: '[data-tour="category-add"]',
      title: "Add a category",
      content:
        "Create your own categories, then set a monthly limit on each one. Budgets on the dashboard are built from these limits.",
      placement: "bottom-end",
      data: { route: "/settings/category" },
    },
    {
      target: '[data-tour="settings-content"]',
      title: "Your profile",
      content:
        "Update your name, photo and personal details, and connect your Google account to sign in with one click.",
      placement: "top",
      data: { route: "/settings/account" },
    },
    {
      target: '[data-tour="google-link"]',
      title: "Google sign-in",
      content:
        "Connect your Google account to sign in with one click. You can disconnect it any time once you have a password set.",
      placement: "top",
      data: { route: "/settings/account" },
    },
    {
      target: '[data-tour="change-password"]',
      title: "Password",
      content:
        "Change your password here. If you signed up with Google, you can set one so you can also sign in with your email.",
      placement: "top",
      data: { route: "/settings/account" },
    },
    // {
    //   target: '[data-tour="settings-content"]',
    //   title: "Theme",
    //   content: "Switch between light and dark and pick the look you prefer.",
    //   placement: "top",
    //   data: { route: "/settings/theme" },
    // },
    // {
    //   target: '[data-tour="settings-content"]',
    //   title: "Backup",
    //   content: "Keep a copy of your data safe so you can restore it later.",
    //   placement: "top",
    //   data: { route: "/settings/backup" },
    // },
  ],
};
