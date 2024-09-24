import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        <b>&copy;</b> {new Date().getFullYear()} <em>Fundi Bots</em>
        <br />
        Version <b>1.0.2</b>
      </p>
    </footer>
  );
};

export default Footer;
