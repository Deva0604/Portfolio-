# Portfolio Email Setup Guide

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
cd /home/deva/portfolio
npm install
```

### 2. **Create `.env` File**
Copy `.env.example` and rename to `.env`:
```bash
cp .env.example .env
```

### 3. **Configure Gmail (Recommended)**

#### Using Gmail App Password:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to **App passwords** → Select Mail & Windows
4. Copy the 16-character app password
5. In `.env`, set:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
RECIPIENT_EMAIL=devameg2007@gmail.com
```

#### Or use other services:
- **Outlook/Hotmail**: Change `EMAIL_SERVICE=outlook365`
- **SendGrid**: Use API key instead
- **AWS SES**: Configure accordingly

### 4. **Run the Server**
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

---

## 📧 How It Works

✅ **Visitor's Message** → Server receives → **Your Email**  
✅ **Confirmation Email** → Sent to visitor automatically  
✅ **Reply-To Set** → You can reply directly to their email

---

## 🔒 Security Tips

- Never share your `.env` file
- Use App Passwords, not your actual Gmail password
- Keep `node_modules` out of version control (already in `.gitignore`)
- Validate all inputs (already done in server.js)

---

## 🐛 Troubleshooting

### **"Failed to send email"**
- Check `.env` file exists and is correct
- Verify SMTP credentials are valid
- Ensure 2-Step Verification is enabled for Gmail

### **"Cannot find module"**
- Run `npm install` again
- Delete `node_modules` and reinstall

### **"Port 3000 already in use"**
- Change `PORT=3001` in `.env`

---

## 📱 Deployment

### **For production (Render, Railway, Heroku):**
1. Push code to GitHub
2. Connect to deployment service
3. Add environment variables in dashboard
4. Deploy!

**Recommended services:**
- **Render.com** (Free tier available)
- **Railway.app** (Simple setup)
- **Vercel + AWS Lambda** (Serverless)

---

## 💡 Features

✨ Real-time email delivery  
✨ Auto-reply to visitors  
✨ Professional email formatting  
✨ Input validation  
✨ Error handling  
✨ Mobile-friendly  

---

**Created for:** Devapriyan R's Portfolio  
**Stack:** Node.js + Express + Nodemailer
