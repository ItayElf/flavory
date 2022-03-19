import { useState } from "react";
import { MdSearch, MdOutlineExplore, MdOutlineAddBox } from "react-icons/md";
import { apiUrl } from "../constants";
import User from "../interfaces/user";

interface Props {
  user: User;
  contentStyle?: string;
}

export function Header({ contentStyle, user }: Props) {
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-16 w-full justify-center bg-white">
      <div
        className={
          "flex h-full flex-row items-center justify-between sm:justify-evenly lg:justify-between" +
          " " +
          contentStyle
        }
      >
        <span className="h4">Flavory</span>
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
        <div className="flex items-center">
          <MdOutlineExplore className="mr-6 h-7 w-7" />
          <MdOutlineAddBox className="mr-6 h-7 w-7" />
          <img
            src={apiUrl + `images/users/${user.name}`}
            className="h-11 w-11 rounded-full ring-2 ring-primary-50"
            alt={`${user.name}'s profile`}
          />
        </div>
      </div>
    </div>
  );
}
