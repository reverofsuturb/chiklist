import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const loginDemoUser = () => {
    setCredential("FakeUser1");
    setPassword("password1");
    handleSubmit();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const login = await dispatch(
      sessionActions.login({ credential, password })
    );
    if (login && login.errors) {
      console.log(login);
      return setErrors(login.errors);
    } else {
      closeModal();
    }
  };

  return (
    <div className="login-modal">
      <h1 className="login-h1">Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          <input
            className="login-input"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email"
          />
        </label>
        <label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </label>
        {errors.credential && (
          <p className="login-errors">{errors.credential}</p>
        )}
        <button
          className="login-button"
          type="submit"
          disabled={password.length < 6 || credential.length < 4 ? true : false}
        >
          Log In
        </button>
        <button
          className="login-button"
          type="submit"
          onClick={() => loginDemoUser()}
        >
          Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
