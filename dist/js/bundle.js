var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * Base class for all objects in our game.
 */
var GameObject = (function (_super) {
    __extends(GameObject, _super);
    function GameObject() {
        _super.call(this);
    }
    /**
     * The move method is called by the game class
     * every frame.  Sub-class should override this method.
     */
    GameObject.prototype.move = function () {
    };
    /**
     * Sets the env, used by the game class
     * @param env
     */
    GameObject.prototype.setEnv = function (env) {
        this.env = env;
    };
    /**
     * Returns the environment object
     * @return
     */
    GameObject.prototype.getEnv = function () {
        return this.env;
    };
    /**
     * Turn this object to face another game object
     * @param gameObj to object to face
     */
    GameObject.prototype.turnToFace = function (gameObj) {
        this.setRotateY(/* toDegrees */ (function (x) { return x * 180 / Math.PI; })(Math.atan2(gameObj.getX() - this.getX(), gameObj.getZ() - this.getZ())));
    };
    /**
     * Moves forward at a certain speed, negative speed to move backwards
     * @param speed
     */
    GameObject.prototype.moveForward = function (speed) {
        this.setX(this.getX() + speed * Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.getRotateY())));
        this.setZ(this.getZ() + speed * Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.getRotateY())));
    };
    /**
     * Moves to the right at a certain speed, negative to move left
     * @param speed
     */
    GameObject.prototype.moveRight = function (speed) {
        this.setX(this.getX() - speed * Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.getRotateY())));
        this.setZ(this.getZ() + speed * Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.getRotateY())));
    };
    /**
     * Put the camera behind this object, provide the x, y and z offset
     * relative to the object
     */
    GameObject.prototype.followCam = function (followDist, offX, offY, offZ) {
        this.env.setCameraXYZ((this.getX() + offX) - followDist * Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.getRotateY())) * Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.env.getCameraPitch())), (this.getY() + offY) - followDist * Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.env.getCameraPitch())), (this.getZ() + offZ) - followDist * Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.getRotateY())) * Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.env.getCameraPitch())));
        this.env.setCameraYaw(this.getRotateY() - 180);
    };
    /**
     * Standard FPS control scheme - camera follow this object.
     * W,A,S,D for movement, Mouse to look
     */
    GameObject.prototype.simpleFPSControl = function (speed) {
        if (!this.env.isMouseGrabbed())
            this.env.setMouseGrab(true);
        this.followCam(2, 0, 1, 0);
        if (this.env.getKeyDown(org.lwjgl.input.Keyboard.KEY_W) || this.env.getKeyDown(org.lwjgl.input.Keyboard.KEY_UP)) {
            this.moveForward(speed);
        }
        if (this.env.getKeyDown(org.lwjgl.input.Keyboard.KEY_A)) {
            this.moveRight(-speed);
        }
        if (this.env.getKeyDown(org.lwjgl.input.Keyboard.KEY_S) || this.env.getKeyDown(org.lwjgl.input.Keyboard.KEY_DOWN)) {
            this.moveForward(-speed);
        }
        if (this.env.getKeyDown(org.lwjgl.input.Keyboard.KEY_D)) {
            this.moveRight(speed);
        }
        if (this.env.getKeyDown(org.lwjgl.input.Keyboard.KEY_LEFT)) {
            this.setRotateY(this.getRotateY() + 2);
        }
        if (this.env.getKeyDown(org.lwjgl.input.Keyboard.KEY_RIGHT)) {
            this.setRotateY(this.getRotateY() - 2);
        }
        if (this.env.getKeyDown(org.lwjgl.input.Keyboard.KEY_UP) || this.env.getKeyDown(org.lwjgl.input.Keyboard.KEY_DOWN) || this.env.getKeyDown(org.lwjgl.input.Keyboard.KEY_LEFT) || this.env.getKeyDown(org.lwjgl.input.Keyboard.KEY_RIGHT)) {
            this.env.setCameraPitch(-20);
        }
        this.setRotateY(this.getRotateY() - 0.1 * this.env.getMouseDX());
        this.env.setCameraPitch(this.env.getCameraPitch() + 0.1 * this.env.getMouseDY());
    };
    return GameObject;
}(env3d.advanced.EnvNode));
GameObject["__class"] = "GameObject";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * A mini math game
 *
 */
var MiniMath = (function () {
    /**
     * MiniMath needs a env object for input/output
     */
    function MiniMath(env) {
        this.mode = MiniMath.ADD;
        this.op1 = 0;
        this.op2 = 0;
        this.answer = 0;
        this.timer = 0;
        this.timeRemain = 0;
        this.env = env;
        this.init();
    }
    /**
     * Initialize the math game
     */
    MiniMath.prototype.init = function () {
        this.op1 = ((Math.random() * MiniMath.DIFFICULTY * 10) | 0);
        this.op2 = ((Math.random() * MiniMath.DIFFICULTY * 10) | 0);
        if (this.mode === MiniMath.SUBTRACT) {
            if (this.op1 < this.op2) {
                var tmp = this.op1;
                this.op1 = this.op2;
                this.op2 = tmp;
            }
        }
        this.timer = 150;
        this.answerStr = "";
        this.answer = 99999;
    };
    /**
     * retruns true if we need to keep playing, false if game is finished
     */
    MiniMath.prototype.play = function () {
        var question;
        if (this.mode === MiniMath.ADD) {
            question = this.op1 + " + " + this.op2 + " = ";
        }
        else {
            question = this.op1 + " - " + this.op2 + " = ";
        }
        while ((this.timer > 0)) {
            if (this.answerStr.length < 9) {
                if (this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_0 || this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_NUMPAD0) {
                    this.answerStr += 0;
                }
                else if (this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_1 || this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_NUMPAD1) {
                    this.answerStr += 1;
                }
                else if (this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_2 || this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_NUMPAD2) {
                    this.answerStr += 2;
                }
                else if (this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_3 || this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_NUMPAD3) {
                    this.answerStr += 3;
                }
                else if (this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_4 || this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_NUMPAD4) {
                    this.answerStr += 4;
                }
                else if (this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_5 || this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_NUMPAD5) {
                    this.answerStr += 5;
                }
                else if (this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_6 || this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_NUMPAD6) {
                    this.answerStr += 6;
                }
                else if (this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_7 || this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_NUMPAD7) {
                    this.answerStr += 7;
                }
                else if (this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_8 || this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_NUMPAD8) {
                    this.answerStr += 8;
                }
                else if (this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_9 || this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_NUMPAD9) {
                    this.answerStr += 9;
                }
                if (this.answerStr.length > 0) {
                    this.answer = javaemul.internal.IntegerHelper.parseInt(this.answerStr);
                }
            }
            if (this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_DELETE || this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_BACK) {
                if (this.answerStr.length > 0) {
                    this.answerStr = this.answerStr.substring(0, this.answerStr.length - 1);
                }
            }
            this.getEnv().setDisplayStr(question + this.answerStr, 200, 260, 3, 1, 1, 1, 1);
            if (this.getEnv().getMouseButtonClicked() === 0 || this.getEnv().getKey() === org.lwjgl.input.Keyboard.KEY_ESCAPE)
                this.timer = 0;
            var gotAnswer = false;
            if (this.mode === MiniMath.ADD) {
                if (this.op1 + this.op2 === this.answer)
                    gotAnswer = true;
            }
            else {
                if (this.op1 - this.op2 === this.answer)
                    gotAnswer = true;
            }
            if (gotAnswer) {
                this.timeRemain = this.timer;
                this.timer = 0;
            }
            this.timer--;
            this.env.advanceOneFrame(30);
        }
        ;
    };
    MiniMath.prototype.reset = function () {
        this.getEnv().setDisplayStr(null, 200, 260, 3, 1, 1, 1, 1);
        this.init();
    };
    MiniMath.prototype.clearQuestion = function () {
        this.getEnv().setDisplayStr(null, 200, 260);
        return true;
    };
    MiniMath.prototype.getTimeRemain = function () {
        return this.timeRemain;
    };
    MiniMath.prototype.isCorrect = function () {
        return (this.mode === MiniMath.ADD ? (this.op1 + this.op2 === this.answer) : (this.op1 - this.op2 === this.answer));
    };
    MiniMath.prototype.setMode = function (mode) {
        this.mode = mode;
    };
    MiniMath.prototype.getEnv = function () {
        return this.env;
    };
    MiniMath.prototype.test = function () {
        this.env = new env3d.Env();
        this.env.setDefaultControl(false);
        this.setMode(MiniMath.SUBTRACT);
        this.reset();
        var delay;
        while ((this.env.getKey() !== 1)) {
            this.play();
            if (this.isCorrect()) {
                console.info("Awesome! " + this.getTimeRemain());
            }
            else {
                console.info("Doh!");
            }
            if (this.clearQuestion()) {
                this.init();
            }
        }
        ;
        this.env.exit();
    };
    MiniMath.ADD = 0;
    MiniMath.SUBTRACT = 1;
    MiniMath.DIFFICULTY = 1;
    return MiniMath;
}());
MiniMath["__class"] = "MiniMath";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Shield = (function (_super) {
    __extends(Shield, _super);
    function Shield(env) {
        _super.call(this);
        this.duration = 300;
        this.env = env;
        env.setDisplayStr("Gone berzerk! Slash those zombies!!!", 120, 330, 1.5, 1, 0, 0, 1);
        this.setTexture("textures/red.png");
        this.setScale(0.2);
        this.setTransparent(true);
    }
    Shield.prototype.flash = function () {
        if (this.getScale() <= 0) {
            this.setScale(1.2);
        }
        else {
            this.setScale(0);
        }
    };
    Shield.prototype.active = function () {
        if (this.duration > 0) {
            this.duration--;
            if (this.duration < 100) {
                if (this.duration % 15 === 0) {
                    this.flash();
                }
            }
            return true;
        }
        else {
            this.env.setDisplayStr(null, 120, 330);
            return false;
        }
    };
    return Shield;
}(env3d.advanced.EnvNode));
Shield["__class"] = "Shield";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * Just a shell
 */
var Actor = (function (_super) {
    __extends(Actor, _super);
    function Actor() {
        _super.apply(this, arguments);
    }
    return Actor;
}(GameObject));
Actor["__class"] = "Actor";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * This class is generated by the env3d plugin to make
 * it easier to work with models.  It scans a model
 * directory for all the obj files and organized them.
 */
var LongHouse = (function (_super) {
    __extends(LongHouse, _super);
    /**
     * Parameterized constructor - allows arbitary of object
     */
    function LongHouse(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        _super.call(this);
        this.setX(x);
        this.setY(y);
        this.setZ(z);
        this.setScale(1);
        this.setTexture("models/longHouse/HouseLong.png");
        this.setModel("models/longHouse/LongHouse.obj");
    }
    LongHouse.prototype.move = function () {
        if (this.collisionNode == null) {
            this.collisionNode = new Array(3);
            var scale = 3;
            for (var i = 0; i < 3; i++) {
                this.collisionNode[i] = new env3d.advanced.EnvNode();
                this.collisionNode[i].setX(this.getX() - scale * Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.getRotateY())));
                this.collisionNode[i].setY(1);
                this.collisionNode[i].setZ(this.getZ() + scale * Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.getRotateY())));
                this.collisionNode[i].setScale(4);
                scale -= 3;
            }
        }
        for (var index164 = this.getEnv().getObjects(Actor).iterator(); index164.hasNext();) {
            var z = index164.next();
            {
                for (var index165 = 0; index165 < this.collisionNode.length; index165++) {
                    var cNode = this.collisionNode[index165];
                    {
                        if (z.distance(cNode) < cNode.getScale() + z.getScale()) {
                            if (z != null && z instanceof Zombie) {
                                z.moveForward(-0.1);
                                z.setRotateY(z.getRotateY() + 180);
                            }
                            else if (z != null && z instanceof Hunter) {
                                z.revert();
                            }
                        }
                    }
                }
            }
        }
    };
    return LongHouse;
}(GameObject));
LongHouse["__class"] = "LongHouse";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * This class is generated by the env3d plugin to make
 * it easier to work with models.  It scans a model
 * directory for all the obj files and organized them.
 */
var Mountain = (function (_super) {
    __extends(Mountain, _super);
    /**
     * Parameterized constructor - allows arbitary of object
     */
    function Mountain(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        _super.call(this);
        this.setX(x);
        this.setY(y);
        this.setZ(z);
        this.setScale(1);
        this.setTexture("models/tux/tux.png");
        this.setModel("models/tux/tux.obj");
    }
    Mountain.prototype.move = function () {
        var hunter = this.getEnv().getObject(Hunter);
        if (hunter.distance(this) < hunter.getScale() + this.getScale()) {
            hunter.revert();
        }
        for (var index166 = this.getEnv().getObjects(Zombie).iterator(); index166.hasNext();) {
            var z = index166.next();
            {
                if (z.distance(this) < this.getScale() + z.getScale()) {
                    z.setRotateY(z.getRotateY() + 180);
                }
            }
        }
    };
    return Mountain;
}(GameObject));
Mountain["__class"] = "Mountain";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * This class is generated by the env3d plugin to make
 * it easier to work with models.  It scans a model
 * directory for all the obj files and organized them.
 */
var Hunter = (function (_super) {
    __extends(Hunter, _super);
    /**
     * Parameterized constructor - allows arbitary of object
     */
    function Hunter(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        _super.call(this);
        this.modelsMap = (new java.util.HashMap());
        this.state = Hunter.IDLE;
        this.speed = 0.3;
        this.meleeRange = 1;
        this.kills = 0;
        this.health = 5;
        this.frame = 0;
        this.prevX = 0;
        this.prevY = 0;
        this.prevZ = 0;
        this.setX(x);
        this.setY(y);
        this.setZ(z);
        this.setScale(1);
        this.setTexture("models/hunter/player.png");
        this.setModel("models/hunter/player.obj");
        this.init();
    }
    Hunter.prototype.revert = function () {
        this.setX(this.prevX);
        this.setY(this.prevY);
        this.setZ(this.prevZ);
    };
    Hunter.prototype.setup = function () {
        if (this.gunRange == null) {
            this.gunRange = new Array(100);
            for (var i = 0; i < 100; i++) {
                this.gunRange[i] = new env3d.advanced.EnvNode();
            }
            this.miniMath = new MiniMath(this.getEnv());
            this.miniMath.setMode(MiniMath.ADD);
        }
    };
    /**
     * Animating the shield
     */
    Hunter.prototype.shieldMovement = function () {
        if (this.shield != null) {
            if (this.shield.active()) {
                this.shield.setX(this.getX());
                this.shield.setY(this.getY());
                this.shield.setZ(this.getZ());
            }
            else {
                this.getEnv().removeObject(this.shield);
                this.shield = null;
            }
        }
    };
    /**
     *
     * The player's movement logic.  Rather complicated because we have to coordinate
     * between idle, run, and backwards depending on key press
     */
    Hunter.prototype.playerMovement = function () {
        if (this.getState() === Hunter.BACKWARDS || this.getState() === Hunter.RUN || this.getState() === Hunter.IDLE) {
            this.prevX = this.getX();
            this.prevY = this.getY();
            this.prevZ = this.getZ();
            this.simpleFPSControl(this.speed);
            var keyDown = false;
            if (this.getEnv().getKeyDown(org.lwjgl.input.Keyboard.KEY_W) || this.getEnv().getKeyDown(org.lwjgl.input.Keyboard.KEY_UP)) {
                this.setState(Hunter.RUN);
                keyDown = true;
            }
            if (this.getEnv().getKeyDown(org.lwjgl.input.Keyboard.KEY_S) || this.getEnv().getKeyDown(org.lwjgl.input.Keyboard.KEY_A) || this.getEnv().getKeyDown(org.lwjgl.input.Keyboard.KEY_D) || this.getEnv().getKeyDown(org.lwjgl.input.Keyboard.KEY_DOWN)) {
                if (this.getState() !== Hunter.RUN)
                    this.setState(Hunter.BACKWARDS);
                keyDown = true;
            }
            if (!keyDown && (this.getState() === Hunter.BACKWARDS || this.getState() === Hunter.RUN)) {
                this.setState(Hunter.IDLE);
            }
            if (this.getEnv().getMouseButtonDown(0) || this.getEnv().getKeyDown(org.lwjgl.input.Keyboard.KEY_SPACE)) {
                if (this.shield != null) {
                    this.setState(Hunter.MELEE);
                }
                else {
                    this.setState(Hunter.RANGED);
                }
            }
        }
    };
    Hunter.prototype.move = function () {
        this.setup();
        this.shieldMovement();
        this.playerMovement();
        this.setModel(this.modelsMap.get(this.state).get(this.frame));
        this.frame = (this.frame + 1) % this.modelsMap.get(this.state).size();
        if (this.frame === 0) {
            if (this.getState() === Hunter.DIE) {
                this.frame = this.modelsMap.get(this.state).size() - 1;
            }
            else if (this.getState() !== Hunter.IDLE) {
                this.setState(Hunter.IDLE);
            }
        }
        if (this.getState() === Hunter.RANGED) {
            if (this.frame === ((this.modelsMap.get(this.getState()).size() / 2 | 0)) - 5) {
                this.checkRangedHit();
            }
        }
        if (this.getState() === Hunter.MELEE && this.frame === (this.modelsMap.get(this.getState()).size() / 2 | 0)) {
            this.checkMeleeHit();
        }
    };
    /**
     * This method checks if the bullet hits any of the zombies
     */
    Hunter.prototype.checkRangedHit = function () {
        this.miniMath.play();
        var bulletScale = 0.5;
        if (this.miniMath.isCorrect()) {
            bulletScale = bulletScale + (this.miniMath.getTimeRemain() / 150.0);
        }
        this.miniMath.reset();
        for (var index167 = this.getEnv().getObjects(Zombie).iterator(); index167.hasNext();) {
            var zombie = index167.next();
            {
                if (zombie.distance(this) < 20 && !zombie.isDead()) {
                    zombie.turnToFace(this);
                    zombie.setSeekRange(20);
                }
            }
        }
        for (var i = 0; i < this.gunRange.length; i++) {
            var bullet = this.gunRange[i];
            for (var index168 = this.getEnv().getObjects(Zombie).iterator(); index168.hasNext();) {
                var zombie = index168.next();
                {
                    var weaponX = this.getX() + i * Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.getRotateY()));
                    var weaponZ = this.getZ() + i * Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.getRotateY()));
                    bullet.setX(weaponX);
                    bullet.setY(this.getY());
                    bullet.setZ(weaponZ);
                    bullet.setScale(bulletScale);
                    if (zombie.distance(bullet) < bullet.getScale() && !zombie.isDead()) {
                        zombie.turnToFace(this);
                        zombie.setState(Zombie.BLOWNED);
                        this.kills++;
                        if (this.kills % 3 === 0) {
                            this.shield = new Shield(this.getEnv());
                            this.getEnv().addObject(this.shield);
                        }
                        return;
                    }
                }
            }
        }
        this.kills = 0;
    };
    /**
     * Check short range target
     */
    Hunter.prototype.checkMeleeHit = function () {
        for (var index169 = this.getEnv().getObjects(Zombie).iterator(); index169.hasNext();) {
            var z = index169.next();
            {
                if (z.distance(this) < this.meleeRange + z.getScale() + this.getScale() && !z.isDead()) {
                    if (this.shield != null) {
                        z.turnToFace(this);
                        z.setState(Zombie.BLOWNED);
                    }
                    else {
                        z.hit();
                    }
                    break;
                }
            }
        }
    };
    Hunter.prototype.getShield = function () {
        return this.shield;
    };
    /**
     * Returns the current animation state
     */
    Hunter.prototype.getState = function () {
        return this.state;
    };
    /**
     * Sets the current animation state.  Resets frame counter to 0
     * Note: it only sets the state if new state is different than
     * the current state
     */
    Hunter.prototype.setState = function (newState) {
        if (this.state !== newState) {
            this.frame = 0;
            this.state = newState;
            this.miniMath.reset();
            if (this.state === Hunter.FLINCH) {
                this.health--;
                if (this.health <= 0) {
                    this.setState(Hunter.DIE);
                }
            }
        }
    };
    Hunter.prototype.init = function () {
        var Flinch = (new java.util.ArrayList());
        Flinch.add("models/hunter/Flinch/playerflinch00.obj");
        Flinch.add("models/hunter/Flinch/playerflinch01.obj");
        Flinch.add("models/hunter/Flinch/playerflinch02.obj");
        Flinch.add("models/hunter/Flinch/playerflinch03.obj");
        Flinch.add("models/hunter/Flinch/playerflinch04.obj");
        Flinch.add("models/hunter/Flinch/playerflinch05.obj");
        Flinch.add("models/hunter/Flinch/playerflinch06.obj");
        Flinch.add("models/hunter/Flinch/playerflinch07.obj");
        Flinch.add("models/hunter/Flinch/playerflinch08.obj");
        Flinch.add("models/hunter/Flinch/playerflinch09.obj");
        this.modelsMap.put(Hunter.FLINCH, Flinch);
        var Melee = (new java.util.ArrayList());
        Melee.add("models/hunter/Melee/playermelee00.obj");
        Melee.add("models/hunter/Melee/playermelee01.obj");
        Melee.add("models/hunter/Melee/playermelee02.obj");
        Melee.add("models/hunter/Melee/playermelee03.obj");
        Melee.add("models/hunter/Melee/playermelee04.obj");
        Melee.add("models/hunter/Melee/playermelee05.obj");
        Melee.add("models/hunter/Melee/playermelee06.obj");
        Melee.add("models/hunter/Melee/playermelee07.obj");
        Melee.add("models/hunter/Melee/playermelee08.obj");
        Melee.add("models/hunter/Melee/playermelee09.obj");
        Melee.add("models/hunter/Melee/playermelee10.obj");
        Melee.add("models/hunter/Melee/playermelee11.obj");
        Melee.add("models/hunter/Melee/playermelee12.obj");
        Melee.add("models/hunter/Melee/playermelee13.obj");
        Melee.add("models/hunter/Melee/playermelee14.obj");
        Melee.add("models/hunter/Melee/playermelee15.obj");
        Melee.add("models/hunter/Melee/playermelee16.obj");
        Melee.add("models/hunter/Melee/playermelee17.obj");
        Melee.add("models/hunter/Melee/playermelee18.obj");
        Melee.add("models/hunter/Melee/playermelee19.obj");
        Melee.add("models/hunter/Melee/playermelee20.obj");
        Melee.add("models/hunter/Melee/playermelee21.obj");
        Melee.add("models/hunter/Melee/playermelee22.obj");
        Melee.add("models/hunter/Melee/playermelee23.obj");
        Melee.add("models/hunter/Melee/playermelee24.obj");
        Melee.add("models/hunter/Melee/playermelee25.obj");
        Melee.add("models/hunter/Melee/playermelee26.obj");
        Melee.add("models/hunter/Melee/playermelee27.obj");
        Melee.add("models/hunter/Melee/playermelee28.obj");
        Melee.add("models/hunter/Melee/playermelee29.obj");
        this.modelsMap.put(Hunter.MELEE, Melee);
        var Idle = (new java.util.ArrayList());
        Idle.add("models/hunter/Idle/playeridle00.obj");
        Idle.add("models/hunter/Idle/playeridle01.obj");
        Idle.add("models/hunter/Idle/playeridle02.obj");
        Idle.add("models/hunter/Idle/playeridle03.obj");
        Idle.add("models/hunter/Idle/playeridle04.obj");
        Idle.add("models/hunter/Idle/playeridle05.obj");
        Idle.add("models/hunter/Idle/playeridle06.obj");
        Idle.add("models/hunter/Idle/playeridle07.obj");
        Idle.add("models/hunter/Idle/playeridle08.obj");
        Idle.add("models/hunter/Idle/playeridle09.obj");
        Idle.add("models/hunter/Idle/playeridle10.obj");
        Idle.add("models/hunter/Idle/playeridle11.obj");
        Idle.add("models/hunter/Idle/playeridle12.obj");
        Idle.add("models/hunter/Idle/playeridle13.obj");
        Idle.add("models/hunter/Idle/playeridle14.obj");
        Idle.add("models/hunter/Idle/playeridle15.obj");
        Idle.add("models/hunter/Idle/playeridle16.obj");
        Idle.add("models/hunter/Idle/playeridle17.obj");
        Idle.add("models/hunter/Idle/playeridle18.obj");
        Idle.add("models/hunter/Idle/playeridle19.obj");
        this.modelsMap.put(Hunter.IDLE, Idle);
        var Jump = (new java.util.ArrayList());
        Jump.add("models/hunter/Jump/playerjump00.obj");
        Jump.add("models/hunter/Jump/playerjump01.obj");
        Jump.add("models/hunter/Jump/playerjump02.obj");
        Jump.add("models/hunter/Jump/playerjump03.obj");
        Jump.add("models/hunter/Jump/playerjump04.obj");
        Jump.add("models/hunter/Jump/playerjump05.obj");
        Jump.add("models/hunter/Jump/playerjump06.obj");
        Jump.add("models/hunter/Jump/playerjump07.obj");
        Jump.add("models/hunter/Jump/playerjump08.obj");
        Jump.add("models/hunter/Jump/playerjump09.obj");
        Jump.add("models/hunter/Jump/playerjump10.obj");
        Jump.add("models/hunter/Jump/playerjump11.obj");
        Jump.add("models/hunter/Jump/playerjump12.obj");
        Jump.add("models/hunter/Jump/playerjump13.obj");
        Jump.add("models/hunter/Jump/playerjump14.obj");
        Jump.add("models/hunter/Jump/playerjump15.obj");
        Jump.add("models/hunter/Jump/playerjump16.obj");
        Jump.add("models/hunter/Jump/playerjump17.obj");
        Jump.add("models/hunter/Jump/playerjump18.obj");
        Jump.add("models/hunter/Jump/playerjump19.obj");
        Jump.add("models/hunter/Jump/playerjump20.obj");
        Jump.add("models/hunter/Jump/playerjump21.obj");
        Jump.add("models/hunter/Jump/playerjump22.obj");
        Jump.add("models/hunter/Jump/playerjump23.obj");
        Jump.add("models/hunter/Jump/playerjump24.obj");
        Jump.add("models/hunter/Jump/playerjump25.obj");
        Jump.add("models/hunter/Jump/playerjump26.obj");
        Jump.add("models/hunter/Jump/playerjump27.obj");
        Jump.add("models/hunter/Jump/playerjump28.obj");
        Jump.add("models/hunter/Jump/playerjump29.obj");
        this.modelsMap.put(Hunter.JUMP, Jump);
        var Run = (new java.util.ArrayList());
        Run.add("models/hunter/Run/playerrun00.obj");
        Run.add("models/hunter/Run/playerrun01.obj");
        Run.add("models/hunter/Run/playerrun02.obj");
        Run.add("models/hunter/Run/playerrun03.obj");
        Run.add("models/hunter/Run/playerrun04.obj");
        Run.add("models/hunter/Run/playerrun05.obj");
        Run.add("models/hunter/Run/playerrun06.obj");
        Run.add("models/hunter/Run/playerrun07.obj");
        Run.add("models/hunter/Run/playerrun08.obj");
        Run.add("models/hunter/Run/playerrun09.obj");
        Run.add("models/hunter/Run/playerrun10.obj");
        Run.add("models/hunter/Run/playerrun11.obj");
        Run.add("models/hunter/Run/playerrun12.obj");
        Run.add("models/hunter/Run/playerrun13.obj");
        Run.add("models/hunter/Run/playerrun14.obj");
        Run.add("models/hunter/Run/playerrun15.obj");
        Run.add("models/hunter/Run/playerrun16.obj");
        Run.add("models/hunter/Run/playerrun17.obj");
        Run.add("models/hunter/Run/playerrun18.obj");
        Run.add("models/hunter/Run/playerrun19.obj");
        this.modelsMap.put(Hunter.RUN, Run);
        var Ranged = (new java.util.ArrayList());
        Ranged.add("models/hunter/Ranged/playerranged00.obj");
        Ranged.add("models/hunter/Ranged/playerranged01.obj");
        Ranged.add("models/hunter/Ranged/playerranged02.obj");
        Ranged.add("models/hunter/Ranged/playerranged03.obj");
        Ranged.add("models/hunter/Ranged/playerranged04.obj");
        Ranged.add("models/hunter/Ranged/playerranged05.obj");
        Ranged.add("models/hunter/Ranged/playerranged06.obj");
        Ranged.add("models/hunter/Ranged/playerranged07.obj");
        Ranged.add("models/hunter/Ranged/playerranged08.obj");
        Ranged.add("models/hunter/Ranged/playerranged09.obj");
        Ranged.add("models/hunter/Ranged/playerranged10.obj");
        Ranged.add("models/hunter/Ranged/playerranged11.obj");
        Ranged.add("models/hunter/Ranged/playerranged12.obj");
        Ranged.add("models/hunter/Ranged/playerranged13.obj");
        Ranged.add("models/hunter/Ranged/playerranged14.obj");
        Ranged.add("models/hunter/Ranged/playerranged15.obj");
        Ranged.add("models/hunter/Ranged/playerranged16.obj");
        Ranged.add("models/hunter/Ranged/playerranged17.obj");
        Ranged.add("models/hunter/Ranged/playerranged18.obj");
        Ranged.add("models/hunter/Ranged/playerranged19.obj");
        Ranged.add("models/hunter/Ranged/playerranged20.obj");
        Ranged.add("models/hunter/Ranged/playerranged21.obj");
        Ranged.add("models/hunter/Ranged/playerranged22.obj");
        Ranged.add("models/hunter/Ranged/playerranged23.obj");
        Ranged.add("models/hunter/Ranged/playerranged24.obj");
        Ranged.add("models/hunter/Ranged/playerranged25.obj");
        Ranged.add("models/hunter/Ranged/playerranged26.obj");
        Ranged.add("models/hunter/Ranged/playerranged27.obj");
        Ranged.add("models/hunter/Ranged/playerranged28.obj");
        Ranged.add("models/hunter/Ranged/playerranged29.obj");
        Ranged.add("models/hunter/Ranged/playerranged30.obj");
        Ranged.add("models/hunter/Ranged/playerranged31.obj");
        Ranged.add("models/hunter/Ranged/playerranged32.obj");
        Ranged.add("models/hunter/Ranged/playerranged33.obj");
        Ranged.add("models/hunter/Ranged/playerranged34.obj");
        Ranged.add("models/hunter/Ranged/playerranged35.obj");
        Ranged.add("models/hunter/Ranged/playerranged36.obj");
        Ranged.add("models/hunter/Ranged/playerranged37.obj");
        this.modelsMap.put(Hunter.RANGED, Ranged);
        var Die = (new java.util.ArrayList());
        Die.add("models/hunter/Die/playerdie00.obj");
        Die.add("models/hunter/Die/playerdie01.obj");
        Die.add("models/hunter/Die/playerdie02.obj");
        Die.add("models/hunter/Die/playerdie03.obj");
        Die.add("models/hunter/Die/playerdie04.obj");
        Die.add("models/hunter/Die/playerdie05.obj");
        Die.add("models/hunter/Die/playerdie06.obj");
        Die.add("models/hunter/Die/playerdie07.obj");
        Die.add("models/hunter/Die/playerdie08.obj");
        Die.add("models/hunter/Die/playerdie09.obj");
        Die.add("models/hunter/Die/playerdie10.obj");
        Die.add("models/hunter/Die/playerdie11.obj");
        Die.add("models/hunter/Die/playerdie12.obj");
        Die.add("models/hunter/Die/playerdie13.obj");
        Die.add("models/hunter/Die/playerdie14.obj");
        Die.add("models/hunter/Die/playerdie15.obj");
        Die.add("models/hunter/Die/playerdie16.obj");
        Die.add("models/hunter/Die/playerdie17.obj");
        Die.add("models/hunter/Die/playerdie18.obj");
        Die.add("models/hunter/Die/playerdie19.obj");
        Die.add("models/hunter/Die/playerdie20.obj");
        Die.add("models/hunter/Die/playerdie21.obj");
        this.modelsMap.put(Hunter.DIE, Die);
        var Backwards = (new java.util.ArrayList());
        Backwards.add("models/hunter/Backwards/playerbackwards00.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards01.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards02.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards03.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards04.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards05.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards06.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards07.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards08.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards09.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards10.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards11.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards12.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards13.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards14.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards15.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards16.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards17.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards18.obj");
        Backwards.add("models/hunter/Backwards/playerbackwards19.obj");
        this.modelsMap.put(Hunter.BACKWARDS, Backwards);
    };
    Hunter.FLINCH = 0;
    Hunter.MELEE = 1;
    Hunter.IDLE = 2;
    Hunter.JUMP = 3;
    Hunter.RUN = 4;
    Hunter.RANGED = 5;
    Hunter.DIE = 6;
    Hunter.BACKWARDS = 7;
    return Hunter;
}(Actor));
Hunter["__class"] = "Hunter";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * The Zombie class
 */
var Zombie = (function (_super) {
    __extends(Zombie, _super);
    /**
     * Parameterized constructor - allows arbitary of object
     */
    function Zombie(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        _super.call(this);
        this.modelsMap = (new java.util.HashMap());
        this.state = Zombie.WALK1;
        this.speed = 0.03;
        this.seekRange = 5;
        this.attackRange = 0.5;
        this.health = 0;
        this.frame = 0;
        this.setX(x);
        this.setY(y);
        this.setZ(z);
        this.setScale(1);
        this.setTexture("models/zombie/zombie.png");
        this.setModel("models/zombie/zombie.obj");
        this.init();
    }
    /**
     * Performs setup
     */
    Zombie.prototype.setup = function () {
        if (this.miniMath == null) {
            this.miniMath = new MiniMath(this.getEnv());
            this.miniMath.setMode(MiniMath.SUBTRACT);
            this.miniMath.reset();
        }
    };
    /**
     *
     * Basic implementation. Simply animate the model
     * based on the state
     */
    Zombie.prototype.move = function () {
        this.setup();
        if (!this.isDead() && this.getState() !== Zombie.ATTACKED1) {
            this.ai();
        }
        this.setModel(this.modelsMap.get(this.state).get(this.frame));
        this.frame = (this.frame + 1) % this.modelsMap.get(this.state).size();
        if (this.frame === 0) {
            if (this.state === Zombie.DIE) {
                this.frame = this.modelsMap.get(this.state).size() - 1;
            }
            else if (this.state === Zombie.BLOWNED) {
                this.setState(Zombie.TWITCH);
            }
            if (!this.isDead())
                this.setState(Zombie.IDLE1);
        }
    };
    Zombie.prototype.isDead = function () {
        return (this.getState() === Zombie.DIE || this.getState() === Zombie.TWITCH || this.getState() === Zombie.BLOWNED);
    };
    Zombie.prototype.ai = function () {
        var hunter = this.getEnv().getObject(Hunter);
        var vecX = Math.sin(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.getRotateY()));
        var vecZ = Math.cos(/* toRadians */ (function (x) { return x * Math.PI / 180; })(this.getRotateY()));
        if (this.attackRangeNode == null) {
            this.attackRangeNode = new env3d.advanced.EnvNode();
            this.attackRangeNode.setScale(this.attackRange);
        }
        this.attackRangeNode.setX(this.getX() + this.attackRange * vecX);
        this.attackRangeNode.setY(this.getY());
        this.attackRangeNode.setZ(this.getZ() + this.attackRange * vecZ);
        if (this.seekRangeNode == null) {
            this.seekRangeNode = new env3d.advanced.EnvNode();
            this.seekRangeNode.setScale(this.seekRange);
        }
        this.seekRangeNode.setX(this.getX() + this.seekRange * vecX);
        this.seekRangeNode.setY(this.getY());
        this.seekRangeNode.setZ(this.getZ() + this.seekRange * vecZ);
        if (hunter.distance(this.attackRangeNode) < this.attackRangeNode.getScale() + hunter.getScale()) {
            if (Math.random() < 0.5) {
                this.setState(Zombie.PUNCH);
            }
            else {
                this.setState(Zombie.KICK);
            }
            if (hunter.getShield() != null || hunter.getState() === Hunter.MELEE || hunter.getState() === Hunter.DIE || hunter.getState() === Hunter.FLINCH)
                return;
            if (Math.random() < 0.1) {
                this.env.setDisplayStr("Under Attack!", 200, 350, 3, 1, 0, 0, 1);
                this.miniMath.play();
                this.env.setDisplayStr(null, 200, 350);
                if (this.miniMath.isCorrect()) {
                    hunter.turnToFace(this);
                    hunter.setState(Hunter.MELEE);
                    this.setState(Zombie.IDLE1);
                }
                else {
                    hunter.setState(Hunter.FLINCH);
                }
                this.miniMath.reset();
            }
        }
        else if (hunter.distance(this.seekRangeNode) < this.seekRangeNode.getScale() + hunter.getScale()) {
            this.seekHunter();
        }
        else {
            this.randomWalk();
        }
    };
    Zombie.prototype.setSeekRange = function (dist) {
        this.seekRangeNode.setScale(dist);
    };
    Zombie.prototype.seekHunter = function () {
        this.setState(Zombie.WALK1);
        this.turnToFace(this.getEnv().getObject(Hunter));
        this.moveForward(this.speed * 1.3);
        if (this.seekRangeNode.getScale() > this.seekRange) {
            this.seekRangeNode.setScale(this.seekRangeNode.getScale() - 0.01);
        }
    };
    Zombie.prototype.randomWalk = function () {
        this.setState(Zombie.WALK2);
        if (this.frame === 0) {
            this.setRotateY(this.getRotateY() + Math.random() * 90 - 45);
        }
        this.moveForward(this.speed);
    };
    Zombie.prototype.hit = function () {
        this.health--;
        if (this.health < 0) {
            this.setState(Zombie.DIE);
        }
        else {
            this.setState(Zombie.ATTACKED1);
        }
    };
    /**
     * Returns the current animation state
     */
    Zombie.prototype.getState = function () {
        return this.state;
    };
    /**
     * Sets the current animation state.  Resets frame counter to 0
     * Note: it only sets the state if new state is different than
     * the current state
     */
    Zombie.prototype.setState = function (newState) {
        if (this.state !== newState) {
            this.frame = 0;
            this.state = newState;
        }
    };
    Zombie.prototype.init = function () {
        var twitch = (new java.util.ArrayList());
        twitch.add("models/zombie/twitch/zombie_000078.obj");
        twitch.add("models/zombie/twitch/zombie_000079.obj");
        twitch.add("models/zombie/twitch/zombie_000080.obj");
        twitch.add("models/zombie/twitch/zombie_000081.obj");
        twitch.add("models/zombie/twitch/zombie_000082.obj");
        twitch.add("models/zombie/twitch/zombie_000083.obj");
        twitch.add("models/zombie/twitch/zombie_000084.obj");
        twitch.add("models/zombie/twitch/zombie_000085.obj");
        twitch.add("models/zombie/twitch/zombie_000086.obj");
        twitch.add("models/zombie/twitch/zombie_000087.obj");
        twitch.add("models/zombie/twitch/zombie_000088.obj");
        this.modelsMap.put(Zombie.TWITCH, twitch);
        var punch = (new java.util.ArrayList());
        punch.add("models/zombie/punch/zombie_000117.obj");
        punch.add("models/zombie/punch/zombie_000118.obj");
        punch.add("models/zombie/punch/zombie_000119.obj");
        punch.add("models/zombie/punch/zombie_000120.obj");
        punch.add("models/zombie/punch/zombie_000121.obj");
        punch.add("models/zombie/punch/zombie_000122.obj");
        punch.add("models/zombie/punch/zombie_000123.obj");
        punch.add("models/zombie/punch/zombie_000124.obj");
        punch.add("models/zombie/punch/zombie_000125.obj");
        punch.add("models/zombie/punch/zombie_000126.obj");
        punch.add("models/zombie/punch/zombie_000127.obj");
        punch.add("models/zombie/punch/zombie_000128.obj");
        this.modelsMap.put(Zombie.PUNCH, punch);
        var kick = (new java.util.ArrayList());
        kick.add("models/zombie/kick/zombie_000106.obj");
        kick.add("models/zombie/kick/zombie_000107.obj");
        kick.add("models/zombie/kick/zombie_000108.obj");
        kick.add("models/zombie/kick/zombie_000109.obj");
        kick.add("models/zombie/kick/zombie_000110.obj");
        kick.add("models/zombie/kick/zombie_000111.obj");
        kick.add("models/zombie/kick/zombie_000112.obj");
        kick.add("models/zombie/kick/zombie_000113.obj");
        kick.add("models/zombie/kick/zombie_000114.obj");
        kick.add("models/zombie/kick/zombie_000115.obj");
        this.modelsMap.put(Zombie.KICK, kick);
        var walk2 = (new java.util.ArrayList());
        walk2.add("models/zombie/walk2/zombie_000022.obj");
        walk2.add("models/zombie/walk2/zombie_000023.obj");
        walk2.add("models/zombie/walk2/zombie_000024.obj");
        walk2.add("models/zombie/walk2/zombie_000025.obj");
        walk2.add("models/zombie/walk2/zombie_000026.obj");
        walk2.add("models/zombie/walk2/zombie_000027.obj");
        walk2.add("models/zombie/walk2/zombie_000028.obj");
        walk2.add("models/zombie/walk2/zombie_000029.obj");
        walk2.add("models/zombie/walk2/zombie_000030.obj");
        walk2.add("models/zombie/walk2/zombie_000031.obj");
        walk2.add("models/zombie/walk2/zombie_000032.obj");
        walk2.add("models/zombie/walk2/zombie_000033.obj");
        walk2.add("models/zombie/walk2/zombie_000034.obj");
        walk2.add("models/zombie/walk2/zombie_000035.obj");
        walk2.add("models/zombie/walk2/zombie_000036.obj");
        this.modelsMap.put(Zombie.WALK2, walk2);
        var walk1 = (new java.util.ArrayList());
        walk1.add("models/zombie/walk1/zombie_000002.obj");
        walk1.add("models/zombie/walk1/zombie_000003.obj");
        walk1.add("models/zombie/walk1/zombie_000004.obj");
        walk1.add("models/zombie/walk1/zombie_000005.obj");
        walk1.add("models/zombie/walk1/zombie_000006.obj");
        walk1.add("models/zombie/walk1/zombie_000007.obj");
        walk1.add("models/zombie/walk1/zombie_000008.obj");
        walk1.add("models/zombie/walk1/zombie_000009.obj");
        walk1.add("models/zombie/walk1/zombie_000010.obj");
        walk1.add("models/zombie/walk1/zombie_000011.obj");
        walk1.add("models/zombie/walk1/zombie_000012.obj");
        walk1.add("models/zombie/walk1/zombie_000013.obj");
        walk1.add("models/zombie/walk1/zombie_000014.obj");
        walk1.add("models/zombie/walk1/zombie_000015.obj");
        walk1.add("models/zombie/walk1/zombie_000016.obj");
        walk1.add("models/zombie/walk1/zombie_000017.obj");
        walk1.add("models/zombie/walk1/zombie_000018.obj");
        walk1.add("models/zombie/walk1/zombie_000019.obj");
        walk1.add("models/zombie/walk1/zombie_000020.obj");
        this.modelsMap.put(Zombie.WALK1, walk1);
        var headbutt = (new java.util.ArrayList());
        headbutt.add("models/zombie/headbutt/zombie_000129.obj");
        headbutt.add("models/zombie/headbutt/zombie_000130.obj");
        headbutt.add("models/zombie/headbutt/zombie_000131.obj");
        headbutt.add("models/zombie/headbutt/zombie_000132.obj");
        headbutt.add("models/zombie/headbutt/zombie_000133.obj");
        headbutt.add("models/zombie/headbutt/zombie_000134.obj");
        headbutt.add("models/zombie/headbutt/zombie_000135.obj");
        headbutt.add("models/zombie/headbutt/zombie_000136.obj");
        this.modelsMap.put(Zombie.HEADBUTT, headbutt);
        var die = (new java.util.ArrayList());
        die.add("models/zombie/die/zombie_000091.obj");
        die.add("models/zombie/die/zombie_000092.obj");
        die.add("models/zombie/die/zombie_000093.obj");
        die.add("models/zombie/die/zombie_000094.obj");
        die.add("models/zombie/die/zombie_000095.obj");
        die.add("models/zombie/die/zombie_000096.obj");
        die.add("models/zombie/die/zombie_000097.obj");
        die.add("models/zombie/die/zombie_000098.obj");
        die.add("models/zombie/die/zombie_000099.obj");
        die.add("models/zombie/die/zombie_000100.obj");
        die.add("models/zombie/die/zombie_000101.obj");
        die.add("models/zombie/die/zombie_000102.obj");
        die.add("models/zombie/die/zombie_000103.obj");
        this.modelsMap.put(Zombie.DIE, die);
        var attacked2 = (new java.util.ArrayList());
        attacked2.add("models/zombie/attacked2/zombie_000048.obj");
        attacked2.add("models/zombie/attacked2/zombie_000049.obj");
        attacked2.add("models/zombie/attacked2/zombie_000050.obj");
        attacked2.add("models/zombie/attacked2/zombie_000051.obj");
        attacked2.add("models/zombie/attacked2/zombie_000052.obj");
        attacked2.add("models/zombie/attacked2/zombie_000053.obj");
        attacked2.add("models/zombie/attacked2/zombie_000054.obj");
        attacked2.add("models/zombie/attacked2/zombie_000055.obj");
        attacked2.add("models/zombie/attacked2/zombie_000056.obj");
        attacked2.add("models/zombie/attacked2/zombie_000057.obj");
        this.modelsMap.put(Zombie.ATTACKED2, attacked2);
        var attacked1 = (new java.util.ArrayList());
        attacked1.add("models/zombie/attacked1/zombie_000038.obj");
        attacked1.add("models/zombie/attacked1/zombie_000038.obj");
        attacked1.add("models/zombie/attacked1/zombie_000038.obj");
        attacked1.add("models/zombie/attacked1/zombie_000039.obj");
        attacked1.add("models/zombie/attacked1/zombie_000039.obj");
        attacked1.add("models/zombie/attacked1/zombie_000039.obj");
        attacked1.add("models/zombie/attacked1/zombie_000040.obj");
        attacked1.add("models/zombie/attacked1/zombie_000040.obj");
        attacked1.add("models/zombie/attacked1/zombie_000040.obj");
        attacked1.add("models/zombie/attacked1/zombie_000041.obj");
        attacked1.add("models/zombie/attacked1/zombie_000041.obj");
        attacked1.add("models/zombie/attacked1/zombie_000041.obj");
        attacked1.add("models/zombie/attacked1/zombie_000042.obj");
        attacked1.add("models/zombie/attacked1/zombie_000042.obj");
        attacked1.add("models/zombie/attacked1/zombie_000042.obj");
        attacked1.add("models/zombie/attacked1/zombie_000043.obj");
        attacked1.add("models/zombie/attacked1/zombie_000043.obj");
        attacked1.add("models/zombie/attacked1/zombie_000043.obj");
        attacked1.add("models/zombie/attacked1/zombie_000044.obj");
        attacked1.add("models/zombie/attacked1/zombie_000044.obj");
        attacked1.add("models/zombie/attacked1/zombie_000044.obj");
        attacked1.add("models/zombie/attacked1/zombie_000045.obj");
        attacked1.add("models/zombie/attacked1/zombie_000045.obj");
        attacked1.add("models/zombie/attacked1/zombie_000045.obj");
        attacked1.add("models/zombie/attacked1/zombie_000046.obj");
        attacked1.add("models/zombie/attacked1/zombie_000046.obj");
        attacked1.add("models/zombie/attacked1/zombie_000046.obj");
        attacked1.add("models/zombie/attacked1/zombie_000047.obj");
        attacked1.add("models/zombie/attacked1/zombie_000047.obj");
        attacked1.add("models/zombie/attacked1/zombie_000047.obj");
        this.modelsMap.put(Zombie.ATTACKED1, attacked1);
        var idle1 = (new java.util.ArrayList());
        idle1.add("models/zombie/idle1/zombie_000137.obj");
        idle1.add("models/zombie/idle1/zombie_000138.obj");
        idle1.add("models/zombie/idle1/zombie_000139.obj");
        idle1.add("models/zombie/idle1/zombie_000140.obj");
        idle1.add("models/zombie/idle1/zombie_000141.obj");
        idle1.add("models/zombie/idle1/zombie_000142.obj");
        idle1.add("models/zombie/idle1/zombie_000143.obj");
        idle1.add("models/zombie/idle1/zombie_000144.obj");
        idle1.add("models/zombie/idle1/zombie_000145.obj");
        idle1.add("models/zombie/idle1/zombie_000146.obj");
        idle1.add("models/zombie/idle1/zombie_000147.obj");
        idle1.add("models/zombie/idle1/zombie_000148.obj");
        idle1.add("models/zombie/idle1/zombie_000149.obj");
        idle1.add("models/zombie/idle1/zombie_000150.obj");
        idle1.add("models/zombie/idle1/zombie_000151.obj");
        idle1.add("models/zombie/idle1/zombie_000152.obj");
        idle1.add("models/zombie/idle1/zombie_000153.obj");
        idle1.add("models/zombie/idle1/zombie_000154.obj");
        idle1.add("models/zombie/idle1/zombie_000155.obj");
        idle1.add("models/zombie/idle1/zombie_000156.obj");
        idle1.add("models/zombie/idle1/zombie_000157.obj");
        idle1.add("models/zombie/idle1/zombie_000158.obj");
        idle1.add("models/zombie/idle1/zombie_000159.obj");
        idle1.add("models/zombie/idle1/zombie_000160.obj");
        idle1.add("models/zombie/idle1/zombie_000161.obj");
        idle1.add("models/zombie/idle1/zombie_000162.obj");
        idle1.add("models/zombie/idle1/zombie_000163.obj");
        idle1.add("models/zombie/idle1/zombie_000164.obj");
        idle1.add("models/zombie/idle1/zombie_000165.obj");
        idle1.add("models/zombie/idle1/zombie_000166.obj");
        idle1.add("models/zombie/idle1/zombie_000167.obj");
        idle1.add("models/zombie/idle1/zombie_000168.obj");
        idle1.add("models/zombie/idle1/zombie_000169.obj");
        this.modelsMap.put(Zombie.IDLE1, idle1);
        var blowned = (new java.util.ArrayList());
        blowned.add("models/zombie/blowned/zombie_000059.obj");
        blowned.add("models/zombie/blowned/zombie_000060.obj");
        blowned.add("models/zombie/blowned/zombie_000061.obj");
        blowned.add("models/zombie/blowned/zombie_000062.obj");
        blowned.add("models/zombie/blowned/zombie_000063.obj");
        blowned.add("models/zombie/blowned/zombie_000064.obj");
        blowned.add("models/zombie/blowned/zombie_000065.obj");
        blowned.add("models/zombie/blowned/zombie_000066.obj");
        blowned.add("models/zombie/blowned/zombie_000067.obj");
        blowned.add("models/zombie/blowned/zombie_000068.obj");
        blowned.add("models/zombie/blowned/zombie_000069.obj");
        blowned.add("models/zombie/blowned/zombie_000070.obj");
        blowned.add("models/zombie/blowned/zombie_000071.obj");
        blowned.add("models/zombie/blowned/zombie_000072.obj");
        blowned.add("models/zombie/blowned/zombie_000073.obj");
        blowned.add("models/zombie/blowned/zombie_000074.obj");
        blowned.add("models/zombie/blowned/zombie_000075.obj");
        this.modelsMap.put(Zombie.BLOWNED, blowned);
        var idle2 = (new java.util.ArrayList());
        idle2.add("models/zombie/idle2/zombie_000170.obj");
        idle2.add("models/zombie/idle2/zombie_000171.obj");
        idle2.add("models/zombie/idle2/zombie_000172.obj");
        idle2.add("models/zombie/idle2/zombie_000173.obj");
        idle2.add("models/zombie/idle2/zombie_000174.obj");
        idle2.add("models/zombie/idle2/zombie_000175.obj");
        idle2.add("models/zombie/idle2/zombie_000176.obj");
        idle2.add("models/zombie/idle2/zombie_000177.obj");
        idle2.add("models/zombie/idle2/zombie_000178.obj");
        idle2.add("models/zombie/idle2/zombie_000179.obj");
        idle2.add("models/zombie/idle2/zombie_000180.obj");
        idle2.add("models/zombie/idle2/zombie_000181.obj");
        idle2.add("models/zombie/idle2/zombie_000182.obj");
        idle2.add("models/zombie/idle2/zombie_000183.obj");
        idle2.add("models/zombie/idle2/zombie_000184.obj");
        idle2.add("models/zombie/idle2/zombie_000185.obj");
        idle2.add("models/zombie/idle2/zombie_000186.obj");
        idle2.add("models/zombie/idle2/zombie_000187.obj");
        idle2.add("models/zombie/idle2/zombie_000188.obj");
        idle2.add("models/zombie/idle2/zombie_000189.obj");
        idle2.add("models/zombie/idle2/zombie_000190.obj");
        idle2.add("models/zombie/idle2/zombie_000191.obj");
        idle2.add("models/zombie/idle2/zombie_000192.obj");
        idle2.add("models/zombie/idle2/zombie_000193.obj");
        idle2.add("models/zombie/idle2/zombie_000194.obj");
        idle2.add("models/zombie/idle2/zombie_000195.obj");
        idle2.add("models/zombie/idle2/zombie_000196.obj");
        idle2.add("models/zombie/idle2/zombie_000197.obj");
        idle2.add("models/zombie/idle2/zombie_000198.obj");
        idle2.add("models/zombie/idle2/zombie_000199.obj");
        idle2.add("models/zombie/idle2/zombie_000200.obj");
        this.modelsMap.put(Zombie.IDLE2, idle2);
    };
    Zombie.TWITCH = 0;
    Zombie.PUNCH = 1;
    Zombie.KICK = 2;
    Zombie.WALK2 = 3;
    Zombie.WALK1 = 4;
    Zombie.HEADBUTT = 5;
    Zombie.DIE = 6;
    Zombie.ATTACKED2 = 7;
    Zombie.ATTACKED1 = 8;
    Zombie.IDLE1 = 9;
    Zombie.BLOWNED = 10;
    Zombie.IDLE2 = 11;
    return Zombie;
}(Actor));
Zombie["__class"] = "Zombie";
//# sourceMappingURL=bundle.js.map
