import { apiUrl } from "../constants";
import { PostPreview } from "../interfaces/post";
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

interface Props {
  post: PostPreview;
  currentUser: User;
}

export default function PostCard({ post, currentUser }: Props) {
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
      <div className="space-y-4 bg-[#fafafa] px-4 py-4">
        <img
          src={apiUrl + `images/recipes/${post.recipe.idx}`}
          className="aspect-video w-full object-cover"
          onError={(e) =>
            ((e.target as HTMLImageElement).style.display = "none")
          }
          alt={post.recipe.title}
        />
        <p className="h3 w-full text-center">{post.recipe.title}</p>
        <p className="h6">{post.recipe.description}</p>
        {(post.recipe.cookingTime || post.recipe.servings) && (
          <div className="flex">
            {post.recipe.cookingTime && (
              <p className="s1 w-1/2 text-gray">
                Cooking time: {post.recipe.cookingTime}
                {/* // TODO convert to hours and minutes */}
              </p>
            )}
            {post.recipe.servings && (
              <p className="s1 w-1/2 text-gray">
                Servings: {post.recipe.servings}
              </p>
            )}
          </div>
        )}
        <button className="h5 w-full text-right text-primary-900">
          View recipe
        </button>
      </div>
      <div className="bg-white px-10 pt-4 pb-2">
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            {post.likes.indexOf(currentUser.name) === -1 ? (
              <MdFavoriteBorder className="h-11 w-11 text-error" />
            ) : (
              <MdFavorite className="h-11 w-11 text-error" />
            )}
            {post.cooked.indexOf(currentUser.name) === -1 ? (
              <MdOutlineLunchDining className="h-11 w-11 text-primary-600" />
            ) : (
              <MdLunchDining className="h-11 w-11 text-primary-600" />
            )}
            <MdOutlineComment className="h-11 w-11" />
          </div>
          <MdOutlineBook className="h-11 w-11" />
        </div>
        <p className="mt-2">
          Liked by {post.likes.length} people and cooked by {post.cooked.length}{" "}
          people
        </p>
      </div>
    </div>
  );
}
