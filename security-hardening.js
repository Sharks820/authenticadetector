/**
 * AuthenticaDetector Security Hardening Module
 * Version: 1.0.0
 * Date: December 20, 2025
 * Agent: Security-Abuse
 *
 * This module provides client-side security enhancements including:
 * - Input validation and sanitization
 * - XSS prevention
 * - Rate limiting
 * - Secure file upload validation
 * - URL validation
 * - Session security
 *
 * USAGE:
 * Include this script BEFORE the main application script:
 * <script src="security-hardening.js"></script>
 */

(function(window) {
    'use strict';

    // ==================== CONFIGURATION ====================
    const SecurityConfig = {
        // Rate limits
        SCAN_RATE_LIMIT: 100,         // Max scans per hour
        VOTE_RATE_LIMIT: 50,          // Max votes per hour
        SUBMISSION_RATE_LIMIT: 10,    // Max submissions per day
        LOGIN_ATTEMPT_LIMIT: 5,       // Max login attempts per 15 min

        // File upload limits
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
        ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],

        // Input limits
        MAX_EMAIL_LENGTH: 254,
        MAX_PASSWORD_LENGTH: 128,
        MAX_NAME_LENGTH: 100,
        MAX_DESCRIPTION_LENGTH: 2000,
        MAX_URL_LENGTH: 2000,

        // Session settings
        SESSION_TIMEOUT_MS: 4 * 60 * 60 * 1000, // 4 hours
        SESSION_CHECK_INTERVAL_MS: 60 * 1000,    // Check every minute

        // Blocked URL patterns (SSRF prevention)
        BLOCKED_URL_PATTERNS: [
            /^(https?:\/\/)?localhost/i,
            /^(https?:\/\/)?127\./,
            /^(https?:\/\/)?192\.168\./,
            /^(https?:\/\/)?10\./,
            /^(https?:\/\/)?172\.(1[6-9]|2[0-9]|3[0-1])\./,
            /^(https?:\/\/)?0\./,
            /^file:/i,
            /^data:/i,
            /^javascript:/i,
            /^vbscript:/i,
        ]
    };

    // ==================== RATE LIMITER ====================
    class RateLimiter {
        constructor() {
            this.limits = new Map();
        }

        /**
         * Check if action is within rate limit
         * @param {string} action - Action type (scan, vote, submission, login)
         * @param {number} limit - Max actions allowed
         * @param {number} windowMs - Time window in milliseconds
         * @returns {Object} { allowed: boolean, remaining: number, resetIn: number }
         */
        check(action, limit, windowMs = 3600000) {
            const key = `ratelimit_${action}`;
            const now = Date.now();

            let data = this.limits.get(key);

            // Reset if window expired
            if (!data || data.windowStart < now - windowMs) {
                data = {
                    count: 0,
                    windowStart: now
                };
            }

            const remaining = limit - data.count;
            const resetIn = Math.max(0, (data.windowStart + windowMs) - now);

            if (data.count >= limit) {
                return { allowed: false, remaining: 0, resetIn };
            }

            data.count++;
            this.limits.set(key, data);

            return { allowed: true, remaining: remaining - 1, resetIn };
        }

        /**
         * Reset rate limit for an action
         */
        reset(action) {
            const key = `ratelimit_${action}`;
            this.limits.delete(key);
        }
    }

    // ==================== INPUT SANITIZER ====================
    const Sanitizer = {
        /**
         * Escape HTML entities to prevent XSS
         * @param {string} str - Input string
         * @returns {string} Escaped string
         */
        escapeHtml(str) {
            if (typeof str !== 'string') return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        /**
         * Strip all HTML tags from string
         * @param {string} str - Input string
         * @returns {string} Plain text
         */
        stripHtml(str) {
            if (typeof str !== 'string') return '';
            const div = document.createElement('div');
            div.innerHTML = str;
            return div.textContent || div.innerText || '';
        },

        /**
         * Sanitize URL to prevent XSS and SSRF
         * @param {string} url - Input URL
         * @returns {string|null} Sanitized URL or null if invalid
         */
        sanitizeUrl(url) {
            if (typeof url !== 'string') return null;

            url = url.trim();

            // Check against blocked patterns
            for (const pattern of SecurityConfig.BLOCKED_URL_PATTERNS) {
                if (pattern.test(url)) {
                    console.warn('[Security] Blocked URL:', url);
                    return null;
                }
            }

            // Must start with http:// or https://
            if (!url.match(/^https?:\/\//i)) {
                // Auto-prepend https://
                url = 'https://' + url;
            }

            // Validate URL format
            try {
                const parsed = new URL(url);

                // Only allow http and https protocols
                if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                    return null;
                }

                // Block localhost and internal IPs
                const hostname = parsed.hostname.toLowerCase();
                if (hostname === 'localhost' ||
                    hostname.startsWith('127.') ||
                    hostname.startsWith('192.168.') ||
                    hostname.startsWith('10.') ||
                    hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
                    return null;
                }

                return parsed.href;
            } catch (e) {
                return null;
            }
        },

        /**
         * Sanitize email address
         * @param {string} email - Input email
         * @returns {string|null} Sanitized email or null if invalid
         */
        sanitizeEmail(email) {
            if (typeof email !== 'string') return null;

            email = email.trim().toLowerCase();

            if (email.length > SecurityConfig.MAX_EMAIL_LENGTH) return null;

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return null;

            return email;
        },

        /**
         * Sanitize display name
         * @param {string} name - Input name
         * @returns {string} Sanitized name
         */
        sanitizeName(name) {
            if (typeof name !== 'string') return '';

            // Remove control characters and excessive whitespace
            name = name.replace(/[\x00-\x1F\x7F]/g, '').trim();

            // Limit length
            if (name.length > SecurityConfig.MAX_NAME_LENGTH) {
                name = name.substring(0, SecurityConfig.MAX_NAME_LENGTH);
            }

            // Strip any HTML
            name = this.stripHtml(name);

            return name;
        },

        /**
         * Sanitize description/text content
         * @param {string} text - Input text
         * @returns {string} Sanitized text
         */
        sanitizeText(text) {
            if (typeof text !== 'string') return '';

            // Remove control characters except newlines
            text = text.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '');

            // Limit length
            if (text.length > SecurityConfig.MAX_DESCRIPTION_LENGTH) {
                text = text.substring(0, SecurityConfig.MAX_DESCRIPTION_LENGTH);
            }

            // Strip HTML tags
            text = this.stripHtml(text);

            return text;
        },

        /**
         * Sanitize filename
         * @param {string} filename - Input filename
         * @returns {string} Sanitized filename
         */
        sanitizeFilename(filename) {
            if (typeof filename !== 'string') return 'image';

            // Remove path components
            filename = filename.replace(/^.*[\\\/]/, '');

            // Remove dangerous characters
            filename = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '');

            // Limit length
            if (filename.length > 255) {
                const ext = filename.slice(-10);
                filename = filename.substring(0, 245) + ext;
            }

            return filename || 'image';
        }
    };

    // ==================== FILE VALIDATOR ====================
    const FileValidator = {
        // Magic numbers (file signatures) for image types
        MAGIC_NUMBERS: {
            'image/jpeg': [
                [0xFF, 0xD8, 0xFF]
            ],
            'image/png': [
                [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]
            ],
            'image/webp': [
                [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50]
            ]
        },

        /**
         * Validate file upload
         * @param {File} file - File object
         * @returns {Object} { valid: boolean, error: string|null }
         */
        async validate(file) {
            if (!file) {
                return { valid: false, error: 'No file provided' };
            }

            // Check file size
            if (file.size > SecurityConfig.MAX_FILE_SIZE) {
                return {
                    valid: false,
                    error: `File too large. Maximum size is ${SecurityConfig.MAX_FILE_SIZE / (1024 * 1024)}MB`
                };
            }

            // Check MIME type
            if (!SecurityConfig.ALLOWED_MIME_TYPES.includes(file.type)) {
                return {
                    valid: false,
                    error: `Invalid file type. Allowed: ${SecurityConfig.ALLOWED_MIME_TYPES.join(', ')}`
                };
            }

            // Check extension
            const ext = '.' + file.name.split('.').pop().toLowerCase();
            if (!SecurityConfig.ALLOWED_EXTENSIONS.includes(ext)) {
                return {
                    valid: false,
                    error: `Invalid file extension. Allowed: ${SecurityConfig.ALLOWED_EXTENSIONS.join(', ')}`
                };
            }

            // Validate magic numbers
            const isValidMagic = await this.checkMagicNumbers(file);
            if (!isValidMagic) {
                return {
                    valid: false,
                    error: 'File content does not match declared type'
                };
            }

            return { valid: true, error: null };
        },

        /**
         * Check file magic numbers
         * @param {File} file - File object
         * @returns {Promise<boolean>} True if valid
         */
        async checkMagicNumbers(file) {
            const expectedMagic = this.MAGIC_NUMBERS[file.type];
            if (!expectedMagic) return false;

            try {
                const buffer = await file.slice(0, 12).arrayBuffer();
                const bytes = new Uint8Array(buffer);

                for (const pattern of expectedMagic) {
                    let match = true;
                    for (let i = 0; i < pattern.length; i++) {
                        if (pattern[i] !== null && bytes[i] !== pattern[i]) {
                            match = false;
                            break;
                        }
                    }
                    if (match) return true;
                }
            } catch (e) {
                console.error('[Security] Error checking magic numbers:', e);
            }

            return false;
        },

        /**
         * Strip EXIF data from image (privacy protection)
         * @param {File} file - Image file
         * @returns {Promise<Blob>} Image without EXIF
         */
        async stripExif(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob(resolve, file.type, 0.95);
                    };
                    img.onerror = reject;
                    img.src = e.target.result;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }
    };

    // ==================== SESSION SECURITY ====================
    const SessionSecurity = {
        lastActivity: Date.now(),
        checkInterval: null,

        /**
         * Initialize session monitoring
         */
        init() {
            // Update last activity on user interaction
            ['click', 'keypress', 'scroll', 'touchstart'].forEach(event => {
                document.addEventListener(event, () => {
                    this.lastActivity = Date.now();
                }, { passive: true });
            });

            // Start session timeout checker
            this.startTimeoutChecker();
        },

        /**
         * Start checking for session timeout
         */
        startTimeoutChecker() {
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
            }

            this.checkInterval = setInterval(() => {
                const elapsed = Date.now() - this.lastActivity;
                if (elapsed > SecurityConfig.SESSION_TIMEOUT_MS) {
                    this.handleSessionTimeout();
                }
            }, SecurityConfig.SESSION_CHECK_INTERVAL_MS);
        },

        /**
         * Handle session timeout
         */
        handleSessionTimeout() {
            console.log('[Security] Session timed out due to inactivity');

            // Clear sensitive data
            this.clearSensitiveData();

            // Dispatch event for app to handle
            window.dispatchEvent(new CustomEvent('sessionTimeout', {
                detail: { reason: 'inactivity' }
            }));
        },

        /**
         * Clear sensitive data from storage
         */
        clearSensitiveData() {
            // Clear auth data but keep non-sensitive preferences
            const sensitiveKeys = [
                'auth_user',
                'supabase.auth.token',
                'sb-vrvoyxxdlcpysthzjbeu-auth-token'
            ];

            sensitiveKeys.forEach(key => {
                try {
                    localStorage.removeItem(key);
                } catch (e) {}
            });
        },

        /**
         * Extend session (call on successful auth actions)
         */
        extendSession() {
            this.lastActivity = Date.now();
        }
    };

    // ==================== SECURITY HEADERS VALIDATOR ====================
    const HeadersValidator = {
        /**
         * Check if security headers are present
         * (Can only check via meta tags for CSP in SPAs)
         */
        validate() {
            const issues = [];

            // Check for CSP meta tag
            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (!cspMeta) {
                issues.push({
                    severity: 'CRITICAL',
                    header: 'Content-Security-Policy',
                    message: 'No CSP meta tag found. Add CSP to prevent XSS attacks.'
                });
            }

            // Log issues
            if (issues.length > 0) {
                console.warn('[Security] Header issues detected:', issues);
            }

            return issues;
        }
    };

    // ==================== ANTI-TAMPER ====================
    const AntiTamper = {
        /**
         * Detect DevTools open
         * Note: This is a deterrent, not foolproof
         */
        detectDevTools() {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;

            if (widthThreshold || heightThreshold) {
                window.dispatchEvent(new CustomEvent('devToolsDetected'));
            }
        },

        /**
         * Protect global variables from tampering
         * @param {Object} obj - Object to protect
         * @param {Array} properties - Properties to freeze
         */
        protectProperties(obj, properties) {
            properties.forEach(prop => {
                if (obj.hasOwnProperty(prop)) {
                    Object.defineProperty(obj, prop, {
                        writable: false,
                        configurable: false
                    });
                }
            });
        }
    };

    // ==================== HONEYPOT ====================
    const Honeypot = {
        /**
         * Add honeypot field to form
         * @param {HTMLFormElement} form - Form element
         */
        addToForm(form) {
            if (!form) return;

            const honeypot = document.createElement('input');
            honeypot.type = 'text';
            honeypot.name = 'website'; // Common bot target
            honeypot.id = 'hp_field';
            honeypot.tabIndex = -1;
            honeypot.autocomplete = 'off';
            honeypot.style.cssText = `
                position: absolute;
                left: -9999px;
                height: 0;
                width: 0;
                opacity: 0;
                pointer-events: none;
            `;

            form.appendChild(honeypot);
        },

        /**
         * Check if honeypot was triggered
         * @param {HTMLFormElement} form - Form element
         * @returns {boolean} True if bot detected
         */
        isTriggered(form) {
            const honeypot = form.querySelector('#hp_field');
            if (honeypot && honeypot.value) {
                console.warn('[Security] Honeypot triggered - likely bot');
                return true;
            }
            return false;
        }
    };

    // ==================== MAIN SECURITY MODULE ====================
    const Security = {
        config: SecurityConfig,
        rateLimiter: new RateLimiter(),
        sanitizer: Sanitizer,
        fileValidator: FileValidator,
        session: SessionSecurity,
        headers: HeadersValidator,
        antiTamper: AntiTamper,
        honeypot: Honeypot,

        /**
         * Initialize security module
         */
        init() {
            console.log('[Security] Initializing security hardening...');

            // Initialize session monitoring
            this.session.init();

            // Validate headers
            this.headers.validate();

            // Set up DevTools detection (optional, can be annoying)
            // window.addEventListener('resize', () => this.antiTamper.detectDevTools());

            console.log('[Security] Security hardening initialized');
        },

        /**
         * Check rate limit for action
         * @param {string} action - Action type
         * @returns {Object} Rate limit status
         */
        checkRateLimit(action) {
            const limits = {
                scan: { limit: this.config.SCAN_RATE_LIMIT, window: 3600000 },
                vote: { limit: this.config.VOTE_RATE_LIMIT, window: 3600000 },
                submission: { limit: this.config.SUBMISSION_RATE_LIMIT, window: 86400000 },
                login: { limit: this.config.LOGIN_ATTEMPT_LIMIT, window: 900000 }
            };

            const config = limits[action] || { limit: 100, window: 3600000 };
            return this.rateLimiter.check(action, config.limit, config.window);
        },

        /**
         * Validate and sanitize file upload
         * @param {File} file - File to validate
         * @returns {Promise<Object>} Validation result
         */
        async validateFileUpload(file) {
            return this.fileValidator.validate(file);
        },

        /**
         * Sanitize user input based on type
         * @param {string} input - Input to sanitize
         * @param {string} type - Input type (email, name, text, url, filename)
         * @returns {string|null} Sanitized input
         */
        sanitize(input, type) {
            switch (type) {
                case 'email': return this.sanitizer.sanitizeEmail(input);
                case 'name': return this.sanitizer.sanitizeName(input);
                case 'text': return this.sanitizer.sanitizeText(input);
                case 'url': return this.sanitizer.sanitizeUrl(input);
                case 'filename': return this.sanitizer.sanitizeFilename(input);
                case 'html': return this.sanitizer.escapeHtml(input);
                default: return this.sanitizer.stripHtml(input);
            }
        },

        /**
         * Log security event (for monitoring)
         * @param {string} event - Event type
         * @param {Object} details - Event details
         */
        logSecurityEvent(event, details = {}) {
            const logEntry = {
                event,
                timestamp: new Date().toISOString(),
                ...details
            };

            // Log to console in development
            if (window.location.hostname === 'localhost') {
                console.log('[Security Event]', logEntry);
            }

            // Could send to backend for monitoring
            // await fetch('/api/security-log', { method: 'POST', body: JSON.stringify(logEntry) });
        }
    };

    // ==================== EXPORT ====================
    window.AuthenticaSecurity = Security;

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Security.init());
    } else {
        Security.init();
    }

})(window);
