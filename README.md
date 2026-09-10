# Cinder

## Deploy the frontend to Vercel

In Vercel, import the repository and set the project root to `lung-cancer-finding-web`. The included `vercel.json` uses the existing Create React App build and publishes the `build` directory.

Add this environment variable in the Vercel project settings:

```text
REACT_APP_API_URL=https://your-api-host.example.com
```

The API must also allow the Vercel domain. Set `FRONTEND_ORIGIN` in the backend environment to the deployed frontend URL. For local development, copy `lung-cancer-finding-web/.env.example` to `.env` and use the default local API URL.

## Deploy the API

Create a Render web service from this repository. Render can use the included `render.yaml`, or these settings:

```text
Build command: pip install -r requirements.txt
Start command: uvicorn backend.api:app --host 0.0.0.0 --port $PORT
```

After Render gives you an HTTPS URL, set `REACT_APP_API_URL` in Vercel to that URL without a trailing slash. Set the API's `FRONTEND_ORIGIN` to the Vercel URL, then redeploy the frontend so the variable is included in its build. The API uses the exported `cinder_model.onnx` artifact and its `cinder_model.onnx.data` weight file.
# Cinder


# Cinder is a powerful PyTorch Lung Cancer finding model, made using ResNet50
