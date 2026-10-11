import React from 'react';
import { FaGlobe, FaExclamationTriangle, FaSkull, FaCheckDouble, FaRadiation, FaInfoCircle } from 'react-icons/fa';

// ==========================================
// 1. CONCEPT CARD (Glassmorphic, Gradient)
// ==========================================
export const ConceptCard = ({
    icon,
    title,
    description,
    color = "#00d4ff",
    borderColor,
}) => (
    <div
        className="cr-concept-card"
        style={{
            background: `linear-gradient(135deg, rgba(20,20,30,0.95), rgba(5,5,10,0.98))`,
            padding: "25px",
            borderRadius: "16px",
            border: `1px solid ${borderColor || color}40`,
            borderLeft: `6px solid ${color}`,
            marginBottom: "20px",
            boxShadow: `0 10px 30px -10px ${color}20`,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = `0 15px 40px -10px ${color}40`;
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 10px 30px -10px ${color}20`;
        }}
    >
        {/* Subtle background glow effect */}
        <div
            style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: "120px",
                height: "120px",
                background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
                pointerEvents: "none",
            }}
        />

        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "15px",
            }}
        >
            <div
                style={{
                    fontSize: "1.8rem",
                    color: color,
                    filter: `drop-shadow(0 0 10px ${color}60)`,
                    display: "flex",
                    alignItems: "center"
                }}
            >
                {icon}
            </div>
            <h3
                style={{
                    color: "#fff",
                    fontSize: "1.2rem",
                    margin: 0,
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    fontFamily: "'Inter', sans-serif" // Ensure a clean font
                }}
            >
                {title}
            </h3>
        </div>
        <p
            style={{
                color: "#b0b3b8",
                fontSize: "0.95rem",
                lineHeight: "1.6",
                margin: 0,
                fontWeight: "400"
            }}
        >
            {description}
        </p>
    </div>
);

// ==========================================
// 2. FACT BOX (Alerts, Warnings, Stats)
// ==========================================
export const FactBox = ({ title, children, type = "info" }) => {
    const styles = {
        info: { color: "#00d4ff", icon: <FaGlobe />, bg: "rgba(0, 212, 255, 0.05)" },
        warning: { color: "#eab308", icon: <FaExclamationTriangle />, bg: "rgba(234, 179, 8, 0.05)" },
        danger: { color: "#ff4757", icon: <FaSkull />, bg: "rgba(255, 71, 87, 0.05)" },
        success: { color: "#2ecc71", icon: <FaCheckDouble />, bg: "rgba(46, 204, 113, 0.05)" },
        insane: { color: "#d946ef", icon: <FaRadiation />, bg: "rgba(217, 70, 239, 0.05)" },
        tip: { color: "#10b981", icon: <FaInfoCircle />, bg: "rgba(16, 185, 129, 0.05)" }
    };

    // Fallback if type is invalid
    const style = styles[type] || styles.info;

    return (
        <div
            style={{
                background: `linear-gradient(to right, ${style.bg}, transparent)`,
                border: `1px solid ${style.color}40`,
                borderLeft: `4px solid ${style.color}`,
                borderRadius: "8px",
                padding: "20px",
                marginTop: "25px",
                marginBottom: "25px",
                position: "relative",
            }}
        >
            <strong
                style={{
                    color: style.color,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                    fontSize: "0.9rem",
                    letterSpacing: "1px",
                    textTransform: "uppercase"
                }}
            >
                {style.icon} {title}
            </strong>
            <div style={{ color: "#e2e8f0", fontSize: "1rem", lineHeight: "1.6" }}>
                {children}
            </div>
        </div>
    );
};

// ==========================================
// 3. HERO SECTION (Lesson Headers)
// ==========================================
export const HeroSection = ({ title, subtitle, icon, color = "#4f46e5" }) => (
    <div
        className="cr-lesson-hero"
        style={{
            background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${color}20 100%)`,
            borderBottom: `4px solid ${color}`,
            padding: "40px 20px",
            textAlign: "center",
            marginBottom: "30px",
            borderRadius: "12px 12px 0 0"
        }}
    >
        <div
            className="cr-hero-icon"
            style={{
                color: color,
                fontSize: "3rem",
                marginBottom: "20px",
                filter: `drop-shadow(0 0 15px ${color}60)`
            }}
        >
            {icon}
        </div>
        <h2
            style={{
                textTransform: 'uppercase',
                letterSpacing: '3px',
                color: "#fff",
                margin: "0 0 10px 0",
                fontSize: "2rem",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)"
            }}
        >
            {title}
        </h2>
        {subtitle && (
            <p
                style={{
                    fontSize: '1.1rem',
                    color: "#cbd5e1",
                    opacity: 0.9,
                    maxWidth: "600px",
                    margin: "0 auto",
                    fontStyle: "italic"
                }}
            >
                "{subtitle}"
            </p>
        )}
    </div>
);

// ==========================================
// 4. PREVIEW COMPONENT (For testing/dev)
// ==========================================
// You can leave this here or remove it. It's just an export.
export const TrainingUI = {
    ConceptCard,
    FactBox,
    HeroSection
};

export default TrainingUI;
