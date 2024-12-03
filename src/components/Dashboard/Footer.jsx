import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-cover">
        <em>
          VirtualFundi <b>&copy;</b> {new Date().getFullYear()}
          <br />
          Version <b>1.0.2</b>
        </em>
      </div>
    </footer>
  );
};

export default Footer;
