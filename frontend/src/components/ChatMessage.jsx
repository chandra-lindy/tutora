import PropTypes from "prop-types";
import userIcon from "../assets/user-icon.png";
import aiIcon from "../assets/ai-icon.png";

export default function ChatMessage({ source, message }) {
  return (
    <div
      className={`flex flex-row p-4 whitespace-pre-line ${
        source === "user"
          ? "bg-brand-blue-10 text-brand-blue-300"
          : "bg-brand-blue-100 text-white"
      }`}
    >
      <img
        src={source === "user" ? userIcon : aiIcon}
        alt={`${source} icon`}
        className="mr-4 max-h-8"
      />
      <div className="mr-4">{message}</div>
    </div>
  );
}

ChatMessage.propTypes = {
  source: PropTypes.oneOf(["user", "ai"]).isRequired,
  message: PropTypes.string.isRequired,
};
