
const CANVAS_HIGHT = 900;
const CANVAS_WIDTH= 1200;
var CELL_WIDTH = 20;
var GRID_WIDTH = 50;
var GRID_HEIGHT = 33;
var START_POINT = {x: 30, y: 30};
var isMouseDown = false;
var penColor = "red";

window.onload = function(){
    let charTable = document.getElementById('charTable');
    generateCharTable(charTable);
    // var canvas = document.getElementById('mycanvas');
    // canvas.width = CANVAS_WIDTH;
    // canvas.height = CANVAS_HIGHT;
    // var context = canvas.getContext("2d");
    section2();
    // getPlayBook();
    // convertToPrintPng(canvas, context);
    // play(context);

}
let generateCharTable = function(tableEle){
    let nRow = 10;
    let nCol = 6;
    for (let i = 0; i <nRow ; i++) {
        let tr = document.createElement('tr');

        for (let j = 0; j < nCol; j++) {

            let td = document.createElement('td');
            tr.appendChild(td);
        }
        tableEle.appendChild(tr);
    }
    for (let i = 97; i < 124 ; i++) {
        let logCol = Math.ceil((i-96)/nRow);
        let col = logCol + (logCol-1);
        let row = (i-96) % nRow;
        if(row ==0){
            row = nRow;
        }
        console.log(col);
        let tr = tableEle.querySelector("tr:nth-child(" + row.toString() + ")");
        let td1 = tr.querySelector("td:nth-child("+col.toString()+")");
        let td2 = tr.querySelector("td:nth-child("+(col+1).toString()+")");
        if(i!=123){
            td1.innerText = String.fromCharCode(i);
            td2.innerText = _convertToEncodedNum(i-96);
        } else {
            td1.innerText = "空格";
            td2.innerText = "00";
        }

    }
}

let getPlayBook = function () {
    var canvas = document.getElementById('mycanvas');
    var context = canvas.getContext("2d");
    GRID_HEIGHT = 33;
    GRID_WIDTH = 50;
    CELL_WIDTH = 5;
    loadJson('basketball.gif_data.json',function (data) {
        let sheet = 0;
        let interval = setInterval(function () {
            if(sheet>=4){
                clearInterval(interval);
                return;
            }
            clearBoard(context);
            try{
                let nRow = 5;
                let nCol = 4;
                for (let i = 0; i < nRow; i++) {
                    for (let j = 0; j < nCol; j++) {
                        START_POINT = {x: 30 + j* (CELL_WIDTH * GRID_WIDTH + 20), y:30 + (i*(GRID_HEIGHT*CELL_WIDTH+10)) };
                        init_grid(context);
                        // play(context);
                        let n = sheet*(nRow*nCol) +i*nCol + j;
                        console.log(n);
                        context.fillText(n.toString(), START_POINT.x, START_POINT.y +3);
                        pic = data[n];
                        for(let i=0; i<pic.length;i++){
                            fill_pix(pic[i][0]-1, pic[i][1]-1, context, "red");
                        }
                    }
                }
            }finally {

                downloadImg(canvas);
                sheet ++;
            }

        }, 1000)

    })
    // play(context);
}

const convertToPrintPng = function (canvas, context) {
    loadJson('basketball.gif_data.json', function (data) {
        let j = data.length-2;
        let interval = setInterval(function () {
            if(j>data.length){
                clearInterval(interval);
                return
            }

            clearBoard(context);
            drawRuler(context);
            init_grid(context);
            let imgStr = encodeImage(data[j])
            context.font = "12px Arial";
            let lineW = 150;
            for (let i = 0; i*lineW < imgStr.length; i++) {
                let line = imgStr.slice(0+i*lineW, (i+1) * lineW);

                context.fillText(line, START_POINT.x, (GRID_HEIGHT + 5 + i) * CELL_WIDTH);
            }

            pic = data[j];
            for(let i=0; i<pic.length;i++){
                fill_pix(pic[i][0]-1, pic[i][1]-1, context, '#fee');
            }
                downloadImg(canvas);
            j++;
        }, 200)

    })
}
const downloadImg = function (canvas) {
    let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href = image;
}
const play = function (context) {
    loadJson('basketball.gif_data.json', function (data) {
    //  loadJson('dance.gif_data.json', function (data) {
        var nframe = 0;
        var interval = setInterval(function () {
            if(nframe>=data.length){
                nframe=0;
            }
            console.log("Play "+ nframe);
            draw_one(data[nframe], context);
            nframe ++;
        }, 100)
    })

}
const init_grid = function (context, lineNum) {
    context.beginPath()
    context.moveTo( START_POINT.x, START_POINT.y);
    context.setLineDash([1, 2]);
    context.lineWidth = 0.5;
    context.strokeStyle = 'black';
    for(let i=0; i<GRID_WIDTH+1; i++){
        let start_x = START_POINT.x + i*CELL_WIDTH
        context.beginPath()
        context.moveTo(start_x, START_POINT.y);
        context.lineTo(START_POINT.x + i*CELL_WIDTH, START_POINT.y + GRID_HEIGHT*CELL_WIDTH);
        context.closePath();
        context.stroke();
        if(lineNum){
            if((i+1)%1==0){
                context.fillText((i+1).toString(), start_x +CELL_WIDTH/3, START_POINT.y - 10)
            }
        }
    }
    for (let i=0; i<GRID_HEIGHT+1;i++){
        start_y = START_POINT.y + i*CELL_WIDTH
        context.beginPath()
        context.moveTo(START_POINT.x, START_POINT.y + i*CELL_WIDTH);
        context.lineTo(START_POINT.x + GRID_WIDTH*CELL_WIDTH, start_y);
        context.closePath();
        context.stroke()
        if(lineNum){
            if((i+1)%1==0){
                context.fillText((i+1).toString(),  START_POINT.x - 20, start_y + CELL_WIDTH/2)
            }
        }

    }
}
const drawRuler = function (context) {
    for(let i=0; i<GRID_WIDTH+1; i++) {
        if ((i + 1) % 2 == 0) {
            let start_x = START_POINT.x + i * CELL_WIDTH
            context.save();
            context.fillStyle = "#eef";
            context.fillRect(start_x, START_POINT.y, CELL_WIDTH, GRID_HEIGHT * CELL_WIDTH)
            context.restore();
        }
    }
    for (let i=0; i<GRID_HEIGHT+1;i++) {
        start_y = START_POINT.y + i * CELL_WIDTH
        if ((i + 1) % 2 == 0) {
            context.save();
            context.fillStyle = "#efe";
            context.fillRect(START_POINT.x, start_y, GRID_WIDTH * CELL_WIDTH, CELL_WIDTH)
            context.restore();
        }
    }
}

const clearBoard = function (ctx) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HIGHT);
}
const draw_one = function(pic, ctx){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HIGHT);
    init_grid(ctx);
    for(let i=0; i<pic.length;i++){
        fill_pix(pic[i][0], pic[i][1], ctx, penColor);
    }
}


const fill_pix = function (x, y, ctx, color) {
    ctx.save();
    ctx.fillStyle = color;
    let point = convert_coordinate_point(x, y);
    ctx.fillRect(point.x +1, point.y +1, CELL_WIDTH-1, CELL_WIDTH-1);
    ctx.restore();

};

const convert_coordinate_point = function(x, y){
    let newX = START_POINT.x + x*CELL_WIDTH;
    let newY = START_POINT.y + y*CELL_WIDTH;
    return {x: newX, y: newY};
}

const loadJson = function(fname, callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("appliction/json");
    xobj.open('GET', fname, true);
    xobj.send();
    xobj.onreadystatechange = function () {
        if(xobj.readyState == 4 && xobj.status == "200"){
            callback(JSON.parse(xobj.responseText));
        } else {
            console.log("Not ready");
        }
    }
    xobj.onerror = function () {
        
    }
}
const get_encoded_char_for_char = function(c){
    if(c == " "){
        return "00";
    }
    let n = c.charCodeAt(0)-96;
    if(n <10){
        return '0' + n.toString();
    }
    return n.toString();


}
const get_decoded_char = function (code) {
    if(code == "00"){
        return " ";
    }
    if(code[0] == "0"){
        return String.fromCharCode(parseInt(code[1]) + 96);
    }
    return String.fromCharCode(parseInt(code) + 96);

}
const decodeTxt = function (encoded) {
    let res = "";
    let reg = /\s/g;
    encoded = encoded.replace(reg, "");
    if(encoded.length %2 !=0){
        return "The input is incorrect";
    }
    for (let i = 0; i < encoded.length; i=i+2) {
        res += get_decoded_char(encoded.slice(i, i+2));
    }
    return res;

}
const encodeTxt = function (text) {
    let res = "";
    for (let i = 0; i < text.length; i++) {
        res += get_encoded_char_for_char(text[i]);
        res += " ";

    }
    return res;
}
const setGrid = function (pic, grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < GRID_HEIGHT; j++) {
            grid[i][j] = 0;
        }
    }
    for (let i = 0; i < pic.length; i++) {
        let x = pic[i][0];
        let y = pic[i][1];
        grid[x][y] = 1;

    }
}

const clearPaintBoard = function (context, gridArray) {
    clearBoard(context);
    init_grid(context);
    for (let i = 0; i < gridArray.length; i++) {
        for (let j = 0; j < gridArray[i].length; j++) {
            gridArray[i][j] = 0;

        }

    }
    
}
const section2 = function () {
    let canvas = document.getElementById('canvasPaint');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HIGHT;
    let context = canvas.getContext("2d");
    init_grid(context);
    let imgDataInput = document.getElementById("imgData");
    let decodeImgBth = document.getElementById("decodeImg");
    let encodeImgBth = document.getElementById("encodeImg");
    let clearBtn = document.getElementById("clearBoard");
    var grid = new Array(GRID_WIDTH);
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(GRID_HEIGHT);

    }
    setGrid([], grid);
    clearBtn.onclick = function(e){
        clearPaintBoard(context, grid);
    }
    decodeImgBth.onclick = function (e) {
        clearBoard(context);
        init_grid(context);
        let pic = decodeImage(imgDataInput.value);
        draw_one(pic, context);
        setGrid(pic, grid);

    }
    encodeImgBth.onclick = function(e){
        imgDataInput.value = encodeImage(getImagePointsArr(grid));
    }
    canvas.onmousedown = function (e) {
        e.preventDefault();
        beginStroke();
        let pos = drawDot(e.clientX, e.clientY, canvas, context);
        grid[pos.x][pos.y] = 1;
        // console.log(encodeImage(getImagePointsArr(grid)));
    }
    canvas.onmousemove = function (e) {
        e.preventDefault();
        if(isMouseDown) {
            let pos = drawDot(e.clientX, e.clientY, canvas, context);
            grid[pos.x][pos.y] = 1;
        }
    }
    canvas.onmouseup = function (e) {
        e.preventDefault();
        endStroke();
    }
    canvas.onmouseout = function (e) {
        e.preventDefault();
        endStroke();

    }
}

const beginStroke = function () {
    isMouseDown = true;
}
const endStroke = function () {
    isMouseDown = false;
}

const drawDot = function (x, y, canvas, context) {
    let pixPos = getPixPointByMousePoint(x, y, canvas);
    if(!pixPos){
        return;
    }
    fill_pix(pixPos.x, pixPos.y, context, penColor);
    return pixPos;
}

const getPixPointByMousePoint = function (x, y, canvas) {
    var canvasPos = canvas.getBoundingClientRect();
    let gridStartX = canvasPos.x + START_POINT.x;
    let gridStartY = canvasPos.y + START_POINT.y;
    let gridEndX = gridStartX + GRID_WIDTH * CELL_WIDTH;
    let gridEndY = gridStartY + GRID_HEIGHT * CELL_WIDTH;
    // console.log("grid: start x:" + gridStartX +' y:' +gridStartY+ " End x:" + gridEndX + " y:"+ gridEndY);
    // console.log('Mouse x:'+x + " y:" + y);
    if(x<gridStartX || x>gridEndX|| y<gridStartY|| y>gridEndY){
        return null;
    }
    let pixx = Math.floor((x - gridStartX) / CELL_WIDTH);
    let pixy = Math.floor((y - gridStartY) / CELL_WIDTH);
    return {x: pixx, y: pixy}
}

const getImagePointsArr = function (imgArray) {
    let res = new Array();
    for (let i = 0; i < imgArray.length; i++) {
        for (let j = 0; j < imgArray[i].length; j++) {
            if(imgArray[i][j])
                res.push([i, j])
        }
    }
    return res
}
const encodeImage = function (pointArray) {
    let res = "";
    for (let i = 0; i < pointArray.length; i++) {
        let x = pointArray[i][0];
        x = _convertToEncodedNum(x);
        let y = pointArray[i][1];
        y = _convertToEncodedNum(y);
        res += x;
        res += y;
        res += " ";
    }
    return res;

}

const _convertToEncodedNum = function(num){
    if(num<10){
        return "0" + num.toString();
    }
    return num.toString();
}
const decodeImage = function (code) {
    let res = new Array();
    let reg = /\s/g;
    code = code.replace(reg, "");
    if(code.length %4 !=0){
        return "The input is incorrect";
    }
    for (let i = 0; i < code.length; i=i+4) {
        let p  = _convertCodeToPixPoint(code.slice(i, i+4));
        res.push([p.x, p.y]);
    }
    return res;
}
const _convertCodeToPixPoint = function (code) {
    if(code.length!=4){
        throw Error("img code must be length 4");
    }
    let x = code.slice(0, 2);
    let y = code.slice(2, 4);
    return {x: _parseNum(x), y: _parseNum(y)};

}
const _parseNum = function (num) {
    if(num[0] =="0"){
        return parseInt(num[1]);
    }
    return parseInt(num);

}