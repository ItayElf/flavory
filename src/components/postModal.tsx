import { PostPreview } from "../interfaces/post";
import { Dialog, Transition } from "@headlessui/react";
import User from "../interfaces/user";
import { MdOutlineComment, MdKeyboardBackspace } from "react-icons/md";
import { FormEvent, useState } from "react";
import Comment from "../interfaces/comment";
import { apiUrl } from "../constants";
import { timeSince } from "../utils/formatUtils";

interface Props {
  post: PostPreview | null;
  user: User;
  onClose: () => void;
}

export default function PostModal({ post, onClose, user }: Props) {
  const [comment, setComment] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment === "") {
      return;
    }
    setComment("");
  };

  return (
    <Transition
      show={!!post}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog
        as="div"
        open={!!post}
        onClose={onClose}
        className="fixed inset-0 h-full w-full overflow-y-auto sm:m-4"
      >
        <Dialog.Overlay
          className="fixed inset-0 bg-black/75"
          onClick={onClose}
        />

        <div className="relative h-full w-screen overflow-hidden rounded border-2 border-primary-600 bg-white sm:m-auto sm:h-2/3 sm:w-[480px]">
          <div className="flex h-full flex-col">
            <div className="h5 sm:h4 flex h-16 w-full items-center bg-white pl-2 shadow shadow-primary-50">
              <MdKeyboardBackspace
                className="mr-2 h-8 w-8 cursor-pointer sm:hidden"
                onClick={onClose}
              />
              <h1>Comments</h1>
            </div>
            <div className="h-full w-full space-y-4 overflow-y-auto bg-[#fafafa] p-4">
              {post?.comments.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <MdOutlineComment className="h-16 w-16" />
                  <h2 className="h5 text-center">This post has no comments.</h2>
                  <p className="h6 text-gray">
                    Be the first one to comment on this post!
                  </p>
                </div>
              ) : (
                post?.comments.map((c, i) => <CommentTile c={c} key={i} />)
              )}
            </div>
            <form
              className="flex h-20 w-full justify-between space-x-2 bg-white py-2 px-4"
              onSubmit={submit}
            >
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="h6 w-full rounded border-none bg-primary-200 placeholder:text-gray focus:ring-0 focus:ring-offset-0"
                placeholder="Comment"
              />
              <button className="h6 text-primary-900">Post</button>
            </form>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

const CommentTile = ({ c }: { c: Comment }) => {
  return (
    <>
      <div className="flex items-start space-x-4">
        <img
          src={apiUrl + `images/users/${c.commenter}`}
          className={"h-10 w-10 rounded-full ring-2 ring-primary-50"}
          alt={`${c.commenter}'s profile`}
        />
        <div className="space-y-1">
          <span className="s1 font-semibold">{c.commenter}</span> {c.content}
          <p className="caption text-gray">{timeSince(c.timestamp)} ago</p>
        </div>
      </div>
    </>
  );
};
