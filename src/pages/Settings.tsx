import { useState } from "react";
import { Save, Shield, User, Bell, Lock, Download } from "lucide-react";
import toast from "react-hot-toast";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("privacy");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Mock security audit logs
  const auditLogs = [
    {
      id: 1,
      event: "Login attempt",
      status: "success",
      ip: "192.168.1.1",
      location: "Paris, France",
      timestamp: "2024-03-19 14:23:45",
    },
    {
      id: 2,
      event: "Password changed",
      status: "success",
      ip: "192.168.1.1",
      location: "Paris, France",
      timestamp: "2024-03-18 10:15:30",
    },
    {
      id: 3,
      event: "Failed login attempt",
      status: "failed",
      ip: "45.23.126.89",
      location: "Unknown",
      timestamp: "2024-03-17 22:45:12",
    },
    {
      id: 4,
      event: "API key generated",
      status: "success",
      ip: "192.168.1.1",
      location: "Paris, France",
      timestamp: "2024-03-15 16:30:00",
    },
  ];

  const handleMfaToggle = () => {
    setMfaEnabled(!mfaEnabled);
    toast.success(
      `Two-factor authentication ${!mfaEnabled ? "enabled" : "disabled"}`
    );
  };

  const handleBiometricToggle = () => {
    setBiometricEnabled(!biometricEnabled);
    toast.success(
      `Biometric authentication ${!biometricEnabled ? "enabled" : "disabled"}`
    );
  };

  const handleSaveChanges = () => {
    toast.success("Settings saved successfully");
  };

  const handleSignOutAllDevices = () => {
    toast.success("Signed out from all devices");
  };

  const handleRevokeSession = (sessionType: string) => {
    toast.success(`${sessionType} session revoked`);
  };

  const handleExportLog = () => {
    const csvContent = auditLogs
      .map(
        (log) => `${log.event},${log.status},${log.location},${log.timestamp}`
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "security-audit-log.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Security audit log exported");
  };

  // Add the missing handleRequestDeletion function
  const handleRequestDeletion = () => {
    const confirmed = window.confirm(
      "Are you sure you want to request account deletion? This action cannot be undone."
    );

    if (confirmed) {
      toast.success(
        "Account deletion request submitted. Our team will contact you shortly."
      );
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
          <nav className="py-4 md:py-8 px-4 md:px-6 space-y-1">
            <button
              onClick={() => setActiveTab("account")}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === "account"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <User className="h-5 w-5 mr-3" />
              Account
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === "notifications"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Bell className="h-5 w-5 mr-3" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === "privacy"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Shield className="h-5 w-5 mr-3" />
              Privacy & Security
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Account Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your account settings and profile information.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Profile Picture
                    </h4>
                    <div className="mt-2 flex space-x-2">
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Upload new image
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      defaultValue="John"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      defaultValue="Doe"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    defaultValue="john@example.com"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    defaultValue="Acme Inc."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">
                  Change Password
                </h4>
                <div>
                  <label
                    htmlFor="current-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Notification Preferences
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage how you receive notifications and alerts.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">
                  Email Notifications
                </h4>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="scraping-complete"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="scraping-complete"
                        className="font-medium text-gray-700"
                      >
                        Scraping Job Completed
                      </label>
                      <p className="text-gray-500">
                        Get notified when a scraping job is finished
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enrichment-complete"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="enrichment-complete"
                        className="font-medium text-gray-700"
                      >
                        Data Enrichment Completed
                      </label>
                      <p className="text-gray-500">
                        Receive updates when data enrichment is done
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="campaign-status"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="campaign-status"
                        className="font-medium text-gray-700"
                      >
                        Campaign Status Updates
                      </label>
                      <p className="text-gray-500">
                        Get notified about email campaign progress
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">
                  System Alerts
                </h4>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="security-alerts"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="security-alerts"
                        className="font-medium text-gray-700"
                      >
                        Security Alerts
                      </label>
                      <p className="text-gray-500">
                        Important security-related notifications
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="maintenance"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="maintenance"
                        className="font-medium text-gray-700"
                      >
                        Maintenance Updates
                      </label>
                      <p className="text-gray-500">
                        Scheduled maintenance and system updates
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">
                  Desktop Notifications
                </h4>
                <div className="mt-4">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                    Enable Desktop Notifications
                  </button>
                  <p className="mt-2 text-xs text-gray-500">
                    Allow browser notifications to receive real-time updates
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Privacy & Security Settings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your account security and data privacy preferences.
                </p>
              </div>

              {/* Account Security */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Account Security
                </h4>

                <div className="space-y-4">
                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Two-Factor Authentication
                        </p>
                        <p className="text-xs text-gray-500">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={handleMfaToggle}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          mfaEnabled ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            mfaEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Biometric Authentication */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Biometric Authentication
                        </p>
                        <p className="text-xs text-gray-500">
                          Use fingerprint or face recognition to sign in
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={handleBiometricToggle}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          biometricEnabled ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            biometricEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="border-t border-gray-200 pt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">
                      Password Requirements
                    </h5>
                    <ul className="space-y-1 text-xs text-gray-500">
                      <li className="flex items-center">
                        <span className="w-4 h-4 mr-2 text-green-500">✓</span>
                        Minimum 12 characters
                      </li>
                      <li className="flex items-center">
                        <span className="w-4 h-4 mr-2 text-green-500">✓</span>
                        Mix of uppercase and lowercase letters
                      </li>
                      <li className="flex items-center">
                        <span className="w-4 h-4 mr-2 text-green-500">✓</span>
                        At least one number and special character
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Session Management */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Active Sessions
                  </h4>
                  <button
                    onClick={handleSignOutAllDevices}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Sign Out All Devices
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Current Session
                        </p>
                        <p className="text-xs text-gray-500">
                          Paris, France • Chrome on MacOS
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRevokeSession("Current")}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Revoke
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Mobile App
                        </p>
                        <p className="text-xs text-gray-500">
                          iPhone 13 • iOS 15.4
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRevokeSession("Mobile")}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Audit Log */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Security Audit Log
                  </h4>
                  <button
                    onClick={handleExportLog}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export Log
                  </button>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Event
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.event}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                log.status === "success"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.timestamp}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Protection */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Data Protection
                </h4>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="data-collection"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="data-collection"
                        className="font-medium text-gray-700"
                      >
                        Data Collection
                      </label>
                      <p className="text-gray-500">
                        Allow collection of usage data to improve our services
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="third-party"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="third-party"
                        className="font-medium text-gray-700"
                      >
                        Third-Party Data Sharing
                      </label>
                      <p className="text-gray-500">
                        Share data with trusted partners for service improvement
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="backup"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="backup"
                        className="font-medium text-gray-700"
                      >
                        Automatic Backups
                      </label>
                      <p className="text-gray-500">
                        Keep your data safe with daily automated backups
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleRequestDeletion}
                    className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Request Account Deletion
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
