import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TOOLBAR_OPTIONS = [
  [{ 'header': [1, 2, false] }],
  ['bold', 'italic', 'underline'],
  ['link', 'image'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'align': [] }],
  ['clean']
];

export default function QuillEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write something...',
        modules: {
          toolbar: TOOLBAR_OPTIONS
        }
      });

      // Set initial content if provided
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Handle content changes
      quillRef.current.on('text-change', () => {
        if (onChange) {
          onChange(quillRef.current.root.innerHTML);
        }
      });
    }

    // Cleanup
    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change');
      }
    };
  }, []);

  return (
    <div className="quill-editor">
      <div ref={editorRef} className="h-72" />
    </div>
  );
}