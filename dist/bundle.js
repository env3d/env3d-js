/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Ball = (function () {
    /**
     * Constructor for objects of class Ball
     */
    function Ball(x, y, z) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.scale = 0;
        this.dir = 0;
        this.x = x;
        this.y = y;
        this.z = z;
        this.scale = 0.2;
    }
    Ball.prototype.setXYZ = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    };
    Ball.prototype.getX = function () {
        return this.x;
    };
    Ball.prototype.getY = function () {
        return this.y;
    };
    Ball.prototype.getZ = function () {
        return this.z;
    };
    /**
     * Set the direction of the ball
     */
    Ball.prototype.setDir = function (angle) {
        this.dir = angle;
    };
    /**
     * Move the ball based on it's direction
     */
    Ball.prototype.move = function () {
        if (this.dir === -90) {
            this.x -= 0.1;
        }
        else if (this.dir === 90) {
            this.x += 0.1;
        }
        else if (this.dir === 180) {
            this.z -= 0.1;
        }
        else if (this.dir === 0) {
            this.z += 0.1;
        }
    };
    return Ball;
}());
Ball["__class"] = "Ball";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * Game class, the main controller class
 */
var Game = (function () {
    /**
     * Put the doty at default location
     */
    function Game() {
        this.finished = false;
        this.m = new Monster(5, 1, 1);
        this.b = new Ball(100, 0, 0);
    }
    Game.prototype.setup = function () {
        this.finished = false;
        this.env = new env3d.Env();
        this.env.addObject(this.m);
        this.env.addObject(this.b);
        this.env.setCameraXYZ(5, 5, 13);
        this.env.setCameraPitch(-25);
        this.env.setDefaultControl(false);
    };
    Game.prototype.loop = function () {
        var key = this.env.getKey();
        var keyDown = this.env.getKeyDown();
        if (key === org.lwjgl.input.Keyboard.KEY_ESCAPE) {
            this.finished = true;
        }
        else if (key === org.lwjgl.input.Keyboard.KEY_S) {
            this.m.swipe();
            this.b.setDir(this.m.getRotateY());
            this.b.setXYZ(this.m.getX(), this.m.getY(), this.m.getZ());
        }
        if (keyDown === org.lwjgl.input.Keyboard.KEY_RIGHT) {
            this.m.moveX(0.1);
        }
        else if (keyDown === org.lwjgl.input.Keyboard.KEY_LEFT) {
            this.m.moveX(-0.1);
        }
        else if (keyDown === org.lwjgl.input.Keyboard.KEY_UP) {
            this.m.moveZ(-0.1);
        }
        else if (keyDown === org.lwjgl.input.Keyboard.KEY_DOWN) {
            this.m.moveZ(0.1);
        }
        else if (keyDown === org.lwjgl.input.Keyboard.CHAR_NONE) {
            if ((this.m.getState() === "run")) {
                this.m.idle();
            }
        }
        this.m.move();
        this.b.move();
    };
    /**
     * The play method is the main entry point of the entire game. It contains
     * some setup code and a game loop
     */
    Game.prototype.play = function () {
        this.setup();
        while ((this.finished === false)) {
            this.loop();
            this.env.advanceOneFrame();
        }
        ;
        this.env.exit();
    };
    return Game;
}());
Game["__class"] = "Game";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * A monster with various states
 *
 */
var Monster = (function () {
    /**
     * Constructor for objects of class Monster
     */
    function Monster(x, y, z) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.scale = 0;
        this.rotateX = 0;
        this.rotateY = 0;
        this.rotateZ = 0;
        this.frame = 0;
        this.x = x;
        this.y = y;
        this.z = z;
        this.texture = "models/Boss/boss.png";
        this.scale = 1;
        this.rotateY = 0;
        this.frame = 0;
        this.state = "idle";
        this.loadModels();
        this.model = this.idleModels.get(0);
    }
    /**
     * Load all the models into the proper ArrayList
     */
    Monster.prototype.loadModels = function () {
        this.idleModels = (new java.util.ArrayList());
        this.idleModels.add("models/Boss/Idle/bossidle00.obj");
        this.idleModels.add("models/Boss/Idle/bossidle01.obj");
        this.idleModels.add("models/Boss/Idle/bossidle02.obj");
        this.idleModels.add("models/Boss/Idle/bossidle03.obj");
        this.idleModels.add("models/Boss/Idle/bossidle04.obj");
        this.idleModels.add("models/Boss/Idle/bossidle05.obj");
        this.idleModels.add("models/Boss/Idle/bossidle06.obj");
        this.idleModels.add("models/Boss/Idle/bossidle07.obj");
        this.idleModels.add("models/Boss/Idle/bossidle08.obj");
        this.idleModels.add("models/Boss/Idle/bossidle09.obj");
        this.idleModels.add("models/Boss/Idle/bossidle10.obj");
        this.idleModels.add("models/Boss/Idle/bossidle11.obj");
        this.idleModels.add("models/Boss/Idle/bossidle12.obj");
        this.idleModels.add("models/Boss/Idle/bossidle13.obj");
        this.idleModels.add("models/Boss/Idle/bossidle14.obj");
        this.idleModels.add("models/Boss/Idle/bossidle15.obj");
        this.idleModels.add("models/Boss/Idle/bossidle16.obj");
        this.idleModels.add("models/Boss/Idle/bossidle17.obj");
        this.idleModels.add("models/Boss/Idle/bossidle18.obj");
        this.idleModels.add("models/Boss/Idle/bossidle19.obj");
        this.swipeModels = (new java.util.ArrayList());
        this.swipeModels.add("models/Boss/Swipe/bossswipe00.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe01.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe02.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe03.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe04.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe05.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe06.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe07.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe08.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe09.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe10.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe11.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe12.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe13.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe14.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe15.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe16.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe17.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe18.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe19.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe20.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe21.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe22.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe23.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe24.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe25.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe26.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe27.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe28.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe29.obj");
        this.runModels = (new java.util.ArrayList());
        this.runModels.add("models/Boss/Run/bossrun00.obj");
        this.runModels.add("models/Boss/Run/bossrun01.obj");
        this.runModels.add("models/Boss/Run/bossrun02.obj");
        this.runModels.add("models/Boss/Run/bossrun03.obj");
        this.runModels.add("models/Boss/Run/bossrun04.obj");
        this.runModels.add("models/Boss/Run/bossrun05.obj");
        this.runModels.add("models/Boss/Run/bossrun06.obj");
        this.runModels.add("models/Boss/Run/bossrun07.obj");
        this.runModels.add("models/Boss/Run/bossrun08.obj");
        this.runModels.add("models/Boss/Run/bossrun09.obj");
        this.runModels.add("models/Boss/Run/bossrun10.obj");
        this.runModels.add("models/Boss/Run/bossrun11.obj");
        this.runModels.add("models/Boss/Run/bossrun12.obj");
        this.runModels.add("models/Boss/Run/bossrun13.obj");
        this.runModels.add("models/Boss/Run/bossrun14.obj");
        this.runModels.add("models/Boss/Run/bossrun15.obj");
        this.runModels.add("models/Boss/Run/bossrun16.obj");
        this.runModels.add("models/Boss/Run/bossrun17.obj");
        this.runModels.add("models/Boss/Run/bossrun18.obj");
        this.runModels.add("models/Boss/Run/bossrun19.obj");
        this.runModels.add("models/Boss/Run/bossrun20.obj");
        this.runModels.add("models/Boss/Run/bossrun21.obj");
        this.runModels.add("models/Boss/Run/bossrun22.obj");
        this.runModels.add("models/Boss/Run/bossrun23.obj");
        this.runModels.add("models/Boss/Run/bossrun24.obj");
        this.runModels.add("models/Boss/Run/bossrun25.obj");
        this.runModels.add("models/Boss/Run/bossrun26.obj");
        this.runModels.add("models/Boss/Run/bossrun27.obj");
        this.runModels.add("models/Boss/Run/bossrun28.obj");
        this.runModels.add("models/Boss/Run/bossrun29.obj");
    };
    /**
     * The move method is called every frame.
     * It's purpose is to check the different state and
     * mutate monster accordingly
     */
    Monster.prototype.move = function () {
        this.frame++;
        if ((this.state === "idle")) {
            this.idleAction();
        }
        else if ((this.state === "swipe")) {
            this.swipeAction();
        }
        else if ((this.state === "run")) {
            this.runAction();
        }
    };
    /**
     * Change the state to idle
     */
    Monster.prototype.idle = function () {
        this.frame = 0;
        this.state = "idle";
    };
    /**
     * Change the state to swipe
     */
    Monster.prototype.swipe = function () {
        this.frame = 0;
        this.state = "swipe";
    };
    /**
     * Load the correct model when monster is idle
     */
    Monster.prototype.idleAction = function () {
        if (this.frame < this.idleModels.size()) {
            this.model = this.idleModels.get(this.frame);
        }
        else {
            this.frame = 0;
        }
    };
    /**
     * Load the correct model when monster is swiping
     */
    Monster.prototype.swipeAction = function () {
        if (this.frame < this.swipeModels.size()) {
            this.model = this.swipeModels.get(this.frame);
        }
        else {
            this.idle();
        }
    };
    /**
     * Load the correct model when monster is running
     */
    Monster.prototype.runAction = function () {
        if (this.frame < this.runModels.size()) {
            this.model = this.runModels.get(this.frame);
        }
        else {
            this.idle();
        }
    };
    /**
     * Move monster in the x direction, change model as needed
     */
    Monster.prototype.moveX = function (delta) {
        if (!(this.state === "run")) {
            this.state = "run";
            this.frame = 0;
        }
        this.x += delta;
        if (delta < 0) {
            this.rotateY = -90;
        }
        else {
            this.rotateY = 90;
        }
    };
    /**
     * Move monster in the z direction, change model as needed
     */
    Monster.prototype.moveZ = function (delta) {
        if (!(this.state === "run")) {
            this.state = "run";
            this.frame = 0;
        }
        this.z += delta;
        if (delta < 0) {
            this.rotateY = 180;
        }
        else {
            this.rotateY = 0;
        }
    };
    /**
     * Accessor for x, y, z, and rotateY, and state
     */
    Monster.prototype.getX = function () {
        return this.x;
    };
    Monster.prototype.getY = function () {
        return this.y;
    };
    Monster.prototype.getZ = function () {
        return this.z;
    };
    Monster.prototype.getRotateY = function () {
        return this.rotateY;
    };
    Monster.prototype.getState = function () {
        return this.state;
    };
    return Monster;
}());
Monster["__class"] = "Monster";
//# sourceMappingURL=bundle.js.map
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Ball = (function () {
    /**
     * Constructor for objects of class Ball
     */
    function Ball(x, y, z) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.scale = 0;
        this.dir = 0;
        this.x = x;
        this.y = y;
        this.z = z;
        this.scale = 0.2;
    }
    Ball.prototype.setXYZ = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    };
    Ball.prototype.getX = function () {
        return this.x;
    };
    Ball.prototype.getY = function () {
        return this.y;
    };
    Ball.prototype.getZ = function () {
        return this.z;
    };
    /**
     * Set the direction of the ball
     */
    Ball.prototype.setDir = function (angle) {
        this.dir = angle;
    };
    /**
     * Move the ball based on it's direction
     */
    Ball.prototype.move = function () {
        if (this.dir === -90) {
            this.x -= 0.1;
        }
        else if (this.dir === 90) {
            this.x += 0.1;
        }
        else if (this.dir === 180) {
            this.z -= 0.1;
        }
        else if (this.dir === 0) {
            this.z += 0.1;
        }
    };
    return Ball;
}());
Ball["__class"] = "Ball";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * A Block prevents the player from moving.
 *
 */
var Block = (function () {
    /**
     * Constructor for objects of class Block
     */
    function Block(x, y, z, desc) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.scale = 0;
        this.x = x;
        this.y = y;
        this.z = z;
        this.scale = 0.5;
        this.desc = desc;
    }
    /**
     * Make the block disappear
     */
    Block.prototype.disappear = function () {
        this.x = 100;
    };
    /**
     * Accessor for the block's description
     */
    Block.prototype.getDesc = function () {
        return this.desc;
    };
    /**
     * Accessor for the block's location
     */
    Block.prototype.getX = function () {
        return this.x;
    };
    /**
     * Accessor for the block's location
     */
    Block.prototype.getY = function () {
        return this.y;
    };
    /**
     * Accessor for the block's location
     */
    Block.prototype.getZ = function () {
        return this.z;
    };
    /**
     * Accessor for the block's size
     */
    Block.prototype.getScale = function () {
        return this.scale;
    };
    return Block;
}());
Block["__class"] = "Block";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * Doty is the main character of the game
 *
 */
var Doty = (function () {
    /**
     * Constructor for objects of class Doty
     */
    function Doty(x, y, z) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.prev_x = 0;
        this.prev_y = 0;
        this.prev_z = 0;
        this.scale = 0;
        this.rotateY = 0;
        this.roomWidth = 0;
        this.roomDepth = 0;
        this.x = x;
        this.y = y;
        this.z = z;
        this.prev_x = x;
        this.prev_y = y;
        this.prev_z = z;
        this.texture = "textures/doty.png";
        this.scale = 1;
        this.rotateY = 0;
    }
    /**
     * Set the dimension of the room Doty is in
     */
    Doty.prototype.setRoomDim = function (w, d) {
        this.roomWidth = w;
        this.roomDepth = d;
    };
    /**
     * This method is called when Doty exits from a room.
     * If Doty exits from the east, then set Doty's position to the
     * west side of the new room.
     *
     * @param dir The direction in which Doty exited from.
     */
    Doty.prototype.setExitFrom = function (dir) {
        if ((dir === "east")) {
            this.setX(this.scale);
        }
        else if ((dir === "west")) {
            this.setX(this.roomWidth - this.scale);
        }
    };
    /**
     * Move doty in the x direction.
     */
    Doty.prototype.moveX = function (delta) {
        if (delta > 0) {
            this.rotateY = 90;
        }
        else {
            this.rotateY = -90;
        }
        this.prev_z = this.z;
        this.prev_x = this.x;
        this.x = this.x + delta;
    };
    /**
     * Move doty in the z direction
     */
    Doty.prototype.moveZ = function (delta) {
        if (delta > 0) {
            this.rotateY = 0;
        }
        else {
            this.rotateY = 180;
        }
        this.prev_z = this.z;
        this.prev_x = this.x;
        this.z = this.z + delta;
    };
    /**
     * Reverts doty back to the previous position
     */
    Doty.prototype.revert = function () {
        this.x = this.prev_x;
        this.z = this.prev_z;
    };
    Doty.prototype.getX = function () {
        return this.x;
    };
    Doty.prototype.getY = function () {
        return this.y;
    };
    Doty.prototype.getZ = function () {
        return this.z;
    };
    Doty.prototype.getScale = function () {
        return this.scale;
    };
    Doty.prototype.setX = function (x) {
        this.x = x;
    };
    Doty.prototype.setY = function (y) {
        this.y = y;
    };
    Doty.prototype.setZ = function (z) {
        this.z = z;
    };
    return Doty;
}());
Doty["__class"] = "Doty";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 *
 * The Game class. This class is the entry point of the program and contains a
 * controller loop.
 */
var Game = (function () {
    /**
     * The constructor. It sets up all the rooms and necessary objects in each
     * room.
     */
    function Game() {
        this.finished = false;
        this.roomLeft = new Room(10, 13.001, 10, "The left room");
        this.roomRight = new Room(10, 13.001, 10, "The right room");
        this.roomLeft.setExit("east", this.roomRight);
        this.roomLeft.setTextureEast("textures/door.png");
        this.roomLeft.addBlock(new Block(1, 1, 4, "Normal Block"));
        this.roomLeft.addBlock(new Block(4, 1, 8, "Normal Block"));
        this.roomLeft.addBlock(new Block(7, 1, 3, "Normal Block"));
        this.roomRight.setExit("west", this.roomLeft);
        this.roomRight.setTextureWest("textures/door.png");
        this.roomRight.addBlock(new Block(3, 1, 4, "Normal Block"));
        this.roomRight.addBlock(new Block(5, 1, 2, "Breakable Block"));
        this.roomRight.addBlock(new Block(6, 1, 8, "Normal Block"));
        this.doty1 = new Doty(5, 1, 1);
    }
    Game.prototype.setup = function () {
        this.finished = false;
        this.env = new env3d.Env();
        this.setCurrentRoom(this.roomLeft);
        this.doty1.setRoomDim(this.currentRoom.getWidth(), this.currentRoom.getDepth());
        this.env.addObject(this.doty1);
        this.env.setCameraXYZ(5, 13, 9);
        this.env.setCameraPitch(-75);
        this.env.setDefaultControl(false);
    };
    Game.prototype.loop = function () {
        this.processInput();
        this.checkWall();
        this.checkCollision();
    };
    /**
     * The play method contains the controller loop.
     */
    Game.prototype.play = function () {
        this.setup();
        while ((this.finished === false)) {
            this.loop();
            this.env.advanceOneFrame();
        }
        ;
        this.env.exit();
    };
    /**
     * Helper method for setting the current room to a particular room.
     *
     * @param room The room to set the current room to.
     */
    Game.prototype.setCurrentRoom = function (room) {
        if (room != null) {
            this.currentRoom = room;
            this.env.setRoom(this.currentRoom);
            for (var index141 = this.currentRoom.getBlocks().iterator(); index141.hasNext();) {
                var block = index141.next();
                {
                    this.env.addObject(block);
                }
            }
        }
    };
    /**
     * Process the user input
     */
    Game.prototype.processInput = function () {
        var currentKey = this.env.getKeyDown();
        if (currentKey !== 0) {
            this.env.setDisplayStr("");
        }
        if (currentKey === org.lwjgl.input.Keyboard.KEY_ESCAPE) {
            this.finished = true;
        }
        else if (currentKey === org.lwjgl.input.Keyboard.KEY_UP) {
            this.doty1.moveZ(-0.05);
        }
        else if (currentKey === org.lwjgl.input.Keyboard.KEY_DOWN) {
            this.doty1.moveZ(0.05);
        }
        else if (currentKey === org.lwjgl.input.Keyboard.KEY_LEFT) {
            this.doty1.moveX(-0.05);
        }
        else if (currentKey === org.lwjgl.input.Keyboard.KEY_RIGHT) {
            this.doty1.moveX(0.05);
        }
        else if (currentKey === org.lwjgl.input.Keyboard.KEY_L) {
            this.env.setDisplayStr(this.currentRoom.getDescription());
            for (var index142 = this.currentRoom.getBlocks().iterator(); index142.hasNext();) {
                var block = index142.next();
                {
                    var dist = this.distance(this.doty1.getX(), block.getX(), this.doty1.getY(), block.getY(), this.doty1.getZ(), block.getZ());
                    if (dist <= this.doty1.getScale() * 1.2 + block.getScale()) {
                        this.env.setDisplayStr(block.getDesc());
                    }
                }
            }
        }
    };
    /**
     * Check to see if Doty is close to a wall, and exit to the next room if
     * necessary
     */
    Game.prototype.checkWall = function () {
        if (this.doty1.getX() > this.currentRoom.getWidth() - this.doty1.getScale()) {
            this.exitTo("east");
        }
        else if (this.doty1.getX() < this.doty1.getScale()) {
            this.exitTo("west");
        }
    };
    /**
     * A helper method to reduce duplicated code in checkWall
     */
    Game.prototype.exitTo = function (dir) {
        if (this.currentRoom.getExit(dir) != null) {
            this.setCurrentRoom(this.currentRoom.getExit(dir));
            this.doty1.setRoomDim(this.currentRoom.getWidth(), this.currentRoom.getDepth());
            this.doty1.setExitFrom(dir);
            this.env.addObject(this.doty1);
        }
        else {
            this.doty1.revert();
        }
    };
    /**
     * Check to see if any collision occur between Doty and the objects in the
     * current room
     */
    Game.prototype.checkCollision = function () {
        for (var index143 = this.currentRoom.getBlocks().iterator(); index143.hasNext();) {
            var block = index143.next();
            {
                var dist = this.distance(block.getX(), this.doty1.getX(), block.getY(), this.doty1.getY(), block.getZ(), this.doty1.getZ());
                if (dist <= block.getScale() + this.doty1.getScale()) {
                    this.doty1.revert();
                }
            }
        }
    };
    /**
     * The private distance method
     */
    Game.prototype.distance = function (x1, x2, y1, y2, z1, z2) {
        var xdiff;
        var ydiff;
        var zdiff;
        xdiff = x2 - x1;
        ydiff = y2 - y1;
        zdiff = z2 - z1;
        return Math.sqrt(xdiff * xdiff + ydiff * ydiff + zdiff * zdiff);
    };
    Game.main = function (args) {
        (new Game()).play();
    };
    return Game;
}());
Game["__class"] = "Game";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * A monster with various states
 *
 */
var Monster = (function () {
    /**
     * Constructor for objects of class Monster
     */
    function Monster(x, y, z) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.scale = 0;
        this.rotateX = 0;
        this.rotateY = 0;
        this.rotateZ = 0;
        this.frame = 0;
        this.x = x;
        this.y = y;
        this.z = z;
        this.texture = "models/Boss/boss.png";
        this.scale = 1;
        this.rotateY = 0;
        this.frame = 0;
        this.state = "idle";
        this.loadModels();
        this.model = this.idleModels.get(0);
    }
    /**
     * Load all the models into the proper ArrayList
     */
    Monster.prototype.loadModels = function () {
        this.idleModels = (new java.util.ArrayList());
        this.idleModels.add("models/Boss/Idle/bossidle00.obj");
        this.idleModels.add("models/Boss/Idle/bossidle01.obj");
        this.idleModels.add("models/Boss/Idle/bossidle02.obj");
        this.idleModels.add("models/Boss/Idle/bossidle03.obj");
        this.idleModels.add("models/Boss/Idle/bossidle04.obj");
        this.idleModels.add("models/Boss/Idle/bossidle05.obj");
        this.idleModels.add("models/Boss/Idle/bossidle06.obj");
        this.idleModels.add("models/Boss/Idle/bossidle07.obj");
        this.idleModels.add("models/Boss/Idle/bossidle08.obj");
        this.idleModels.add("models/Boss/Idle/bossidle09.obj");
        this.idleModels.add("models/Boss/Idle/bossidle10.obj");
        this.idleModels.add("models/Boss/Idle/bossidle11.obj");
        this.idleModels.add("models/Boss/Idle/bossidle12.obj");
        this.idleModels.add("models/Boss/Idle/bossidle13.obj");
        this.idleModels.add("models/Boss/Idle/bossidle14.obj");
        this.idleModels.add("models/Boss/Idle/bossidle15.obj");
        this.idleModels.add("models/Boss/Idle/bossidle16.obj");
        this.idleModels.add("models/Boss/Idle/bossidle17.obj");
        this.idleModels.add("models/Boss/Idle/bossidle18.obj");
        this.idleModels.add("models/Boss/Idle/bossidle19.obj");
        this.swipeModels = (new java.util.ArrayList());
        this.swipeModels.add("models/Boss/Swipe/bossswipe00.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe01.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe02.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe03.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe04.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe05.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe06.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe07.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe08.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe09.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe10.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe11.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe12.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe13.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe14.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe15.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe16.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe17.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe18.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe19.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe20.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe21.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe22.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe23.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe24.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe25.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe26.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe27.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe28.obj");
        this.swipeModels.add("models/Boss/Swipe/bossswipe29.obj");
        this.runModels = (new java.util.ArrayList());
        this.runModels.add("models/Boss/Run/bossrun00.obj");
        this.runModels.add("models/Boss/Run/bossrun01.obj");
        this.runModels.add("models/Boss/Run/bossrun02.obj");
        this.runModels.add("models/Boss/Run/bossrun03.obj");
        this.runModels.add("models/Boss/Run/bossrun04.obj");
        this.runModels.add("models/Boss/Run/bossrun05.obj");
        this.runModels.add("models/Boss/Run/bossrun06.obj");
        this.runModels.add("models/Boss/Run/bossrun07.obj");
        this.runModels.add("models/Boss/Run/bossrun08.obj");
        this.runModels.add("models/Boss/Run/bossrun09.obj");
        this.runModels.add("models/Boss/Run/bossrun10.obj");
        this.runModels.add("models/Boss/Run/bossrun11.obj");
        this.runModels.add("models/Boss/Run/bossrun12.obj");
        this.runModels.add("models/Boss/Run/bossrun13.obj");
        this.runModels.add("models/Boss/Run/bossrun14.obj");
        this.runModels.add("models/Boss/Run/bossrun15.obj");
        this.runModels.add("models/Boss/Run/bossrun16.obj");
        this.runModels.add("models/Boss/Run/bossrun17.obj");
        this.runModels.add("models/Boss/Run/bossrun18.obj");
        this.runModels.add("models/Boss/Run/bossrun19.obj");
        this.runModels.add("models/Boss/Run/bossrun20.obj");
        this.runModels.add("models/Boss/Run/bossrun21.obj");
        this.runModels.add("models/Boss/Run/bossrun22.obj");
        this.runModels.add("models/Boss/Run/bossrun23.obj");
        this.runModels.add("models/Boss/Run/bossrun24.obj");
        this.runModels.add("models/Boss/Run/bossrun25.obj");
        this.runModels.add("models/Boss/Run/bossrun26.obj");
        this.runModels.add("models/Boss/Run/bossrun27.obj");
        this.runModels.add("models/Boss/Run/bossrun28.obj");
        this.runModels.add("models/Boss/Run/bossrun29.obj");
    };
    /**
     * The move method is called every frame.
     * It's purpose is to check the different state and
     * mutate monster accordingly
     */
    Monster.prototype.move = function () {
        this.frame++;
        if ((this.state === "idle")) {
            this.idleAction();
        }
        else if ((this.state === "swipe")) {
            this.swipeAction();
        }
        else if ((this.state === "run")) {
            this.runAction();
        }
    };
    /**
     * Change the state to idle
     */
    Monster.prototype.idle = function () {
        this.frame = 0;
        this.state = "idle";
    };
    /**
     * Change the state to swipe
     */
    Monster.prototype.swipe = function () {
        this.frame = 0;
        this.state = "swipe";
    };
    /**
     * Load the correct model when monster is idle
     */
    Monster.prototype.idleAction = function () {
        if (this.frame < this.idleModels.size()) {
            this.model = this.idleModels.get(this.frame);
        }
        else {
            this.frame = 0;
        }
    };
    /**
     * Load the correct model when monster is swiping
     */
    Monster.prototype.swipeAction = function () {
        if (this.frame < this.swipeModels.size()) {
            this.model = this.swipeModels.get(this.frame);
        }
        else {
            this.idle();
        }
    };
    /**
     * Load the correct model when monster is running
     */
    Monster.prototype.runAction = function () {
        if (this.frame < this.runModels.size()) {
            this.model = this.runModels.get(this.frame);
        }
        else {
            this.idle();
        }
    };
    /**
     * Move monster in the x direction, change model as needed
     */
    Monster.prototype.moveX = function (delta) {
        if (!(this.state === "run")) {
            this.state = "run";
            this.frame = 0;
        }
        this.x += delta;
        if (delta < 0) {
            this.rotateY = -90;
        }
        else {
            this.rotateY = 90;
        }
    };
    /**
     * Move monster in the z direction, change model as needed
     */
    Monster.prototype.moveZ = function (delta) {
        if (!(this.state === "run")) {
            this.state = "run";
            this.frame = 0;
        }
        this.z += delta;
        if (delta < 0) {
            this.rotateY = 180;
        }
        else {
            this.rotateY = 0;
        }
    };
    /**
     * Accessor for x, y, z, and rotateY, and state
     */
    Monster.prototype.getX = function () {
        return this.x;
    };
    Monster.prototype.getY = function () {
        return this.y;
    };
    Monster.prototype.getZ = function () {
        return this.z;
    };
    Monster.prototype.getRotateY = function () {
        return this.rotateY;
    };
    Monster.prototype.getState = function () {
        return this.state;
    };
    return Monster;
}());
Monster["__class"] = "Monster";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * A room describes the current environment.  Only one
 * room can be displayed at one time.
 *
 */
var Room = (function () {
    /**
     * Constructor for objects of class Room
     */
    function Room(w, h, d, desc) {
        this.width = 0;
        this.height = 0;
        this.depth = 0;
        this.width = w;
        this.height = h;
        this.depth = d;
        this.description = desc;
        this.textureNorth = "textures/fence0.png";
        this.textureEast = "textures/fence0.png";
        this.textureSouth = "textures/fence0.png";
        this.textureWest = "textures/fence0.png";
        this.blocks = (new java.util.ArrayList());
        this.exits = (new java.util.HashMap());
    }
    /**
     * Add a block to this room.
     *
     * @param block The block object to be added to the room
     */
    Room.prototype.addBlock = function (block) {
        this.blocks.add(block);
    };
    /**
     * Get the block
     *
     * @return The collection of blocks
     */
    Room.prototype.getBlocks = function () {
        return this.blocks;
    };
    /**
     * Get the description of the room
     *
     * @return The description string
     */
    Room.prototype.getDescription = function () {
        return this.description;
    };
    /**
     * Mutator for the wall texture
     */
    Room.prototype.setTextureNorth = function (fileName) {
        this.textureNorth = fileName;
    };
    /**
     * Mutator for the wall texture
     */
    Room.prototype.setTextureEast = function (fileName) {
        this.textureEast = fileName;
    };
    /**
     * Mutator for the wall texture
     */
    Room.prototype.setTextureSouth = function (fileName) {
        this.textureSouth = fileName;
    };
    /**
     * Mutator for the wall texture
     */
    Room.prototype.setTextureWest = function (fileName) {
        this.textureWest = fileName;
    };
    /**
     * Create an exit to a room
     *
     * @param direction the direction of the exit
     * @param room the room that this direction exits to
     */
    Room.prototype.setExit = function (direction, room) {
        this.exits.put(direction, room);
    };
    /**
     * Get the room a direction exits to.
     *
     * @param direction a string indicating a direction
     * @return the room that the direction exits to.  null if no exit
     * in that direction
     */
    Room.prototype.getExit = function (direction) {
        return this.exits.get(direction);
    };
    /**
     * Accessor for the room's dimension
     */
    Room.prototype.getWidth = function () {
        return this.width;
    };
    /**
     * Accessor for room's dimension
     */
    Room.prototype.getDepth = function () {
        return this.depth;
    };
    return Room;
}());
Room["__class"] = "Room";
//# sourceMappingURL=bundle.js.map
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * A Block prevents the player from moving.
 *
 */
var Block = (function () {
    /**
     * Constructor for objects of class Block
     */
    function Block(x, y, z, desc) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.scale = 0;
        this.x = x;
        this.y = y;
        this.z = z;
        this.scale = 0.5;
        this.desc = desc;
    }
    /**
     * Make the block disappear
     */
    Block.prototype.disappear = function () {
        this.x = 100;
    };
    /**
     * Accessor for the block's description
     */
    Block.prototype.getDesc = function () {
        return this.desc;
    };
    /**
     * Accessor for the block's location
     */
    Block.prototype.getX = function () {
        return this.x;
    };
    /**
     * Accessor for the block's location
     */
    Block.prototype.getY = function () {
        return this.y;
    };
    /**
     * Accessor for the block's location
     */
    Block.prototype.getZ = function () {
        return this.z;
    };
    /**
     * Accessor for the block's size
     */
    Block.prototype.getScale = function () {
        return this.scale;
    };
    return Block;
}());
Block["__class"] = "Block";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * Doty is the main character of the game
 *
 */
var Doty = (function () {
    /**
     * Constructor for objects of class Doty
     */
    function Doty(x, y, z) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.prev_x = 0;
        this.prev_y = 0;
        this.prev_z = 0;
        this.scale = 0;
        this.rotateY = 0;
        this.roomWidth = 0;
        this.roomDepth = 0;
        this.x = x;
        this.y = y;
        this.z = z;
        this.prev_x = x;
        this.prev_y = y;
        this.prev_z = z;
        this.texture = "textures/doty.png";
        this.scale = 1;
        this.rotateY = 0;
    }
    /**
     * Set the dimension of the room Doty is in
     */
    Doty.prototype.setRoomDim = function (w, d) {
        this.roomWidth = w;
        this.roomDepth = d;
    };
    /**
     * This method is called when Doty exits from a room.
     * If Doty exits from the east, then set Doty's position to the
     * west side of the new room.
     *
     * @param dir The direction in which Doty exited from.
     */
    Doty.prototype.setExitFrom = function (dir) {
        if ((dir === "east")) {
            this.setX(this.scale);
        }
        else if ((dir === "west")) {
            this.setX(this.roomWidth - this.scale);
        }
    };
    /**
     * Move doty in the x direction.
     */
    Doty.prototype.moveX = function (delta) {
        if (delta > 0) {
            this.rotateY = 90;
        }
        else {
            this.rotateY = -90;
        }
        this.prev_z = this.z;
        this.prev_x = this.x;
        this.x = this.x + delta;
    };
    /**
     * Move doty in the z direction
     */
    Doty.prototype.moveZ = function (delta) {
        if (delta > 0) {
            this.rotateY = 0;
        }
        else {
            this.rotateY = 180;
        }
        this.prev_z = this.z;
        this.prev_x = this.x;
        this.z = this.z + delta;
    };
    /**
     * Reverts doty back to the previous position
     */
    Doty.prototype.revert = function () {
        this.x = this.prev_x;
        this.z = this.prev_z;
    };
    Doty.prototype.getX = function () {
        return this.x;
    };
    Doty.prototype.getY = function () {
        return this.y;
    };
    Doty.prototype.getZ = function () {
        return this.z;
    };
    Doty.prototype.getScale = function () {
        return this.scale;
    };
    Doty.prototype.setX = function (x) {
        this.x = x;
    };
    Doty.prototype.setY = function (y) {
        this.y = y;
    };
    Doty.prototype.setZ = function (z) {
        this.z = z;
    };
    return Doty;
}());
Doty["__class"] = "Doty";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 *
 * The Game class. This class is the entry point of the program and contains a
 * controller loop.
 */
var Game = (function () {
    /**
     * The constructor. It sets up all the rooms and necessary objects in each
     * room.
     */
    function Game() {
        this.finished = false;
        this.roomLeft = new Room(10, 13.001, 10, "The left room");
        this.roomRight = new Room(10, 13.001, 10, "The right room");
        this.roomLeft.setExit("east", this.roomRight);
        this.roomLeft.setTextureEast("textures/door.png");
        this.roomLeft.addBlock(new Block(1, 1, 4, "Normal Block"));
        this.roomLeft.addBlock(new Block(4, 1, 8, "Normal Block"));
        this.roomLeft.addBlock(new Block(7, 1, 3, "Normal Block"));
        this.roomRight.setExit("west", this.roomLeft);
        this.roomRight.setTextureWest("textures/door.png");
        this.roomRight.addBlock(new Block(3, 1, 4, "Normal Block"));
        this.roomRight.addBlock(new Block(5, 1, 2, "Breakable Block"));
        this.roomRight.addBlock(new Block(6, 1, 8, "Normal Block"));
        this.doty1 = new Doty(5, 1, 1);
    }
    Game.prototype.setup = function () {
        this.finished = false;
        this.env = new env3d.Env();
        this.setCurrentRoom(this.roomLeft);
        this.doty1.setRoomDim(this.currentRoom.getWidth(), this.currentRoom.getDepth());
        this.env.addObject(this.doty1);
        this.env.setCameraXYZ(5, 13, 9);
        this.env.setCameraPitch(-75);
        this.env.setDefaultControl(false);
    };
    Game.prototype.loop = function () {
        this.processInput();
        this.checkWall();
        this.checkCollision();
    };
    /**
     * The play method contains the controller loop.
     */
    Game.prototype.play = function () {
        this.setup();
        while ((this.finished === false)) {
            this.loop();
            this.env.advanceOneFrame();
        }
        ;
        this.env.exit();
    };
    /**
     * Helper method for setting the current room to a particular room.
     *
     * @param room The room to set the current room to.
     */
    Game.prototype.setCurrentRoom = function (room) {
        if (room != null) {
            this.currentRoom = room;
            this.env.setRoom(this.currentRoom);
            for (var index144 = this.currentRoom.getBlocks().iterator(); index144.hasNext();) {
                var block = index144.next();
                {
                    this.env.addObject(block);
                }
            }
        }
    };
    /**
     * Process the user input
     */
    Game.prototype.processInput = function () {
        var currentKey = this.env.getKeyDown();
        if (currentKey !== 0) {
            this.env.setDisplayStr("");
        }
        if (currentKey === org.lwjgl.input.Keyboard.KEY_ESCAPE) {
            this.finished = true;
        }
        else if (currentKey === org.lwjgl.input.Keyboard.KEY_UP) {
            this.doty1.moveZ(-0.05);
        }
        else if (currentKey === org.lwjgl.input.Keyboard.KEY_DOWN) {
            this.doty1.moveZ(0.05);
        }
        else if (currentKey === org.lwjgl.input.Keyboard.KEY_LEFT) {
            this.doty1.moveX(-0.05);
        }
        else if (currentKey === org.lwjgl.input.Keyboard.KEY_RIGHT) {
            this.doty1.moveX(0.05);
        }
        else if (currentKey === org.lwjgl.input.Keyboard.KEY_L) {
            this.env.setDisplayStr(this.currentRoom.getDescription());
            for (var index145 = this.currentRoom.getBlocks().iterator(); index145.hasNext();) {
                var block = index145.next();
                {
                    var dist = this.distance(this.doty1.getX(), block.getX(), this.doty1.getY(), block.getY(), this.doty1.getZ(), block.getZ());
                    if (dist <= this.doty1.getScale() * 1.2 + block.getScale()) {
                        this.env.setDisplayStr(block.getDesc());
                    }
                }
            }
        }
    };
    /**
     * Check to see if Doty is close to a wall, and exit to the next room if
     * necessary
     */
    Game.prototype.checkWall = function () {
        if (this.doty1.getX() > this.currentRoom.getWidth() - this.doty1.getScale()) {
            this.exitTo("east");
        }
        else if (this.doty1.getX() < this.doty1.getScale()) {
            this.exitTo("west");
        }
    };
    /**
     * A helper method to reduce duplicated code in checkWall
     */
    Game.prototype.exitTo = function (dir) {
        if (this.currentRoom.getExit(dir) != null) {
            this.setCurrentRoom(this.currentRoom.getExit(dir));
            this.doty1.setRoomDim(this.currentRoom.getWidth(), this.currentRoom.getDepth());
            this.doty1.setExitFrom(dir);
            this.env.addObject(this.doty1);
        }
        else {
            this.doty1.revert();
        }
    };
    /**
     * Check to see if any collision occur between Doty and the objects in the
     * current room
     */
    Game.prototype.checkCollision = function () {
        for (var index146 = this.currentRoom.getBlocks().iterator(); index146.hasNext();) {
            var block = index146.next();
            {
                var dist = this.distance(block.getX(), this.doty1.getX(), block.getY(), this.doty1.getY(), block.getZ(), this.doty1.getZ());
                if (dist <= block.getScale() + this.doty1.getScale()) {
                    this.doty1.revert();
                }
            }
        }
    };
    /**
     * The private distance method
     */
    Game.prototype.distance = function (x1, x2, y1, y2, z1, z2) {
        var xdiff;
        var ydiff;
        var zdiff;
        xdiff = x2 - x1;
        ydiff = y2 - y1;
        zdiff = z2 - z1;
        return Math.sqrt(xdiff * xdiff + ydiff * ydiff + zdiff * zdiff);
    };
    Game.main = function (args) {
        (new Game()).play();
    };
    return Game;
}());
Game["__class"] = "Game";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * A room describes the current environment.  Only one
 * room can be displayed at one time.
 *
 */
var Room = (function () {
    /**
     * Constructor for objects of class Room
     */
    function Room(w, h, d, desc) {
        this.width = 0;
        this.height = 0;
        this.depth = 0;
        this.width = w;
        this.height = h;
        this.depth = d;
        this.description = desc;
        this.textureNorth = "textures/fence0.png";
        this.textureEast = "textures/fence0.png";
        this.textureSouth = "textures/fence0.png";
        this.textureWest = "textures/fence0.png";
        this.blocks = (new java.util.ArrayList());
        this.exits = (new java.util.HashMap());
    }
    /**
     * Add a block to this room.
     *
     * @param block The block object to be added to the room
     */
    Room.prototype.addBlock = function (block) {
        this.blocks.add(block);
    };
    /**
     * Get the block
     *
     * @return The collection of blocks
     */
    Room.prototype.getBlocks = function () {
        return this.blocks;
    };
    /**
     * Get the description of the room
     *
     * @return The description string
     */
    Room.prototype.getDescription = function () {
        return this.description;
    };
    /**
     * Mutator for the wall texture
     */
    Room.prototype.setTextureNorth = function (fileName) {
        this.textureNorth = fileName;
    };
    /**
     * Mutator for the wall texture
     */
    Room.prototype.setTextureEast = function (fileName) {
        this.textureEast = fileName;
    };
    /**
     * Mutator for the wall texture
     */
    Room.prototype.setTextureSouth = function (fileName) {
        this.textureSouth = fileName;
    };
    /**
     * Mutator for the wall texture
     */
    Room.prototype.setTextureWest = function (fileName) {
        this.textureWest = fileName;
    };
    /**
     * Create an exit to a room
     *
     * @param direction the direction of the exit
     * @param room the room that this direction exits to
     */
    Room.prototype.setExit = function (direction, room) {
        this.exits.put(direction, room);
    };
    /**
     * Get the room a direction exits to.
     *
     * @param direction a string indicating a direction
     * @return the room that the direction exits to.  null if no exit
     * in that direction
     */
    Room.prototype.getExit = function (direction) {
        return this.exits.get(direction);
    };
    /**
     * Accessor for the room's dimension
     */
    Room.prototype.getWidth = function () {
        return this.width;
    };
    /**
     * Accessor for room's dimension
     */
    Room.prototype.getDepth = function () {
        return this.depth;
    };
    return Room;
}());
Room["__class"] = "Room";
//# sourceMappingURL=bundle.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Creature = (function (_super) {
    __extends(Creature, _super);
    /**
     * Constructor for objects of class Creature
     */
    function Creature(x, y, z) {
        _super.call(this);
        this.setX(x);
        this.setY(y);
        this.setZ(z);
        this.setScale(1);
    }
    Creature.prototype.move = function (creatures, dead_creatures) {
        var rand = Math.random();
        if (rand < 0.25) {
            this.setX(this.getX() + this.getScale());
        }
        else if (rand < 0.5) {
            this.setX(this.getX() - this.getScale());
        }
        else if (rand < 0.75) {
            this.setZ(this.getZ() + this.getScale());
        }
        else if (rand < 1) {
            this.setZ(this.getZ() - this.getScale());
        }
        if (this.getX() < this.getScale())
            this.setX(this.getScale());
        if (this.getX() > 50 - this.getScale())
            this.setX(50 - this.getScale());
        if (this.getZ() < this.getScale())
            this.setZ(this.getScale());
        if (this.getZ() > 50 - this.getScale())
            this.setZ(50 - this.getScale());
        if (this != null && this instanceof Fox) {
            for (var index147 = creatures.iterator(); index147.hasNext();) {
                var c = index147.next();
                {
                    if (c.distance(this) < c.getScale() + this.getScale() && (c != null && c instanceof Tux)) {
                        dead_creatures.add(c);
                    }
                }
            }
        }
    };
    return Creature;
}(env3d.EnvObject));
Creature["__class"] = "Creature";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * A predator and prey simulation. Fox is the predator and Tux is the prey.
 */
var Game = (function () {
    /**
     * Constructor for the Game class. It sets up the foxes and tuxes.
     */
    function Game() {
        this.finished = false;
        this.creatures = (new java.util.ArrayList());
        for (var i = 0; i < 55; i++) {
            if (i < 5) {
                this.creatures.add(new Fox(((Math.random() * 48) | 0) + 1, 1, ((Math.random() * 48) | 0) + 1));
            }
            else {
                this.creatures.add(new Tux(((Math.random() * 48) | 0) + 1, 1, ((Math.random() * 48) | 0) + 1));
            }
        }
    }
    Game.prototype.setup = function () {
        this.finished = false;
        this.env = new env3d.Env();
        this.env.setRoom(new Room());
        for (var index148 = this.creatures.iterator(); index148.hasNext();) {
            var c = index148.next();
            {
                this.env.addObject(c);
            }
        }
        this.env.setCameraXYZ(25, 50, 55);
        this.env.setCameraPitch(-63);
        this.env.setDefaultControl(false);
        this.dead_creatures = (new java.util.ArrayList());
    };
    Game.prototype.loop = function () {
        if (this.env.getKey() === 1) {
            this.finished = true;
        }
        for (var index149 = this.creatures.iterator(); index149.hasNext();) {
            var c = index149.next();
            {
                c.move(this.creatures, this.dead_creatures);
            }
        }
        for (var index150 = this.dead_creatures.iterator(); index150.hasNext();) {
            var c = index150.next();
            {
                this.env.removeObject(c);
                this.creatures.remove(c);
            }
        }
        this.dead_creatures.clear();
    };
    /**
     * Play the game
     */
    Game.prototype.play = function () {
        this.setup();
        while ((!this.finished)) {
            this.loop();
            this.env.advanceOneFrame();
        }
        ;
        this.env.exit();
    };
    /**
     * Main method to launch the program.
     */
    Game.main = function (args) {
        (new Game()).play();
    };
    return Game;
}());
Game["__class"] = "Game";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Room = (function () {
    /**
     * A room with just marble floor and no walls.
     */
    function Room() {
        this.width = 0;
        this.depth = 0;
        this.height = 0;
        this.width = 50;
        this.depth = 50;
        this.height = 50;
        this.textureBottom = "textures/marble.png";
    }
    return Room;
}());
Room["__class"] = "Room";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Fox = (function (_super) {
    __extends(Fox, _super);
    function Fox(x, y, z) {
        _super.call(this, x, y, z);
        this.setTexture("models/fox/fox.png");
        this.setModel("models/fox/fox.obj");
    }
    return Fox;
}(Creature));
Fox["__class"] = "Fox";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Tux = (function (_super) {
    __extends(Tux, _super);
    function Tux(x, y, z) {
        _super.call(this, x, y, z);
        this.setTexture("models/tux/tux.png");
        this.setModel("models/tux/tux.obj");
    }
    return Tux;
}(Creature));
Tux["__class"] = "Tux";
//# sourceMappingURL=bundle.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Creature = (function (_super) {
    __extends(Creature, _super);
    /**
     * Constructor for objects of class Creature
     */
    function Creature(x, y, z) {
        _super.call(this);
        this.setX(x);
        this.setY(y);
        this.setZ(z);
        this.setScale(1);
    }
    Creature.prototype.move = function (creatures, dead_creatures) {
        var rand = Math.random();
        if (rand < 0.25) {
            this.setX(this.getX() + this.getScale());
        }
        else if (rand < 0.5) {
            this.setX(this.getX() - this.getScale());
        }
        else if (rand < 0.75) {
            this.setZ(this.getZ() + this.getScale());
        }
        else if (rand < 1) {
            this.setZ(this.getZ() - this.getScale());
        }
        if (this.getX() < this.getScale())
            this.setX(this.getScale());
        if (this.getX() > 50 - this.getScale())
            this.setX(50 - this.getScale());
        if (this.getZ() < this.getScale())
            this.setZ(this.getScale());
        if (this.getZ() > 50 - this.getScale())
            this.setZ(50 - this.getScale());
        if (this != null && this instanceof Fox) {
            for (var index151 = creatures.iterator(); index151.hasNext();) {
                var c = index151.next();
                {
                    if (c.distance(this) < c.getScale() + this.getScale() && (c != null && c instanceof Tux)) {
                        dead_creatures.add(c);
                    }
                }
            }
        }
    };
    return Creature;
}(env3d.EnvObject));
Creature["__class"] = "Creature";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * A predator and prey simulation. Fox is the predator and Tux is the prey.
 */
var Game = (function () {
    /**
     * Constructor for the Game class. It sets up the foxes and tuxes.
     */
    function Game() {
        this.finished = false;
        this.creatures = (new java.util.ArrayList());
        for (var i = 0; i < 55; i++) {
            if (i < 5) {
                this.creatures.add(new Fox(((Math.random() * 48) | 0) + 1, 1, ((Math.random() * 48) | 0) + 1));
            }
            else {
                this.creatures.add(new Tux(((Math.random() * 48) | 0) + 1, 1, ((Math.random() * 48) | 0) + 1));
            }
        }
    }
    Game.prototype.setup = function () {
        this.finished = false;
        this.env = new env3d.Env();
        this.env.setRoom(new Room());
        for (var index152 = this.creatures.iterator(); index152.hasNext();) {
            var c = index152.next();
            {
                this.env.addObject(c);
            }
        }
        this.env.setCameraXYZ(25, 50, 55);
        this.env.setCameraPitch(-63);
        this.env.setDefaultControl(false);
        this.dead_creatures = (new java.util.ArrayList());
    };
    Game.prototype.loop = function () {
        if (this.env.getKey() === 1) {
            this.finished = true;
        }
        for (var index153 = this.creatures.iterator(); index153.hasNext();) {
            var c = index153.next();
            {
                c.move(this.creatures, this.dead_creatures);
            }
        }
        for (var index154 = this.dead_creatures.iterator(); index154.hasNext();) {
            var c = index154.next();
            {
                this.env.removeObject(c);
                this.creatures.remove(c);
            }
        }
        this.dead_creatures.clear();
    };
    /**
     * Play the game
     */
    Game.prototype.play = function () {
        this.setup();
        while ((!this.finished)) {
            this.loop();
            this.env.advanceOneFrame();
        }
        ;
        this.env.exit();
    };
    /**
     * Main method to launch the program.
     */
    Game.main = function (args) {
        (new Game()).play();
    };
    return Game;
}());
Game["__class"] = "Game";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Room = (function () {
    /**
     * A room with just marble floor and no walls.
     */
    function Room() {
        this.width = 0;
        this.depth = 0;
        this.height = 0;
        this.width = 50;
        this.depth = 50;
        this.height = 50;
        this.textureBottom = "textures/marble.png";
    }
    return Room;
}());
Room["__class"] = "Room";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Fox = (function (_super) {
    __extends(Fox, _super);
    function Fox(x, y, z) {
        _super.call(this, x, y, z);
        this.setTexture("models/fox/fox.png");
        this.setModel("models/fox/fox.obj");
    }
    return Fox;
}(Creature));
Fox["__class"] = "Fox";
/* Generated from Java with JSweet 1.2.0-SNAPSHOT - http://www.jsweet.org */
var Tux = (function (_super) {
    __extends(Tux, _super);
    function Tux(x, y, z) {
        _super.call(this, x, y, z);
        this.setTexture("models/tux/tux.png");
        this.setModel("models/tux/tux.obj");
    }
    return Tux;
}(Creature));
Tux["__class"] = "Tux";
//# sourceMappingURL=bundle.js.map
