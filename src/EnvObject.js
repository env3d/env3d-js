
(function (env3d) {
    /**
     *
     * @author Jmadar
     */
    var EnvObject = (function () {
        /**
         * Creates a new instance of EnvObject
         */
        function EnvObject() {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.scale = 0;
            this.rotateX = 0;
            this.rotateY = 0;
            this.rotateZ = 0;
            this.transparent = false;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.rotateX = 0;
            this.rotateY = 0;
            this.rotateZ = 0;
            this.scale = 1;
            this.texture = "textures/earth.png";
            this.model = "sphere";
            this.transparent = false;
        }
        EnvObject.prototype.getX = function () {
            return this.x;
        };
        EnvObject.prototype.setX = function (x) {
            this.x = x;
        };
        EnvObject.prototype.getY = function () {
            return this.y;
        };
        EnvObject.prototype.setY = function (y) {
            this.y = y;
        };
        EnvObject.prototype.getZ = function () {
            return this.z;
        };
        EnvObject.prototype.setZ = function (z) {
            this.z = z;
        };
        EnvObject.prototype.getRotateX = function () {
            return this.rotateX;
        };
        EnvObject.prototype.setRotateX = function (rotateX) {
            this.rotateX = rotateX;
        };
        EnvObject.prototype.getRotateY = function () {
            return this.rotateY;
        };
        EnvObject.prototype.setRotateY = function (rotateY) {
            this.rotateY = rotateY;
        };
        EnvObject.prototype.getRotateZ = function () {
            return this.rotateZ;
        };
        EnvObject.prototype.setRotateZ = function (rotateZ) {
            this.rotateZ = rotateZ;
        };
        EnvObject.prototype.getTexture = function () {
            return this.texture;
        };
        EnvObject.prototype.setTexture = function (texture) {
            this.texture = texture;
        };
        EnvObject.prototype.getModel = function () {
            return this.model;
        };
        EnvObject.prototype.setModel = function (model) {
            this.model = model;
        };
        EnvObject.prototype.getScale = function () {
            return this.scale;
        };
        EnvObject.prototype.setScale = function (scale) {
            this.scale = scale;
        };
        /**
         * returns the distance between this and another object
         * @param obj the other object
         * @return distance
         */
        EnvObject.prototype.distance$env3d_EnvObject = function (obj) {
            var xdiff;
            var ydiff;
            var zdiff;
            xdiff = obj.getX() - this.getX();
            ydiff = obj.getY() - this.getY();
            zdiff = obj.getZ() - this.getZ();
            return Math.sqrt(xdiff * xdiff + ydiff * ydiff + zdiff * zdiff);
        };
        EnvObject.prototype.distance = function (x, y, z) {
            var _this = this;
            if (((typeof x === 'number') || x === null) && ((typeof y === 'number') || y === null) && ((typeof z === 'number') || z === null)) {
                var __args = Array.prototype.slice.call(arguments);
                return (function () {
                    var xdiff;
                    var ydiff;
                    var zdiff;
                    xdiff = x - _this.getX();
                    ydiff = y - _this.getY();
                    zdiff = z - _this.getZ();
                    return Math.sqrt(xdiff * xdiff + ydiff * ydiff + zdiff * zdiff);
                })();
            }
            else if (((x != null && x instanceof env3d.EnvObject) || x === null) && y === undefined && z === undefined) {
                return this.distance$env3d_EnvObject(x);
            }
            else
                throw new Error('invalid overload');
        };
        /**
         * @return the transparent
         */
        EnvObject.prototype.isTransparent = function () {
            return this.transparent;
        };
        /**
         * @param transparent the transparent to set.  Only works if the texture
         * has an alpha channel.
         */
        EnvObject.prototype.setTransparent = function (transparent) {
            this.transparent = transparent;
        };
        /**
         * @return the textureNormal
         */
        EnvObject.prototype.getTextureNormal = function () {
            return this.textureNormal;
        };
        /**
         * @param textureNormal the textureNormal to set
         */
        EnvObject.prototype.setTextureNormal = function (textureNormal) {
            this.textureNormal = textureNormal;
        };
        return EnvObject;
    }());
    env3d.EnvObject = EnvObject;
    EnvObject["__class"] = "env3d.EnvObject";

    module.exports = EnvObject;
})(env3d || (env3d = {}));
