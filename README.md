# HealthcarePro

A modern AI-powered healthcare assistant that analyzes medical images like skin conditions, wounds, or rashes. It provides:

* **Possible diagnosis**
* **Confidence level and severity rating**
* **Brief description of the condition**
* **Recommended treatments**
* **Prevention tips**
* **Critical warning signs requiring urgent care**

---

### ✨ Features

* Upload medical images securely
* Compress and resize images on the frontend to reduce size
* Send images to Google Gemini for analysis
* Receive structured JSON responses for easy display
* Responsive, user-friendly UI
* Handles errors gracefully

---

### 🚀 Tech Stack

* **Frontend:** Next.js, React
* **Backend:** Next.js API routes
* **AI:** Google Gemini (e.g., `gemini-1.5-flash`)
* **Image Compression:** HTML Canvas for resizing and quality reduction

---

### ⚙️ How It Works

1.  User selects a medical photo.
2.  The frontend compresses the image:
    * Maximum dimension: 800px
    * JPEG quality around 80%
3.  The compressed image is converted to Base64.
4.  Base64 data is sent to a Next.js API route.
5.  The API calls Google Gemini with:
    * a custom medical analysis prompt
    * the compressed image
6.  Gemini responds with a diagnosis and treatment details.
7.  Frontend displays the result beautifully!

---

### 🌐 Environment Variables

The app uses an environment variable for the Google API key:

* `GEMINI_API_KEY` → your Google Gemini API key

