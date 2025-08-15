// This script ensures React hooks are properly initialized
// It runs before the main application code

(function() {
  try {
    console.log('Initializing React hooks...');
    
    // Check if React is available from CDN
    if (window.React) {
      console.log('React found on window:', window.React.version);
      
      // Ensure useLayoutEffect is properly defined
      if (!window.React.useLayoutEffect) {
        console.log('Defining useLayoutEffect...');
        // Use useEffect as a fallback for useLayoutEffect in non-browser environments
        window.React.useLayoutEffect = window.React.useEffect || 
          function useLayoutEffect(callback, deps) {
            return callback();
          };
      }
      
      // Check if ReactDOM is available
      if (window.ReactDOM) {
        console.log('ReactDOM found on window');
      } else {
        console.error('ReactDOM not found on window');
      }
    } else {
      console.error('React not found on window object');
    }
  } catch (e) {
    console.error('Error in react-init script:', e);
  }
})();
