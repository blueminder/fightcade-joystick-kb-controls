# Fightcade Game Controller / Numpad Control 
* Author: blueminder (Enrique Santos)
* Created: 2023-05-11

## Motivation
In the process of turning my mini arcade cabinet into a dedicated Fightcade machine, I became annoyed at switching between joystick & mouse while looking for new matches. To scratch this itch, I started adding joystick/keyboard navigation to the Fightcade UI.

Controls are optimized for switching between current open lobbies, challenging players, spectating matches, and loading the emulator offline for testing/training. As much as I could, I wanted to make sure that any actions performed via game controller did not require an external keyboard or mouse use to close external windows.

## Installation
1. Download [inject.js](https://gist.githubusercontent.com/blueminder/818745061ac4b9dfd3b7f7f19d5343bb/raw/b2d476370eefc449cd1bf64216ef1f3bfa5292c8/inject.js) and place it in your `Fightcade\fc2-electron\resources\app\inject` directory.
2. Open Fightcade and press a button on your game controller. You will see a notification that says *Game Controller Initialized*.

## Usage
### Game Controller
Using your D-Pad or Left Analog Joystick

__Left__ and __Right__ switches between the following lanes when they are available:
* Game Lobbies
* Looking To Play
* Playing
* Test Game
* Training

A Notification will show up when you switch between lanes.

__Up__ and __Down__
* Changes Active Game Lobby
* Selects Available Players
* Select Active Match

__Button A (or 0)__
* Accepts Last Pending Challenge (in any lane)

* Challenges Selected Player
* Spectates Match
* Opens Test Game
* Opens Training Mode

__Button B (or 1)__
* Declines Last Pending Challenge (in any lane)

### Keyboard Number Pad
You may also use your keyboard's number pad when __Num Lock__ is turned off.
* __4__ & __6__ correspond with __Left__ & __Right__
* __8__ & __2__ correspond with __Up__ & __Down__
* __0__ corresponds with __Button A__
* __.__ corresponds with __Button B__

## Tested On
* Wired PS4 Controller
* Logitech Gamepad F310
  * XInput
  * DInput
* QANBA Q4RAF
  * XBOX 360
* Snackbox Micro
  * Uses Brook Universal Fighting Board
* Astro City Mini Joystick
  * Layout adjusted to match XBOX 360
* Retro-bit Sega Saturn Controller
  * Detected as Switch Pro Controller
  * __A__ & __B__ Reversed
* BEYEE Zero Delay USB Encoder

## Limitations
The HTML5 Gamepad API is weird about the use of POV Hats, so any controllers that represent their D-Pads in that manner are currently not supported. This includes PS3 controllers, though you may use the analog joystick, if available.

## Extras
In any open lobby, you may press the __F6__ key to spectate a random match.

This was included as the start of an "Attract Mode" for my mini arcade cabinet. I aim to attach this function to an idle counter as time goes on.
