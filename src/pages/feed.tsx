import { useCallback, useEffect, useState } from "react";
import { Header } from "../components/header";
import { gql, useApolloClient, ApolloClient } from "@apollo/client";
import useCurrentUser from "../hooks/useCurrentUser";
import { PostPreview } from "../interfaces/post";
import Loading from "../components/loading";
import PostCard from "../components/postCard";
import { apiUrl } from "../constants";
import { safeMutation, safeQuery } from "../utils/fetchUtils";
import PostModal from "../components/modals/postModal";
import { Link } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import { ButtonPrimary } from "../components/buttonPrimary";
import useAtScroll from "../hooks/useAtScroll";

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
            idx
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

export default function Feed() {
  const [posts, setPosts] = useState<PostPreview[] | null>(null);
  const [suggestions, setSuggestions] = useState<Suggested[] | null>(null);
  const [finished, setFinished] = useState(false);
  const [modalPost, setModalPost] = useState<PostPreview | null>(null);
  const client = useApolloClient();
  const user = useCurrentUser(true);

  useTitle("Flavory");

  const getNewFeed = useCallback(async () => {
    if (finished) {
      return;
    }
    try {
      const res = await safeQuery(client, feedQuery, posts ?? []);
      const newPosts = [...(posts ?? [])];
      res.data.feed.forEach((p) => {
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
  }, [client, posts, finished]);

  useEffect(() => {
    const getSuggestions = async () => {
      const res = await safeQuery(client, suggestedQuery);
      setSuggestions(res.data.suggestions);
    };
    if (user && posts === null) {
      getNewFeed();
      getSuggestions();
    }
  }, [getNewFeed, user, posts, client]);

  useAtScroll(getNewFeed, finished);

  if (!user) {
    return (
      <>
        <Loading className="h-screen" />
      </>
    );
  }

  return (
    <>
      <Header user={user} contentStyle="lg:w-[998px] sm:w-[640px] w-full" />
      <div className="mt-24 flex w-full flex-row space-x-8 sm:mx-auto sm:w-[640px] lg:w-[998px]">
        {posts != null ? (
          <>
            {posts.length !== 0 ? (
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
            ) : (
              <div className="w-full shrink-0 space-y-4 sm:w-[640px]">
                <h1 className="h2 w-full text-primary-900">
                  Your feed is empty.
                </h1>
                <p className="h5 !mb-4">
                  Follow other users to fill your feed up!
                </p>
                <Link to="/explore">
                  <ButtonPrimary className="h5">Explore</ButtonPrimary>
                </Link>
              </div>
            )}
            <div className=" hidden lg:flex lg:w-full lg:flex-col lg:space-y-4">
              <p className="h4">Suggestions:</p>
              {suggestions?.map((u) => (
                <SuggestionTile
                  apiUrl={apiUrl}
                  u={u}
                  key={u.suggested}
                  client={client}
                />
              ))}
              <p className="caption !mt-8 text-gray">
                © 2022 Flavory by Itay Ben Haim
              </p>
            </div>
            <PostModal
              onClose={() => setModalPost(null)}
              post={modalPost}
              currentUser={user}
            />
          </>
        ) : (
          <Loading className="w-full" />
        )}
      </div>
    </>
  );
}

interface Props2 {
  apiUrl: string;
  u: Suggested;
  client: ApolloClient<object>;
}

function SuggestionTile({ apiUrl, u, client }: Props2) {
  const [followed, setfollowed] = useState(false);

  const mutation = (token: string, name: string, follow: boolean) => gql`
  mutation {
    ${follow ? "follow" : "unfollow"}(name: "${name}", token: "${token}") {
      success
    }
  }
  `;

  const onClick = async () => {
    await safeMutation(client, mutation, u.suggested, !followed);
    setfollowed(!followed);
  };

  return (
    <div className="flex justify-between">
      <div className="flex items-center space-x-4">
        <Link to={`/user/${u.suggested}`}>
          <img
            src={apiUrl + `images/users/${u.suggested}`}
            alt={`${u.suggested}'s profile`}
            className="h-12 w-12 rounded-full"
          />
        </Link>
        <div className="flex flex-col">
          <Link to={`/user/${u.suggested}`}>
            <p className="s1">{u.suggested}</p>
          </Link>
          <p className="caption text-gray">Followed by {u.followedBy}</p>
        </div>
      </div>
      <button
        className={`s1 ${!followed ? "text-primary-900" : "text-gray"}`}
        onClick={onClick}
      >
        {followed ? "Following" : "Follow"}
      </button>
    </div>
  );
}
