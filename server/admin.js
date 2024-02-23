const { Rooms } = require("./models/rooms.js");
const os = require("os");

module.exports.admin = () => {
  const RoomsHTML = Object.values(Rooms).reduce(
    (acc, { name, Players }) => `${acc}
  <h5>Room</h5>
  <p>${name}</p>
  <ul>
    ${Object.values(Players).reduce(
      (acc, { name }) => `${acc}<li>${name}</li>`,
      ""
    )}
  </ul>
  `,
    ""
  );
  const url =
    process.env.NODE_ENV === "development"
      ? "localhost:3000"
      : "https://jacked-1.onrender.com";
  const os_free_mem = os.freemem();
  const os_total_mem = os.totalmem();
  const os_space_used = ((os_total_mem - os_free_mem) / os_total_mem) * 100;
  const formatMemoryUsage = (data) =>
    `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

  const memoryData = process.memoryUsage();

  const { rss, heapTotal, heapUsed, external } = {
    rss: `${formatMemoryUsage(
      memoryData.rss
    )} -> Resident Set Size - total memory allocated for the process execution`,
    heapTotal: `${formatMemoryUsage(
      memoryData.heapTotal
    )} -> total size of the allocated heap`,
    heapUsed: `${formatMemoryUsage(
      memoryData.heapUsed
    )} -> actual memory used during the execution`,
    external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
  };

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin-Black Jack</title>
  <script src="/client-socket.io"></script>
  <script>
    const endPoint = "${url}"
      var socket = io();
      function deleteAll() {
      socket.emit("delete-all");
      location.reload()
    }
  </script>
  </head>
  <body>
    <h1>Welcome Admin!</h1>
    <br/>
    <h2>Monitoring</h2>
    <p>OS</p>
    <p>${os_space_used}%</p>
    <p>Resident Set Size</p>
    <p>${rss}</p>
    <p>Heap Total</p>
    <p>${heapTotal}</p>
    <p>Heap Used/p>
    <p>${heapUsed}</p>
    <p>External</p>
    <p>${external}</p>
    <h2>Rooms and Players</h2>
    ${RoomsHTML}
    <button onclick="deleteAll()">Delete Rooms</button>
  </body>
</html>
`;

  return htmlContent;
};
