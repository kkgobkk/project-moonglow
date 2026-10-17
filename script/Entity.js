class Entity{
    type = "entity";
    id;
    posx;
    posy;
    movementType;
    maxHP;
    currentHP;
    currentMorale;
    maxMorale;
    meleeDamage;
    aggroRange = 3;
    fleeThreshold = 0.25;
    foughtThisTurn = false;

    texture_index = 0;
    facing_left = false;
    texture_width = 32;
    texture_height = 32;
    width = 32;
    height = 32;

    constructor(type, id, posx, posy, texture_index, movementType, maxHP, maxMorale, meleeDamage){
        this.type = type;
        this.id = id;
        this.posx = posx;
        this.posy = posy;
        this.texture_index = texture_index;
        this.movementType = movementType;
        this.maxHP = maxHP;
        this.currentHP = maxHP;
        this.maxMorale = maxMorale;
        this.currentMorale = maxMorale;
        this.meleeDamage = meleeDamage;

        Game.instance.map.getTile(posx, posy).currentEntity = this;
        Game.instance.entityList[id] = this;
    }

    static distance = function(entity1, entity2){
        let dx = Math.abs(entity2.posx - entity1.posx);
        let dy =  Math.abs(entity2.posy - entity1.posy);
        return dx > dy ? dx : dy;
    }

    static collisionTest = function(entity1, entity2){
        return entity1.posx == entity2.posx && entity1.posy == entity2.posy;
    }

    static adjacencyTest = function(entity1, entity2){
        let dx = Math.abs(entity1.posx - entity2.posx);
        let dy = Math.abs(entity1.posy - entity2.posy);
        
        return dx <= 1 && dy <= 1 && (dx == 1 || dy == 1);
    }

    update(){
        if (this.currentHP < this.maxHP && !this.foughtThisTurn) {
            this.currentHP ++;
        }
        if (this.currentMorale < this.maxMorale && this.currentHP > (this.fleeThreshold * this.maxHP)) {
            this.currentMorale ++;
        }

        this.foughtThisTurn = false;
    }

    moveTowardsTarget(targetx, targety){
        let dx = Math.sign(targetx - this.posx);
        let dy = Math.sign(targety - this.posy);

        if (this.move(dx, dy) == false) {
            if (this.move(dx, 0) == false) {
                this.move(0, dy);
            }
        }
    }

    fleeFromTarget(targetx, targety){
        let dx = 0 - Math.sign(targetx - this.posx);
        let dy = 0 - Math.sign(targety - this.posy);

        if (this.move(dx, dy) == false) {
            if (this.move(dx, 0) == false) {
                this.move(0, dy);
            }
        }
    }

    moveTowardsPlayer(){
        let pathToPlayer = Game.instance.map.getTile(this.posx, this.posy).pathToPlayer;
        if (pathToPlayer != null) {
            this.moveToTile(pathToPlayer);
        }
    }
    
    fleeFromPlayer(){
        let ppos = Game.instance.player.currentTile();
        let neighbors = Game.instance.map.getTile(this.posx, this.posy).getNeighbors().sort((a, b) => {let d = b.dijkstraCost - a.dijkstraCost; if (d == 0) return b.distanceChebishev(ppos) - a.distanceChebishev(ppos); else return d;});
        let target, i = 0;
        do {
            target = neighbors[i++];
        } while (!target.checkMovementLegal(this.movementType) && i < neighbors.length);
        this.moveToTile(target);
    }

    moveRandomly(chance){
        if(Math.random() <= chance) {
            let dx = 0, dy = 0;
            do {
                dx = Math.floor(Math.random() * 3) - 1;
                dy = Math.floor(Math.random() * 3) - 1;
            } while (Math.abs(dx) + Math.abs(dy) == 0);

            this.moveTowardsTarget(this.posx+dx, this.posy+dy);
        }
    }

    move(x, y){
        let targetx = this.posx + x;
        let targety = this.posy + y;

        if (Game.instance.map.inBounds(targetx, targety)) {
            if (Game.instance.map.checkMovementLegal(this.movementType, targetx, targety) && Game.instance.map.array[targety * Game.instance.map.width + targetx].currentEntity == null) {
                //update references on tiles
                Game.instance.map.getTile(this.posx, this.posy).currentEntity = null;
                Game.instance.map.getTile(targetx, targety).currentEntity = this;

                //turn to the appropriate direction
                if (x > 0) this.facing_left = false;
                if (x < 0) this.facing_left = true;

                this.posx = targetx;
                this.posy = targety;
                return true;
            }
        }
        return false;
    }

    moveToTile(t){
        return this.move(t.posx - this.posx, t.posy - this.posy);
    }

    meleeAttack(targetEntity){
        this.foughtThisTurn = true;
        targetEntity.currentHP -= this.meleeDamage;
        targetEntity.onBeingAttacked(this);
    }

    onBeingAttacked(attacker){
        this.foughtThisTurn = true;
        if (this.currentHP <= 0) {
            this.die();
        }
    }

    die(){
        Game.instance.map.getTile(this.posx, this.posy).currentEntity = null;
        delete Game.instance.entityList[this.id];
    }

    draw(){
        Interface.ctx.drawImage(Interface.tileset,           //file
                                this.texture_index * this.texture_width,      //crop start x
                                (TILESET_ENTITY_OFFSET_Y + (this.facing_left ? 1 : 0)) * this.texture_height,  //crop start y
                                this.texture_width,     //crop width
                                this.texture_height,    //crop height
                                this.posx*this.width,   //draw x
                                this.posy*this.height,   //draw y
                                this.width,             //draw width
                                this.height);           //draw height
        this.drawHealthBar();
        if (Interface.debug) {
            this.drawMoraleBar();
        }
    }

    drawHealthBar(){
        if(this.currentHP < 0.25 * this.maxHP)
            Interface.ctx.fillStyle = "#ff0000";
        else if(this.currentHP < 0.5 * this.maxHP)
            Interface.ctx.fillStyle = "#ff9900";
        else if(this.currentHP < 0.75 * this.maxHP)
            Interface.ctx.fillStyle = "#ffff00";
        else
            Interface.ctx.fillStyle = "#00ff00";

        Interface.ctx.fillRect(this.posx*this.width, this.posy*this.height, this.width * this.currentHP / this.maxHP, 2);
    }

    drawMoraleBar(){
        Interface.ctx.fillStyle = "#9900ff";
        Interface.ctx.fillRect(this.posx*this.width, this.posy*this.height+2, this.width * this.currentMorale / this.maxMorale, 2);
    }
}