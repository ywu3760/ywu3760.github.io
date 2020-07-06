function init() {
    BGND_CHANGING = false;
    ANIMATION = null;
    NAV_IN_TRANSITION = false;
    initCanvas();
    addLevels();
    addFadeEffect();
}

window.addEventListener("resize", function() {
    window.cancelAnimationFrame(ANIMATION);
    initCanvas();
});

function initCanvas() {
    cvs = document.querySelector('canvas');
    ctx = cvs.getContext('2d');
    cvs.width = document.body.clientWidth;
    cvs.height = document.body.clientHeight;

    var bgndColorScheme = [
        "#000029",
        "#000000",
        "#000010",
        "#000020"
    ], ptColorScheme = [
        "#ffc0cb",
        "#c0ffd5",
        "#c0ebff",
        "#cbffc0",
        "#c0ffd5"
    ], windowArea = (document.body.clientWidth*document.body.clientHeight)/1158144;

    art = new Artwork(
        parseInt(50*windowArea), // number of points
        2, // radius of point
        75, // maximum distance for point connection
        1, // lowest speed (exclusive)
        3, // highest speed (exclusive)
        bgndColorScheme, // background color
        ptColorScheme // color of points
    );
}

class Point {
    constructor(x, y, r, c, s, d) {
        this.pos = [x, y];
        this.radius = r;
        this.color = c;
        this.vector = [s, d];
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    move() {
        if (this.pos[0]-this.radius < 0 || this.pos[0]+this.radius > cvs.width) this.vector[1] = Math.PI - this.vector[1];
        if (this.pos[1]-this.radius < 0 || this.pos[1]+this.radius > cvs.height) this.vector[1] = 2*Math.PI - this.vector[1];
        this.pos[0]+= this.vector[0]*Math.cos(this.vector[1]);
        this.pos[1]-= this.vector[0]*Math.sin(this.vector[1]);
        this.draw();
    }
}

class Artwork {
    constructor(n, r, pr, ls, ms, ba, ca) {
        this.bgndColorPallete = ba;
        this.ptColorPallete = ca;
        this.pointProximity = pr;
        this.pointRadius = r;
        this.speedBounds = [ls, ms];
        this.points = [];
        for (var i=0; i<n; i++) this.addPoint(randNum(r+10, cvs.width-r-10, 1), randNum(r, cvs.height-r, 1));

        this.update();
    }
    update() {
        cvs.width = document.body.clientWidth;
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        this.changeBgndColor();
        for (var i=0; i<this.points.length; i++) this.points[i].move();
        for (var i=0; i<this.points.length; i++) {
            for (var j=0, cp=[]; j<this.points.length; j++) if (j != i && ((this.points[i].pos[0]-this.points[j].pos[0])**2 + (this.points[i].pos[1]-this.points[j].pos[1])**2 <= this.pointProximity**2)) cp.push(j);
            for (var j=0; j<cp.length; j++) {
                var grd = ctx.createRadialGradient(
                    this.points[i].pos[0],
                    this.points[i].pos[1],
                    Math.sqrt((this.points[cp[j]].pos[0]-this.points[i].pos[0])**2 + (this.points[cp[j]].pos[1]-this.points[i].pos[1])**2)/2,
                    this.points[cp[j]].pos[0],
                    this.points[cp[j]].pos[1],
                    Math.sqrt((this.points[cp[j]].pos[0]-this.points[i].pos[0])**2 + (this.points[cp[j]].pos[1]-this.points[i].pos[1])**2)/2
                );
                grd.addColorStop(0, this.points[i].color);
                grd.addColorStop(1, this.points[cp[j]].color);
                ctx.beginPath();
                ctx.moveTo(this.points[i].pos[0], this.points[i].pos[1]);
                ctx.lineTo(this.points[cp[j]].pos[0], this.points[cp[j]].pos[1]);
                ctx.strokeStyle = grd;
                ctx.lineWidth = this.pointRadius;
                ctx.stroke();
                ctx.closePath();
            }
        }
        
        ANIMATION = window.requestAnimationFrame(this.update.bind(this));
    }
    addPoint(x, y) {
        var a = function() {do var z = 2*Math.random()*Math.PI; while ([0, Math.PI/2, Math.PI, 3*Math.PI/2].includes(z)); return z;};
        this.points.push(new Point(x, y, this.pointRadius, this.ptColorPallete.randomItem(), Math.random()*(this.speedBounds[1]-this.speedBounds[0]) + this.speedBounds[0], a()));
    }
    changeBgndColor() {
        if (BGND_CHANGING) return;
        BGND_CHANGING = true;
        $("body").css("background-color", this.bgndColorPallete.randomItem());
        window.setTimeout(function() {BGND_CHANGING = false;}, 5000);
    }
}

function toggleNavBar(a, b) {
    if (NAV_IN_TRANSITION)
        return;
    NAV_IN_TRANSITION = true;
    if (b > 0) for (var i=1; i<=b; i++) $(`#level-${i}`).attr("class", 'level');
    switch (a) {
        case 0:
            $(".welcome-nav-content").css({
                "visibility": "visible",
                "opacity": 1
            });
            setTimeout(function() {
                $("img").attr("onclick", `toggleNavBar(1,${b})`);
                NAV_IN_TRANSITION = false;
            }, 500);
            break;
        case 1:
            $(".welcome-nav-content").css("opacity", 0);
            setTimeout(function() {
                $(".welcome-nav-content").css("visibility", "hidden");
                $("img").attr("onclick", `toggleNavBar(0,${b})`);
                NAV_IN_TRANSITION = false;
            }, 500);
    }
}

function addLevels() {
    for (var i=0; i<PAGE_DATA.length; i++) $("body").append(
        $(`<section id='level-${i+1}' class='level effect'>
            <div class='level-title'>${PAGE_DATA[i].title}</div>
            <div class='level-content'>${PAGE_DATA[i].content}</div>
            <a class='level-anchor' href='${PAGE_DATA[i].src}'>${PAGE_DATA[i].src_title} &#x2192</a>
        </section>`));
}

function addFadeEffect() {
    $(window).scroll(function() {
        var a = $(this).scrollTop() + $(this).innerHeight();
        $(".effect").each(function() {
            var b = $(this).offset().top;
            if (a > b && $(this).css("opacity") == 0) $(this).css({
                "opacity": 1,
                "transform": "none"
            });
        });
    }).scroll();
}