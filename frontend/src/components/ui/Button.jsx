import React from "react";

// Keep native button semantics: omitting type still submits its enclosing form.
export default function Button({
  variant = "primary",
  className = "",
  ...props
}) {
  return <button className={`btn btn-${variant} ${className}`} {...props} />;
}
