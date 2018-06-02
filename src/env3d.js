import './three.js';
import '../node_modules/three/examples/js/renderers/SoftwareRenderer.js';
import '../node_modules/three/examples/js/renderers/Projector.js';
import '../node_modules/three/examples/js/effects/VREffect.js';
import '../node_modules/three/examples/js/loaders/OBJLoader.js';
import '../node_modules/three/examples/js/loaders/MTLLoader.js';
import '../node_modules/three/examples/js/loaders/FBXLoader.js';

// experimenting with water
import '../node_modules/three/examples/js/objects/Reflector.js';
import '../node_modules/three/examples/js/objects/Refractor.js';
import '../node_modules/three/examples/js/objects/Water2.js';

import {default as EnvGameObject} from './GameObject.js';
import {default as DefaultRoom} from './DefaultRoom.js';
import {default as Hud} from './hud.js';
import {default as Keyboard} from './lwjgl-keyboard.js';
import {default as DefaultControlHandlers} from './DefaultControlHandlers.js';
import {default as Stats} from './Stats.js';
import {default as Detector} from '../node_modules/three/examples/js/Detector.js';
import {default as LoadWorld} from './LoadWorld.js';
import {default as VideoSphere} from './VideoSphere.js';

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


    if (this.hud) this.camera.add(this.hud.mesh);
    
    let defaultControlHandlers = new DefaultControlHandlers(this);
    this.defaultControl = true;
    this.setDefaultControl(this.defaultControl);
    
    this.scene = new THREE.Scene();
    
    this.scene.add(this.camera);    
    
    this.room = new THREE.Group();
    this.scene.add(this.room);

    this.gameObjects = [];

    //Detector.webgl = false;
    if (Detector.webgl) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
    } else {
        this.renderer = new THREE.SoftwareRenderer();
    }

    // an object to store statistics such as framerate and number of triangles
    this.stats = new Stats(this.renderer);
    
    // Attach to the body, taking over the entire window
    // @todo: want to attach to an element, maybe create custom element
    this.canvas = this.renderer.domElement;
    document.querySelector('#env3d').appendChild(this.canvas);

    // Turn this on for stereo rendering
    if (THREE.VREffect) {
        this.vrEffect = new THREE.VREffect(this.renderer);
        this.renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
        this.vrEffect.setSize( window.innerWidth, window.innerHeight, false );        
        //this.vrEffect.setSize( this.canvas.clientWidth, this.canvas.clientHeight, false );
    }  else {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
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

    this.keys = {};    
    document.addEventListener('keyup', (function(e) {
        this.lastKey = e.keyCode;
        this.lastKeyDown = 0;
        this.keys[e.keyCode] = false;
    }).bind(this));

    document.addEventListener('keydown', (function(e) {
        this.lastKeyDown = e.keyCode;
        this.keys[e.keyCode] = true;
    }).bind(this));

}

// When we call start, determine if running in vr mode or not
Env.prototype.start = function(settings) {
        
    window.addEventListener('resize', onResize.bind(this));

    console.log('starting env3d ', settings);

    this.animateObjects();
    if (settings && settings.vr && navigator.getVRDisplays) {
        window.addEventListener('vrdisplaypresentchange', () => {
            console.log('vrDisplayChange');
            onResize.apply(this)
        });
        
        navigator.getVRDisplays().then(function(displays) {
            if (displays.length > 0) {
                console.log('VR Detected');
                // vrDisplay will be present
                this.vrDisplay = displays[0];            

                console.log('scheduling animation frame on display', this.vrDisplay);
                requestAnimationFrame(this.animate.bind(this));
                
                //requestAnimationFrame(this.animate.bind(this));
                document.querySelector('#vr').addEventListener('click', () => {
                    this.vrDisplay.requestPresent([{source: document.querySelector('#env3d canvas')}]);
                });
            } else {
                console.log('VR browser but no display, regular rendering');
                requestAnimationFrame(this.animate.bind(this));
                document.querySelector('#vr').addEventListener('click', () => {                    
                    console.log('fullscreen');
                    window.dispatchEvent(new Event('env3dRequestPresent'));
                });
            }
        }.bind(this)).catch(err => {
            console.log("Error with VR displays, revert to regular rendering",err);
            requestAnimationFrame(this.animate.bind(this));
        });        
    } else {
        console.log('non VR browser, normal rendering')
        requestAnimationFrame(this.animate.bind(this));        
    }
}

function onResize() {
    if (!onResize.resizeDelay) {
        onResize.resizeDelay = setTimeout(() => {
            onResize.resizeDelay = null;
            let w = window.innerWidth, h = window.innerHeight;
            console.log('resize to ', w, h);
            if (this.vrEffect) {
                this.vrEffect.setSize( w, h, false );
            } else {
                this.renderer.setSize(w, h);
            }
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
        }, 250);
    }        
}

Env.prototype.animate = function() {

    var ENV = this;
    
    ENV.camera.rotation.order = "YXZ";
    ENV.camera.position.x = ENV.cameraX;
    ENV.camera.position.y = ENV.cameraY;
    ENV.camera.position.z = ENV.cameraZ;
    ENV.camera.rotation.x = ENV.cameraPitch * (Math.PI / 180);
    ENV.camera.rotation.y = ENV.cameraYaw * (Math.PI / 180);
    ENV.camera.rotation.z = ENV.cameraRoll * (Math.PI / 180);    

    if (this.vrEffect) {
        this.vrEffect.render(ENV.scene, ENV.camera);
    } else {
        this.renderer.render(ENV.scene, ENV.camera);
    }
    
    if (this.vrDisplay) {
        this.vrDisplay.requestAnimationFrame(Env.prototype.animate.bind(this));
        this.vrController();        
    } else {
        requestAnimationFrame(Env.prototype.animate.bind(this));            
    }

    // collect stats if requested
    this.stats && this.stats.sample();
}

Env.prototype.animateObjects = function() {
    
    this.loop();
    for (var i = 0; i < this.gameObjects.length; i++) {	    
	this.gameObjects[i].update();
    }
    
    setTimeout(Env.prototype.animateObjects.bind(this), 1000/30);
}

var q = new THREE.Quaternion();
var angle = new THREE.Euler();
Env.prototype.vrController = function() {
    if (!this.data) this.data = new VRFrameData();
    if (!this.initYaw) this.initYaw = this.cameraYaw;
    
    this.vrDisplay.getFrameData(this.data);
    
    if (!this.data.pose.orientation) {
        console.warn('data.pose.orientation is null');
        return;
    }
    
    q.set(this.data.pose.orientation[0],
          this.data.pose.orientation[1],
          this.data.pose.orientation[2],
          this.data.pose.orientation[3]);
    
    angle.setFromQuaternion(q, 'YXZ');            
    
    var yaw = angle.y * 180/Math.PI;
    var pitch = angle.x * 180/Math.PI;
    var roll = angle.z * 180/Math.PI;                 
    this.setCameraYaw(this.initYaw + yaw);
    this.setCameraPitch(pitch);
    this.setCameraRoll(roll);
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
        document.addEventListener('keyup', this.keyuphandler, false);                
    } else {
        console.log('disabling control');
        document.removeEventListener('mousedown', this.mousedownhandler, false);
        document.removeEventListener('mousemove', this.mousemovehandler, false);
        document.removeEventListener('mouseup', this.mouseuphandler, false);
        document.removeEventListener('keydown', this.keydownhandler, false);
        document.removeEventListener('keyup', this.keyuphandler, false);        
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

    if ( !this.boxMesh) { 

        this.boxMesh = new THREE.Mesh(
            new THREE.BoxBufferGeometry( 1, 1, 1 ),
            new THREE.ShaderMaterial( { 
                uniforms: THREE.ShaderLib.cube.uniforms,
                vertexShader: THREE.ShaderLib.cube.vertexShader,
                fragmentShader: THREE.ShaderLib.cube.fragmentShader,
                side: THREE.BackSide,
                depthTest: true,
                depthWrite: false,
                fog: false
            } )
        );
        
        this.boxMesh.geometry.removeAttribute( 'normal' );
        this.boxMesh.geometry.removeAttribute( 'uv' );
        this.boxMesh.material.uniforms.tCube.value = textureCube;
        this.camera.add(this.boxMesh);
        this.boxMesh.scale.set(100,100,100);
        //this.scene.add(this.boxMesh);
    }
    
    console.log(textureCube);
    //this.scene.background = textureCube;
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
    if (obj instanceof EnvGameObject || obj instanceof EnvWater) {
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

// Moves the camera along the path specified by pointsArray,
// the camera will be facing the endAngle
Env.prototype.moveCameraAlongPath = function(pointsArray, speed, callback) {
    return new Promise(function(resolve, reject) {
        if (!speed) speed = 0.1;    
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
        
        this.moveCameraAlongPathHelper(cameraMotionPath, speed, ()=>{resolve()}, 0);        
    }.bind(this));
}

var nextPos = new THREE.Vector3();
// path to follow
// t between 0 and 1
Env.prototype.moveCameraAlongPathHelper = function(motionPath, speed, callBack, t) {
    if (t === undefined) t = 0;
    motionPath.getPointAt(t, nextPos);
    this.cameraX = nextPos.x;
    this.cameraY = nextPos.y;
    this.cameraZ = nextPos.z;
    var self = this;
    if (t+speed < 1) {
        setTimeout(function() {
            self.moveCameraAlongPathHelper(motionPath, speed, callBack, t+speed);
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

function createTimer() {
    let vertShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
    
    let fragShader = `
uniform float percent; 
varying vec2 vUv;

void main() {
  float t;
  //gl_FragColor = vec4(1, 1, 1, percent);
  if (percent < 0.25) {
    if (vUv.x > 0.5 && vUv.y > 0.5) { 
      t = 1.0;
    } else {
      t = 0.0;
    }
  } else if (percent < 0.5) {
    if (vUv.x > 0.5) {
      t = 1.0;
    } else {
      t = 0.0;
    }
  } else if (percent < 0.75) {
    if (vUv.x < 0.5 && vUv.y > 0.5) {
      t = 0.0;
    } else {
      t = 1.0;
    }
  } else {
    t = 1.0;
  }

  // https://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl#4275343 
  //float c = fract(sin(dot(vUv ,vec2(12.9898,78.233))) * 43758.5453) * 1.5;
//  float x = log( (abs(vUv.x - 0.5) / 0.5) * 2.718281828459 );
//  float y = log( (abs(vUv.y - 0.5) / 0.5) * 2.718281828459 );
//  float c = sqrt(pow(x, 2.0) + pow(y, 2.0));
//  float c = y;
  float x = vUv.x - 0.5;
  float y = vUv.y - 0.5;;
  float c = sqrt(pow(x, 2.0) + pow(y, 2.0));
  c *= pow(8.0, c);
  gl_FragColor = vec4(c, c, c, t);
  
}
`;

    this.percent = 1;
    this.setPercent = function(p) {
        this.material.uniforms.percent.value = p;
    }
    this.material = new THREE.ShaderMaterial({
        uniforms: { percent: {value: 0.4} },
        vertexShader: vertShader,
	fragmentShader: fragShader,
        transparent: true,
        vertexColors: true,
        depthTest: false,
        depthWrite: false
    });
    
    function ring() {
        let reticle = new THREE.Mesh(
            new THREE.RingBufferGeometry(0.07, 0.14, 15, 8, 0, Math.PI*2),
            //new THREE.PlaneGeometry(1,1),
            this.material
        );        
        reticle.renderOrder = Number.MAX_SAFE_INTEGER;
        reticle.position.set(0,0,-10);
        
        return reticle;
    }

    let group = new THREE.Group();
    group.add(ring.apply(this));
    group.name = 'timer bar';

    this.mesh = group;
    //return group;
}

// Displays an arc in the middle of the screen
// Good for VR timer
Env.prototype.setTimer = function(percent) {
    //console.log("displaying "+str);
    if (!this.timer) this.timer = new createTimer();
    if (percent > 0) {
        this.camera.add(this.timer.mesh);
        this.timer.setPercent(percent);
        //this.timer.material.uniforms.percent.value = percent;
    } else {
        // remove the timer ring
        this.camera.remove(this.timer.mesh);
    }
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

var crosshair;
Env.prototype.setCrosshair = function(enabled) {

    if (!crosshair) crosshair = createReticle(); //createCrosshair.apply(this);
    if (enabled) {
        this.crosshair = crosshair;
        this.camera.add(this.crosshair);
    } else {
        this.camera.remove(this.crosshair);
        //if (this.crosshair) this.scene.remove(this.crosshair);        
        this.crosshair = null;        
    }
}

function createReticle() {

    let reticle = new THREE.Object3D();
    reticle.renderOrder = Number.MAX_SAFE_INTEGER;
    reticle.position.set(0,0,-10);
    reticle.name = 'crosshair';

    reticle.add(new THREE.Mesh(
        new THREE.RingBufferGeometry(0.03, 0.05, 15),
        new THREE.MeshBasicMaterial({ color: 0xf9f9f9, depthTest: false, depthWrite: false})
    ));
    
    reticle.add(new THREE.Mesh(
        new THREE.RingBufferGeometry(0.05, 0.07, 15),
        new THREE.MeshBasicMaterial({ color: 0x0f0f0f, depthTest: false, depthWrite: false})
    ));

    reticle.children.forEach( c => {
        c.renderOrder = Number.MAX_SAFE_INTEGER;        
    });
    
    return reticle;
}

function createCrosshair() {
    var material = new THREE.LineBasicMaterial({
        linewidth: 2,
        color: 0xFFFFFF,
        depthTest: false,
        depthWrite: false
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

    let crosshair = new THREE.Line( geometry, material );

    // place it in the center 
    var crosshairPercentX = 50; 
    var crosshairPercentY = 50; 
    var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1; 
    var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1; 

    crosshair.renderOrder = Number.MAX_SAFE_INTEGER;
    crosshair.position.x = crosshairPositionX * this.camera.aspect; 
    crosshair.position.y = crosshairPositionY; 

    crosshair.position.z = -100;

    return crosshair;
}

// The user will override this method to put in custom code
Env.prototype.loop = function() {}

// Compatibility with jme version, not functional
Env.prototype.advanceOneFrame = function() {}

// This is prepeneded to all
// access to textures/ models/ and sounds/
Env.baseAssetsUrl = "";

// Allow user to control OBJ material color
// We need this to balance loading of models
Env.objDiffuseMultiplier = 1;

// module.exports = Env;

// We create the env3d object, which will be "exported"
// Since we are including it in HTML, we allow it
// to be created under window
window['env3d'] = {};
window['env3d'].Env = Env;

import {default as EnvObject} from './EnvObject.js';
import {default as EnvWater} from './EnvWater.js';

window['env3d'].EnvObject = EnvObject;
window['env3d'].advanced = {};
window['env3d'].advanced.EnvNode = EnvObject;
window['env3d'].advanced.EnvWater = EnvWater;
window['org.lwjgl.input.Keyboard'] = Keyboard;


