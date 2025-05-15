import { Clock, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNotifStore } from "../../stores/notification";
import { Activities } from "../types/jobsInterface";
import useAuth from "../../hooks/useAuth";

function RecentActivities() {
  const [recentActivities, setRecentActivities] = useState<Activities[]>([]);
  const { getallActivities } = useNotifStore();
  const { user } = useAuth();
  useEffect(() => {
    const fetchRecentActivities = async () => {
      if (user) {
        const activities = await getallActivities(user.id);
        setRecentActivities(activities);
      }
    };
    fetchRecentActivities();
  }, []);

  const buildNavigator = (type: string, id: string) => {
    let to: string | undefined;
    switch (type) {
      case "scraping_job":
        to = `/scraping/new?tab=results&jobId=${id}`;
        break;
      case "enrich_job":
        to = `/enrichment/upload?tab=jobs&jobId=${id}`;
        break;
      default:
        to = undefined;
    }
    if (to) {
      return to;
    }
    // Optionally handle the case where 'to' is undefined
  };
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
        {recentActivities.map((activity) => {
          const to = buildNavigator(activity.type, activity.id);
          if (!to) return null;
          return (
            <Link
              key={activity.id}
              to={to}
              className="py-4 block hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start">
                <div className="min-w-0 flex-1">
                  <div className=" flex flex-col items-start">
                    <p className="text-sm text-gray-800">{activity.label}</p>
                    <span className=" capitalize p-[2px] bg-opacity-40 w-max text-[12px] my-[1px] rounded text-gray-400">
                      From: {activity.type.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{activity.createdAt}</p>
                </div>
                <div className="flex-shrink-0 self-center">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div hidden className="border-t border-gray-200 px-6 py-3">
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
