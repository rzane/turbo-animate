function getElements() {
  return Array.from(document.querySelectorAll("[data-turbo-animate]"));
}

function resetElement(element) {
  const classNames = Array.from(element.classList).filter(className => {
    return /^turbo-.+-enter|leave$/.test(className);
  });

  element.classList.remove(...classNames);
}

async function animate(className) {
  const promises = getElements().map(async element => {
    resetElement(element);
    element.classList.add(className);
    await Promise.all(element.getAnimations().map(animation => animation.finished));
  });

  await Promise.all(promises);
}

export function start() {
  let action = undefined;
  let animation = Promise.resolve();

  const onInitiate = (event) => {
    action = event.target.dataset.turboAnimateWith;
  };

  const onNextVisit = (event) => {
    action = action || event.detail.action;
    animation = animate(`turbo-${action}-leave`);

    addEventListener("turbo:render", onNextRender, { once: true });
    addEventListener("turbo:load", onNextLoad, { once: true });
  };

  const onBeforeRender = async (event) => {
    event.preventDefault();
    await animation;
    event.detail.resume();
  };

  const onNextRender = () => {
    animation = animate(`turbo-${action}-enter`);
  };

  const onNextLoad = async () => {
    await animation;
    action = undefined;
    animation = Promise.resolve();
    getElements().forEach(resetElement);
    addEventListener("turbo:visit", onNextVisit, { once: true });
  };

  addEventListener("turbo:click", onInitiate);
  addEventListener("turbo:submit-start", onInitiate);
  addEventListener("turbo:visit", onNextVisit, { once: true });
  addEventListener("turbo:before-render", onBeforeRender);
}
