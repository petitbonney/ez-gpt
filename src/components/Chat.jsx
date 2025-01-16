const ASSISTANT = "assistant";
const USER = "user";
const ERROR = "error";

const JUSTIFY_MAP = {};
JUSTIFY_MAP[ASSISTANT] = "chat-start";
JUSTIFY_MAP[USER] = "chat-end";
JUSTIFY_MAP[ERROR] = "chat-start";

const COLOR_MAP = {};
COLOR_MAP[ASSISTANT] = "var(--bg-secondary)";
COLOR_MAP[USER] = "oklch(var(--p))";
COLOR_MAP[ERROR] = "var(--bg-secondary)";

const Chat = ({ messages = [], dummy }) => {
  return (
    <div className="mt-auto flex flex-col justify-end">
      {messages.map((m, i) => (
        <div key={i} className={`chat ${JUSTIFY_MAP[m.role]}`}>
          <div
            className="chat-bubble whitespace-pre-line"
            style={{ backgroundColor: COLOR_MAP[m.role] }}
          >
            {m.content}
          </div>
        </div>
      ))}
      <div ref={dummy}></div>
    </div>
  );
};

export { ASSISTANT, Chat, ERROR, USER };
