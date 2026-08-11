# Owner input needed

This file lists everything that was removed from the Canbri site because it could not be verified, and exactly what's needed to bring each item back. It also explains the new, admin-driven way contact details are managed.

## Removed sections (fabricated content)

These were scaffold placeholder content that made specific, checkable claims Canbri could not currently back up. Each has been deleted from the homepage. None of this is unfixable — it just needs real information.

### Awards & Certifications
**What it was:** A section claiming four credentials — PPE Quality Compliance (2024) from the Standards Association of Zimbabwe, ISO 9001:2015 alignment, Food-Safe Ice Production (2024) from City of Harare Public Health, and SME Supplier of the Year (2023) from the Zimbabwe National Chamber of Commerce — plus a "4.9/5 average rating across 180+ verified reviews" claim.
**Why removed:** These name real institutions and make a public-health claim about a food-adjacent product (ice). None of it was verifiable.
**To reinstate:** For each real credential, supply the certificate/registration number, the issuing body's name exactly as it appears on the certificate, and the issue date. If the rating claim is real, supply the actual number of reviews and where they're published.

### Partners & Brands
**What it was:** Logos for Bosch, Makita, 3M, Stanley, Bostik, PPE Africa, Lyreco and DeWalt under a "Partners" heading.
**Why removed:** Displaying trademarked logos under "Partners" implies an authorised-dealer or distribution relationship. Using a trademark this way without an agreement is a legal risk.
**To reinstate:** For each brand Canbri actually stocks or has an agreement with, confirm the relationship (stockist vs. authorised distributor) so the section can be reframed accurately (e.g. "Brands we stock" instead of "Partners").

### Testimonials
**What it was:** Six named customers (Tendai M., Sarah K., Michael R., Grace D., James P., Esther N.) with quotes and star ratings.
**Why removed:** These customers don't exist. Publishing invented reviews is misleading advertising.
**To reinstate:** Collect real testimonials with the customer's consent to be named (or use initials/company name only, per their preference).

### Leadership Team
**What it was:** Four staff members (Tendai Moyo, Rumbi Chiweshe, Farai Dube, Nyasha Kadungure) with invented titles and bios, including a service promise attributed to a person who doesn't exist ("makes sure every enquiry gets a same-day reply").
**Why removed:** No real people behind these names or the commitments attributed to them.
**To reinstate:** Provide real team members' names, titles, and (optionally) photos and bios, with their consent to be listed publicly.

### Blog / Resources & Insights
**What it was:** Four invented articles with titles and dates.
**Why removed:** No real content exists behind these.
**To reinstate:** Either write real articles, or leave this section out — an empty blog reads as new, a fake one reads as dishonest.

## Contact details — now admin-driven, not hardcoded

Real phone number, WhatsApp number, and email are **no longer hardcoded in the codebase**. They live in the backend as site settings, and the WhatsApp/call buttons across the site automatically hide themselves until a real number is set — no more dead links to a fake `+263770000000`.

**What you need to do:**
1. Visit `/admin` on the live site. Since no admin account exists yet, you'll see a one-time signup form. Create the account with your real email and a strong password — this is the site's only administrator account, and this signup form disappears (locks to login-only) the moment it's used.
2. Log in and open the **Settings** tab.
3. Enter the real phone number, WhatsApp number, and contact email, and save. Changes go live immediately — no code changes or deployment needed.

The real values you provided (`+263 71 427 8269`, `+263 77 327 8269` for WhatsApp, `Canbrifinance@gmail.com`) are now the **default seed data** for fresh installs of the database, but the live production database already has its own settings rows from before, so you still need to go through steps 1–3 above once to make them live there. I deliberately didn't write to the production database directly.

If you lose access to that admin account, a developer will need to reset it directly in the database, since the signup form won't reopen once an admin exists.

## Address and logo — done

- **Address:** "7th Floor, ZB Chambers, Corner First Street & George Silundika Avenue, Harare" is now hardcoded across the site (Visit Us section, JSON-LD structured data). The second, unconfirmed "Murewa" branch was removed rather than kept as a placeholder — the Visit Us section now shows the one real Harare office.
- **Branch phone:** left blank rather than hardcoded — the office uses the same number you enter in the Settings tab, so it didn't need duplicating.
- **Logo:** extracted from the PDF you sent, cleaned up (sharpened, background removed, stray scan artifact cropped out), and wired in as the real favicon (all standard sizes, including `apple-touch-icon.png` for iOS home screens), the header/footer mark (swapped for the old placeholder Snowflake icon — the footer/dark-mode header now uses a white variant so it stays visible on the navy background), and the JSON-LD Organization logo (previously pointed at an SVG, which Google's structured data doesn't accept — now a raster PNG). The old scaffold `logo.svg`/`favicon.svg` (an unrelated generic icon and a snowflake, neither the real Canbri mark) were deleted.
- Given the source was a phone-scanned PDF, the logo has some inherent softness at very large sizes. If you have a higher-resolution or vector (AI/EPS/SVG) version of the logo, sending it would let a future pass swap in a crisper asset without changing any of the wiring.

## Found but not touched (zero public exposure)

`frontend/content/products.ts` contains a `seedProducts` array with fabricated customer review quotes and reviewer names (e.g. "Tendai M.", "Rumbi K.") attached to each product. This data is **not used anywhere on the live site** — products are now served from the real backend catalogue, and nothing renders this field — so it was left in place rather than touched in this pass. It's flagged here so it gets cleaned up (or replaced with real reviews) rather than accidentally reintroduced later.

## Still needs verification

- **`Canbrifinance@gmail.com`** — confirm this mailbox is actively monitored before it's relied on for customer enquiries.
- **Facebook (`facebook.com/canbri`) and Instagram (`instagram.com/canbri`) links** — confirm these are Canbri's actual, active accounts.
