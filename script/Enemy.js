const AI_ROAM = 0, AI_AGGRO = 1, AI_FLEE = 2;
const AGGRO_RANGE = 3;
const FLEE_THRESHOLD = 0.25;
const ROAM_CHANCE = 0.5;

class Enemy extends Entity{
    static nextId = 1000;
    
    ai_state;

    constructor(posx, posy){
        super("enemy", Enemy.nextId++, posx, posy, 1, "walking", 50, 15);
    }

    updateAiState(){
        if (Game.instance.player == null) {
            this.ai_state = AI_ROAM;
            return;
        }

        if (Entity.distance(this, Game.instance.player) <= AGGRO_RANGE) {
            if (this.currentHP <= this.maxHP * FLEE_THRESHOLD)
                this.ai_state = AI_FLEE;
            else
                this.ai_state = AI_AGGRO;
        }
        else {
            this.ai_state = AI_ROAM;
        }
    }

    update(){
        this.updateAiState();

        switch (this.ai_state) {
            case AI_AGGRO:
                if (Entity.adjacencyTest(this, Game.instance.player)) {
                    this.meleeAttack(Game.instance.player);
                }
                else {
                    this.moveTowardsTarget(Game.instance.player.posx, Game.instance.player.posy);
                }
                break;

            case AI_FLEE:
                this.fleeFromTarget(Game.instance.player.posx, Game.instance.player.posy);
                break;
            
            case AI_ROAM:
            default:
                this.moveRandomly(ROAM_CHANCE);
        }
       
    }
}