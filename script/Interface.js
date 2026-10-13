const TILESET_TILE_OFFSET_Y = 0, TILESET_ENTITY_OFFSET_Y = 1;

class Interface{
    static canvas;
    static ctx;
    static MAX_X;
    static MAX_Y;
    static tileset;
    static scaleFactor;
    static selectedCell = null;

    static init(){
        Interface.canvas = document.getElementById("main_viewport");
        Interface.ctx = Interface.canvas.getContext("2d");
        Interface.MAX_X = Interface.canvas.width;
        Interface.MAX_Y = Interface.canvas.height;
        Interface.ctx.font = "30px Arial";

        Interface.tileset = document.getElementById("tileset");

        document.addEventListener("keydown", Interface.handleKeyboardInput);
        window.addEventListener("resize", Interface.updateScaling);
        Interface.canvas.addEventListener("mousemove", Interface.handleMouseOver);
        Interface.canvas.addEventListener("click", Interface.handleLeftClick);

        Interface.updateScaling();
    }

    static clearScreen(){
        Interface.ctx.clearRect(0, 0, Interface.MAX_X, Interface.MAX_Y)
    }

    static updateScaling(e){
        let scalingFactor = (Math.min(window.innerWidth/Interface.canvas.width, window.innerHeight/Interface.canvas.height));
        let transFactor = 50/scalingFactor;
        Interface.canvas.style.transform = "scale("+scalingFactor+")";
        Interface.canvas.style.transform += "translate(-"+transFactor+"%, -"+transFactor+"%)";
        Interface.scaleFactor = scalingFactor;
    }

    static selectCellByScreenCoords(x, y){
        x = Math.floor(((x - Interface.canvas.getBoundingClientRect().left)/Interface.scaleFactor)/32);
        y = Math.floor(((y - Interface.canvas.getBoundingClientRect().top)/Interface.scaleFactor)/32);
        return Game.instance.map.getTile(x, y);
    }

    static handleMouseOver(e){
        if (Game.instance.player != null) {
            Interface.clearScreen();
            Game.instance.map.removeHighlights();
            if (Interface.selectedCell != null) {
                Interface.selectedCell.draw();
                if (Interface.selectedCell.currentEntity != null) {
                    Interface.selectedCell.currentEntity.draw();
                }
            }
            Interface.selectedCell = Interface.selectCellByScreenCoords(e.clientX, e.clientY);
            Interface.highlightPathToSelectedCell();
            Game.instance.map.draw();
        }
    }

    static highlightCell(x, y, strength = 0.2) {
        let t = Game.instance.map.getTile(x, y);
        t.highlightStrength = strength;
        t.draw();
    }

    
    static highlightPathToSelectedCell(){
        if (Interface.selectedCell != null) {
            let px = Game.instance.player.posx, py = Game.instance.player.posy;
            Interface.Bresenham(px, py, Interface.selectedCell.posx, Interface.selectedCell.posy, Interface.highlightCell);
            Interface.highlightCell(Interface.selectedCell.posx, Interface.selectedCell.posy, 0.30);
        }
    }

    static Bresenham(startx, starty, endx, endy, func) {
        let dx = Math.abs(endx - startx);
        let dy = Math.abs(endy - starty);
        let sx = Math.sign(endx - startx);
        let sy = Math.sign(endy - starty);
        let currx = startx, curry = starty;

        let err = dx - dy;

        while (true) {
            if (currx != startx || curry != starty)func(currx, curry);

            if (currx === endx && curry === endy) break;

            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                currx += sx;
            }
            if (e2 < dx) {
                err += dx;
                curry += sy;
            }
        }
    }

    static handleLeftClick(e){
        if (Game.instance.player != null) {
            let player = Game.instance.player;
            Interface.selectedCell = Interface.selectCellByScreenCoords(e.clientX, e.clientY);
            if (Interface.selectedCell.currentEntity != null && Interface.selectedCell.currentEntity == player) {
                player.rest();
            }
            else {
                player.moveTowardsTarget(Interface.selectedCell.posx, Interface.selectedCell.posy);
            }
        }
    }

    static handleKeyboardInput(e){
        Interface.selectedCell = null;
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
                    Game.instance.player.rest();
                    break;

                default:
                    break;
            }
        }
    }
}