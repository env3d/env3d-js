// Code pen specific code to hide the ugly setup details

// First setup the VR controller

function initVRController(env) {
    
    var angle = new THREE.Euler();
    var q = new THREE.Quaternion();
    var data = new VRFrameData();
    var vrDisplay = null;

    navigator.getVRDisplays().then(function(displays) {
        console.log("Setting vrDisplay");
        vrDisplay = displays[0];
        vrDisplay.resetPose();

        this.vrAnimationFrame();
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
        } else {
            document.getElementById("vr").removeAttribute("fullscreen");
            env.stereo = false;
        }
    }
    
    document.addEventListener("webkitfullscreenchange", fsEvent);
    document.addEventListener("mozfullscreenchange", fsEvent);
    document.addEventListener("fullscreenchange", fsEvent);
    document.getElementById("vr").addEventListener('click', function(e) {
        var elem = document.body;
        var fs = elem.requestFullScreen || elem.webkitRequestFullScreen || elem.mozRequestFullScreen;
        fs.bind(elem).call();                 
    });
    
    this.vrAnimationFrame = function() {                 
        vrDisplay.getFrameData(data);                 
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
        vrDisplay.requestAnimationFrame(this.vrAnimationFrame);
    }.bind(this);    
}


// Start env
env3d.Env.baseAssetsUrl = "https://env3d.github.io/env3d-js/dist/";
var env = new env3d.Env();
env.start();

initVRController(this.env);
