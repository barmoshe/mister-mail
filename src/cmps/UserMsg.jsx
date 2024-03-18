import { useEffect, useState } from "react";
import { eventBusService } from "./../services/event-bus.service";

export function UserMsg() {
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const unsubscribe = eventBusService.on("show-user-msg", (msg) => {
      setMsg(msg);
      setTimeout(onCloseMsg, 3000);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function onCloseMsg() {
    setMsg(null);
  }

  if (!msg) return null;

  return (
    <div className={"user-msg " + msg.type}>
      <div className="user-msg-content">
        <p>{msg.txt}</p>
        <button onClick={onCloseMsg}>
          <i>close</i>
        </button>
      </div>
    </div>
  );
}
