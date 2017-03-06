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
            for (var index205 = creatures.iterator(); index205.hasNext();) {
                var c = index205.next();
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
        for (var index206 = this.creatures.iterator(); index206.hasNext();) {
            var c = index206.next();
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
        for (var index207 = this.creatures.iterator(); index207.hasNext();) {
            var c = index207.next();
            {
                c.move(this.creatures, this.dead_creatures);
            }
        }
        for (var index208 = this.dead_creatures.iterator(); index208.hasNext();) {
            var c = index208.next();
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
