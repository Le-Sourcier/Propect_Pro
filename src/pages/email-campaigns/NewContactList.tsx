import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const NewContactList = () => {
  const navigate = useNavigate();
  const [list, setList] = useState({
    name: '',
    description: '',
    tags: [] as string[],
    source: 'manual'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!list.name) {
      toast.error('Please enter a list name');
      return;
    }

    // Here you would normally create the list in the backend
    toast.success('Contact list created successfully');
    navigate('/email-campaigns?tab=contacts');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/email-campaigns?tab=contacts"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Lists
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">Create Contact List</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">List Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                List Name
              </label>
              <input
                type="text"
                value={list.name}
                onChange={(e) => setList({ ...list, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., Newsletter Subscribers"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={list.description}
                onChange={(e) => setList({ ...list, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Optional description for this list"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <input
                type="text"
                placeholder="Add tags (comma separated)"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value && !list.tags.includes(value)) {
                      setList({ ...list, tags: [...list.tags, value] });
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
              {list.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {list.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          setList({
                            ...list,
                            tags: list.tags.filter((_, i) => i !== index)
                          });
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Source
              </label>
              <select
                value={list.source}
                onChange={(e) => setList({ ...list, source: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="manual">Manual Entry</option>
                <option value="import">File Import</option>
                <option value="scraping">Web Scraping</option>
                <option value="api">API Integration</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Create List
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewContactList;