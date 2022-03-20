import { gql, ApolloClient, DocumentNode } from "@apollo/client";
import globals from "../globals";

const loadAccessToken = async (client: ApolloClient<object>) => {
  const refresh = gql`
    mutation {
        refresh(refreshToken: "${localStorage.getItem("refreshToken")}") {
            newToken
        }
    }
    `;
  const res = await client.query({ query: refresh });
  globals.accessToken = res.data.accessToken;
};

export const safeQuery = async (
  client: ApolloClient<object>,
  query: DocumentNode
) => {
  try {
    return client.query({ query });
  } catch (e) {
    if (e + "" === "Error: Signature has expired") {
      await loadAccessToken(client);
      return client.query({ query });
    } else {
      throw e;
    }
  }
};

export const safeMutation = async (
  client: ApolloClient<object>,
  mutation: DocumentNode
) => {
  try {
    return client.mutate({ mutation });
  } catch (e) {
    if (e + "" === "Error: Signature has expired") {
      await loadAccessToken(client);
      return client.mutate({ mutation });
    } else {
      throw e;
    }
  }
};
