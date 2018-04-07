var THREE = require('three');
var Keyboard = require('./lwjgl-keyboard.js');

var Hud = function(env, width, height) {
    this.scene = new THREE.Scene();


    /*
    this.camera = new THREE.OrthographicCamera(
        (-width/2), width/2,
        height/2, -height/2,
        0.1, 30
    );
    */


    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
    
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

    
    //this.planeGeometry = new THREE.PlaneGeometry( width, height );
    //var mesh = new THREE.Mesh( this.planeGeometry, this.material )
    //mesh.position.set(0,0,-10);
    //mesh.scale.set(0.01,0.01,0.01);
    //this.scene.add(mesh);

    var touching = false;
    // --- Screen touch  handlers ---
    var screenDown = function(ev) {
        if (ev) {
            var pageX = ev.pageX || ev.touches.item(0).pageX;
            var pageY = ev.pageY || ev.touches.item(0).pageY;
            env.mouse['0'] = true;
            env.lastMouse = 0;
            touching = true;
            env.mouseX = pageX;
            env.mouseY = pageY;
        }
    }

    var screenMove = function(ev) {
        if (ev) {
            var pageX = ev && (ev.pageX || ev.touches.item(0).pageX);
            var pageY = ev && (ev.pageY || ev.touches.item(0).pageY);
            if (touching) {
                env.mouseDX = pageX - env.mouseX;
                env.mouseDY = pageY - env.mouseY;
                //env.mouseX = pageX;
                env.mouseY = pageY;
            }
        }
    }
    
    var resetKeys = function() {
        env.lastKeyDown = 0;
        env.mouse['0'] = false;
        env.lastMouse = -1;
        env.mouseDX = 0;
        env.mouseDY = 0;
        touching = false;
    }.bind(this);

    document.addEventListener('mousedown', screenDown);
    document.addEventListener('touchstart', screenDown);

    document.addEventListener('mousemove', screenMove);
    document.addEventListener('touchmove', screenMove);

    document.addEventListener('mouseup', resetKeys);
    document.addEventListener('touchend', resetKeys);

    
    // Buttons handlers
    var touchdown = function(e) {
        var keycode = Keyboard[this.getAttribute("env3d-key")];
        env.lastKeyDown = keycode;
        env.keys[keycode] = true;
        e.preventDefault();
        e.stopPropagation();
    }

    var touchup = function(e) {
        var keycode = Keyboard[this.getAttribute("env3d-key")];        
        env.keys[keycode] = false;
        env.lastKeyDown = 0;        
        e.preventDefault();
        e.stopPropagation();        
    }    


    var buttonList = document.querySelectorAll('[env3d-key]');
    for (var i=0; i<buttonList.length;i++) {
        var button = buttonList.item(i);
        button.addEventListener('mousedown', touchdown.bind(button));
        button.addEventListener('touchstart', touchdown.bind(button));
        button.addEventListener('mouseup', touchup.bind(button));
        button.addEventListener('touchend', touchup.bind(button));        
    }
}

Hud.prototype.write = function(str) {
    str = str || "";
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
