import { useCallback, useEffect, useState } from "react";
import { Header } from "../components/header";
import { gql, useApolloClient } from "@apollo/client";
import useCurrentUser from "../hooks/useCurrentUser";
import { PostPreview } from "../interfaces/post";
import globals from "../globals";

const pageSize = 20;

const feedQuery = (page: number, token: string) => gql`
{
    feed(items: ${pageSize}, offset:${pageSize * page}, token: "${token}") {
        poster
        recipe {
            title
            description
            cookingTime
            servings
        }
        likes
        cooked
        idx
    }
}`;

export function Feed() {
  const [posts, setPosts] = useState<PostPreview[] | null>(null);
  const [page, setPage] = useState(0);
  const client = useApolloClient();
  const user = useCurrentUser();

  const getNewFeed = useCallback(async () => {
    const res = await client.query({
      query: feedQuery(page, globals.accessToken),
    });
    setPosts([...(posts ?? []), res.data.feed]);
    setPage(page + 1);
  }, [client, page, posts]);

  useEffect(() => {
    if (user && posts === null) {
      getNewFeed();
    }
  }, [getNewFeed, user, posts]);

  if (!user) {
    return <></>;
  }
  return (
    <div className="h-full">
      <Header user={user} contentStyle="lg:w-[998px] sm:w-[640px] w-full" />
    </div>
  );
}
