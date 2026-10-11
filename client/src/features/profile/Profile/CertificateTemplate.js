import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import './CertificateTemplate.css';
import certificateFrame from '../../../assets/certificate-frame.png';

const CertificateTemplate = ({
    title = "Certificate of Completion",
    recipientName,
    pathTitle,
    date,
    signature = "Cyber Academy Director",
    id,
    isLocked = false
}) => {
    return (
        <div className={`certificate-container ${isLocked ? 'locked' : ''}`}>
            <img src={certificateFrame} alt="Certificate Frame" className="cert-bg-image" />

            <div className="cert-overlay-content">
                {/* Header Area */}
                <div className="cert-header-group">
                    <div className="cert-org">CYBER DEFENSE ACADEMY</div>
                    <div className="cert-title">{title}</div>
                </div>

                {/* Recipient Area (Center) */}
                <div className="cert-recipient-group">
                    <div className="cert-label">This credential is awarded to</div>
                    <div
                        className="cert-name"
                        style={{
                            fontSize: (recipientName?.length > 30) ? '1.5rem' :
                                (recipientName?.length > 20) ? '2rem' :
                                    (recipientName?.length > 15) ? '2.5rem' : '3rem'
                        }}
                    >
                        {recipientName || "Agent Name"}
                    </div>
                    <div className="cert-label">For successful completion of the active duty module</div>
                    <div className="cert-course">{pathTitle || "Corporate Defender"}</div>
                </div>

                {/* Footer Area (Bottom) */}
                <div className="cert-footer-group">
                    <div className="cert-date-block">
                        <div className="cert-date-text">{date ? new Date(date).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                        <div className="cert-footer-label">DATE ISSUED</div>
                    </div>

                    <div className="cert-id-block">
                        <div className="cert-id-text">{id || "PENDING"}</div>
                        <div className="cert-footer-label">CERTIFICATE ID</div>
                    </div>

                    <div className="cert-signature-block">
                        <div className="cert-sign-text">Alexander K.</div>
                        <div className="cert-footer-label">DIRECTOR OF OPS</div>
                    </div>
                </div>
            </div>

            {/* Locked Overlay */}
            {isLocked && (
                <div className="cert-locked-overlay">
                    <span>RESTRICTED ACCESS</span>
                </div>
            )}
        </div>
    );
};

export default CertificateTemplate;
