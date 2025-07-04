import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181A20] via-[#23272F] to-[#181A20] text-center p-8">
          <h1 className="text-3xl font-bold text-[#B0FFB0] mb-4">Something went wrong</h1>
          <p className="mb-6 text-[#B0FFB0]/80">An unexpected error occurred. Please try reloading the page.</p>
          <button onClick={this.handleReload} className="px-6 py-3 rounded-lg bg-[var(--kick-green)] text-[#181A20] font-bold text-lg shadow-lg hover:bg-[#53FC18] transition">Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 