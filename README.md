# Aditya Bhat Portfolio

Portfolio website for Aditya Bhat, a full stack developer and web designer based in Goa, India.

## Search engine optimization

- Each route has a unique title, description, canonical URL, Open Graph/Twitter metadata, and structured data.
- `npm run build` generates static route HTML metadata and an XML sitemap for the home, lookbook, contact, legal, and every project page.
- `public/robots.txt` points crawlers to the deployed sitemap.
- After deploying, submit `https://adityahemantbhat.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools, and verify the site in both services.

Search position cannot be guaranteed. Search Console verification, accurate public business/profile information, relevant third-party mentions, and earning reputable links are ongoing off-page work and cannot be performed by this static site build.

## Contact coupon

Set `VITE_CONTACT_COUPON_CODE` in your local `.env.local` file or deployment environment to enable the 10% contact-page coupon. `.env.example` uses `ADITYA10` as a sample code; choose your own code before sharing it.

This is a static, frontend-only offer: Vite embeds `VITE_` variables in the public site bundle, so the code is visible to visitors. Applying it includes the code and discount in the contact email or WhatsApp message; there is no backend or checkout to validate or automatically enforce the discount.
