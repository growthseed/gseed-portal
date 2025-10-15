import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cloudinaryService } from '../../services/cloudinaryService';

interface ImageUploadProps {
  /**
   * Callback quando o upload for bem-sucedido
   * Retorna a URL da imagem no Cloudinary
   */
  onUploadComplete: (imageUrl: string) => void;
  
  /**
   * URL da imagem atual (se existir)
   */
  currentImageUrl?: string;
  
  /**
   * Pasta no Cloudinary onde salvar
   */
  folder?: string;
  
  /**
   * Texto do botão
   */
  buttonText?: string;
  
  /**
   * Mostrar preview da imagem
   */
  showPreview?: boolean;
  
  /**
   * Tamanho máximo em MB (padrão: 5MB)
   */
  maxSizeMB?: number;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
  
  /**
   * Modo de exibição: 'button' | 'dropzone'
   */
  variant?: 'button' | 'dropzone';
  
  /**
   * Altura da dropzone (apenas quando variant='dropzone')
   */
  dropzoneHeight?: string;
}

export function ImageUpload({
  onUploadComplete,
  currentImageUrl,
  folder = 'gseed',
  buttonText = 'Escolher Imagem',
  showPreview = true,
  maxSizeMB = 5,
  className = '',
  variant = 'button',
  dropzoneHeight = '200px',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas');
      return;
    }

    // Validar tamanho
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`A imagem deve ter no máximo ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Criar preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload para Cloudinary
      const imageUrl = await cloudinaryService.uploadImage(file, folder);
      
      // Callback com URL
      onUploadComplete(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Variant: Button
  if (variant === 'button') {
    return (
      <div className={className}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploading}
        />

        {showPreview && preview && (
          <div className="mb-4 relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
              disabled={uploading}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleClick}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload size={20} />
              {buttonText}
            </>
          )}
        </button>

        {error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>
    );
  }

  // Variant: Dropzone
  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={uploading}
      />

      {showPreview && preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-full rounded-lg border-2 border-gray-200 object-cover"
            style={{ height: dropzoneHeight }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleClick}
              className="p-3 bg-white hover:bg-gray-100 rounded-lg transition-colors"
              disabled={uploading}
            >
              <Upload size={20} className="text-gray-700" />
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              disabled={uploading}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg transition-all cursor-pointer ${
            dragActive
              ? 'border-gseed-500 bg-gseed-50'
              : 'border-gray-300 hover:border-gray-400 bg-white'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ height: dropzoneHeight }}
        >
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            {uploading ? (
              <>
                <Loader2 size={48} className="text-gseed-500 animate-spin mb-4" />
                <p className="text-sm text-gray-600">Enviando imagem...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon size={32} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Arraste uma imagem ou clique para selecionar
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF até {maxSizeMB}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
