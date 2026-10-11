import React from 'react';
import './ScenarioDetail.css';
import { FaChevronLeft, FaPlay, FaShieldAlt, FaTrophy, FaClock } from 'react-icons/fa';

const ScenarioDetail = ({ scenario, onStart, onBack }) => {
    console.log("ScenarioDetail Received:", scenario);
    return (
        <div className="detail-container">
            <button onClick={onBack} className="detail-back-btn">
                <FaChevronLeft /> Back to Briefing Room
            </button>

            <div className="detail-content-grid">
                <div className="detail-left-panel">
                    <img src={scenario.thumbnail} alt={scenario.title} className="detail-image" />
                    <h1 className="detail-title">{scenario.title}</h1>
                    <p className="detail-tagline">"{scenario.tagline}"</p>
                    <div className="detail-metrics">
                        <span className={`metric-item difficulty-${(scenario.difficulty || 'unknown').toLowerCase()}`}>
                            <FaShieldAlt /> {scenario.difficulty || 'N/A'}
                        </span>
                        <span className="metric-item">
                            <FaTrophy /> {scenario.xp} XP
                        </span>
                        <span className="metric-item">
                            <FaClock /> {scenario.time}
                        </span>
                    </div>
                </div>

                <div className="detail-right-panel">
                    <h2>Mission Briefing</h2>
                    <p className="detail-description">{scenario.description}</p>

                    <h3>Learning Objectives</h3>
                    <ul className="objectives-list">
                        {(scenario.learningObjectives || []).map((obj, index) => (
                            <li key={index}>{obj}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <button onClick={onStart} className="detail-start-btn">
                <FaPlay /> Begin Simulation
            </button>
        </div>
    );
};

export default ScenarioDetail;
