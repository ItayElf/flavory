import { useCallback, useEffect, useState } from "react";
import { Header } from "../components/header";
import { gql, useApolloClient } from "@apollo/client";
import useCurrentUser from "../hooks/useCurrentUser";
import { PostPreview } from "../interfaces/post";
import globals from "../globals";
import Loading from "../components/loading";
import PostCard from "../components/postCard";
import { apiUrl } from "../constants";

const pageSize = 20;
interface Suggested {
  followedBy: string;
  suggested: string;
}

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
    const getSuggestions = async () => {
      const res = await client.query({
        query: suggestedQuery(globals.accessToken),
      });
      setSuggestions(res.data.suggestions);
    };
    if (user && posts === null) {
      getNewFeed();
      getSuggestions();
    }
  }, [getNewFeed, user, posts, client]);

  if (!user) {
    return (
      <>
        <Loading className="h-full" />
      </>
    );
  }

  return (
    <div className="h-full">
      <Header user={user} contentStyle="lg:w-[998px] sm:w-[640px] w-full" />
      <div className="mt-24 flex w-full flex-row space-x-8 sm:mx-auto sm:w-[640px] lg:w-[998px]">
        {posts ? (
          <>
            <div className="mb-9 w-full space-y-8 sm:w-[640px]">
              {posts.map((p) => (
                <PostCard key={p.idx} post={p} currentUser={user} />
              ))}
            </div>
            <div className="hidden lg:flex lg:w-full lg:flex-col lg:space-y-4">
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
            </div>
          </>
        ) : (
          <Loading className="w-full" />
        )}
      </div>
    </div>
  );
}
