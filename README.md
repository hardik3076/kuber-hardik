# kuber-hardik
hi
Great! To help you fix the backend issue in your Kuber Pure Veg Restaurant Website (repo: HardikQuantumCybernetic/k2), let’s walk through the most common backend bugs and how to resolve them.

---

## 🔍 Most Common Backend Issues (from your previous context)

1. **MongoDB connection problems** (not connecting, wrong URI, not handling errors)
2. **API route mismatch** (frontend calling `/menu`, backend using `/api/admin/menu`, etc.)
3. **Incorrect response data structure** (frontend expects `data.statistics.totalOrders`, backend sends just `totalOrders`)
4. **Schema validation errors** (e.g., sending `orderType: 'Admin'` when only certain enums are allowed)
5. **Error handling in fetch requests** (frontend assumes JSON, backend sends error)
6. **Hardcoded sensitive info** (credentials in code, not in `.env`)

---

## 🔧 Step-by-step Fix

### 1. Fix MongoDB Connection and Error Handling

**In `backend/server.js`:**

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB Connected");
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
})
.catch(err => {
  console.error("MongoDB Connection Error:", err);
  process.exit(1); // Exit if DB is not connected
});
```

---

### 2. Match Response Structure With Frontend

**In `backend/routes/admin.js`:**  
Wrap your stats inside a `statistics` object.

```javascript
router.get('/dashboard', async (req, res) => {
  try {
    // ...get totals from DB
    const totalOrders = await Order.countDocuments();
    const totalMenuItems = await MenuItem.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
      statistics: {
        totalOrders,
        totalMenuItems,
        totalContacts,
        totalUsers,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard statistics.' });
  }
});
```

---

### 3. Ensure API Routes Match

**If your backend uses `/api/admin/menu`,**  
Make sure your frontend uses the same!

**In `frontend/script.js` (or your React component):**

```javascript
fetch(`${API_URL}/api/admin/menu`)
```

---

### 4. Use Valid Enum Values in Schema

**In `models/Order.js`:**

```javascript
const orderSchema = new mongoose.Schema({
  orderType: { type: String, enum: ['dine-in', 'takeaway', 'delivery'], required: true },
  // ...other fields
});
```
**In your admin order creation code, only use these values.**

---

### 5. Remove Hardcoded Credentials

**In `backend/scripts/seedData.js`:**

```javascript
const adminUser = new User({
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  role: 'admin'
});

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
}
```
Set these values in your `.env` file.

---

### 6. Add Robust Error Handling for Fetch

**In all fetch/axios calls:**

```javascript
fetch(url)
  .then(res => {
    if (!res.ok) throw new Error('Network or server error');
    return res.json();
  })
  .catch(err => {
    // Handle error in UI
  });
```

---

## ✅ Next Steps

- Make these code changes in your backend files.
- Ensure your `.env` is set up and not committed to GitHub!
- Restart your backend server after changes.
- Test your frontend against the updated backend.

---

If you want to see a specific file or want a PR-style summary, let me know!  
**Paste any error messages you get after making these changes for further help.**
