import { Link } from "react-router-dom";
import { ButtonPrimary } from "./components/buttonPrimary";
import { Header } from "./components/header";
import useCurrentUser from "./hooks/useCurrentUser";
import mockup from "./imgs/mockup.png";
import cookingRecipe from "./imgs/cookingRecipe.jpg";
import desktopScreenshot from "./imgs/desktopScreenshot.jpg";

function App() {
  const currentUser = useCurrentUser(false);

  return (
    <>
      <Header
        user={currentUser}
        contentStyle="w-full max-w-[856px] lg:max-w-[1000px]"
      />
      <main className="mt-24 w-full">
        <div className="mb-8">
          <div className="mx-auto flex max-w-[856px] flex-col-reverse items-center px-4 sm:flex-row sm:items-start lg:max-w-[1000px]">
            <div className="w-full sm:w-3/5">
              <h1 className="h4 font-medium">
                Share your recipes with the world!
              </h1>
              <p className="s1 mt-3 mb-8 text-gray">
                Upload your recipes and see what other people are cooking on
                Flavory! Countless recipes are waiting for you to cook them. Go
                ahead and explore the variaty Flavory has to offer.
              </p>
              <Link to="/signIn">
                <ButtonPrimary className="h5">Create an Account</ButtonPrimary>
              </Link>
            </div>
            <div className="w-full">
              <img src={mockup} className="w-full object-cover" alt="Mockup" />
            </div>
          </div>
        </div>
        <div className="mb-8 bg-primary-100">
          <div className="mx-auto flex max-w-[856px] flex-row space-x-4 lg:max-w-[1000px]">
            <div className="hidden w-3/5 sm:block">
              <img
                src={cookingRecipe}
                alt="Recipe Mockup"
                className="h-[480px] object-cover"
              />
            </div>
            <div className="my-auto w-full py-4 pr-8 sm:p-0">
              <h2 className="h5 font-medium">Any Recipe at any Time</h2>
              <p className="s1 mb-6 text-gray">
                Flavory offers many recipes uploaded by other users. You can
                always find the right recipe for you and your needs.
              </p>
              <h2 className="h5 font-medium">Convert and Scale</h2>
              <p className="s1 mb-6 text-gray">
                All recipes on Flavory can be converted to the unit you desire
                with ease. You can scale up or down any recipe as you wish,
                making the cooking experience much more enjoyable.
              </p>
              <h2 className="h5 font-medium">Explore Unique Dishes</h2>
              <p className="s1 mb-6 text-gray">
                Flavory allows you to explore many unique recipes. You can
                search for a specific dish or scroll endlessly until you have
                found a dish that satisfy your needs.
              </p>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="mx-auto flex max-w-[856px] flex-col items-center px-4 lg:max-w-[1000px]">
            <h2 className="h5 sm:h4 mb-4 w-full rounded bg-primary-100 p-4">
              Create and Edit Recipes{" "}
              <span className="s1 sm:h6 text-gray">
                Share your knowledge with the world
              </span>
            </h2>
            <img
              src={desktopScreenshot}
              className="rounded-xl shadow-2xl"
              alt="Create Recipe Screenshot"
            ></img>
          </div>
        </div>
        <div className="bg-primary-100">
          <div className="mx-auto flex max-w-[856px] flex-col items-center space-y-8 p-16 px-4 lg:max-w-[1000px]">
            <h2 className="h4 text-center">
              Ready to start cooking?
              <br />
              Sign up for free.
            </h2>
            <Link to="/signUp">
              <ButtonPrimary>Start Here</ButtonPrimary>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
