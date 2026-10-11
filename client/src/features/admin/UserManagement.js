import React, { useState, useEffect, useContext } from 'react';
import { FaUserShield, FaUserSlash, FaBan, FaCheck, FaSort, FaTrash } from 'react-icons/fa';
import { AuthContext } from '../auth/AuthContext';
import './styles/UserManagement.css';

const UserManagement = () => {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'xp', direction: 'desc' });

    // Fetch Users
    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users', {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error("Failed to load operatives:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    // Actions
    const handleAction = async (userId, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this operative?`)) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ action })
            });

            if (res.ok) {
                // Refresh list
                fetchUsers();
            } else {
                const err = await res.json();
                alert(`Error: ${err.msg}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Sorting & Filtering
    const sortedUsers = React.useMemo(() => {
        let sortable = [...users];
        if (searchTerm) {
            sortable = sortable.filter(u =>
                u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                // Handle nested props if needed or just flat
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                // Special case for stats
                if (sortConfig.key === 'xp') {
                    // Assuming backend returns stats object or flattened
                    aVal = a.stats?.xp || 0;
                    bVal = b.stats?.xp || 0;
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortable;
    }, [users, sortConfig, searchTerm]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    if (loading) return <div className="admin-loading">Scanning Personnel Database...</div>;

    return (
        <div className="user-management fade-in">
            <div className="um-header">
                <h3>OPERATIVE ROSTER</h3>
                <input
                    type="text"
                    placeholder="Search Operative..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search"
                />
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('username')} style={{ cursor: 'pointer' }}>OPERATIVE <FaSort /></th>
                            <th onClick={() => requestSort('email')} style={{ cursor: 'pointer' }}>CONTACT <FaSort /></th>
                            <th onClick={() => requestSort('xp')} style={{ cursor: 'pointer' }}>XP / RANK <FaSort /></th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map(user => (
                            <tr key={user._id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar-small">{user.username[0].toUpperCase()}</div>
                                        <span>{user.username}</span>
                                        {user.isAdmin && <span className="admin-tag">ADMIN</span>}
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <div className="xp-cell">
                                        <span className="xp-val">{user.stats?.xp || 0} XP</span>
                                        <span className="rank-val">{user.stats?.rank || 'Recruit'}</span>
                                    </div>
                                </td>
                                <td>
                                    {user.isBanned ? (
                                        <span className="status-badge banned">BANNED</span>
                                    ) : (
                                        <span className="status-badge active">ACTIVE</span>
                                    )}
                                </td>
                                <td>
                                    <div className="action-row">
                                        {user.isBanned ? (
                                            <button className="action-btn" onClick={() => handleAction(user._id, 'unban')} title="Unban">
                                                <FaCheck /> REACTIVATE
                                            </button>
                                        ) : (
                                            <button className="action-btn danger" onClick={() => handleAction(user._id, 'ban')} title="Ban User">
                                                <FaBan /> FREEZE
                                            </button>
                                        )}

                                        {!user.isAdmin && (
                                            <button className="action-btn" onClick={() => handleAction(user._id, 'promote')} title="Promote to Admin">
                                                <FaUserShield /> PROMOTE
                                            </button>
                                        )}
                                        {user.isAdmin && (
                                            <button className="action-btn danger" onClick={() => handleAction(user._id, 'demote')} title="Revoke Admin">
                                                <FaUserSlash /> DEMOTE
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
