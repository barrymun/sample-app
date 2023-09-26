import van from "vanjs-core";

const { button, div, h1 } = van.tags;

export const Counter = () => {
  const counter = van.state<number>(0);

  return div(
    {
      class: "counter",
    },
    h1(counter),
    div(
      button(
        {
          onclick: () => ++counter.val,
        },
        "+1",
      ),
      button(
        {
          onclick: () => --counter.val,
        },
        "-1",
      ),
    ),
  );
};
