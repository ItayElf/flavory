import { Link } from "react-router-dom";
import "./App.css";
import { ButtonPrimary } from "./components/buttonPrimary";
import { Header } from "./components/header";
import useCurrentUser from "./hooks/useCurrentUser";

const mockup = require("./imgs/mockup.png");

function App() {
  const currentUser = useCurrentUser(false);

  return (
    <>
      <Header user={currentUser} contentStyle="w-full max-w-[856px]" />
      <main className="mt-24 w-full">
        <div>
          <div className="mx-auto flex max-w-[856px] flex-col-reverse items-center sm:flex-row sm:items-start">
            <div className="w-3/5">
              <h1 className="h4 font-medium">
                Share your recipes with the world!
              </h1>
              <p className="s1 mt-3 mb-8 text-gray">
                Upload your recipes and see what other people are cooking on
                Flavory!
              </p>
              <Link to="/signIn">
                <ButtonPrimary className="h5">Create an Account</ButtonPrimary>
              </Link>
            </div>
            <div className="w-full">
              <img src={mockup} className="w-full" alt="mockup" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
