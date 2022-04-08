import { gql, useApolloClient } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { Header } from "../components/header";
import Loading from "../components/loading";
import PostModal from "../components/modals/postModal";
import PostCard from "../components/postCard";
import useAtScroll from "../hooks/useAtScroll";
import useCurrentUser from "../hooks/useCurrentUser";
import useTitle from "../hooks/useTitle";
import { PostPreview } from "../interfaces/post";
import { safeQuery } from "../utils/fetchUtils";

const pageSize = 20;

const explore = (
  token: string,
  seed: number,
  items: number,
  offset: number
) => gql`
{
    explore(token: "${token}", seed: ${seed}, items: ${items}, offset: ${offset}) {
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
  const [modalPost, setModalPost] = useState<PostPreview | null>(null);
  const [finished, setFinished] = useState(false);
  const currentUser = useCurrentUser(true);
  const client = useApolloClient();
  const seed = Math.floor(Math.random() * 2147483647);
  const isLg = window.innerWidth >= 1308;

  useTitle("Explore");

  const getExplore = useCallback(async () => {
    if (finished) {
      return;
    }
    try {
      const res = await safeQuery(
        client,
        explore,
        seed,
        pageSize,
        posts?.length ?? 0
      );

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
        if (!posts) {
          setPosts([]);
        }
      } else {
        throw e;
      }
    }
  }, [client, finished, posts, seed]);

  useEffect(() => {
    if (posts === null) getExplore();
  }, [getExplore, posts]);

  useAtScroll(getExplore, finished);

  if (posts === null || currentUser === undefined) {
    return <Loading className="h-screen" />;
  }

  return (
    <>
      <Header
        user={currentUser}
        contentStyle="w-full sm:w-[858px] 2lg:w-[1296px]"
      />
      {isLg ? (
        <div className="mx-auto mt-24 flex max-w-[1296px] space-x-4">
          <div className="mb-4 flex max-w-[640px] flex-col space-y-4">
            {posts
              .filter((_, i) => i % 2 === 0)
              .map((p, i) => (
                <PostCard
                  post={p}
                  currentUser={currentUser}
                  key={i}
                  setModalPost={(post) => setModalPost(post)}
                />
              ))}
          </div>
          <div className="mb-4 flex max-w-[640px] flex-col space-y-4">
            {posts
              .filter((_, i) => i % 2 !== 0)
              .map((p, i) => (
                <PostCard
                  post={p}
                  currentUser={currentUser}
                  key={i}
                  setModalPost={(post) => setModalPost(post)}
                />
              ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mx-auto mt-24 mb-4 flex max-w-[640px] flex-col space-y-8">
            {posts.map((p, i) => (
              <PostCard
                post={p}
                currentUser={currentUser}
                key={i}
                setModalPost={(post) => setModalPost(post)}
              />
            ))}
          </div>
        </>
      )}
      <PostModal onClose={() => setModalPost(null)} post={modalPost} />
    </>
  );
}
