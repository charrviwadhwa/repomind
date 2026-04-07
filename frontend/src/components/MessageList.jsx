import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessageList = ({ messages }) => {
  return (
    <div className="flex flex-col gap-6 p-6 pb-32">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {/* 🚀 Wrapper Div handles the styling now */}
          <div
            className={`max-w-[85%] rounded-2xl p-5 shadow-2xl transition-all ${
              msg.role === "user"
                ? "bg-green-500 text-black font-semibold"
                : "bg-[#161616] border border-white/5 text-zinc-300"
            }`}
          >
            {/* 🚀 Removed className from ReactMarkdown */}
            <div className="prose prose-invert prose-sm max-w-none 
                            prose-headings:text-white prose-strong:text-green-400 
                            prose-code:bg-black/40 prose-code:px-1.5 prose-code:py-0.5 
                            prose-code:rounded-md prose-pre:bg-black/60">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content ?? msg.text ?? ""}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default MessageList;
