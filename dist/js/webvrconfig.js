var WebVRConfig = {
    // Prevents the polyfill from initializing automatically.
    DEFER_INITIALIZATION: false,
    // Ensures the polyfill is always active when initialized, even if the
    // native API is available. This is probably NOT what most pages want.
    ALWAYS_APPEND_POLYFILL_DISPLAY: true,
    BUFFER_SCALE: 0.5
} 
