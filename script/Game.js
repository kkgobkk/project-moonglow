class Game{
    static instance;

    start_time;
    over;
    player;
    map;
    entityList;

    constructor(){
        this.start_time = Date.now();
        this.over = false;
    }

    static start(){
        Interface.init();
        Game.instance = new Game();
        Game.instance.entityList = {};
        Game.instance.generateMap();
        Game.instance.player = new Player(Game.instance.map.startPosX, Game.instance.map.startPosY);
        Game.instance.draw();
    }

    generateMap(){
        this.map = new GameMap(TestMap.width, TestMap.height);

        for (let y = 0; y < this.map.height; y++) {
            for (let x = 0; x < this.map.width; x++) {
                this.map.array.push(new Tile(TestMap.map[y*this.map.width+x], x, y));
            }
        }

        this.map.startPosX = TestMap.startPosX;
        this.map.startPosY = TestMap.startPosY;

        for (let i in TestMap.enemy_spawns) {
            new Enemy(TestMap.enemy_spawns[i][0], TestMap.enemy_spawns[i][1]);
        }
    }

    draw(){
        this.map.draw()

        for (let i in this.entityList) {
            this.entityList[i].draw();
        }
    }

    update(){
        Interface.clearScreen();

        for (let i in this.entityList) {
            this.entityList[i].update();
        }

        this.draw();
    }
}