import { Server } from "http";

import app from "./app";

const main = () => {
  const port = Number(process.env.PORT) || 5000;

  const server: Server = app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });

  server.on("error", (error) => {
    console.error("Server error:", error);
  });
};

main();
