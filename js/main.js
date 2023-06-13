/*
  The purpose of girdCanvas is only to show the grid. It has no
  interaction with the user. User interacts only with drawCanvas.

*/

/*
  PixelGrid is a Singleton class with only one instance. You cannot
  create multiple instances of it.

*/


var PixelGrid = new function(){
    /*
      These are private variables. These can only be access by private
      and public function of this class.
     */
    
    var blockSize = 20;

    var gridCanvas;
    var gridContext;
    var gridColor;

    var drawCanvas;
    var drawContext;

    var fillColor = "#00ff00";
    var backgroundColor = "#ffffff";


    //--------------------------PUBLIC FUNCTIONS----------------------------------------
    
    // this will be called from outside
    this.init = function() {        
        gridCanvas = document.getElementById("gridCanvas");
        gridContext = document.getElementById("gridCanvas").getContext("2d");
        gridColor = "#606060";

        drawLines();

        drawCanvas = document.getElementById("drawCanvas");
        drawContext = drawCanvas.getContext("2d");
//        drawCanvas.style.backgroundColor = backgroundColor;
        this.setBackgroundColor();
    }

    this.isValidCanvasSize = function(canvasSize){
        var size = canvasSize.split("x");
        if(parseInt(size[0]) > 20 || parseInt(size[1]) > 20){
            return false;
        }
        return true;
    }

    this.setCanvasSize = function(canvasSize){
        /*
          Reset change in pixelgrid size if no of rows
          or columns > 20.
        */

        var size = canvasSize.split("x");
        setSize(gridCanvas, parseInt(size[0])*blockSize, parseInt(size[1])*blockSize);
        setSize(drawCanvas,parseInt(size[0])*blockSize, parseInt(size[1])*blockSize);
        init();        
    }

    this.paint = function(event) {
        var corner = getBlockCorner(event);
        //console.log(corner);
        paintBlock(corner);
    }

    this.isValidColor = function(color) {
        //Check for valid hexcode 
        if(/^[0-9A-F]*$/i.test(color) && ((6 == color.length) || (3 == color.length))) {
            return true;
        }
        return false;
    }

    this.updateFillColor = function(fillColor_){
        fillColor = "#" + fillColor_;
        console.log(fillColor);
    }

    this.updateBackgroundColor = function(backgroundColor_){
        backgroundColor = "#" + backgroundColor_;
    }
    
    this.setBackgroundColor = function(){
//        drawCanvas.style.backgroundColor = backgroundColor;
        drawContext.fillStyle = backgroundColor;
        drawContext.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
    }    

    //-----------------PRIVATE FUNCTIONS--------------------------------

    function paintBlock(corner) {
        console.log(fillColor);
        var pixel = drawContext.getImageData(corner[1],corner[0],1,1).data;
        var currentColor = "#" + ("000000" + ColorCalc.rgbToHex(pixel[0],pixel[1],pixel[2])).slice(-6);
        if(currentColor == fillColor) {
            drawContext.fillStyle = backgroundColor;
        } else {
            drawContext.fillStyle = fillColor;
        }
        drawContext.fillRect(corner[1], corner[0], blockSize, blockSize);
    }
    
    function setSize(canvas,width,height){
        canvas.width = width;
        canvas.height = height;
    }

    function drawLine(x1, y1, x2, y2) {
        gridContext.beginPath();
        gridContext.lineWidth = 2;
        gridContext.moveTo(x1, y1);
        gridContext.lineTo(x2, y2);
        gridContext.strokeStyle = this.gridColor;
        gridContext.stroke();
    }

    function drawLines() {
        for(var i = 0.0; i < window.innerWidth; i +=blockSize) {
            drawLine(i, 0, i, window.innerHeight);
            drawLine(0, i, window.innerWidth, i);
        }
    }

    function getBlockCorner(event) {
        var rect = gridCanvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        if(x < 0 || y < 0|| x > window.innerWidth || y > window.innerHeight) return;
        var column = Math.floor(x/blockSize);
        var row = Math.floor(y/blockSize);
        var corner = [0, 0];
        corner[0] = row*blockSize;
        corner[1] = column*blockSize;
        return corner;
    }
}

function download(canvas, filename) {
    var saveCanvas = document.createElement("canvas");
    saveCanvas.width = canvas.width;
    saveCanvas.height = canvas.height;

    var saveCanvasContext = saveCanvas.getContext('2d');
    saveCanvasContext.putImageData(
        canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height), 0, 0);

    var link = document.createElement('a'), e;
    link.download = filename;
    link.href = saveCanvas.toDataURL();

    if (document.createEvent) {
        e = document.createEvent("MouseEvents");
        e.initMouseEvent(
            "click", true, true, window,0,0,0,0,0, false, false, false,false, 0, null);
        link.dispatchEvent(e);
    } 
    else if (lnk.fireEvent) {
        link.fireEvent("onclick");
    }
}

//Singleton class
var ColorCalc = new function(){
    this.componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
    }

    this.rgbToHex = function(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
}






