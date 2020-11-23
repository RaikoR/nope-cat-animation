import $ from 'jquery';

var container = '.js-letter-center';
var textBase = 'A';
var svgBase =
  '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="14">' +
  ' <text x="0" y="10" font-family="OpenSans" font-size="14px" fill="#ffffff">A</text>' +
  '</svg>';
var shapeBase =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="54 37 20 14">' +
  '<g transform="scale(0.14)">' +
  '<path class="f-high" d="M428.39,271.33a91.56,91.56,0,0,0-33.67,21.73,4.11,4.11,0,0,0-1.3,2.82,4.26,4.26,0,0,0,1,3c.88,1,12.65,17.62,30.67,29.09a46.21,46.21,0,0,1-8-26.19A45.71,45.71,0,0,1,428.39,271.33Z"/>\n' +
  '    <path class="f-high" d="M516.88,304.15c-.78-1-11-17.55-28.73-28.41a46.25,46.25,0,0,1,7.84,26A45.41,45.41,0,0,1,482.8,334.2c20.24-8,32.82-23.64,33.73-24.55A4.29,4.29,0,0,0,516.88,304.15Z"/>\n' +
  '    <path class="f-dark" d="M441.35,301c0-14.44,2.82-27.11,7.07-34.25a82.08,82.08,0,0,0-20,4.58,45.71,45.71,0,0,0-11.3,30.43,46.21,46.21,0,0,0,8,26.19,68,68,0,0,0,25.39,10.16C445.09,331.91,441.35,317.63,441.35,301Z"/>\n' +
  '    <path class="f-dark" d="M496,301.76a46.25,46.25,0,0,0-7.84-26,62.72,62.72,0,0,0-23.6-8.77c4.18,7.18,6.95,19.73,6.95,34,0,17.23-4,31.93-9.69,37.75.31,0,.63,0,.94,0a65,65,0,0,0,20.05-4.52A45.41,45.41,0,0,0,496,301.76Z"/>\n' +
  '    <path class="f-black" d="M455.66,266.34q-3.72,0-7.24.41c-4.25,7.14-7.07,19.81-7.07,34.25,0,16.63,3.74,30.91,9.1,37.11a54.56,54.56,0,0,0,5.62.63c1.24.05,2.47.07,3.7.07l2-.06c5.66-5.82,9.69-20.52,9.69-37.75,0-14.3-2.77-26.85-6.95-34a56.25,56.25,0,0,0-8-.61Z"/>\n' +
  '    <circle class="f-high" cx="473.87" cy="289.7l" r="8.04"/>\n' +
  '    <circle class="f-high" cx="461.6" cy="302.67" r="4.25"/>' +
  '</g>' +
  '</svg>';

var letterTemplate =
  '<div class="letter__item js-letter-item">' +
  '<div class="letter--pos">' +
  '<div class="letter--scale">' +
  svgBase +
  '</div>' +
  '</div>' +
  '</div>';

var containerEl = $(container);
var ltDefCount = 30; // items in circle
var int = 0;
var intCount = 0;
var intCountMax = 20; // total circles generated
var intTime = 200; // gap between circles
var play = false;
var slow = 0;
var speedMod = [];

$('.js-start-anim').on('click', function(event) {
  event.preventDefault();
  play = !play;
  if (play) {
    containerEl.addClass('is-playing');
  } else {
    containerEl.removeClass('is-playing');
  }
  // $('.letter--scale, .letter--pos').css({ 'animation-play-state': play ? 'running' : 'paused' });
});
$('.js-speed-anim').on('click', function(event) {
  event.preventDefault();
  slow = slow > 1 ? 0 : slow + 1;
  console.log(3000 + slow * 1000);
  $('.letter--scale, .letter--pos').css({ 'animation-duration': (3000 + slow * 1000) + 'ms' });
});

// generate speed variations
for (var s = 0; s < ltDefCount; s++) {
  speedMod.push(Math.floor(Math.random() * 1000));
}

// generates a single circle of letters
function genLetters(loop) {
  var ltCount = ltDefCount;

  for (var l = 0; l < ltCount; l++) {
    var letterItem = $(letterTemplate);
    letterItem.css({ transform: 'rotate(' + (l * (360 / ltCount)) + 'deg)' });
    letterItem.find('.letter--pos, .letter--scale').css({ 'animation-delay': (intTime * loop) + 'ms' });
    letterItem.find('.letter--pos, .letter--scale').css({ 'animation-duration': (4000) + 'ms' });

    letterItem.data('rotation', l * (360 / ltCount));
    letterItem.data('rotateTo', l * (360 / ltCount) + 360);

    containerEl.append(letterItem);
  }
}

function setRotate() {
  var letterItems = containerEl.find('.js-letter-item');
  // reset
  letterItems.css({ transition: 'none' });
  letterItems.each((i, e) => {
    var elem = $(e);
    elem.css({ transform: 'rotate(' + elem.data('rotation') + 'deg)' });
  });

  setTimeout(() => {
    var letters = containerEl.find('.js-letter-item');
    letters.css({ transition: 'transform 4s linear' });
    letters.each((i, e) => {
      var elem = $(e);
      elem.css({ transform: 'rotate(' + elem.data('rotateTo') + 'deg)' });
    });
  }, 16);
}

for (var c = 0; c < intCountMax; c++) {
  genLetters(c);

  if (c + 1 === intCountMax) {
    setInterval(() => {
      // setRotate();
    }, 4000);
    // setRotate();
    containerEl.addClass('is-playing');
  }
}
// int = setInterval(genLetters, intTime);

// ToDo: list
/*
svg text letter performace test
svg outline performance test

discard JQ
input values for animation
 */
