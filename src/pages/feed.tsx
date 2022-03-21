import { useCallback, useEffect, useState } from "react";
import { Header } from "../components/header";
import { gql, useApolloClient } from "@apollo/client";
import useCurrentUser from "../hooks/useCurrentUser";
import { PostPreview } from "../interfaces/post";
import Loading from "../components/loading";
import PostCard from "../components/postCard";
import { apiUrl } from "../constants";
import { safeQuery } from "../utils/fetchUtils";
import PostModal from "../components/postModal";

const pageSize = 20;

interface Suggested {
  followedBy: string;
  suggested: string;
}

const feedQuery = (token: string, posts: PostPreview[]) => gql`
{
    feed(items: ${pageSize}, offset:${posts.length}, token: "${token}") {
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
}`;

const suggestedQuery = (token: string) => gql`
{
    suggestions(token: "${token}") {
        followedBy
        suggested
    }
}`;

export function Feed() {
  const [posts, setPosts] = useState<PostPreview[] | null>(null);
  const [suggestions, setSuggestions] = useState<Suggested[] | null>(null);
  const [finished, setFinished] = useState(false);
  const [modalPost, setModalPost] = useState<PostPreview | null>(null);
  const client = useApolloClient();
  const user = useCurrentUser(true);

  const getNewFeed = useCallback(async () => {
    if (finished) {
      return;
    }
    try {
      //   const res = await client.query({
      //     query: feedQuery(posts ?? [], globals.accessToken),
      //   });
      const res = await safeQuery(client, feedQuery, posts ?? []);
      setPosts([...(posts ?? []), ...res.data.feed]);
    } catch (e) {
      if (e + "" === "Error: No more posts") {
        setFinished(true);
      } else {
        throw e;
      }
    }
  }, [client, posts, finished]);

  useEffect(() => {
    const getSuggestions = async () => {
      //   const res = await client.query({
      //     query: suggestedQuery(globals.accessToken),
      //   });
      const res = await safeQuery(client, suggestedQuery);
      setSuggestions(res.data.suggestions);
    };
    if (user && posts === null) {
      getNewFeed();
      getSuggestions();
    }
  }, [getNewFeed, user, posts, client]);

  useEffect(() => {
    const scrolling_function = async () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 10
      ) {
        await getNewFeed();
        window.removeEventListener("scroll", scrolling_function);
      }
    };
    if (!finished) {
      window.addEventListener("scroll", scrolling_function);
    }
    return () => {
      window.removeEventListener("scroll", scrolling_function);
    };
  }, [getNewFeed, finished]);

  if (!user) {
    return (
      <>
        <Loading className="h-full" />
      </>
    );
  }

  return (
    <>
      <Header user={user} contentStyle="lg:w-[998px] sm:w-[640px] w-full" />
      <div className="mt-24 flex w-full flex-row space-x-8 sm:mx-auto sm:w-[640px] lg:w-[998px]">
        {posts ? (
          <>
            <div className="mb-9 w-full snap-y space-y-8 sm:w-[640px] sm:snap-none">
              {posts.map((p) => (
                <PostCard
                  key={p.idx}
                  post={p}
                  currentUser={user}
                  setModalPost={(post) => setModalPost(post)}
                />
              ))}
            </div>
            <div className=" hidden lg:flex lg:w-full lg:flex-col lg:space-y-4">
              <p className="h4">Suggestions:</p>
              {suggestions?.map((u) => (
                <div key={u.suggested} className="flex justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={apiUrl + `images/users/${u.suggested}`}
                      alt={`${u.suggested}'s profile`}
                      className="h-12 w-12 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="s1">{u.suggested}</p>
                      <p className="caption text-gray">
                        Followed by {u.followedBy}
                      </p>
                    </div>
                  </div>
                  <button className="s1 text-primary-900">Follow</button>
                </div>
              ))}
              <p className="caption !mt-8 text-gray">
                © 2022 Flavory by Itay Ben Haim
              </p>
            </div>
            <PostModal onClose={() => setModalPost(null)} post={modalPost} />
          </>
        ) : (
          <Loading className="w-full" />
        )}
      </div>
    </>
  );
}
