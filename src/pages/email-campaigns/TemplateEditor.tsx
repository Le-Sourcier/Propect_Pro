import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, Copy, ArrowLeft, Plus, X, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

interface PersonalizationTag {
  name: string;
  description: string;
  tag: string;
}

const PERSONALIZATION_TAGS: PersonalizationTag[] = [
  { name: 'First Name', description: 'Contact\'s first name', tag: '{{first_name}}' },
  { name: 'Last Name', description: 'Contact\'s last name', tag: '{{last_name}}' },
  { name: 'Company Name', description: 'Company name', tag: '{{company_name}}' },
  { name: 'City', description: 'Company city', tag: '{{city}}' },
  { name: 'Industry', description: 'Company industry', tag: '{{industry}}' },
  { name: 'Website', description: 'Company website', tag: '{{website}}' },
  { name: 'Phone', description: 'Company phone', tag: '{{phone}}' },
  { name: 'Custom Field 1', description: 'Custom field 1', tag: '{{custom_field_1}}' },
  { name: 'Custom Field 2', description: 'Custom field 2', tag: '{{custom_field_2}}' }
];

const TemplateEditor = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const isNew = !templateId;

  const [template, setTemplate] = useState({
    name: '',
    subject: '',
    content: 'Hi {{first_name}},\n\nI noticed that {{company_name}} is...',
    category: 'cold-outreach',
    language: 'english'
  });

  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showTestEmailModal, setShowTestEmailModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [previewData, setPreviewData] = useState({
    first_name: 'John',
    last_name: 'Doe',
    company_name: 'Acme Inc',
    city: 'Paris',
    industry: 'Technology',
    website: 'www.acme.com',
    phone: '+33 1 23 45 67 89',
    custom_field_1: 'Custom 1',
    custom_field_2: 'Custom 2'
  });

  const insertTag = (tag: string) => {
    const textarea = document.getElementById('template-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      
      setTemplate(prev => ({
        ...prev,
        content: before + tag + after
      }));
      
      // Reset cursor position after tag insertion
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + tag.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
    setShowTagsModal(false);
  };

  const previewContent = () => {
    let preview = template.content;
    Object.entries(previewData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      preview = preview.replace(regex, value);
    });
    return preview;
  };

  const handleSendTestEmail = () => {
    if (!testEmail) {
      toast.error('Please enter a test email address');
      return;
    }
    
    // Here you would normally send the test email via your backend
    toast.success(`Test email sent to ${testEmail}`);
    setShowTestEmailModal(false);
    setTestEmail('');
  };

  const handleSave = () => {
    if (!template.name || !template.subject || !template.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Save template logic here
    toast.success('Template saved successfully');
    navigate('/email-campaigns');
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
            Back to Templates
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">
            {isNew ? 'Create Template' : 'Edit Template'}
          </h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setTemplate(prev => ({
                ...prev,
                name: `${prev.name} (Copy)`,
              }));
              toast.success('Template duplicated');
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Template Editor */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Template Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Template Name
                </label>
                <input
                  type="text"
                  value={template.name}
                  onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g., Cold Outreach Template"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={template.subject}
                  onChange={(e) => setTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter default subject line"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Template Content
                </label>
                <div className="mt-1">
                  <textarea
                    id="template-content"
                    rows={12}
                    value={template.content}
                    onChange={(e) => setTemplate(prev => ({ ...prev, content: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                    placeholder="Enter your email template content..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Personalization */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Personalization</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button 
                  onClick={() => setShowTagsModal(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Personalization Tag
                </button>
                <div className="text-sm text-gray-500">
                  Click where you want to insert a tag, then click "Add Personalization Tag"
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Template Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Template Settings</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={template.category}
                  onChange={(e) => setTemplate(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="cold-outreach">Cold Outreach</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="promotional">Promotional</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Default Language
                </label>
                <select
                  value={template.language}
                  onChange={(e) => setTemplate(prev => ({ ...prev, language: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="english">English</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="spanish">Spanish</option>
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
                onClick={() => setShowPreviewModal(true)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Preview Template
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

      {/* Personalization Tags Modal */}
      {showTagsModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Personalization Tag</h3>
              <button
                onClick={() => setShowTagsModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {PERSONALIZATION_TAGS.map((tag) => (
                <button
                  key={tag.tag}
                  onClick={() => insertTag(tag.tag)}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">{tag.name}</div>
                  <div className="text-sm text-gray-500">{tag.description}</div>
                  <div className="text-xs text-gray-400 font-mono mt-1">{tag.tag}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Template Preview</h3>
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
                <div className="mt-1 text-gray-900">{template.subject}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Preview with sample data:</div>
                <div className="mt-2 p-4 border rounded-md whitespace-pre-wrap font-mono text-sm">
                  {previewContent()}
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

export default TemplateEditor;