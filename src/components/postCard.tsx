import { apiUrl } from "../constants";
import { PostPreview } from "../interfaces/post";
import { gql, useApolloClient } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  MdMoreVert,
  MdFavoriteBorder,
  MdFavorite,
  MdOutlineLunchDining,
  MdLunchDining,
  MdOutlineComment,
  MdOutlineBook,
} from "react-icons/md";
import User from "../interfaces/user";
import { useState } from "react";
import globals from "../globals";
import Hashids from "hashids";
import { timeAsHours } from "../utils/formatUtils";

interface Props {
  post: PostPreview;
  currentUser: User;
}

const likeMutation = (token: string, postId: number, like: boolean) => gql`
    mutation {
        ${like ? "like" : "dislike"}(post: ${postId}, token: "${token}") {
            success
        }
    }
`;
const cookedMutation = (token: string, postId: number, cooked: boolean) => gql`
mutation {
    ${cooked ? "cooked" : "uncooked"}(post: ${postId}, token: "${token}") {
        success
    }
}
`;

export default function PostCard({ post, currentUser }: Props) {
  const client = useApolloClient();
  const [liked, setLiked] = useState(
    post.likes.indexOf(currentUser.name) !== -1
  );
  const [cooked, setCooked] = useState(
    post.cooked.indexOf(currentUser.name) !== -1
  );

  const likes = () =>
    post.likes.length -
    (post.likes.indexOf(currentUser.name) !== -1 ? 1 : 0) +
    (liked ? 1 : 0);

  const cookes = () =>
    post.cooked.length -
    (post.cooked.indexOf(currentUser.name) !== -1 ? 1 : 0) +
    (cooked ? 1 : 0);

  const toggleLike = async (value: boolean) => {
    if (value !== liked) {
      return;
    }
    await client.mutate({
      mutation: likeMutation(globals.accessToken, post.idx, !value),
    });
    setLiked(!value);
  };
  const toggleCooked = async () => {
    await client.mutate({
      mutation: cookedMutation(globals.accessToken, post.idx, !cooked),
    });
    setCooked(!cooked);
  };

  return (
    <div className="w-full shadow-sm shadow-primary-200 sm:w-[640px]">
      <div className="flex flex-row items-center justify-between bg-white py-2 px-4">
        <div className="flex items-center">
          <img
            src={apiUrl + `images/users/${post.poster}`}
            className={"h-14 w-14 rounded-full ring-2 ring-primary-50"}
            alt={`${post.poster}'s profile`}
          />
          <span className="h6 ml-4">{post.poster}</span>
        </div>
        <MdMoreVert className="h-7 w-7" />
      </div>
      <div className="h-px w-full bg-primary-50"></div>
      <div
        className="space-y-4 bg-[#fafafa] px-4 py-4"
        onDoubleClick={() => toggleLike(false)}
      >
        <img
          src={apiUrl + `images/recipes/${post.recipe.idx}`}
          className="aspect-video w-full object-cover"
          onError={(e) =>
            ((e.target as HTMLImageElement).style.display = "none")
          }
          alt={post.recipe.title}
        />
        <p className="h4 sm:h3 w-full text-center">{post.recipe.title}</p>
        <p className="s1 sm:h6">{post.recipe.description}</p>
        {(post.recipe.cookingTime || post.recipe.servings) && (
          <div className="flex">
            {post.recipe.cookingTime && (
              <p className="s2 sm:s1 w-1/2 text-gray">
                Cooking time: {timeAsHours(post.recipe.cookingTime)}
              </p>
            )}
            {post.recipe.servings && (
              <p className="s2 sm:s1 w-1/2 text-gray">
                Servings: {post.recipe.servings}
              </p>
            )}
          </div>
        )}
        <Link
          to={`/recipe/${new Hashids().encode(post.idx)}`}
          className="h6 sm:h5 block w-full text-right text-primary-900"
        >
          View recipe
        </Link>
      </div>
      <div className="bg-white px-4 pt-4 pb-2">
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            {liked ? (
              <MdFavorite
                className="h-11 w-11 text-error"
                onClick={() => toggleLike(liked)}
              />
            ) : (
              <MdFavoriteBorder
                className="h-11 w-11 text-error"
                onClick={() => toggleLike(liked)}
              />
            )}
            {cooked ? (
              <MdLunchDining
                className="h-11 w-11 text-primary-600"
                onClick={toggleCooked}
              />
            ) : (
              <MdOutlineLunchDining
                className="h-11 w-11 text-primary-600"
                onClick={toggleCooked}
              />
            )}
            <MdOutlineComment className="h-11 w-11" />
          </div>
          <MdOutlineBook className="h-11 w-11" />
        </div>
        <p className="mt-2">
          Liked by {likes()} people and cooked by {cookes()} people
        </p>
      </div>
    </div>
  );
}
