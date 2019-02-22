import {default as JSZip} from '../node_modules/jszip/dist/jszip.min.js';
import {default as JSZipUtils} from '../node_modules/jszip-utils/dist/jszip-utils.min.js';

class ZipManager extends THREE.LoadingManager {
    
    constructor() {
        super();
        this.assets = {};        

        this.setURLModifier( ( url ) => {
            //console.log('loading manager ' +decodeURI(url));
            let dataUrl = this.assets[decodeURI(url)];
            return dataUrl ? dataUrl : url;
            
        } );
    }
}

// Initialize loading manager with URL callback.
var objectURLs = [];

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

// Custom loading manager
GameObject.loadingManager = new ZipManager(); 
THREE.DefaultLoadingManager = GameObject.loadingManager;

GameObject.mtlLoader = new THREE.MTLLoader();
GameObject.objLoader = new THREE.OBJLoader();
GameObject.fbxLoader = new THREE.FBXLoader();
GameObject.daeLoader = new THREE.ColladaLoader();
GameObject.textureLoader = new THREE.TextureLoader();
GameObject.textureLoader.crossOrigin = 'Anonymous';


GameObject.standardFbxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.82,
    roughness: 1.00,
    vertexColors: THREE.VertexColors,
    side: THREE.DoubleSide
});

GameObject.modelsCache = {};
GameObject.texturesCache = {};

GameObject.loadObj = function (model, mtl, callback) {
    // Convert to full path if necessary
    if (!model.startsWith('http')) {
        model = env3d.Env.baseAssetsUrl+model;
    }
    if (mtl && !mtl.startsWith('http')) {
        mtl = env3d.Env.baseAssetsUrl+mtl;
    }
    
    if (GameObject.modelsCache[model]) {
        callback.call(null,GameObject.modelsCache[model]);
    } else {
        if (model.endsWith('zip')) {
            JSZipUtils.getBinaryContent(model, function(err, data) {
                let z = new JSZip();
                z.loadAsync(data).then(function(zip) {
                    //console.log(zip.files);
                    // figure out if we have a .dae or .obj
                    var daeFile = null, objFile = null, mtlFile = null;
                    Object.keys(zip.files).forEach( f => {
                        // need to skip stupid osx finder files
                        if (!f.includes('__MACOSX')) {
                            if (f.endsWith('obj')) objFile = f;
                            if (f.endsWith('mtl')) mtlFile = f;
                            if (f.endsWith('dae')) daeFile = f;
                        }
                    });
                    
                    if (objFile && mtlFile) {
                        // We have a tinkercad file                        
                        zip.file(mtlFile).async('string').then((mtl) => {
                            zip.file(objFile).async('string').then((f) => {
                                // f is the text version of the file
                                let materials = GameObject.mtlLoader.parse(mtl);
                                materials.preload();
                                // fix the kd from obj for compatibility
                                Object.values(materials.materials).forEach( m => {
                                    m.color.multiplyScalar(env3d.Env.objDiffuseMultiplier);
                                });                            
                                let m = GameObject.objLoader.setMaterials(materials).parse(f);
                                //console.log('model loaded from zip', m);
                                GameObject.modelsCache[model] = m;                            
                                callback.call(null, m);
                            });                        
                        });
                    } else if (daeFile) {
                        // we have a sketchup collada export
                        console.log('processing collada ',daeFile);

                        // If the daeFile is in a subfolder, we get the path
                        let dir = daeFile.substr(0, daeFile.lastIndexOf('/'));
                        // add the trailing /
                        if (dir.length > 0) dir += '/';
                        
                        zip.file(daeFile).async('string')
                           .then((dae) => {
                               let assetPromises = [];

                               // preload all the images
                               Object.keys(zip.files).filter(
                                   //f => f.includes('/')
                                   f => !f.endsWith('dae') && !zip.files[f].dir
                               ).forEach( f => {
                                   // put all the loading promises into an array
                                   assetPromises.push(
                                       zip.file(f).async('base64').then(
                                           data => {
                                               return new Promise(function(resolve, reject) {
                                                   // http://www.jstips.co/en/javascript/get-file-extension/ 
                                                   var extension = f.slice( ( f.lastIndexOf( '.' ) - 1 >>> 0 ) + 2 ); 
                                                   extension = extension.toLowerCase();
                                                   // strip the directory
                                                   let fileKey = f;
                                                   if (f.indexOf(dir) > -1) fileKey = f.substr(f.indexOf(dir)+dir.length);
                                                   //console.log(dir, fileKey);
                                                   resolve([fileKey,`data:image/${extension};base64,${data}`]);
                                               });
                                           })
                                   );
                               });
                               Promise.all(assetPromises).then( (assets) => {
                                   // Only proceed when all the images are loaded
                                   // keep a cache of all images
                                   assets.forEach( asset => GameObject.loadingManager.assets[asset[0]] = asset[1] );
                                   let m = GameObject.daeLoader.parse(dae);
                                   GameObject.modelsCache[model] = m.scene;
                                   function traverseMaterial(model) {
                                       if (model.material) {
                                           if (!Array.isArray(model.material)) {
                                               model.material.color.multiplyScalar(env3d.Env.daeDiffuseMultiplier);
                                           } else {
                                               model.material.forEach(
                                                   m => m.color.multiplyScalar(env3d.Env.daeDiffuseMultiplier)
                                               );
                                           }
                                       }
                                       model.children.forEach( c => traverseMaterial(c) );
                                   }
                                   traverseMaterial(m.scene);
                                   callback.call(null, m.scene);                                   
                               });
                           });
                    }
                });
            });
            
        } else if (model.endsWith('obj')) {
            if (mtl) {
                // load mtl if it is specified                
                var mtlLoader = GameObject.mtlLoader;
                mtlLoader.setMaterialOptions({side: THREE.DoubleSide});
                mtlLoader.load(mtl, function(materials) {
                    materials.preload();
                    // fix the kd from obj for compatibility
                    Object.values(materials.materials).forEach( m => {
                        m.color.multiplyScalar(env3d.Env.objDiffuseMultiplier);
                    });
                    //console.log('loading mtl', materials);
                    //var objLoader = GameObject.objLoader;
                    var objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load(model, function(m) {
                        GameObject.modelsCache[model] = m;            
                        callback.call(null, m);
                    });            
                });
            } else {
                // Without MTL file
                GameObject.objLoader.load(model, function(m) {
                    GameObject.modelsCache[model] = m;            
                    callback.call(null, m);
                });            
            }
        } else if (model.endsWith('fbx')) {
            //console.log('loading', GameObject.fbxLoader);
            GameObject.fbxLoader.load(model, function(m) {                
                GameObject.modelsCache[model] = m;                
                callback.call(null, m);
            });            
        } else if (model.endsWith('dae')) {
            GameObject.daeLoader.load(model, function(m) {
                GameObject.modelsCache[model] = m.scene;
                callback.call(null, m.scene);
            });
        }
    }

}

GameObject.loadTexture = function(texture, callback) {
    
    if (!texture) return;
    
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
    if (typeof gameobj.texture === 'undefined') {
        gameobj.texture = "textures/earth.png";
    }
    if (typeof gameobj.model === 'undefined') {
        gameobj.model = "sphere";
    }
    
    if (!gameobj.move) gameobj.move = function() {};
    
    gameobj._texture = gameobj.texture;
    gameobj._model = "";
    if (gameobj.model === "sphere") {
        gameobj._model = gameobj.model;
    }

    var self = gameobj;
    
    gameobj.geometry = new THREE.SphereGeometry( 1, 16, 16, -Math.PI/2, Math.PI*2, 0, Math.PI );    
    gameobj.mesh = new THREE.Group();
    gameobj.mesh.rotation.order = "YXZ";
    gameobj.mesh.add(new THREE.Mesh( gameobj.geometry, gameobj.material ));
    
    gameobj.mesh.name = gameobj.model;
    gameobj.mesh.envGameObject = gameobj;

    GameObject.loadTexture(gameobj.texture, function(texture) {
        self.material = new THREE.MeshBasicMaterial({map:texture, side:THREE.DoubleSide});
        
        gameobj.mesh.children.forEach(function(c) {
            c.material = gameobj.material;	    
	    c.envGameObject = self;
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
            
            if (gameobj.model.endsWith('json')) {
                // JSON file, needs alternative processing
                // first fetch the json file

                fetch(gameobj.model).then( res => {
                    return res.json();
                }).then(json => {                    
                    //console.log('loading custom json asset', gameobj.model);
                    gameobj.mesh.children.length = 0;
                    let dir = gameobj.model.slice(0, gameobj.model.lastIndexOf('/')+1);
                    json.Components.forEach( c => {
                        let cmodel = dir+c.Asset; 
                        GameObject.loadObj(cmodel, null, o => {                            
                            //console.log('loaded', o);
                            let clone = o.clone();
                            clone.position.set(c.Offset[0], c.Offset[1], c.Offset[2]);
                            clone.scale.set(c.Scale[0], c.Scale[1], c.Scale[2]);                            
                            clone.rotation.set(c.Rotation[0] * Math.PI / 180,
                                               c.Rotation[1] * Math.PI / 180,
                                               c.Rotation[2] * Math.PI / 180,
                                               "YXZ");
                            clone.children.forEach( c => {
                                c.material = GameObject.standardFbxMaterial;
                            });
			    
			    // If we have only one object, then allow it to be selectable
			    if (json.Components.length == 1) {
				clone.traverse( child => { child.envGameObject = gameobj } );
			    }
                            gameobj.mesh.add(clone);
                        });
                    });
                    
                });

                
            } else if (gameobj.model.endsWith('obj') ||
                       gameobj.model.endsWith('fbx') ||
                       gameobj.model.endsWith('zip') ||
                       gameobj.model.endsWith('dae') )
            {
                // Simple object files

                // first clear all the children
                gameobj.mesh.children.length = 0;
                
                // now load the object
                GameObject.loadObj(gameobj.model, gameobj.mtl, function(o) {
                    
                    o.children.forEach(function(c) {
			
                        if (gameobj.model.endsWith('fbx')) {
                            c.material = GameObject.standardFbxMaterial;
                        } else {
                            gameobj.material && (c.material = gameobj.material.clone());
                        }
                        
                        var clone = c.clone();
			clone.traverse( child => { child.envGameObject = gameobj } );
			clone.envGameObject = gameobj;
                        if (gameobj.model.endsWith('zip') || gameobj.model.endsWith('dae') ||
                            (gameobj.mtl && gameobj.model.indexOf('tinker.obj') > -1))
                        {
                            // if the mtl is present, we assume it's from tinkercad and
                            // perform automatic scaling and rotation
                            //console.log(clone);
                            clone.scale.x = 0.1;
                            clone.scale.y = 0.1;
                            clone.scale.z = 0.1;
                            clone.rotation.x = -(Math.PI/2);
                        }                        
                        gameobj.mesh.add(clone);
                    });                        
                });
            }
        }                                

    }
}


export default GameObject;
//module.exports = GameObject;
