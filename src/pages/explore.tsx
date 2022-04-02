import { gql, useApolloClient } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { Header } from "../components/header";
import Loading from "../components/loading";
import PostCard from "../components/postCard";
import useCurrentUser from "../hooks/useCurrentUser";
import { PostPreview } from "../interfaces/post";

const pageSize = 5;

const explore = (seed: number, items: number, offset: number) => gql`
{
    explore(seed: ${seed}, items: ${items}, offset: ${offset}) {
        poster
        recipe {
            title
            description
            cookingTime
            servings
            idx
        }
        comments {
            commenter
            content
            timestamp
        }
        likes
        cooked
        timestamp
        idx
    }
}
`;

export default function Explore() {
  const [posts, setPosts] = useState<PostPreview[] | null>(null);
  const [finished, setFinished] = useState(false);
  const currentUser = useCurrentUser(true);
  const client = useApolloClient();
  const seed = Math.floor(Math.random() * 2147483647);
  const isLg = window.innerWidth >= 1308;

  const getExplore = useCallback(async () => {
    if (finished) {
      return;
    }
    try {
      const res = await client.query({
        query: explore(seed, pageSize, posts?.length ?? 0),
      });
      const newPosts = [...(posts ?? [])];
      res.data.explore.forEach((p) => {
        if (!newPosts.some((p2) => p2.idx === p.idx)) {
          newPosts.push(p);
        }
      });
      setPosts(newPosts);
    } catch (e) {
      if (e + "" === "Error: No more posts") {
        setFinished(true);
      } else {
        throw e;
      }
    }
  }, [client, finished, posts, seed]);

  useEffect(() => {
    if (posts === null) getExplore();
  }, [getExplore, posts]);

  useEffect(() => {
    const scrolling_function = async () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 10
      ) {
        await getExplore();
        window.removeEventListener("scroll", scrolling_function);
      }
    };
    if (!finished) {
      window.addEventListener("scroll", scrolling_function);
    }
    return () => {
      window.removeEventListener("scroll", scrolling_function);
    };
  }, [getExplore, finished]);

  if (posts === null || currentUser === undefined) {
    return <Loading className="h-screen" />;
  }

  return (
    <>
      <Header
        user={currentUser}
        contentStyle="w-full sm:w-[858px] lg:w-[1296px]"
      />
      {isLg ? (
        <div className="mx-auto mt-24 flex max-w-[1296px] space-x-4">
          <div className="mb-4 flex max-w-[640px] flex-col space-y-4">
            {posts
              .filter((_, i) => i % 2 === 0)
              .map((p, i) => (
                <PostCard post={p} currentUser={currentUser} key={i} />
              ))}
          </div>
          <div className="mb-4 flex max-w-[640px] flex-col space-y-4">
            {posts
              .filter((_, i) => i % 2 !== 0)
              .map((p, i) => (
                <PostCard post={p} currentUser={currentUser} key={i} />
              ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mx-auto mt-24 mb-4 flex max-w-[640px] flex-col space-y-8">
            {posts.map((p, i) => (
              <PostCard post={p} currentUser={currentUser} key={i} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
