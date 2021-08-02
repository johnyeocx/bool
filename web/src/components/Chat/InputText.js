import React from "react";

function InputText({ type, placeholder, onChange, defaultValue }) {
  return (
    <input
      type={type ? type : "text"}
      placeholder={placeholder ? placeholder : ""}
      onChange={(e) => onChange(e.target.value)}
      value={defaultValue}
      style={{
        display: "block",
        margin: "10px 0px",
      }}
    />
  );
}

export default InputText;
