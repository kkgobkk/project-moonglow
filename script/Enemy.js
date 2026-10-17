const AI_ROAM = 0, AI_AGGRO = 1, AI_FLEE = 2;
const ROAM_CHANCE = 0.5;

class Enemy extends Entity{
    static nextId = 1000;
    
    ai_state;

    constructor(posx, posy){
        super("enemy", Enemy.nextId++, posx, posy, 1, "walking", 50, 10, 15);
    }

    updateAiState(){
        if (Game.instance.player == null) {
            this.ai_state = AI_ROAM;
            return;
        }

        if (Entity.distance(this, Game.instance.player) <= this.aggroRange) {
            if (this.currentMorale < this.maxMorale)
                this.ai_state = AI_FLEE;
            else
                this.ai_state = AI_AGGRO;
        }
        else {
            this.ai_state = AI_ROAM;
        }
    }

    update(){
        super.update();
        this.updateAiState();

        switch (this.ai_state) {
            case AI_AGGRO:
                if (Entity.adjacencyTest(this, Game.instance.player)) {
                    this.meleeAttack(Game.instance.player);
                }
                else {
                    this.moveTowardsPlayer(Game.instance.player.posx, Game.instance.player.posy);
                }
                break;

            case AI_FLEE:
                this.fleeFromPlayer();
                break;
            
            case AI_ROAM:
            default:
                this.moveRandomly(ROAM_CHANCE);
        }
    }

    onBeingAttacked(){
        super.onBeingAttacked();

        if (this.currentHP <= this.maxHP * this.fleeThreshold) {
            this.currentMorale = 0;
        }
    }
}