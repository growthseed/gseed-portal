import { useState, useRef } from 'react';
import { Camera, Loader2, User, AlertCircle, X } from 'lucide-react';
import { cloudinaryService } from '@/services/cloudinaryService';
import { supabase } from '@/lib/supabase';

interface AvatarUploadProps {
  /**
   * URL do avatar atual
   */
  currentAvatarUrl?: string;
  
  /**
   * ID do usuário (usado para organizar pasta no Cloudinary)
   */
  userId?: string;
  
  /**
   * Callback quando o upload for bem-sucedido
   */
  onUploadComplete: (avatarUrl: string) => void;
  
  /**
   * Tamanho do avatar em pixels (largura = altura)
   */
  size?: number;
  
  /**
   * Atualizar automaticamente no banco de dados
   */
  autoSave?: boolean;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function AvatarUpload({
  currentAvatarUrl,
  userId,
  onUploadComplete,
  size = 128,
  autoSave = false,
  className = '',
}: AvatarUploadProps) {
  const [avatar, setAvatar] = useState<string | null>(currentAvatarUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas');
      return;
    }

    // Validar tamanho (máx 2MB para avatar)
    if (file.size > 2 * 1024 * 1024) {
      setError('O avatar deve ter no máximo 2MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Criar preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload para Cloudinary
      let avatarUrl: string;
      if (userId) {
        avatarUrl = await cloudinaryService.uploadAvatar(file, userId);
      } else {
        avatarUrl = await cloudinaryService.uploadImage(file, 'gseed/avatars');
      }

      // Atualizar estado local
      setAvatar(avatarUrl);

      // Auto-save no banco se habilitado
      if (autoSave && userId) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('id', userId);

        if (updateError) {
          throw new Error('Erro ao salvar avatar no perfil');
        }
      }

      // Callback
      onUploadComplete(avatarUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload do avatar');
      setAvatar(currentAvatarUrl || null);
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

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={uploading}
      />

      {/* Avatar Container */}
      <div
        className="relative group cursor-pointer"
        style={{ width: size, height: size }}
        onClick={handleClick}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Avatar Image or Placeholder */}
        <div
          className={`w-full h-full rounded-full overflow-hidden border-4 transition-all ${
            uploading ? 'border-gseed-300' : 'border-white group-hover:border-gseed-500'
          } shadow-lg`}
        >
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <User size={size * 0.4} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Overlay */}
        {!uploading && (hovering || !avatar) && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity">
            <div className="text-center">
              <Camera size={size * 0.25} className="text-white mx-auto mb-1" />
              <p className="text-white text-xs font-medium">
                {avatar ? 'Trocar' : 'Adicionar'}
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {uploading && (
          <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
            <Loader2 size={size * 0.3} className="text-white animate-spin" />
          </div>
        )}

        {/* Remove Button */}
        {avatar && !uploading && hovering && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveAvatar();
            }}
            className="absolute -top-2 -right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors z-10"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Helper Text */}
      <p className="mt-3 text-sm text-gray-600 text-center">
        {uploading ? 'Enviando avatar...' : 'Clique para alterar foto'}
      </p>

      {/* Error */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
