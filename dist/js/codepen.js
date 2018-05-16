// Code pen specific code to hide the ugly setup details

// Pre-set the basedAssetsUrl so default assets are loaded properly
env3d.Env.baseAssetsUrl = "https://env3d.github.io/env3d-js/dist/";

// Start env
var env = new env3d.Env();

// lighting
env.scene.add(new THREE.HemisphereLight( 0x7f7f7f, 0x000000, 10 ));

[
    {x: -4, y: -4, z: -4},
    {x: 1, y: 2, z: 1}
].map( p => {
    var light = new THREE.DirectionalLight( 0xffffff);
    light.position.set( p.x, p.y, p.z ).normalize();
    return light;
}).forEach ( l => {
    env.scene.add( l );
});                 

env.start();

// Allow VR to be used
env.initVRController();
