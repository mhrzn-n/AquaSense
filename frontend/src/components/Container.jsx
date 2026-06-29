// This componet is for just to structure the website

const Container = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center w-4/5 mx-auto">
      <div
        className="absolute inset-0 -z-1"
        style={{
          background: "#ffffff",
          backgroundImage: `
        radial-gradient(
          circle at top right,
          rgba(70, 130, 180, 0.5),
          transparent 70%
        )
      `,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      />
      {children}
    </div>
  );
};

export default Container;
