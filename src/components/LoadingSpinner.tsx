"use client";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = "medium", 
  message = "読み込み中...",
  className = "" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8", 
    large: "w-12 h-12"
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg"
  };

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      {/* スピナー */}
      <div className={`${sizeClasses[size]} animate-spin mb-3`}>
        <div className="border-4 border-wa-brown/20 border-t-wa-orange rounded-full w-full h-full"></div>
      </div>
      
      {/* メッセージ */}
      <p className={`text-wa-charcoal/70 ${textSizeClasses[size]}`}>
        {message}
      </p>
    </div>
  );
}