import React from 'react';
import { ChevronDown } from 'lucide-react';

interface PersonalizationTag {
  name: string;
  description: string;
  tag: string;
}

interface PersonalizationMenuProps {
  onInsertTag: (tag: string) => void;
}

const PERSONALIZATION_TAGS: PersonalizationTag[] = [
  { name: 'First Name', description: 'Contact\'s first name', tag: '{{first_name}}' },
  { name: 'Last Name', description: 'Contact\'s last name', tag: '{{last_name}}' },
  { name: 'Company Name', description: 'Company name', tag: '{{company_name}}' },
  { name: 'City', description: 'Company city', tag: '{{city}}' },
  { name: 'Industry', description: 'Company industry', tag: '{{industry}}' },
  { name: 'Website', description: 'Company website', tag: '{{website}}' },
  { name: 'Phone', description: 'Company phone', tag: '{{phone}}' },
];

const PersonalizationMenu: React.FC<PersonalizationMenuProps> = ({ onInsertTag }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        Add Personalization
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-10 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {PERSONALIZATION_TAGS.map((tag) => (
                <button
                  key={tag.tag}
                  onClick={() => {
                    onInsertTag(tag.tag);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  <div className="font-medium text-sm text-gray-900">{tag.name}</div>
                  <div className="text-xs text-gray-500">{tag.description}</div>
                  <div className="text-xs text-gray-400 font-mono mt-1">{tag.tag}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PersonalizationMenu;