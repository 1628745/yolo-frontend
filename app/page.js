"use client";

import { useState } from "react";
import Carousel from "./components/Carousel";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleTestPhoto = async () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append("file", selectedImage);

    const res = await fetch("https://yolo-backend-dmn3.onrender.com/predict/", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setResult(data);
  };

  /* include this
      <Carousel slides={["/imgA.jpg","/imgB.jpg"]} />*/
  return (
    <main className="px-4">
      {/* Header */}
      <header className="text-center py-8 bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-md">
        <h1 className="text-4xl font-bold">YOLO Object Detection</h1>
      </header>

      {/* Carousels */}
      <Carousel slides={["/img1.jpg","/img2.jpg"]} />

      {/* Upload Section */}
      <div className="flex justify-center items-start space-x-8 my-8">
        {/* Left: Uploaded Image */}
        <div className="w-1/2 h-128 border-4 border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
          {selectedImage ? (
            <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="max-h-full max-w-full rounded-lg" />
          ) : (
            <p className="text-gray-400">No image selected</p>
          )}
        </div>

        {/* Right: Buttons */}
        <div className="w-1/2 h-128 border-4 border-gray-300 rounded-xl flex flex-col items-center justify-center space-y-4 bg-gray-50">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files[0])}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
            Select Photo
          </label>
          <button
            onClick={handleTestPhoto}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Test Selected Photo
          </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="flex justify-center items-start space-x-8 my-8">
          {/* Left: Annotated Image */}
          <div className="w-1/2 h-128 border-4 border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
            <img src={`data:image/jpeg;base64,${result.image_base64}`} alt="Detected" className="max-h-full max-w-full rounded-lg" />
          </div>

          {/* Right: Text Details */}
          <div className="w-1/2 h-128 border-4 border-gray-300 rounded-xl p-4 bg-gray-50 overflow-auto">
            {result.detections.map((d, i) => (
              <p key={i} className="text-gray-800">
                {d.label} ({(d.confidence * 100).toFixed(1)}%) - [{d.bbox.map(v => v.toFixed(0)).join(", ")}]
              </p>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
