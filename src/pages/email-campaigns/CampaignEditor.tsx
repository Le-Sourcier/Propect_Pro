import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, Send, Clock, ArrowLeft, Plus, X, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import EmailEditor from './components/EmailEditor';
import PersonalizationMenu from './components/PersonalizationMenu';

const CampaignEditor = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showTestEmailModal, setShowTestEmailModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  // Mock campaign data
  const [campaign, setCampaign] = useState({
    name: campaignId ? 'Edit Campaign' : 'New Campaign',
    subject: '',
    previewText: '',
    content: '',
    template: '',
    contactList: '',
    scheduledDate: '',
  });

  // Mock preview data
  const [previewData] = useState({
    first_name: 'John',
    last_name: 'Doe',
    company_name: 'Acme Inc',
    city: 'Paris',
    industry: 'Technology',
    website: 'www.acme.com',
    phone: '+33 1 23 45 67 89'
  });

  const handleSave = () => {
    // Save campaign logic here
    toast.success('Campaign saved successfully');
  };

  const handleSchedule = () => {
    setShowScheduleModal(true);
  };

  const handleSend = () => {
    // Send campaign logic here
    toast.success('Campaign sent successfully');
    navigate('/email-campaigns');
  };

  const handleInsertTag = (tag: string) => {
    setCampaign(prev => ({
      ...prev,
      content: prev.content + ' ' + tag
    }));
  };

  const handlePreview = () => {
    if (!campaign.subject || !campaign.content) {
      toast.error('Please add a subject line and content before previewing');
      return;
    }
    setShowPreviewModal(true);
  };

  const handleSendTestEmail = () => {
    if (!testEmail) {
      toast.error('Please enter a test email address');
      return;
    }

    if (!campaign.subject || !campaign.content) {
      toast.error('Please add a subject line and content before sending a test email');
      return;
    }

    // Here you would normally send the test email via your backend
    toast.success(`Test email sent to ${testEmail}`);
    setShowTestEmailModal(false);
    setTestEmail('');
  };

  const previewContent = () => {
    let preview = campaign.content;
    Object.entries(previewData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      preview = preview.replace(regex, value);
    });
    return preview;
  };

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
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">{campaign.name}</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSchedule}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Clock className="h-4 w-4 mr-2" />
            Schedule
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </button>
          <button
            onClick={handleSend}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Email Editor */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Email Content</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={campaign.subject}
                  onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter subject line"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preview Text
                </label>
                <input
                  type="text"
                  value={campaign.previewText}
                  onChange={(e) => setCampaign({ ...campaign, previewText: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter preview text"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Content
                  </label>
                  <PersonalizationMenu onInsertTag={handleInsertTag} />
                </div>
                <EmailEditor
                  content={campaign.content}
                  onChange={(content) => setCampaign({ ...campaign, content })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Campaign Settings</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Template
                </label>
                <select
                  value={campaign.template}
                  onChange={(e) => setCampaign({ ...campaign, template: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select a template</option>
                  <option value="1">Cold Outreach</option>
                  <option value="2">Follow-up Email</option>
                  <option value="3">Product Demo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact List
                </label>
                <select
                  value={campaign.contactList}
                  onChange={(e) => setCampaign({ ...campaign, contactList: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select a list</option>
                  <option value="1">Restaurants Paris (156)</option>
                  <option value="2">Lyon Tech Companies (87)</option>
                  <option value="3">Healthcare Providers (215)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Preview</h2>
            </div>
            <div className="p-6">
              <button
                onClick={handlePreview}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Preview Email
              </button>
              <button
                onClick={() => setShowTestEmailModal(true)}
                className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Send Test Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule Campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time Zone
                </label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                  <option>Paris (UTC+1)</option>
                  <option>London (UTC)</option>
                  <option>New York (UTC-5)</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    toast.success('Campaign scheduled successfully');
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Email Preview</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700">Subject:</div>
                <div className="mt-1 text-gray-900">{campaign.subject}</div>
              </div>
              {campaign.previewText && (
                <div>
                  <div className="text-sm font-medium text-gray-700">Preview Text:</div>
                  <div className="mt-1 text-gray-500">{campaign.previewText}</div>
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-gray-700">Content:</div>
                <div className="mt-2 p-4 border rounded-md bg-gray-50">
                  <div dangerouslySetInnerHTML={{ __html: previewContent() }} />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Test Email Modal */}
      {showTestEmailModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Send Test Email</h3>
              <button
                onClick={() => setShowTestEmailModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Send test email to:
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTestEmailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendTestEmail}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignEditor;