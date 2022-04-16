import { gql, useApolloClient } from "@apollo/client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonPrimary } from "../components/buttonPrimary";
import { Header } from "../components/header";
import Loading from "../components/loading";
import { TextField } from "../components/textField";
import { apiUrl } from "../constants";
import useCurrentUser from "../hooks/useCurrentUser";
import { safeMutation } from "../utils/fetchUtils";
import { blobToBase64 } from "../utils/formatUtils";
import { escape } from "../utils/fetchUtils";
import CropModal from "../components/modals/cropModal";

const editUser = (
  token: string,
  name: string,
  bio: string,
  link: string,
  image: string | null
) => gql`
mutation {
    editUser(
        token: "${token}",
        name: "${name}",
        bio: "${bio}",
        ${image !== null ? 'image: "' + escape(image) + '"' : ""}
        link: "${link}"
        ) {
            success
        }
}
`;

export default function ProfileEdit() {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [link, setLink] = useState("");
  const [isCrop, setIsCrop] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));
  const currentUser = useCurrentUser(true);
  const fileInput = useRef<HTMLInputElement>(null);
  const client = useApolloClient();
  const navigate = useNavigate();

  const changeImage = async () => {
    if (fileInput.current === null) {
      return;
    } else if (
      fileInput.current.files === null ||
      fileInput.current.files.length === 0
    ) {
      setImage("");
      return;
    }
    const text = fileInput.current.files[0];
    const fileBase64 = await blobToBase64(text);
    console.log(fileBase64 + "");
    setImage(fileBase64 + "");
    setIsCrop(true);
    setInputKey(Math.random().toString(36));
  };

  const getImage = () => {
    if (image) {
      return image.split(",")[1];
    } else if (image === null) {
      return image;
    } else {
      return "";
    }
  };

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await safeMutation(
      client,
      editUser,
      name,
      bio,
      link,
      getImage()
    );
    if (!res.data.editUser.success) {
      alert("Name is already taken.");
      return;
    }
    navigate(`/user/${name}`);
  };

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setBio(currentUser.bio);
      setLink(currentUser.link);
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Loading className="h-screen" />;
  }

  return (
    <>
      <Header user={currentUser} contentStyle="w-full sm:w-[858px]" />
      <div className="mt-16 py-4">
        <div className="mx-auto w-full max-w-[640px] bg-white shadow shadow-primary-200">
          <div className="flex justify-between p-4 sm:justify-start sm:space-x-8">
            <div className="relative aspect-square h-24 w-24 sm:h-36 sm:w-36">
              <img
                src={
                  image ? image : apiUrl + `images/users/${currentUser.name}`
                }
                className="peer aspect-square h-full w-full rounded-full"
                alt={`${currentUser.name}'s profile`}
              />
              <button
                onClick={() => fileInput.current?.click()}
                className="absolute inset-0 hidden aspect-square h-full w-full items-center justify-center rounded-full bg-black/75 text-white hover:flex peer-hover:flex"
              >
                Change Image
                <input
                  type="file"
                  ref={fileInput}
                  className="hidden"
                  accept="image/*"
                  onChange={changeImage}
                  key={inputKey}
                />
              </button>
            </div>
            <form className="flex flex-col space-y-6" onSubmit={save}>
              <div className="flex space-x-8">
                <TextField
                  type="text"
                  value={name}
                  setValue={setName}
                  label="Name"
                  required
                />
                <ButtonPrimary className="h6 px-3 py-1">Save</ButtonPrimary>
              </div>
              <div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="bio"
                  className="b1 mb-2 w-full rounded border-none bg-primary-50 placeholder:text-gray focus:border-0 focus:border-b-2 focus:border-solid focus:border-primary-600 focus:ring-0 focus:ring-offset-0"
                />
                <TextField
                  type="text"
                  value={link}
                  setValue={setLink}
                  label="Link"
                  className="b1"
                  labelClassName="b1 peer-placeholder-shown:b1"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <CropModal
        isOpen={isCrop}
        onClose={(b64) => {
          setIsCrop(false);
          setImage(b64);
        }}
        imgSrc={image ?? ""}
        aspect={1 / 1}
      />
    </>
  );
}
