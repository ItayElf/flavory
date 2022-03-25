import { Fragment, useState } from "react";
import {
  MdSearch,
  MdOutlineExplore,
  MdOutlineAddBox,
  MdPerson,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { apiUrl } from "../constants";
import { Menu, Transition } from "@headlessui/react";
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

            <Menu as="div" className="relative">
              <div>
                <Menu.Button>
                  <img
                    src={apiUrl + `images/users/${user.name}`}
                    className="h-11 w-11 rounded-full ring-2 ring-primary-50"
                    alt={`${user.name}'s profile`}
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-1/2 mt-2 flex w-56 -translate-x-1/2 transform flex-col divide-y divide-primary-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
                  <div>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          className={`${
                            active && "bg-primary-200"
                          } s1 flex w-full items-center space-x-2 p-2`}
                          to="#"
                        >
                          <MdPerson />
                          <span>Profile</span>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          className={`${
                            active && "bg-primary-200"
                          } s1 flex w-full items-center space-x-2 p-2`}
                          to="/recipe/create"
                        >
                          <MdOutlineAddBox />
                          <span>Create Post</span>
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          localStorage.removeItem("refreshToken");
                          window.location.reload();
                        }}
                        className={`${
                          active && "bg-primary-200"
                        } s1 w-full p-2 text-left`}
                      >
                        Log Out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
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
