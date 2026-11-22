# Requirements — Monster Money (Kiroween 2026, Costume Contest)

## Introduction
Monster Money is a Halloween-themed personal budget tracker. Spending
categories are monsters with health bars; logging an expense feeds the
monster and drains its health. The app is a static single-page web app with
no backend.

## Glossary
- **Monster**: a spending category with a monthly budget (its max health).
- **Health**: budget remaining for the month, as a percentage of the budget.
- **Feeding**: logging an expense in a category.
- **Slain**: a monster whose spending has met or exceeded its budget.
- **Projection**: forecast month-end spend from the daily average so far.

## Requirements

### 1. Monthly setup
- **1.1** The user SHALL be able to set a monthly income and a currency
  (USD, IDR, EUR, GBP).
- **1.2** The user SHALL be able to set a monthly budget for each of the
  8 monster categories.
- **1.3** Settings SHALL persist across visits (localStorage).
- **1.4** Default budgets SHALL be pre-filled so the app is usable on first open.

### 2. Expense logging
- **2.1** The user SHALL log an expense with amount, category, optional note,
  and date (default today).
- **2.2** Amounts SHALL be positive numbers; the form SHALL reject zero,
  negative, or non-numeric input with a visible message.
- **2.3** The user SHALL be able to delete any expense from the recent list.
- **2.4** Logging an expense SHALL immediately update every monster health
  bar, totals, charts, and achievements without a page reload.

### 3. Monster health
- **3.1** Each monster SHALL show budget, spent, remaining, and a health bar.
- **3.2** Health SHALL be green above 50%, amber at 25–50%, red below 25%,
  and the monster SHALL be marked SLAIN at 0% or below (over budget).
- **3.3** Over-budget monsters SHALL show the overage amount in red.

### 4. Dashboard and projection
- **4.1** The dashboard SHALL show total spent this month, total budget,
  remaining money, and days left in the month.
- **4.2** The app SHALL project month-end spending from the daily average
  spend so far, and SHALL warn plainly when the projection exceeds income.
- **4.3** A donut chart SHALL show spending share per category.
- **4.4** A bar chart SHALL show daily spending for the last 14 days.

### 5. Achievements
- **5.1** Achievements SHALL be computed from stored data, never faked:
  First Bite (1 expense), Monster Tamer (10 expenses), Ghost Buster
  (3 straight days at or under the daily allowance), Penny Pumpkin
  (a zero-spend day in the last 7 days), Budget Keeper (all monsters alive).
- **5.2** Earned achievements SHALL be visibly marked; unearned ones SHALL
  show their requirement.

### 6. Data control
- **6.1** The user SHALL be able to load one-click demo data.
- **6.2** The user SHALL be able to export all data as JSON and import a
  previously exported JSON file.
- **6.3** The user SHALL be able to reset the month (clears expenses only,
  keeps budgets and income) after a confirmation.
- **6.4** No data SHALL leave the device except via explicit user export.

### 7. Presentation (Costume Contest)
- **7.1** The interface SHALL be a polished dark Halloween theme: deep
  purple-black background, pumpkin orange accents, glowing cards, floating
  ghost animation, and a display typeface with system fallback.
- **7.2** The layout SHALL be fully usable at 360px width and on desktop.
- **7.3** The page SHALL remain readable and functional if the display font
  fails to load.
