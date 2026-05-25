import { useState } from 'react';
import { mediaApi } from '../api/services';

export default function FileUpload({ label, folder, onUploaded, accept }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const { data } = await mediaApi.upload(file, folder);
      onUploaded(data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Check Cloudinary config and VPN.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="file-upload">
      <label>{label}</label>
      <input type="file" accept={accept} onChange={handleChange} disabled={uploading} />
      {uploading && <small>Uploading to Cloudinary...</small>}
      {error && <small className="error-text">{error}</small>}
    </div>
  );
}
