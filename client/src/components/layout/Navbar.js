import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { FaUserShield, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../../features/auth/AuthContext';
import './Navbar.css';

// Import assets
import logoPremium from '../../assets/logo-clean.png';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Determine which route is active
    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    // Handle scroll effect
    React.useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logoutHandler = () => {
        logout();
        setMobileMenuOpen(false);
        navigate('/');
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className={`navbar-content ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="navbar-left">
                    <RouterLink to="/" className="brand-logo" onClick={closeMobileMenu}>
                        <img src={logoPremium} alt="CYBERGUARD" className="logo-img" />
                        <span className="logo-text">CYBERGUARD</span>
                    </RouterLink>
                </div>

                {/* DESKTOP CENTER */}
                <div className="navbar-center desktop-only">
                    <div className="nav-links-container">
                        <RouterLink
                            to="/scenarios"
                            className={`nav-link ${isActive('/scenarios') ? 'active' : ''}`}
                        >
                            Scenarios
                        </RouterLink>

                        <RouterLink
                            to="/training"
                            className={`nav-link ${isActive('/training') ? 'active' : ''}`}
                        >
                            Training
                        </RouterLink>

                        {isAuthenticated && user?.isAdmin && (
                            <RouterLink
                                to="/admin"
                                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                            >
                                Admin
                            </RouterLink>
                        )}
                    </div>
                </div>

                {/* DESKTOP RIGHT */}
                <div className="navbar-right desktop-only">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <RouterLink to="/profile" className={`profile-pill ${isActive('/profile') ? 'active' : ''}`}>
                                <div className="avatar-circle">
                                    <FaUserShield />
                                </div>
                                <span className="username">{user?.username || 'Agent'}</span>
                            </RouterLink>
                            <button onClick={logoutHandler} className="logout-icon-btn" title="Logout">
                                <FaSignOutAlt />
                            </button>
                        </div>
                    ) : (
                        <div className="auth-actions">
                            <RouterLink to="/auth" className="login-link">Login</RouterLink>
                            <RouterLink to="/auth" className="signup-btn">Get Started</RouterLink>
                        </div>
                    )}
                </div>

                {/* MOBILE HAMBURGER TOGGLE */}
                <div className="mobile-toggle" onClick={toggleMobileMenu}>
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </div>
            </div>

            {/* MOBILE MENU DRAWER */}
            <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-nav-links">
                    <RouterLink
                        to="/scenarios"
                        className={`mobile-nav-link ${isActive('/scenarios') ? 'active' : ''}`}
                        onClick={closeMobileMenu}
                    >
                        Scenarios
                    </RouterLink>

                    <RouterLink
                        to="/training"
                        className={`mobile-nav-link ${isActive('/training') ? 'active' : ''}`}
                        onClick={closeMobileMenu}
                    >
                        Training
                    </RouterLink>

                    {isAuthenticated && user?.isAdmin && (
                        <RouterLink
                            to="/admin"
                            className={`mobile-nav-link ${isActive('/admin') ? 'active' : ''}`}
                            onClick={closeMobileMenu}
                        >
                            Admin Panel
                        </RouterLink>
                    )}

                    <div className="mobile-divider"></div>

                    {isAuthenticated ? (
                        <>
                            <RouterLink
                                to="/profile"
                                className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <FaUserShield className="mobile-icon" /> My Profile
                            </RouterLink>
                            <button onClick={logoutHandler} className="mobile-nav-link logout">
                                <FaSignOutAlt className="mobile-icon" /> Logout
                            </button>
                        </>
                    ) : (
                        <div className="mobile-auth-actions">
                            <RouterLink to="/auth" className="mobile-login-btn" onClick={closeMobileMenu}>Login</RouterLink>
                            <RouterLink to="/auth" className="mobile-signup-btn" onClick={closeMobileMenu}>Get Started</RouterLink>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;