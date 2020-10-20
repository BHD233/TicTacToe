var isPlaying = true;
var isCreating = false;
var turn = -1;
var isPvp = false;
var maxX = 3;
var maxY = 3;
var maxZ = 3;
var array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

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
}

function onPvPClicked() {
    isPvp = !isPvp;
}

function comPlay(x, y, z) {
    if (isPlaying) {
        var id = String(x) + String(y) + String(z);

        var box = document.getElementById(id);

        drawO(box.getContext("2d"));

        array[index(x, y, z)] = turn;

        if (CheckState(1) == 1) {
            console.log("May thang");
            isPlaying = false;
        }

        turn = -turn;
    }
}

function onBoxClicked(x, y, z, box) {
    if (isPlaying) {
        var ctx = box.getContext("2d")

        if (turn == -1) {
            drawX(ctx);
        } else {
            drawO(ctx);
        }
    
        console.log("Clicked", x, y, z);
    
        array[index(x, y, z)] = turn;
        
        if (!isCreating) {
            if (CheckState(turn) == 1) {
                console.log("Nguoi thang");
                isPlaying = false;
            }
        }
        
        turn = -turn;
        
        if (isPlaying && !isCreating) {
            if (!isPvp) {
                BestMove();
            }
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
                return 1;
            }
        }
    }

    //x - y, z tang deu
    for (var i = 0; i < maxX; i++){
        var count = array[index(i, 0, 0)] + array[index(i, 1, 1)] + array[index(i, 2, 2)];
        if (count == player * 3){
            return 1;
        }
    }
    //x - y tang z giam
    for (var i = 0; i < maxX; i++){
        var count = array[index(i, 2, 0)] + array[index(i, 1, 1)] + array[index(i, 0, 2)];
        if (count == player * 3){
            return 1;
        }
    }
    
    for (var j = 0; j < maxY; j++){
        var count = array[index(0, j, 0)] + array[index(1, j, 1)] + array[index(2, j, 2)];
        if (count == player * 3){
            return 1;
        }
    }
    for (var j = 0; j < maxY; j++){
        var count = array[index(2, j, 0)] + array[index(1, j, 1)] + array[index(0, j, 2)];
        if (count == player * 3){
            return 1;
        }
    }

    for (var f = 0; f < maxZ; f++){
        var count = array[index(0, 0, f)] + array[index(1, 1, f)] + array[index(2, 2, f)];
        if (count == player * 3){
            return 1;
        }
    }
    for (var f = 0; f < maxZ; f++){
        var count = array[index(2, 0, f)] + array[index(1, 1, f)] + array[index(0, 2, f)];
        if (count == player * 3){
            return 1;
        }
    }

    var count = array[index(0, 0, 0)] + array[index(1, 1, 1)] + array[index(2, 2, 2)];
    if (count == player * 3){
        return 1;
    }
    count = array[index(0, 0, 2)] + array[index(1, 1, 1)] + array[index(2, 2, 0)];
    if (count == player * 3){
        return 1;
    }
    count = array[index(0, 2, 0)] + array[index(1, 1, 1)] + array[index(2, 0, 2)];
    if (count == player * 3){
        return 1;
    }
    count = array[index(0, 2, 2)] + array[index(1, 1, 1)] + array[index(2, 0, 0)];
    if (count == player * 3){
        return 1;
    }

    return 0;
}

function BestMove(){
    var ar = [-1, -1, -1];
    var max = -999;

    for (var i = 0; i < maxX; i++) {
        var isBreakI = 0;
        for (var j = 0; j < maxY; j++) {
            var isBreakJ = 0;
            for (var f = 0; f < maxZ; f++) {
                
                if (array[index(i, j, f)] == 0) {
                    if (ar[0] == -1) {
                        ar = [i, j, f];
                    }
                    array[index(i, j, f)] = 1;
                    
                    if (CheckState(1) == 1) {
                        ar = [i, j, f];
                        
                        var isBreakJ = 1;
                        break;
                    }
                    var wayval = MiniMax(-1, 0, [-999, 999]);
                    
                    if (wayval >= max){
                        max = wayval;
                        ar = [i, j, f];
                    }
                    
                    array[index(i, j, f)] = 0;
                }
            }

            if (isBreakJ == 1) {
                isBreakI = 1;
                break;
            }
        }

        if (isBreakI == 1) {
            break;
        }
    }

    console.log("Best move", ar);
    console.log(max);

    comPlay(ar[0], ar[1], ar[2]);
}

function MiniMax(player, count, alphBet){
    //console.log("check ", CheckState(player), player);
    if (CheckState(-player) == 1 && -player == 1) {
        //console.log("aaaaaaaaaaaaaaaa");
        return 999;
    } else if (CheckState(-player) == 1 && -player == -1) {
        //console.log("eeeeeeeeeeeeeeee");
        return -999;
    }

    if (count >= 1){
        var a = CountWin(1)
        var b = CountWin(-1);
        //console.log("ab",a, b);
        return a - b;
        //return CountWin(player);
    }

    if (player == 1) {      //max
        var best = -9999;
        for (var i = 0; i < maxX; i++) {
            for (var j = 0; j < maxY; j++) {
                for (var f = 0; f < maxZ; f++) {
                    if (array[index(i, j, f)] == 0) {
                        array[index(i, j, f)] = player;

                        var cur = MiniMax(-player, count + 1, alphBet);
                        
                        if (cur >= best) {
                            best = cur;
                        }

                        if (best >= alphBet[0]) {
                            alphBet[0] = best;
                        }

                        if (alphBet[0] >= alphBet[1]) {
                            array[index(i, j, f)] = 0;
                            break;
                        }

                        array[index(i, j, f)] = 0;
                    }
                }
            }
        }

        return best;
    }
    else {      //min
        var best = 9999;
        for (var i = 0; i < maxX; i++) {
            for (var j = 0; j < maxY; j++) {
                for (var f = 0; f < maxZ; f++) {
                    if (array[index(i, j, f)] == 0) {
                        array[index(i, j, f)] = player;

                        var cur = MiniMax(-player, count + 1, alphBet);
                        if (cur <= best) {
                            best = cur;
                        }

                        if (best <= alphBet[1]) {
                            alphBet[1] = best;
                        }

                        if (alphBet[0] >= alphBet[1]) {
                            array[index(i, j, f)] = 0;
                            break;
                        }

                        array[index(i, j, f)] = 0;
                    }
                }
            }
        }

        return best;
    }

}

function CountWin(player){
    var total = 0;

    for (var i = 0; i < maxX; i++) {
        for (var j = 0; j < maxY; j++){
            var count = 0;

            for (var f = 0; f < maxZ; f++) {
                if(array[index(i, j, f)] == -player){
                    count = 1;
                    break;
                }
            }
            
            if (count == 0){
                total++;
            }
            
        }
    }
    for (var i = 0; i < maxX; i++) {
        for (var f = 0; f < maxZ; f++){
            var count = 0;
            
            for (var j = 0; j < maxY; j++) {
                if(array[index(i, j, f)] == -player){
                    count = 1;
                    break;
                }
            }

            if (count == 0){
                total++;
            }
        }
    }
    for (var f = 0; f < maxZ; f++) {
        for (var j = 0; j < maxY; j++){
            var count = 0;
            
            for (var i = 0; i < maxX; i++) {
                if(array[index(i, j, f)] == -player){
                    count = 1;
                    break;
                }
            }

            if (count == 0){
                total++;
            }
        }
    }

    //x - y, z tang deu
    for (var i = 0; i < maxX; i++){
        if (array[index(i, 0, 0)] != -player && array[index(i, 1, 1)] != -player && array[index(i, 2, 2)] != -player){
            total++;
        }
    }
    //x - y tang z giam
    for (var i = 0; i < maxX; i++){
        if (array[index(i, 2, 0)] != -player && array[index(i, 1, 1)] !=-player && array[index(i, 0, 2)] !=-player){
            total++;
        }
    }
    
    for (var j = 0; j < maxY; j++){
        if (array[index(0, j, 0)] !=-player && array[index(1, j, 1)] !=-player && array[index(2, j, 2)]){
            total++;
        }
    }
    for (var j = 0; j < maxY; j++){
        if (array[index(2, j, 0)] !=-player && array[index(1, j, 1)] !=-player && array[index(0, j, 2)] !=-player){
            total++;
        }
    }

    for (var f = 0; f < maxZ; f++){
        if (array[index(0, 0, f)] !=-player && array[index(1, 1, f)] !=-player && array[index(2, 2, f)]);
        if (count == player * 3){
            return 1;
        }
    }
    for (var f = 0; f < maxZ; f++){
        if (array[index(2, 0, f)] !=-player && array[index(1, 1, f)] !=-player && array[index(0, 2, f)] !=-player){
            total++;
        }
    }

    if (array[index(0, 0, 0)] !=-player && array[index(1, 1, 1)] !=-player && array[index(2, 2, 2)] !=-player){
        total++;
    }
    if (array[index(0, 0, 2)] !=-player && array[index(1, 1, 1)] !=-player && array[index(2, 2, 0)] !=-player){
        total++;
    }
    if (array[index(0, 2, 0)] !=-player && array[index(1, 1, 1)] !=-player && array[index(2, 0, 2)] !=-player){
        total++;
    }
    if (array[index(0, 2, 2)] !=-player && array[index(1, 1, 1)] !=-player && array[index(2, 0, 0)] !=-player){
        total++;
    }

    return total;
}
