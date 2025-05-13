import { Clock, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function RecentActivities() {
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const { getAllActivities } = useAuth();
  useEffect(() => {
    const fetchRecentActivities = async () => {
      const activities = await getAllActivities();
      setRecentActivities(activities);
    };
    console.log("recentActivities: ", recentActivities);
    fetchRecentActivities();
  }, []);
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Activity
          </h3>
          <p className="text-sm text-gray-500">Latest actions and events</p>
        </div>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
      <div className="px-6 divide-y divide-gray-200">
        {recentActivities.map((activity) => (
          <Link
            key={activity.id}
            to={activity.link}
            className="py-4 block hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-800">{activity.activity}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <div className="flex-shrink-0 self-center">
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="border-t border-gray-200 px-6 py-3">
        <Link
          to="/activity"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View all activity →
        </Link>
      </div>
    </div>
  );
}

export default RecentActivities;
