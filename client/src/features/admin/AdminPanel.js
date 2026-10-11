import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import AdminLock from './AdminLock'; // Security Wrapper
import AdminDashboard from './AdminDashboard'; // Dashboard
import SystemAnalytics from './SystemAnalytics'; // New Analytics View
import UserManagement from './UserManagement'; // User Console
import SystemLogs from './SystemLogs'; // New Logs Console
import NetworkTraffic from './NetworkTraffic'; // New Traffic Monitor
import './styles/AdminLayout.css';
import { FaDatabase, FaShieldAlt, FaChartLine, FaUsers, FaTerminal, FaNetworkWired } from 'react-icons/fa';

const AdminPanel = () => {
    const { token } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <AdminLock>
            <div className="admin-panel">
                <header className="admin-header">
                    <div>
                        <h1><FaShieldAlt /> COMMAND CENTER</h1>
                        <p>System Administrator Clearance Level 5</p>
                    </div>
                </header>

                <div className="admin-tabs">
                    <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                        <FaChartLine /> DASHBOARD
                    </button>
                    <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                        <FaUsers /> OPERATIVES
                    </button>
                    <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
                        <FaDatabase /> ANALYTICS (DATA)
                    </button>
                    <button className={activeTab === 'traffic' ? 'active' : ''} onClick={() => setActiveTab('traffic')}>
                        <FaNetworkWired /> NETWORK
                    </button>
                    <button className={activeTab === 'logs' ? 'active' : ''} onClick={() => setActiveTab('logs')}>
                        <FaTerminal /> SYSTEM LOGS
                    </button>
                </div>

                <div className="admin-content">
                    {activeTab === 'dashboard' && <AdminDashboard />}
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'analytics' && <SystemAnalytics />}
                    {activeTab === 'traffic' && <NetworkTraffic />}
                    {activeTab === 'logs' && <SystemLogs />}
                </div>
            </div>
        </AdminLock>
    );
};





export default AdminPanel;
