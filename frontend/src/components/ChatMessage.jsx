import PropTypes from "prop-types";
import userIcon from "../assets/user-icon.png";
import aiIcon from "../assets/ai-icon.png";

export default function ChatMessage({ source, message }) {
  return (
    <div className="flex flex-row mb-4 whitespace-pre-line">
      <img
        src={source === "user" ? userIcon : aiIcon}
        alt={`${source} icon`}
        className="mx-2 max-h-8"
      />
      <div className="text">{message}</div>
    </div>
  );
}

ChatMessage.propTypes = {
  source: PropTypes.oneOf(["user", "ai"]).isRequired,
  message: PropTypes.string.isRequired,
};
