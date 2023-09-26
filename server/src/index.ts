import van from "mini-van-plate/van-plate";

const { body, h1 } = van.tags;

const server = Bun.serve({
  port: 3000,
  fetch(req: Request) {
    return new Response(
      van.html(
        body(
          h1("SSR with Mini Van Plate"),
          // Counter({van, value: CountQueuingStrategy, source: "server"}),
        ),
      ),
      { headers: { "Content-Type": "text/html" } },
    );
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
