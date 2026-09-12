# Ivy Homes · Mumbai Real Estate Portal & API Forensic Audit

A web frontend and data verification suite built for the **Ivy Homes Software Engineering Internship (September 2026)**.

---

## 1. How to Run the Application

### Prerequisites
- Node.js (v18 or higher, tested on v22.20.0)
- npm (v9 or higher)

### Setup & Launch
```bash
# 1. Install dependencies
npm install

# 2. Launch development server
npm run dev

# 3. Or build and preview production build
npm run build
npm run preview
```
Open `http://localhost:5173` in your browser.

### Demo Credentials
Pre-configured 1-click login is available on the `/login` screen:
- `demo1@ivy.homes` (Buyer profile)
- `demo2@ivy.homes` (Investor profile)
- `demo3@ivy.homes` (Tenant profile)
- Password: `000ac94860`

---

## 2. Architectural Features (The 6 Mandatory Requirements)

1. **Authentication & Session Resilience:**
   - Real authentication against `POST /auth/login`.
   - **Discrepancy Solved:** The documentation claimed tokens are valid for 24 hours with no refresh flow. In reality, `access_token` expires in **15 minutes (900s)**. A background heartbeat token refresh daemon (`POST /auth/refresh`) runs every 10 minutes, keeping the session fully functional well past 30 minutes and across browser refreshes.
2. **Browse Listings & Resilient Filtering:**
   - Multi-attribute filtering (Locality, BHK, Price Range, Furnishing, Search Query).
   - **Discrepancy Solved:** The server quietly ignores `order=desc` (always returning ascending) and clamps `limit` at 50. The frontend implements client-side fallback sorting and filtering to guarantee 100% precision.
   - Built-in **Trust Shield** to toggle visibility of corrupt and enquiry-bait records.
3. **Listing Detail View:**
   - Route `/listings/:id` reachable by direct URL.
   - Detailed specifications, verified contact representative card, and safety flags.
   - **Discrepancy Solved:** Documentation specified singular `/v1/listing/{id}` (which 404s). Plural `/v1/listings/{id}` is used.
   - **Similar Properties:** Since `/v1/listings/{id}/similar` returns 404, similar properties are computed dynamically (same locality, same BHK, within ±20% budget).
4. **Saved Listings (Favorites):**
   - Real-time synchronization with `GET /v1/saved`, `POST /v1/saved` (with payload `{ listing_id }`), and `DELETE /v1/saved/{listing_id}`.
   - Survives page reload and re-login, partitioned per demo user.
5. **Rentals & Projects:**
   - **Rentals (`/rentals`):** Highlights assigned locality **Malad West** with verified monthly rents, security deposits, and maintenance charges.
   - **Projects (`/projects`):** Displays builder developments with RERA registration and **corrected price ranges in Crores** (e.g. ₹4.03 - ₹9.19 Cr) rather than the documented integer rupees.
6. **Market Insights (`/insights`):**
   - Fulfills the promised `/v1/analytics/summary` aggregates (which 404s on the server) by calculating true city-wide medians, locality rate tables, and BHK distributions.
   - Features the **Ivy Truth Shield Report**: an interactive forensic breakdown of the 44 corrupt listings, 190 advance fee syndicate listings, and MagicHomes square meters normalization.

---

## 3. How We Worked Out Which Parts of the Documentation to Distrust

1. **Empirical Boundary Probing:**
   - We did not trust documented parameter names. We tested `api_key` as a query parameter vs `X-API-Key` in headers. The API explicitly rejected query parameter auth with:
     `"send your key in the X-API-Key request header, not as a query parameter"`.
   - We probed pagination limits (`limit=20, 100, 200, 500`). The server silently clamped any limit > 50 to `50`.
   - We tested `page=1` vs `page=2` and observed identical result sets, proving that `page` is quietly ignored and pagination relies strictly on `offset`.
2. **Dataset Exhaustion & Full Ingestion:**
   - We fully drained `/v1/listings`, `/v1/rentals`, and `/v1/projects` using `offset` until `has_more == false`.
   - We discovered that while `/v1/listings` claims `total: 4925`, there are actually **5,100 retrievable records**! Relying on `total / limit` would have missed 175 listings.
3. **Physical Reality & Domain Cross-Validation:**
   - Real estate obeys physical laws: carpet area cannot exceed super built-up area; floor numbers cannot exceed total building floors; prices cannot be negative; coordinates must fall within Mumbai geographic bounds (Lat ~19°N, Lon ~72.8°E).
   - This revealed exactly 44 corrupt records (exactly 11 in each of 4 categories).
4. **Fraud & Syndicate Identification:**
   - Analyzing phone number frequencies revealed 5 syndicate numbers with exactly 38 listings each (190 total).
   - Each number operated under 4–7 different company aliases and listed properties at ~50% of real market value while demanding advance booking tokens (`"Site visit only after the booking amount is paid"`).
5. **Unit Anomaly Detection:**
   - MagicHomes listings showed carpet areas such as 68, 78, 101. Comparing them with other portals for identical buildings revealed that MagicHomes reported values in **square meters** instead of square feet. Multiplying by 10.7639 restored them to standard dimensions.

---

## 4. Hypotheses That Did Not Pan Out (What We Checked That Was Fine)

1. **Negative Balconies or Covered Parking:**
   - *Hypothesis:* Perhaps corrupt listings also had negative balconies or parking slots.
   - *Result:* Checked all numeric counts; zero records had negative balconies, parking slots, or bathrooms. The corrupt records were strictly isolated to floor elevation, carpet/SBUA ratios, negative prices, and swapped lat/lon.
2. **Abnormal BHK Extremes (e.g. 20 BHK):**
   - *Hypothesis:* Corrupt listings might describe apartments with 20+ bedrooms or bathrooms.
   - *Result:* Maximum bedroom count was 5 BHK and maximum bathroom count was 5. All bedroom configurations were physically realistic.
3. **Plots with Zero Floors as Corrupt:**
   - *Hypothesis:* 202 records had `floor: 0` and `total_floors: 0`. We initially suspected this was corrupt data.
   - *Result:* Inspecting `property_type` revealed these were **plots of land**, where zero floors and equal carpet/super built-up area are completely valid.
4. **Rental Price Units:**
   - *Hypothesis:* Since project prices were in Crores rather than Rupees, perhaps rental prices were in thousands or lakhs.
   - *Result:* Rental prices across Mumbai ranged from ₹14,000 to ₹90,000 per month—completely authentic Indian Rupees.

---

## 5. What We Would Do With Another Two Days

1. **Interactive Leaflet/Mapbox Map:**
   - Render all 4,704 distinct properties on an interactive map of Mumbai with clustering, highlighting price-per-sqft heatmaps across micro-markets.
2. **Automated Syndicate Cluster Scoring:**
   - Train an automated heuristic classifier on phone number frequency, alias switching rate, and price discount ratios to flag new enquiry-bait listings in real time.
3. **Multi-Portal Price Comparison Strip:**
   - Since properties are cross-listed on SquareLane, MagicHomes, 100Acres, Dwelling, and ZeroBroker, display a comparison strip on the detail page showing price differences across portals for the same flat.
4. **End-to-End Cypress / Playwright Test Suite:**
   - Automated regression tests validating token refresh after 15 minutes, filter combinations, and bookmark persistence across sessions.

---

## 6. AI & Tooling Disclosure

As permitted and encouraged by the assignment brief, LLM assistance was utilized during this project for exploratory script scaffolding, endpoint discrepancy testing, and frontend UI development. All hypotheses, data analyses, and discrepancy validations were empirically tested and reproduced against the live API.