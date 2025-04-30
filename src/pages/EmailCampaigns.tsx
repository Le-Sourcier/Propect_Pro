import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  Link,
} from "react-router-dom";
import {
  Plus,
  Send,
  Mail,
  Clock,
  Edit,
  Trash,
  Eye,
  BarChart3,
  Search,
  Filter,
  ChevronDown,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

interface Campaign {
  id: number;
  name: string;
  subject: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  recipients: number;
  openRate: number;
  clickRate: number;
  date: string;
  content?: string;
  scheduledDate?: string;
}

interface Template {
  id: number;
  name: string;
  subject: string;
  preview: string;
  content: string;
  lastEdited: string;
}

interface ContactList {
  id: number;
  name: string;
  count: number;
  lastUpdated: string;
  source: string;
}

const EmailCampaigns = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "campaigns";

  // Update URL when tab changes
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const { campaignId } = useParams();
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Mock data for campaigns
  const [campaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: "Q2 Restaurant Outreach",
      subject: "Boost your online visibility with our solution",
      status: "sent",
      recipients: 98,
      openRate: 32,
      clickRate: 8,
      date: "2023-05-15",
      content:
        "Hello {{first_name}},\n\nI noticed that {{company_name}} could benefit...",
    },
    {
      id: 2,
      name: "Plumber Services Follow-up",
      subject: "How to increase your customer base by 30%",
      status: "draft",
      recipients: 0,
      openRate: 0,
      clickRate: 0,
      date: "2023-05-14",
      content: "Hi {{first_name}},\n\nI wanted to follow up on...",
    },
    {
      id: 3,
      name: "Summer Promotion",
      subject: "Special offer for your business this summer",
      status: "scheduled",
      recipients: 156,
      openRate: 0,
      clickRate: 0,
      date: "2023-05-20",
      scheduledDate: "2023-06-01 09:00:00",
      content: "Dear {{first_name}},\n\nSummer is approaching and...",
    },
  ]);

  // Mock data for templates
  const [templates] = useState<Template[]>([
    {
      id: 1,
      name: "Cold Outreach",
      subject: "Introducing our services to {{company_name}}",
      preview: "Hi {{first_name}}, I noticed that {{company_name}} is...",
      content: "Hi {{first_name}},\n\nI noticed that {{company_name}} is...",
      lastEdited: "2023-05-10",
    },
    {
      id: 2,
      name: "Follow-up Email",
      subject: "Following up on our previous conversation",
      preview: "Hi {{first_name}}, I wanted to follow up on our previous...",
      content:
        "Hi {{first_name}},\n\nI wanted to follow up on our previous conversation...",
      lastEdited: "2023-05-05",
    },
    {
      id: 3,
      name: "Product Demo Invitation",
      subject: "See how {{company_name}} can benefit from our solution",
      preview:
        "Hi {{first_name}}, I would like to invite you to a personalized demo...",
      content:
        "Hi {{first_name}},\n\nI would like to invite you to a personalized demo...",
      lastEdited: "2023-04-28",
    },
  ]);

  // Mock data for contact lists
  const [contactLists] = useState<ContactList[]>([
    {
      id: 1,
      name: "Restaurants Paris",
      count: 156,
      lastUpdated: "2023-05-15",
      source: "Google Maps Scraping",
    },
    {
      id: 2,
      name: "Lyon Tech Companies",
      count: 87,
      lastUpdated: "2023-05-14",
      source: "LinkedIn Scraping",
    },
    {
      id: 3,
      name: "Healthcare Providers",
      count: 215,
      lastUpdated: "2023-05-13",
      source: "Manual Import",
    },
  ]);

  const handleCreateCampaign = () => {
    // Here you would normally create the campaign in the backend
    toast.success("Campaign created successfully");
    setShowNewCampaignModal(false);
    navigate("/email-campaigns/new");
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Here you would normally delete the campaign in the backend
    toast.success("Campaign deleted successfully");
    setShowDeleteModal(false);
    setSelectedCampaign(null);
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    // Here you would normally duplicate the campaign in the backend
    toast.success("Campaign duplicated successfully");
  };

  const handleScheduleCampaign = (campaign: Campaign) => {
    // Here you would normally schedule the campaign in the backend
    toast.success("Campaign scheduled successfully");
  };

  const handleSendTestEmail = (campaign: Campaign) => {
    // Here you would normally send a test email
    toast.success("Test email sent successfully");
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || campaign.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Email Campaigns
            </h1>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <button
                onClick={() => setShowNewCampaignModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === "campaigns"
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Campaigns
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === "templates"
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Email Templates
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === "contacts"
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Contact Lists
            </button>
          </nav>
        </div>

        {activeTab === "campaigns" && (
          <>
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sent">Sent</option>
                    <option value="failed">Failed</option>
                  </select>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Campaign Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Subject Line
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
                      Recipients
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Open Rate
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Click Rate
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {campaign.name}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        title={campaign.subject}
                      >
                        {campaign.subject.length > 30
                          ? `${campaign.subject.substring(0, 30)}...`
                          : campaign.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            campaign.status === "sent"
                              ? "bg-green-100 text-green-800"
                              : campaign.status === "draft"
                              ? "bg-gray-100 text-gray-800"
                              : campaign.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {campaign.status.charAt(0).toUpperCase() +
                            campaign.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.recipients}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.openRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.clickRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {campaign.status === "sent" ? (
                            <button
                              onClick={() =>
                                navigate(
                                  `/email-campaigns/${campaign.id}/analytics`
                                )
                              }
                              className="text-blue-600 hover:text-blue-900"
                              title="View Analytics"
                            >
                              <BarChart3 className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                navigate(`/email-campaigns/${campaign.id}/edit`)
                              }
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit Campaign"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDuplicateCampaign(campaign)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Duplicate"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaign)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "templates" && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h3
                      className="text-lg font-medium text-gray-900 truncate"
                      title={template.name}
                    >
                      {template.name}
                    </h3>
                    <p
                      className="mt-1 text-sm text-gray-500 truncate"
                      title={template.subject}
                    >
                      Subject: {template.subject}
                    </p>
                    <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                      {template.preview}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      Last edited: {template.lastEdited}
                    </p>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between">
                    <button
                      onClick={() =>
                        navigate(
                          `/email-campaigns/templates/${template.id}/edit`
                        )
                      }
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowNewCampaignModal(true);
                        // Pre-fill campaign with template
                      }}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}

              {/* Add new template card */}
              <div
                onClick={() => navigate("/email-campaigns/templates/new")}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-gray-400 cursor-pointer"
              >
                <Plus className="h-8 w-8 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Create Template
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Design a new reusable email template
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Contact Lists
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Organize your contacts into lists for targeted campaigns
                </p>
              </div>
              <button
                onClick={() => navigate("/email-campaigns/contacts/new")}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <Plus className="h-4 w-4 mr-2" />
                New List
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {contactLists.map((list) => (
                  <li
                    key={list.id}
                    className="py-4 px-6 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {list.name}
                      </h3>
                      <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                        <span>{list.count} contacts</span>
                        <span>•</span>
                        <span>Source: {list.source}</span>
                        <span>•</span>
                        <span>Updated: {list.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/email-campaigns/contacts/${list.id}`)
                        }
                        className="text-blue-600 hover:text-blue-900"
                        title="View Contacts"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setShowNewCampaignModal(true);
                          // Pre-select this contact list
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Create Campaign"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          // Handle delete
                          toast.success("Contact list deleted");
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete List"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                GDPR Compliance
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="h-5 flex items-center">
                    <input
                      id="unsubscribe"
                      name="unsubscribe"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="unsubscribe"
                      className="font-medium text-gray-700"
                    >
                      Unsubscribe Link
                    </label>
                    <p className="text-gray-500">
                      Automatically include an unsubscribe link in all emails
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-5 flex items-center">
                    <input
                      id="tracking"
                      name="tracking"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="tracking"
                      className="font-medium text-gray-700"
                    >
                      Tracking Disclosure
                    </label>
                    <p className="text-gray-500">
                      Include a disclosure about email tracking
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-5 flex items-center">
                    <input
                      id="optout"
                      name="optout"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="optout"
                      className="font-medium text-gray-700"
                    >
                      Maintain Opt-out List
                    </label>
                    <p className="text-gray-500">
                      Automatically update and honor opt-out requests
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Campaign Modal */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Create New Campaign
              </h3>
              <button
                onClick={() => setShowNewCampaignModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="campaign-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Campaign Name
                </label>
                <input
                  type="text"
                  id="campaign-name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g., Spring Sales Outreach"
                />
              </div>
              <div>
                <label
                  htmlFor="template"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Template
                </label>
                <select
                  id="template"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select a template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="contact-list"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact List
                </label>
                <select
                  id="contact-list"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select a contact list</option>
                  {contactLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name} ({list.count} contacts)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewCampaignModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCampaign}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCampaign && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Campaign
            </h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete "{selectedCampaign.name}"? This
              action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailCampaigns;
