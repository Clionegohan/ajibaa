"use client";

import { useState, useEffect } from "react";

// フォントサイズ調整のためのコンテキスト
export const AccessibilityContext = React.createContext({
  fontSize: 'normal' as 'small' | 'normal' | 'large',
  setFontSize: (size: 'small' | 'normal' | 'large') => {},
  highContrast: false,
  setHighContrast: (enabled: boolean) => {},
});

interface AccessibilityProvidersProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProvidersProps) {
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // ローカルストレージから設定を読み込み
    const savedFontSize = localStorage.getItem('accessibility-fontSize');
    const savedHighContrast = localStorage.getItem('accessibility-highContrast');

    if (savedFontSize && ['small', 'normal', 'large'].includes(savedFontSize)) {
      setFontSize(savedFontSize as any);
    }

    if (savedHighContrast === 'true') {
      setHighContrast(true);
    }
  }, []);

  useEffect(() => {
    // 設定をローカルストレージに保存
    localStorage.setItem('accessibility-fontSize', fontSize);
    localStorage.setItem('accessibility-highContrast', highContrast.toString());

    // body要素にクラスを適用
    const body = document.body;
    
    // フォントサイズクラス
    body.classList.remove('font-small', 'font-normal', 'font-large');
    body.classList.add(`font-${fontSize}`);

    // ハイコントラストクラス
    if (highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }
  }, [fontSize, highContrast]);

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      setFontSize,
      highContrast,
      setHighContrast
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// アクセシビリティ設定パネル
export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { fontSize, setFontSize, highContrast, setHighContrast } = React.useContext(AccessibilityContext);

  return (
    <>
      {/* アクセシビリティボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-3 bg-wa-charcoal text-white rounded-full 
                 shadow-lg hover:bg-wa-charcoal/80 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-wa-orange focus:ring-offset-2"
        aria-label="アクセシビリティ設定"
        title="アクセシビリティ設定"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>

      {/* 設定パネル */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-end pt-20 pr-4">
          <div className="bg-white wa-border rounded-lg shadow-xl p-6 w-80 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-wa-charcoal">
                🔧 アクセシビリティ設定
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-wa-charcoal/60 hover:text-wa-charcoal p-1"
                aria-label="設定を閉じる"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* フォントサイズ設定 */}
              <div>
                <label className="block text-sm font-medium text-wa-charcoal mb-3">
                  📝 文字の大きさ
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'small', label: '小さく', description: '通常より小さい文字' },
                    { value: 'normal', label: '標準', description: '読みやすい標準的な文字' },
                    { value: 'large', label: '大きく', description: 'おばあちゃんも読みやすい大きな文字' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="fontSize"
                        value={option.value}
                        checked={fontSize === option.value}
                        onChange={(e) => setFontSize(e.target.value as any)}
                        className="w-4 h-4 text-wa-orange border-wa-brown/30 focus:ring-wa-orange"
                      />
                      <div>
                        <div className="font-medium text-wa-charcoal">{option.label}</div>
                        <div className="text-xs text-wa-charcoal/60">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* ハイコントラスト設定 */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    className="w-4 h-4 text-wa-orange border-wa-brown/30 rounded focus:ring-wa-orange"
                  />
                  <div>
                    <div className="font-medium text-wa-charcoal">🎨 高コントラスト</div>
                    <div className="text-xs text-wa-charcoal/60">
                      文字と背景のコントラストを高くして見やすくします
                    </div>
                  </div>
                </label>
              </div>

              {/* ヘルプテキスト */}
              <div className="pt-4 border-t border-wa-brown/20">
                <h4 className="font-medium text-wa-charcoal mb-2">💡 ご利用のヒント</h4>
                <ul className="text-xs text-wa-charcoal/70 space-y-1">
                  <li>• 設定は自動的に保存されます</li>
                  <li>• ブラウザの拡大機能と併用できます</li>
                  <li>• 読み上げソフトにも対応しています</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// React importを追加（JSXで使用するため）
import React from 'react';