/* eslint-disable */
import { useEffect, useMemo, useState } from "react"
import Modal from "../ui/Modal"
import { Label } from "../ui/Fields"
import Select from "react-select"

export default function BannerModal({
  open,
  onClose,
  roleOptions = [],
  onSubmit,
}) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isRoleSpecific, setIsRoleSpecific] = useState(false)
  const [roleId, setRoleId] = useState(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const selectedRoleOption = useMemo(() => {
    return roleOptions.find((r) => r.value === roleId) || null
  }, [roleOptions, roleId])



  const submit = async (e) => {
    e.preventDefault()

    if (!file) return

    const fd = new FormData()
    fd.append("add_image", file)

    // if (isRoleSpecific) {
    //   if (!roleId) return
    //   fd.append("role_id", String(roleId))
    // }

    await onSubmit?.(fd, isRoleSpecific, roleId)
    onClose?.()
    setFile(null)
    setRoleId(null)
    setIsRoleSpecific(false)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Banner"
      widthClass="max-w-xl"
    >
      <form onSubmit={submit} className="grid grid-cols-1 gap-4">
        <div>
          <Label>Banner Image</Label>
          <input
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {preview ? (
            <div className="mt-3">
              <img
                src={preview}
                alt="preview"
                className="h-20   object-cover "
              />
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <input
            id="isRoleSpecific"
            type="checkbox"
            checked={isRoleSpecific}
            onChange={(e) => {
              const v = e.target.checked
              setIsRoleSpecific(v)
              if (!v) setRoleId(null)
            }}
          />
          <label htmlFor="isRoleSpecific" className="text-sm text-slate-700">
            Is Role Specific
          </label>
        </div>

        {isRoleSpecific ? (
          <div>
            <Label>Role For</Label>
            <Select
              placeholder="Select role..."
              isClearable
              isSearchable
              options={roleOptions}
              value={selectedRoleOption}
              onChange={(opt) => setRoleId(opt?.value || null)}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 42,
                  borderRadius: 8,
                  borderColor: "#cbd5e1",
                  boxShadow: "none",
                }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>
        ) : null}

        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-500 px-6 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}
