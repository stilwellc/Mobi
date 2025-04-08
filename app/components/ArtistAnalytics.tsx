'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface MarketMetrics {
  priceAppreciation: number;
  liquidityScore: number;
  institutionalSupport: number;
  socialMomentum: number;
  riskScore: number;
  investmentPotential: number;
}

interface HistoricalData {
  date: string;
  price: number;
  volume: number;
  auctionHouses: string[];
}

interface Insight {
  type: string;
  message: string;
  confidence: 'high' | 'medium' | 'low';
}

interface AnalyticsData {
  metrics: MarketMetrics;
  insights: Insight[];
  historicalData: HistoricalData[];
  galleryRepresentation: {
    currentGalleries: string[];
    exhibitionHistory: number;
  };
  socialMetrics: {
    followers: number;
    mentions: number;
    engagement: number;
  };
}

export default function ArtistAnalytics({ artistId }: { artistId: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'1m' | '3m' | '6m' | '1y'>('1y');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/analytics?artistId=${artistId}&timeframe=${timeframe}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const analyticsData = await response.json();
        setData(analyticsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load analytics data');
        setLoading(false);
      }
    };

    fetchData();
  }, [artistId, timeframe]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#800020] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-8 text-red-500">
        {error || 'Failed to load analytics data'}
      </div>
    );
  }

  const timeframes = [
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' }
  ];

  return (
    <div className="space-y-8">
      {/* Timeframe Selector */}
      <div className="flex space-x-4">
        {timeframes.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setTimeframe(tf.value as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              timeframe === tf.value
                ? 'bg-[#800020] text-white'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Investment Potential Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
          <h3 className="text-lg font-medium text-zinc-300 mb-4">
            Investment Potential Score
          </h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="w-32 h-32">
                <circle
                  className="text-zinc-900"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-[#800020]"
                  strokeWidth="8"
                  strokeDasharray={`${data.metrics.investmentPotential * 3.51} 351.858`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
              </svg>
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-zinc-300">
                {Math.round(data.metrics.investmentPotential)}
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-zinc-500">Price Appreciation</p>
              <p className="text-lg font-medium text-zinc-300">
                {data.metrics.priceAppreciation.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Liquidity Score</p>
              <p className="text-lg font-medium text-zinc-300">
                {Math.round(data.metrics.liquidityScore)}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Institutional Support</p>
              <p className="text-lg font-medium text-zinc-300">
                {Math.round(data.metrics.institutionalSupport)}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Social Momentum</p>
              <p className="text-lg font-medium text-zinc-300">
                {Math.round(data.metrics.socialMomentum)}
              </p>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
          <h3 className="text-lg font-medium text-zinc-300 mb-4">
            Risk Assessment
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-zinc-500">Risk Score</span>
                <span className="text-sm text-zinc-300">
                  {Math.round(data.metrics.riskScore)}/100
                </span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2">
                <div
                  className="bg-[#800020] h-2 rounded-full"
                  style={{ width: `${data.metrics.riskScore}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-zinc-500">Market Volatility</span>
                <span className="text-sm text-zinc-300">
                  {Math.abs(data.metrics.priceAppreciation).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2">
                <div
                  className="bg-[#800020] h-2 rounded-full"
                  style={{ width: `${Math.abs(data.metrics.priceAppreciation)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price History Chart */}
      <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
        <h3 className="text-lg font-medium text-zinc-300 mb-4">
          Price History
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="date"
                stroke="#71717a"
                tickFormatter={(date: string) => new Date(date).toLocaleDateString()}
              />
              <YAxis
                stroke="#71717a"
                tickFormatter={(value) =>
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact',
                  }).format(value)
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                }}
                labelFormatter={(date: string) => new Date(date).toLocaleDateString()}
                formatter={(value: number) => [
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(value),
                  'Price',
                ]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#800020"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
          <h3 className="text-lg font-medium text-zinc-300 mb-4">
            Market Insights
          </h3>
          <div className="space-y-4">
            {data.insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 rounded-lg bg-zinc-900/50"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 ${
                    insight.confidence === 'high'
                      ? 'bg-green-500'
                      : insight.confidence === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
                <div>
                  <p className="text-sm text-zinc-300">{insight.message}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Confidence: {insight.confidence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery & Social Metrics */}
        <div className="space-y-6">
          <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
            <h3 className="text-lg font-medium text-zinc-300 mb-4">
              Gallery Representation
            </h3>
            <div className="space-y-2">
              {data.galleryRepresentation.currentGalleries.map((gallery, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50"
                >
                  <span className="text-sm text-zinc-300">{gallery}</span>
                  <span className="text-xs text-zinc-500">Current</span>
                </div>
              ))}
              <div className="text-sm text-zinc-500 mt-2">
                Total exhibitions: {data.galleryRepresentation.exhibitionHistory}
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
            <h3 className="text-lg font-medium text-zinc-300 mb-4">
              Social Metrics
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-medium text-zinc-300">
                  {data.socialMetrics.followers.toLocaleString()}
                </p>
                <p className="text-sm text-zinc-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-medium text-zinc-300">
                  {data.socialMetrics.mentions.toLocaleString()}
                </p>
                <p className="text-sm text-zinc-500">Mentions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-medium text-zinc-300">
                  {data.socialMetrics.engagement.toFixed(1)}%
                </p>
                <p className="text-sm text-zinc-500">Engagement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 