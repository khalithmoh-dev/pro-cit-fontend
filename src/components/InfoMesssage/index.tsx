import { useState, useEffect } from "react";
import Icon from "../Icons";

export default function UploadProgressNotice({
  showKey = true,
  message = "",
}) {
  const [visible, setVisible] = useState(!!showKey);
  const [fade, setFade] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (showKey && !dismissed) {
      setVisible(true);
      setTimeout(() => setFade(true), 10); // fade-in
    } else {
      setFade(false);
      setTimeout(() => setVisible(false), 300); // fade-out
    }
  }, [showKey, dismissed]);

  if (!visible) return null;

  const handleClose = () => {
    setDismissed(true);
    setFade(false);
    setTimeout(() => setVisible(false), 300);
  };

  return (
    <div
      className={`transition ${
        fade ? "opacity-100 translate-middle-y-0" : "opacity-0 translate-middle-y"
      }`}
      style={{
        transition: "all 0.3s ease",
        transform: fade ? "translateY(0)" : "translateY(-8px)",
        opacity: fade ? 1 : 0,
      }}
    >
      <div
        className="d-flex align-items-center gap-2 px-3 py-2 rounded-4 shadow text-white"
        style={{
          background: "linear-gradient(90deg, #79278d, #e83e8c)",
          minHeight: "50px",
        }}
      >
        <p className="mb-0 small flex-grow-1">{message}</p>
        <button
          onClick={handleClose}
          type="button"
          className="btn btn-sm btn-light bg-transparent border-0 p-1 text-white"
          aria-label="Close"
        >
          <Icon name="X" color="white" />
        </button>
      </div>
    </div>
  );
}
