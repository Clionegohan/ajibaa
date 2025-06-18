"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";

interface ImageUploadProps {
  onImageUpload: (storageId: string, url: string) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  onImageUpload,
  maxSizeMB = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  className = "",
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Phase 3: 段階的実装 - 仮のmutation呼び出し
  // Convex環境が整うまで一時的にモック関数
  const generateUploadUrl = useMutation((() => "mock-generateUploadUrl") as any);
  const saveImage = useMutation((() => "mock-saveImage") as any);

  const validateFile = (file: File): string | null => {
    // ファイルサイズチェック
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `ファイルサイズは${maxSizeMB}MB以下にしてください`;
    }

    // ファイル形式チェック
    if (!acceptedTypes.includes(file.type)) {
      return "対応していない画像形式です（JPEG、PNG、WebPのみ）";
    }

    return null;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    
    // ファイル検証
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // プレビュー生成
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // アップロードURL取得
      const uploadUrl = await generateUploadUrl();
      setUploadProgress(30);

      // ファイルアップロード
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("画像のアップロードに失敗しました");
      }

      const { storageId } = await response.json();
      setUploadProgress(70);

      // Convexに画像情報を保存
      const result = await saveImage({
        storageId,
        name: file.name,
        type: file.type,
        size: file.size,
      });

      setUploadProgress(100);
      
      // コールバック実行
      onImageUpload(storageId, result.url);
      
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);

    } catch (error) {
      console.error("画像アップロードエラー:", error);
      setError(error instanceof Error ? error.message : "アップロードに失敗しました");
      setIsUploading(false);
      setUploadProgress(0);
      setPreview(null);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const removeImage = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {preview ? (
        <div className="relative">
          <Image
            src={preview}
            alt="プレビュー"
            width={400}
            height={192}
            className="w-full h-48 object-cover rounded-lg border-2 border-wa-brown/20"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-wa-red text-white rounded-full w-8 h-8 
                     flex items-center justify-center hover:bg-wa-red/80 transition-colors"
            disabled={isUploading}
          >
            ×
          </button>
          
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-wa-charcoal mb-2">アップロード中...</div>
                <div className="w-32 h-2 bg-wa-brown/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-wa-orange transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="text-sm text-wa-charcoal/70 mt-1">
                  {uploadProgress}%
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className="w-full h-48 border-2 border-dashed border-wa-brown/30 rounded-lg
                   flex flex-col items-center justify-center gap-3
                   hover:border-wa-brown/50 hover:bg-wa-cream/30 transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg 
            className="w-12 h-12 text-wa-brown/40" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          
          <div className="text-center">
            <div className="text-wa-charcoal font-medium mb-1">
              📸 写真をアップロード
            </div>
            <div className="text-sm text-wa-charcoal/60">
              クリックして画像を選択
            </div>
            <div className="text-xs text-wa-charcoal/50 mt-1">
              JPEG、PNG、WebP形式（{maxSizeMB}MB以下）
            </div>
          </div>
        </button>
      )}

      {error && (
        <div className="mt-2 p-3 bg-wa-red/10 border border-wa-red/20 rounded-lg">
          <div className="text-wa-red text-sm">{error}</div>
        </div>
      )}
    </div>
  );
}