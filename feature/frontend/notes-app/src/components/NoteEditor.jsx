import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../utils/helper';
import Loading from './Loading.jsx';
import ErrorMessage from './ErrorMessage.jsx';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    if (!id) { setLoading(false); return; }
    (async () => {
      try {
        const data = await apiRequest(`/notes/${id}`, { method: 'GET' });
        if (!active) return;
        if (titleRef.current) titleRef.current.value = data.title || '';
        if (contentRef.current) contentRef.current.innerHTML = data.content || '';
      } catch (e) {
        if (active) setError(e.message || 'Failed to load note');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  const onSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: titleRef.current?.value || '',
        content: contentRef.current?.innerHTML || ''
      };
      if (id) {
        await apiRequest(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        const created = await apiRequest(`/notes`, { method: 'POST', body: JSON.stringify(payload) });
        if (created?.id || created?._id) {
          navigate(`/note/${created.id || created._id}`);
          return;
        }
      }
      navigate('/home');
    } catch (e) {
      setError(e.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => navigate('/home');

  return (
    <div className="p-4">
      {loading && <Loading />}
      <ErrorMessage message={error} />
      <input ref={titleRef} type="text" placeholder="Title" className="w-full border p-2 mb-3" />
      <div
        ref={contentRef}
        contentEditable
        className="w-full min-h-64 border p-3 rounded bg-white"
        style={{ outline: 'none' }}
      />
      <div className="mt-3 flex gap-2">
        <button className="btn-primary" onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default NoteEditor;


