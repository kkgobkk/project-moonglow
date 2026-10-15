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

    inBounds(x, y) {
        return (x >= 0 && x < this.width && y >= 0 && y < this.height);
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
        if (!this.inBounds(x, y)) return null;

        return this.array[y * this.width + x];
    }

    removeHighlights(){
        for (let i in this.array) {
                this.array[i].highlightStrength = 0;
            }
    }

    draw(){
        for (let i in this.array) {
            this.array[i].draw();
        }
    }

    buildPathsToPlayer(){
        let type = "walking";
        let pq = new PriorityQueue((u, v) => {return (u.dijkstraCost==v.dijkstraCost)?0:(u.dijkstraCost>v.dijkstraCost?1:-1)});
        let u;

        //build priority queue
        for (let i in this.array) {
            if (this.array[i].currentEntity == Game.instance.player) {
                this.array[i].dijkstraCost = 0;
            }
            else {
                this.array[i].dijkstraCost = Infinity;
            }
            this.array[i].pathToPlayer = null;
            if (this.checkMovementLegal(type, this.array[i].posx, this.array[i].posy)) {
                pq.push(this.array[i]);
            }
        }
        //extract next node and recompute paths and costs
        while (!pq.isEmpty()) {
            u = pq.pop();
            let adj = u.getNeighbors();
            adj.sort((a, b) => a.distanceManhattan(u) - b.distanceManhattan(u));
            for(let i in adj) {
                let v = adj[i];
                if (v != null && (v.posx != u.posx || v.posy != u.posy) && (this.checkMovementLegal(type, v.posx, v.posy)) && (v.dijkstraCost > u.dijkstraCost + 1)) {
                    v.dijkstraCost = u.dijkstraCost + 1;
                    v.pathToPlayer = u;
                    pq.decreaseKey(v);
                }
            }
        }
    }
}