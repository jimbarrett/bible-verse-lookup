import Nav from "@components/Nav";
import "@styles/globals.css";
import { BibleProvider } from "@app/context/BibleContext";

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
        <BibleProvider>
          <main className="app">
            <Nav />
            {children}
          </main>
        </BibleProvider>
      </body>
    </html>
  );
};

export default RootLayout;
