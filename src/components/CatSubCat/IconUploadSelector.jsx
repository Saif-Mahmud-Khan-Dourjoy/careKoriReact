/* eslint-disable */
import React, { useEffect, useRef, useState } from "react"
import suitcaseIcon from "/images/suitcase.png"
import bookIcon from "/images/book.png"
import broomIcon from "/images/broom.png"
import carIcon from "/images/car.png"
import colorPalette from "/images/color-palette.png"
import foodIcon from "/images/food.png"
import houseIcon from "/images/house.png"
import phoneIcon from "/images/iphone.png"
import laptopIcon from "/images/laptop.png"
import officeIcon from "/images/office-building.png"
import planeIcon from "/images/plane.png"
import wrenchIcon from "/images/wrench.png"
import { FiUploadCloud } from "react-icons/fi"

// Your built-in icons (from /public or imported)
const PRESET_ICONS = [
  { id: "suitcase", src: suitcaseIcon, label: "Suitcase" },
  { id: "book", src: bookIcon, label: "Book" },
  { id: "broom", src: broomIcon, label: "Broom" },
  { id: "car", src: carIcon, label: "Car" },
  { id: "color-palette", src: colorPalette, label: "Color Palette" },
  { id: "food", src: foodIcon, label: "Food" },
  { id: "house", src: houseIcon, label: "House" },
  { id: "phone", src: phoneIcon, label: "Phone" },
  { id: "laptop", src: laptopIcon, label: "Laptop" },
  { id: "office", src: officeIcon, label: "Office" },
  { id: "plane", src: planeIcon, label: "Plane" },
  { id: "wrench", src: wrenchIcon, label: "Wrench" },
]

/**
 * Props:
 *  - initialPreview: existing icon URL (for edit mode) or null
 *  - onChange(file: File) => void  // selected file for FormData
 */
export default function IconUploadSelector({
  initialPreview = null,
  onChange,
  touch,
  error
}) {
  const fileInputRef = useRef(null)

  const [previewUrl, setPreviewUrl] = useState(initialPreview)
  const [activeIconId, setActiveIconId] = useState(null)

  // Cleanup blob URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  useEffect(() => {
    setPreviewUrl(initialPreview || null)
    setActiveIconId(null)
  }, [initialPreview])

  const handleUploadAreaClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  // When user selects file from disk
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Optional 2MB limit
    if (file.size > 2 * 1024 * 1024) {
      alert("File too large. Max 2MB.")
      e.target.value = ""
      return
    }

    setActiveIconId(null)

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }

    const blobUrl = URL.createObjectURL(file)
    setPreviewUrl(blobUrl)
    onChange?.(file)
  }

  // When user clicks one of the preset icons
  const handlePresetClick = async (icon) => {
    try {
      setActiveIconId(icon.id)

      // Get a File object from the static image, so you can append to FormData later
      const res = await fetch(icon.src)
      const blob = await res.blob()

      const file = new File(
        [blob],
        `${icon.id}.${(blob.type || "image/png").split("/")[1] || "png"}`,
        { type: blob.type || "image/png" }
      )

      // For preview we can just show the static URL
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(icon.src)

      onChange?.(file)
    } catch (err) {
      console.error(err)
      alert("Failed to load preset icon.")
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload / preview card - matches your design */}
      <div className={`rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-6 text-center ${touch && error ? 'border-rose-600' : ''}`}>
        {/* Clickable upload area */}
        <div
          className="mx-auto mb-3 flex h-20 w-20 cursor-pointer items-center justify-center rounded-2xl bg-slate-50"
          onClick={handleUploadAreaClick}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected icon"
              className="h-full w-full rounded-2xl object-contain"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
              <div className="text-3xl">
                <FiUploadCloud />
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="text-sm font-medium text-slate-700">
          Upload Icon or Select Emoji
        </div>
        <div className="text-[11px] text-slate-400">
          PNG, JPG or Emoji (Max 2MB)
        </div>

        {/* Preset icons row */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {PRESET_ICONS.map((icon) => (
            <button
              key={icon.id}
              type="button"
              onClick={() => handlePresetClick(icon)}
              className={`px-3 flex   items-center justify-center rounded-lg border bg-slate-50 transition 
                ${
                  activeIconId === icon.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-transparent hover:border-slate-300"
                }`}
            >
              <img
                src={icon.src}
                alt={icon.label}
                className="h-6 w-6 object-contain"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
