'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts'

interface FourAxesData {
  inflow: number      // 유입
  persuasion: number  // 설득
  trust: number       // 신뢰
  circulation: number // 순환
}

interface RadarChartComponentProps {
  data: FourAxesData
}

export function RadarChartComponent({ data }: RadarChartComponentProps) {
  const chartData = [
    {
      axis: '유입',
      value: data.inflow,
      fullMark: 100,
    },
    {
      axis: '설득',
      value: data.persuasion,
      fullMark: 100,
    },
    {
      axis: '신뢰',
      value: data.trust,
      fullMark: 100,
    },
    {
      axis: '순환',
      value: data.circulation,
      fullMark: 100,
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">4대 축 분석</h2>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Radar
            name="점수"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            strokeWidth={2}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">유입:</span>
          <span className="font-semibold">{data.inflow}점</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">설득:</span>
          <span className="font-semibold">{data.persuasion}점</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">신뢰:</span>
          <span className="font-semibold">{data.trust}점</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">순환:</span>
          <span className="font-semibold">{data.circulation}점</span>
        </div>
      </div>
    </div>
  )
}
