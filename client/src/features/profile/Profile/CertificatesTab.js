import React, { useMemo, useState } from 'react';
import {
    FaCertificate,
    FaCheckCircle,
    FaGraduationCap,
    FaRocket,
    FaLock,
    FaDownload,
    FaTrophy,
    FaAward,
    FaShieldAlt,
    FaEye,
    FaBook,
    FaTimes
} from 'react-icons/fa';
import { CAREER_PATHS } from '../../../data/CareerPaths';
import { getAllModules } from '../../../data/ModuleRegistry';
import CertificateTemplate from './CertificateTemplate';
import './CertificatesTab.css';

const CertificatesTab = ({ user, navigate, token, gamification }) => {
    const [selectedCert, setSelectedCert] = useState(null);
    // 1. Select the Corporate Defender Path (For now, we focus on this one)
    const targetPath = CAREER_PATHS.find(p => p.id === 'corp-defender');
    const COURSE_CATALOG = getAllModules();
    const userProgress = user.certificationStatus || {}; // Fallback if needed, but we rely on gamification/user props usually

    // 2. Build the steps for the certificate path based on the Career Path nodes
    const pathSteps = useMemo(() => {
        if (!targetPath || !targetPath.nodes) return [];

        return targetPath.nodes
            .filter(node => node.type === 'course')
            .map(node => {
                const courseDef = COURSE_CATALOG.find(c => c.id === node.catalogId) || {};

                // Determine if this course is complete
                // We use the same logic as in TrainingLobby for consistency
                const isComplete = (() => {
                    if (!courseDef.phases) return false;
                    return courseDef.phases.every(phase => {
                        const isLegacyId = ['1', '2', '3'].includes(String(phase.phaseId));
                        if (!isLegacyId) {
                            // Check new scenario completion
                            const completedNodes = gamification?.completedNodes || [];
                            const userCompletedScenarios = user?.completedScenarios || [];

                            // STRICT CHECK: Must be explicitly in one of these arrays
                            const inCompletedNodes = completedNodes.includes(String(phase.phaseId)) ||
                                completedNodes.includes(String(phase.scenarioId));
                            const inCompletedScenarios = userCompletedScenarios.some(s =>
                                s.scenarioId === String(phase.phaseId) ||
                                s.scenarioId === String(phase.scenarioId)
                            );

                            return inCompletedNodes || inCompletedScenarios;
                        } else {
                            // Legacy check - Use certificationStatus properly
                            const phaseKey = `phase${phase.phaseNumber}`;
                            // STRICT CHECK: Only true if certificationStatus exists AND the specific phase is true
                            return Boolean(user.certificationStatus && user.certificationStatus[phaseKey] === true);
                        }
                    });
                })();

                return {
                    id: node.id,
                    label: 'Course',
                    title: node.title,
                    type: 'COURSE',
                    desc: node.description,
                    stats: `${courseDef.phases ? courseDef.phases.length : 0} Modules`,
                    icon: node.icon || FaBook,
                    completed: isComplete,
                    locked: node.status === 'locked' && !isComplete
                };
            });
    }, [targetPath, COURSE_CATALOG, user, gamification]);

    const completedCount = pathSteps.filter(p => p.completed).length;
    const totalSteps = pathSteps.length;
    const isCertified = totalSteps > 0 && completedCount === totalSteps;
    const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

    // 3. Stable Certificate ID Logic
    const certificateId = useMemo(() => {
        // A. If the user actually has a stored certificate with an ID, use it.
        if (user.certificates && user.certificates.length > 0 && user.certificates[0].certificateId) {
            return user.certificates[0].certificateId;
        }

        // B. Fallback: Generate a stable, complex ID.
        // Use user._id or user.id, otherwise generate a random signature.
        const seed = user._id || user.id;

        if (seed) {
            // Deterministic-ish based on ID
            const p1 = seed.slice(0, 4).toUpperCase();
            const p2 = seed.slice(4, 8).toUpperCase();
            const p3 = seed.slice(-4).split('').reverse().join('').toUpperCase();
            return `CX-${p1}${p2}-${p3}`;
        } else {
            // Random Fallback (Persistent for session)
            const r1 = Math.random().toString(36).substring(2, 6).toUpperCase();
            const r2 = Math.random().toString(36).substring(2, 6).toUpperCase();
            return `CX-${r1}-${r2}`;
        }
    }, [user]);

    return (
        <div className="certificates-container">
            {/* Standard Header */}
            <div className="section-header-compact">
                <div className="header-icon-box">
                    <FaGraduationCap />
                </div>
                <div className="header-text-box">
                    <h1>Certifications Center</h1>
                    <p>Track your progress and manage your professional credentials.</p>
                </div>
            </div>

            {/* EARNED CERTIFICATIONS SECTION */}
            <div className="certificates-section">
                <h2 className="section-title"><FaTrophy className="section-icon" /> Earned Certifications</h2>

                {(!user.certificates || user.certificates.length === 0) && !isCertified && (
                    <div className="empty-certs">
                        <p>No certifications earned yet.</p>
                        <span className="sub-text">Complete a full Career Path to earn your first professional certification.</span>
                    </div>
                )}

                <div className="certificates-grid">
                    {/* RENDER EARNED/LOCKED CERTIFICATE */}
                    {isCertified ? (
                        <>
                            <div className="cert-summary-card">
                                <div className="cert-summary-icon-wrapper">
                                    <FaTrophy className="cert-summary-icon" />
                                </div>
                                <div className="cert-summary-details">
                                    <h3>{targetPath?.title || "Corporate Defender"}</h3>
                                    <div className="cert-summary-id">
                                        <span>ID:</span>
                                        {certificateId}
                                    </div>
                                    <div className="cert-actions-row">
                                        <button
                                            className="action-btn view"
                                            onClick={() => navigate(`/certificate/${certificateId}`, {
                                                state: {
                                                    title: targetPath?.title ? `${targetPath.title} Certification` : "Certificate of Completion",
                                                    recipientName: (user.firstName && user.lastName)
                                                        ? `${user.firstName} ${user.lastName}`
                                                        : (user.username || "Agent"),
                                                    pathTitle: targetPath?.title,
                                                    date: user.certificates?.[0]?.earnedAt || new Date(),
                                                    id: certificateId,
                                                    isLocked: false
                                                }
                                            })}
                                        >
                                            <FaEye /> View
                                        </button>
                                        <button className="action-btn download">
                                            <FaShieldAlt /> LinkedIn
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="locked-cert-display">
                            <CertificateTemplate
                                title="Certificate of Completion"
                                recipientName={user.name || "Agent"}
                                pathTitle={targetPath?.title || "Corporate Defender"}
                                date={null}
                                id="LOCKED"
                                isLocked={true}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* CERTIFICATE MODAL */}
            {
                selectedCert && (
                    <div className="cert-modal-overlay" onClick={() => setSelectedCert(null)}>
                        <div className="cert-modal-content" onClick={e => e.stopPropagation()}>
                            <button className="cert-modal-close" onClick={() => setSelectedCert(null)}>
                                <FaTimes />
                            </button>
                            <CertificateTemplate
                                title={selectedCert.title}
                                recipientName={selectedCert.recipientName}
                                pathTitle={selectedCert.pathTitle}
                                date={selectedCert.date}
                                id={selectedCert.id}
                                isLocked={false}
                            />
                            <div className="cert-actions-row" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                <button
                                    className="action-btn view"
                                    onClick={() => window.print()}
                                    style={{
                                        width: 'fit-content',
                                        padding: '0.4rem 1.2rem',
                                        fontSize: '0.8rem',
                                        marginTop: '10px',
                                        height: 'auto'
                                    }}
                                >
                                    <FaDownload style={{ marginRight: '6px' }} /> Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* PATHS SECTION */}
            <div className="certificates-section">
                <h2 className="section-title"><FaRocket className="section-icon" /> Certification Paths</h2>
                <div className="paths-list">
                    {CAREER_PATHS.map(path => {
                        const isExpanded = path.id === 'corp-defender';
                        const isComingSoon = path.isComingSoon;

                        return (
                            <div key={path.id} className={`path-card ${isExpanded ? 'active-path' : ''} ${isComingSoon ? 'coming-soon' : ''}`}>
                                <div className="path-content-wrapper">
                                    <div className="path-info-header">
                                        <div className="path-icon" style={{ backgroundColor: path.color || '#333' }}>
                                            {path.icon || <FaAward />}
                                        </div>
                                        <div className="path-header-text">
                                            <div className="path-title-row">
                                                <h3>{path.title}</h3>
                                                {isComingSoon ? (
                                                    <span className="badge coming-soon-badge">Coming Soon</span>
                                                ) : (
                                                    isCertified && isExpanded ? (
                                                        <span className="badge success"><FaCheckCircle /> Completed</span>
                                                    ) : (
                                                        isExpanded && <span className="badge warning">In Progress</span>
                                                    )
                                                )}
                                            </div>
                                            <p>{path.description}</p>
                                        </div>
                                    </div>

                                    {/* Progress Steps Visual - ONLY FOR EXPANDED PATH */}
                                    {isExpanded && !isComingSoon && (
                                        <div className="path-steps-container">
                                            {pathSteps.map((step, index) => (
                                                <div key={step.id} className={`path-step ${step.completed ? 'completed' : ''}`}>
                                                    <div className="step-connector"></div>

                                                    {/* Node / Icon */}
                                                    <div className="step-node-wrapper">
                                                        <div className="step-node">
                                                            {step.completed ? <FaCheckCircle /> : <div className="node-dot"></div>}
                                                        </div>
                                                        <div className="step-type-badge">{step.type}</div>
                                                    </div>

                                                    {/* Card Info */}
                                                    <div className="step-card">
                                                        <div className="step-header">
                                                            <span className="step-label">MODULE {String(index + 1).padStart(2, '0')}</span>
                                                        </div>
                                                        <h4 className="step-title">{step.title}</h4>
                                                        <p className="step-desc">{step.desc}</p>

                                                        <div className="step-footer">
                                                            <span className="step-duration">
                                                                {!step.completed && step.locked && <FaLock style={{ fontSize: 10, marginRight: 4 }} />}
                                                            </span>
                                                            <span className={`status-text ${step.completed ? 'done' : ''}`}>
                                                                {step.completed ? 'COMPLETED' : (step.locked ? 'LOCKED' : 'OPEN')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* COMING SOON OVERLAY */}
                                    {isComingSoon && (
                                        <div className="coming-soon-overlay">
                                            <span>COMING SOON</span>
                                        </div>
                                    )}
                                </div>

                                {isExpanded && !isComingSoon && !isCertified && (
                                    <div className="path-progress-sidebar">
                                        <div className="progress-circle">
                                            <svg viewBox="0 0 36 36" className="circular-chart">
                                                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                <path className="circle"
                                                    strokeDasharray={`${progressPercentage}, 100`}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                            </svg>
                                            <div className="percentage">{Math.round(progressPercentage)}%</div>
                                        </div>
                                        <button className="continue-btn" onClick={() => navigate('/training')}>
                                            Continue
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div >
    );
};


export default CertificatesTab;
