import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in POS KDMP:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      localStorage.removeItem('kdmp_auth_session');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 max-w-md w-full text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xl">
              !
            </div>
            <h3 className="text-lg font-bold text-gray-900">Kendala Tampilan Sistem</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Browser mendeteksi kendala pemuatan sementara. Silakan klik tombol di bawah untuk memuat ulang sistem kasir KDMP.
            </p>
            {this.state.error && (
              <div className="text-[11px] text-red-600 bg-red-50 p-2.5 rounded-lg text-left font-mono break-all max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="w-full py-2.5 px-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Muat Ulang Aplikasi (Refresh)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
