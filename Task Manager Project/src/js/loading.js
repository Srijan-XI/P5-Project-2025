/**
 * Loading Module - Manage loading states
 */

const Loading = {
    isLoading: false,
    overlayElement: null,

    /**
     * Show loading spinner
     */
    show() {
        if (this.isLoading) return;

        this.isLoading = true;
        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.id = 'loading-overlay';
        loader.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loader);
        this.overlayElement = loader;
    },

    /**
     * Hide loading spinner
     */
    hide() {
        this.isLoading = false;
        const loader = document.getElementById('loading-overlay');
        if (loader) {
            loader.remove();
        }
        this.overlayElement = null;
    },

    /**
     * Check if currently loading
     */
    get active() {
        return this.isLoading;
    }
};

export default Loading;
