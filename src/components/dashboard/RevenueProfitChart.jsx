
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Rectangle,
} from "recharts"


const monthlyByYear = {
  2024: [
    { label: "Jan", revenue: 2200, profit: 700 },
    { label: "Feb", revenue: 1800, profit: 600 },
    { label: "Mar", revenue: 3900, profit: 1200 },
    { label: "Apr", revenue: 3200, profit: 900 },
    { label: "May", revenue: 4800, profit: 1400 },
    { label: "Jun", revenue: 8600, profit: 2200 },
    { label: "Jul", revenue: 9800, profit: 4200 },
    { label: "Aug", revenue: 11200, profit: 5100 },
    { label: "Sep", revenue: 5400, profit: 1600 },
    { label: "Oct", revenue: 2900, profit: 680 },
    { label: "Nov", revenue: 2300, profit: 520 },
    { label: "Dec", revenue: 3900, profit: 840 },
  ],
  2025: [
    { label: "Jan", revenue: 2600, profit: 900 },
    { label: "Feb", revenue: 1800, profit: 600 },
    { label: "Mar", revenue: 4200, profit: 1200 },
    { label: "Apr", revenue: 3600, profit: 900 },
    { label: "May", revenue: 5200, profit: 1600 },
    { label: "Jun", revenue: 9600, profit: 2556 },
    { label: "Jul", revenue: 11800, profit: 5200 },
    { label: "Aug", revenue: 14800, profit: 6300 },
    { label: "Sep", revenue: 6400, profit: 1800 },
    { label: "Oct", revenue: 3100, profit: 720 },
    { label: "Nov", revenue: 2500, profit: 600 },
    { label: "Dec", revenue: 4100, profit: 900 },
  ],
}

const yearly = [
  { label: "2019", revenue: 7800, profit: 1800 },
  { label: "2020", revenue: 15200, profit: 2100 },
  { label: "2021", revenue: 21000, profit: 14500 },
  { label: "2022", revenue: 3900, profit: 520 },
]

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #EEF2FF",
  boxShadow: "0 8px 24px rgba(0,0,0,.06)",
}

export default function RevenueProfitChart({ period = "Yearly", year = 2025 }) {
  const data = period === "Monthly" ? monthlyByYear[year] || [] : yearly

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={8} barCategoryGap="24%">
          <CartesianGrid stroke="#EEF2FF" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v) => v.toLocaleString()}
            labelFormatter={(l) => (period === "Monthly" ? `${l} ${year}` : l)}
          />
          <Legend />
          <Bar
            dataKey="revenue"
            name="Revenue"
            fill="#5B8DEF"
            radius={[8, 8, 0, 0]}
            activeBar={<Rectangle fill="#4F46E5" />}
          />
          <Bar
            dataKey="profit"
            name="Profit"
            fill="#2741C2"
            radius={[8, 8, 0, 0]}
            activeBar={<Rectangle fill="#1E3A8A" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
