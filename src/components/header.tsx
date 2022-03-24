import { useState } from "react";
import { MdSearch, MdOutlineExplore, MdOutlineAddBox } from "react-icons/md";
import { Link } from "react-router-dom";
import { apiUrl } from "../constants";
import User from "../interfaces/user";

interface Props {
  user: User | null;
  contentStyle?: string;
}

export function Header({ contentStyle, user }: Props) {
  const [search, setSearch] = useState("");

  return (
    <div className="fixed top-0 flex h-16 w-full justify-center bg-white shadow-sm shadow-primary-200">
      <div
        className={
          "flex h-full flex-row items-center justify-between px-2 sm:justify-evenly lg:justify-between" +
          " " +
          contentStyle
        }
      >
        <Link to={"/feed"} className="h4">
          Flavory
        </Link>
        <div className="hidden items-center rounded-md bg-primary-50 sm:flex sm:w-72 sm:justify-between lg:w-96">
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="placeholder:h6 h6 w-full rounded-md border-none bg-inherit placeholder:text-gray focus:ring-0 focus:ring-offset-0"
          />
          <MdSearch className="mr-4 h-7 w-7 text-gray" />
        </div>
        {user ? (
          <div className="flex items-center">
            <MdOutlineExplore className="mr-6 h-7 w-7" />
            <Link to={"/recipe/post"}>
              <MdOutlineAddBox className="mr-6 h-7 w-7 cursor-pointer" />
            </Link>
            <img
              src={apiUrl + `images/users/${user.name}`}
              className="h-11 w-11 rounded-full ring-2 ring-primary-50"
              alt={`${user.name}'s profile`}
            />
          </div>
        ) : (
          <div className="flex items-center">
            <Link to={"/signIn"} className="h6 mr-6 text-primary-900">
              Sign In
            </Link>
            <Link
              to={"/signUp"}
              className="h6 mr-6 rounded bg-primary-600 p-2 text-white"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
