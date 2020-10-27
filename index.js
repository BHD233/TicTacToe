
var maxDeep = 2;
var isPlaying = false;
var isCreating = false;
var isFinding = false;
var isUseAlpha = false;
var turn = -1;
var isPvp = false;
var maxX = 3;
var maxY = 3;
var maxZ = 3;
var array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var mainMenu = document.getElementById("main_menu");
var mainGame = document.getElementById("main_game");
var backButton = document.getElementById("back_button");
var turnTilte = document.getElementById("turn_title");



function ResetValue(){
    maxDeep = 4;
    isPlaying = false;
    isCreating = false;
    isFinding = false;
    isUseAlpha = false;
    turn = -1;
    isPvp = false;
    maxX = 3;
    maxY = 3;
    maxZ = 3;
    array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    turnTilte.style.display = "none";

}

function onStartButtonClicked(){
    isPlaying = true;
    isCreating = false;
    
    var button = document.getElementById("start_button");
    button.style.display = "none";

    //hide the cover
    document.getElementById("cover").style.display="none";
}

function sendTurn(){
    if (!isCreating) {
        var tilte = document.getElementById("turn_title");
        if (turn == 1) {
            if (!isPvp) {
                tilte.innerHTML = "CPU's Turn";
            } else {
                tilte.innerHTML = "Player 1's Turn";
            }
        } else if (turn == -1) {
            if (!isPvp) {
                tilte.innerHTML = "Your Turn";
            } else {
                tilte.innerHTML = "Player 2's Turn";
            }
        }
    }
}

function sendWin(state){
    if (state == 0) {
        turnTilte.innerHTML = "Tie";    
    } else {
        if (turn == 1) {
            if (!isPvp) {
                turnTilte.innerHTML = "CPU win";
            } else {
                turnTilte.innerHTML = "Player 1 win";
            }
        } else {
            if (!isPvp) {
                turnTilte.innerHTML = "You win";
            } else {
                turnTilte.innerHTML = "Player 2 win";
            }
        }
    }
}

function index(x, y, z){
    return x * maxX * maxY + y * maxY + z;
}

function drawX(ctx){
    var pl = document.getElementById("ic_x");

    ctx.drawImage(pl, 50, -20, 180, 200);
}

function drawO(ctx){
    var pl = document.getElementById("ic_o");

    ctx.drawImage(pl, 25, 25, 200, 120);
}

function onCreateBoardClicked() {
    isCreating = !isCreating;
    ShowMainGame();
}

function onPvPClicked() {
    isPvp = !isPvp;
    ShowMainGame();
}

function onPlayComClick(){
    ShowMainGame();
}

function onAlphaBetClicked(){
    isUseAlpha = !isUseAlpha;
    console.log(isUseAlpha);
}

function onBackButtonClicked(){
    ResetValue();
    ShowMainMenu();
}

function ShowMainMenu(){
    mainMenu.style.display = "block";
    mainGame.style.display = "none";
    backButton.style.display = "none";
}

function ShowMainGame(){
    mainMenu.style.display = "none";
    mainGame.style.display = "block";
    backButton.style.display = "inline-block";
}

function comPlay(x, y, z) {
    if (isPlaying) {
        var id = String(x) + String(y) + String(z);

        var box = document.getElementById(id);

        drawO(box.getContext("2d"));

        array[index(x, y, z)] = turn;

        var state = CheckState(1);

        if (state != -1 ) {
            sendWin(state);
            isPlaying = false;
        }

        if (isPlaying) {
            turn = -turn;
    
            sendTurn();
        }
    }
}

var worker = new Worker("process.js");
worker.addEventListener('message', function (e) {
    //console.log("e= ", e.data);
    successHander(e.data);
}, false)

function onBoxClicked(x, y, z, box) {

    //check valid 
    if (array[index(x, y, z)] != 0) {
        return;
    }
    if (isPlaying || isCreating) {
        var ctx = box.getContext("2d")

        if (turn == -1) {
            drawX(ctx);
        } else {
            drawO(ctx);
        }
    
        console.log("Clicked", x, y, z);
    
        array[index(x, y, z)] = turn;
        
        var state = CheckState(turn);

        if (state != -1) {
            sendWin(state);
            isPlaying = false;
        }
        
        if (isPlaying || isCreating) {
            turn = -turn;
    
            sendTurn();
        }  
    }

    if (isPlaying && !isCreating) {
        if (!isPvp) {
            isFinding = true;
            //BestMove();
            
            console.log("haha= ", array);
            worker.postMessage([array, isUseAlpha]);
            isFinding = false;
        }
    }
    
}

function successHander(pos) {
    comPlay(pos[0], pos[1], pos[2]);
}

function drawWinWay(x, y, z){
    if (!isFinding) {
        for (var i = 0; i < 3; i++) {
            var id = String(x[i]) + String(y[i]) + String(z[i]);
            var box = document.getElementById(id);
        
            box.style.backgroundColor = "red"; 
        }
    }
}


function CheckState(player){
    var move = 0;
    for (var i = 0; i < maxX; i++) {
        for (var j = 0; j < maxY; j++) {
            for (var f = 0; f < maxZ; f++) {
                if (array[index(i,j,f)] == 0) {
                    move++;
                    break;
                }
            }
        }
    }
    if (move == 0) {
        return 0;
    }

    for (var i = 0; i < maxX; i++) {
        for (var j = 0; j < maxY; j++){
            var count = 0;
            for (var f = 0; f < maxZ; f++) {
                count += array[index(i, j, f)];
            }

            if (count == player * 3) {
                drawWinWay([i, i, i], [j, j, j], [0, 1, 2]);
                return 1;
            }
        }
    }
    for (var i = 0; i < maxX; i++) {
        for (var f = 0; f < maxZ; f++){
            var count = 0;
            
            for (var j = 0; j < maxY; j++) {
                count += array[index(i, j, f)];
            }

            if (count == player * 3) {
                drawWinWay([i, i, i], [0, 1, 2], [f, f, f]);
                return 1;
            }
        }
    }
    for (var f = 0; f < maxZ; f++) {
        for (var j = 0; j < maxY; j++){
            var count = 0;
            
            for (var i = 0; i < maxX; i++) {
                count += array[index(i, j, f)];
            }

            if (count == player * 3) {
                drawWinWay([0, 1, 2], [j, j, j], [f, f, f]);
                return 1;
            }
        }
    }

    //x - y, z tang deu
    for (var i = 0; i < maxX; i++){
        var count = array[index(i, 0, 0)] + array[index(i, 1, 1)] + array[index(i, 2, 2)];
        if (count == player * 3){
            drawWinWay([i, i, i], [0, 1, 2], [0, 1, 2]);
            return 1;
        }
    }
    //x - y tang z giam
    for (var i = 0; i < maxX; i++){
        var count = array[index(i, 2, 0)] + array[index(i, 1, 1)] + array[index(i, 0, 2)];
        if (count == player * 3){
            drawWinWay([i, i, i], [2, 1, 0], [0, 1, 2]);
            return 1;
        }
    }
    
    for (var j = 0; j < maxY; j++){
        var count = array[index(0, j, 0)] + array[index(1, j, 1)] + array[index(2, j, 2)];
        if (count == player * 3){
            drawWinWay([0, 1, 2], [j, j, j], [0, 1, 2]);
            return 1;
        }
    }
    for (var j = 0; j < maxY; j++){
        var count = array[index(2, j, 0)] + array[index(1, j, 1)] + array[index(0, j, 2)];
        if (count == player * 3){
            drawWinWay([2, 1, 0], [j, j, j], [0, 1, 2]);
            return 1;
        }
    }

    for (var f = 0; f < maxZ; f++){
        var count = array[index(0, 0, f)] + array[index(1, 1, f)] + array[index(2, 2, f)];
        if (count == player * 3){
            drawWinWay([0, 1, 2], [0, 1, 2], [f, f, f]);
            return 1;
        }
    }
    for (var f = 0; f < maxZ; f++){
        var count = array[index(2, 0, f)] + array[index(1, 1, f)] + array[index(0, 2, f)];
        if (count == player * 3){
            drawWinWay([2, 1, 0], [0, 1, 2], [f, f, f]);
            return 1;
        }
    }

    var count = array[index(0, 0, 0)] + array[index(1, 1, 1)] + array[index(2, 2, 2)];
    if (count == player * 3){
        drawWinWay([0, 1, 2], [0, 1, 2], [0, 1, 2]);
        return 1;
    }
    count = array[index(0, 0, 2)] + array[index(1, 1, 1)] + array[index(2, 2, 0)];
    if (count == player * 3){
        drawWinWay([0, 1, 2], [0, 1, 2], [2, 1, 0]);
        return 1;
    }
    count = array[index(0, 2, 0)] + array[index(1, 1, 1)] + array[index(2, 0, 2)];
    if (count == player * 3){
        drawWinWay([0, 1, 2], [2, 1, 0], [0, 1, 2]);
        return 1;
    }
    count = array[index(0, 2, 2)] + array[index(1, 1, 1)] + array[index(2, 0, 0)];
    if (count == player * 3){
        drawWinWay([0, 1, 2], [2, 1, 0], [2, 1, 0]);
        return 1;
    }

    return -1;
}
