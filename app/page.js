"use client";

import { useState } from "react";
import Carousel from "./components/Carousel";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Single image upload
  const handleTestPhoto = async () => {
    if (!selectedImage) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);

    const res = await fetch("https://yolo-backend-dmn3.onrender.com/predict/", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setResult({ image_base64: data.image_base64, detections: data.detections });
    setLoading(false);
  };

  // ZIP file upload
  /*const handleZipSelect = async () => {
  if (!zipFile) return;
  setLoading(true);

  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(zipFile);
  let totalDetections = {};

  // Get all image files from ZIP
  const files = Object.values(zip.files).filter(
    (f) => !f.dir && /\.(png|jpe?g)$/i.test(f.name)
  );

  for (let f of files) {
    try {
      // Extract blob from ZIP
      const blob = await f.async("blob");

      // Wrap blob in a File to mimic normal single-image upload
      const fileObj = new File([blob], f.name, { type: blob.type || "image/jpeg" });

      // Send to backend
      const formData = new FormData();
      formData.append("file", fileObj);

      const res = await fetch("https://yolo-backend-dmn3.onrender.com/predict/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();

      // Aggregate detections
      data.detections.forEach((d) => {
        totalDetections[d.label] = (totalDetections[d.label] || 0) + 1;
      });

      // Short delay between uploads to be safe
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`Error on ${f.name}:`, err);
    }
  }

  // Convert aggregate tally to array for display
  const detectionArray = Object.entries(totalDetections).map(([label, count]) => ({
    label,
    confidence: count, // count for ZIP mode
    bbox: [], // no bbox for aggregate
  }));

  setResult({ image_base64: null, detections: detectionArray, zipMode: true });
  setLoading(false);
};*/



  return (
    <main className="px-4 bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="text-center py-8 bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-md">
        <h1 className="text-4xl font-bold">YOLO Object Detection</h1>
      </header>

      {/* Carousels */}
      <div className="my-8 flex justify-center">
        <Carousel slides={["/img1.jpg","/img2.jpg", "/img3.jpg", "img4.jpg", "img5.jpg"]} className="w-3/4" />
      </div>
        <div className="my-8 flex justify-center">
            <Carousel slides={["/imgA.jpg","/imgB.jpg"]} className="w-3/4" />
        </div>

      {/* Upload Section */}
      <div className="flex justify-center items-start space-x-8 my-8">
        {/* Left: Uploaded Image */}
        <div className="w-1/2 h-160 border-4 border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
          {selectedImage ? (
            <img
              src={zipFile ? "/zip.jpg" : URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="max-h-full max-w-full rounded-lg"
            />
          ) : (
            <p className="text-gray-400">No image selected</p>
          )}
        </div>

        {/* Right: Buttons */}
        <div className="w-1/2 h-160 border-4 border-gray-300 rounded-xl flex flex-col items-center justify-center space-y-4 bg-gray-50">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => { setSelectedImage(e.target.files[0]); setZipFile(null); }}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="w-48 py-4 bg-blue-500 text-white font-semibold rounded-xl text-center cursor-pointer hover:bg-blue-600">
            Select Photo
          </label>



          <button
            onClick={handleTestPhoto}
            className="w-48 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all"
          >
            {loading ? "Processing..." : "Test Selected Photo"}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="flex justify-center items-start space-x-8 my-8">
          {/* Left: Annotated Image */}
          <div className="w-1/2 h-160 border-4 border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
            {!result.zipMode && result.image_base64 ? (
              <img src={`data:image/jpeg;base64,${result.image_base64}`} alt="Detected" className="max-h-full max-w-full rounded-lg" />
            ) : (
              <img src="/zip.jpg" alt="ZIP" className="max-h-full max-w-full rounded-lg" />
            )}
          </div>

          {/* Right: Text Details */}
<div className="w-1/2 h-160 border-4 border-gray-300 rounded-xl p-4 bg-gray-50 overflow-auto">
  {result.detections.map((d, i) => (
    <div key={i} className="text-gray-800 mb-2">
      <p><span className="font-semibold">identified animal:</span> {d.label}</p>
      <p><span className="font-semibold">confidence:</span> {(d.confidence * 100).toFixed(1)}%</p>
    </div>
  ))}
</div>

        </div>
      )}
    </main>
  );
}
