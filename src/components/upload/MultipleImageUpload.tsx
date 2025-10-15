import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cloudinaryService } from '../../services/cloudinaryService';

interface MultipleImageUploadProps {
  /**
   * Callback quando uploads forem bem-sucedidos
   * Retorna array de URLs das imagens no Cloudinary
   */
  onUploadComplete: (imageUrls: string[]) => void;
  
  /**
   * URLs das imagens atuais (se existirem)
   */
  currentImageUrls?: string[];
  
  /**
   * Pasta no Cloudinary onde salvar
   */
  folder?: string;
  
  /**
   * Número máximo de imagens permitidas
   */
  maxImages?: number;
  
  /**
   * Tamanho máximo por imagem em MB
   */
  maxSizeMB?: number;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function MultipleImageUpload({
  onUploadComplete,
  currentImageUrls = [],
  folder = 'gseed',
  maxImages = 5,
  maxSizeMB = 5,
  className = '',
}: MultipleImageUploadProps) {
  const [images, setImages] = useState<string[]>(currentImageUrls);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelect = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Validar número de imagens
    if (images.length + fileArray.length > maxImages) {
      setError(`Você pode enviar no máximo ${maxImages} imagens`);
      return;
    }

    // Validar cada arquivo
    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        setError('Apenas imagens são permitidas');
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Cada imagem deve ter no máximo ${maxSizeMB}MB`);
        return;
      }
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Criar previews locais
      const previews: string[] = [];
      for (const file of fileArray) {
        const reader = new FileReader();
        const preview = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        previews.push(preview);
      }

      // Adicionar previews temporariamente
      const tempImages = [...images, ...previews];
      setImages(tempImages);

      // Upload para Cloudinary
      const uploadedUrls: string[] = [];
      for (let i = 0; i < fileArray.length; i++) {
        const url = await cloudinaryService.uploadImage(fileArray[i], folder);
        uploadedUrls.push(url);
        setUploadProgress(((i + 1) / fileArray.length) * 100);
      }

      // Substituir previews pelas URLs reais
      const finalImages = [...images, ...uploadedUrls];
      setImages(finalImages);
      onUploadComplete(finalImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload');
      // Remover previews em caso de erro
      setImages(images);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelect(e.target.files);
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelect(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUploadComplete(newImages);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = images.length < maxImages && !uploading;

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        disabled={uploading || !canAddMore}
      />

      {/* Grid de Imagens */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={imageUrl}
              alt={`Upload ${index + 1}`}
              className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                disabled={uploading}
              >
                <X size={20} />
              </button>
            </div>
            {index < images.length && uploading && (
              <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                <Loader2 size={24} className="text-white animate-spin" />
              </div>
            )}
          </div>
        ))}

        {/* Botão de Upload */}
        {canAddMore && (
          <div
            onClick={handleClick}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`aspect-square border-2 border-dashed rounded-lg transition-all cursor-pointer flex items-center justify-center ${
              dragActive
                ? 'border-gseed-500 bg-gseed-50'
                : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
          >
            <div className="text-center p-4">
              {uploading ? (
                <>
                  <Loader2 size={32} className="text-gseed-500 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-gray-600">{Math.round(uploadProgress)}%</p>
                </>
              ) : (
                <>
                  <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 font-medium">
                    Adicionar
                  </p>
                  <p className="text-xs text-gray-400">
                    {images.length}/{maxImages}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 text-sm text-gray-600">
        <ImageIcon size={16} className="flex-shrink-0 mt-0.5" />
        <p>
          Você pode adicionar até <strong>{maxImages} imagens</strong>. 
          Arraste e solte ou clique para selecionar. 
          Máximo {maxSizeMB}MB por imagem.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
