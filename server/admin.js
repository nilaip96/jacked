const { Rooms } = require("./models/rooms.js");

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
  <ul>
  `,
    ""
  );
  const url =
    process.env.NODE_ENV === "development"
      ? "localhost:3000"
      : "https://jacked-1.onrender.com";

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
    ${RoomsHTML}
    <button onclick="deleteAll()">Delete Rooms</button>
  </body>
</html>
`;

  return htmlContent;
};
