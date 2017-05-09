THREE = require('three');
require('../node_modules/three/examples/js/loaders/OBJLoader.js');

var GameObject = function() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotateX = 0;
    this.rotateY = 0;
    this.rotateZ = 0;
    this.scale = 1;
    this.texture = "textures/earth.png";
    this.model = "sphere";
    
    GameObject.patchGameObject(this);
}   

GameObject.objLoader = new THREE.OBJLoader();
GameObject.textureLoader = new THREE.TextureLoader();
GameObject.textureLoader.crossOrigin = 'Anonymous';

GameObject.modelsCache = {};
GameObject.texturesCache = {};

GameObject.loadObj = function (model, callback) {
    if (!model.startsWith('http')) {
        model = env3d.Env.baseAssetsUrl+model;
    }
    if (GameObject.modelsCache[model]) {
        callback.call(null,GameObject.modelsCache[model]);
    } else {
        GameObject.objLoader.load(model, function(m) {
            GameObject.modelsCache[model] = m;
            callback.call(null, m);
        });
    }
}
GameObject.loadTexture = function(texture, callback) {
    if (!texture.startsWith('http')) {
        texture = env3d.Env.baseAssetsUrl+texture;
    }
    if (GameObject.texturesCache[texture]) {
        callback.call(null,GameObject.texturesCache[texture]);
    } else {
        GameObject.textureLoader.load(texture, function(t) {
            GameObject.texturesCache[texture] = t;
            callback.call(null, t);
        });
    }
}

GameObject.patchGameObject = function patchFun(gameobj) {
    if (!gameobj.x) gameobj.x = 0;
    if (!gameobj.y) gameobj.y = 0;
    if (!gameobj.z) gameobj.z = 0;
    if (!gameobj.rotateX) gameobj.rotateX = 0;
    if (!gameobj.rotateY) gameobj.rotateY = 0;
    if (!gameobj.rotateZ) gameobj.rotateZ = 0;
    if (!gameobj.scale) gameobj.scale = 1;
    if (!gameobj.texture) gameobj.texture = "textures/earth.png";
    if (!gameobj.model) gameobj.model = "sphere"
    if (!gameobj.move) gameobj.move = function() {};
    
    gameobj._texture = gameobj.texture;
    gameobj._model = "";
    if (gameobj.model === "sphere") {
        gameobj._model = gameobj.model;
    }

    gameobj.geometry = new THREE.SphereGeometry( 1, 16, 16 );
    // have to remap the uv to map things properly
    // http://stackoverflow.com/questions/21663923/mapping-image-onto-a-sphere-in-three-js
    var faceVertexUvs = gameobj.geometry.faceVertexUvs[ 0 ];    
    for ( i = 0; i < faceVertexUvs.length; i ++ ) {   
	var uvs = faceVertexUvs[ i ];
	for ( var j = 0; j < 3; j ++ ) {
            uvs[j].x += 0.25;
	}
    }
    gameobj.material = new THREE.MeshBasicMaterial();

    var self = gameobj;
    
    gameobj.mesh = new THREE.Group();
    gameobj.mesh.rotation.order = "YXZ";
    gameobj.mesh.add(new THREE.Mesh( gameobj.geometry, gameobj.material ));
    gameobj.mesh.name = gameobj.model;
    gameobj.mesh.envGameObject = gameobj;

    GameObject.loadTexture(gameobj.texture, function(texture) {
        self.material = new THREE.MeshBasicMaterial({map:texture, side:THREE.DoubleSide});
        gameobj.mesh.children.forEach(function(c) {
            c.material = gameobj.material;
        });
        
    });

    gameobj.update = function() {

	gameobj.mesh.position.x = gameobj.x;
	gameobj.mesh.position.y = gameobj.y;
	gameobj.mesh.position.z = gameobj.z;

	gameobj.mesh.rotation.x = gameobj.rotateX * (Math.PI/180);
	gameobj.mesh.rotation.y = gameobj.rotateY * (Math.PI/180);
	gameobj.mesh.rotation.z = gameobj.rotateZ  * (Math.PI/180);

	gameobj.mesh.scale.x = gameobj.scale;
	gameobj.mesh.scale.y = gameobj.scale;
	gameobj.mesh.scale.z = gameobj.scale;        
        
	if (gameobj.texture != gameobj._texture) {
	    gameobj._texture = gameobj.texture;
            GameObject.loadTexture(gameobj.texture, function(texture) {
                var newMaterial = new THREE.MeshBasicMaterial({map:texture, side:THREE.DoubleSide});
                //gameobj.mesh.material = newMaterial;
                gameobj.material = newMaterial;
                gameobj.mesh.children.forEach(function(c) {
                    c.material = newMaterial;
                });
            });
	}

        // model will change the geometry
	if (gameobj.model != gameobj._model) {
            gameobj.mesh.name = gameobj.model;
	    gameobj._model = gameobj.model;
            if (!gameobj.mtl) {
                if (gameobj.model.search("obj") > -1) {
                    gameobj.mesh.children.forEach(function(c) {
                        gameobj.mesh.remove(c);
                    });
                    
                    //objLoader.load(gameobj.model, function(o) {
                    GameObject.loadObj(gameobj.model, function(o) {

                        o.children.forEach(function(c) {
                            c.material = gameobj.material.clone();
                            gameobj.mesh.add(c.clone());
                        });                        
                    });
                }
            }                                
	}
    }
}

module.exports = GameObject;
