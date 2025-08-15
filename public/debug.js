// Debug script to catch and log errors
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.error);
  
  // Create visible error display on page
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '10px';
  errorDiv.style.left = '10px';
  errorDiv.style.padding = '20px';
  errorDiv.style.backgroundColor = 'rgba(255,0,0,0.8)';
  errorDiv.style.color = 'white';
  errorDiv.style.zIndex = '9999';
  errorDiv.style.maxWidth = '80%';
  errorDiv.style.maxHeight = '80%';
  errorDiv.style.overflow = 'auto';
  errorDiv.style.borderRadius = '5px';
  
  const errorMessage = document.createElement('pre');
  errorMessage.textContent = `Error: ${event.error?.message || 'Unknown error'}\n\nStack: ${event.error?.stack || 'No stack trace'}`;
  errorDiv.appendChild(errorMessage);
  
  document.body.appendChild(errorDiv);
});

// Log React version
console.log('Debug info loaded');
try {
  setTimeout(() => {
    console.log('React version check:');
    if (window.React) {
      console.log('React version:', window.React.version);
    } else {
      console.log('React not found on window object');
    }
    
    // Check for Three.js
    if (window.THREE) {
      console.log('Three.js found:', window.THREE.REVISION);
    } else {
      console.log('Three.js not found on window object');
    }
    
    // Check for root element
    const root = document.getElementById('root');
    console.log('Root element:', root ? 'Found' : 'Not found');
    if (root) {
      console.log('Root children:', root.children.length);
    }
  }, 1000);
} catch (e) {
  console.error('Error in debug script:', e);
}
