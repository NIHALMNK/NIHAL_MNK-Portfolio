import { useCallback, useMemo, useState } from 'react';
import Cropper from 'react-easy-crop';
import { API_BASE_URL } from '../../config';
import getCroppedImg from '../../utils/cropImage';

const modes = [
  { key: 'url', label: 'Use URL' },
  { key: 'upload', label: 'Upload' },
];

function ImageUploader({ label, value, onChange, token, aspect = 16 / 9 }) {
  const [mode, setMode] = useState(value ? 'url' : 'upload');
  const [localImage, setLocalImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const currentMode = useMemo(() => mode, [mode]);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError('');
    if (nextMode === 'url') {
      setLocalImage(null);
      setIsCropping(false);
    }
  };

  const handleUrlChange = (event) => {
    setError('');
    onChange(event.target.value);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLocalImage(reader.result);
      setIsCropping(true);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const uploadCroppedImage = useCallback(async () => {
    if (!token) {
      setError('Please log in again to upload images.');
      return;
    }
    if (!localImage || !croppedAreaPixels) {
      setError('Select and crop an image before uploading.');
      return;
    }
    try {
      setIsUploading(true);
      const blob = await getCroppedImg(localImage, croppedAreaPixels);
      const formData = new FormData();
      formData.append('image', blob, 'upload.jpg');
      const response = await fetch(`${API_BASE_URL}/api/uploads`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Upload failed');
      }
      onChange(data.url);
      setIsCropping(false);
      setLocalImage(null);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  }, [croppedAreaPixels, localImage, onChange, token]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-[0.4em] text-slate-400">{label}</label>
        <div className="flex gap-1 rounded-full border border-white/10 bg-black/20 p-1">
          {modes.map((option) => (
            <button
              type="button"
              key={option.key}
              onClick={() => handleModeChange(option.key)}
              className={`rounded-full px-3 py-1 text-xs ${
                currentMode === option.key ? 'bg-white text-slate-900 font-semibold' : 'text-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {currentMode === 'url' ? (
        <input
          type="url"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-teal-300 focus:outline-none"
          value={value || ''}
          onChange={handleUrlChange}
          placeholder="https://example.com/image.jpg"
        />
      ) : (
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-teal-500/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal-100 hover:file:bg-teal-500/40"
          />
          {value && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
              <img src={value} alt="Preview" className="h-32 w-full rounded-xl object-cover" />
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-rose-300">{error}</p>}

      {isCropping && localImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f172a] p-6 space-y-6">
            <h3 className="text-lg font-semibold">Crop image</h3>
            <div className="relative h-[320px] w-full">
              <Cropper
                image={localImage}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex flex-col gap-4">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCropping(false);
                    setLocalImage(null);
                    setCroppedAreaPixels(null);
                  }}
                  className="rounded-full border border-white/20 px-5 py-2 text-sm text-white hover:border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={uploadCroppedImage}
                  disabled={isUploading}
                  className="rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-5 py-2 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;


