maxX = 3;
maxY = 3;
maxZ = 3;
array = [];
maxDeep = 4;
isUseAlpha = false;

function isMoveLeft(){
    for(var i = 0; i < maxX; i++) {
        for (var j = 0; j < maxY; j++) {
            for (var f = 0; f < maxZ; f++) {
                if(array[index(i,j,f)] == 0) {
                    return true;
                }
            }
        }
    }

    return false;
}

function index(x, y, z){
    return x * maxX * maxY + y * maxY + z;
}

this.addEventListener('message', function (e) {

    //console.log("e2=",e.data);

    array=e.data[0];
    isUseAlpha = e.data[1];

    var d = BestMove()

    this.postMessage(d);
}, false);

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
                ////drawWinWay([i, i, i], [j, j, j], [0, 1, 2]);
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
                ////drawWinWay([i, i, i], [0, 1, 2], [f, f, f]);
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
                ////drawWinWay([0, 1, 2], [j, j, j], [f, f, f]);
                return 1;
            }
        }
    }

    //x - y, z tang deu
    for (var i = 0; i < maxX; i++){
        var count = array[index(i, 0, 0)] + array[index(i, 1, 1)] + array[index(i, 2, 2)];
        if (count == player * 3){
            ////drawWinWay([i, i, i], [0, 1, 2], [0, 1, 2]);
            return 1;
        }
    }
    //x - y tang z giam
    for (var i = 0; i < maxX; i++){
        var count = array[index(i, 2, 0)] + array[index(i, 1, 1)] + array[index(i, 0, 2)];
        if (count == player * 3){
            ////drawWinWay([i, i, i], [2, 1, 0], [0, 1, 2]);
            return 1;
        }
    }
    
    for (var j = 0; j < maxY; j++){
        var count = array[index(0, j, 0)] + array[index(1, j, 1)] + array[index(2, j, 2)];
        if (count == player * 3){
            ////drawWinWay([0, 1, 2], [j, j, j], [0, 1, 2]);
            return 1;
        }
    }
    for (var j = 0; j < maxY; j++){
        var count = array[index(2, j, 0)] + array[index(1, j, 1)] + array[index(0, j, 2)];
        if (count == player * 3){
            ////drawWinWay([2, 1, 0], [j, j, j], [0, 1, 2]);
            return 1;
        }
    }

    for (var f = 0; f < maxZ; f++){
        var count = array[index(0, 0, f)] + array[index(1, 1, f)] + array[index(2, 2, f)];
        if (count == player * 3){
            ////drawWinWay([0, 1, 2], [0, 1, 2], [f, f, f]);
            return 1;
        }
    }
    for (var f = 0; f < maxZ; f++){
        var count = array[index(2, 0, f)] + array[index(1, 1, f)] + array[index(0, 2, f)];
        if (count == player * 3){
            //drawWinWay([2, 1, 0], [0, 1, 2], [f, f, f]);
            return 1;
        }
    }

    var count = array[index(0, 0, 0)] + array[index(1, 1, 1)] + array[index(2, 2, 2)];
    if (count == player * 3){
        //drawWinWay([0, 1, 2], [0, 1, 2], [0, 1, 2]);
        return 1;
    }
    count = array[index(0, 0, 2)] + array[index(1, 1, 1)] + array[index(2, 2, 0)];
    if (count == player * 3){
        //drawWinWay([0, 1, 2], [0, 1, 2], [2, 1, 0]);
        return 1;
    }
    count = array[index(0, 2, 0)] + array[index(1, 1, 1)] + array[index(2, 0, 2)];
    if (count == player * 3){
        //drawWinWay([0, 1, 2], [2, 1, 0], [0, 1, 2]);
        return 1;
    }
    count = array[index(0, 2, 2)] + array[index(1, 1, 1)] + array[index(2, 0, 0)];
    if (count == player * 3){
        //drawWinWay([0, 1, 2], [2, 1, 0], [2, 1, 0]);
        return 1;
    }

    return -1;
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
                    
                    console.log("ditim", i, j, f, wayval);

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

    console.log("pos = ", ar[0], ar[1], ar[2]);

    return [ar[0], ar[1], ar[2]];
}

function MiniMax(player, count, alphBet){
    if (CheckState(player) == 1 && player == 1) {
        return 999 - count;
    } else if (CheckState(player) == 1 && player == -1) {
        return -999 + count;
    }

    if (!isMoveLeft()) {
        return 0;
    }

    if (count >= maxDeep){
        var a = CountWin(1)
        var b = CountWin(-1);
        return a - b - count;
    }

    if (player == 1) {      //max
        var best = -9999;
        for (var i = 0; i < maxX; i++) {
            var isBreakI = false;
            for (var j = 0; j < maxY; j++) {
                var isBreakJ = false;
                for (var f = 0; f < maxZ; f++) {
                    if (array[index(i, j, f)] == 0) {
                        array[index(i, j, f)] = player;

                        var cur = MiniMax(-player, count + 1, alphBet);

                        //console.log("max",i, j, f, cur, best);
                        
                        if (cur >= best) {
                            best = cur;
                        }

                        if (best >= alphBet[0]) {
                            alphBet[0] = best;
                        }
                        
                        if (isUseAlpha) {
                            if (alphBet[0] >= alphBet[1]) {
                                array[index(i, j, f)] = 0;
                                //console.log("cut max", i, j, f);
                                //isBreakJ = true;
                                break;
                            }
                        }

                        array[index(i, j, f)] = 0;
                    }
                }
                if (isBreakJ) {
                    isBreakI = true;
                    break;
                }
            }
            if (isBreakI) {
                break;
            }
        }

        return best - count;
    }
    else {      //min
        var best = 9999;
        for (var i = 0; i < maxX; i++) {
            var isBreakI = false;
            for (var j = 0; j < maxY; j++) {
                var isBreakJ = false;
                for (var f = 0; f < maxZ; f++) {
                    if (array[index(i, j, f)] == 0) {
                        array[index(i, j, f)] = player;

                        var cur = MiniMax(-player, count + 1, alphBet);

                        //console.log("min",i, j, f, cur, best);

                        if (cur <= best) {
                            best = cur;
                        }

                        if (best <= alphBet[1]) {
                            alphBet[1] = best;
                        }

                        if (isUseAlpha){
                            if (alphBet[0] >= alphBet[1]) {
                                array[index(i, j, f)] = 0;
                                //console.log("cut min", i, j, f);
                                //isBreakJ = true;
                                break;
                            }
                        }

                        array[index(i, j, f)] = 0;
                    }
                }
                if (isBreakJ) {
                    isBreakI = true;
                    break;
                }
            }
            if (isBreakI) {
                break;
            }
        }

        return best - count;
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
