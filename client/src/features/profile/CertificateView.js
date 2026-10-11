import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CertificateTemplate from './Profile/CertificateTemplate';
import './CertificateView.css';

const CertificateView = () => {
    const { certId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDownloading, setIsDownloading] = useState(false);

    // Try to get data from navigation state, otherwise fallback to defaults/params
    // In a real app, you might fetch by ID if state is missing
    const certData = location.state || {
        title: "Certificate of Completion",
        recipientName: "Agent",
        pathTitle: "Corporate Defender",
        date: new Date(),
        id: certId || "CGA-GEN-001"
    };

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        const element = document.getElementById('certificate-to-download');

        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 4, // Super High Quality
                useCORS: true,
                logging: false,
                backgroundColor: null
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate aspect ratio fit
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = (pdfHeight - imgHeight * ratio) / 2;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`certificate-${certData.id}.pdf`);
        } catch (error) {
            console.error("PDF Generation failed", error);
            // Fallback to print if generation fails
            window.print();
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="cert-full-page-container">
            <div className="cert-page-actions no-print">
                <button className="back-btn" onClick={() => navigate('/profile/certificates')}>
                    <FaArrowLeft /> Back to Certificates
                </button>
            </div>

            <div className="cert-display-wrapper">
                {/* ID added for html2canvas targeting */}
                <div id="certificate-to-download" className="certificate-capture-area">
                    <CertificateTemplate
                        title={certData.title}
                        recipientName={certData.recipientName}
                        pathTitle={certData.pathTitle}
                        date={certData.date}
                        id={certData.id}
                        isLocked={false}
                    />
                </div>
            </div>

            <div className="cert-page-footer no-print">
                <button
                    className="download-btn-large"
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                >
                    <FaDownload /> {isDownloading ? "Generating PDF..." : "Download Certificate"}
                </button>
            </div>
        </div>
    );
};

export default CertificateView;
