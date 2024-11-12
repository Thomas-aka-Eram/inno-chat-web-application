import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/AuthContext";
import PlayOnce from "../Components/ButtPlay";
import ICON from "../assets/system-solid-62-butt.json";
import { baseUrl, postRequest } from "../utils/services";

const Login = () => {
  const words = ["Friends", "Family", "Lover"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(200);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [wordOpacity1, setWordOpacity1] = useState(false);
  const [wordOpacity2, setWordOpacity2] = useState(false);

  const { login } = useContext(UserContext); // Accessing login from UserContext

  useEffect(() => {
    const type = () => {
      const currentWord = words[currentWordIndex];
      if (deleting) {
        setCurrentText((prev) => prev.slice(0, -1));
        setTypingSpeed(100);
        if (currentText === "") {
          setDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setCurrentText((prev) => currentWord.slice(0, prev.length + 1));
        setTypingSpeed(200);
        if (currentText === currentWord) {
          setDeleting(true);
          setTypingSpeed(1000);
        }
      }
    };

    const timer = setTimeout(type, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, deleting, typingSpeed]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setWordOpacity1(!!e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setWordOpacity2(!!e.target.value);
  };

  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidAttempt, setIsInvalidAttempt] = useState(false);
  const [invalidmsg, setInvalidmsg] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (e.currentTarget.checkValidity() === false) {
      e.stopPropagation();
    } else {
      handleLogin(); // Call handleLogin when form is valid
    }
  };

  const handleLogin = async () => {
    const url = `${baseUrl}/loginUser`;
    const body = { email, password };

    try {
      const response = await postRequest(url, body);
      if (response.error) {
        if (response.message?.includes("Password")) {
          setInvalidmsg(response.message);
          setIsInvalidAttempt(true);
        }
      } else {
        const { _id, name, email, token } = response;
        setIsSuccess(true);
        setTimeout(() => {
          login({ _id, name, email, token });
          window.location.href = "/";
        }, 3000);
      }
    } catch (error) {}
  };

  return (
    <div className="d-flex justify-content-evenly align-items-center position-relative">
      <div className="form-container">
        <h1 className="h3 mb-3 mg-10 fw-normal text txtcolor">
          Welcome to{" "}
          <span className="InnoChat">
            Inno<span style={{ color: "white" }}>Chat</span>
          </span>
        </h1>
        <h3 className="h3 mb-5 fw-normal">
          Connect With Your-
          <span className="typing-container"> {currentText}</span>
        </h3>
        {isInvalidAttempt ? (
          <div className="invalidAttempt ">
            <div className="invaliddiv d-flex flex-column justify-content-center align-items-center">
              <h4>{invalidmsg}</h4>
              <h5>Try Again</h5>
            </div>
          </div>
        ) : (
          ""
        )}
        <form
          className={`needs-validation ${
            isSubmitted ? "was-validated" : ""
          } mt-3`}
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control ${wordOpacity1 ? "texted1" : ""}`}
              id="floatingInput"
              autoComplete="off"
              placeholder=""
              aria-describedby="inputGroupPrepend"
              required
              value={email}
              onChange={handleEmailChange}
            />
            <div className="invalid-feedback">Email should be a valid one</div>
            <div className="valid-feedback">Looks good!</div>
            <label
              className={`floatingLabel ${wordOpacity1 ? "faint1 texted" : ""}`}
              htmlFor="floatingInput"
            >
              Email
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className={`form-control ${wordOpacity2 ? "texted2" : ""}`}
              id="floatingPassword"
              placeholder="Password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <div className="invalid-feedback">Password is required</div>
            <label
              className={`floatingLabel ${wordOpacity2 ? "faint2" : ""}`}
              htmlFor="floatingPassword"
            >
              Password
            </label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Sign in
          </button>
          <p className="mt-4 mb-3 text-center" style={{ height: "50px" }}>
            New to InnoChat? <a href="/register">Create an account</a>.
          </p>
        </form>
      </div>

      {isSuccess ? (
        <div className="success position-absolute d-flex flex-column justify-content-center align-items-center">
          <div className="success-div">
            <div className="buttplay">
              <PlayOnce imglink={ICON} tsize={100} color={"#fff"} />
            </div>
            <h4>Logging You in...</h4>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Login;
