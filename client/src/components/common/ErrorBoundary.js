import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // Custom Fallback UI
            return (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0a0a12',
                    color: '#fff',
                    fontFamily: 'sans-serif',
                    textAlign: 'center',
                    padding: '20px'
                }}>
                    <FaExclamationTriangle style={{ fontSize: '4rem', color: '#ff0055', marginBottom: '20px' }} />
                    <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>System Malfunction</h1>
                    <p style={{ color: '#8b92a8', maxWidth: '500px', marginBottom: '30px' }}>
                        A critical error has occurred in the neural interface. Our engineers have been notified.
                        Please attempt to re-initialize.
                    </p>

                    <button
                        onClick={this.handleReload}
                        style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #00d4ff, #0071e3)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <FaRedo /> Re-Initialize Logic
                    </button>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div style={{
                            marginTop: '40px',
                            textAlign: 'left',
                            background: 'rgba(0,0,0,0.5)',
                            padding: '20px',
                            borderRadius: '8px',
                            maxWidth: '800px',
                            overflow: 'auto'
                        }}>
                            <code style={{ color: '#ff4d6d' }}>{this.state.error.toString()}</code>
                            <br />
                            <pre style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '10px' }}>
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
