import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import globals from "../globals";
import { gql, useApolloClient, ApolloClient } from "@apollo/client";

const refresh = (token: string) => gql`
  mutation {
    refresh(refreshToken: "${token}") {
      newToken
    }
  }
`;

const getCurrentUser = (token: string) => gql`
  {
    currentUser(token: "${token}") {
      name
    }
  }
`;

export default function useAuth() {
  const navigate = useNavigate();
  const client = useApolloClient();

  useEffect(() => {
    validateAuth(client).catch((e) => navigate("/signIn"));
  }, [client, navigate]);
}

export const validateAuth = async (client: ApolloClient<object>) => {
  const refreshToken = localStorage.getItem("refreshToken") ?? "";
  if (!refreshToken) {
    throw Error("No refreshToken");
  }
  const accessToken = globals.accessToken;
  if (!accessToken) {
    const res = await client.mutate({
      mutation: refresh(refreshToken),
    });
    globals.accessToken = res.data.refresh.newToken;
  } else {
    try {
      const res = await client.query({
        query: getCurrentUser(accessToken),
      });
      if (res.errors) {
        throw Error();
      }
    } catch (e) {
      const res = await client.mutate({
        mutation: refresh(refreshToken),
      });
      globals.accessToken = res.data.refresh.newToken;
    }
  }
};
