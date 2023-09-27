import { VanObj, State } from "mini-van-plate/shared";

interface Props {
  van: VanObj;
  id?: string;
  init?: number;
  buttonStyle?: string | State<string>;
}

export const Counter = (props: Props) => {
  const { van, id, init = 0, buttonStyle = "👍👎" } = props;
  const { button, div } = van.tags;

  const [up, down] = [...van.val(buttonStyle)];
  const counter = van.state<number>(init);

  return div(
    { ...(id ? { id } : {}), "data-counter": counter },
    "❤️ ",
    counter,
    " ",
    button({ onclick: () => ++counter.val }, up),
    button({ onclick: () => --counter.val }, down),
  );
};
