import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FaChevronLeft, FaInfoCircle, FaCheck } from 'react-icons/fa';
import './RoleSelection.css';

const RoleSelection = ({ roles, onSelectRole, onBack }) => {
    const [selectedDetailRole, setSelectedDetailRole] = useState(null);

    const handleInfoClick = (e, role) => {
        e.stopPropagation(); // Prevent card selection triggering
        setSelectedDetailRole(role);
    };

    const handleCloseModal = () => {
        setSelectedDetailRole(null);
    };

    return (
        <div className="role-select-container">
            <button onClick={onBack} className="back-button">
                <FaChevronLeft /> Back to Lobby
            </button>
            <h1 className="role-select-title">Assume Your Role</h1>
            <p className="role-select-subtitle">Your choice determines your perspective in the simulation.</p>

            <div className="role-grid">
                {roles.map(role => (
                    <div key={role.id} className="role-card" onClick={() => onSelectRole(role)}>
                        <div className={`role-type-badge ${role.id === 'analyst' ? 'tech' : 'mgmt'}`}>
                            {role.type}
                        </div>
                        <div className="role-avatar-wrapper">
                            <img src={role.avatar} alt={role.name} className="role-avatar" />
                        </div>
                        <h3>{role.title}</h3>

                        <button className="role-info-btn" onClick={(e) => handleInfoClick(e, role)}>
                            <FaInfoCircle /> Role Intel
                        </button>
                    </div>
                ))}
            </div>

            {selectedDetailRole && ReactDOM.createPortal(
                <div className="role-modal-overlay" onClick={handleCloseModal}>
                    <div className="role-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="role-modal-header">
                            <h2>{selectedDetailRole.title}</h2>
                            <span className={`role-modal-badge ${selectedDetailRole.id === 'analyst' ? 'tech' : 'mgmt'}`}>
                                {selectedDetailRole.type}
                            </span>
                        </div>

                        <div className="role-modal-body">
                            <div className="role-modal-section">
                                <h4>Mission Profile</h4>
                                <p>{selectedDetailRole.fullDescription || selectedDetailRole.description}</p>
                            </div>

                            <div className="role-modal-section">
                                <h4>Operational Focus</h4>
                                <p className="focus-text">{selectedDetailRole.focus || "General Decision Making"}</p>
                            </div>
                        </div>

                        <div className="role-modal-actions">
                            <button className="modal-close-btn" onClick={handleCloseModal}>
                                Close
                            </button>
                            <button className="modal-select-btn" onClick={() => onSelectRole(selectedDetailRole)}>
                                <FaCheck /> Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default RoleSelection;