const NODE_DISPLACEMENT = 96,
    WAVECOUNT = 4,
    DROPCOUNT = 100,
    CANVAS_DEBUG = false,
    SPEED = 1;

window.addEventListener('resize', function (e)
{
    startCanvas();
});

function startCanvas()
{
    cvs = canvasElement = document.getElementById("header-canvas");   
    ctx = cvs.getContext('2d');
    cvs.width = cvs.getBoundingClientRect().width;
    cvs.height = cvs.getBoundingClientRect().height;

    waveHeight = 0.045 * cvs.height;
    waveYCoord = 0.2 * cvs.height;
    waveSpacing = 0.018 * cvs.height;

    colorScheme = [
        gradientColor('rgba(20, 87, 108, 0.8)', 1),
        gradientColor('rgba(23, 100, 125, 0.8)', 1, 'rgba(17, 74, 91, 1)', 2),
        gradientColor('rgba(26, 114, 141, 0.7)', 1, 'rgba(17, 74, 91, 1)', 2),
        gradientColor('rgba(32, 140, 174, 0.3)', 1, 'rgba(17, 74, 91, 1)', 2)
    ];
    
    ocean = new Ocean(NODE_DISPLACEMENT, waveYCoord, waveSpacing, colorScheme, WAVECOUNT, DROPCOUNT, 20, 1.1 * Math.PI, 0.5);
    ocean.newWaveFrame();
}

function createGradient(...colors)
{
    var grd = ctx.createLinearGradient(0, 0, 0, cvs.height);
    grd.addColorStop(0, colors[0]);
    for (var i=1; i<colors.length; i++)
        grd.addColorStop(i / (colors.length - 1), colors[i]);

    return grd;
}

function gradientColor(...colorParams) // [color, %, color, %]
{
    if (colorParams.length % 2 == 1)
        return "#000000";

    for (var i=0, p=[]; i<colorParams.length/2; i++)
        for (var j=0; j<colorParams[(2*i) + 1]; j++)
            p.push(colorParams[(2*i)]);

    return createGradient.apply(null, p);
}

class Ocean
{
    constructor(nodeDisplacement, startingYCoord, waveSpacing, colorScheme, waveCount, dropCount, dropLength, dropDirection, dropIntensity)
    {
        this.waves = [];
        for (var i=0; i<waveCount; i++)
            this.waves.push(new Wave(
                nodeDisplacement,
                startingYCoord + (i * waveSpacing),
                colorScheme[i],
                dropCount,
                dropLength,
                dropDirection,
                dropIntensity
            ));
    }

    newWaveFrame()
    {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = `rgb(118, 157, 167)`;
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        for (var i=0; i<this.waves.length; i++)
        {
            this.waves[i].updateNodes();
            this.waves[i].rain.updateRain();
            this.waves[i].drawWave();
            this.waves[i].rain.drawRain();
        }

        requestAnimationFrame(this.newWaveFrame.bind(this));
    }
}

class Wave
{
    constructor(nodeDisplacement, displacement, color, dropCount, dropLength, dropDirection, dropIntensity)
    {
        this.color = color;
        this.yCoord = displacement;
        this.nodes = this.createNodes(nodeDisplacement);
        this.rain = new Rain(dropCount, this.yCoord + waveHeight, dropLength, dropDirection, this.color, dropIntensity);
    }

    createNodes(nodeDisplacement)
    {
        var s = function(lowerBound, increase)
        {
            var o = Math.random();
            if (o < lowerBound)
                o+= increase;
            return o;
        }

        for (var i=0, n=[]; i<=(cvs.width/nodeDisplacement)+1; i++)
            n.push([
                nodeDisplacement * i,
                this.yCoord + randNum(-1 * waveHeight, waveHeight, 1),
                Math.random() * (s(0.4, 0.4) * SPEED * 2000),
                s(0.4, 0.4) * SPEED 
            ]);

        return n;
    }

    drawNodes()
    {
        ctx.strokeStyle = "black";
        for (var i=0; i<this.nodes.length; i++)
        {
            ctx.beginPath();
            ctx.arc(this.nodes[i][0], this.nodes[i][1], 4, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    updateNodes()
    {
        for (var j=0; j<this.nodes.length; j++)
        {
            this.nodes[j][1] = ((waveHeight/2) * Math.sin(this.nodes[j][2]/20)) + this.yCoord;
            this.nodes[j][2]+= this.nodes[j][3];
        }
    }

    drawWave()
    {
        if (CANVAS_DEBUG)
            this.drawNodes();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.nodes[0][0], this.nodes[0][1]);
        for (var i=0; i<this.nodes.length; i++)
        {
            if (this.nodes[i + 1])
                var y = this.nodes[i + 1][1];
            else
                var y = this.nodes[i - 1][1];
            ctx.quadraticCurveTo(
                this.nodes[i][0],
                this.nodes[i][1],
                medianOf(this.nodes[i][0], this.nodes[i][0] + (cvs.width / (this.nodes.length + 1))),
                medianOf(this.nodes[i][1], y)
            );
        }
        ctx.lineTo(cvs.width, cvs.height);
        ctx.lineTo(0, cvs.height);
        ctx.closePath();
        ctx.fill();
    }
}

class Rain
{
    constructor(dropCount, yCoord, dropLength, dropDirection, dropColor, dropIntensity)
    {
        this.dropsNeeded = dropCount;
        this.yBound = yCoord;
        this.dropLength = dropLength;
        this.dropDirection = dropDirection;
        this.dropColor = dropColor;
        this.dropIntensity = dropIntensity;
        this.drops = [];

        for (var i=0; i<this.dropsNeeded; i++)
            this.drops.push(new Raindrop(
                this.yBound - (Math.random() * waveHeight),
                this.dropLength,
                this.dropDirection,
                this.dropColor,
                this.dropIntensity
            ));
    }

    updateRain()
    {
        for (var i=0, r=[]; i<this.drops.length; i++)
        {
            this.drops[i].updateDrop();
            if (this.drops[i].pointA[1] <= this.drops[i].yGoal && this.drops[i].pointB[1] >= this.drops[i].yGoal)
            {
                this.drops[i].color = "white";
                this.drops[i].pointA = [medianOf(this.drops[i].pointA[0], this.drops[i].pointB[0]), this.drops[i].yGoal];
            }
            if (this.drops[i].finishedRoute)
                r.push(i);
        }
        
        for (var i=r.length-1; i>-1; i--)
            this.drops.splice(r[i], 1);

        for (var i=0; i<r.length; i++)
            this.drops.push(new Raindrop(
                this.yBound - (Math.random() * waveHeight),
                this.dropLength,
                this.dropDirection,
                this.dropColor,
                this.dropIntensity
            ));
    }

    drawRain()
    {
        for (var i=0; i<this.drops.length; i++)
            this.drops[i].drawDrop();
    }
}

class Raindrop
{
    constructor(yBound, length, radian, color, fallingSpeed)
    {
        this.xChange = length * Math.sin(radian);
        this.yChange = -1 * length * Math.cos(radian);
        this.yGoal = yBound;
        this.color = color;
        this.fallingSpeed = fallingSpeed;

        this.pointB = [randNum(0, 1.5 * cvs.width, 1), randNum(-0.2 * cvs.height, this.yGoal, 0)];
        this.pointA = [this.pointB[0] - this.xChange, this.pointB[1] - this.yChange];
    }

    drawDrop()
    {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.moveTo(this.pointA[0], this.pointA[1]);
        ctx.lineTo(this.pointB[0], this.pointB[1]);
        ctx.stroke();
    }

    updateDrop()
    {
        var xChange = this.fallingSpeed * this.xChange,
            yChange = this.fallingSpeed * this.yChange;
        this.pointA = [this.pointA[0] + xChange, this.pointA[1] + yChange];
        this.pointB = [this.pointB[0] + xChange, this.pointB[1] + yChange];
    }

    get finishedRoute()
    {
        if (this.pointA[1] > this.yGoal)
            return true;
        
        return false;
    }
}