
module.exports = DefaultControlHandlers;


function DefaultControlHandlers(env) {
    env.mousedownhandler = mousedown.bind(env);
    env.mouseuphandler = mouseup.bind(env);
    env.mousemovehandler = mousemove.bind(env);
    env.keydownhandler = keydown.bind(env);
    env.keyuphandler = keyup.bind(env);
    
    // track keyboard/mouse at 60fps    
    this.loopId = setInterval( function() {
        // forward/backward
        this.cameraZ -= movement[0]*speed*Math.cos(this.camera.rotation.y);
        this.cameraX -= movement[0]*speed*Math.sin(this.camera.rotation.y);
        
        // left/right
        this.cameraZ += movement[1]*speed*Math.sin(this.camera.rotation.y);
        this.cameraX -= movement[1]*speed*Math.cos(this.camera.rotation.y);
        
        // up/down
        this.cameraY += movement[2]*speed;
    }.bind(env), 16);    
}

function mousedown(e) {
    this.lastMousePosition = [e.pageX, e.pageY];
    this.mouseControl = true;
}

function mousemove(e) {
    if (this.mouseControl) {
	var deltaY = 0.5*(this.lastMousePosition[1]-e.pageY);
	this.cameraPitch += deltaY;
	var deltaX = 0.5*(this.lastMousePosition[0]-e.pageX);
	this.cameraYaw += deltaX;
	//	    console.log(deltaX + " " + deltaY);
	this.lastMousePosition = [e.pageX, e.pageY];
    }	
}

function mouseup(e) {
    this.mouseControl = false;
}

var speed = 0.3;

// axis of movement
// forward/backward, left/right, up/down
let movement = [0,0,0];

function keydown(e) {
    //console.log(e.keyCode);
    var e = window.event || e;

    if (e.keyCode == 87) { //W
        movement[0] = 1;
    } else if (e.keyCode == 83) { //S
        movement[0] = -1;
    } else if (e.keyCode == 65) { //A
        movement[1] = 1;
    } else if (e.keyCode == 68) { //D
        movement[1] = -1;
    } else if (e.keyCode == 32) { //SPACE
        movement[2] = 1;
    } else if (e.keyCode == 67 || e.keyCode == 17) { //C or Ctrl
        movement[2] = -1;
    }
}

function keyup(e) {
    var e = window.event || e;
    console.log('keyup', e);
    if (e.keyCode == 87) { //W
        movement[0] = 0;
    } else if (e.keyCode == 83) { //S
        movement[0] = 0;
    } else if (e.keyCode == 65) { //A
        movement[1] = 0;
    } else if (e.keyCode == 68) { //D
        movement[1] = 0;
    } else if (e.keyCode == 32) { //SPACE
        movement[2] = 0;
    } else if (e.keyCode == 67 || e.keyCode == 17) { //C or Ctrl
        movement[2] = 0;
    }
}
