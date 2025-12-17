/* eslint-disable */
import React, { useRef, useState, useEffect } from "react"
import axios from "axios"

const API_BASE_URL = "http://your-laravel-domain.test/api" // change this

// Your built-in icons (from /public or imported)
const PRESET_ICONS = [
  { id: "house", src: "/images/appIcon.png", label: "House" },
  { id: "tool", src: "/images/avatar.png", label: "Tool" },
//   { id: "broom", src: "/icons/broom.png", label: "Broom" },
//   { id: "briefcase", src: "/icons/briefcase.png", label: "Briefcase" },
//   { id: "palette", src: "/icons/palette.png", label: "Palette" },
//   { id: "car", src: "/icons/car.png", label: "Car" },
//   { id: "phone", src: "/icons/phone.png", label: "Phone" },
//   { id: "laptop", src: "/icons/laptop.png", label: "Laptop" },
//   { id: "burger", src: "/icons/burger.png", label: "Burger" },
//   { id: "docs", src: "/icons/docs.png", label: "Docs" },
//   { id: "books", src: "/icons/books.png", label: "Books" },
//   { id: "plane", src: "/icons/plane.png", label: "Plane" },
]

export default function IconUploadSelector() {
  const fileInputRef = useRef(null)

  const [selectedFile, setSelectedFile] = useState(null) // File to send to API
  const [previewUrl, setPreviewUrl] = useState(null) // For <img src>
  const [activeIconId, setActiveIconId] = useState(null) // Which preset is selected
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState("")

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // 🔹 When user clicks upload area
  const handleUploadAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // 🔹 When user selects file from disk
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Optional: size limit 2MB
    if (file.size > 2 * 1024 * 1024) {
      setMessage("File too large. Max 2MB.")
      e.target.value = ""
      return
    }

    setActiveIconId(null) // clear preset selection

    // Revoke previous blob URL if any
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }

    const blobUrl = URL.createObjectURL(file)
    setPreviewUrl(blobUrl)
    setSelectedFile(file)

    setMessage("")
  }

  // 🔹 When user clicks one of the bottom icons
  const handlePresetClick = async (icon) => {
    try {
      setMessage("")
      setActiveIconId(icon.id)

      // Fetch the image so we can send it as File via FormData
      const res = await fetch(icon.src)
      const blob = await res.blob()

      const file = new File(
        [blob],
        `${icon.id}.${blob.type.split("/")[1] || "png"}`,
        { type: blob.type || "image/png" }
      )

      setSelectedFile(file)
      setPreviewUrl(icon.src) // can directly use static src for preview
    } catch (err) {
      console.error(err)
      setMessage("Failed to load preset icon.")
    }
  }

  // 🔹 Send selectedFile to Laravel API
  const handleSendToDb = async () => {
    if (!selectedFile) {
      setMessage("Please upload or select an icon first.")
      return
    }

    try {
      setIsUploading(true)
      setMessage("")

      const formData = new FormData()
      formData.append("image", selectedFile)

      const token = localStorage.getItem("token") // if you use auth

      const res = await axios.post(`${API_BASE_URL}/upload-icon`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      })

      console.log("Upload response:", res.data)
      setMessage("Icon uploaded successfully!")
    } catch (error) {
      console.error(error)
      setMessage("Failed to upload icon.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      {/* Upload / preview box */}
      <div style={styles.uploadCard}>
        <div style={styles.uploadArea} onClick={handleUploadAreaClick}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected icon"
              style={styles.previewImage}
            />
          ) : (
            <div style={styles.emptyUpload}>
              <div style={styles.uploadIcon}>⬆️</div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <div style={styles.uploadText}>
          <div style={{ fontWeight: 500 }}>Upload Icon or Select Emoji</div>
          <div style={{ fontSize: 12, color: "#888" }}>
            PNG, JPG or Emoji (Max 2MB)
          </div>
        </div>

        {/* Preset icons row */}
        <div style={styles.iconRow}>
          {PRESET_ICONS.map((icon) => (
            <button
              key={icon.id}
              type="button"
              onClick={() => handlePresetClick(icon)}
              style={{
                ...styles.iconButton,
                ...(activeIconId === icon.id ? styles.iconButtonActive : {}),
              }}
            >
              <img
                src={icon.src}
                alt={icon.label}
                style={{ width: 28, height: 28 }}
              />
            </button>
          ))}
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSendToDb}
          disabled={isUploading}
          style={{
            ...styles.sendButton,
            ...(isUploading ? styles.sendButtonDisabled : {}),
          }}
        >
          {isUploading ? "Uploading..." : "Send to DB"}
        </button>

        {message && <div style={styles.message}>{message}</div>}
      </div>
    </div>
  )
}

// Simple inline styles to roughly match your design
const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  uploadCard: {
    border: "1px dashed #d0d7de",
    borderRadius: 12,
    padding: 16,
    width: 320,
    textAlign: "center",
    background: "#fff",
  },
  uploadArea: {
    width: 72,
    height: 72,
    borderRadius: 12,
    background: "#f5f7fa",
    margin: "0 auto",
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden",
  },
  emptyUpload: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  uploadIcon: {
    fontSize: 28,
    color: "#7a7f87",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  uploadText: {
    marginBottom: 12,
  },
  iconRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginBottom: 12,
  },
  iconButton: {
    borderRadius: 8,
    border: "1px solid transparent",
    background: "#f9fafb",
    padding: 4,
    cursor: "pointer",
  },
  iconButtonActive: {
    borderColor: "#3b82f6",
    background: "#e0edff",
  },
  sendButton: {
    width: "100%",
    padding: "8px 0",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
    marginTop: 4,
  },
  sendButtonDisabled: {
    opacity: 0.6,
    cursor: "default",
  },
  message: {
    marginTop: 8,
    fontSize: 12,
    color: "#444",
  },
}
