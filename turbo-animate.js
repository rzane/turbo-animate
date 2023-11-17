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
  let leave = undefined;

  const onInitiate = (event) => {
    action = event.target.dataset.turboAnimateWith;
  };

  const onVisit = (event) => {
    if (!action) action = event.detail.action;
    leave = animate(`turbo-${action}-leave`);
  };

  const onBeforeRender = async (event) => {
    event.preventDefault();
    await leave;
    event.detail.resume();
  };

  const onLoad = async () => {
    await animate(`turbo-${action}-enter`);
    action = undefined;
    leave = undefined;
    getElements().forEach(resetElement);
    addEventListener("turbo:visit", onVisit, { once: true });
    addEventListener("turbo:before-render", onBeforeRender, { once: true });
  };

  addEventListener("turbo:click", onInitiate);
  addEventListener("turbo:submit-start", onInitiate);
  addEventListener("turbo:visit", onVisit, { once: true });
  addEventListener("turbo:before-render", onBeforeRender, { once: true });
  addEventListener("turbo:load", onLoad);
}
