import { gql, ApolloClient, DocumentNode } from "@apollo/client";
import globals from "../globals";

export const escape = (a: string) => a.replace(/"/g, '\\"');

const loadAccessToken = async (client: ApolloClient<object>) => {
  const refresh = (token: string) => gql`
    mutation {
      refresh(refreshToken: "${token}") {
        newToken
      }
    }
  `;
  const refreshToken = localStorage.getItem("refreshToken") ?? "";
  const res = await client.mutate({ mutation: refresh(refreshToken) });
  globals.accessToken = res.data.newToken;
  return res.data.newToken;
};

export const safeQuery = async (
  client: ApolloClient<object>,
  query: (token: string, ...args: any[]) => DocumentNode,
  ...args: any[]
) => {
  try {
    args = args.map((a) => (typeof a === "string" ? escape(a) : a));
    return await client.query({ query: query(globals.accessToken, ...args) });
  } catch (e) {
    if (e + "" === "Error: Signature has expired") {
      const token = await loadAccessToken(client);
      return await client.query({ query: query(token, ...args) });
    } else {
      throw e;
    }
  }
};

export const safeMutation = async (
  client: ApolloClient<object>,
  mutation: (token: string, ...args: any[]) => DocumentNode,
  ...args: any[]
) => {
  try {
    args = args.map((a) => (typeof a === "string" ? escape(a) : a));
    return await client.mutate({
      mutation: mutation(globals.accessToken, ...args),
    });
  } catch (e) {
    if (
      (e + "").includes("Error: Signature has expired") ||
      (e + "").includes("Error: Not enough segments")
    ) {
      const token = await loadAccessToken(client);
      return await client.mutate({ mutation: mutation(token, ...args) });
    } else {
      throw e;
    }
  }
};

export const getBase64FromUrl: (
  url: string
) => Promise<string | undefined> = async (url: string) => {
  const data = await fetch(url);
  if (!data.ok) {
    return new Promise((resolve) => resolve(undefined));
  }
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data + "");
    };
  });
};
