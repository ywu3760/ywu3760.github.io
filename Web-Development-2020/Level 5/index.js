function init() {
    BGND_CHANGING = false;
    ANIMATION = null;
    NAV_IN_TRANSITION = false;
    FADE_OUT = false;
    initCanvas();
    addNav(0);
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
    console.log(b);
    if (NAV_IN_TRANSITION)
        return;
    NAV_IN_TRANSITION = true;
    switch (a) {
        case 0:
            $(".nav-content").css({
                "visibility": "visible",
                "opacity": 1
            });
            setTimeout(function() {
                $(".nav-content-btn").attr("onclick", `toggleNavBar(1,5)`);
                NAV_IN_TRANSITION = false;
            }, 500);
            break;
        case 1:
            $(".nav-content").css("opacity", 0);
            setTimeout(function() {
                $(".nav-content").css("visibility", "hidden");
                $(".nav-content-btn").attr("onclick", `toggleNavBar(0,5)`);
                NAV_IN_TRANSITION = false;
            }, 500);
    }
    console.log(b != 5);
    if (b != 5) addNav(b);
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

function addNav(a) {
    var names = ["Lessons", "Samples", "FAQ", "Projects", "Other Levels"];
    $(".nav-content").empty();
    for (var i=0; i<4; i++) {
        $(".nav-content").append($(`<a>`)
            .html(names[i])
            .attr("id", `nav-content-${i}`)
        );
        if (a == i)
            $(`#nav-content-${i}`).attr("class", "nav-content-active");
        else
            $(`#nav-content-${i}`).attr({
                "class": "nav-content-inactive",
                "onclick": `toggleNavBar(1,${i})`,
                "href": "#header"
            });
        $(`#nav-content-${i}`).removeAttr("id");
    }
    $(".nav-content").append(`<a class="nav-content-inactive" href="../index.html" onclick="toggleNavBar(1,4)">${names[4]}</a>`);

    addText();
}

function addText() {
    if ($(".header-title span").html().toLowerCase().length > 0) $(`.${$(".header-title span").html().toLowerCase()}`).remove();
    $(".header-title").html(`${PAGE_DATA.level}: `).append($("<span>")
        .html($(".nav-content-active").html())
        .css("opacity", 0)
        .animate({opacity: 1}, 1000)
    );
    $(".header-descr").html(PAGE_DATA.title);
    switch ($(".nav-content-active").html().toLowerCase()) {
        case "lessons":
            $(".enlarge-overlay").remove();
            $("body").append($(`<section class="enlarge-overlay" onclick="if ($('.enlarge-overlay-div').css('display')=='none' && FADE_OUT) {$(this).fadeOut(300, function() {$('.enlarge-overlay img').css('width','auto')});$(this).fadeOut(0);}">
                    <img onmouseover="if (FADE_OUT) FADE_OUT = false;" onmouseout="if (!FADE_OUT) FADE_OUT = true;" onclick="clickEnlarge()" src="lessons/${PAGE_DATA.lessons[0].title.toLocaleLowerCase()}/${PAGE_DATA.lessons[0].slides[0].image}" alt="enlarged image">
                    <div class="enlarge-overlay-div" onclick="$('.enlarge-overlay-div').fadeOut(300)">
                        Click on the image to enlarge.<br>Click outside the image to return.<br>Click anywhere right now to continue.
                    </div>
                </section>
                <section class="lessons">
                <div class="lessons-title">
                    <button class="lessons-title-btn" onclick="shiftChapter(-1)">Back</button>
                    <div>1. ${PAGE_DATA.lessons[0].title}</div>
                    <button class="lessons-title-btn" onclick="shiftChapter(1)">Next</button>
                </div>
                <div class="lessons-obj">Objective: ${PAGE_DATA.lessons[0].objective}</div>
                <div class="lessons-descr">${PAGE_DATA.lessons[0].description}</div>
                <div class="lessons-slide-title">Chapter 1, Slide 1</div>
                <div class="lessons-slide">
                    <div class="lessons-slide-text">${PAGE_DATA.lessons[0].slides[0].text}</div>
                    <div class="lessons-slide-image">
                        <img src="lessons/${PAGE_DATA.lessons[0].title.toLocaleLowerCase()}/${PAGE_DATA.lessons[0].slides[0].image}" alt="slide">
                    </div>
                    <img class="lessons-glass" onclick="$('.enlarge-overlay, .enlarge-overlay-div').fadeIn(300);" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Magnifying_glass_icon.svg/1200px-Magnifying_glass_icon.svg.png" alt="Magnifying glass icon.svg">
                </div>
                <div class="lessons-slide-nav-2">
                    <button onclick="shiftSlide(-1)">Previous Slide</button>
                    <button onclick="shiftSlide(1)">Next Slide</button>
                </div>
            </section>`));
            $(".enlarge-overlay").fadeOut(0);
            break;
        case "samples":
            for (var i=0; i<PAGE_DATA.samples.length; i++) $("body").append($(`<section class="samples effect">
                <div class="samples-title">${PAGE_DATA.samples[i].lesson}: ${PAGE_DATA.samples[i].title}</div>
                <div class="samples-text">${PAGE_DATA.samples[i].text}</div>
                <a class="samples-download" href="samples/${PAGE_DATA.samples[i].title}.zip">&#x2192 Sample's ZIP File</a>
            </section>`));
            break;
        case "faq":
            for (var i=0; i<PAGE_DATA.faq.length; i++) $("body").append($(`<section class="faq effect">
                <div class="faq-question">${PAGE_DATA.faq[i].question}</div>
                <div class="faq-answer">${PAGE_DATA.faq[i].answer}</div>
            </section>`));
            break;
        case "projects":
            for (var i=0; i<PAGE_DATA.projects.length; i++) $("body").append($(`<section class="projects effect">
                <div class="projects-title">${PAGE_DATA.projects[i].title} Project</div>
                <div class="projects-text">${PAGE_DATA.projects[i].text}</div>
                <div class="projects-download-box">
                    <a class="projects-download" href="projects/${PAGE_DATA.level} Assessment Forms.zip">&#x2192 Grading Material</a>
                    <a class="projects-download" href="projects/${PAGE_DATA.level} ${PAGE_DATA.projects[i].title}.pdf" target="_blank">&#x2192 Project Details</a>
                </div>
            </section>`));
    }
}

function shiftChapter(a) {
    var chapNum = parseInt($(".lessons-title div").html().split(" ")[0]),
        newChapNum = chapNum + a;
    if ([0, PAGE_DATA.lessons.length+1].includes(newChapNum)) return;
    $(".lessons-title div").html(`${newChapNum}. ${PAGE_DATA.lessons[newChapNum-1].title}`);
    $(".lessons-obj").html(`Objective: ${PAGE_DATA.lessons[newChapNum-1].objective}`);
    $(".lessons-descr").html(`${PAGE_DATA.lessons[newChapNum-1].description}`);
    $(".lessons-slide-title").html(`Chapter ${newChapNum}, Slide 1`);
    $(".lessons-slide-text").html(PAGE_DATA.lessons[newChapNum-1].slides[0].text);
    $(".lessons-slide-image img:nth-child(1)").attr("src", `lessons/${PAGE_DATA.lessons[newChapNum-1].title.toLocaleLowerCase()}/${PAGE_DATA.lessons[newChapNum-1].slides[0].image}`);
    $('.enlarge-overlay img').attr("src", `lessons/${PAGE_DATA.lessons[newChapNum-1].title.toLocaleLowerCase()}/${PAGE_DATA.lessons[newChapNum-1].slides[0].image}`);
}

function shiftSlide(a) {
    var chapNum = parseInt($(".lessons-title div").html().split(" ")[0]),
        slideNum = parseInt($(".lessons-slide-title").html().split(" ")[3]),
        newSlideNum = slideNum + a;
    if ([0, PAGE_DATA.lessons[chapNum-1].slides.length+1].includes(newSlideNum)) return "no";
    $(".lessons-slide-title").html(`Chapter ${chapNum}, Slide ${newSlideNum}`);
    $(".lessons-slide-text").html(PAGE_DATA.lessons[chapNum-1].slides[newSlideNum-1].text);
    $(".lessons-slide-image img:nth-child(1)").attr("src", `lessons/${PAGE_DATA.lessons[chapNum-1].title.toLocaleLowerCase()}/${PAGE_DATA.lessons[chapNum-1].slides[newSlideNum-1].image}`);
    $('.enlarge-overlay img').attr("src", `lessons/${PAGE_DATA.lessons[chapNum-1].title.toLocaleLowerCase()}/${PAGE_DATA.lessons[chapNum-1].slides[newSlideNum-1].image}`);
}

function clickEnlarge() {
    var currentWidth = $(".enlarge-overlay img").width(),
        currentHeight = $(".enlarge-overlay img").height();
    if (1.33*currentWidth < 0.95*document.body.clientWidth && 1.33*currentHeight < 0.95*document.body.clientHeight) $(".enlarge-overlay img").width(currentWidth).width(1.33*currentWidth);
    else if (1.33*currentWidth > 0.95*document.body.clientWidth && 1.33*currentHeight < 0.95*document.body.clientHeight) $(".enlarge-overlay img").width(0.95*document.body.clientWidth);
    else if (1.33*currentWidth < 0.95*document.body.clientWidth && 1.33*currentHeight > 0.95*document.body.clientHeight) $(".enlarge-overlay img").width(0.95*document.body.clientHeight);
    else if (1.33*currentWidth > 0.95*document.body.clientWidth && 1.33*currentHeight > 0.95*document.body.clientHeight) return;
}