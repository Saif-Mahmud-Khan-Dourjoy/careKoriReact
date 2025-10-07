import { useEffect, useState } from "react"
import logo from "../assets/logo.jpg"
import slide1 from "../assets/illu1.png"
import slide2 from "../assets/illu2.jpg"
import slide3 from "../assets/illu1.png"
import { useAuth } from "../context/AuthContext"
import { useFormik } from "formik"
import * as Yup from "yup"
import { loginApi } from "../api/auth"
import { useLocation, useNavigate } from "react-router-dom"

export default function LoginPage() {
    const navigate = useNavigate()
  const { ready, user, token, login } = useAuth()
  const slides = [slide1, slide2, slide3]
  const [index, setIndex] = useState(0)
  const location = useLocation()


  useEffect(() => {
    if (ready && user && token) {
      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      })
    }
  }, [ready, user, token, navigate, location.state])

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000)
    return () => clearInterval(id)
  }, [slides.length])

  // formik
  const {
    handleSubmit,
    handleChange,
    values,
    touched,
    errors,
    handleBlur,
    setValues,
    resetForm,
    setFieldValue,
    isSubmitting,
    status,
    setStatus,
  } = useFormik({
    initialValues: { phone: "", password: "" },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      phone: Yup.string()
        .required("Phone is required")
        .matches(/^(?:\+?88)?01[3-9]\d{8}$/, "Enter a valid BD phone number"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Min 6 characters"),
    }),
    onSubmit: async (vals, helpers) => {
      const { setSubmitting, setStatus } = helpers
      setStatus(null)

      const { phone, password } = vals
      return loginApi({ phone, password })
        .then(([ok, dataOrMsg]) => {
          if (ok) {
            const { token, user } = dataOrMsg || {}
            if (!token || !user) {
              setStatus("Invalid login")
            } else {
              if (
                user?.role?.name == "moderator" ||
                user?.role?.name == "super admin"
              ) {
                login(token, user)
                resetForm()
                const to = location.state?.from?.pathname || "/dashboard"
                navigate(to, { replace: true })
              } else {
                setStatus("Unauthorized: You don't have access to this application")
              }
            }
          } else {
            setStatus(dataOrMsg || "Login failed")
          }
        })
        .finally(() => {
          setSubmitting(false) // runs whether then or catch
        })
    },
  })
  return (
    <div
      className="
        h-screen w-[100vw] grid grid-cols-1 md:grid-cols-2
        overflow-hidden
      "
    >
      {/* LEFT: logo + form */}
      <div className="relative flex items-center justify-center bg-[#2F5BEA] text-white overflow-hidden">
        {/* soft blobs (clipped by parent overflow) */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full opacity-20 bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 w-[32rem] h-[32rem] rounded-full opacity-10 bg-white/10 blur-2xl" />

        <div className="w-full max-w-md px-8">
          <div className="mb-10 w-full flex justify-center">
            <img src={logo} alt="CareKori" className="h-20 w-auto" />
          </div>

          {/* Use Formik's handleSubmit */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone */}
            <div>
              <label className="block text-sm mb-2 opacity-90">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                  📞
                </span>
                <input
                  name="phone"
                  type="tel"
                  className="w-full rounded-lg bg-white text-gray-900 placeholder-gray-400 py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-white/70"
                  placeholder="Phone Number"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.phone && errors.phone && (
                <div className="mt-1 text-sm text-red-600">{errors.phone}</div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2 opacity-90">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                  🔒
                </span>
                <input
                  name="password"
                  type="password"
                  className="w-full rounded-lg bg-white text-gray-900 placeholder-gray-400 py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-white/70"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.password && errors.password && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-white text-[#2F5BEA] font-bold py-3 hover:bg-blue-50 transition disabled:opacity-70"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            {/* API / general error */}
            {status && <div className="text-sm text-red-900 font-semibold">{status}</div>}
          </form>                     
        </div>
      </div>

      {/* RIGHT: slider */}
      <div className="relative bg-white flex items-center justify-center p-6 overflow-hidden">
        <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-sm">
          {/* fixed aspect to avoid page growth */}
          <div className="relative aspect-video">
            {slides.map((src, i) => (
              <img
                key={"image-" + i}
                src={src}
                alt={`slide-${i}`}
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
                draggable="false"
              />
            ))}
          </div>
        </div>

        {/* dots */}
        <div className="absolute bottom-6 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index ? "bg-[#2F5BEA]" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
