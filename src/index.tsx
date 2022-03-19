import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth } from "./pages/auth";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { apiUrl } from "./constants";
import { Feed } from "./pages/feed";

const client = new ApolloClient({
  uri: apiUrl + "graphql",
  cache: new InMemoryCache(),
  headers: {
    casdasda: "asdasd",
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signIn" element={<Auth signIn key={"signIn"} />} />
          <Route
            path="/signUp"
            element={<Auth signIn={false} key={"signUp"} />}
          />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
