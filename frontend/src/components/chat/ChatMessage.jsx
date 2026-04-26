import PlanCardMini from "./PlanCardMini";
import ReactMarkdown from "react-markdown";

export default function ChatMessage({ data, onImageClick }) {
  if (!data) return null;

  const { type, content } = data;

  const markdownStyles = "text-sm leading-relaxed space-y-2 [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5 [&>h3]:font-semibold [&>h3]:text-base [&>strong]:text-blue-600 dark:[&>strong]:text-blue-400 [&>p]:whitespace-pre-wrap";

  return (
    <div className="text-left space-y-3 w-full">
      
      {/* TEXT ONLY */}
      {type === "text" && (
        <div className={markdownStyles}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}

      {/* MULTI (image + text + cards) */}
      {type === "multi" && (
        <>
          {/* THE AI IMAGE THUMBNAIL (Moved to TOP, resized to act as a true thumbnail) */}
          {content.image && (
            <div className="w-48 h-32 mt-1 overflow-hidden rounded-xl border border-[rgb(var(--border)/0.5)] shadow-sm bg-white shrink-0">
              <img
                src={content.image}
                alt="AI Generated Visualization"
                onClick={() => onImageClick && onImageClick(content.image)}
                className="w-full h-full object-cover hover:scale-110 hover:opacity-90 transition-all duration-300 cursor-pointer"
                loading="lazy"
                title="Click to view full size"
              />
            </div>
          )}

          {/* TEXT EXPLANATION */}
          {content.text && (
            <div className={markdownStyles}>
              <ReactMarkdown>{content.text}</ReactMarkdown>
            </div>
          )}

          {/* THE PLAN CARDS */}
          {content.cards && (
            <div className="space-y-2 mt-3 w-full">
              {content.cards.map((card, i) => (
                <PlanCardMini key={i} plan={card} />
              ))}
            </div>
          )}
        </>
      )}

      {/* CARDS ONLY */}
      {type === "cards" && (
        <div className="space-y-2 w-full mt-1">
          {content.map((card, i) => (
            <PlanCardMini key={i} plan={card} />
          ))}
        </div>
      )}
    </div>
  );
}