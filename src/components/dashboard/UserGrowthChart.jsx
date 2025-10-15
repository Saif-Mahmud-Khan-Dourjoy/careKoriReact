
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from "recharts"

const monthlyByYear = {
  2024: [
    { label: "Jan", getters: 500, providers: 1100 },
    { label: "Feb", getters: 1200, providers: 2000 },
    { label: "Mar", getters: 2000, providers: 1700 },
    { label: "Apr", getters: 1600, providers: 2300 },
    { label: "May", getters: 1900, providers: 2100 },
    { label: "Jun", getters: 3100, providers: 1100 },
    { label: "Jul", getters: 2300, providers: 2900 },
    { label: "Aug", getters: 1800, providers: 2700 },
    { label: "Sep", getters: 2000, providers: 1900 },
    { label: "Oct", getters: 1700, providers: 1600 },
    { label: "Nov", getters: 2100, providers: 2000 },
    { label: "Dec", getters: 2400, providers: 800 },
  ],
  2025: [
    { label: "Jan", getters: 600, providers: 1200 },
    { label: "Feb", getters: 1400, providers: 2100 },
    { label: "Mar", getters: 2300, providers: 1800 },
    { label: "Apr", getters: 1700, providers: 2600 },
    { label: "May", getters: 2100, providers: 2200 },
    { label: "Jun", getters: 3562, providers: 1236 },
    { label: "Jul", getters: 2400, providers: 3100 },
    { label: "Aug", getters: 1900, providers: 2800 },
    { label: "Sep", getters: 2100, providers: 2000 },
    { label: "Oct", getters: 1800, providers: 1700 },
    { label: "Nov", getters: 2200, providers: 2100 },
    { label: "Dec", getters: 2600, providers: 900 },
  ],
}

const yearly = [
  { label: "2019", getters: 8200, providers: 5200 },
  { label: "2020", getters: 11400, providers: 9100 },
  { label: "2021", getters: 15600, providers: 13200 },
  { label: "2022", getters: 9800, providers: 7400 },
]

export default function UserGrowthChart({ period = "Monthly", year = 2025 }) {
  const data = period === "Monthly" ? monthlyByYear[year] || [] : yearly
  const highlightIndex =
    period === "Monthly" ? data.findIndex((d) => d.label === "Jun") : -1

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 4, right: 16 }}>
          <CartesianGrid stroke="#EEF2FF" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v) => v.toLocaleString()}
            labelFormatter={(l) => (period === "Monthly" ? `${l} ${year}` : l)}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #EEF2FF",
              boxShadow: "0 8px 24px rgba(0,0,0,.06)",
            }}
          />
          <Legend />
          {highlightIndex >= 0 && (
            <ReferenceArea
              x1={data[highlightIndex].label}
              x2={data[highlightIndex].label}
              ifOverflow="extendDomain"
              fill="red"
              fillOpacity={0.12}
            />
          )}
          <Line
            type="monotone"
            dataKey="getters"
            name="Getters"
            stroke="#10B981"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="providers"
            name="Providers"
            stroke="#EC4899"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
