import { Inter } from "next/font/google";
import React,{useState, ChangeEvent, FormEvent} from "react";


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      setConvertedImage(URL.createObjectURL(blob));
    }
  };

  return (
    <div>
      <h1>Image to JPG Converter</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Convert to JPG</button>
      </form>
      {convertedImage && (
        <div>
          <h2>Converted Image:</h2>
          <img src={convertedImage} alt="Converted JPG" />
          <a href={convertedImage} download="converted.jpg">Download JPG</a>
        </div>
      )}
    </div>
  );
}