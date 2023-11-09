import { useState, useEffect, useCallback, useRef } from "react";
import { Auth } from "aws-amplify";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
// import logo from "../assets/logo-no-slogan.png";
import { Bars } from "react-loader-spinner";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [isPwMatch, setIsPwMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const emailInputRef = useRef(null);

  const signUp = useCallback(async () => {
    if (password !== pwConfirm) {
      setIsPwMatch(false);
      return;
    }
    setIsLoading(true);
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
        },
      });
      setIsLoading(false);
      navigate("/confirm", { state: { email } });
    } catch (error) {
      setIsLoading(false);
      console.log("error signing up: ", error);
      navigate("/register", { state: { error: error.message } });
    }
  }, [email, password, navigate, pwConfirm]);

  useEffect(() => {
    emailInputRef.current.focus();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        signUp();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [signUp]);

  useEffect(() => {
    setErrorMessage(location.state?.error);
    if (!isPwMatch) {
      setErrorMessage("Passwords do not match. Please try again");
    }
  }, [isPwMatch, location.state?.error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isLoading ? (
        <Bars
          height="80"
          width="80"
          color="#c8532c"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      ) : (
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
          <Link to="/">
            {/* <img src={logo} alt="Scholarly Logo" className="max-w-md mb-4" /> */}
            <h1 className="max-w-md text-4xl mx-32 text-brand-blue-300 font-extrabold">
              Tutora
            </h1>
          </Link>

          <p
            className="p-2 my-4 text-red-600 text-xs"
            style={{ visibility: errorMessage ? "visible" : "hidden" }}
          >
            {errorMessage || "Error message if any"}
          </p>

          <div className="flex flex-col w-full">
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="p-2 mb-4 border border-brand-main rounded"
              onChange={(e) => setEmail(e.target.value)}
              ref={emailInputRef}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="p-2 mb-4 border border-brand-main rounded"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              name="pwConfirm"
              placeholder="Confirm Password"
              className="p-2 mb-4 border border-brand-main rounded"
              onChange={(e) => setPwConfirm(e.target.value)}
            />
            <button className="btn" onClick={signUp}>
              Register
            </button>
            <Link to="/">
              <p className="text-center mt-4 text-link">Login</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
