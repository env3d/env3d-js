var org;
(function (org) {
    var lwjgl;
    (function (lwjgl) {
        var input;
        (function (input) {
            var Keyboard = (function () {
                function Keyboard() {
                }
                Keyboard.KEY_LWIN_$LI$ = function () { if (Keyboard.KEY_LWIN == null)
                    Keyboard.KEY_LWIN = Keyboard.KEY_LMETA; return Keyboard.KEY_LWIN; };
                ;
                Keyboard.KEY_RWIN_$LI$ = function () { if (Keyboard.KEY_RWIN == null)
                    Keyboard.KEY_RWIN = Keyboard.KEY_RMETA; return Keyboard.KEY_RWIN; };
                ;
                /**
                 * The special character meaning that no
                 * character was translated for the event.
                 */
                Keyboard.CHAR_NONE = ('\u0000').charCodeAt(0);
                /**
                 * The special keycode meaning that only the
                 * translated character is valid.
                 */
                Keyboard.KEY_NONE = 0;
                Keyboard.KEY_ESCAPE = 1;
                Keyboard.KEY_1 = 2;
                Keyboard.KEY_2 = 3;
                Keyboard.KEY_3 = 4;
                Keyboard.KEY_4 = 5;
                Keyboard.KEY_5 = 6;
                Keyboard.KEY_6 = 7;
                Keyboard.KEY_7 = 8;
                Keyboard.KEY_8 = 9;
                Keyboard.KEY_9 = 10;
                Keyboard.KEY_0 = 11;
                Keyboard.KEY_MINUS = 12;
                Keyboard.KEY_EQUALS = 13;
                Keyboard.KEY_BACK = 14;
                Keyboard.KEY_TAB = 15;
                Keyboard.KEY_Q = 16;
                Keyboard.KEY_W = 17;
                Keyboard.KEY_E = 18;
                Keyboard.KEY_R = 19;
                Keyboard.KEY_T = 20;
                Keyboard.KEY_Y = 21;
                Keyboard.KEY_U = 22;
                Keyboard.KEY_I = 23;
                Keyboard.KEY_O = 24;
                Keyboard.KEY_P = 25;
                Keyboard.KEY_LBRACKET = 26;
                Keyboard.KEY_RBRACKET = 27;
                Keyboard.KEY_RETURN = 28;
                Keyboard.KEY_LCONTROL = 29;
                Keyboard.KEY_A = 30;
                Keyboard.KEY_S = 31;
                Keyboard.KEY_D = 32;
                Keyboard.KEY_F = 33;
                Keyboard.KEY_G = 34;
                Keyboard.KEY_H = 35;
                Keyboard.KEY_J = 36;
                Keyboard.KEY_K = 37;
                Keyboard.KEY_L = 38;
                Keyboard.KEY_SEMICOLON = 39;
                Keyboard.KEY_APOSTROPHE = 40;
                Keyboard.KEY_GRAVE = 41;
                Keyboard.KEY_LSHIFT = 42;
                Keyboard.KEY_BACKSLASH = 43;
                Keyboard.KEY_Z = 44;
                Keyboard.KEY_X = 45;
                Keyboard.KEY_C = 46;
                Keyboard.KEY_V = 47;
                Keyboard.KEY_B = 48;
                Keyboard.KEY_N = 49;
                Keyboard.KEY_M = 50;
                Keyboard.KEY_COMMA = 51;
                Keyboard.KEY_PERIOD = 52;
                Keyboard.KEY_SLASH = 53;
                Keyboard.KEY_RSHIFT = 54;
                Keyboard.KEY_MULTIPLY = 55;
                Keyboard.KEY_LMENU = 56;
                Keyboard.KEY_SPACE = 57;
                Keyboard.KEY_CAPITAL = 58;
                Keyboard.KEY_F1 = 59;
                Keyboard.KEY_F2 = 60;
                Keyboard.KEY_F3 = 61;
                Keyboard.KEY_F4 = 62;
                Keyboard.KEY_F5 = 63;
                Keyboard.KEY_F6 = 64;
                Keyboard.KEY_F7 = 65;
                Keyboard.KEY_F8 = 66;
                Keyboard.KEY_F9 = 67;
                Keyboard.KEY_F10 = 68;
                Keyboard.KEY_NUMLOCK = 69;
                Keyboard.KEY_SCROLL = 70;
                Keyboard.KEY_NUMPAD7 = 71;
                Keyboard.KEY_NUMPAD8 = 72;
                Keyboard.KEY_NUMPAD9 = 73;
                Keyboard.KEY_SUBTRACT = 74;
                Keyboard.KEY_NUMPAD4 = 75;
                Keyboard.KEY_NUMPAD5 = 76;
                Keyboard.KEY_NUMPAD6 = 77;
                Keyboard.KEY_ADD = 78;
                Keyboard.KEY_NUMPAD1 = 79;
                Keyboard.KEY_NUMPAD2 = 80;
                Keyboard.KEY_NUMPAD3 = 81;
                Keyboard.KEY_NUMPAD0 = 82;
                Keyboard.KEY_DECIMAL = 83;
                Keyboard.KEY_F11 = 87;
                Keyboard.KEY_F12 = 88;
                Keyboard.KEY_F13 = 100;
                Keyboard.KEY_F14 = 101;
                Keyboard.KEY_F15 = 102;
                Keyboard.KEY_F16 = 103;
                Keyboard.KEY_F17 = 104;
                Keyboard.KEY_F18 = 105;
                Keyboard.KEY_KANA = 112;
                Keyboard.KEY_F19 = 113;
                Keyboard.KEY_CONVERT = 121;
                Keyboard.KEY_NOCONVERT = 123;
                Keyboard.KEY_YEN = 125;
                Keyboard.KEY_NUMPADEQUALS = 141;
                Keyboard.KEY_CIRCUMFLEX = 144;
                Keyboard.KEY_AT = 145;
                Keyboard.KEY_COLON = 146;
                Keyboard.KEY_UNDERLINE = 147;
                Keyboard.KEY_KANJI = 148;
                Keyboard.KEY_STOP = 149;
                Keyboard.KEY_AX = 150;
                Keyboard.KEY_UNLABELED = 151;
                Keyboard.KEY_NUMPADENTER = 156;
                Keyboard.KEY_RCONTROL = 157;
                Keyboard.KEY_SECTION = 167;
                Keyboard.KEY_NUMPADCOMMA = 179;
                Keyboard.KEY_DIVIDE = 181;
                Keyboard.KEY_SYSRQ = 183;
                Keyboard.KEY_RMENU = 184;
                Keyboard.KEY_FUNCTION = 196;
                Keyboard.KEY_PAUSE = 197;
                Keyboard.KEY_HOME = 199;
                Keyboard.KEY_UP = 200;
                Keyboard.KEY_PRIOR = 201;
                Keyboard.KEY_LEFT = 203;
                Keyboard.KEY_RIGHT = 205;
                Keyboard.KEY_END = 207;
                Keyboard.KEY_DOWN = 208;
                Keyboard.KEY_NEXT = 209;
                Keyboard.KEY_INSERT = 210;
                Keyboard.KEY_DELETE = 211;
                Keyboard.KEY_CLEAR = 218;
                Keyboard.KEY_LMETA = 219;
                Keyboard.KEY_RMETA = 220;
                Keyboard.KEY_APPS = 221;
                Keyboard.KEY_POWER = 222;
                Keyboard.KEY_SLEEP = 223;
                Keyboard.KEYBOARD_SIZE = 256;

                // reassigning for browser
                Keyboard.KEY_UP = 38;                
                Keyboard.KEY_LEFT = 37;
                Keyboard.KEY_RIGHT = 39;
                Keyboard.KEY_DOWN = 40;
                Keyboard.KEY_L = 76;
                Keyboard.KEY_S = 83;               
                
                /**
                 * Buffer size in events
                 */
                Keyboard.BUFFER_SIZE = 50;
                return Keyboard;
            }());
            input.Keyboard = Keyboard;
            Keyboard["__class"] = "org.lwjgl.input.Keyboard";
        })(input = lwjgl.input || (lwjgl.input = {}));
    })(lwjgl = org.lwjgl || (org.lwjgl = {}));
})(org || (org = {}));
org.lwjgl.input.Keyboard.KEY_RWIN_$LI$();
org.lwjgl.input.Keyboard.KEY_LWIN_$LI$();

window['org'] = org;


var Keyboard = {
    // reassign for web
    KEY_UP : 38,                
    KEY_LEFT : 37,
    KEY_RIGHT : 39,
    KEY_DOWN : 40,
    KEY_L : 76,
    KEY_S : 83                
}
// We will also create a keyboard class for web use
module.exports = Keyboard;
