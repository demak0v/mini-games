//starting button which is than used as score counter
let startButton = $('.score');
//level at which the player starts the game
let startingPoint = 1;
//sets of time options that can be changed in settings
let timeOptions = [600, 500, 300];
//speed at which boxes blink
let timeSet = timeOptions[2];
//needed variable for the game that is updated with correct anwsers
let glowingBoxesIndicies = [];
//shuffling setting
let shuffle = false;
//sound setting
let sound = false;

//audio context
startButton.one('click', () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.05;
  const biquadFilter = audioContext.createBiquadFilter();
  biquadFilter.type = "bandpass";
  biquadFilter.frequency.value = 5000;

  let source = []
  for (var i = 0; i < keys.length; i++) {
    source.push(audioContext.createMediaElementSource(keys[i]))
    source[i].connect(biquadFilter).connect(gainNode).connect(audioContext.destination);
  }

})


let keys = []
keys.push(new Audio('soundsimon/A_key.wav'))
keys.push(new Audio('soundsimon/C_key.wav'))
keys.push(new Audio('soundsimon/C1_key.wav'))
keys.push(new Audio('soundsimon/D_key.wav'))
keys.push(new Audio('soundsimon/D1_key.wav'))
keys.push(new Audio('soundsimon/E_key.wav'))
keys.push(new Audio('soundsimon/F1_key.wav'))
keys.push(new Audio('soundsimon/G1_key.wav'))

for (var i = 0; i < keys.length; i++) {
  keys[i].crossOrigin = "anonymous";
}

function playsound(i) {
  if (sound) {
    keys[i].playbackRate = keys[i].duration/(timeSet/1000) + 0.1
    keys[i].src = keys[i].src;
    keys[i].currentTime = 0.1
    keys[i].play()
  }
}
////////////////////////////////////////////////////////////////////////////////
//settings appearance
let animate = true;

$('.settings').on('click', function() {
  $(this).toggleClass("spin-right");

  $(this).one('click.off', function() {
    $(this).toggleClass("spin-left");
    $('.full-screen').css('transform', '');
    $('.full-screen').css('filter', '');
  })

  // $('.full-screen').toggleClass("state-blurred-dim")
  if ($('.settings-content').hasClass("display-none")) {
    menuAnimate()
  }
  if (!animate) {
    animate = true
  }
  $('.settings-content').toggleClass("display-none")
  $('.settings-content').click(function(evt) {
    let target = $(evt.target)
    if (evt.target.tagName !== 'SPAN') {
      animate = false
      $('.settings').click()
    }
  })
})

function menuAnimate() {
  let start;
  let duration = 200;
  if (animate) {
    requestAnimationFrame(function animate(time) {
      if (start === undefined) {
        start = time
      }

      let progress = (time - start) / duration
      if (progress > 1) progress = 1;

      console.log(progress)
      $('.full-screen').css('transform', 'scale(1.' + (progress + '').split('.').join('') + ')')
      $('.full-screen').css('filter', 'blur(' + 10 * progress + 'px) brightness(' + (1 - 0.6 * progress) + ')')

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    })
  }
}

////////////////////////////////////////////////////////////////////////////////
//main function for simon-game
//has fucnctions for glowing boxes and for checking if the player clicked correctly
function glow() {
  let boxNum = $('.box').length; //used for random number generator
  let clickedBoxesIndicies = []; //used for checking clicked boxes
  let startingFor = startingPoint; //used for shuffling condition

  //turns play button into score counter
  $('.score > h1').text(startingPoint - 1);
  $('.score').removeClass('pointer')

  //makes array of rundom numbers for glowing boxes
  for (let i = 0; i < startingFor; i++) {
    startingFor = shuffle ? startingPoint : 1;
    let glowingBoxIndex = Math.floor(Math.random() * boxNum);
    glowingBoxesIndicies.push(glowingBoxIndex);
  }

  //function for glowing boxes
  //calls itself with increased argument that glows the next box
  //calls function that checks what player clicked when finished
  //if in reset state (settings toggling) returns
  function glowBox(num) {
    if (num < glowingBoxesIndicies.length) {
      $($('.box')[glowingBoxesIndicies[num]]).addClass('state-glow');
      playsound(glowingBoxesIndicies[num])

      setTimeout(function() {
        $($('.box')[glowingBoxesIndicies[num]]).removeClass('state-glow');
        setTimeout(function() {
          glowBox(++num);
        }, timeSet);
      }, timeSet);

    } else if (glowingBoxesIndicies.length > 0) {
      clickInd();

    } else {
      $('.box').removeClass('state-glow');
      return
    }
  }

  glowBox(0);

  //function for clicking boxes
  //checks whether the clicked boxes are in the same order as glowing ones
  //if correct goes to next level
  //if wrong ends the game
  function clickInd() {

    //condition for resetting the game
    if (glowingBoxesIndicies === []) {
      return
    }

    let num = 2;

    $('.simon-boxes').on('click.boxes', '.box', function(evt) {
      let a = $(this).index();
      clickedBoxesIndicies.push(a);

      let trueInd = glowingBoxesIndicies[clickedBoxesIndicies.length - 1];

      if (a === trueInd) {
        $(this).addClass('state-glow');
        playsound(a)
        if (a !== clickedBoxesIndicies[clickedBoxesIndicies.length - 2]) {
          num = 2
        }
        if (a === clickedBoxesIndicies[clickedBoxesIndicies.length - 2]) {
          let appended = $('<h2 class="appended-number">x' + num++ + '</h2>')
          $(this).html('')
          $(this).append(appended);
          setTimeout(function() {
            appended.remove();
            //state of glowing is removed if the player stopped spaming the box
            if ($('.box > *').length === 0) {
              $(this).removeClass('state-glow')
              if (a !== clickedBoxesIndicies[clickedBoxesIndicies.length - 2]) {
                num = 2
              }
            }
          }.bind(this), timeSet > 400 ? 400 : timeSet)
        } else {
          setTimeout(function() {
            //state of glowing is removed if the player stopped spaming the box
            if ($('.box > *').length === 0) {
              $(this).removeClass('state-glow')
            }
          }.bind(this), timeSet)
        }

        if (clickedBoxesIndicies.length === glowingBoxesIndicies.length) {
          $('.simon-boxes').off('click.boxes')
          glowingBoxesIndicies = shuffle ? [] : glowingBoxesIndicies;
          setTimeout(glow, timeSet * 2);
        }

        //game reset with showing the correct glowing box
      } else {
        $($('.box')[trueInd]).addClass('state-glow');

        setTimeout(function() {
          $($('.box')[trueInd]).removeClass('state-glow');
        }, timeSet);
        $('.simon-boxes').off('click.boxes')
        startingPoint = 1;
        glowingBoxesIndicies = [];
        $('.score > h1').text('Again');
        $('.score').addClass('pointer')
        startButton.one('click.glow', glow)
      }
    })
  }

  //game goes to next level if everything is ok
  startingPoint++
}
////////////////////////////////////////////////////////////////////////////////

//press play to start
startButton.one('click.glow', glow)

//compete game reset function
//stops execution of glow() at any level
//sets level to 1 and amount of inicies to 0
//removes all event listeners inside
function gameCompleteReset() {

  //reset in case of multiple settings toggling
  if (startingPoint > 1) {
    startingPoint = 1;
    glowingBoxesIndicies = [];

    $('.simon-boxes').off('click.boxes')
    $('.score > h1').text('Play');
    $('.score').addClass('pointer');

    startButton.one('click.boxes', glow)
  } else {
    $('.score > h1').text('Play');
  }
}

//changes the amount of boxes when changed
//checks the index * 2 (bc only 2 and 4 boxes can be added)
//deletes all but original 4 boxes and adds 2 (this is made for coloring)
//changes the size to fit the screen
$('.hardness').on('click', 'span', function() {

  gameCompleteReset();

  $(this).siblings().removeClass('text-highlight');
  $(this).addClass('text-highlight');

  let boxAmount = $(this).index();

  while ($('.box').length > 4) {
    $('.simon-boxes').children().last().remove()
  }

  let appendedBoxes = [];
  let colorIndex = 1;

  for (let i = 0; i < boxAmount * 2; i++) {
    appendedBoxes.push($('<div></div>').addClass('box color-' + colorIndex++));
  }

  //appending with Document Fragment using, which is more efficient
  $('.simon-boxes').append(appendedBoxes);

  //changing the width of the boxes' parent element
  //by checking whether the container is overflowing from top
  //or overflowing from left
  //making the simon-boxes container stay inside the simon-game container
  //att max possible width
  if (boxAmount > 0) {
    let width = parseFloat($('.simon-boxes').css('width'));
    while ($('.simon-boxes').offset().left < $('.simon-game').offset().left) {
      $('.simon-boxes').css('width', --width + 'px');
    }
    while ($('.simon-boxes').offset().left > $('.simon-game').offset().left) {
      $('.simon-boxes').css('width', ++width + 'px');
    }
    while ($('.simon-boxes').offset().top < $('.simon-game').offset().top) {
      $('.simon-boxes').css('width', --width + 'px');
    }
  } else {
    $('.simon-boxes').css('width', '');
  }
})

//changes the timeSet setting, which makes squares glow faster/slower
//by setting the index as one of the presets of timeOptions
$('.speed').on('click', 'span', function() {
  gameCompleteReset();

  $(this).siblings().removeClass('text-highlight');
  $(this).addClass('text-highlight');

  timeSet = timeOptions[$(this).index()]
})

//changes the shuffling setting of the game
//if true the boxes go in random order each round
$('.shuffle').on('click', 'span', function() {
  gameCompleteReset();

  $(this).toggleClass('text-highlight');
  shuffle = shuffle ? false : true
})

$('.volume').on('click', 'span', function() {
  $(this).toggleClass('text-highlight');
  sound = sound ? false : true
})
