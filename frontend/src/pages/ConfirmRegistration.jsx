import { useState, useEffect, useCallback, useRef } from "react";
import { Auth } from "aws-amplify";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/tutoraLogo.png";
import { Link } from "react-router-dom";

const ConfirmRegistration = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.error || "";
  const emailFromRegister = location.state?.email || "";
  const confirmCodeInputRef = useRef(null);

  useEffect(() => {
    confirmCodeInputRef.current.focus();
  }, []);

  useEffect(() => {
    setEmail(emailFromRegister);
  }, [emailFromRegister]);

  const confirmSignUp = useCallback(async () => {
    try {
      await Auth.confirmSignUp(email, code);
      navigate("/", { state: { email } });
    } catch (error) {
      navigate("/confirm", { state: { error: error.message } });
    }
  }, [email, code, navigate]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        confirmSignUp();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [confirmSignUp]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col bg-white p-8 rounded-lg shadow-lg ring-1">
        <Link to="/">
          <img src={logo} className="w-48 mx-32" alt="Tutora Logo" />
        </Link>
        <p
          className="p-2 my-4 text-red-600 text-xs text-center"
          style={{ visibility: errorMessage ? "visible" : "hidden" }}
        >
          {errorMessage || "Error message if any"}
        </p>
        <input
          type="text"
          name="email"
          placeholder={emailFromRegister || "Email"}
          disabled={emailFromRegister}
          className="p-2 mb-4 border border-brand-main rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          name="code"
          placeholder="Confirmation code"
          className="p-2 mb-4 border border-brand-main rounded"
          onChange={(e) => setCode(e.target.value)}
          ref={confirmCodeInputRef}
        />
        <button className="btn" onClick={confirmSignUp}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmRegistration;
