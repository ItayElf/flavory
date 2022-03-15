import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import globals from "../globals";
import { gql, useApolloClient } from "@apollo/client";

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
    const setAccess = async (refreshToken: string) => {
      try {
        const res = await client.mutate({
          mutation: refresh(refreshToken),
        });
        globals.accessToken = res.data.refresh.newToken;
      } catch (e) {
        navigate("/signIn");
      }
    };
    async function auth() {
      const refreshToken = localStorage.getItem("refreshToken") ?? "";
      if (!refreshToken) {
        navigate("/signIn");
      }
      const accessToken = globals.accessToken;
      if (!accessToken) {
        setAccess(refreshToken);
      } else {
        try {
          const res = await client.query({
            query: getCurrentUser(accessToken),
          });
          if (res.errors) {
            setAccess(refreshToken);
          }
        } catch (e) {
          setAccess(refreshToken);
        }
      }
    }
    auth();
  }, [client, navigate]);
}
