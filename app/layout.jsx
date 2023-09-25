import Nav from "@components/Nav";
import "@styles/globals.css";

export const metadata = {
  title: "Bible Study",
  description: "A bible study and reference application.",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="main">
          <div className="background" />
        </div>

        <main className="app">
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
