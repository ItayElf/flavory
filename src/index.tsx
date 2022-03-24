import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { apiUrl } from "./constants";
import { NotFound } from "./components/notFound";
import "./index.css";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import Loading from "./components/loading";

const App = React.lazy(() => import("./App"));
const Auth = React.lazy(() => import("./pages/auth"));
const Feed = React.lazy(() => import("./pages/feed"));
const RecipeView = React.lazy(() => import("./pages/recipeView"));
const RecipeEdit = React.lazy(() => import("./pages/recipeEdit"));
const RecipeCreate = React.lazy(() => import("./pages/recipeCreate"));

const client = new ApolloClient({
  uri: apiUrl + "graphql",
  cache: new InMemoryCache({ addTypename: false }),
  defaultOptions: {
    query: { fetchPolicy: "no-cache" },
    mutate: { fetchPolicy: "no-cache" },
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <BrowserRouter>
        <Suspense fallback={<Loading className="h-screen" />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/signIn" element={<Auth signIn key={"signIn"} />} />
            <Route
              path="/signUp"
              element={<Auth signIn={false} key={"signUp"} />}
            />
            <Route path="/feed" element={<Feed />} />
            <Route path="/recipe/:id" element={<RecipeView />} />
            <Route path="/recipe/edit/:id" element={<RecipeEdit />} />
            <Route path="/recipe/post" element={<RecipeCreate />} />
            <Route path="*" element={<NotFound className="h-screen" />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
