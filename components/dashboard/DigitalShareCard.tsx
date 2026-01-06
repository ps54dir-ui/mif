'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface DigitalShareProps {
  digitalShare: {
    overall_digital_share: number
    seo_contribution: number
    sns_contribution: number
    channel_contributions: Record<string, number>
    breakdown: {
      seo_score: number
      average_sns_score: number
      sns_channels: Record<string, number>
    }
  }
}

export function DigitalShareCard({ digitalShare }: DigitalShareProps) {
  const chartData = [
    {
      name: 'SEO',
      점수: digitalShare.breakdown.seo_score,
      기여도: digitalShare.seo_contribution
    },
    {
      name: '유튜브',
      점수: digitalShare.breakdown.sns_channels.YOUTUBE || 0,
      기여도: digitalShare.channel_contributions.YOUTUBE || 0
    },
    {
      name: '틱톡',
      점수: digitalShare.breakdown.sns_channels.TIKTOK || 0,
      기여도: digitalShare.channel_contributions.TIKTOK || 0
    },
    {
      name: 'X(트위터)',
      점수: digitalShare.breakdown.sns_channels.TWITTER || 0,
      기여도: digitalShare.channel_contributions.TWITTER || 0
    },
    {
      name: '쓰레드',
      점수: digitalShare.breakdown.sns_channels.THREADS || 0,
      기여도: digitalShare.channel_contributions.THREADS || 0
    }
  ]

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6']

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          종합 디지털 점유율
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-blue-600">
            {digitalShare.overall_digital_share}%
          </div>
          <div className="text-sm text-gray-600">
            SEO 기여도: {digitalShare.seo_contribution.toFixed(1)}% | 
            SNS 기여도: {digitalShare.sns_contribution.toFixed(1)}%
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#9ca3af"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="점수" name="채널 점수" fill="#3b82f6">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        {Object.entries(digitalShare.channel_contributions).map(([channel, contribution]) => (
          <div key={channel} className="text-center">
            <div className="font-semibold text-gray-700">{channel}</div>
            <div className="text-blue-600">{contribution.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
