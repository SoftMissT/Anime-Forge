import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  // FIX: Using class property syntax to initialize state. This is a modern and standard approach for React class components and should resolve issues where the `state` property is not being found on the component instance.
  state: State = {
    hasError: false,
    error: undefined,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900/50 text-white p-8 rounded-lg">
            <div className="text-center max-w-lg bg-gray-800/80 p-8 rounded-lg border border-red-500/30">
                <AlertTriangleIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
                <h1 className="text-3xl font-bold font-gangofthree mb-2">Algo deu errado</h1>
                <p className="text-gray-400 mb-6">
                    A aplicação encontrou um erro inesperado. Tente recarregar a página. Se o problema persistir, verifique o console ou contate o suporte.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-danger"
                >
                    Recarregar a Página
                </button>
                {this.state.error && (
                    <details className="mt-6 text-left bg-black/30 p-4 rounded-lg">
                        <summary className="cursor-pointer text-gray-500 hover:text-white">Detalhes Técnicos</summary>
                        <pre className="mt-2 text-xs text-red-400 whitespace-pre-wrap overflow-auto max-h-40">
                            {this.state.error.stack || this.state.error.toString()}
                        </pre>
                    </details>
                )}
            </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;