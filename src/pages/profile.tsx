import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/header";
import { NotFound } from "../components/notFound";
import { gql, useApolloClient } from "@apollo/client";
import { Tab } from "@headlessui/react";
import Loading from "../components/loading";
import useCurrentUser from "../hooks/useCurrentUser";
import User from "../interfaces/user";
import { apiUrl } from "../constants";
import { ButtonPrimary } from "../components/buttonPrimary";
import { ButtonSecondary } from "../components/buttonSecondary";
import { PostPreview } from "../interfaces/post";
import PostCard from "../components/postCard";
import PostModal from "../components/postModal";

const query = (name: string) => gql`
{
    user(name: "${name}") {
        idx
        name
        bio
        link
        followers
        following
        posts
    }
    postsOf(name: "${name}") {
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

const getCookedBy = (name: string) => gql`
{
  cookedBy(name: "${name}") {
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

export default function Profile() {
  const [user, setUser] = useState<User | null | undefined>(null);
  const currentUser = useCurrentUser(false);
  const [following, setFollowing] = useState(
    user?.followers.includes(currentUser?.name ?? "") ?? false
  );
  const [posts, setPosts] = useState<PostPreview[] | null | undefined>(null);
  const [cookedBy, setCookedBy] = useState<PostPreview[] | null>(null);
  const { name } = useParams();
  const client = useApolloClient();
  const owner = name === currentUser?.name;

  useEffect(() => {
    async function getData() {
      try {
        const res = await client.query({ query: query(name ?? "") });
        setUser(res.data.user);
        setPosts(res.data.postsOf);
      } catch (e) {
        setUser(undefined);
      }
    }
    getData();
  }, [client, name]);

  const handleChange = async (i: number) => {
    if (i === 1 && cookedBy === null) {
      try {
        const res = await client.query({ query: getCookedBy(name ?? "") });
        setCookedBy(res.data.cookedBy);
      } catch (e) {
        setCookedBy([]);
      }
    }
  };

  if (user === null || posts === null) {
    return <Loading className="h-screen" />;
  } else if (user === undefined || posts === undefined) {
    return <NotFound className="h-screen" />;
  }

  return (
    <>
      <Header user={currentUser} contentStyle="w-full sm:w-[858px]" />
      <div className="mt-16 py-4">
        <div className="mx-auto w-full max-w-[640px] bg-white shadow shadow-primary-200">
          <div className="flex space-x-16 p-4">
            <img
              src={apiUrl + `images/users/${user.name}`}
              className="h-36 w-36 rounded-full"
              alt={`${user.name}'s profile`}
            />
            <div className="flex flex-col space-y-6">
              <div className="flex space-x-8">
                <h1 className="h4">{user.name}</h1>
                {following ? (
                  <ButtonSecondary className="h6">Following</ButtonSecondary>
                ) : owner ? (
                  <ButtonSecondary className="h6 px-3 py-1">
                    Edit Profile
                  </ButtonSecondary>
                ) : (
                  <ButtonPrimary className="h6 px-3 py-1">Follow</ButtonPrimary>
                )}
              </div>
              <div className="b1 flex w-full space-x-8">
                <div>
                  <span className="font-bold">{user.posts.length}</span> posts
                </div>
                <div>
                  <span className="font-bold">{user.followers.length}</span>{" "}
                  followers
                </div>
                <div>
                  <span className="font-bold">{user.following.length}</span>{" "}
                  following
                </div>
              </div>
              <div className="b1">
                <p>{user.bio}</p>
                <a href={user.link} className="font-bold text-primary-600">
                  {user.link}
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 mb-4 h-px w-full bg-primary-300"></div>
          <Tab.Group onChange={handleChange}>
            <Tab.List className="h6 sm:p mx-2 flex justify-center space-x-8 rounded-xl bg-primary-200 p-1 px-4">
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
                    Cooked
                  </button>
                )}
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-6">
              <PostsPanel
                posts={posts}
                user={user}
                emptyMsg="This user has no posts."
              />
              <PostsPanel
                posts={cookedBy}
                user={user}
                emptyMsg="This user hasn't cooked anything yet."
              />
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </>
  );
}

function PostsPanel({
  posts,
  user,
  emptyMsg,
}: {
  posts: PostPreview[] | null;
  user: User;
  emptyMsg: string;
}) {
  const [modalPost, setModalPost] = useState<PostPreview | null>(null);

  if (posts === null) {
    posts = [];
    return (
      <Tab.Panel>
        <Loading />
      </Tab.Panel>
    );
  }

  return (
    <Tab.Panel>
      {posts.length !== 0 ? (
        <>
          <div className="flex w-full snap-y flex-col items-center justify-center space-y-8 bg-primary-25 sm:snap-none">
            {posts.map((p) => (
              <PostCard
                key={p.idx}
                post={p}
                currentUser={user}
                setModalPost={(post) => setModalPost(post)}
                className="shadow-gray"
              />
            ))}
          </div>
          <PostModal onClose={() => setModalPost(null)} post={modalPost} />
        </>
      ) : (
        <div className="flex justify-center">
          <h2 className="h5">{emptyMsg}</h2>
        </div>
      )}
    </Tab.Panel>
  );
}
