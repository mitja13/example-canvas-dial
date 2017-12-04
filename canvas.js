window.onload = function() {

    // variables
    var degrees = 200;
    var text;

    // properties
    var color = "lightgreen";
    var backgroundColor = "#222";

    // setup canvas
    var canvas = document.getElementById("canvas");
    var g = canvas.getContext("2d");

    var width = canvas.width
    var height = canvas.height

    function draw() {
        // clear canvas everytime
        g.clearRect(0, 0, width, height);

        // background circle
        g.beginPath();
        g.strokeStyle = backgroundColor;
        g.lineWidth = 30;
        g.arc(width/2, height/2, 100, 0, 2*Math.PI, false);
        g.stroke();

        // gauge will be a simple arc
        var radians = degrees * Math.PI / 180;
        g.beginPath();
        g.strokeStyle = color;
        g.lineWidth = 30;
        g.arc(width/2, height/2, 100, -0.5*Math.PI, radians -0.5*Math.PI, false);
        g.stroke();

        // text to display value
        g.fillStyle = color;
        g.font = "50px helvetica";
        text = Math.floor(degrees/360*100) + '%';
        textWidth = g.measureText(text).width;
        g.fillText(text, width/2 - textWidth/2, height/2 + 20);
        
    }

    draw();
}