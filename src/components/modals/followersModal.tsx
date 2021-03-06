import { gql, useApolloClient } from "@apollo/client";
import { useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../constants";
import User from "../../interfaces/user";
import { safeMutation } from "../../utils/fetchUtils";
import { ButtonPrimary } from "../buttonPrimary";
import { ButtonSecondary } from "../buttonSecondary";
import ModalWrapper from "./modalWrapper";

interface Props {
  currentUser: User;
  followers: string[];
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function FollowersModal({
  currentUser,
  followers,
  isOpen,
  onClose,
  title,
}: Props) {
  const [userFollows, setUserFollows] = useState([...currentUser.following]);
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      wrapperClassName="justify-start items-baseline"
      className="h-full w-screen sm:mx-auto sm:h-auto sm:max-h-[70vh] sm:max-w-[480px]"
    >
      <div className="w-full p-4">
        <div className="flex">
          <MdKeyboardBackspace
            className="h-10 w-10 sm:hidden"
            onClick={() => onClose()}
          />
          <h1 className="h4 sm:h3 w-full text-center underline decoration-primary-600">
            {title}
          </h1>

          <div className="h-10 w-10 sm:hidden" />
        </div>
        <div className="mt-8 flex flex-col space-y-4">
          {followers.map((n, i) => (
            <FollowTile
              key={i}
              onClose={onClose}
              name={n}
              following={
                n === currentUser.name ? undefined : userFollows.includes(n)
              }
              onFollow={(val) => {
                if (val) {
                  setUserFollows([...userFollows, n]);
                } else {
                  setUserFollows(userFollows.filter((name) => name !== n));
                }
              }}
            />
          ))}
        </div>
      </div>
    </ModalWrapper>
  );
}

interface Props2 {
  onClose: () => void;
  name: string;
  following?: boolean;
  onFollow: (val: boolean) => void;
}

const follow = (token: string, name: string, follow: boolean) => gql`
  mutation {
    ${follow ? "follow" : "unfollow"}(name: "${name}", token: "${token}") {
      success
    }
  }
  `;

const FollowTile = ({ onClose, name, following, onFollow }: Props2) => {
  const [isFollow, setIsFollow] = useState(following);
  const navigate = useNavigate();
  const client = useApolloClient();

  const gotoUser = () => {
    onClose();
    navigate(`/user/${name}`);
  };

  const onClick = async () => {
    await safeMutation(client, follow, name, !isFollow);
    setIsFollow(!isFollow);
    onFollow(!isFollow);
  };

  return (
    <div className="flex justify-between">
      <div className="flex items-center space-x-4">
        <img
          src={apiUrl + `images/users/${name}`}
          className={
            "h-12 w-12 cursor-pointer rounded-full ring-2 ring-primary-50"
          }
          alt={`${name}'s profile`}
          onClick={gotoUser}
        />
        <div className="space-y-1">
          <span className={`h5 cursor-pointer`} onClick={gotoUser}>
            {name}
          </span>{" "}
        </div>
      </div>
      {isFollow ? (
        <ButtonSecondary className="h6 px-3 py-1" onClick={onClick}>
          Following
        </ButtonSecondary>
      ) : isFollow === undefined ? (
        <></>
      ) : (
        <ButtonPrimary className="h6 px-3 py-1" onClick={onClick}>
          Follow
        </ButtonPrimary>
      )}
    </div>
  );
};
