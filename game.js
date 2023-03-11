class Car {
    constructor(x, y, speed, height, dir) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.height = height;
        this.dir = dir;
    }
}

const keys = {
    up: "KeyW",
    down: "KeyS",
    right: "KeyD",
    left: "KeyA",
    respawn: "KeyR"
}

class Player{
    constructor() {
        this.x = 5;
        this.y = 500/2
        this.size = 700 / 60;
        this.color = "#f1f1f1";
        this.lives = 5;
        this.level = 1;
        this.death = 0;
        this.dirX = 0;
        this.dirY = 0;
    }
}

const pl = new Player();
let cnv = document.getElementById("canvas").getContext("2d");
let timer = 0;
let timerLimit = 4000;
let speed = 0.8;
const spawnHMin = 100;
const spanwHMax = 500;
const cnvWidht = 700;
const cnvHeight = 500;
const tileDivition = 60;
let blocksDivition = cnvWidht / tileDivition;
let reset = false;
let levelDown = false;
let cars = new Array(40);

function rand(bottom,top, float) {
    if (!float) {
        return Math.ceil(Math.random() * (top - bottom) + bottom);
    }
    return Math.random() * (top - bottom) + bottom;
}

for(let i = 0; i < cars.length; i++) {
    let pos = i;
    let dir = i % 2 == 0 ? "up" : "down";
    let strPos = dir == "up" ? rand(400,700,false) : rand(spawnHMin,spanwHMax+400,false);
    cars[i] = new Car((pos * blocksDivition) + 210, strPos,rand(speed-0.5,speed,true), rand(10, 100,false), dir);
}

function renderPlayer() {
    draw(pl.x, pl.y, pl.size, "#B8DBD9");
}

function renderCars() {
    for(let c = 0; c < cars.length; c++) {
        let x = cars[c].x;
        let y = cars[c].y;
        let spd = cars[c].speed;
        let h = cars[c].height;
        if(cars[c].dir == "up") {
            if(y+h < 0) {
                let resPos =  rand(600,spanwHMax+500, false);
                cars[c].speed = rand(speed - 0.5,speed,true);
                y = resPos;
                cars[c].height = rand(10,100, false);
            }
        }
        else if(y - h > 500 ) {
            let resPos = 0 - rand(spawnHMin,spanwHMax, false);
            cars[c].speed = rand(speed - 0.5,speed,true);
            y = resPos;
            cars[c].height = rand(10,100, false);
        }
        draw(x,y,h,"#f48c06");
        cars[c].y = cars[c].dir == "up" ? y -= spd : y += spd ;
    }
}

function collision() {
    for(let i = 0; i < cars.length; i++) {
        let x = cars[i].x;
        let y = cars[i].y;
        let h = cars[i].height;
        let w = blocksDivition;
        if (
            x < pl.x + pl.size &&
            x + w > pl.x &&
            y < pl.y + pl.size &&
            h + y > pl.y
        ){
            reset = true;
            levelDown = true;
        }
    }
}

function draw(x,y,h,color){
    cnv.fillStyle = color;
    cnv.fillRect(x,y,blocksDivition,h);
}

function respawn() {
    if(levelDown) pl.lives -= 1;
    if(pl.lives == 0) {
        pl.lives = 5;
        speed = 0.8;
        pl.level = 1;
    }
    for(let c = 0; c < cars.length; c++) {
        let x = cars[c].x;
        let y = cars[c].y;
        let h = cars[c].height;
        cars[c].speed = rand(speed - 0.5,speed,true);
        cars[c].y = rand(spawnHMin-400,spanwHMax-100, false);
        draw(x,y,h,"#f48c06");
    }
    levelDown = false;
    reset = false;
    timer = 0;
    pl.x = 5;
    pl.y = 500/2;
    pl.dirX = 0;
    pl.dirY = 0;
    game();
}

function game() {
    if(pl.x < 0) reset = true;
    if(pl.x > 680 - pl.size) {
        reset = true;
        speed += 0.2;
        pl.level++;
    }
    if(pl.y < 0) reset = true;
    if(pl.y > 500 - pl.size) reset = true;
    if(timer > timerLimit) reset = true;
    if(pl.lives == 0) reset = true;
    if(reset) return;
    reload();
    renderPlayer();
    renderCars();
    collision();
    changeDir();
    loadLives();
    loadControl();
    cnv.fillStyle = "#e5383b";
    cnv.fillRect(680,-1,701,501);
    setTimeout(
        () => {
            timer += 1/2;
            game();
        },1000/200
    );
}
game();

function reload() {
    cnv.fillStyle = "#212529";
    cnv.fillRect(0,0,cnvWidht,cnvHeight);
    cnv.fillStyle = "#0A0A0A";
    cnv.fillRect(0,0,cnvWidht - 500,cnvHeight);
}

document.addEventListener("keyup", (e) => {
//  console.log(e.keyCode);
    if(e.code == keys.respawn) {
        if(reset) {
            respawn();
        }
    }
    if(e.code == keys.up) {
        pl.dirY = 0;
    }
    if(e.code == keys.down) {
        pl.dirY = 0;
    }
    if(e.code == keys.right) {
        pl.dirX = 0;
    }
    if(e.code == keys.left) {
        pl.dirX = 0;
    }
});
document.addEventListener("keydown",(e) => {
//  console.log(e.code);
    if(e.code == keys.up) {
        pl.dirY = -1;
    }
    if(e.code == keys.down) {
        pl.dirY = 1;
    }
    if(e.code == keys.right) {
        pl.dirX = 1;
    }
    if(e.code == keys.left) {
        pl.dirX = -1;
    }
});
function changeDir() {
    pl.x = pl.x + pl.dirX;
    pl.y = pl.y + pl.dirY
}

function loadLives() {
    cnv.fillStyle = "white"
    cnv.font = "17px Verdana";
    cnv.fillText(`Lives: ${pl.lives}`, 5, 25);
    cnv.fillText(`Level: ${pl.level}`, 5, 45);
}
function loadControl() {
    cnv.fillStyle = "#6c757d"
    cnv.font = "15px Verdana";
    cnv.fillText("Controls:  'A' 'W' 'S' 'D'", 5, 450);
    cnv.fillText("'R' to Respawn", 5, 470);
}