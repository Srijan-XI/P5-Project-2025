# Deployment Guide for Finance Tracker

## Deploy to Render.com (Recommended for Startups)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Sign up on Render
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: finance-tracker
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn run:app`
   - **Instance Type**: Free

### Step 4: Add Environment Variables
In Render dashboard, add:
- `SECRET_KEY`: (Generate a random secure key)
- `DATABASE_URL`: (Will be auto-filled when you add database)

### Step 5: Add PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Name it: `finance-tracker-db`
3. Select Free tier
4. Create database
5. Copy the "Internal Database URL"
6. Paste it as `DATABASE_URL` in your web service

### Step 6: Deploy!
- Click "Create Web Service"
- Wait 5-10 minutes for deployment
- Your app will be live at: `https://your-app-name.onrender.com`

### Step 7: Initialize Database
Run this command once in Render Shell:
```bash
python init_db.py
```

---

## Alternative: Railway.app

### Quick Deploy to Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize and deploy
railway init
railway up
```

Visit https://railway.app for more details.

---

## Alternative: PythonAnywhere

### Deploy to PythonAnywhere
1. Sign up at https://www.pythonanywhere.com
2. Upload your code via Git or Files
3. Create a new web app
4. Configure WSGI file
5. Set up virtualenv
6. Reload web app

Full guide: https://help.pythonanywhere.com/pages/Flask/

---

## Custom Domain Setup (After Deployment)

### On Render:
1. Go to Settings → Custom Domain
2. Add your domain (e.g., app.yourstartup.com)
3. Update DNS records at your domain registrar
4. SSL will be automatically configured

---

## Environment Variables for Production

```env
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
DATABASE_URL=postgresql://user:password@host:port/database
FLASK_ENV=production
DEBUG=False
```

Generate SECRET_KEY:
```python
import secrets
print(secrets.token_hex(32))
```

---

## Monitoring & Maintenance

### Free Monitoring Tools:
- **UptimeRobot** - Check if your app is up
- **Sentry** - Error tracking
- **Google Analytics** - User analytics

### Regular Maintenance:
- Check logs weekly
- Update dependencies monthly
- Backup database regularly
- Monitor resource usage

---

## Scaling Tips

### When to upgrade from Free tier:
- More than 100 daily active users
- Need faster response times
- Require 24/7 uptime (free tier sleeps after inactivity)
- Need more storage

### Cost Estimates:
- **Render**: Free → $7/month → $25/month
- **Railway**: $5 credit/month → $10-30/month
- **Heroku**: $7/month → $25/month

---

## Security Checklist Before Going Live

- [ ] Change SECRET_KEY to a strong random value
- [ ] Set DEBUG=False in production
- [ ] Use HTTPS (automatically handled by Render)
- [ ] Set up regular database backups
- [ ] Add rate limiting for API endpoints
- [ ] Enable CSRF protection (already included)
- [ ] Review and secure all environment variables
- [ ] Set up error monitoring
- [ ] Add logging for suspicious activities
- [ ] Configure proper CORS if needed

---

## Next Steps for Your Startup

1. **Deploy to Render** (takes 15 minutes)
2. **Set up custom domain** (optional, for branding)
3. **Add monitoring** (UptimeRobot + Sentry)
4. **Test thoroughly** (invite beta users)
5. **Scale as needed** (upgrade when you grow)

Good luck with your startup! 🚀