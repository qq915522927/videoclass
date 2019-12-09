
const WINDOW_HIGHT = 900;
const WINDOW_WIDTH= 1200;
var CELL_WIDTH = 20;
var GRID_WIDTH = 50;
var GRID_HEIGHT = 33;
var START_POINT = {x: 30, y: 30};

window.onload = function(){
    var canvas = document.getElementById('mycanvas');
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HIGHT;
    var context = canvas.getContext("2d");
    init_grid(context);
    fill_pix(0, 0, context);
    fill_pix(49, 32, context);
    loadJson('basketball.gif_data.json', function (data) {
        var nframe = 0;
        var interval = setInterval(function () {
            if(nframe>=data.length){
                clearInterval(interval);
                return;
            }
            console.log("Play "+ nframe);
            draw_one(data[nframe], context);
            nframe ++;
        }, 200)
    })

}
const init_grid = function (context) {
    context.beginPath()
    context.moveTo( START_POINT.x, START_POINT.y);
    context.setLineDash([1, 2]);
    context.lineWidth = 0.5;
    context.strokeStyle = 'black';
    for(let i=0; i<GRID_WIDTH+1; i++){
        context.beginPath()
        context.moveTo(START_POINT.x + i*CELL_WIDTH, START_POINT.y);
        context.lineTo(START_POINT.x + i*CELL_WIDTH, START_POINT.y + GRID_HEIGHT*CELL_WIDTH);
        context.closePath();
        context.stroke()
    }
    for (let i=0; i<GRID_HEIGHT+1;i++){
        context.beginPath()
        context.moveTo(START_POINT.x, START_POINT.y + i*CELL_WIDTH);
        context.lineTo(START_POINT.x + GRID_WIDTH*CELL_WIDTH, START_POINT.y + i*CELL_WIDTH);
        context.closePath();
        context.stroke()

    }
}

const draw_one = function(pic, ctx){
    ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HIGHT);
    init_grid(ctx);
    for(let i=0; i<pic.length;i++){
        fill_pix(pic[i][1], pic[i][0], ctx);
    }
}


const fill_pix = function (x, y, ctx) {
    let point = convert_coordinate_point(x, y);
    ctx.fillRect(point.x, point.y, CELL_WIDTH, CELL_WIDTH);

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