function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "700px",
          padding: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "20px",
            lineHeight: "1.2",
          }}
        >
          Resume to Portfolio Generator
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "#cbd5e1",
            marginBottom: "30px",
            lineHeight: "1.6",
          }}
        >
          Generate a professional portfolio website from your resume in minutes..
        </p>

        <button
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Upload Resume
        </button>
      </div>
    </div>
  );
}

export default App;