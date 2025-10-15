export default function AvatarHeader({ src }) {
  return (
    <div className="flex items-center justify-center mb-3">
      <div className="relative flex flex-col items-center">
        <img
          src={src}
          alt=""
          className="h-24 w-24 rounded-full object-cover ring-2 ring-blue-100"
        />
        <div className="mt-2 flex items-center justify-center gap-3 text-slate-500">
          <button title="Delete photo" className="hover:text-rose-500">
            🗑️
          </button>
          <button title="Upload photo" className="hover:text-blue-600">
            📤
          </button>
          <button title="Edit profile" className="hover:text-blue-600">
            ✏️
          </button>
        </div>
      </div>
    </div>
  )
}
