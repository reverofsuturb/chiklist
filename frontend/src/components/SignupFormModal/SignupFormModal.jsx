import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      const signup = await dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      );
      if (signup && signup.errors) {
        return setErrors(signup.errors);
      } else {
        closeModal();
      }
    }

    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div className="signup-modal">
      <h1 className="signup-h1">Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>
          <input
            className="signup-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
        </label>
        {errors.email && <p className="signup-errors">{errors.email}</p>}
        <label>
          <input
            className="signup-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
          />
        </label>
        {errors.username && <p className="signup-errors">{errors.username}</p>}
        <label>
          <input
            className="signup-input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="First Name"
          />
        </label>
        {errors.firstName && (
          <p className="signup-errors">{errors.firstName}</p>
        )}
        <label>
          <input
            className="signup-input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Last Name"
          />
        </label>
        {errors.lastName && <p className="signup-errors">{errors.lastName}</p>}
        <label>
          <input
            className="signup-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </label>
        {errors.password && <p className="signup-errors">{errors.password}</p>}
        <label>
          <input
            className="signup-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
          />
        </label>
        {errors.confirmPassword && (
          <p className="signup-errors">{errors.confirmPassword}</p>
        )}
        <button
          className="signup-button"
          type="submit"
          disabled={
            email &&
            username &&
            firstName &&
            lastName &&
            password &&
            confirmPassword &&
            username.length > 3 &&
            password.length > 5
              ? false
              : true
          }
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
