import React from "react"


export default function LoaderModal({
  open,
  title = "Please wait…",
  subtitle,
  dimBackdrop = true,
  blurBackdrop = false,
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center p-4"
      aria-live="assertive"
      aria-busy="true"
      role="alertdialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className={[
          "absolute inset-0 transition",
          dimBackdrop ? "bg-black/40" : "",
          blurBackdrop ? "backdrop-blur-sm" : "",
        ].join(" ")}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white px-6 py-6 shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-center gap-4">
          {/* Spinner */}
          <span
            className="
              inline-grid h-11 w-11 place-items-center rounded-full
              bg-blue-50 ring-1 ring-blue-100
            "
          >
            <svg
              className="h-6 w-6 animate-spin text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
              />
            </svg>
          </span>

          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-slate-800">
              {title}
            </div>
            {subtitle ? (
              <div className="mt-0.5 text-sm text-slate-500">{subtitle}</div>
            ) : null}
          </div>
        </div>

        {/* Progress shimmer bar (optional visual) */}
        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-1/3 animate-[loader_1.2s_infinite] rounded-full bg-blue-500" />
        </div>

        {/* Keyframes for the bar */}
        <style>{`
          @keyframes loader {
            0%   { transform: translateX(-100%); }
            50%  { transform: translateX(50%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    </div>
  )
}
