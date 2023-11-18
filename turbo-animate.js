const PENDING = "pending";
const LEAVE = "leave";
const ENTER = "enter";

class Session {
  action = null;
  state = PENDING;
  animation = Promise.resolve();

  start() {
    addEventListener("turbo:click", this.onInitiate);
    addEventListener("turbo:submit-start", this.onInitiate);
    addEventListener("turbo:visit", this.onVisit);
    addEventListener("turbo:before-render", this.onBeforeRender);
    addEventListener("turbo:render", this.onRender);
    addEventListener("turbo:load", this.onLoad);
  }

  setNextAction(action) {
    this.action = action;
  }

  onInitiate = (event) => {
    this.action = this.action || event.target.dataset.turboAnimateWith;
  }

  onVisit = (event) => {
    if (this.state === PENDING) {
      this.action = this.action || event.detail.action;
      this.state = LEAVE;
      this.animation = this.animate("leave");
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
      this.animation = this.animate("enter");
    }
  }

  onLoad = async () => {
    if (this.state === ENTER) {
      await this.animation;

      this.action = null;
      this.state = PENDING;
      this.animation = Promise.resolve();
    }
  }

  get elements() {
    return Array.from(document.querySelectorAll("[data-turbo-animate]"));
  }

  animate(phase) {
    const promises = this.elements.map(element => {
      this.removeAnimation(element);
      element.classList.add(`turbo-${this.action}-${phase}`);
      return Promise.all(element.getAnimations().map(animation => animation.finished));
    });

    return Promise.all(promises);
  }

  removeAnimation(element) {
    const classNames = Array.from(element.classList).filter(className => {
      return /^turbo-.+-enter|leave$/.test(className);
    });

    element.classList.remove(...classNames);
  }
}

const session = new Session();

export const start = () => session.start();
export const setNextAction = (action) => session.setNextAction(action);
