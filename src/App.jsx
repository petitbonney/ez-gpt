import OpenAI from "openai";
import { useEffect, useRef, useState } from "react";
import { ASSISTANT, Chat, USER, ERROR } from "./components/Chat";
import useLocalStorage from "./hooks/useLocalStorage";
import { KEY_ICON, PAPER_PLANE_ICON } from "./utils/icons";

const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_MESSAGES = [
  { role: ASSISTANT, content: "How can I help you today?" },
];

const App = () => {
  const [apiKey, setApiKey] = useLocalStorage("apiKey", null);
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [prompt, setPrompt] = useState("");

  const dummy = useRef();

  const scrollToBottom = () =>
    dummy.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (apiKey) {
      const newClient = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      setClient(newClient);
    }
  }, [apiKey]);

  const ask = (prompt) => {
    if (prompt && client) {
      const conversation = [...messages, { role: USER, content: prompt }];
      setMessages(conversation);
      client.chat.completions
        .create({
          messages: conversation,
          model: DEFAULT_MODEL,
        })
        .then((res) => setMessages([...conversation, res.choices[0].message]))
        .catch((e) =>
          setMessages([...conversation, { role: ERROR, content: e.message }])
        )
        .finally(setTimeout(scrollToBottom, 100));
      return true;
    }
    return false;
  };

  return (
    <div
      className="flex-1 flex flex-col p-5 gap-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <label
        className="input input-bordered flex items-center gap-2"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-secondary)",
        }}
      >
        {KEY_ICON}
        <input
          type="password"
          className="grow"
          placeholder="OPENAI_API_KEY"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </label>
      <div
        className="flex-1 basis-0 flex flex-col overflow-auto rounded-btn border px-1 py-2 scroll-smooth"
        style={{
          scrollbarColor: "var(--text-secondary) transparent",
          borderColor: "var(--text-secondary)",
        }}
      >
        {<Chat messages={messages} dummy={dummy} />}
      </div>
      <label
        className="input input-bordered flex items-center gap-2"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-secondary)",
        }}
      >
        <input
          type="text"
          className="grow"
          placeholder="Prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.currentTarget.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            e.currentTarget.value &&
            ask(prompt) &&
            setPrompt("")
          }
        />
        <button onClick={() => ask(prompt) && setPrompt("")}>
          {PAPER_PLANE_ICON}
        </button>
      </label>
    </div>
  );
};

export default App;
