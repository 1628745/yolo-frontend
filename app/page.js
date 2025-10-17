"use client";

import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  async function handleUpload(e) {
    e.preventDefault();

    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch("https://yolo-backend-dmn3.onrender.com/predict/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">YOLO Object Detector</h1>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="button" onClick={handleUpload}>Upload</button>

      {result && (
        <>
          <img src={`https://yolo-backend-dmn3.onrender.com${result.image_url}`} alt="Detected" />
          <ul>
            {result?.detections?.map((d, i) => (
              <li key={i}>{d.label} ({(d.confidence * 100).toFixed(1)}%)</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
