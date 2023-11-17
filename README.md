# TurboAnimate

Silky-smooth CSS animations for Turbo Drive navigation events.

https://github.com/rzane/turbo-animate/assets/2731572/fc3c80e9-ad84-44c6-af70-cb2ae9c613e4

## Installation

```sh
$ npm add turbo-animate
```

## Usage

#### Step 1

Enable animations by calling the `start` function:

```javascript
import "@hotwired/turbo";
import * as TurboAnimate from "turbo-animate";

TurboAnimate.start();
```

#### Step 2

Next, add `data-turbo-animate` to elements that you want to transition.

```html
<main data-turbo-animate>
  This div should be animated.
</main>
```

#### Step 3

TurboAnimate will automatically add class names to your element to trigger animations. The example
below will slide between screens.

Read the [CSS](#css) documentation to learn more.

```css
.turbo-advance-leave {
  animation: 200ms slide ease-out forwards;
  --translate-x: -100%;
}

.turbo-advance-enter {
  animation: 200ms slide ease-in forwards reverse;
  --translate-x: 100%;
}

.turbo-replace-leave,
.turbo-restore-leave {
  animation: 200ms slide ease-out forwards;
  --translate-x: 100%;
}

.turbo-replace-enter,
.turbo-restore-enter {
  animation: 200ms slide ease-in forwards reverse;
  --translate-x: -100%;
}

@keyframes slide {
  to {
    opacity: 0;
    transform: translate3d(var(--translate-x), 0, 0);
  }
}
```

## CSS

Turbo has three visit types (also known as "actions"):

* `advance` - The default action
* `replace` - Triggered by a server redirect or `data-turbo-action="replace"`
* `restore` - Triggered by pressing the browser back button

Each animation has two phases:
* `leave` - Remove existing content from the screen.
* `enter` - Add new content to the screen.

TurboAnimate will apply one of the following class names to each `data-turbo-animate` when a
Turbo visit occurs:

* `turbo-advance-leave`
* `turbo-advance-enter`
* `turbo-replace-leave`
* `turbo-replace-enter`
* `turbo-restore-enter`
* `turbo-restore-leave`

You'll want to make sure to use `animation-fill-mode: forwards` (or, the `forwards` shorthand
property). This property ensures that after the animation finishes, the element will retain the
styles from the animation's last keyframe.

## Custom actions

You've seen how to animate the `advance`, `replace`, and `restore` actions, but what if you want
a different animation to run?

First, decide if you can solve this problem using only CSS:

```css
#specific-element.turbo-advance-leave {}
#specific-element.turbo-advance-enter {}
```

If that doesn't scratch your itch, you can make your own action. Here's how:

```html
<a href="/edit" data-turbo-animate-with="pop">Edit</a>
```

When that link is clicked, the following classes will be applied to your `data-turbo-animate` elements:

```css
.turbo-pop-leave {}
.turbo-pop-enter {}
```

You can also initiate this animation using JavaScript:

```javascript
import { visit } from "@hotwired/turbo";
import { setNextAction } from "turbo-animate";

setNextAction("pop");
visit("/edit");
```
