var THREE = require('three');
var Keyboard = require('./lwjgl-keyboard.js');

var Hud = function(env, width, height) {
    this.scene = new THREE.Scene();
    
    this.camera = new THREE.OrthographicCamera(
        (-width/2), width/2,
        height/2, -height/2,
        0, 30
    );
    
    this.hudCanvas = document.createElement('canvas');
    this.hudCanvas.width = width; 
    this.hudCanvas.height = height; 
    this.hudBitmap = this.hudCanvas.getContext('2d');

    /*
    var controllerImg = new Image();
    controllerImg.src = "textures/controller/buttons.png";
    controllerImg.addEventListener('load', function() {
        this.hudBitmap.drawImage(controllerImg, 0, 0);
        this.hudTexture.needsUpdate = true;
    }.bind(this));
    this.background = controllerImg;
    */
    
    this.hudTexture = new THREE.Texture(this.hudCanvas);
    this.hudTexture.needsUpdate = true;

    this.material = new THREE.MeshBasicMaterial( {
        map: this.hudTexture,
        transparent: true,
        opacity: 1
    } );

    
    this.planeGeometry = new THREE.PlaneGeometry( width, height );
    
    this.scene.add(
        new THREE.Mesh( this.planeGeometry, this.material )
    );

    // --- Touch handlers ---
    var touchdown = function(e) {
        var pageX = e instanceof TouchEvent ? e.changedTouches[0].pageX : e.pageX;
        var pageY = e instanceof TouchEvent ? e.changedTouches[0].pageY : e.pageY;
        var midHeight = this.hudCanvas.height / 2;        
        var midWidth = this.hudCanvas.width / 2;
        var deadZoneY = this.hudCanvas.height / 8;
        
        if (pageY < midHeight - deadZoneY) {
            //env.lastKeyDown = 38;
            env.lastKeyDown = Keyboard.KEY_UP;
        } else if (pageY > midHeight + deadZoneY) {
            env.lastKeyDown = Keyboard.KEY_DOWN;
        } else if (pageX > midWidth) {
            env.lastKeyDown = Keyboard.KEY_RIGHT;            
        } else if (pageX < midWidth) {
            env.lastKeyDown = Keyboard.KEY_LEFT;          
        }

        console.log(pageX+" "+pageY);
    }.bind(this);

    var touchup = function() {
        env.lastKeyDown = 0;
    }.bind(this);
    
    document.addEventListener('mousedown', touchdown);
    document.addEventListener('touchstart', touchdown);
    
    document.addEventListener('mouseup', touchup);
    document.addEventListener('touchend', touchup);
}

Hud.prototype.write = function(str) {
    if (this.str != str) {
        this.str = str;
        this.hudBitmap.clearRect(0,0,this.hudCanvas.width, this.hudCanvas.height);
        if (this.background) {
            this.hudBitmap.drawImage(this.background, 0, 0);
        }
        this.hudBitmap.font = "Normal 40px Arial";
        this.hudBitmap.textAlign = 'center';
        this.hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
        this.hudBitmap.fillText(str, this.hudCanvas.width / 2, this.hudCanvas.height / 2);
        this.hudTexture.needsUpdate = true;
    }
}

module.exports = Hud;
