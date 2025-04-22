import React from 'react';
import { useParams } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, MousePointer, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CampaignAnalytics = () => {
  const { campaignId } = useParams();

  // Mock data for analytics
  const stats = [
    { name: 'Recipients', value: '98', icon: <Users className="h-6 w-6 text-blue-500" /> },
    { name: 'Opens', value: '32%', icon: <TrendingUp className="h-6 w-6 text-green-500" /> },
    { name: 'Clicks', value: '8%', icon: <MousePointer className="h-6 w-6 text-purple-500" /> },
    { name: 'Avg. Time to Open', value: '2.5h', icon: <Clock className="h-6 w-6 text-orange-500" /> },
  ];

  const timelineData = [
    { time: '9:00 AM', opens: 12, clicks: 3 },
    { time: '10:00 AM', opens: 18, clicks: 5 },
    { time: '11:00 AM', opens: 15, clicks: 4 },
    { time: '12:00 PM', opens: 25, clicks: 8 },
    { time: '1:00 PM', opens: 20, clicks: 6 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/email-campaigns"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Campaigns
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">Campaign Analytics</h1>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Chart */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Engagement Timeline</h3>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-md">
            <span className="text-sm">Engagement timeline chart would render here</span>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Detailed Statistics</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Device Breakdown</h4>
              <div className="mt-2 grid grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-lg font-semibold text-gray-900">65%</div>
                  <div className="text-sm text-gray-500">Mobile</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-lg font-semibold text-gray-900">25%</div>
                  <div className="text-sm text-gray-500">Desktop</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-lg font-semibold text-gray-900">10%</div>
                  <div className="text-sm text-gray-500">Tablet</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900">Link Performance</h4>
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Main CTA Button</td>
                      <td className="px-6 py-4 text-sm text-gray-500">45</td>
                      <td className="px-6 py-4 text-sm text-gray-500">5.2%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Secondary Link</td>
                      <td className="px-6 py-4 text-sm text-gray-500">23</td>
                      <td className="px-6 py-4 text-sm text-gray-500">2.8%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignAnalytics;