//МНЕ БЫЛО ЖАЛКО ЭТО УДАЛЯТЬ, ПОТОМУ ЧТО Я НАД ЭТИМ ДУМАЛ
//НО ЭТО И НЕ НАСТОЛЬКО СИЛЬНО НУЖНО


// функция клика после анимации, в которой нельзя спамить
// заменил на с возможностью спамить, чтобы показывалось количество тапов
//клик делается один раз, функция сравнивает значения индексов
//для боксов которые светились и на которые ты нажал
//если они совпадают и длинна совпадает — переходишь на следующий уровень
//если длинна не совпадает — жмешь еще раз
//неправильно нажал — пройгрыш
function clickInd(num) {
  $('.simon-boxes').one('click', '.box', function(evt) {
    $(this).addClass('state-glow');
    let a = $(this).index();
    clickedBoxesIndicies.push(a);
    setTimeout(function() {
      $($('.box')[a]).removeClass('state-glow');
      if (clickedBoxesIndicies[num] === glowingBoxesIndicies[num]) {
        if (clickedBoxesIndicies.length === glowingBoxesIndicies.length) {
          setTimeout(glow, timeSet);
        } else {
          clickInd(++num);
        }
      } else {
        $('.score > h1').text('Again');
        console.log('You lose');
        startingPoint = 1;

        //тут надо заново добавить event listener для старта
      }
    }, timeSet)
  })
}

// making box's height not overflow
//крутая функция, частично ее использую (при добавлении новых кубиков)
//заменил calc() функцией в css так как она быстрее
function resize() {
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
}

$(window).on('DOMContentLoaded', resize);
$(window).on('resize', resize);

function clickInd() {

  //condition for resetting the game
  if (glowingBoxesIndicies === []) {
    return
  }

  $('.simon-boxes').on('click.boxes', '.box', function(evt) {
    let a = $(this).index();
    clickedBoxesIndicies.push(a);

    let trueInd = glowingBoxesIndicies[clickedBoxesIndicies.length - 1];

    if (a === trueInd) {
      $(this).addClass('state-glow');
      playsound(a)
      if (evt.detail > 1) {
        let appended = $('<h2 class="appended-number">x' + evt.detail + '</h2>')
        $(this).html('')
        $(this).append(appended);
        setTimeout(function() {
          appended.remove();
          //state of glowing is removed if the player stopped spaming the box
          if ($('.box > *').length === 0) {
            $(this).removeClass('state-glow')
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

//дописать переделанную функцию (подойдет для мобилок, заменит старую)
//основная идея — использовать evt.target элемент для стака и упрощения работы
//если это не зайдет по эффективности, основная идея — сравнивать текущий индекс
//с предидущим и таким образом добавлять/убирать подсветку
// let bp = []
// let num = 1;
//
// $('.full-screen').on('click', function(evt) {
//   let target = evt.target
//   if (bp.length > 0) {
//     if (target === bp[bp.length-1]) {
//       console.log('same')
//       let appended = $('<h2 class="appended-number">x' + num++ + '</h2>')
//       $(target).html('')
//       $(target).append(appended);
//     } else {
//       bp.push(target)
//       console.log('push')
//     }
//   } else if (bp.length === 0) {
//     bp.push(target)
//     console.log('first push')
//   }
// })
