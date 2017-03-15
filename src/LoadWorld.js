
// Setup a world from the world.txt file
module.exports = function setupWorld(worldFile) {
    
    var self = this;             
    var dynamicClasses = {};
    var models = [];

    var parseLine = function(line) {
        console.log(line);
        var tokens = line.split(',');
        switch(tokens[0]) {
            case 'skybox':
                self.setSky(tokens[1]);
                break;
            case 'camera':                                 
                self.cameraX = parseFloat(tokens[1]);
                self.cameraY = parseFloat(tokens[2]);
                self.cameraZ = parseFloat(tokens[3]);                                 
                self.cameraPitch = parseFloat(tokens[5]);
                self.cameraYaw = parseFloat(tokens[4]);
                break;
            case 'terrain':
                self.setTerrain(tokens[3]);
                break;
            case 'object':
                var objClass = tokens[10];
                // Keep a list of all the classes that is required for the scene
                //console.log("Creating GameObject of class "+objClass);
                //var gameObject = eval('new '+objClass+'()');                                 
                var gameObject = new window[objClass](
                    parseFloat(tokens[1]),
                    parseFloat(tokens[2]),
                    parseFloat(tokens[3])
                );
                // Keep the model in a list so we can preload them
                dynamicClasses[objClass] = 1;
                gameObject.scale = parseFloat(tokens[4]);
                gameObject.rotateX = parseFloat(tokens[5]);
                gameObject.rotateY = parseFloat(tokens[6]);
                gameObject.rotateZ = parseFloat(tokens[7]);
                gameObject.model = tokens[8];
                gameObject.texture = tokens[9];
                self.addObject(gameObject);
            default:
                //console.warn('unable to parse line',line);
        }                 
    }

    var preload = (function() {
        // create a dummy object and assign it each model from each class
        var i = 0;
        var obj = {x:5,y:5,z:5,texture:"textures/black.png"};
        self.addObject(obj);
        console.log("preload", obj);
        
        // preload all the models into video memory by running assigning it
        // into a dummy object for display
        self.preload = true;             
        return function() {                 
            if (i < models.length-1) {
                obj.model = models[i++];
                // might as well display the percentage
                self.setDisplayStr(parseInt(i / models.length * 100) + "%");
            } else {
                self.removeObject(obj);
                self.preload = false;
                console.log("env3dready");
                self.setDisplayStr("");
                window.dispatchEvent(new Event("env3dready"));                
            }
        }
    })();


    // Fetch the world.txt file and process it, fires the env3dready event once everything is loaded
    var client = new XMLHttpRequest();
    client.open('GET', worldFile);
    client.onreadystatechange = function(state) {
        if (client.readyState == 4) {
            // parse the csv file
            var lines = client.responseText.split('\n');
            lines.forEach(function(line, index, array) {
                
                parseLine(line);
                
                if (index == array.length-1) {
                    // we are done loading the scene,
                    // now we load all the models from all the dynamicClasses
                    console.log("preload", Object.keys(dynamicClasses));
                    Object.keys(dynamicClasses).forEach(function(animatedModel) {
                        var m = new window[animatedModel]();
                        console.log("preload", m);                                 
                        (m.modelsMap ? m.modelsMap.values().toArray() : [[m.model]]).forEach(function(list) {
                            console.log("preload",list);
                            list.forEach(function(model){
                                console.log("preload",model);
                                models.push(model);
                            });
                        });
                    });

                    self.loop = preload;
                    // start self with the preload phase
                    self.start();
                }                 
            });
        }
    } 
    client.send();             
}
