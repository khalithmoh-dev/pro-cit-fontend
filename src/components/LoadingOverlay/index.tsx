import Spinner from '../spinner';

const LoadingOverlay = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      backdropFilter: "blur(4px)",
      backgroundColor: "rgba(255,255,255,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
  >
    <Spinner />
  </div>
);

export default LoadingOverlay;
