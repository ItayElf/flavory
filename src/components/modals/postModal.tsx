import { PostPreview } from "../../interfaces/post";
import { MdOutlineComment, MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { gql, useApolloClient } from "@apollo/client";
import { FormEvent, useState } from "react";
import Comment from "../../interfaces/comment";
import { apiUrl } from "../../constants";
import { timeSince } from "../../utils/formatUtils";
import { safeMutation } from "../../utils/fetchUtils";
import ModalWrapper from "./modalWrapper";

interface Props {
  post: PostPreview | null;
  onClose: () => void;
}

const commentMutation = (token: string, postId: number, content: string) => gql`
mutation {
  comment(token: "${token}", post: ${postId}, content: "${content}") {
    comment {
      commenter
      content
      timestamp
    }
  }
}
`;

export default function PostModal({ post, onClose }: Props) {
  const [comment, setComment] = useState("");
  const map = new Map<number, Comment[]>();
  const [sentComments, setSentComments] = useState(map);
  const client = useApolloClient();

  const shownComments = [
    ...(sentComments.get(post?.idx ?? 0) ?? []),
    ...(post?.comments ?? []),
  ];

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment === "" || !post) {
      return;
    }
    const res = await safeMutation(client, commentMutation, post?.idx, comment);
    const map2 = new Map(sentComments);
    map2.set(post.idx, [
      res.data.comment.comment,
      ...(map2.get(post.idx) ?? []),
    ]);
    setSentComments(map2);
    setComment("");
  };

  return (
    <ModalWrapper
      isOpen={!!post}
      onClose={onClose}
      className="h-full w-screen sm:m-auto sm:h-2/3 sm:w-[480px]"
    >
      <div className="flex h-full flex-col">
        <div className="h5 sm:h4 flex h-16 w-full items-center bg-white pl-2">
          <MdKeyboardBackspace
            className="mr-2 h-8 w-8 cursor-pointer sm:hidden"
            onClick={onClose}
          />
          <h1>Comments</h1>
        </div>
        <div className="h-full w-full space-y-4 overflow-y-auto py-4">
          {shownComments.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <MdOutlineComment className="h-16 w-16" />
              <h2 className="h5 text-center">This post has no comments.</h2>
              <p className="h6 text-center text-gray">
                Be the first one to comment on this post!
              </p>
            </div>
          ) : (
            shownComments.map((c, i) => (
              <CommentTile c={c} post={post!} key={i} onClose={onClose} />
            ))
          )}
        </div>
        <form
          className="flex h-20 w-full justify-between space-x-2 bg-white p-2"
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
    </ModalWrapper>
  );
}

interface Props2 {
  c: Comment;
  post: PostPreview;
  onClose: () => void;
}

const CommentTile = ({ c, post, onClose }: Props2) => {
  const navigate = useNavigate();

  const gotoUser = () => {
    onClose();
    navigate(`/user/${c.commenter}`);
  };

  return (
    <>
      <div className="flex items-start space-x-4">
        <img
          src={apiUrl + `images/users/${c.commenter}`}
          className={
            "h-10 w-10 cursor-pointer rounded-full ring-2 ring-primary-50"
          }
          alt={`${c.commenter}'s profile`}
          onClick={gotoUser}
        />
        <div className="space-y-1">
          <span
            className={`s1 cursor-pointer font-semibold ${
              post.poster === c.commenter ? "text-primary-900" : "text-black"
            }`}
            onClick={gotoUser}
          >
            {post.poster === c.commenter && "⭐"}
            {c.commenter}
          </span>{" "}
          {c.content}
          <p className="caption text-gray">{timeSince(c.timestamp)}</p>
        </div>
      </div>
    </>
  );
};
