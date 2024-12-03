import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Include the font in your CSS
import "./App.css";

const Editor = () => {
  const [emailContent, setEmailContent] = useState("");

  useEffect(() => {
    var Font = ReactQuill.Quill.import("formats/font");
    Font.whitelist = ["gotham-rounded", "serif", "monospace"];
    ReactQuill.Quill.register(Font, true);
  }, []);

  const handleChange = (content) => {
    setEmailContent(content);
  };

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
      ["clean"],
      ["link", "image", "video"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="wrapper">
      <ReactQuill
        className="ql-editor custom-editor"
        style={{ height: "100px", width: "100%", backgroundColor: "white" }}
        theme="snow"
        value={emailContent}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Enter Your Note Here..."
        required
      />
    </div>
  );
};

export default Editor;


