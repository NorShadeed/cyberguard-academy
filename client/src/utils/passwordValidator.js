// Password strength validation utility

/**
 * Checks password strength and returns a score from 0-4
 * 0 = Very Weak, 1 = Weak, 2 = Fair, 3 = Good, 4 = Strong
 */
export const validatePasswordStrength = (password) => {
    if (!password) return 0;

    let score = 0;
    const checks = {
        length: password.length >= 12,
        hasUpper: /[A-Z]/.test(password),
        hasLower: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    // Length scoring
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Character variety scoring
    if (checks.hasUpper && checks.hasLower) score++;
    if (checks.hasNumber) score++;
    if (checks.hasSpecial) score++;

    // Cap at 4
    return Math.min(score, 4);
};

/**
 * Returns array of password requirements with met status
 */
export const getPasswordRequirements = (password = '') => {
    return [
        {
            id: 'length',
            text: 'At least 12 characters',
            met: password.length >= 12
        },
        {
            id: 'uppercase',
            text: 'One uppercase letter (A-Z)',
            met: /[A-Z]/.test(password)
        },
        {
            id: 'lowercase',
            text: 'One lowercase letter (a-z)',
            met: /[a-z]/.test(password)
        },
        {
            id: 'number',
            text: 'One number (0-9)',
            met: /[0-9]/.test(password)
        },
        {
            id: 'special',
            text: 'One special character (!@#$%^&*)',
            met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        }
    ];
};

/**
 * Validates if password meets all requirements
 */
export const meetsPasswordPolicy = (password) => {
    const requirements = getPasswordRequirements(password);
    return requirements.every(req => req.met);
};

/**
 * Generates a strong random password
 */
export const generateStrongPassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}';

    let password = '';

    // Ensure at least one of each required character type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill remaining characters (total 16 chars)
    const allChars = uppercase + lowercase + numbers + special;
    for (let i = password.length; i < 16; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Get strength label and color
 */
export const getStrengthInfo = (score) => {
    const strengthLevels = [
        { label: 'Very Weak', color: '#ff3b30', class: 'very-weak' },
        { label: 'Weak', color: '#ff9500', class: 'weak' },
        { label: 'Fair', color: '#ffcc00', class: 'fair' },
        { label: 'Good', color: '#34c759', class: 'good' },
        { label: 'Strong', color: '#00d4ff', class: 'strong' }
    ];
    return strengthLevels[score] || strengthLevels[0];
};

/**
 * Common weak passwords to block
 */
const commonPasswords = [
    'password', 'password123', '123456', '12345678', 'qwerty', 'abc123',
    'monkey', '1234567', 'letmein', 'trustno1', 'dragon', 'baseball',
    'iloveyou', 'master', 'sunshine', 'ashley', 'bailey', 'passw0rd',
    'shadow', '123123', '654321', 'superman', 'qazwsx', 'michael'
];

/**
 * Check if password is in common passwords list
 */
export const isCommonPassword = (password) => {
    return commonPasswords.includes(password.toLowerCase());
};
