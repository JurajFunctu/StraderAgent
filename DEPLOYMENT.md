# Railway Deployment Guide

## Prerequisites

- Railway account
- Railway CLI installed (optional, for CLI deployment)
- GitHub repository: https://github.com/JurajFunctu/StraderAgent

## Deployment Steps

### Method 1: Via Railway Dashboard (Recommended)

1. **Login to Railway**
   - Go to https://railway.app
   - Login to your account
   - Select workspace: **Functu** (id: 3f2fb2d4-5644-4f08-b0df-b43b65d55a2d)

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select: `JurajFunctu/StraderAgent`
   - Railway will automatically detect the repository

3. **Add PostgreSQL Database**
   - In the project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will provision a new PostgreSQL instance
   - The `DATABASE_URL` will be automatically available as an environment variable

4. **Configure Environment Variables**
   Railway will automatically set:
   - `DATABASE_URL` - from the PostgreSQL service
   - `PORT` - Railway automatically assigns this
   - `NODE_ENV` - set to `production`

   No additional configuration needed!

5. **Initial Deployment**
   - Railway will automatically build and deploy using `nixpacks.toml`
   - Build process:
     1. Install root dependencies
     2. Install client dependencies
     3. Build client (Vite)
     4. Build server (TypeScript)
   - First deployment takes 3-5 minutes

6. **Run Database Seed**
   After first deployment, run the seed command:
   - Go to your service
   - Open "Settings" → "Deploy"
   - Under "Custom Start Command", temporarily set: `npm run db:seed && npm start`
   - Redeploy
   - After successful seed, revert to: `npm start`

   **Or use Railway CLI:**
   ```bash
   railway run npm run db:seed
   ```

7. **Access Your Application**
   - Railway will provide a public URL (e.g., `straderagent.up.railway.app`)
   - The application will be live and accessible

### Method 2: Via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to workspace
railway link --workspace "Functu"

# Create new project
railway init

# Add PostgreSQL
railway add --plugin postgresql

# Deploy
railway up

# Run seed
railway run npm run db:seed
```

## Post-Deployment

### Verify Deployment

1. Check the service logs for any errors
2. Visit the provided URL
3. Test all four main sections:
   - Zákaznícky Agent (/)
   - Fakturačný Agent (/invoices)
   - Produktový Agent (/products)
   - Prehľady (/dashboard)

### Database Management

**To run migrations:**
```bash
railway run npm run db:push
```

**To re-seed database:**
```bash
railway run npm run db:seed
```

**To access database:**
```bash
railway run psql $DATABASE_URL
```

### Environment Variables Reference

| Variable | Description | Source |
|----------|-------------|--------|
| `DATABASE_URL` | PostgreSQL connection string | Auto-set by Railway |
| `PORT` | Application port | Auto-set by Railway |
| `NODE_ENV` | Environment (production) | Set to `production` |

## Automatic Deployments

Railway automatically deploys when you push to the `main` branch:

```bash
git add .
git commit -m "Update features"
git push origin main
```

Railway will:
1. Detect the push
2. Build the application
3. Run tests (if configured)
4. Deploy to production
5. Health check
6. Route traffic to new deployment

## Troubleshooting

### Build Fails

Check the build logs:
- Ensure all dependencies are in `package.json`
- Verify `nixpacks.toml` configuration
- Check TypeScript compilation errors

### Database Connection Issues

```bash
# Check DATABASE_URL is set
railway variables

# Test database connection
railway run npm run db:push
```

### Application Won't Start

- Check logs for runtime errors
- Verify `npm start` works locally
- Ensure all environment variables are set

### Performance Issues

- Check Railway metrics (CPU, Memory, Response Time)
- Consider upgrading to a larger plan if needed
- Optimize database queries
- Add Redis caching if needed

## Monitoring

- **Logs**: Available in Railway dashboard under "Deployments" → "Logs"
- **Metrics**: CPU, Memory, Network usage in "Metrics" tab
- **Alerts**: Configure alerts in Railway settings

## Backup & Recovery

Railway automatically backs up PostgreSQL:
- Backups are taken daily
- Restore from dashboard: Database → Backups → Restore

## Custom Domain (Optional)

1. Go to service settings
2. Click "Domains"
3. Add custom domain
4. Configure DNS records as shown
5. Railway will provision SSL certificate automatically

## Scaling

Railway provides automatic scaling:
- Horizontal scaling: Add more instances
- Vertical scaling: Increase CPU/Memory
- Configure in: Settings → Resources

## Cost Estimation

- **Starter Plan**: Free tier (limited resources)
- **Developer Plan**: $5/month per service
- **Team Plan**: Custom pricing

Estimated monthly cost for this app:
- Web Service: $5-20/month (depending on traffic)
- PostgreSQL: $5-10/month (depending on storage)
- **Total**: ~$10-30/month

## Support

- Railway Discord: https://discord.gg/railway
- Documentation: https://docs.railway.app
- GitHub Issues: https://github.com/JurajFunctu/StraderAgent/issues

---

## Quick Reference Commands

```bash
# Deploy
railway up

# View logs
railway logs

# Run command
railway run <command>

# Open in browser
railway open

# Environment variables
railway variables

# Database shell
railway run psql $DATABASE_URL
```

## Repository

GitHub: https://github.com/JurajFunctu/StraderAgent

## Production URL

After deployment, your app will be available at:
`https://<your-service-name>.up.railway.app`

---

**Deployment Status**: ✅ Ready for Railway Deployment
