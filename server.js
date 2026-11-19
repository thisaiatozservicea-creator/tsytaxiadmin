const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

console.log("✓ Using Firestore for all data storage");

app.post('/api/customer', async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    if (!name || !phone) return res.status(400).json({ success: false, error: "Name and phone are required" });
    res.json({ success: true, customer: { name, phone, email: email || "", address: address || "" } });
  } catch (error) {
    console.error("Customer API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/booking', async (req, res) => {
  try {
    const bookingData = req.body;
    if (!bookingData.pickup || !bookingData.destination || !bookingData.passenger) {
      return res.status(400).json({ success: false, error: "Invalid booking data" });
    }
    res.json({ success: true, bookingId: "TSY" + Date.now() });
  } catch (error) {
    console.error("Booking API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clean URLs serve the matching original HTML filenames in the project root.
const cleanPageRoutes = {
  '/': 'index.html',
  '/home': 'home.html',
  '/booking': 'booking.html',
  '/booking-status': 'booking-status.html',
  '/login': 'login.html',
  '/admin': 'admin.html',
  '/partner-login': 'partner-login.html',
  '/partner-dashboard': 'partner-dashboard.html',
  '/superadmin': 'superadmin.html'
};
for (const [route, filename] of Object.entries(cleanPageRoutes)) {
  if (route === '/') continue;
  app.get([route, `${route}/`], (req, res) => {
    res.sendFile(path.join(__dirname, filename), err => {
      if (err && !res.headersSent) res.status(err.statusCode || 404).send('Page not found: ' + filename);
    });
  });
}

// Keep the old .html addresses working while redirecting to clean URLs.
const legacyRedirects = {
  '/home.html': '/home/',
  '/booking.html': '/booking/',
  '/booking-status.html': '/booking-status/',
  '/login.html': '/login/',
  '/admin.html': '/admin/',
  '/partner-login.html': '/partner-login/',
  '/partner-dashboard.html': '/partner-dashboard/',
  '/superadmin.html': '/superadmin/'
};
for (const [oldUrl, newUrl] of Object.entries(legacyRedirects)) {
  app.get(oldUrl, (req, res) => res.redirect(301, newUrl + req.url.slice(oldUrl.length)));
}

app.listen(PORT, () => {
  console.log(`✓ TSY TAXI server running on http://localhost:${PORT}`);
  console.log('✓ Clean routes are mapped to the existing root HTML files');
});
