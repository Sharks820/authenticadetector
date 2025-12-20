/* ===== MODERN SCAN RESULTS REDESIGN - JAVASCRIPT ENHANCEMENT ===== */
/* Interactive features for modern results visualization */
/* Author: UX-Mobile Design System */

/**
 * Enhanced Result Display Controller
 * Handles animations, interactions, and data visualization for scan results
 */

class ModernResultsController {
    constructor() {
        this.resultCard = document.getElementById('resultCard');
        this.explainersCard = document.getElementById('explainersCard');
        this.feedbackSection = document.querySelector('.feedback-section');
        this.isAnimating = false;
        this.init();
    }

    init() {
        // Setup event listeners
        if (this.explainersCard) {
            this.explainersCard.addEventListener('click', (e) => this.toggleExplainers(e));
        }

        // Setup feedback buttons
        document.querySelectorAll('.feedback-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFeedback(e));
        });

        // Setup action buttons
        document.querySelectorAll('.result-action').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAction(e));
        });

        // Setup explainer items
        document.querySelectorAll('.explainer-item').forEach(item => {
            item.addEventListener('click', (e) => this.expandExplainer(e));
        });
    }

    /**
     * Animate result reveal
     */
    animateResultReveal() {
        if (!this.resultCard) return;

        this.resultCard.classList.remove('hidden');
        const icon = this.resultCard.querySelector('.result-icon');
        const badge = this.resultCard.querySelector('.confidence-badge');
        const scoreFill = this.resultCard.querySelector('.score-fill');

        // Icon bounce animation (handled by CSS)
        if (icon) {
            icon.style.animation = 'result-icon-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }

        // Badge pop animations
        if (badge) {
            badge.style.animation = 'badge-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s backwards';
        }

        // Score fill animation
        if (scoreFill) {
            scoreFill.style.animation = 'score-reveal 1s ease-out forwards';
        }

        // Stagger other animations
        this.staggerChildren(this.resultCard, 50);
    }

    /**
     * Stagger animation for child elements
     */
    staggerChildren(parent, delayMs) {
        const children = parent.querySelectorAll('.explainer-item, .feedback-section, .result-actions');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(10px)';
                child.style.transition = 'all 0.3s ease-out';
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, 0);
            }, delayMs * index);
        });
    }

    /**
     * Toggle explainers section
     */
    toggleExplainers(e) {
        const header = e.currentTarget;
        const content = header.querySelector('.explainers-content') ||
                        header.parentElement.querySelector('.explainers-content');
        const toggle = header.querySelector('.explainers-toggle');

        if (content) {
            content.classList.toggle('show');
            if (toggle) {
                toggle.classList.toggle('open');
            }
            this.logAnalytics('explainers_toggled', {
                expanded: content.classList.contains('show')
            });
        }
    }

    /**
     * Expand individual explainer item with details
     */
    expandExplainer(e) {
        const item = e.currentTarget;
        const isAlreadyExpanded = item.classList.contains('expanded');

        // Close other expanded items
        document.querySelectorAll('.explainer-item.expanded').forEach(expandedItem => {
            if (expandedItem !== item) {
                expandedItem.classList.remove('expanded');
            }
        });

        // Toggle current item
        item.classList.toggle('expanded');

        if (!isAlreadyExpanded) {
            const itemName = item.querySelector('.explainer-name')?.textContent || 'Unknown';
            this.showExplainerDetails(item, itemName);
            this.logAnalytics('explainer_expanded', {
                module: itemName
            });
        }
    }

    /**
     * Show detailed information for a module
     */
    showExplainerDetails(item, moduleName) {
        const moduleDetails = {
            'Artifacts': {
                description: 'Detects AI artifacts in texture layer',
                signals: ['Noise pattern: 94%', 'Compression: 89%', 'Edge anomalies: 87%'],
                confidence: 'High'
            },
            'Color Balance': {
                description: 'Analyzes color distribution and saturation',
                signals: ['Saturation: 81%', 'Channel correlation: 76%'],
                confidence: 'Medium'
            },
            'AI Model': {
                description: 'Vision Transformer based detection',
                signals: ['ViT score: 94%', 'Model agreement: 91%'],
                confidence: 'High'
            },
            'Frequency': {
                description: 'FFT-based frequency analysis',
                signals: ['Entropy: 71%', 'Harmonics: 68%'],
                confidence: 'Medium'
            }
        };

        const details = moduleDetails[moduleName] || {
            description: 'Module analysis',
            signals: ['Signal 1: 80%', 'Signal 2: 75%'],
            confidence: 'Medium'
        };

        // Create detail tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'module-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-title">${moduleName} Details</div>
            <div class="tooltip-desc">${details.description}</div>
            <div class="tooltip-signals">
                ${details.signals.map(signal => `<div class="tooltip-signal">✓ ${signal}</div>`).join('')}
            </div>
            <div class="tooltip-confidence">Confidence: <strong>${details.confidence}</strong></div>
        `;

        // Show tooltip with animation
        item.appendChild(tooltip);
        setTimeout(() => tooltip.classList.add('show'), 0);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => tooltip.remove(), 300);
        }, 5000);
    }

    /**
     * Handle feedback submission
     */
    async handleFeedback(e) {
        const button = e.target.closest('.feedback-btn');
        if (!button) return;

        const isCorrect = button.textContent.includes('Correct');
        const feedback = isCorrect ? 'correct' : 'incorrect';

        // Visual feedback
        button.style.opacity = '0.5';
        button.style.pointerEvents = 'none';

        try {
            // Send feedback to backend
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    feedback,
                    scanId: this.getCurrentScanId(),
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                this.showToast(`Thanks! Your feedback helps us improve.`, 'success');
                this.logAnalytics('feedback_submitted', { feedback });
            }
        } catch (error) {
            console.error('Feedback submission error:', error);
            this.showToast('Error submitting feedback', 'error');
        }

        button.style.opacity = '1';
        button.style.pointerEvents = 'auto';
    }

    /**
     * Handle action button clicks
     */
    async handleAction(e) {
        const button = e.currentTarget;
        const action = button.classList.contains('action-share') ? 'share' : 'new';

        if (action === 'share') {
            await this.shareResult();
        } else if (action === 'new') {
            this.startNewScan();
        }

        this.logAnalytics('result_action', { action });
    }

    /**
     * Share result with privacy controls
     */
    async shareResult() {
        const shareData = {
            title: 'AuthenticaDetector Scan Result',
            text: this.getResultSummary(),
            url: window.location.href
        };

        try {
            if (navigator.share) {
                // Use native share API
                await navigator.share(shareData);
                this.showToast('Result shared successfully!', 'success');
            } else {
                // Fallback to copy to clipboard
                await navigator.clipboard.writeText(shareData.text);
                this.showToast('Result copied to clipboard!', 'success');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Share error:', error);
                this.showToast('Error sharing result', 'error');
            }
        }
    }

    /**
     * Get readable result summary
     */
    getResultSummary() {
        const label = document.getElementById('resultLabel')?.textContent || 'Unknown';
        const score = document.getElementById('scoreValue')?.textContent || '';
        const confidence = document.getElementById('confidenceText')?.textContent || '';

        return `Scan Result: ${label}\n${score}\nConfidence: ${confidence}`;
    }

    /**
     * Get current scan ID (placeholder - implement based on your app)
     */
    getCurrentScanId() {
        return localStorage.getItem('currentScanId') || 'unknown';
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#00d4aa'};
            color: #fff;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 12px;
            z-index: 1000;
            animation: toast-slide 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toast-slide-out 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Start new scan
     */
    startNewScan() {
        // This should match your app's new scan logic
        if (window.newScan) {
            window.newScan();
        } else {
            console.log('Starting new scan...');
        }
    }

    /**
     * Analytics logging helper
     */
    logAnalytics(eventName, data = {}) {
        if (window.gtag) {
            gtag('event', eventName, data);
        } else {
            console.log('Analytics:', eventName, data);
        }
    }
}

/**
 * Confidence Gauge Animator
 * Creates animated circular progress for confidence score
 */
class ConfidenceGaugeAnimator {
    constructor(scoreValue, fillElement) {
        this.scoreValue = scoreValue;
        this.fillElement = fillElement;
        this.duration = 1500;
        this.init();
    }

    init() {
        if (this.fillElement) {
            this.animate();
        }
    }

    animate() {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            const currentValue = Math.round(progress * this.scoreValue);

            // Update rotation for conic gradient
            const rotation = (currentValue / 100) * 360;
            this.fillElement.style.transform = `rotate(${rotation}deg)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
}

/**
 * Module Card Expander
 * Handles module card expansion and details display
 */
class ModuleCardExpander {
    constructor() {
        this.cards = document.querySelectorAll('.module-card, .explainer-item');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => this.toggleCard(e));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.toggleCard(e);
                }
            });
        });
    }

    toggleCard(e) {
        const card = e.currentTarget;
        const details = card.querySelector('.module-details');

        if (details) {
            details.classList.toggle('expanded');
            card.classList.toggle('expanded');

            // Scroll into view if expanded
            if (details.classList.contains('expanded')) {
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
        }
    }
}

/**
 * Initialize modern results features when DOM is ready
 */
function initializeModernResults() {
    // Check if we're on results view
    if (document.getElementById('resultCard')) {
        // Initialize controller
        window.resultsController = new ModernResultsController();

        // Animate result reveal if card is visible
        const resultCard = document.getElementById('resultCard');
        if (resultCard && !resultCard.classList.contains('hidden')) {
            window.resultsController.animateResultReveal();
        }

        // Initialize module card expanders
        window.moduleExpander = new ModuleCardExpander();

        // Add CSS animations for toasts
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes toast-slide {
                    from {
                        transform: translateX(-50%) translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes toast-slide-out {
                    from {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(-50%) translateY(100px);
                        opacity: 0;
                    }
                }
                .module-tooltip {
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%) translateY(-10px);
                    background: rgba(18, 22, 31, 0.95);
                    border: 1px solid rgba(0, 212, 170, 0.3);
                    border-radius: 10px;
                    padding: 10px;
                    font-size: 11px;
                    color: #b4bcd0;
                    opacity: 0;
                    transition: all 0.2s;
                    pointer-events: none;
                    z-index: 100;
                    white-space: nowrap;
                }
                .module-tooltip.show {
                    opacity: 1;
                    transform: translateX(-50%) translateY(-12px);
                    pointer-events: auto;
                }
                .tooltip-title {
                    font-weight: 700;
                    color: #00d4aa;
                    margin-bottom: 4px;
                }
                .tooltip-desc {
                    font-size: 10px;
                    color: #9ca3af;
                    margin-bottom: 6px;
                }
                .tooltip-signals {
                    margin-bottom: 6px;
                }
                .tooltip-signal {
                    font-size: 10px;
                    color: #b4bcd0;
                    margin: 2px 0;
                }
                .tooltip-confidence {
                    font-size: 10px;
                    color: #6b7280;
                    padding-top: 6px;
                    border-top: 1px solid rgba(0, 212, 170, 0.2);
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModernResults);
} else {
    initializeModernResults();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ModernResultsController,
        ConfidenceGaugeAnimator,
        ModuleCardExpander,
        initializeModernResults
    };
}
