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

export default function useCurrentUser() {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        await validateAuth(client);
      } catch (e) {
        navigate("/signIn");
      }
      const res = await client.query({
        query: currentUser(globals.accessToken),
      });
      setUser(res.data.currentUser);
    };
    async function getCurrentUser() {
      try {
        await getUser();
      } catch (e) {
        console.error(e);
      }
    }
    getCurrentUser();
  }, [client, navigate]);

  return user;
}
