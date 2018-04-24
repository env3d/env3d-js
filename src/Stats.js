
class Stats {
        
    constructor(renderer) {
        this._renderer = renderer;
        this._clock = new THREE.Clock();
        
        this._framerate = 0
        this._triangles = 0,
        this.domElement = document.createElement('div');
        
        this.domElement.style.position = 'fixed';
        this.domElement.style.top = 0;
        this.domElement.style.right = 0;
        this.domElement.style.backgroundColor = 'black';
        this.domElement.style.color = 'white';           
    }

    sample() {
        this._framerate = parseInt(1/this._clock.getDelta());
        this._triangles = this._renderer.info.render.triangles;
        this.domElement.innerHTML = this._framerate+' '+this._triangles;
    }
}

module.exports = Stats;
