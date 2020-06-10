// GLOBALS
for (var i=0, h=0; i<document.body.children.length; i++)
    h+= document.body.children[i].getBoundingClientRect().height;

c = document.createElement('canvas');      
ctx = c.getContext('2d');
cw = c.width = window.innerWidth;
ch = c.height = h;

// OCEAN WATER COLOR
var g = ctx.createLinearGradient(0, 0, 0, ch);
g.addColorStop(0, "#e0ffff");
g.addColorStop(1, "#0000ed");
ctx.fillStyle = g;
ctx.fillRect(0, 0, cw, ch);
updateBackground();

// WAVES




function updateBackground()
{
    document.body.style.background = `url(${c.toDataURL()})`;
}