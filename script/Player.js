class Player extends Entity{
    constructor(posx, posy){
        super("player", 0, posx, posy, 0, "walking", 10, 3);
    }

    move(x, y){
        if (this.posx + x < 0 || this.posx + x >= Game.instance.map.width || this.posy + y < 0 || this.posy + y >= Game.instance.map.height) return false;

        let targetEntity = Game.instance.map.getTile(this.posx+x, this.posy+y).currentEntity;
        if (targetEntity != null && targetEntity.type == "enemy") {
            this.meleeAttack(targetEntity);
        }
        else{
            super.move(x, y);
        }

        Game.instance.update();
    }

    die(){
        Game.instance.player = null;
        super.die();
        setInterval(() => {Game.instance.update();}, 200)
    }
}