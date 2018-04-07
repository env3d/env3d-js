window['THREE'] = require('three');

require('../node_modules/three/examples/js/renderers/SoftwareRenderer.js');
require('../node_modules/three/examples/js/renderers/Projector.js');
//require('../node_modules/three/examples/js/effects/StereoEffect.js');
require('../node_modules/three/examples/js/effects/VREffect.js');

var EnvGameObject = require('./GameObject.js');
var DefaultRoom = require('./DefaultRoom.js');
var Keyboard = require('./lwjgl-keyboard.js');
var Hud = require('./hud.js');
var DefaultControlHandlers = require('./DefaultControlHandlers.js');
var Detector = require('../node_modules/three/examples/js/Detector.js');
var LoadWorld = require('./LoadWorld.js');
var VideoSphere = require('./VideoSphere.js');

// If defaultRoom is true, create one
var Env = function(defaultRoom) {

    if (defaultRoom === undefined) defaultRoom = true;

    // Create ENV as this to preserve scope
    var ENV = this;

    // First create the HUD scene and camera

    this.hud = new Hud(this, 512, 512);
    this.setupWorld = LoadWorld;

    // Allow cross origin loading of images
    THREE.ImageUtils.crossOrigin = 'Anonymous';
    
    // The real scene and camera
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
    this.camera.position.x = this.cameraX = 5;
    this.camera.position.y = this.cameraY = 5;
    this.camera.position.z = this.cameraZ = 12;

    this.camera.rotation.x = this.cameraPitch = 0;
    this.camera.rotation.y = this.cameraYaw = 0;
    this.camera.rotation.z = this.cameraRoll = 0;    

    let defaultControlHandlers = new DefaultControlHandlers(this);
    this.defaultControl = true;
    this.setDefaultControl(this.defaultControl);
    
    this.scene = new THREE.Scene();
        
    // Camera    
    this.scene.add(this.camera);    
    
    this.room = new THREE.Group();
    this.scene.add(this.room);
    
    this.gameObjects = [];

    //Detector.webgl = false;
    if (Detector.webgl) {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.autoClear = false;
    } else {
        this.renderer = new THREE.SoftwareRenderer();
    }

    // Turn this on for stereo rendering
    this.stereo = false;
    if (THREE.StereoEffect) {
        this.stereoEffect = new THREE.StereoEffect(this.renderer);
        //this.stereoEffect = new THREE.VREffect(this.renderer);
        this.stereoEffect.setSize( window.innerWidth, window.innerHeight );
    }
    if (THREE.VREffect) {
        this.stereoEffect = new THREE.VREffect(this.renderer);
        //this.stereoEffect = new THREE.VREffect(this.renderer);
        this.stereoEffect.setSize( window.innerWidth, window.innerHeight, false );
    }    

    this.renderer.setSize( window.innerWidth, window.innerHeight );

    //this.renderer.setClearColor(0x00008f);

    this.lastKey = 0;
    this.lastKeyDown = 0;

    this.mouseGrab = false;
    this.lastMouse = -1;
    this.mouse = {};

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDX = 0;
    this.mouseDY = 0;
    
    if (defaultRoom) {
        this.setRoom(new DefaultRoom());
    }
    // Attach to the body, taking over the entire window
    // @todo: want to attach to an element, maybe create custom element

    document.querySelector('#env3d').appendChild(ENV.renderer.domElement);

    this.keys = {};    
    document.addEventListener('keyup', (function(e) {
        this.lastKey = e.keyCode;
        this.lastKeyDown = 0;
        this.keys[e.keyCode] = false;
    }).bind(this));

    document.addEventListener('keydown', (function(e) {
        //this.setDisplayStr(e.charCode+" "+e.which+" "+e.keyCode);
        this.lastKeyDown = e.keyCode;
        this.keys[e.keyCode] = true;
    }).bind(this));

    window.addEventListener('resize', function() {
	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.stereoEffect.setSize( window.innerWidth, window.innerHeight );
    }.bind(this), false);
}

// A debug print of the current camera position and rotation
Env.prototype.debugCameraPosition = function() {
    var positionString = this.camera.position.x+","+this.camera.position.y+","+this.camera.position.z;
    var rotationString = this.camera.rotation.x+","+this.camera.rotation.y+","+this.camera.rotation.z;
    return "[new THREE.Vector3("+positionString+"), new THREE.Vector3("+rotationString+")]";
}

Env.prototype.setDefaultControl = function(control) {
    console.warn('setting default control to '+control);

    this.defaultControl = control;
    
    if (control) {
        document.addEventListener('mousedown', this.mousedownhandler, false);
        document.addEventListener('mousemove', this.mousemovehandler, false);
        document.addEventListener('mouseup', this.mouseuphandler, false);
        document.addEventListener('keydown', this.keydownhandler, false);        
    } else {
        console.log('disabling control');
        document.removeEventListener('mousedown', this.mousedownhandler, false);
        document.removeEventListener('mousemove', this.mousemovehandler, false);
        document.removeEventListener('mouseup', this.mouseuphandler, false);
        document.removeEventListener('keydown', this.keydownhandler, false);                
    }
}

// Sets a 360 video as background
Env.prototype.setBackgroundVideo = function(path) {
    if (!path.startsWith('http')) {
        path = Env.baseAssetsUrl+path;
    }
    
    var v = new VideoSphere(path);
    var m = v.getMesh();

    this.scene.add(m);
}

Env.prototype.setSky = function(path) {
    if (!path.endsWith('/')) path += '/';
    var loader = new THREE.CubeTextureLoader();
    loader.setCrossOrigin('Anonymous');
    if (path.startsWith('http')) {
        loader.setPath(path);
    } else {
        loader.setPath(Env.baseAssetsUrl+path);
    }
    var textureCube = loader.load( [
	'east.png', 'west.png',
	'top.png', 'bottom.png',
	'north.png', 'south.png'
    ] );
    console.log(textureCube);
    this.scene.background = textureCube;
}

Env.prototype.setTerrain = function(textureFile) {
    EnvGameObject.loadTexture(textureFile, function(texture) {
        texture.wrapS = THREE.RepeatWrapping; 
        texture.wrapT = THREE.RepeatWrapping;
        
        // how many times to repeat in each direction; the default is (1,1),
        //   which is probably why your example wasn't working
        texture.repeat.set( 100, 100 ); 
        var terrainMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1000,1000),
            new THREE.MeshBasicMaterial( {
                map: texture,
                side: THREE.DoubleSide
            } )
        );
        
        terrainMesh.rotation.x = -Math.PI/2;
        this.scene.add(terrainMesh);        
    }.bind(this));
};

// Helper function for creating a wall within a square room
function createWallMesh(direction, room, material) {
    var geometry;
    var position = new THREE.Vector3(0,0,0);
    var rotation = new THREE.Vector3(0,0,0);
    if (direction.search("North") > -1) {
        geometry = new THREE.PlaneGeometry(room.width,room.height);
        position.set(room.width/2, room.height/2, 0);
    } else if (direction.search("East") > -1) {
        geometry = new THREE.PlaneGeometry(room.depth,room.height);
        rotation.set(0, -Math.PI/2, 0);
        position.set(room.width, room.height/2, room.depth/2);
    } else if (direction.search("West") > -1) {
        geometry = new THREE.PlaneGeometry(room.depth,room.height);
        rotation.set(0, Math.PI/2, 0);
        position.set(0, room.height/2, room.depth/2);
    } else if (direction.search("South") > -1) {
        geometry = new THREE.PlaneGeometry(room.width,room.height);
        rotation.set(0, Math.PI, 0);
        position.set(room.width/2, room.height/2, room.depth);
    } else if (direction.search("Bottom") > -1) {
        geometry = new THREE.PlaneGeometry(room.width,room.depth);
        rotation.set(-Math.PI/2, 0, 0);
        position.set(room.width/2, 0, room.depth/2);
    } else if (direction.search("Top") > -1) {
        geometry = new THREE.PlaneGeometry(room.width,room.depth);
        rotation.set(Math.PI/2, 0, 0);
        position.set(room.width/2, room.height, room.depth/2);
    }
    var mesh = new THREE.Mesh(
        geometry, material
    );
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    return mesh;
}

Env.prototype.setRoom = function(room) {
    console.log("clearing scene");
    this.clearScene();
    
    this.scene.remove(this.room);
    /*
    this.room.children.forEach(function (wall) {
        this.room.remove(wall);
    }.bind(this));
    */

    var defaultRoom = new DefaultRoom();
    this.room = new THREE.Object3D();
    this.scene.add(this.room);

    for (var direction in defaultRoom) {
        if (room[direction] === undefined) room[direction] = defaultRoom[direction];
    }

    for (var direction in room) {
	if (direction.search("texture") > -1 && room[direction] != null) {            
            EnvGameObject.loadTexture(room[direction], function(texture) {
                var material = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                });                
                var wall = createWallMesh(this.d, this.r, material);
                this.room.add(wall);
            }.bind({
                d: direction,
                r: room,
                room: this.room
            }));
	}
    }
}

Env.prototype.addObject = function(obj) {
    
    obj.env = this;
    if (obj instanceof EnvGameObject) {
	this.scene.add(obj.mesh);
    } else {
        //console.log("patching obj");
        EnvGameObject.patchGameObject(obj);
	this.scene.add(obj.mesh);            
    }
    
    this.gameObjects.push(obj);
    
}

Env.prototype.removeObject = function(obj) {
    this.gameObjects.forEach(function(o) {
        if (o === obj) {
            this.scene.remove(o.mesh);
        }
    }.bind(this));
}

Env.prototype.clearScene = function() {        
    this.gameObjects.forEach(function(obj) {
        console.warn("Clearing obj",obj);
        this.scene.remove(obj.mesh);
    }.bind(this));
    this.gameObjects = [];
    this.vertices = [];
}

var clock = new THREE.Clock();

Env.prototype.start = function() {
    var ENV = this;
    
    ENV.camera.rotation.order = "YXZ";
    ENV.camera.position.x = ENV.cameraX;
    ENV.camera.position.y = ENV.cameraY;
    ENV.camera.position.z = ENV.cameraZ;
    ENV.camera.rotation.x = ENV.cameraPitch * (Math.PI / 180);
    ENV.camera.rotation.y = ENV.cameraYaw * (Math.PI / 180);
    ENV.camera.rotation.z = ENV.cameraRoll * (Math.PI / 180);    

    var renderer = ENV.renderer;
    if (ENV.stereo) {
        renderer = this.stereoEffect;
    }

    renderer.render(ENV.scene, ENV.camera);
    if (Detector.webgl) {
        renderer.render(this.hud.scene, this.hud.camera);
    }
    
    ENV.loop();
    for (var i = 0; i < ENV.gameObjects.length; i++) {	    
	ENV.gameObjects[i].update();
	//ENV.gameObjects[i].move();
    }
    // render the crosshair if available
    /*
    if (this.crosshair) {
        var zCamVec = new THREE.Vector3(0,0,-0.3); 
        var position = this.camera.localToWorld(zCamVec);
        this.crosshair.position.set(position.x, position.y, position.z); 
        this.crosshair.lookAt(this.camera.position);
    }
    */

    if (this.preload) {
        // in preload mode, update as fast as we can
        if (this.stereo) {
            this.vrDisplay.requestAnimationFrame(Env.prototype.start.bind(this));
        } else {
            requestAnimationFrame(Env.prototype.start.bind(this));            
        }

    } else {
        setTimeout(function() {
            if (this.stereo) {
                this.vrDisplay.requestAnimationFrame(Env.prototype.start.bind(this));
            } else {
                requestAnimationFrame(Env.prototype.start.bind(this));            
            }
        }.bind(this), 1000 / 30);
    }
    //THREE.AnimationHandler.update( clock.getDelta() );
    
}

// Moves the camera along the path specified by pointsArray,
// the camera will be facing the endAngle
Env.prototype.moveCameraAlongPath = function(pointsArray, endAngle, callback) {
    var cameraMotionPath;
    if (pointsArray.length == 2) {
        // only 2 points, we use a LineCurve3            
        cameraMotionPath = new THREE.LineCurve3(
            pointsArray[0],pointsArray[1]
        );
    } else if (pointsArray.length == 3) {
        // 3 points, use a CubicCurve
        cameraMotionPath = new THREE.QuadraticBezierCurve3(pointsArray[0],pointsArray[1],pointsArray[2]);            
    } else {
        // we must have lots of points, use spline
        console.warn("spline points need to be implemented!");
    }

    // determine which direction to turn
    var startDirection = this.camera.rotation.toVector3().clone();                  
    var endDirection = endAngle.clone();
    
    startDirection.x %= Math.PI*2; startDirection.y %= Math.PI*2; startDirection.z %= Math.PI*2;        
    endDirection.x %= Math.PI*2; endDirection.y %= Math.PI*2; endDirection.z %= Math.PI*2;                                    
    
    if (Math.abs(startDirection.y-endDirection.y) > Math.PI) {
        if (startDirection.y < endDirection.y) {
            startDirection.y += Math.PI*2;
        } else {
            endDirection.y += Math.PI*2;
        }
    }

    var cameraDirectionPath = new THREE.LineCurve3(
        startDirection, endDirection
    );
    
    this.moveCameraAlongPathHelper(cameraMotionPath, cameraDirectionPath, callback, 0);
}

// path to follow
// t between 0 and 1
Env.prototype.moveCameraAlongPathHelper = function(motionPath, directionPath, callBack, t) {
    if (t === undefined) t = 0;
    var speed = 0.01;
    var nextPos = motionPath.getPoint(t);
    var nextDir = directionPath.getPoint(t);
    this.cameraX = nextPos.x;
    this.cameraY = nextPos.y;
    this.cameraZ = nextPos.z;
    this.cameraPitch = nextDir.x;
    this.cameraYaw = nextDir.y;
    var self = this;
    if (t+speed < 1) {
        setTimeout(function() {
            self.moveCameraAlongPathHelper(motionPath, directionPath, callBack, t+speed);
        }, 16);
    } else {
        if (callBack) {
            callBack.call();
        }
    }
}

Env.prototype.setCameraPosition = function(cameraPosition) {
    this.cameraX = cameraPosition.x;
    this.cameraY = cameraPosition.y;
    this.cameraZ = cameraPosition.z;        
}

Env.prototype.setCameraRotation = function(cameraRotation) {
    this.cameraPitch = cameraRotation.x;
    this.cameraYaw = cameraRotation.y;
    this.cameraRoll = cameraRotation.z;    
}

Env.prototype.setCameraXYZ = function(x, y, z) {
    this.cameraX = x;
    this.cameraY = y;
    this.cameraZ = z;
}

Env.prototype.setCameraPitch = function(pitch) {
    this.cameraPitch = pitch;
}

Env.prototype.setCameraYaw = function(yaw) {
    this.cameraYaw = yaw;
}

Env.prototype.setCameraRoll = function(roll) {
    this.cameraRoll = roll;
}

Env.prototype.getCameraYaw = function() {
    return this.cameraYaw;
}

Env.prototype.getCameraPitch = function() {
    return this.cameraPitch;
}

Env.prototype.getCameraX = function() {
    return this.camera.position.x;
}

Env.prototype.getCameraY = function() {
    return this.camera.position.y;
}

Env.prototype.getCameraZ = function() {
    return this.camera.position.z;
}

var lwjglKey = {37:203, 38:200, 39:205, 40:208};
Env.prototype.getKey = function() {
    if (this.lastKey != 0) {
        //console.log("getkey called "+this.lastKey);
        var key = lwjglKey[this.lastKey] || this.lastKey
        this.lastKey = 0;
        return key;
    }
}

Env.prototype.getKeyDown = function() {
    if (arguments.length == 0)  {
        return this.lastKeyDown;
    } else {        
        //console.log(arguments[0], this.keys);
        return this.keys[arguments[0]];
    }
}


Env.prototype.isMouseGrabbed = function() {
    return this.mouseGrab;
}

Env.prototype.setMouseGrab = function(grab) {
    this.mouseGrab = grab;
}

Env.prototype.getMouseButtonDown = function() {
    return this.mouse['0'];
}

Env.prototype.getMouseButtonClicked = function() {
    var lastMouse = this.lastMouse;
    this.lastMouse = -1;
    return lastMouse;
}

Env.prototype.getMouseDX = function() {
    return this.mouseDX;
}

Env.prototype.getMouseDY = function() {
    return this.mouseDY;
}

Env.prototype.getMouseX = function() {
    return this.mouseX;
}

Env.prototype.getMouseY = function() {
    return this.mouseY;
}

Env.prototype.setDisplayStr = function(str) {
    //console.log("displaying "+str);
    this.hud.write(str);
}

Env.prototype.getObject = function(objClass) {
    for (var i=0; i<this.gameObjects.length; i++) {
        var obj = this.gameObjects[i];
        if (obj instanceof objClass) {
            return obj;
        }        
    }
}

//@todo: need to make this more efficient
Env.prototype.getObjects = function() {
    var gameObjectsArrayList = new java.util.ArrayList();    
    for (var i=0; i<this.gameObjects.length; i++) {
        if (arguments && arguments.length == 1) {
            if (this.gameObjects[i] instanceof arguments[0]) {
                gameObjectsArrayList.add(this.gameObjects[i]);
            }
        } else {
            gameObjectsArrayList.add(this.gameObjects[i]);            
        }
    }    
    return gameObjectsArrayList;
}

// Returns a list of objects projected from
// x and y screen coordinates
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var pickObjects = [];
Env.prototype.getPick = function(x, y) {
    // convert to 3D coordinates
    pickObjects.length = 0;

    if (x && y) {
        mouse.x = ( x / window.innerWidth ) * 2 - 1;
        mouse.y = - ( y / window.innerHeight ) * 2 + 1;
    } else {
        mouse.x = 0;
        mouse.y = 0;
    }
    
    raycaster.setFromCamera(mouse, this.camera);

    var camera = this.camera;
    this.gameObjects.forEach(function(obj) {
        var intersects = raycaster.intersectObjects(obj.mesh.children);
        if (intersects.length > 0) {
            // for each object, we calculate the distance to the camera
            pickObjects.push({
                dist: camera.position.distanceTo(obj.mesh.position),
                obj: obj
            });
        }
    });
    
    // finds the closest to the camera    
    if (pickObjects.length > 0) {
        pickObjects.sort(function(a,b){return a.dist - b.dist});
        return pickObjects[0].obj;
    }
    
    return null;
}

// Allow accelerometer to control camera's pitch, yaw, and roll
// and render using stereo effect
Env.prototype.initVRController = function() {

    this.setCrosshair(true);
    
    var angle = new THREE.Euler();
    var q = new THREE.Quaternion();
    var data = new VRFrameData();
    this.vrDisplay = null;
    var env = this;

    navigator.getVRDisplays().then(function(displays) {
        console.log("Setting vrDisplay");
        if (displays.length > 0) {
            this.vrDisplay = displays[0];
            //vrDisplay.resetPose();
            this.vrDisplay.requestAnimationFrame(this.vrAnimationFrame.bind(this));
        } else {
            console.warn('no vr displays found');
        }
    }.bind(this)).catch(function(err) {
        console.log("Error with VR displays",err);
    });

    function fsEvent(e) {
        var fselem = document.fullscreenElement ||
                     document.webkitFullscreenElement ||
                     document.mozFullscreenElement;
        if (fselem) {
            document.getElementById("vr").setAttribute("fullscreen", true);
            env.stereo = true;
            env.stereoEffect.setSize(window.clientWidth, window.clientHeight, false);
            env.camera.aspect = window.clientWidth / window.clientHeight;
            camera.updateProjectionMatrix();
        } else {
            document.getElementById("vr").removeAttribute("fullscreen");
            env.stereo = false;
        }
    }
    
    document.addEventListener("webkitfullscreenchange", fsEvent);
    document.addEventListener("mozfullscreenchange", fsEvent);
    document.addEventListener("fullscreenchange", fsEvent);
    document.getElementById("vr").addEventListener('click', function(e) {
        env.stereo = !env.stereo;
        this.vrDisplay.requestPresent([{source: document.querySelector('#env3d canvas')}]);
        if (env.stereo) {
            document.getElementById("vr").setAttribute("fullscreen", true);            
        } else {
            env.stereoEffect.setSize(window.clientWidth, window.clientHeight, false);            
        }
        /*
        var elem = document.body;
        var fs = elem.requestFullScreen || elem.webkitRequestFullScreen || elem.mozRequestFullScreen;
        if (fs) {
            fs.bind(elem).call();
        } else {
            // safari mobile doesn't have fullscreen api
            env.stereo = !env.stereo;
            window.dispatchEvent(new Event('resize'));
        }
        */
    }.bind(this));

    // Attach vrAnimationFrame to the env object so it can be called later
    this.vrAnimationFrame = function() {
        this.vrDisplay.getFrameData(data);
        q.set(data.pose.orientation[0],
              data.pose.orientation[1],
              data.pose.orientation[2],
              data.pose.orientation[3]);
        
        angle.setFromQuaternion(q, 'YXZ');            
        
        var yaw = angle.y * 180/Math.PI;
        var pitch = angle.x * 180/Math.PI;
        var roll = angle.z * 180/Math.PI;                 
        env.setCameraYaw(yaw);
        env.setCameraPitch(pitch);
        env.setCameraRoll(roll);
        this.vrDisplay.requestAnimationFrame(this.vrAnimationFrame);
    }.bind(this);        
}

var crosshair;
Env.prototype.setCrosshair = function(enabled) {
    if (!crosshair) {
        var material = new THREE.LineBasicMaterial({
            linewidth: 2,
            color: 0xFFFFFF,
            depthTest: false
        }); 
        
        // crosshair size
        var x = 1, y = 1;
        
        var geometry = new THREE.Geometry(); 

        // crosshair
        geometry.vertices.push(new THREE.Vector3(0, y, 0)); 
        geometry.vertices.push(new THREE.Vector3(0, -y, 0));
        geometry.vertices.push(new THREE.Vector3(0, 0, 0)); 
        geometry.vertices.push(new THREE.Vector3(x, 0, 0));     
        geometry.vertices.push(new THREE.Vector3(-x, 0, 0)); 

        crosshair = new THREE.Line( geometry, material );

        // place it in the center 
        var crosshairPercentX = 50; 
        var crosshairPercentY = 50; 
        var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1; 
        var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1; 

        crosshair.renderOrder = Number.MAX_SAFE_INTEGER;
        crosshair.position.x = crosshairPositionX * this.camera.aspect; 
        crosshair.position.y = crosshairPositionY; 

        crosshair.position.z = -100;
    }
    
    if (enabled) {
        this.crosshair = crosshair;
        this.camera.add(this.crosshair);
        //this.scene.add(this.crosshair);
    } else {
        this.camera.remove(this.crosshair);
        //if (this.crosshair) this.scene.remove(this.crosshair);        
        this.crosshair = null;        
    }
}

// The user will override this method to put in custom code
Env.prototype.loop = function() {}

// Compatibility with jme version, not functional
Env.prototype.advanceOneFrame = function() {}

// This is prepeneded to all
// access to textures/ models/ and sounds/
Env.baseAssetsUrl = "";

module.exports = Env;

// We create the env3d object, which will be "exported"
// Since we are including it in HTML, we allow it
// to be created under window
window['env3d'] = {};
window['env3d'].Env = Env;

var EnvObject = require('./EnvObject.js');
window['env3d'].EnvObject = EnvObject;


