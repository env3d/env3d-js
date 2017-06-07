THREE = require('three');

var VideoSphere = function(videoFile) {
    this.video = videoFile;    
}

VideoSphere.prototype.getMesh = function() {
    var geometry = new THREE.SphereBufferGeometry( 500, 60, 40, Math.PI/2 );
    geometry.scale( - 1, 1, 1 );
    var video = document.createElement( 'video' );
    video.width = 640;
    video.height = 360;
    video.loop = true;
    video.muted = true;
    //video.src = "textures/pano.webm";
    video.src = this.video;
    video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
    video.setAttribute( 'crossorigin', 'anonymous');    
    video.play();
    
    var texture = new THREE.VideoTexture( video );
    texture.minFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    var material   = new THREE.MeshBasicMaterial( { map : texture } );
    mesh = new THREE.Mesh( geometry, material );

    return mesh;
}

module.exports = VideoSphere;

