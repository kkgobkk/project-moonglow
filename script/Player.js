class Player extends Entity{
    constructor(posx, posy){
        super("player", 0, posx, posy, 0, "walking", 10, 3);
    }

    move(x, y){
        let moved = false;
        if (Game.instance.map.inBounds(this.posx + x, this.posy + y)) {
            let targetEntity = Game.instance.map.getTile(this.posx+x, this.posy+y).currentEntity;
            if (targetEntity != null && targetEntity.type == "enemy") {
                this.meleeAttack(targetEntity);
                moved = true;
            }
            else{
                moved = super.move(x, y);
            }
        }
        if (moved) {
            Game.instance.update();
        }
        return moved;
    }

    die(){
        Game.instance.player = null;
        super.die();
        setInterval(() => {Game.instance.update();}, 200)
    }
}