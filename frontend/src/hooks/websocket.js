import { WS_ADDRESS } from "../config";
function userWebSocket(handleMessage) {
  const ws = new WebSocket(WS_ADDRESS);

  const init = () => {
    ws.addEventListener("open", handleOpen, false);
    ws.addEventListener("close", handleClose, false);
    ws.addEventListener("error", handleError, false);
    ws.addEventListener("message", handleMessage, false);
  };
  function handleOpen(e) {
    console.log("webSocket open ", e);
  }
  function handleClose(e) {
    console.log("webSocket close", e);
  }
  function handleError(e) {
    console.log("webSocket error", e);
  }

  init();
  return ws;
}

export default userWebSocket;
