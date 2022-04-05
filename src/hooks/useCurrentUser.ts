import { useApolloClient, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import globals from "../globals";
import User from "../interfaces/user";
import { validateAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

const currentUser = (token: string) => gql`
{
    currentUser(token: "${token}") {
        idx
        name
        bio
        link
        followers
        following
        posts
    }
}
`;

export default function useCurrentUser(forceAuth: boolean) {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [user, setUser] = useState<User | undefined>(undefined);
  useEffect(() => {
    const getUser = async () => {
      try {
        await validateAuth(client);
        const res = await client.query({
          query: currentUser(globals.accessToken),
        });
        setUser(res.data.currentUser);
      } catch (e) {
        forceAuth && navigate("/signIn");
      }
    };
    async function getCurrentUser() {
      try {
        await getUser();
      } catch (e) {
        console.error(e);
      }
    }
    getCurrentUser();
  }, [client, navigate, forceAuth]);

  return user;
}
