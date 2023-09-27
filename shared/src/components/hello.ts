import { VanObj } from "mini-van-plate/shared"

interface Props {
  van: VanObj
}

export const Hello = ({van} : Props) => {
  const {div, li, p, ul} = van.tags

  const fromServer = typeof window === "undefined"
  return div(
    p(() => `👋Hello (from ${fromServer ? "server" : "client"})`),
    ul(
      li("🗺️World"),
    ),
  )
};
