import React, { useState, useEffect, useRef } from "react";
import { baseUrl, postRequest } from "../utils/services";
import PlayOnce from "../Components/ButtPlay";
import { UserContext } from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import butt from "../assets/system-solid-62-butt.json";
import { Player } from "@lordicon/react";

const Register: React.FC = () => {
  const playerRef = useRef<Player>(null);
  const handleComplete = () => {
    // Define what should happen when the animation completes
    setTimeout(() => {
      playerRef.current?.playFromBeginning();
    }, 1000);
  };

  const words = ["Friends", "Family", "Lover"];
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>("");
  const [deleting, setDeleting] = useState<boolean>(false);
  const [typingSpeed, setTypingSpeed] = useState<number>(200);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [wordOpacity3, setWordOpacity3] = useState<boolean>(false);
  const [wordOpacity4, setWordOpacity4] = useState<boolean>(false);
  const [wordOpacity5, setWordOpacity5] = useState<boolean>(false);

  const { login } = useContext(UserContext);

  // butticon

  const [connectionStatus, setConnectionStatus] = useState(false);
  const [isSuccess, setisSuccess] = useState(false);

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setWordOpacity3(!!e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setWordOpacity4(!!e.target.value);
  };

  const validatePassword = (password: string): string => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasNumber.test(password)) {
      return "Password must contain at least one number";
    }
    if (!hasUpperCase.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasSpecialChar.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const errorMessage = validatePassword(newPassword);
    setPasswordError(errorMessage);
    setWordOpacity5(!!newPassword);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (e.currentTarget.checkValidity() === false) {
      e.stopPropagation();
    } else {
      setIsLoading(true);
      const url = `${baseUrl}/register`;
      const body = { name, email, password };

      try {
        const response = await postRequest(url, body);
        if (response.error) {
          console.log(response.message);
          tryLogin(response.message);
          clearall();
        } else {
          const { _id, name, email, token } = response; // assuming your backend returns this structure

          setisSuccess(true);
          console.log("Succeed");
          setTimeout(() => {
            login({ _id, name, email, token });
            window.location.href = "/login";
          }, 3000);
        }
      } catch (error) {
        setConnectionStatus(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const [loginbox, setloginbox] = useState(false);

  const tryLogin = (msg: any) => {
    if (msg.includes(email)) {
      setloginbox(true);
    }
  };

  const closeexist = () => {
    setloginbox(false);
  };

  const navigate = useNavigate();
  const handleloginclick = () => {
    navigate("/login");
  };

  const clearall = () => {
    setName("");
    setEmail("");
    setPassword("");
    setWordOpacity3(false);
    setWordOpacity4(false);
    setWordOpacity5(false);
  };

  const handleLossconnection = () => {
    setConnectionStatus(false);
  };

  return (
    <div className="d-flex justify-content-evenly align-items-center position-relative">
      <div className="form-container">
        <h1 className="h3 mb-3 mg-10 fw-normal text txtcolor">
          Start{" "}
          <span className="InnoChat">
            Inno<span style={{ color: "white" }}>Chatting</span>
          </span>
        </h1>
        <h3 className="h3 mb-5 fw-normal">
          Connect With Your-
          <span className="typing-container"> {currentText}</span>
        </h3>
        <form
          className={`needs-validation ${
            isSubmitted ? "was-validated" : ""
          } mt-3`}
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${wordOpacity3 ? "texted3" : ""}`}
              id="floatingInput"
              autoComplete="off"
              placeholder=""
              aria-describedby="inputGroupPrepend"
              required
              value={name}
              onChange={handleNameChange}
            />
            <div className="invalid-feedback">Name is required</div>
            <div className="valid-feedback">Looks good!</div>
            <label
              className={`floatingLabel ${wordOpacity3 ? "faint3" : ""}`}
              htmlFor="floatingInput"
            >
              Name
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control ${wordOpacity4 ? "texted4" : ""}`}
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
              className={`floatingLabel ${wordOpacity4 ? "faint4" : ""}`}
              htmlFor="floatingInput"
            >
              Email
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className={`form-control ${wordOpacity5 ? "texted5" : ""} ${
                passwordError ? "is-invalid" : ""
              }`}
              id="floatingPassword"
              placeholder="Password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <div className="invalid-feedback password-error">
              {passwordError}
            </div>
            <label
              className={`floatingLabel ${wordOpacity5 ? "faint5" : ""}`}
              htmlFor="floatingPassword"
            >
              Password
            </label>
          </div>

          <button className="w-100 btn btn-lg btn-primary" type="submit">
            {isLoading ? (
              <div className="loading">
                <span className="spinner"></span>
                <span>loading...</span>
              </div>
            ) : (
              <span>Register</span>
            )}
          </button>
          <p className="mt-4 mb-3 text-center" style={{ height: "50px" }}>
            Already Have an Account? <a href="/login">Sign-In here</a>.
          </p>
        </form>
      </div>
      {connectionStatus ? (
        <div className="no-connection position-absolute d-flex flex-column justify-content-center align-items-center">
          <div className="no-con position-absolute d-flex flex-column justify-content-center align-items-center">
            <h4>Server Loss Connection!</h4>
            <h4>Try Again Later!</h4>
            <button className="close-con" onClick={handleLossconnection}>
              Close
            </button>
          </div>
        </div>
      ) : (
        ""
      )}

      {loginbox ? (
        <div className="no-connection position-absolute d-flex flex-column justify-content-center align-items-center">
          <div className="no-con position-absolute d-flex flex-column justify-content-center align-items-center">
            <h4>User with this email already exist!</h4>
            <div className="buttongp">
              <button className="close-me" onClick={closeexist}>
                Close
              </button>
              <button className="continuetoLogin" onClick={handleloginclick}>
                LogIn
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {isSuccess ? (
        <div className="success position-absolute d-flex flex-column justify-content-center align-items-center">
          <div className="success-div">
            <PlayOnce
              imglink={butt}
              tsize={100}
              color={"#fff"}
              onComplete={handleComplete}
            />
            <h4>Logging You in...</h4>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Register;
