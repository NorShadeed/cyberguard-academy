const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/certificates/verify/:certId
// @desc    Public verification of certificate
// @access  Public
router.get('/verify/:certId', async (req, res) => {
    try {
        const { certId } = req.params;

        if (!certId || certId.length < 10) {
            return res.status(400).json({ valid: false, msg: 'Invalid certificate ID format' });
        }

        // Find user with this certificate
        const user = await User.findOne({
            'certificates.certId': certId
        }).select('certificates username');

        if (!user) {
            return res.json({
                valid: false,
                msg: 'Certificate not found. This certificate ID does not exist in our records.'
            });
        }

        // Find the specific certificate
        const certificate = user.certificates.find(c => c.certId === certId);

        if (!certificate) {
            return res.json({ valid: false, msg: 'Certificate not found' });
        }

        // Return validated certificate info (hide sensitive data)
        res.json({
            valid: true,
            certificate: {
                certId: certificate.certId,
                title: certificate.title,
                recipientName: `${certificate.firstName} ${certificate.lastName}`.trim() || 'Anonymous',
                earnedAt: certificate.earnedAt,
                issuer: certificate.issuerSig,
                type: certificate.type
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ valid: false, msg: 'Server error during verification' });
    }
});

// @route   GET /api/certificates/:certId
// @desc    Get full certificate details for display
// @access  Public
router.get('/:certId', async (req, res) => {
    try {
        const { certId } = req.params;

        const user = await User.findOne({
            'certificates.certId': certId
        }).select('certificates username');

        if (!user) {
            return res.status(404).json({ msg: 'Certificate not found' });
        }

        const certificate = user.certificates.find(c => c.certId === certId);

        if (!certificate) {
            return res.status(404).json({ msg: 'Certificate not found' });
        }

        res.json({
            certId: certificate.certId,
            title: certificate.title,
            firstName: certificate.firstName,
            lastName: certificate.lastName,
            earnedAt: certificate.earnedAt,
            issuer: certificate.issuerSig,
            type: certificate.type,
            holderUsername: user.username
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
