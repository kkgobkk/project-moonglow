const TILESET_TILE_OFFSET_Y = 0, TILESET_ENTITY_OFFSET_Y = 1;

class Interface{
    static canvas;
    static ctx;
    static MAX_X;
    static MAX_Y;
    static tileset;

    static init(){
        Interface.canvas = document.getElementById("main_viewport");
        Interface.ctx = Interface.canvas.getContext("2d");
        Interface.MAX_X = Interface.canvas.width;
        Interface.MAX_Y = Interface.canvas.height;
        Interface.ctx.font = "30px Arial";

        Interface.tileset = document.getElementById("tileset");

        document.addEventListener("keydown", (e) =>
        {
            if (Game.instance.player != null) {
                switch (e.code) {
                    case "KeyW":
                    case "ArrowUp":
                    case "Numpad8":
                    case "KeyK":
                        Game.instance.player.move(0, -1);
                        break;
                    
                    case "KeyA":
                    case "ArrowLeft":
                    case "Numpad4":
                    case "KeyH":
                        Game.instance.player.move(-1, 0);
                        break;
                    
                    case "KeyS":
                    case "ArrowDown":
                    case "Numpad2":
                    case "KeyJ":
                        Game.instance.player.move(0, 1);
                        break;
                    
                    case "KeyD":
                    case "ArrowRight":
                    case "Numpad6":
                    case "KeyL":
                        Game.instance.player.move(1, 0);
                        break;

                    case "Numpad7":
                    case "KeyY":
                        Game.instance.player.move(-1, -1);
                        break;
                    
                    case "Numpad9":
                    case "KeyU":
                        Game.instance.player.move(1, -1);
                        break;
                    
                    case "Numpad1":
                    case "KeyB":
                        Game.instance.player.move(-1, 1);
                        break;

                    case "Numpad3":
                    case "KeyN":
                        Game.instance.player.move(1, 1);
                        break;
                    
                    case "Numpad5":
                    case "KeyZ":
                        Game.instance.player.move(0, 0);
                        break;

                    default:
                        break;
                }
            }
        }
);
    }

    static clearScreen(){
        Interface.ctx.clearRect(0, 0, Interface.MAX_X, Interface.MAX_Y)
    }
}