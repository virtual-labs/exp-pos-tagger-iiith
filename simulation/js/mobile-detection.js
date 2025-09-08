/**
 * Mobile Detection and Orientation Alert for POS Tagger Experiment
 * Alerts users on small screens to use landscape mode for better experience
 */

(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    mobileBreakpoint: 768, // Width below which we consider mobile
    tabletBreakpoint: 1024, // Width below which we consider tablet
    showAlertDelay: 1000, // Delay before showing alert (ms)
    alertDuration: 5000, // How long to show alert (ms)
    recheckInterval: 500, // How often to check orientation (ms)
    enableDebugMode: false, // Set to true for debugging
  };

  // State management
  let alertShown = false;
  let alertElement = null;
  let orientationCheckInterval = null;
  let isInitialized = false;
  let userDismissedAlert = false; // NEW: Track if user manually dismissed the alert
  let sessionStorage = window.sessionStorage || null; // For persistence across page interactions

  /**
   * Debug logging function
   */
  function debugLog(message, data = null) {
    if (CONFIG.enableDebugMode) {
      console.log(`[MobileDetection] ${message}`, data || "");
    }
  }

  /**
   * Check if user has previously dismissed the alert in this session
   */
  function hasUserDismissedAlert() {
    if (userDismissedAlert) return true;

    if (sessionStorage) {
      return (
        sessionStorage.getItem("pos-tagger-mobile-alert-dismissed") === "true"
      );
    }

    return false;
  }

  /**
   * Mark alert as dismissed by user
   */
  function markAlertAsDismissed() {
    userDismissedAlert = true;

    if (sessionStorage) {
      sessionStorage.setItem("pos-tagger-mobile-alert-dismissed", "true");
    }

    debugLog("Alert marked as dismissed by user");
  }

  /**
   * Reset dismissal state (when user rotates to landscape and back)
   */
  function resetDismissalState() {
    userDismissedAlert = false;

    if (sessionStorage) {
      sessionStorage.removeItem("pos-tagger-mobile-alert-dismissed");
    }

    debugLog("Alert dismissal state reset");
  }

  /**
   * Check if device is mobile/tablet based on screen width
   */
  function isMobileDevice() {
    return window.innerWidth <= CONFIG.mobileBreakpoint;
  }

  /**
   * Check if device is tablet based on screen width
   */
  function isTabletDevice() {
    return (
      window.innerWidth > CONFIG.mobileBreakpoint &&
      window.innerWidth <= CONFIG.tabletBreakpoint
    );
  }

  /**
   * Check if device is in portrait orientation
   */
  function isPortraitOrientation() {
    return window.innerHeight > window.innerWidth;
  }

  /**
   * Get device orientation as string
   */
  function getOrientation() {
    if (screen.orientation) {
      return screen.orientation.angle === 0 || screen.orientation.angle === 180
        ? "portrait"
        : "landscape";
    }
    return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  }

  /**
   * Create the alert overlay element
   */
  function createAlertElement() {
    if (alertElement) return alertElement;

    const overlay = document.createElement("div");
    overlay.id = "mobile-orientation-alert";
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: white;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
        `;

    const content = document.createElement("div");
    content.style.cssText = `
            max-width: 400px;
            margin: 0 auto;
            animation: fadeInScale 0.3s ease-out;
        `;

    // Add CSS animation
    if (!document.getElementById("mobile-alert-styles")) {
      const style = document.createElement("style");
      style.id = "mobile-alert-styles";
      style.textContent = `
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes rotatePhone {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(90deg); }
                }
                
                .rotate-animation {
                    animation: rotatePhone 2s ease-in-out infinite;
                }
            `;
      document.head.appendChild(style);
    }

    // Phone rotation icon
    const phoneIcon = document.createElement("div");
    phoneIcon.innerHTML = "📱";
    phoneIcon.style.cssText = `
            font-size: 4rem;
            margin-bottom: 1rem;
            display: block;
        `;
    phoneIcon.className = "rotate-animation";

    // Main heading
    const heading = document.createElement("h2");
    heading.textContent = "Better Experience Available";
    heading.style.cssText = `
            color: #4FC3F7;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 0 1rem 0;
            line-height: 1.3;
        `;

    // Description
    const description = document.createElement("p");
    description.innerHTML = `
            <strong>POS Tagger Interactive Simulation</strong><br><br>
            For the best experience with matrix tables and interactive features, please:
        `;
    description.style.cssText = `
            font-size: 1rem;
            line-height: 1.5;
            margin: 0 0 1.5rem 0;
            color: #E0E0E0;
        `;

    // Instructions list
    const instructions = document.createElement("ul");
    instructions.innerHTML = `
            <li>🔄 Rotate your device to <strong>landscape mode</strong></li>
            <li>📱 Use a tablet or desktop for optimal experience</li>
            <li>🖱️ Matrix interactions work best with larger screens</li>
        `;
    instructions.style.cssText = `
            text-align: left;
            font-size: 0.95rem;
            line-height: 1.6;
            margin: 0 0 1.5rem 0;
            padding-left: 0;
            list-style: none;
            color: #F0F0F0;
        `;

    // Instructions list items styling
    instructions.querySelectorAll("li").forEach((li) => {
      li.style.cssText = `
                margin-bottom: 0.75rem;
                padding-left: 0;
            `;
    });

    // Continue button
    const continueBtn = document.createElement("button");
    continueBtn.textContent = "Continue Anyway";
    continueBtn.style.cssText = `
            background: linear-gradient(45deg, #4FC3F7, #29B6F6);
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 24px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 0.5rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(79, 195, 247, 0.3);
        `;

    // UPDATED: Continue button click handler to mark as dismissed
    continueBtn.addEventListener("click", () => {
      markAlertAsDismissed(); // Mark as dismissed before hiding
      hideAlert();
    });

    continueBtn.addEventListener("mouseover", () => {
      continueBtn.style.transform = "translateY(-2px)";
      continueBtn.style.boxShadow = "0 6px 16px rgba(79, 195, 247, 0.4)";
    });
    continueBtn.addEventListener("mouseout", () => {
      continueBtn.style.transform = "translateY(0)";
      continueBtn.style.boxShadow = "0 4px 12px rgba(79, 195, 247, 0.3)";
    });

    // Dismiss text - UPDATED message
    const dismissText = document.createElement("p");
    dismissText.textContent =
      "Won't show again after you choose to continue in portrait mode";
    dismissText.style.cssText = `
            font-size: 0.8rem;
            color: #999;
            margin: 1rem 0 0 0;
            font-style: italic;
        `;

    // Assemble the content
    content.appendChild(phoneIcon);
    content.appendChild(heading);
    content.appendChild(description);
    content.appendChild(instructions);
    content.appendChild(continueBtn);
    content.appendChild(dismissText);

    overlay.appendChild(content);
    alertElement = overlay;

    debugLog("Alert element created");
    return overlay;
  }

  /**
   * Show the orientation alert
   */
  function showAlert() {
    // UPDATED: Don't show if user has dismissed or already shown
    if (alertShown || !document.body || hasUserDismissedAlert()) {
      debugLog("Alert not shown - already shown, no body, or user dismissed");
      return;
    }

    debugLog("Showing orientation alert");
    const alert = createAlertElement();
    document.body.appendChild(alert);
    alertShown = true;

    // Track analytics if available
    if (typeof gtag === "function") {
      gtag("event", "mobile_orientation_alert_shown", {
        device_width: window.innerWidth,
        device_height: window.innerHeight,
        orientation: getOrientation(),
      });
    }

    // UPDATED: Auto-hide after duration if still in portrait AND user hasn't dismissed
    setTimeout(() => {
      if (
        alertShown &&
        isMobileDevice() &&
        isPortraitOrientation() &&
        !hasUserDismissedAlert()
      ) {
        hideAlert();
      }
    }, CONFIG.alertDuration);
  }

  /**
   * Hide the orientation alert
   */
  function hideAlert() {
    if (!alertShown || !alertElement) return;

    debugLog("Hiding orientation alert");

    // Fade out animation
    alertElement.style.transition = "opacity 0.3s ease-out";
    alertElement.style.opacity = "0";

    setTimeout(() => {
      if (alertElement && alertElement.parentNode) {
        alertElement.parentNode.removeChild(alertElement);
      }
      alertElement = null;
      alertShown = false;
    }, 300);

    // Track analytics if available
    if (typeof gtag === "function") {
      gtag("event", "mobile_orientation_alert_dismissed", {
        orientation: getOrientation(),
        user_dismissed: hasUserDismissedAlert(),
      });
    }
  }

  /**
   * Check orientation and show/hide alert accordingly
   */
  function checkOrientationAndShowAlert() {
    const isMobile = isMobileDevice();
    const isTablet = isTabletDevice();
    const isPortrait = isPortraitOrientation();

    debugLog("Orientation check", {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile,
      isTablet,
      isPortrait,
      orientation: getOrientation(),
      userDismissed: hasUserDismissedAlert(),
    });

    // UPDATED: Only show alert if user hasn't dismissed it
    if (isMobile && isPortrait && !alertShown && !hasUserDismissedAlert()) {
      setTimeout(showAlert, CONFIG.showAlertDelay);
    }
    // Hide alert if rotated to landscape or on larger screen
    else if (alertShown && (!isMobile || !isPortrait)) {
      hideAlert();
    }

    // UPDATED: Reset dismissal state if user goes to landscape mode
    // This allows the alert to show again if they rotate back to portrait
    if (!isMobile || !isPortrait) {
      if (hasUserDismissedAlert()) {
        resetDismissalState();
        debugLog(
          "Reset dismissal state - user is in landscape or on larger screen"
        );
      }
    }
  }

  /**
   * Handle orientation change events
   */
  function handleOrientationChange() {
    debugLog("Orientation change detected");

    // Small delay to ensure accurate measurements after rotation
    setTimeout(() => {
      checkOrientationAndShowAlert();
    }, 100);
  }

  /**
   * Handle window resize events
   */
  function handleResize() {
    debugLog("Window resize detected");
    checkOrientationAndShowAlert();
  }

  /**
   * Start periodic orientation checking
   */
  function startOrientationChecking() {
    if (orientationCheckInterval) return;

    orientationCheckInterval = setInterval(() => {
      checkOrientationAndShowAlert();
    }, CONFIG.recheckInterval);

    debugLog("Started orientation checking interval");
  }

  /**
   * Stop periodic orientation checking
   */
  function stopOrientationChecking() {
    if (orientationCheckInterval) {
      clearInterval(orientationCheckInterval);
      orientationCheckInterval = null;
      debugLog("Stopped orientation checking interval");
    }
  }

  /**
   * Initialize the mobile detection system
   */
  function initialize() {
    if (isInitialized) return;

    debugLog("Initializing mobile detection system");

    // Initial check
    checkOrientationAndShowAlert();

    // Event listeners
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleResize);

    // Start periodic checking for devices that don't fire orientation events reliably
    startOrientationChecking();

    // Handle page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopOrientationChecking();
      } else {
        startOrientationChecking();
        checkOrientationAndShowAlert();
      }
    });

    isInitialized = true;
    debugLog("Mobile detection system initialized");
  }

  /**
   * Public API
   */
  window.MobileDetection = {
    init: initialize,
    checkOrientation: checkOrientationAndShowAlert,
    showAlert: showAlert,
    hideAlert: hideAlert,
    isInitialized: () => isInitialized,
    isMobile: isMobileDevice,
    isTablet: isTabletDevice,
    isPortrait: isPortraitOrientation,
    getOrientation: getOrientation,
    resetDismissal: resetDismissalState, // NEW: Allow manual reset
    config: CONFIG,
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    // DOM is already ready
    setTimeout(initialize, 100);
  }

  debugLog("Mobile detection script loaded");
})();
