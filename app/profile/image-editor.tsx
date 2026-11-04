"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type React from "react";
import { updateProfileImages } from "../actions/profile";

type CropImage = {
  file: File;
  url: string;
  zoom: number;
  x: number;
  y: number;
};

function createCroppedImage(
  image: CropImage,
  aspect: number,
  width: number,
  height: number,
  filename: string
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Could not edit this image."));
        return;
      }

      let cropWidth: number;
      let cropHeight: number;

      if (img.width / img.height > aspect) {
        cropHeight = img.height;
        cropWidth = cropHeight * aspect;
      } else {
        cropWidth = img.width;
        cropHeight = cropWidth / aspect;
      }

      cropWidth /= image.zoom;
      cropHeight /= image.zoom;

      const cropX =
        (img.width - cropWidth) / 2 +
        (image.x / 100) * ((img.width - cropWidth) / 2);

      const cropY =
        (img.height - cropHeight) / 2 +
        (image.y / 100) * ((img.height - cropHeight) / 2);

      context.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        width,
        height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not process this image."));
            return;
          }

          resolve(new File([blob], filename, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.9
      );
    };

    img.onerror = () => reject(
      new Error("Could not load the selected image. Please choose it again.")
    );

    img.src = image.url;
  });
}

export default function ImageEditor() {
  const [avatar, setAvatar] = useState<CropImage | null>(null);
  const [banner, setBanner] = useState<CropImage | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const imageUrls = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      imageUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function selectImage(
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "banner"
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("Images must be smaller than 15 MB.");
      return;
    }

    setError("");

    const url = URL.createObjectURL(file);
    imageUrls.current.push(url);

    const selected: CropImage = {
      file,
      url,
      zoom: 1,
      x: 0,
      y: 0,
    };

    if (type === "avatar") {
      setAvatar(selected);
    } else {
      setBanner(selected);
    }

    event.target.value = "";
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!avatar && !banner) {
      setError("Choose a profile picture or banner first.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      if (avatar) {
        const cropped = await createCroppedImage(
          avatar,
          1,
          800,
          800,
          "avatar.jpg"
        );

        formData.append("avatar", cropped);
      }

      if (banner) {
        const cropped = await createCroppedImage(
          banner,
          3.2,
          1600,
          500,
          "banner.jpg"
        );

        formData.append("banner", cropped);
      }

      await updateProfileImages(formData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while editing your images."
      );

      setSaving(false);
    }
  }

  const sectionStyle = {
    background: "#090A14",
    border: "1px solid #302B4C",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "20px",
  };

  const buttonStyle = {
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: "9px",
    background: "#25203B",
    border: "1px solid #6746A8",
    color: "#FFFFFF",
    cursor: "pointer",
    fontWeight: 700,
  } as const;

  function renderEditor(
    type: "avatar" | "banner",
    image: CropImage | null
  ) {
    const isAvatar = type === "avatar";

    return (
      <div style={sectionStyle}>
        <h3 style={{ marginTop: 0 }}>
          {isAvatar ? "Profile picture" : "Profile banner"}
        </h3>

        <p style={{ color: "#9996B5", fontSize: "13px" }}>
          {isAvatar
            ? "Square crop — perfect for your profile."
            : "Wide crop — perfect for your profile header."}
        </p>

        {image && (
          <>
            <div
              style={{
                width: "100%",
                maxWidth: isAvatar ? "280px" : "100%",
                aspectRatio: isAvatar ? "1 / 1" : "3.2 / 1",
                margin: "20px auto",
                overflow: "hidden",
                borderRadius: isAvatar ? "50%" : "12px",
                border: "2px solid #8B5CF6",
                background: "#151629",
              }}
            >
              <img
                src={image.url}
                alt="Image crop preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: `${
                    50 + image.x / 2
                  }% ${50 + image.y / 2}%`,
                  transform: `scale(${image.zoom})`,
                }}
              />
            </div>

            <label style={{ display: "block", marginTop: "20px" }}>
              <span style={{ color: "#22D3EE", fontWeight: 700 }}>
                Zoom: {image.zoom.toFixed(1)}x
              </span>

              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={image.zoom}
                onChange={(event) => {
                  const zoom = Number(event.target.value);
                  const update = (old: CropImage | null) =>
                    old ? { ...old, zoom } : null;

                  if (isAvatar) setAvatar(update);
                  else setBanner(update);
                }}
                style={{ width: "100%", marginTop: "10px" }}
              />
            </label>

            <label style={{ display: "block", marginTop: "18px" }}>
              <span style={{ color: "#22D3EE", fontWeight: 700 }}>
                Move horizontally
              </span>

              <input
                type="range"
                min="-100"
                max="100"
                value={image.x}
                onChange={(event) => {
                  const x = Number(event.target.value);
                  const update = (old: CropImage | null) =>
                    old ? { ...old, x } : null;

                  if (isAvatar) setAvatar(update);
                  else setBanner(update);
                }}
                style={{ width: "100%", marginTop: "10px" }}
              />
            </label>

            <label style={{ display: "block", marginTop: "18px" }}>
              <span style={{ color: "#22D3EE", fontWeight: 700 }}>
                Move vertically
              </span>

              <input
                type="range"
                min="-100"
                max="100"
                value={image.y}
                onChange={(event) => {
                  const y = Number(event.target.value);
                  const update = (old: CropImage | null) =>
                    old ? { ...old, y } : null;

                  if (isAvatar) setAvatar(update);
                  else setBanner(update);
                }}
                style={{ width: "100%", marginTop: "10px" }}
              />
            </label>

            <button
              type="button"
              onClick={() => {
                if (isAvatar) setAvatar(null);
                else setBanner(null);
              }}
              style={{
                ...buttonStyle,
                marginTop: "18px",
                color: "#FF9BAF",
              }}
            >
              Remove selected image
            </button>
          </>
        )}

        <div style={{ marginTop: "20px" }}>
          <label style={buttonStyle}>
            {image ? "Choose another image" : "Choose image"}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => selectImage(event, type)}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave}>
      {renderEditor("avatar", avatar)}
      {renderEditor("banner", banner)}

      {error && (
        <p
          style={{
            background: "#451D2B",
            color: "#FF9BAF",
            padding: "14px",
            borderRadius: "9px",
            marginTop: "20px",
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        style={{
          width: "100%",
          marginTop: "25px",
          padding: "16px",
          border: "none",
          borderRadius: "10px",
          background: saving
            ? "#55516B"
            : "linear-gradient(90deg, #8B5CF6, #22D3EE)",
          color: "#FFFFFF",
          fontWeight: 900,
          cursor: saving ? "not-allowed" : "pointer",
          fontSize: "15px",
        }}
      >
        {saving ? "PROCESSING YOUR IMAGES..." : "SAVE EDITED IMAGES"}
      </button>
    </form>
  );
}
