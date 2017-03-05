var DefaultRoom = function() {
    this.textureNorth = "textures/fence1.png";
    this.textureEast = "textures/fence1.png";
    //    this.textureSouth = "textures/fence1.png";
    this.textureSouth = null;
    this.textureWest = "textures/fence1.png";
    this.textureTop = "textures/fence0.png";
    this.textureBottom = "textures/floor.png";

    this.width = 10;
    this.height = 10;
    this.depth = 10;
}

module.exports = DefaultRoom;
