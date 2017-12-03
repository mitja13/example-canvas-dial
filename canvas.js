window.onload = function() {
    var canvas = document.getElementById("canvas");
    var g = canvas.getContext("2d");

    var width = canvas.width
    var height = canvas.height

    var degrees = 200;
    var color = "lightgreen";
    var backgroundColor = "#222";

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
    }

    function animateValue() {
        newDegrees = Math.round(Math.random()*360);
        var difference = newDegrees - degrees;
        //draw();
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