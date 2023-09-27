import van from "vanjs-core";

import { Hello } from "shared/src/components/hello";
import { Counter } from "shared/src/components/counter";

import "assets/style.css";

van.add(document.getElementById("hello-container")!, Hello({ van }));

van.hydrate(document.getElementById("basic-counter")!, (dom) =>
  Counter({
    van,
    id: dom.id,
    init: Number(dom.getAttribute("data-counter")),
  }),
);

van.hydrate(document.getElementById("styled-counter")!, (dom) =>
  Counter({
    van,
    id: dom.id,
    init: Number(dom.getAttribute("data-counter")),
  }),
);
