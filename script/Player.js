class Player extends Entity{
    constructor(posx, posy){
        super("player", 0, posx, posy, 0, "walking", 100, 0, 20);
    }

    currentTile(){
        return Game.instance.map.getTile(this.posx, this.posy);
    }

    move(x, y){
        let turnover = false;
        let oldx = this.x, oldy = this.y;
        if (Game.instance.map.inBounds(this.posx + x, this.posy + y)) {
            let targetEntity = Game.instance.map.getTile(this.posx+x, this.posy+y).currentEntity;
            if (targetEntity != null && targetEntity.type == "enemy") {
                this.meleeAttack(targetEntity);
                turnover = true;
            }
            else{
                turnover = super.move(x, y);
            }
        }

        if (this.posx != oldx || this.posy != oldy) {
            Game.instance.map.buildPathsToPlayer();
        }

        if (turnover) {
            Game.instance.update();
        }
        return turnover;
    }

    rest(){
        if (this.currentHP < this.maxHP) {
            this.currentHP ++;
        }
        Game.instance.update();
    }

    die(){
        Game.instance.player = null;
        super.die();
        setInterval(() => {Game.instance.update();}, 200)
    }
}