import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        <em>VirtualFundi</em>
        <br />
        <b>&copy;</b> {new Date().getFullYear()}
        <br />
        Version <b>1.0.2</b>
      </p>
    </footer>
  );
};

export default Footer;
