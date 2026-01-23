# Gig Economy Platform Coverage Analysis

## Currently Supported Well

The app is designed primarily for **rideshare drivers** (Uber, Lyft) and handles:

- Income tracking
- Mileage deduction (IRS standard rate)
- Business expenses (charging, maintenance, insurance, etc.)
- Vehicle loans
- Work hours tracking
- Tax report generation

---

## Gaps for Other Gig Platforms

### 1. Delivery Drivers (DoorDash, Instacart, UberEats, Grubhub)

**Missing:**

- No tracking for delivery-specific expenses like:
  - Hot bags / insulated bags
  - Phone mounts and accessories
  - Parking fees for pickups
  - Tolls
- No multi-app income tracking (many drivers use 2-3 apps simultaneously)
- No tip tracking separate from base pay

### 2. Grocery/Shopping Gigs (Instacart, Shipt)

**Missing:**

- No tracking for:
  - Time spent shopping vs driving (different activity types)
  - Per-batch earnings breakdown
  - Customer ratings impact

### 3. All Gig Workers

**Missing:**

- Quarterly estimated tax payment reminders (self-employed pay taxes 4x/year)
- Self-employment tax calculation (15.3% SE tax on net earnings)
- Health insurance deduction tracking (self-employed can deduct premiums)
- Home office deduction (if applicable)
- Phone/data plan business use percentage

### 4. Multi-Platform Drivers

**Missing:**

- Ability to track income by platform separately
- Consolidated reporting across platforms
- Platform-specific expense categories

### 5. Electric Vehicle Drivers

**Partial Support:**

- Charging expenses exist, but missing:
  - Home charging cost calculation
  - Public charging station tracking
  - EV-specific tax credits

---

## Recommendations for Future Development

1. **Add platform selection** (Uber, Lyft, DoorDash, etc.) for income entries
2. **Add delivery-specific expense categories** (hot bags, parking, tolls)
3. **Add quarterly tax estimate calculator** with payment reminders
4. **Add self-employment tax (15.3%)** to tax report
5. **Add multi-platform income summary view**
6. **Add tip vs base pay separation**
7. **Add health insurance premium tracking** for self-employed deduction
8. **Add phone/data plan business use percentage** calculator

---

## Priority Matrix

| Feature                       | Impact | Effort | Priority |
| ----------------------------- | ------ | ------ | -------- |
| Platform selection for income | High   | Low    | **P1**   |
| Self-employment tax in report | High   | Low    | **P1**   |
| Delivery expense categories   | Medium | Low    | **P1**   |
| Tip vs base pay tracking      | Medium | Medium | **P2**   |
| Quarterly tax reminders       | High   | Medium | **P2**   |
| Multi-platform summary        | Medium | Medium | **P2**   |
| Health insurance deduction    | Medium | Low    | **P2**   |
| EV charging enhancements      | Low    | Medium | **P3**   |
| Shopping time tracking        | Low    | High   | **P3**   |

---

_Generated: January 2026_
