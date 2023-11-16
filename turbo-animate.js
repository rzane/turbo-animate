async function animate(className) {
  const elements = Array.from(document.querySelectorAll("[data-turbo-animate]"));

  const promises = elements.map(async element => {
    element.classList.add(className);
    await Promise.all(element.getAnimations().map(animation => animation.finished));
    element.classList.remove(className);
  });

  await Promise.all(promises);
}

function onVisit(visitEvent) {
  const action = visitEvent.detail.action;
  const leave = animate(`turbo-${action}-leave`);

  const onBeforeRender = async (event) => {
    event.preventDefault();
    await leave;
    event.detail.resume();
  };

  const onLoad = async () => {
    await animate(`turbo-${action}-enter`);
    startTurboAnimate();
  };

  addEventListener("turbo:before-render", onBeforeRender, { once: true });
  addEventListener("turbo:load", onLoad, { once: true });
}

export function startTurboAnimate() {
  addEventListener("turbo:visit", onVisit, { once: true });
}
