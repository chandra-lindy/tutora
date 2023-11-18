import PropTypes from "prop-types";
import userIcon from "../assets/user-icon.png";
import aiIcon from "../assets/ai-icon.png";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";

export default function ChatMessage({ source, message }) {
  if (source === "debug") {
    const customStyles = {
      backgroundColor: "bg-brand-blue-100",
      padding: "p-4",
      display: "block",
      whiteSpace: "pre-wrap",
    };
    return (
      <div className="flex flex-col p-4 whitespace-pre-line bg-brand-blue-100 text-white">
        <p className="mb-4">Debug report (not part of conversation):</p>
        <JSONPretty data={message} style={customStyles} />
      </div>
    );
  }

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
  source: PropTypes.oneOf(["user", "ai", "debug"]).isRequired,
  message: PropTypes.string.isRequired,
};
