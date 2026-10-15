const TTYPE_VOID = 0x0, TTYPE_FLOOR = 0x1, TTYPE_GRASS = 0x2, TTYPE_BOULDER = 0x3, TTYPE_WALL = 0x4, TTYPE_WATER = 0x5, TTYPE_OIL = 0x6;

class Tile{
    type;
    walkable = false;
    swimmable = false;
    flyable = false;
    flammable = false;
    explosive = false;
    conductor = false;
    
    highlightStrength = 0;
    texture_index;
    texture_width = 32;
    texture_height = 32;
    width = 32;
    height = 32;
    posx;
    posy;

    currentEntity = null;
    pathToPlayer = null;
    dijkstraCost = Infinity;

    constructor(type, posx, posy){
        this.type = type;
        this.posx = posx;
        this.posy = posy;
        
        switch (type) {
            case TTYPE_VOID:
                break;

            case TTYPE_FLOOR:
                this.walkable = true;
                this.flyable = true;
                this.texture_index = 4;
                break;
            
            case TTYPE_GRASS:
                this.walkable = true;
                this.flyable = true;
                this.flammable = true;
                this.texture_index = 0;
                break;
            
            case TTYPE_BOULDER:
                this.flyable = true;
                this.texture_index = 2;
                break;

            case TTYPE_WALL:
                this.flyable = true;
                this.texture_index = 5;
                break;
            
            case TTYPE_WATER:
                this.swimmable = true;
                this.flyable = true;
                this.conductor = true;
                this.texture_index = 1;
                break;

            case TTYPE_OIL:
                this.walkable = true;
                this.flyable = true;
                this.explosive = true;
                this.texture_index = 3;
                break;

            default:
                this.type = TTYPE_VOID;
                break;
        }
    }

    checkMovementLegal(type){
        switch (type) {
            case "walking":
                return this.walkable;
                break;

            case "swimming":
                return this.swimmable;
                break;

            case "flying":
                return this.flyable;
                break;

            default:
                return false;
                break;
        }
    }

    getNeighbors(){
        let neighbors = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x != 0 || y != 0) {
                    let t = Game.instance.map.getTile(this.posx + x, this.posy + y)
                    if (t != null) {
                        neighbors.push(t);
                    }
                }
            }
        }
        return neighbors;
    }

    distanceChebishev = function(tile){
        let dx = Math.abs(this.posx - tile.posx);
        let dy =  Math.abs(this.posy - tile.posy);
        return dx > dy ? dx : dy;
    }

    distanceManhattan = function(tile){
        let dx = Math.abs(this.posx - tile.posx);
        let dy =  Math.abs(this.posy - tile.posy);
        return dx + dy;
    }

    draw(){
        Interface.ctx.drawImage(Interface.tileset,           //file
                                this.texture_width * this.texture_index,    //crop start x
                                0,                      //crop start y
                                this.texture_width,     //crop width
                                this.texture_height,    //crop height
                                this.posx*this.width,   //draw x
                                this.posy*this.height,   //draw y
                                this.width,             //draw width
                                this.height);           //draw height

        if (this.highlightStrength > 0) {
            Interface.ctx.fillStyle = "rgba(255, 255, 255, " + this.highlightStrength + ")";
            Interface.ctx.fillRect(this.posx * this.height, this.posy * this.width, this.height, this.width);
        }
        if (Interface.debug) {
            Interface.ctx.fillStyle = "rgba(255, 255, 255, 0.3";
            Interface.ctx.fillText(this.dijkstraCost, this.posx * this.height, (this.posy+1) * this.width, this.height, this.width);
        }
        if (this.currentEntity != null) {
            this.currentEntity.draw();
        }
    }
}