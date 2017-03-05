
module.exports = DefaultControlHandlers;

function DefaultControlHandlers(env) {
    env.mousedownhandler = mousedown.bind(env);
    env.mouseuphandler = mouseup.bind(env);
    env.mousemovehandler = mousemove.bind(env);
    env.keydownhandler = keydown.bind(env);
}

function mousedown(e) {
    this.lastMousePosition = [e.pageX, e.pageY];
    this.mouseControl = true;
}

function mousemove(e) {
    if (this.mouseControl) {
	var deltaY = 0.01*(this.lastMousePosition[1]-e.pageY);
	this.cameraPitch += deltaY;
	var deltaX = 0.01*(this.lastMousePosition[0]-e.pageX);
	this.cameraYaw += deltaX;
	//	    console.log(deltaX + " " + deltaY);
	this.lastMousePosition = [e.pageX, e.pageY];
    }	
}

function mouseup(e) {
    this.mouseControl = false;
}

var speed = 1;

function keydown(e) {
    var e = window.event || e;
    
    if (e.keyCode == 87) { //W
	this.cameraZ -= speed*Math.cos(this.cameraYaw);
	this.cameraX -= speed*Math.sin(this.cameraYaw);
    } else if (e.keyCode == 83) { //S
	this.cameraZ += speed*Math.cos(this.cameraYaw);
	this.cameraX += speed*Math.sin(this.cameraYaw);
    } else if (e.keyCode == 65) { //A
	this.cameraZ += speed*Math.sin(this.cameraYaw);
	this.cameraX -= speed*Math.cos(this.cameraYaw);
    } else if (e.keyCode == 68) { //D
	this.cameraZ -= speed*Math.sin(this.cameraYaw);
	this.cameraX += speed*Math.cos(this.cameraYaw);
    } else if (e.keyCode == 32) { //SPACE
	this.cameraY += speed;
    } else if (e.keyCode == 67) { //C
	this.cameraY -= speed;
    }
}
