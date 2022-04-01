# mini-games
My mini-games project with use of jQuery, css responsive styling, js requestAnimationFrame, AudioContext, event listeners and main complex function of game itself.

I've done my best for creating my web version of simon game. I feel like I need to take a break from it to improve myself and then come back. So far, it works pretty good.

What I've used:
— Web Audio API for audio — issues only mobile Safari, has a big delay
— requestAnimationFrame for settings appearance animating
— Document Fragment to append multiple elements at once to DOM
— jQuery library 



CSS calc function for responsive sizing of squares and settings icon

# main function description
The whole game basically consists of one giant function, which I'm proud of. 
It is a reqursive function which calls itself if conditions are met. First, I create an array of random numbers for glowing boxes, that is the correct anwsers. Then I add an event listener to boxes and check what player hit. If conditions are met, the game continues with increase in level. 

If a box is pressed on multiple times, it will indicate how many times it is pressed. 

If a player toggles settings — the game resets.
