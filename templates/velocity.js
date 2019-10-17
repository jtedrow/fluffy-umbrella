// Setup

var isWebkit = /Webkit/i.test(navigator.userAgent),
    isChrome = /Chrome/i.test(navigator.userAgent),
    isMobile = !!("ontouchstart" in window),
    isAndroid = /Android/i.test(navigator.userAgent);

$.fn.velocity.defaults.easing = "easeInOutSine";

// Randomly generate an integer between two numbers
function r (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var dotsCount = isMobile ? (isAndroid ? 40 : 70) : (isChrome ? 200 : 125),
    dotsHtml = "",
    $count = $("#count"),
    $dots;

for (var i = 0; i < dotsCount; i++) {
    dotsHtml += "div class='dot'></div>";
}

$dots = $(dotsHtml);
$count.html(dotsCount);

// Animation

var $container = $("#container"),
    $description = $("#description");

var screenWidth = window.screen.availWidth,
    screenHeight = window.screen.availHeight,
    chromeHeight = screenHeight - document.documentElement.clientHeight;

var translateZMin = -725
    translateZMax = 600;

$container
    .css("perspective-origin", screenWidth/2 + "px" + ((screenHeight * 0.45)- chromeHeight) + "px")
    .velocity({
        perspective: [ 215, 50],
        rotateZ: [5,0],
        opacity: [0.85, 0.55]
    }, {duration: 800, delay: 3250, loop: 2});

$dots
    .velocity({
        translateX: [
            function() { return "+=" + r(-screenWidth/2.5, screenWidth/2.5) },
            function() { return r(0, screenWidth)}
        ],
        translateY: [
            function() { return "+=" + r(-screenHeight/2.75, screenHeight/2.75) },
            function() { return r(0, screenHeight) }
        ],
        translateZ: [
            function() { return "+=" + r(translateZMin, translateZMax) },
            function() { return r(translateZMin, translateZMax) }
        ],
        opacity: [
            function() { return Math.random() },
            function() { return Math.random() + 0.1 } 
        ]
    }, { duration: 10000})
    .velocity("revers", { easing: "easeOutQuad"})
    .appendTo($container);
