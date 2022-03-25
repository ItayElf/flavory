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
import Hashids from "hashids";
import { timeAsHours, timeSince } from "../utils/formatUtils";
import { safeMutation } from "../utils/fetchUtils";

interface Props {
  post: PostPreview;
  currentUser: User;
  setModalPost?: (post: PostPreview) => void;
  className?: string;
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

export default function PostCard({
  post,
  currentUser,
  setModalPost,
  className,
}: Props) {
  const client = useApolloClient();
  const [liked, setLiked] = useState(
    post.likes.indexOf(currentUser.name) !== -1
  );
  const [cooked, setCooked] = useState(
    post.cooked.indexOf(currentUser.name) !== -1
  );
  const func = setModalPost ? setModalPost : () => {};

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
    await safeMutation(client, likeMutation, post.idx, !value);
    setLiked(!value);
  };
  const toggleCooked = async () => {
    await safeMutation(client, cookedMutation, post.idx, !cooked);
    setCooked(!cooked);
  };

  return (
    <div
      className={`w-full shadow-sm shadow-primary-200 sm:w-[640px] ${className}`}
    >
      <div className="flex flex-row items-center justify-between bg-white py-2 px-4">
        <div className="flex items-center">
          <Link to={`/user/${post.poster}`}>
            <img
              src={apiUrl + `images/users/${post.poster}`}
              className={"h-14 w-14 rounded-full ring-2 ring-primary-50"}
              alt={`${post.poster}'s profile`}
            />
          </Link>
          <div className="ml-4 flex h-full flex-col justify-between">
            <Link to={`/user/${post.poster}`}>
              <p className="h6">{post.poster}</p>
            </Link>
            <p className="caption text-gray">{timeSince(post.timestamp)}</p>
          </div>
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
        <div className="h6 sm:h5 w-full text-right text-primary-900">
          <Link to={`/recipe/${new Hashids().encode(post.idx)}`}>
            View recipe
          </Link>
        </div>
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
                className="h-11 w-11 cursor-pointer text-primary-600"
                onClick={toggleCooked}
              />
            ) : (
              <MdOutlineLunchDining
                className="h-11 w-11 cursor-pointer text-primary-600"
                onClick={toggleCooked}
              />
            )}
            <MdOutlineComment
              className="h-11 w-11 cursor-pointer"
              onClick={() => func(post)}
            />
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
