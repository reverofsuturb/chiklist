import { Link } from "react-router-dom";
import { FaGithubSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import "./Footer.css";

export const Footer = () => {
  return (
    <div className="footer-bar">
      <Link className="footer-link" to="/">
        <FaGithubSquare className="icon-b" /> GitHub
      </Link>
      <Link className="footer-link" to="/">
        <FaLinkedin className="icon-o" /> Linked-In
      </Link>
    </div>
  );
};
