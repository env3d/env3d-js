// Code pen specific code to hide the ugly setup details

// Pre-set the basedAssetsUrl so default assets are loaded properly
env3d.Env.baseAssetsUrl = "https://env3d.github.io/env3d-js/dist/";

// Start env
var env = new env3d.Env();
env.start();

// Allow VR to be used
env.initVRController();
