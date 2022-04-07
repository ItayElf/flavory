import { FormEvent, Fragment, useState } from "react";
import {
  MdSearch,
  MdOutlineExplore,
  MdOutlineAddBox,
  MdPerson,
  MdKeyboardBackspace,
} from "react-icons/md";
import { ReactComponent as Logo } from "../imgs/Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../constants";
import { Menu, Transition } from "@headlessui/react";
import User from "../interfaces/user";
import Tooltip from "./tooltip";

interface Props {
  user?: User;
  contentStyle?: string;
}

export function Header({ contentStyle, user }: Props) {
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (search) {
      navigate(`/search?query=${search}`);
    }
  };

  return (
    <div className="fixed top-0 z-10 flex h-16 w-full justify-center bg-white shadow-sm shadow-primary-200 print:hidden">
      {!isSearch ? (
        <div
          className={`flex h-full flex-row items-center justify-between px-2 ${contentStyle}`}
        >
          <Link to={"/feed"} className="h5 lg:h4 flex items-center">
            <Logo className="mr-2 h-12 w-12" />
            Flavory
          </Link>
          <form
            className="hidden items-center rounded-md bg-primary-50 sm:flex sm:w-72 sm:justify-between lg:w-96"
            onSubmit={submit}
          >
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="placeholder:h6 h6 w-full rounded-md border-none bg-inherit placeholder:text-gray focus:ring-0 focus:ring-offset-0"
            />
            <MdSearch className="mr-4 h-7 w-7 text-gray" />
          </form>
          {user ? (
            <div className="flex items-center">
              <Tooltip title="Search">
                <MdSearch
                  className="mr-6 h-7 w-7 cursor-pointer sm:hidden"
                  onClick={() => {
                    setIsSearch(true);
                    setSearch("");
                  }}
                />
              </Tooltip>
              <Tooltip title="Explore">
                <Link to={"/explore"}>
                  <MdOutlineExplore className="mr-6 h-7 w-7" />
                </Link>
              </Tooltip>
              <Tooltip title="Create Post">
                <Link to={"/recipe/post"}>
                  <MdOutlineAddBox className="mr-6 h-7 w-7 cursor-pointer" />
                </Link>
              </Tooltip>
              <ProfileMenu user={user} />
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
      ) : (
        <div className="flex w-full items-center justify-between space-x-4 p-4">
          <MdKeyboardBackspace
            className="h-7 w-7 cursor-pointer"
            onClick={() => setIsSearch(false)}
          />
          <div className="flex w-full items-center rounded-md bg-primary-50">
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="placeholder:h6 h6 w-full rounded-md border-none bg-inherit placeholder:text-gray focus:ring-0 focus:ring-offset-0"
            />
            <MdSearch className="mr-4 h-7 w-7 text-gray" />
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMenu({ user }: { user: User }) {
  return (
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
                  to={`/user/${user.name}`}
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
                  to="/recipe/post"
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
  );
}
