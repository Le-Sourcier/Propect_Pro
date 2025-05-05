import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  List, 
  ListOrdered, 
  Undo, 
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading,
  Quote,
  Code,
  Strikethrough,
  Underline,
  Type,
  ChevronDown
} from 'lucide-react';

interface EmailEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const EmailEditor: React.FC<EmailEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline'
        }
      }),
      Placeholder.configure({
        placeholder: 'Write your email content here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px]'
      }
    }
  });

  if (!editor) {
    return null;
  }

  const toggleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const HeadingButton = () => (
    <div className="relative group">
      <button
        className="p-1 rounded hover:bg-gray-200 flex items-center"
        title="Heading"
      >
        <Type size={16} />
        <ChevronDown size={12} className="ml-1" />
      </button>
      <div className="absolute hidden group-hover:block bg-white border rounded-md shadow-lg py-1 mt-1 z-10">
        {[1, 2, 3].map(level => (
          <button
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${
              editor.isActive('heading', { level }) ? 'bg-gray-100' : ''
            }`}
          >
            Heading {level}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-50 border-b px-4 py-2 flex flex-wrap items-center gap-2">
        <HeadingButton />
        
        <span className="w-px h-4 bg-gray-300" />
        
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={toggleLink}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </button>
        
        <span className="w-px h-4 bg-gray-300" />
        
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        
        <span className="w-px h-4 bg-gray-300" />
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        
        <span className="w-px h-4 bg-gray-300" />
        
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          title="Quote"
        >
          <Quote size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('code') ? 'bg-gray-200' : ''}`}
          title="Code"
        >
          <Code size={16} />
        </button>
        
        <span className="w-px h-4 bg-gray-300" />
        
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>
      
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
      
      <div className="bg-gray-50 border-t px-4 py-2 text-xs text-gray-500">
        Tip: Use Markdown shortcuts like # for headings, * for lists, &gt; for quotes
      </div>
    </div>
  );
};

export default EmailEditor;