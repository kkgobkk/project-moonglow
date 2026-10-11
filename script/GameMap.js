class GameMap{
    width;
    height;
    startPosX;
    startPosY;
    array;

    constructor(width, height){
        this.width = width;
        this.height = height;
        this.array = new Array;
    }

    checkMovementLegal(type, x, y){
        let tile = this.array[y * this.width + x];
        switch (type) {
            case "walking":
                return tile.walkable;
                break;

            case "swimming":
                return tile.swimmable;
                break;

            case "flying":
                return tile.flyable;
                break;

            default:
                return false;
                break;
        }
    }

    getTile(x, y){
        return this.array[y * this.width + x];
    }

    draw(){
        for (let i in this.array) {
            this.array[i].draw();
        }
    }
}