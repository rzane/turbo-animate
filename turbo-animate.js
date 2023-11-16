const classNames = [
  'turbo-advance-enter',
  'turbo-advance-leave',
  'turbo-replace-leave',
  'turbo-replace-enter',
  'turbo-restore-leave',
  'turbo-restore-enter',
];

async function animate(className) {
  const elements = Array.from(document.querySelectorAll("[data-turbo-animate]"));

  const promises = elements.map(async element => {
    element.classList.remove(...classNames);
    element.classList.add(className);
    await Promise.all(element.getAnimations().map(animation => animation.finished));
    element.classList.remove(className);
  });

  await Promise.all(promises);
}

export function startTurboAnimate() {
  let action;
  let leave;

  const onVisit = (event) => {
    action = event.detail.action;
    leave = animate(`turbo-${action}-leave`);
  };

  const onBeforeRender = async (event) => {
    event.preventDefault();
    await leave;
    event.detail.resume();
  };

  const onLoad = async () => {
    await animate(`turbo-${action}-enter`);
    startTurboAnimate();
  };

  addEventListener("turbo:visit", onVisit, { once: true });
  addEventListener("turbo:before-render", onBeforeRender, { once: true });
  addEventListener("turbo:load", onLoad, { once: true });
}
