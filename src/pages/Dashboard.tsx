import {
  Users,
  Search,
  Mail,
  TrendingUp,
  ArrowRight,
  Download,
  Filter,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import RecentActivities from "../components/utils/recentActivities";
import PerformanceChart from "../components/widgets/PerformanceChart";

const Dashboard = () => {
  const { user } = useAuth();
  // const { getAllJobs } = useScrapingStore();

  // Stats data (would normally come from API)
  const stats = [
    {
      name: "Total Businesses",
      value: "4,324",
      icon: <Users className="h-6 w-6 text-blue-500" />,
      change: "+15.2%",
      trend: "up",
      link: "/businesses",
    },
    {
      name: "Scraped This Month",
      value: "928",
      icon: <Search className="h-6 w-6 text-teal-500" />,
      change: "+7.3%",
      trend: "up",
      link: "/scraping",
    },
    {
      name: "Emails Sent",
      value: "2,871",
      icon: <Mail className="h-6 w-6 text-amber-500" />,
      change: "+32.8%",
      trend: "up",
      link: "/email-campaigns",
    },
    {
      name: "Average Response Rate",
      value: "18.4%",
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      change: "-2.1%",
      trend: "down",
      link: "/email-campaigns",
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: "Start Scraping",
      description: "Extract business data from Google Maps",
      icon: <Search className="h-6 w-6" />,
      link: "/scraping",
      color: "bg-blue-500",
    },
    {
      title: "Enrich Data",
      description: "Add business details from INSEE and other sources",
      icon: <Filter className="h-6 w-6" />,
      link: "/enrichment",
      color: "bg-green-500",
    },
    {
      title: "Send Campaign",
      description: "Create and send email campaigns",
      icon: <Mail className="h-6 w-6" />,
      link: "/email-campaigns",
      color: "bg-purple-500",
    },
    {
      title: "Export Data",
      description: "Download your business database",
      icon: <Download className="h-6 w-6" />,
      link: "/businesses",
      color: "bg-orange-500",
    },
  ];

  // React.useEffect(() => {
  //   const fetch = async () => {
  //     const res = await getAllJobs();
  //     console.log("RES: ", res);
  //   };
  //   fetch();
  // }, []);

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.fname || user?.email?.split("@")[0] || "User"}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your prospecting activity today.
          </p>
        </div>
        <div className="px-6 py-5 sm:px-8 sm:py-6 bg-blue-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-blue-800">Current Plan</p>
              <p className="mt-1 text-xl font-semibold text-blue-900">
                Professional
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">
                Monthly Scraping Quota
              </p>
              <div className="mt-1 flex items-center gap-2">
                <div className="w-36 h-2.5 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500 "
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-blue-900">
                  65% used
                </span>
              </div>
            </div>
            <Link
              to="/settings"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.link}
            className="group bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 rounded-md p-3 ${action.color} text-white`}
                >
                  {action.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-900 truncate">
                      {action.title}
                    </dt>
                    <dd className="text-sm text-gray-500">
                      {action.description}
                    </dd>
                  </dl>
                </div>
                <div className="flex-shrink-0 self-center">
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">{stat.icon}</div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div
              className={`px-5 py-3 bg-gray-50 ${
                stat.trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              <div className="text-sm flex items-center">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                )}
                <span>{stat.change} from last month</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts & Activities Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Chart */}
        <PerformanceChart />

        {/* Recent Activity */}
        <RecentActivities />
      </div>
    </div>
  );
};

export default Dashboard;
