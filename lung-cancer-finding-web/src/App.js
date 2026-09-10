import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError("");
    }
  }

  async function analyzeImage() {
    if (!image) {
      setError("Choose an image before running an analysis.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/predict`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setError("We could not reach the analysis service. Check the API URL and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <header className="topbar">
        <span className="brand-mark">C</span>
        <span className="brand-name">Cinder</span>
        <span className="beta-tag">BETA</span>
      </header>

      <main className="shell">
        <section className="intro">
          <p className="eyebrow">Lung image screening</p>
          <h1>A clearer first look at your scan.</h1>
          <p className="intro-copy">
            Upload a chest image for a quick model-assisted classification.
          </p>
        </section>

        <section className="workspace" aria-label="Image analysis">
          <div className="upload-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">01 / Upload</p>
                <h2>Choose an image</h2>
              </div>
              <span className="file-type">JPG, PNG</span>
            </div>

            <label className={`dropzone${preview ? " has-preview" : ""}`}>
              {preview ? (
                <img src={preview} alt="Selected scan preview" className="preview" />
              ) : (
                <>
                  <span className="upload-icon">+</span>
                  <span className="dropzone-title">Drop an image here</span>
                  <span className="dropzone-hint">or tap to browse your files</span>
                </>
              )}
              <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} />
            </label>

            <button className="analyze-button" onClick={analyzeImage} disabled={loading}>
              {loading ? "Analyzing..." : "Run analysis"}
              {!loading && <span aria-hidden="true">&#8594;</span>}
            </button>
            {error && <p className="error-message" role="alert">{error}</p>}
          </div>

          <div className="result-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">02 / Result</p>
                <h2>Model assessment</h2>
              </div>
              <span className="status-dot" aria-label="Ready" />
            </div>

            {result ? (
              <div className="result-content">
                <p className="result-label">Classification</p>
                <p className={`result-value ${result.prediction === "cancerous" ? "is-concerning" : ""}`}>
                  {result.prediction}
                </p>
                <div className="confidence-row">
                  <span>Confidence</span>
                  <strong>{(result.confidence * 100).toFixed(1)}%</strong>
                </div>
                <div className="probability-list">
                  <div><span>Non-cancerous</span><strong>{((result.probabilities?.["non-cancerous"] || 0) * 100).toFixed(1)}%</strong></div>
                  <div><span>Cancerous</span><strong>{((result.probabilities?.cancerous || 0) * 100).toFixed(1)}%</strong></div>
                </div>
              </div>
            ) : (
              <div className="empty-result">
                <span className="empty-line" />
                <p>Your result will appear here after analysis.</p>
              </div>
            )}
          </div>
        </section>

        <p className="disclaimer">For research support only. This tool does not replace professional medical advice.</p>
      </main>
    </div>
  );
}

export default App;