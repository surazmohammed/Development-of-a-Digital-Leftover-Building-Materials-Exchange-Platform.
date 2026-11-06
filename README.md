# ReBuild Exchange
### Digital Leftover Building Materials Exchange Platform

A responsive frontend mini project built with **HTML, CSS, and vanilla JavaScript**. It demonstrates a marketplace where people can list, discover, sell, exchange, or give away reusable leftover construction materials.

## Features
- Responsive homepage and navigation for mobile, tablet and desktop
- Material marketplace with keyword search, combined filters and sorting
- Material details with location, quantity, condition and seller contact actions
- Listing form with conditional sale/exchange/giveaway fields and validation
- Image preview and file type/size checks
- Create, edit, delete and change listing status
- Saved favorites
- Browser `localStorage` persistence
- Demo listings and a reset-demo-data control
- No build step or external JavaScript framework required

## Run the project
1. Extract the ZIP file.
2. Open `index.html` in a modern browser.
3. For a more reliable local development experience, open the folder in VS Code and use the **Live Server** extension.

The project uses remote Unsplash images and Google Fonts, so those assets require an internet connection. If you need a fully offline version, replace the remote image URLs with local files inside `assets/`.

## Folder structure
```text
leftover-materials-exchange/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── materials.js
│   ├── storage.js
│   ├── marketplace.js
│   ├── listing-form.js
│   ├── details.js
│   ├── favorites.js
│   └── app.js
└── assets/
```

## Important prototype limitations
- `localStorage` data belongs to the current browser and device. It is not a shared database.
- There is no real user authentication, seller verification, payment processing or server-side administration.
- Demo contact details and listing availability are illustrative and unverified. Do not use them to arrange real transactions.
- Uploaded images are stored as data URLs in localStorage, which has limited capacity. Keep uploads small.
- The project is a frontend demonstration, not a production marketplace.

## Main technologies
- HTML5
- CSS3 (responsive layouts, CSS Grid and Flexbox)
- Vanilla JavaScript
- Browser localStorage

## Project purpose
To demonstrate how a digital platform can encourage reuse of leftover construction materials, connect material owners with interested people, and help reduce avoidable construction waste.
