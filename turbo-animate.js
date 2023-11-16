const isAnimateClassName = className => /^turbo-.+-enter|leave$/.test(className);

async function animate(className) {
  const elements = Array.from(document.querySelectorAll("[data-turbo-animate]"));

  const promises = elements.map(async element => {
    const classNames = Array.from(element.classList).filter(isAnimateClassName);
    element.classList.remove(...classNames);

    element.classList.add(className);
    await Promise.all(element.getAnimations().map(animation => animation.finished));

    element.classList.remove(className);
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
    addEventListener("turbo:visit", onVisit, { once: true });
    addEventListener("turbo:before-render", onBeforeRender, { once: true });
  };

  addEventListener("turbo:click", onInitiate);
  addEventListener("turbo:submit-start", onInitiate);
  addEventListener("turbo:visit", onVisit, { once: true });
  addEventListener("turbo:before-render", onBeforeRender, { once: true });
  addEventListener("turbo:load", onLoad);
}
