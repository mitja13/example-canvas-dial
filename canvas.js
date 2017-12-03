window.onload = function() {
    var canvas = document.getElementById("canvas");
    var g = canvas.getContext("2d");

    var width = canvas.width
    var height = canvas.height

    var degrees = 200;
    var color = "lightgreen";
    var backgroundColor = "#222";

    function setup() 
    {
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
    }

    setup();
}