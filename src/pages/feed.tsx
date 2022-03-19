import { useCallback, useEffect, useState } from "react";
import { Header } from "../components/header";
import { gql, useApolloClient } from "@apollo/client";
import useCurrentUser from "../hooks/useCurrentUser";
import { PostPreview } from "../interfaces/post";
import globals from "../globals";
import Loading from "../components/loading";
import PostCard from "../components/postCard";

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
            idx
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
    setPosts([...(posts ?? []), ...res.data.feed]);
    setPage(page + 1);
  }, [client, page, posts]);

  useEffect(() => {
    if (user && posts === null) {
      getNewFeed();
    }
  }, [getNewFeed, user, posts]);

  if (!user) {
    return (
      <>
        <Loading className="h-full" />
      </>
    );
  }
  console.log(posts);

  return (
    <div className="h-full">
      <Header user={user} contentStyle="lg:w-[998px] sm:w-[640px] w-full" />
      <div className="mt-24 flex w-full flex-row justify-between sm:mx-auto sm:w-[640px] lg:w-[998px]">
        {posts ? (
          <>
            <div className="mb-9 w-full space-y-8 sm:w-[640px]">
              {posts.map((p) => (
                <PostCard key={p.idx} post={p} currentUser={user} />
              ))}
            </div>
            <div className="hidden lg:flex"></div>
          </>
        ) : (
          <Loading className="w-full" />
        )}
      </div>
    </div>
  );
}
