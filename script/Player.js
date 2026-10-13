class Player extends Entity{
    constructor(posx, posy){
        super("player", 0, posx, posy, 0, "walking", 100, 20);
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