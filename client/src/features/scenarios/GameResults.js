
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { toPng } from 'html-to-image';
import { FaShieldAlt, FaTrophy, FaRedo, FaFilePdf, FaSpinner, FaClock, FaCheckCircle, FaTimesCircle, FaChartLine } from 'react-icons/fa';
import { ReportDocument } from './ReportGenerator';
import { ScoreTimelineChart } from './ReportCharts';
import './GameResults.css';

const GameResults = ({ success, title, text, score, time, history, scenarioTitle, onRestart, onExit, isExam }) => {
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [chartImages, setChartImages] = useState({});
    const [animateScore, setAnimateScore] = useState(0);
    const chartRef = useRef(null);

    // Animation Effect
    useEffect(() => {
        let start = 0;
        const end = score;
        const duration = 2000;
        const increment = end / (duration / 16); // 60fps

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setAnimateScore(end);
                clearInterval(timer);
            } else {
                setAnimateScore(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [score]);

    const formatTime = (seconds) => {
        if (typeof time === 'string') return time;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        setReportData(null);

        if (chartRef.current) {
            try {
                const scoreChartPng = await toPng(chartRef.current, { quality: 0.95 });
                setChartImages({ scoreChart: scoreChartPng });
            } catch (err) {
                console.error("Failed to generate chart image:", err);
            }
        }

        try {
            const response = await axios.post('/api/analyze', {
                choiceHistory: history,
                scenarioTitle: scenarioTitle,
            });

            setReportData({
                aiAnalysis: response.data,
                choiceHistory: history,
                scenarioTitle: scenarioTitle,
                finalScore: score,
                totalTime: formatTime(time),
            });
        } catch (err) {
            console.error("Failed to get AI analysis:", err);
            // Fallback for demo if offline
            setReportData({
                aiAnalysis: {
                    summary: "Simulation analysis unavailable. Please check network connection.",
                    strengths: ["Decision making speed", "Threat identification"],
                    weaknesses: ["Resource allocation efficiency"],
                    grade: score > 80 ? "A" : "B"
                },
                choiceHistory: history,
                scenarioTitle: scenarioTitle,
                finalScore: score,
                totalTime: formatTime(time),
            });
        }
        setIsGeneratingReport(false);
    };

    return (
        <div className={`results-overlay ${success ? 'status-success' : 'status-fail'}`}>
            <div className="results-content">

                {/* --- HEADER SECTION --- */}
                <div className="results-header">
                    <h2 className="mission-status-label">MISSION STATUS</h2>
                    <h1 className="mission-outcome">{success ? 'MISSION ACCOMPLISHED' : 'CRITICAL FAILURE'}</h1>
                    <div className="scan-line-decoration"></div>
                </div>

                {/* --- DASHBOARD GRID --- */}
                <div className="dashboard-grid">

                    {/* LEFT: METRICS PANEL */}
                    <div className="dashboard-panel metrics-panel">
                        <h3><FaChartLine /> PERFORMANCE METRICS</h3>
                        <div className="score-circle-container">
                            <svg className="score-ring" width="200" height="200">
                                <circle className="score-ring-bg" stroke="#333" strokeWidth="10" fill="transparent" r="90" cx="100" cy="100" />
                                <circle
                                    className="score-ring-progress"
                                    stroke={success ? '#0ff' : '#f00'}
                                    strokeWidth="10"
                                    fill="transparent"
                                    r="90"
                                    cx="100"
                                    cy="100"
                                    style={{
                                        strokeDasharray: 565,
                                        strokeDashoffset: 565 - (565 * (isExam ? (history.filter(h => h && h.points > 0).length / Math.max(history.length, 1)) * 100 : animateScore / 10)) / 100
                                    }}
                                />
                            </svg>
                            <div className="score-value">
                                <span className="big-number">
                                    {isExam
                                        ? Math.round((history.filter(h => h.points > 0).length / history.length) * 100)
                                        : Math.round((animateScore / 1000) * 100)
                                    }%
                                </span>
                                <span className="label">ACCURACY</span>
                            </div>
                        </div>

                        <div className="stat-row">
                            <div className="stat-item">
                                <FaClock className="icon" />
                                <div className="stat-text">
                                    <span className="value">{formatTime(time)}</span>
                                    <span className="label">TIME ELAPSED</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <FaShieldAlt className="icon" />
                                <div className="stat-text">
                                    <span className="value">{history.filter(h => h.points > 0).length}/{history.length}</span>
                                    <span className="label">CORRECT DECISIONS</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: TIMELINE PANEL */}
                    <div className="dashboard-panel timeline-panel">
                        <h3><FaTrophy /> TACTICAL LOG</h3>
                        <div className="timeline-scroll">
                            {history.map((item, index) => (
                                <div key={index} className={`timeline-entry ${isExam ? 'neutral' : (item.points > 0 ? 'positive' : 'negative')}`}>
                                    <div className="entry-icon">
                                        {isExam ? <FaCheckCircle style={{ color: '#aaa' }} /> : (item.points > 0 ? <FaCheckCircle /> : <FaTimesCircle />)}
                                    </div>
                                    <div className="entry-content">
                                        <div className="entry-header">
                                            <span className="entry-problem">{item.problem.substring(0, 40)}...</span>
                                            {!isExam && <span className="entry-points">{item.points > 0 ? '+' : ''}{item.points} PTS</span>}
                                        </div>
                                        <div className="entry-choice">Op: {item.choice}</div>
                                        {isExam && <div className="entry-feedback-hidden" style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>Response Encrypted (Exam Mode)</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- FOOTER ACTIONS --- */}
                <div className="results-footer">
                    {success ? (
                        <button onClick={onExit} className="action-btn primary">
                            <FaCheckCircle /> RETURN TO LOBBY
                        </button>
                    ) : (
                        <button onClick={onRestart} className="action-btn primary">
                            <FaRedo /> RETRY MISSION
                        </button>
                    )}
                    {!reportData ? (
                        <button onClick={handleGenerateReport} className="action-btn secondary" disabled={isGeneratingReport}>
                            {isGeneratingReport ? <FaSpinner className="spinner" /> : <FaFilePdf />}
                            {isGeneratingReport ? 'COMPILING REPORT...' : 'GENERATE DEBRIEF'}
                        </button>
                    ) : (
                        <PDFDownloadLink
                            document={<ReportDocument data={reportData} charts={chartImages} />}
                            fileName="mission_debrief.pdf"
                            className="action-btn download"
                        >
                            {({ loading }) => (loading ? 'PREPARING...' : 'DOWNLOAD DOSSIER')}
                        </PDFDownloadLink>
                    )}
                </div>

            </div>

            {/* Hidden Chart for Report Gen */}
            <div style={{ position: 'fixed', left: '-9999px', opacity: 0 }} ref={chartRef}>
                {history.length > 0 && <ScoreTimelineChart data={history} />}
            </div>
        </div>
    );
};

export default GameResults;