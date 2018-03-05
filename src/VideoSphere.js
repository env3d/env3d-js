var THREE = require('three');

// The name is VideoSphere but it also handles 360 images

let vertShader = `
varying vec3 vColor;
varying vec2 vUv;

void main() {
    vColor = color;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

let fragShader = `
uniform sampler2D texture;
varying vec3 vColor; 
varying vec2 vUv; 

void main() { 
    float y;
    if (vUv.y > 0.7 || vUv.y < 0.3) {
        if (vUv.y < 0.30) {
            y = vUv.y / 0.30;
        } else {
            y = (1.0 - vUv.y) / 0.30;
        }
        //y = pow(y,2.0);
    } else {
        y = 1.0;
    }
    gl_FragColor = 1.3 * vec4(y,y,y,1.0) * texture2D(texture, vec2(vUv.x, vUv.y));
}
`;

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
        
        mesh = new THREE.Mesh( geometry );
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
        var geometry = new THREE.SphereBufferGeometry( 500, 60, 40, Math.PI/2, Math.PI * 2, Math.PI/4, (Math.PI/4)*2 );
        geometry.scale( - 1, 1, 1 );
        var mesh = new THREE.Mesh( geometry );
        
        
        var loader = new THREE.TextureLoader();
        loader.crossOrigin = 'Anonymous';
        loader.load(this.image, function(texture) {
            texture.minFilter = THREE.LinearFilter;
            texture.format = THREE.RGBFormat;
            //var mat = new THREE.MeshBasicMaterial( { map:texture } );
            var mat = new THREE.ShaderMaterial({
                uniforms: { texture: {value: texture} },
                vertexShader: vertShader,
	        fragmentShader: fragShader,
                vertexColors: true                
            });
            mesh.material = mat;
        });
    }    


    return mesh;
}

module.exports = VideoSphere;

