# Before you publish
1. index.html, CONFIG: set formKey (free key from web3forms.com, sent to contact@privatehirelimousine.com). Until set, "Send to us directly" falls back to WhatsApp.
2. index.html, CONFIG: set licence, e.g. "Trade licence No. ... | RTA/ITC permit No. ...". It shows in the footer.
3. Check fleet capacities and guide prices. Add fixed airport transfer prices to the Pricing table.
4. Have a lawyer review Privacy, Terms and cancellation/waiting terms (the wording now says they are confirmed in the quotation).
5. Cloudflare: turn on Web Analytics (then update the Privacy Policy), and Email Routing for contact@.
6. Add real reviews when you have them.

# Adding a new article
1. Copy an existing article folder (for example `louvre-abu-dhabi`), rename it, and edit its `index.html` and image.
2. Open `articles.json` and add one entry at the TOP of the list:
   `{"title": "Burj Khalifa Dubai", "url": "/burj-khalifa-dubai/", "date": "2026-12-01", "description": "One sentence."},`
   (Every entry except the last must end with a comma.)
3. Commit. The Travel Guide menu and the All articles page update by themselves. Add the new page to `sitemap.xml` by hand.
   The menu shows the newest 5 articles. The All articles page shows every one.
