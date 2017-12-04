window.onload = function() {
    var canvas = document.getElementById("canvas");
    var g = canvas.getContext("2d");

    var width = canvas.width
    var height = canvas.height

    var degrees = 200;
    var color = "lightgreen";
    var backgroundColor = "#222";

    var text;
    var difference = 0;
    var newDegrees = 0;
    var animationValue, animationLoop;

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

    function animateValue() {
        newDegrees = Math.round(Math.random()*360);
        difference = newDegrees - degrees;
        animationLoop = setInterval(animateTo, 1000/difference);
    }

    function animateTo() {
        if (degrees < newDegrees) {
            degrees++;
        }
        else {
            degrees--;
        }

        if (degrees == newDegrees)  {
            clearInterval(animationLoop);
        }

        draw();
    }

    draw();

    valueLoop = setInterval(animateValue, 2000);
}