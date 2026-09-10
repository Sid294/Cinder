# Cinder

## Deploy the frontend to Vercel

In Vercel, import the repository and set the project root to `lung-cancer-finding-web`. The included `vercel.json` uses the existing Create React App build and publishes the `build` directory.

Add this environment variable in the Vercel project settings:

```text
REACT_APP_API_URL=https://your-api-host.example.com
```

The API must also allow the Vercel domain. Set `FRONTEND_ORIGIN` in the backend environment to the deployed frontend URL. For local development, copy `lung-cancer-finding-web/.env.example` to `.env` and use the default local API URL.
# Cinder


# Cinder is a powerful PyTorch Lung Cancer finding model, made using ResNet50
