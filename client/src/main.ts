import van from "vanjs-core";

import { Counter } from "components/counter";

import "assets/style.css";

van.add(document.getElementById("app") as HTMLDivElement, Counter());
