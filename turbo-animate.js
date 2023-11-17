class Session {
  action = null;
  animation = Promise.resolve();

  start() {
    addEventListener("turbo:click", this.onInitiate);
    addEventListener("turbo:submit-start", this.onInitiate);
    addEventListener("turbo:visit", this.onNextVisit, { once: true });
    addEventListener("turbo:before-render", this.onBeforeRender);
  }

  setNextAction(action) {
    this.action = action;
  }

  onInitiate = (event) => {
    this.action = this.action || event.target.dataset.turboAnimateWith;
  }

  onNextVisit = (event) => {
    this.action = this.action || event.detail.action;
    this.animation = this.animate("leave");

    addEventListener("turbo:render", this.onNextRender, { once: true });
    addEventListener("turbo:load", this.onNextLoad, { once: true });
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

  onNextRender = () => {
    this.animation = this.animate("enter");
  }

  onNextLoad = async () => {
    await this.animation;

    this.action = null;
    this.animation = Promise.resolve();
    this.elements.forEach(element => this.removeAnimation(element));

    addEventListener("turbo:visit", this.onNextVisit, { once: true });
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
