const NODE_DISPLACEMENT = 96,
    WAVECOUNT = 4,
    DEBUG = true,
    SPEED = 1;
lol = 0;
window.addEventListener('resize', function (e)
{
    startCanvas();
    console.log('new canvas');
});

window.addEventListener('mousemove', function (e)
{
    
});

window.addEventListener('click', function (e)
{
    
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
        'rgba(73, 254, 236, 0.7)',
        'rgba(84, 195, 215, 0.6)',
        'rgba(0, 153, 255, 0.4)',
        'rgba(3, 7, 108, 0.1)'
    ];

    ocean = new Ocean(NODE_DISPLACEMENT, waveYCoord, waveSpacing, colorScheme, WAVECOUNT);
    ocean.newWaveFrame();
}

class Wave
{
    constructor(nodeDisplacement, displacement, color)
    {
        this.color = color;
        this.yCoord = displacement;
        this.nodes = this.createNodes(nodeDisplacement);
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
        if (DEBUG)
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

class Ocean
{
    constructor(nodeDisplacement, startingYCoord, waveSpacing, colorScheme, waveCount)
    {
        this.waves = [];
        for (var i=0; i<waveCount; i++)
            this.waves.push(new Wave(nodeDisplacement, startingYCoord + (i * waveSpacing), colorScheme[i]));
    }

    newWaveFrame()
    {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = `rgba(73, 254, 236, 0.4)`;
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        for (var i=0; i<this.waves.length; i++)
        {
            this.waves[i].updateNodes();
            this.waves[i].drawWave();
        }

        requestAnimationFrame(this.newWaveFrame.bind(this));
    }
}