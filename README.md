# Cinder

## Deploy the frontend to Vercel

In Vercel, import the repository and set the project root to `lung-cancer-finding-web`. The included `vercel.json` uses the existing Create React App build and publishes the `build` directory.

Add this environment variable in the Vercel project settings:

```text
REACT_APP_API_URL=https://your-api-host.example.com
```

The API must also allow the Vercel domain. Set `FRONTEND_ORIGIN` in the backend environment to the deployed frontend URL. For local development, copy `lung-cancer-finding-web/.env.example` to `.env` and use the default local API URL.

## Deploy the backend to Vercel

Create a second Vercel project from this same repository:

1. Set the project root directory to the repository root, `Cinder`.
2. Leave the framework preset as `Other`.
3. Deploy. The root `vercel.json` routes requests to `api/index.py`.
4. Set `FRONTEND_ORIGIN` to the deployed frontend URL in the backend project's environment variables.
5. Set the frontend project's `REACT_APP_API_URL` to the backend project's URL, then redeploy the frontend.

The backend endpoint will be available at:

```text
https://your-backend-project.vercel.app/predict
```

The Vercel API uses the lightweight packages in `requirements.txt` and the exported `cinder_model.onnx` artifact, including its `cinder_model.onnx.data` weight file. Training-only packages remain in `requirements-training.txt`.

## Deploy the API

Create a Render web service from this repository. Render can use the included `render.yaml`, or these settings:

```text
Build command: pip install -r requirements-training.txt
Start command: uvicorn backend.api:app --host 0.0.0.0 --port $PORT
```

After Render gives you an HTTPS URL, set `REACT_APP_API_URL` in Vercel to that URL without a trailing slash. Set the API's `FRONTEND_ORIGIN` to the Vercel URL, then redeploy the frontend so the variable is included in its build.
# Cinder


# Cinder is a powerful PyTorch Lung Cancer finding model, made using ResNet50
