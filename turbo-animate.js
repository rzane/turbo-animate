const PENDING = "pending";
const LEAVE = "leave";
const ENTER = "enter";
const SELECTOR = "[data-turbo-animate]";

function isAnimation(className) {
  return /^turbo-.+-enter|leave$/.test(className);
}

function animate(className) {
  const animations = Array.from(document.querySelectorAll(SELECTOR)).flatMap(element => {
    element.classList.remove(...Array.from(element.classList).filter(isAnimation));
    void element.offsetWidth; // https://css-tricks.com/restart-css-animation/

    element.classList.add(className);
    return element.getAnimations();
  });

  return Promise.all(animations.map(animation => animation.finished));
}

class Session {
  constructor() {
    this.reset();
  }

  start() {
    addEventListener("turbo:click", this.onInitiate);
    addEventListener("turbo:submit-start", this.onInitiate);
    addEventListener("turbo:visit", this.onVisit);
    addEventListener("turbo:before-render", this.onBeforeRender);
    addEventListener("turbo:render", this.onRender);
    addEventListener("turbo:load", this.onLoad);
  }

  reset() {
    this.action = null;
    this.state = PENDING;
    this.animation = Promise.resolve();
  }

  setNextAction(action) {
    this.action = action;
  }

  onInitiate = (event) => {
    this.action = this.action || event.target.dataset.turboAnimateWith || null;
  }

  onVisit = (event) => {
    if (this.state === PENDING) {
      this.action = this.action || event.detail.action;
      this.state = LEAVE;
      this.animation = animate(`turbo-${this.action}-leave`);
    }
  }

  /**
   * This function runs before every render and pauses Turbo's rendering until the
   * current animation is complete. When Turbo has a warm cache, this function will
   * be called twice within a single visit. In which case, the animation will represent
   * the leave animation on the first render and the enter animation on the second render.
   */
  onBeforeRender = async (event) => {
    event.preventDefault();
    await this.animation;
    event.detail.resume();
  }

  onRender = () => {
    if (this.state === LEAVE) {
      this.state = ENTER;
      this.animation = animate(`turbo-${this.action}-enter`);
    }
  }

  onLoad = async () => {
    if (this.state === ENTER) {
      await this.animation;
      this.reset();
    }
  }
}

const session = new Session();

export const start = () => session.start();
export const setNextAction = (action) => session.setNextAction(action);
