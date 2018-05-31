var Hud = function(env, width, height) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x000000 );

    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
    
    this.hudCanvas = document.createElement('canvas');
    this.hudCanvas.width = 512;
    this.hudCanvas.height = 64 * 2;
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
    
    this.hudTexture = new THREE.CanvasTexture(this.hudCanvas);
    window['hud'] = this.hudTexture;

    this.material = new THREE.MeshBasicMaterial( {
        map: this.hudTexture,
        transparent: true,
        opacity: 1,
        depthTest: false
    } );

    
    this.planeGeometry = new THREE.PlaneGeometry( this.hudCanvas.width/100, this.hudCanvas.height/100 );
    var mesh = new THREE.Mesh( this.planeGeometry, this.material );
    mesh.position.set(0,2,-10);
    let scale = 1;
    mesh.scale.set(scale, scale, scale);
    mesh.renderOrder = Number.MAX_SAFE_INTEGER-1;
    this.mesh = mesh;
    this.scene.add(mesh);

    var touching = false;
    // --- Screen touch  handlers ---
    var screenDown = function(ev) {
        if (ev && (ev.pageX || ev.touches)) {
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
        if (ev && (ev.pageX || ev.touches)) {
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

        let ctx = this.hudBitmap;
        ctx.shadowColor = 'gray';
        ctx.shadowOffsetY = 0;
        ctx.shadowOffsetX = 0;

        this.hudBitmap.clearRect(0,0,this.hudCanvas.width, this.hudCanvas.height);        
        if (str.length > 0) {
            this.hudBitmap.fillStyle = "rgba(255,255,255,0.8)";

            let width = this.hudCanvas.width - 20;
            let height = this.hudCanvas.height - 20;
            roundRect(ctx, 10, 10, width, height, 20, true, true);
            //this.hudBitmap.fillRect(0,0,this.hudCanvas.width,this.hudCanvas.height);            
        }

        if (this.background) {
            this.hudBitmap.drawImage(this.background, 0, 0);
        }

        ctx.shadowOffsetY = 1;
        ctx.shadowOffsetX = 1;        
        this.hudBitmap.font = "Normal 20pt Arial";
        this.hudBitmap.textAlign = 'left';
        this.hudBitmap.textBaseline = 'middle';
        this.hudBitmap.fillStyle = "rgba(0,0,0,1)";
        this.hudBitmap.fillText(str, this.hudCanvas.width / 20, this.hudCanvas.height / 2);
        this.hudTexture.needsUpdate = true;
    }
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) { 
    if (typeof stroke == 'undefined') {
        stroke = true; 
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke(); 
    } 
}

module.exports = Hud;
