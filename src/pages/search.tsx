import { gql, useApolloClient } from "@apollo/client";
import { Tab } from "@headlessui/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/header";
import Loading from "../components/loading";
import PostCard from "../components/postCard";
import { apiUrl } from "../constants";
import useAtScroll from "../hooks/useAtScroll";
import useCurrentUser from "../hooks/useCurrentUser";
import useUrlQuery from "../hooks/useUrlQuery";
import { PostPreview } from "../interfaces/post";
import User from "../interfaces/user";

const pageSize = 20;

const searchUsers = (query: string, items: number, offset: number) => gql`
{
    usersSearch(query: "${query}", items: ${items}, offset: ${offset}) {
        idx
        name
    }
}
`;

const searchPosts = (query: string, items: number, offset: number) => gql`
{
    postsSearch(query: "${query}", items: ${items}, offset: ${offset}) {
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

interface UserSummery {
  name: string;
  idx: number;
}

export default function Search() {
  const currentUser = useCurrentUser(true);
  const [users, setUsers] = useState<UserSummery[] | null>(null);
  const [posts, setPosts] = useState<PostPreview[] | null>(null);
  const [finished, setFinished] = useState([false, false]); // posts, users
  const [tab, setTab] = useState(0);
  const client = useApolloClient();
  const urlQuery = useUrlQuery();
  const queryString = urlQuery.get("query") ?? "";

  const getPosts = useCallback(async () => {
    if (finished[0]) {
      return;
    }
    try {
      const res = await client.query({
        query: searchPosts(queryString, pageSize, posts?.length ?? 0),
      });
      setPosts(res.data.postsSearch);
    } catch (e) {
      if (e + "" === "Error: No more posts") {
        finished[0] = true;
        setFinished(finished);
        if (!posts) {
          setPosts([]);
        }
      } else {
        throw e;
      }
    }
  }, [client, finished, posts, queryString]);

  const getUsers = useCallback(async () => {
    if (finished[1]) {
      return;
    }
    try {
      const res = await client.query({
        query: searchUsers(queryString, pageSize, users?.length ?? 0),
      });
      setUsers(res.data.usersSearch);
    } catch (e) {
      if (e + "" === "Error: No more users") {
        finished[1] = true;
        setFinished(finished);
        if (!users) {
          setUsers([]);
        }
      } else {
        throw e;
      }
    }
  }, [client, finished, queryString, users]);

  const handleRefetch = async (num?: number) => {
    const n = num ?? tab;
    if (n === 0) {
      await getPosts();
    } else if (n === 1) {
      await getUsers();
    }
  };

  const changeTab = async (i: number) => {
    setTab(i);
    await handleRefetch(i);
  };

  useEffect(() => {
    if (posts === null) getPosts();
  }, [posts, getPosts]);

  useEffect(() => {
    setPosts(null);
    setUsers(null);
    setFinished([false, false]);
    setTab(0);
  }, [queryString]);

  useAtScroll(handleRefetch, finished[tab]);

  if (!currentUser) {
    return <Loading className="h-screen" />;
  }

  return (
    <>
      <Header user={currentUser} contentStyle="w-full" />
      <div className="mt-24" />
      <Tab.Group selectedIndex={tab} onChange={changeTab}>
        <Tab.List className="h6 mx-auto flex w-[640px] justify-center space-x-8 rounded-xl bg-primary-200 p-1 px-4">
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={`rounded-lg py-2.5 px-2 font-medium focus:outline-none ${
                  selected ? "bg-primary-50 shadow" : "hover:bg-primary-100"
                }`}
              >
                Posts
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={`rounded-lg p-2 font-medium focus:outline-none ${
                  selected ? "bg-primary-50 shadow" : "hover:bg-primary-100"
                }`}
              >
                Users
              </button>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels className="mx-auto w-[640px]">
          <PostPanel
            posts={posts}
            query={queryString}
            currentUser={currentUser}
          />
          <UsersPanel
            users={users}
            query={queryString}
            currentUser={currentUser}
          />
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

interface PostsProps {
  posts: PostPreview[] | null;
  query: string;
  currentUser: User;
}

const PostPanel = ({ posts, query, currentUser }: PostsProps) => {
  if (!posts) {
    return (
      <Tab.Panel>
        <Loading className="mt-4" />
      </Tab.Panel>
    );
  } else if (posts.length === 0) {
    return (
      <Tab.Panel>
        <h1 className="h4 mt-4 text-center text-gray">
          No posts were found for "{query}"
        </h1>
      </Tab.Panel>
    );
  }

  return (
    <Tab.Panel className="mt-4 space-y-8">
      {posts.map((p, i) => (
        <PostCard key={i} post={p} currentUser={currentUser} />
      ))}
    </Tab.Panel>
  );
};

interface UsersProps {
  users: UserSummery[] | null;
  query: string;
  currentUser: User;
}

const UsersPanel = ({ users, query, currentUser }: UsersProps) => {
  if (!users) {
    return (
      <Tab.Panel>
        <Loading className="mt-4" />
      </Tab.Panel>
    );
  } else if (users.length === 0) {
    return (
      <Tab.Panel>
        <h1 className="h4 mt-4 text-center text-gray">
          No users were found for "{query}"
        </h1>
      </Tab.Panel>
    );
  }
  return (
    <Tab.Panel className="mt-4 space-y-4">
      {users.map((u, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded bg-white p-2 pr-4 shadow-sm shadow-primary-200"
        >
          <div className="flex items-center space-x-4">
            <Link to={`/user/${u.name}`}>
              <img
                src={apiUrl + `images/users/${u.name}`}
                alt={`${u.name}'s profile`}
                className="h-16 w-16 rounded-full"
              />
            </Link>
            <Link to={`/user/${u.name}`}>
              <p className="h4">{u.name}</p>
            </Link>
          </div>
          <Link to={`/user/${u.name}`} className="h5 text-primary-900">
            View Profile
          </Link>
        </div>
      ))}
    </Tab.Panel>
  );
};
