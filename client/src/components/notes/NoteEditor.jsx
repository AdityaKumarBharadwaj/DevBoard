import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Eye, Edit3, Save, Loader2, Code, X } from 'lucide-react';

export default function NoteEditor({ note, onSave, onClose }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.markdownContent || '');
  const [mode, setMode] = useState('split');
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [status, setStatus] = useState('All changes saved');
  const saveTimer = useRef(null);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.markdownContent || '');
    setIsDirty(false);
  }, [note]);

  useEffect(() => {
    if (!isDirty) return;
    setStatus('Saving...');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      handleSave();
    }, 2000);
    return () => clearTimeout(saveTimer.current);
  }, [title, content]);

  useEffect(() => {
    return () => clearTimeout(saveTimer.current);
  }, []);

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      await onSave({ title, markdownContent: content });
      setIsDirty(false);
      setStatus('All changes saved');
    } catch (err) {
      setStatus('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsDirty(true);
    setStatus('Unsaved changes');
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setIsDirty(true);
    setStatus('Unsaved changes');
  };

  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline ? (
        <SyntaxHighlighter
          style={atomOneDark}
          language={match ? match[1] : 'text'}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="rounded bg-indigo-500/10 px-1 py-0.5 font-mono text-sm text-indigo-200" {...props}>
          {children}
        </code>
      );
    },
    a({ href, children }) {
      return (
        <a href={href} className="text-indigo-400 hover:underline" target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    },
    h1({ children }) {
      return <h1 className="text-3xl font-bold text-white">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="text-2xl font-bold text-white">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="text-xl font-bold text-white">{children}</h3>;
    },
    p({ children }) {
      return <p className="text-gray-300 leading-7">{children}</p>;
    },
    li({ children }) {
      return <li className="text-gray-300 ml-5 list-disc">{children}</li>;
    },
    blockquote({ children }) {
      return <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-400">{children}</blockquote>;
    },
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-surface-border bg-dark-900 shadow-card overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-surface-border px-5 py-4">
        <div className="flex-1">
          <input
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled note"
            className="w-full bg-transparent text-2xl font-bold text-white outline-none placeholder:text-gray-500"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`rounded-full px-3 py-2 transition ${mode === 'edit' ? 'bg-indigo-600 text-white' : 'hover:bg-surface-raised'}`}
          >
            <Edit3 size={16} /> Edit
          </button>
          <button
            type="button"
            onClick={() => setMode('split')}
            className={`rounded-full px-3 py-2 transition ${mode === 'split' ? 'bg-indigo-600 text-white' : 'hover:bg-surface-raised'}`}
          >
            <Code size={16} /> Split
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`rounded-full px-3 py-2 transition ${mode === 'preview' ? 'bg-indigo-600 text-white' : 'hover:bg-surface-raised'}`}
          >
            <Eye size={16} /> Preview
          </button>
          <div className="flex items-center gap-2 rounded-full bg-surface-raised px-3 py-2 text-xs text-gray-300">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span className={saving ? 'text-white' : 'text-emerald-400'}>{status}</span>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex h-full flex-1 flex-col overflow-hidden bg-dark-950">
        {mode === 'preview' ? (
          <div className="prose prose-invert max-w-none overflow-auto p-5">
            <ReactMarkdown components={renderers}>{content || '_No content yet_'}</ReactMarkdown>
          </div>
        ) : mode === 'edit' ? (
          <textarea
            value={content}
            onChange={handleContentChange}
            className="h-full w-full resize-none bg-dark-950 p-5 text-gray-200 font-mono leading-relaxed outline-none"
            placeholder="Write markdown content here..."
          />
        ) : (
          <div className="grid h-full gap-4 lg:grid-cols-2">
            <textarea
              value={content}
              onChange={handleContentChange}
              className="h-full w-full resize-none rounded-xl bg-dark-950 p-5 text-gray-200 font-mono leading-relaxed outline-none"
              placeholder="Write markdown content here..."
            />
            <div className="overflow-auto rounded-xl border-l border-surface-border bg-dark-950 p-5">
              <ReactMarkdown components={renderers}>{content || '_No content yet_'}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
