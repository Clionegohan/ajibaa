"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center p-8 wa-paper wa-border rounded-lg max-w-md">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-xl font-semibold text-wa-charcoal mb-3">
              申し訳ございません
            </h2>
            <p className="text-wa-charcoal/70 mb-6 leading-relaxed">
              予期しないエラーが発生しました。
              <br />
              ページを再読み込みするか、しばらく時間をおいてから再度お試しください。
            </p>
            
            {/* エラー詳細（開発環境でのみ表示） */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-4 p-3 bg-wa-red/5 border border-wa-red/20 rounded text-xs">
                <summary className="cursor-pointer text-wa-red font-medium mb-2">
                  エラー詳細（開発者向け）
                </summary>
                <pre className="whitespace-pre-wrap text-wa-charcoal/70">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-wa-orange text-white rounded-lg hover:bg-wa-orange/80 
                         transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                もう一度試す
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-wa-brown/30 text-wa-charcoal rounded-lg 
                         hover:bg-wa-cream/50 transition-colors"
              >
                ページを再読み込み
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}