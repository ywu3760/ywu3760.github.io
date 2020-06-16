const galleyImgSrc = [
    "pan-img-0-0.jpg",
    "pan-img-0-1.jpg",
    "pan-img-0-2.jpg"
], galleryImgDescrip = [
    "Coral reefs are homes to many marine organisms and require optimal pH levels to grow their skeletons. <span>Rising ocean acidity</span> threatens the health of coral reefs by impeding their skeletal growth. Researchers found that corals exposed to lower pH waters <span>produce less aragonite</span> to <span>build skeletons</span> and are more vulnerable to damages from pounding waves.  Along with other stressors such as global warming and sea pollution, ocean acidification is hammering a <span>future of uncertainty</span> into our coral reefs.",
    "The food source of many <span>marine organisms</span> is <span>jeopardized</span> due to ocean acidification. From small crustaceans such as krill to big marine mammals such as whales, <span>pteropods</span> are an <span>important food source</span>. Pteropods are susceptible to acidic environments. According to NOAA, when pteropod shells were placed in a sea water with pH and carbonate levels projected for year 2100, they <span>dissolve in 45 days</span>. The effects of the depleting source of pteropods will magnify as we move up in the <span>food chain</span>. The depletion of one specie can mean the extinction of another.",
    'Ocean acidification is putting many <span>coastal communities at risk</span>, especially those who rely on the <span>seafood economy</span> to make a living. An article on nrdc.org points out that the U.S. has a $1 billion shellfish industry. In coastal communities like New Bedford, Massachusetts, scallops plays a huge role in the <span>local economy</span>. Ocean acidification can reduce the ability of shellfish to build their shells. This effect can propagate and lead to a &#8220<span>precipice of economic collapse</span>&#8221 for communities who relies on a particular seafood to thrive.'
], galleryImgMore = [
    "https://www.whoi.edu/press-room/news-release/scientists-identify-how-ocean-acidification-weakens-coral-skeletons/",
    "https://www.pmel.noaa.gov/co2/story/What+is+Ocean+Acidification%3F",
    "https://www.nrdc.org/onearth/fishing-industry-acid#:~:text=The%20Fishing%20Industry%20on%20Acid,communities%20like%20these%20the%20hardest.&text=Statewide%2C%20the%20value%20of%20the,a%E2%80%93year%20U.S.%20shellfish%20industry"
], galleryImgTitle = [
    "Coral Reefs",
    "Marine Animals",
    "Our Economy"
];

function init()
{
    startCanvas();
    startGallery();
}

class PanImage
{
    constructor(imgSrc, imgDescrip, imgMore)
    {
        this.xPos = 0;
        this.src = `images/${imgSrc}`;
        this.html = imgDescrip;
        this.more = imgMore;
    }
}

function startGallery()
{
    galleryInteractable = true;
    animationInAction = false;
    galleryImages = [];
    for (var i=0; i<galleyImgSrc.length; i++)
    {
        galleryImages.push(new PanImage(galleyImgSrc[i], galleryImgDescrip[i], galleryImgMore[i]));
        $(`#pan-gallery-img-${i}`).css({
            "width": (window.innerWidth / 3) + "px",
            "height": ((window.innerWidth * 22) / 63) + "px",
            "background-image": `url("${galleryImages[i].src}")`,
            "background-size": "cover",
            "background-position": "center center",
            "box-shadow": "rgba(0, 0, 0, 1) 20px 20px 30px inset, rgba(0, 0, 0, 1) -20px -20px 30px inset",
            "transition": "all 0.75s"
        }).attr({
            "onmouseover": "if (galleryInteractable) $(`#${this.id}`).css('box-shadow','rgba(0, 0, 0, 0) 20px 20px 30px inset, rgba(0, 0, 0, 0) -20px -20px 30px inset');",
            "onmouseout": "if (galleryInteractable) $(`#${this.id}`).css('box-shadow','rgba(0, 0, 0, 1) 20px 20px 30px inset, rgba(0, 0, 0, 1) -20px -20px 30px inset');",
            "onclick": "expandGalleryImg(this.id);"
        });
    }
}

function expandGalleryImg(id)
{
    galleryInteractable = false;
    if (animationInAction)
        return;
    animationInAction = true;
    
    for (var i=0; i<galleryImages.length; i++)
    {
        $(`#pan-gallery-img-${i}`).css('box-shadow', 'rgba(0, 0, 0, 0) 20px 20px 30px inset, rgba(0, 0, 0, 0) -20px -20px 30px inset');
        if (id != `pan-gallery-img-${i}`)
            $(`#pan-gallery-img-${i}`).css({
                "width": "0px",
                "opacity": "0"
            });
    }
    $("#pan-description").css("opacity", "0");
    $(`#${id}`).attr("onclick", `normalGallery("${id}");`);
    $("#pan-gallery").css({
        "padding-left": "80px",
        "padding-right": "80px",
    }).append($(`<div class='pan-expanded-info'>`));
    
    setTimeout(function(){
        $(`.pan-expanded-info`).css("width", (window.innerWidth - (window.innerWidth / 3) - 200) + "px");
        setTimeout(function(){
            $(`.pan-expanded-info`).css("opacity", "1").html(`
                <div class="pan-expanded-info-title">${galleryImgTitle[parseInt(id.charAt(id.length - 1))]}</div>
                <div class="pan-expanded-info-text">${galleryImgDescrip[parseInt(id.charAt(id.length - 1))]}</div>
            `);
            $("#pan-description").html("Click on the image to go back.");
            $("#pan-description").css("opacity", "1");
            setTimeout(function(){
                animationInAction = false;
                $(".more-3 button").css({
                    "opacity": "1",
                    "visibility": "visible"
                }).html(
                    `&#11208 Concerned About ${galleryImgTitle[parseInt(id.charAt(id.length - 1))]}? Learn More.`
                ).attr("onclick", `window.open('${galleryImgMore[parseInt(id.charAt(id.length - 1))]}', '_blank');`);
            }, 750);
        }, 750);
    }, 750);
}

function normalGallery(id)
{
    galleryInteractable = false;
    if (animationInAction)
        return;
    animationInAction = true;
    
    $(`.pan-expanded-info`).css("opacity", "0");
    $("#pan-description").css("opacity", "0");
    $(".more-3 button").css({
        "opacity": "0",
        "visibility": "hidden"
    });
    setTimeout(function(){
        $(`.pan-expanded-info`).empty();
        $(`.pan-expanded-info`).css("width", "0px");
        setTimeout(function(){
            $(`.pan-expanded-info`).remove();
            for (var i=0; i<galleryImages.length; i++)
                $(`#pan-gallery-img-${i}`).css({
                    "width": (window.innerWidth / 3) + "px",
                    "box-shadow": 'rgba(0, 0, 0, 1) 20px 20px 30px inset, rgba(0, 0, 0, 1) -20px -20px 30px inset',
                    "opacity": "1"
                });

            $(`#${id}`).attr("onclick", `expandGalleryImg("${id}");`);
            $("#pan-gallery").css({
                "padding-left": "0px",
                "padding-right": "0px",
            });
            $("#pan-description").html("Click on any image in the gallery to learn more.");
            $("#pan-description").css("opacity", "1");
            setTimeout(function(){
                animationInAction = false;
            }, 750);
        }, 750);
    }, 750);
}