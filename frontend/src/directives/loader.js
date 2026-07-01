export const loaderDirective = {
  mounted(el, binding) {
    // 1. Ensure the parent container can anchor absolute elements
    const originalPosition = window.getComputedStyle(el).position;
    if (originalPosition === 'static') {
      el.style.position = 'relative';
    }

    // 2. Build the Bootstrap overlay structure
    const overlay = document.createElement('div');
    overlay.className = 'position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75 z-3';
    overlay.style.transition = 'opacity 0.2s ease';
    overlay.style.opacity = '0';
    // Keeping a unique attribute reference to locate it easily later
    overlay.setAttribute('data-directive-loader', '');

    // 3. Inject standard Bootstrap spinner element
    overlay.innerHTML = `
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    `;

    // Attach reference instance directly onto the DOM node wrapper object
    el._loaderOverlay = overlay;

    // Evaluate initial rendering status
    if (binding.value) {
      el.appendChild(overlay);
      // Brief timeout ensures CSS animations fade smoothly
      setTimeout(() => overlay.style.opacity = '1', 10);
    }
  },

  updated(el, binding) {
    // Toggle overlay insertion dynamically based on boolean adjustments
    if (binding.value !== binding.oldValue) {
      if (binding.value) {
        if (!el.contains(el._loaderOverlay)) {
          el.appendChild(el._loaderOverlay);
          setTimeout(() => el._loaderOverlay.style.opacity = '1', 10);
        }
      } else {
        if (el.contains(el._loaderOverlay)) {
          el._loaderOverlay.style.opacity = '0';
          // Remove from node structure after the fade opacity transition executes
          setTimeout(() => {
            if (!binding.value && el.contains(el._loaderOverlay)) {
              el.removeChild(el._loaderOverlay);
            }
          }, 200);
        }
      }
    }
  },

  unmounted(el) {
    // Clean up DOM references when component destroys to avoid memory leaks
    if (el._loaderOverlay && el.contains(el._loaderOverlay)) {
      el.removeChild(el._loaderOverlay);
    }
    delete el._loaderOverlay;
  }
};
