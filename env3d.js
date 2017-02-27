Env = function() {

    // Create ENV as this to preserve scope
    var ENV = this;
    
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
    this.camera.position.x = this.cameraX = 5;
    this.camera.position.y = this.cameraY = 5;
    this.camera.position.z = this.cameraZ = 12;

    this.camera.rotation.x = this.cameraPitch = 0;
    this.camera.rotation.y = this.cameraYaw = 0;

    this.defaultControl = true;

    this.scene = new THREE.Scene();
    this.scene.add(this.camera);

    this.gameObjects = [];
    
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor(0x00008f);

    var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
    light.position.set( 0, -4, -4 ).normalize();
    //this.scene.add( light );

    // Attach to the body, taking over the entire window
    // @todo: want to attach to an element, maybe create custom element
    document.body.appendChild(ENV.renderer.domElement);    
    
    // A debug print of the current camera position and rotation
    this.debugCameraPosition = function() {
        var positionString = this.camera.position.x+","+this.camera.position.y+","+this.camera.position.z;
        var rotationString = this.camera.rotation.x+","+this.camera.rotation.y+","+this.camera.rotation.z;
        return "[new THREE.Vector3("+positionString+"), new THREE.Vector3("+rotationString+")]";
    }
    
    this.setDefaultControl = function(control) {
	if (control) {
	    // test the FPS controls
	    document.onmousedown = function(e) {
		ENV.lastMousePosition = [e.pageX, e.pageY];
		ENV.mouseControl = true;
	    }
	    document.onmousemove = function(e) {
		if (ENV.mouseControl) {
		    var deltaY = 0.01*(ENV.lastMousePosition[1]-e.pageY);
		    ENV.cameraPitch += deltaY;
		    var deltaX = 0.01*(ENV.lastMousePosition[0]-e.pageX);
		    ENV.cameraYaw += deltaX;
		    //	    console.log(deltaX + " " + deltaY);
		    ENV.lastMousePosition = [e.pageX, e.pageY];
		}	
	    }
	    document.onmouseup = function(e) {
		ENV.mouseControl = false;
	    }
            
            var speed = 50;
	    document.onkeydown = function(e) {
		var e = window.event || e;
		
		if (e.keyCode == 87) { //W
		    ENV.cameraZ -= speed*Math.cos(ENV.cameraYaw);
		    ENV.cameraX -= speed*Math.sin(ENV.cameraYaw);
		} else if (e.keyCode == 83) { //S
		    ENV.cameraZ += speed*Math.cos(ENV.cameraYaw);
		    ENV.cameraX += speed*Math.sin(ENV.cameraYaw);
		} else if (e.keyCode == 65) { //A
		    ENV.cameraZ += speed*Math.sin(ENV.cameraYaw);
		    ENV.cameraX -= speed*Math.cos(ENV.cameraYaw);
		} else if (e.keyCode == 68) { //D
		    ENV.cameraZ -= speed*Math.sin(ENV.cameraYaw);
		    ENV.cameraX += speed*Math.cos(ENV.cameraYaw);
		} else if (e.keyCode == 32) { //SPACE
		    ENV.cameraY += speed;
		} else if (e.keyCode == 67) { //C
		    ENV.cameraY -= speed;
		}
	    }
	} else {
	    document.onmouseup = null;
	    document.onmousedown = null;
	    document.onmousemove = null;
	    document.onkeydown = null;
	}
    }
     
    this.setRoom = function(room) {
	for (var direction in room) {
	    if (direction.search("texture") > -1 && room[direction] != null) {		
		var wall = new THREE.PlaneGeometry(10,10);
		var wallMat = new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture(room[direction])} );		
		var wallMesh = new THREE.Mesh(wall, wallMat);
		wallMat.side = THREE.DoubleSide;
		this.scene.add(wallMesh);

		if (direction.search("North") > -1) {
		    wallMesh.position.x = 5;
		    wallMesh.position.y = 5;
		} else if (direction.search("East") > -1) {
		    wallMesh.rotation.y = Math.PI/2;
		    wallMesh.position.x = 10;
		    wallMesh.position.y = 5;
		    wallMesh.position.z = 5;
		} else if (direction.search("West") > -1) {
		    wallMesh.rotation.y = -Math.PI/2;
		    wallMesh.position.x = 0;
		    wallMesh.position.y = 5;
		    wallMesh.position.z = 5;
		} else if (direction.search("South") > -1) {
		    wallMesh.position.x = 5;
		    wallMesh.position.y = 5;
		    wallMesh.position.z = 10;
		} else if (direction.search("Bottom") > -1) {
                    wallMesh.rotation.x = -Math.PI/2;
		    wallMesh.position.x = 5;
		    wallMesh.position.z = 5;
		} else if (direction.search("Top") > -1) {
                    wallMesh.rotation.x = Math.PI/2;
		    wallMesh.position.x = 5;
		    wallMesh.position.z = 5;
		    wallMesh.position.y = 10;
		}
	    }
	}
    }
   
    this.addObject = function(obj) {

        if (obj instanceof GameObject) {
	    ENV.scene.add(obj.mesh);
        } else {
            console.log("patching obj");
            patchGameObject(obj);
	    ENV.scene.add(obj.mesh);            
        }
	ENV.gameObjects.push(obj);
    }

    this.clearScene = function() {        
        ENV.gameObjects.forEach(function(obj) {
            console.warn("Clearing obj",obj);
            ENV.scene.remove(obj.mesh);
        });
        ENV.gameObjects = [];
        ENV.vertices = [];
    }
    
    var clock = new THREE.Clock();
    this.start = function() {
	requestAnimationFrame(ENV.start);
        THREE.AnimationHandler.update( clock.getDelta() );
        
	ENV.camera.rotation.order = "YXZ";
	ENV.camera.position.x = ENV.cameraX;
	ENV.camera.position.y = ENV.cameraY;
	ENV.camera.position.z = ENV.cameraZ;
	ENV.camera.rotation.x = ENV.cameraPitch;
	ENV.camera.rotation.y = ENV.cameraYaw;

	if (ENV.defaultControl == (document.onmousemove == null)) {
	    ENV.setDefaultControl(ENV.defaultControl);
	} 

	ENV.renderer.render(ENV.scene, ENV.camera);
	ENV.loop();
	for (var i = 0; i < ENV.gameObjects.length; i++) {	    
	    ENV.gameObjects[i].update();
	    ENV.gameObjects[i].move();
        }	
    }

    // Moves the camera along the path specified by pointsArray,
    // the camera will be facing the endAngle
    this.moveCameraAlongPath = function(pointsArray, endAngle, callback) {
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
    this.moveCameraAlongPathHelper = function(motionPath, directionPath, callBack, t) {
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
    
    this.setCameraPosition = function(cameraPosition) {
        this.cameraX = cameraPosition.x;
        this.cameraY = cameraPosition.y;
        this.cameraZ = cameraPosition.z;        
    }
    
    this.setCameraRotation = function(cameraRotation) {
        this.cameraPitch = cameraRotation.x;
        this.cameraYaw = cameraRotation.y;
    }
    
    // The user will override this method to put in custom code
    this.loop = function() {}
}

var objLoader = new THREE.OBJLoader();
var objMtlLoader = new THREE.MTLLoader();
var textureLoader = new THREE.TextureLoader();
var colladaLoader = new THREE.ColladaLoader();

function GameObject() {

    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotateX = 0;
    this.rotateY = 0;
    this.rotateZ = 0;
    this.scale = 1;
    this.texture = "textures/doty.gif";
    this.model = "sphere";

    patchGameObject(this);
}

function patchGameObject(gameobj) {

    if (!gameobj.x) gameobj.x = 0;
    if (!gameobj.y) gameobj.y = 0;
    if (!gameobj.z) gameobj.z = 0;
    if (!gameobj.rotateX) gameobj.rotateX = 0;
    if (!gameobj.rotateY) gameobj.rotateY = 0;
    if (!gameobj.rotateZ) gameobj.rotateZ = 0;
    if (!gameobj.scale) gameobj.scale = 1;
    if (!gameobj.texture) gameobj.texture = "textures/doty.gif";
    if (!gameobj.model) gameobj.model = "sphere";    
    
    gameobj._texture = gameobj.texture;
    gameobj._model = gameobj.model;

    gameobj.geometry = new THREE.SphereGeometry( 1 );
    gameobj.material = new THREE.MeshBasicMaterial();
    
    var self = gameobj;
    textureLoader.load(gameobj.texture, function(texture) {
        console.log("texture loaded");
        console.log(self);
        self.mesh.material = new THREE.MeshBasicMaterial({map:texture});
    });    

    gameobj.mesh = new THREE.Mesh( gameobj.geometry, gameobj.material );
    gameobj.mesh.name = gameobj.model;
    gameobj.mesh.envGameObject = gameobj;

    gameobj.update = function() {
	gameobj.mesh.position.x = gameobj.x;
	gameobj.mesh.position.y = gameobj.y;
	gameobj.mesh.position.z = gameobj.z;

	gameobj.mesh.rotation.x = gameobj.rotateX;
	gameobj.mesh.rotation.y = gameobj.rotateY;
	if (gameobj.model == "sphere") gameobj.mesh.rotation.y -= Math.PI/2;
	gameobj.mesh.rotation.z = gameobj.rotateZ;

	gameobj.mesh.scale.x = gameobj.scale;
	gameobj.mesh.scale.y = gameobj.scale;
	gameobj.mesh.scale.z = gameobj.scale;        
        
	if (gameobj.texture != gameobj._texture) {
	    gameobj._texture = gameobj.texture;
            textureLoader.load(gameobj.texture, function(texture) {
                var newMaterial = new THREE.MeshBasicMaterial({map:texture});
                self.mesh.material = newMaterial;
            });
	}

        // model will change the geometry
	if (gameobj.model != gameobj._model) {
            gameobj.mesh.name = gameobj.model;
	    gameobj._model = gameobj.model;
            if (!gameobj.mtl) {
                if (gameobj.model.search("obj") > -1) {
                    objLoader.load(gameobj.model, function(obj) {
                        self.mesh.geometry = obj.children[0].geometry;                
                    });
                } else if (gameobj.model.search("dae") > -1) {
                    colladaLoader.load(gameobj.model, function ( collada ) {

                        collada.scene.traverse( function ( child ) {

                            if ( child instanceof THREE.SkinnedMesh ) {

                                var animation = new THREE.Animation( child, child.geometry.animation );

                                self.animation = animation;
                                //camera.lookAt( child.position );

                            }

                        } );

                        ENV.scene.remove(self.mesh);                        
                        self.mesh = collada.scene;
                        
                        self.mesh.envGameObject = self;
                        console.log(self);
                        ENV.scene.add(self.mesh);

                    } );
                }
            } else {
                // mtl loading not working right now
                objMtlLoader.load(gameobj.model, gameobj.mtl, function(obj) {
                    console.log(self.model+" loaded");
                    console.log(obj);
                    self.mesh = obj;
                    ENV.scene.add(obj);
                });
            }                                 
	}

    }
    
    gameobj.move = function() {};

}

function Room() {
    this.textureNorth = "textures/fence1.jpg";
    this.textureEast = "textures/fence1.jpg";
//    this.textureSouth = "textures/fence1.jpg";
    this.textureSouth = null;
    this.textureWest = "textures/fence1.jpg";
    this.textureTop = "textures/fence0.jpg";
    this.textureBottom = "textures/floor.gif";

    this.width = 10;
    this.height = 10;
    this.depth = 10;
}


