import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useEffect } from "react";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Update submit button disable state whenever username or password changes
  useEffect(() => {
    setIsSubmitDisabled(credential.length < 4 || password.length < 6);
  }, [credential, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoLogin = () => {
    dispatch(sessionActions.login({ credential: "Demo-lition", password: "password" }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="login-form-container">
      <div className="login-form">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          {errors.credential && <p>{errors.credential}</p>}
          <input
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isSubmitDisabled}>
            Log In
          </button>
        </form>
        <button className="demo-login-button" onClick={handleDemoLogin}>
          Demo User Login
        </button>
      </div>
    </div>
  );
}

export default LoginFormModal;
