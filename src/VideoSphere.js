THREE = require('three');

var VideoSphere = function(file) {
    if (['jpg','jpeg'].includes(file.split('.').pop().toLowerCase())) {
        this.image = file;
    } else {
        this.video = file;
    }
}

VideoSphere.prototype.getMesh = function() {
    var mesh;
    
    if (this.video) {    
        var geometry = new THREE.SphereBufferGeometry( 500, 60, 40, Math.PI/2 );
        geometry.scale( - 1, 1, 1 );
        
        mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial());
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
        mesh.material = material;        

    } else if (this.image) {
        var geometry = new THREE.SphereBufferGeometry( 500, 60, 40, Math.PI/2, Math.PI * 2, Math.PI/3, Math.PI/3 );
        geometry.scale( - 1, 1, 1 );
        
        mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial());
        
        var loader = new THREE.TextureLoader();
        loader.crossOrigin = 'Anonymous';
        loader.load(this.image, function(texture) {
            texture.minFilter = THREE.LinearFilter;
            texture.format = THREE.RGBFormat;
            var mat = new THREE.MeshBasicMaterial( { map:texture } );
            mesh.material = mat;
        });
    }    


    return mesh;
}

module.exports = VideoSphere;

