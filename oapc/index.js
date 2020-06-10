class Drawing
{
    constructor()
    {
        for (var i=0, h=0; i<document.body.children.length; i++)
            h+= document.body.children[i].getBoundingClientRect().height;
        
        this.element = document.createElement('canvas');
        this.context = this.element.getContext('2d');
        this.contextWidth = this.element.width = window.innerWidth;
        this.contextHeight = this.element.height = h;

        this.updateBackground();
    }

    updateBackground()
    {
        document.body.style.background = `url(${this.element.toDataURL()})`;
    }
}

function init()
{
    new Drawing;
}