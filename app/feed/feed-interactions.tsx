
"use client";

import { useOptimistic, useState, useTransition } from "react";
import {
  addComment,
  createPost,
  deletePost,
  toggleLike,
} from "../actions/posts";

type FeedPost = {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  authorName: string;
  username: string | null;
  avatarUrl: string | null;
  likedByMe: boolean;
  likeCount: number;
  comments: {
    id: string;
    content: string;
    user_id: string;
    authorName: string;
  }[];
};

export default function FeedInteractions({
  initialPosts,
  currentUserId,
}: {
  initialPosts: FeedPost[];
  currentUserId: string;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [content, setContent] = useState("");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(
    posts,
    (
      current: FeedPost[],
      update:
        | { type: "like"; id: string }
        | { type: "delete"; id: string }
        | { type: "comment"; id: string; comment: FeedPost["comments"][number] }
    ) => {
      if (update.type === "like") {
        return current.map((post) =>
          post.id === update.id
            ? {
                ...post,
                likedByMe: !post.likedByMe,
                likeCount: post.likeCount + (post.likedByMe ? -1 : 1),
              }
            : post
        );
      }

      if (update.type === "delete") {
        return current.filter((post) => post.id !== update.id);
      }

      return current.map((post) =>
        post.id === update.id
          ? { ...post, comments: [...post.comments, update.comment] }
          : post
      );
    }
  );

  function likePost(postId: string) {
    startTransition(async () => {
      updateOptimisticPosts({ type: "like", id: postId });

      const formData = new FormData();
      formData.set("post_id", postId);

      const result = await toggleLike(formData);

      if (!result.success) {
        setMessage(result.error || "Couldn't update like.");
        setPosts(initialPosts);
      } else {
        setPosts((current) =>
          current.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likedByMe: result.liked ?? false,
                  likeCount:
                    post.likeCount + (result.liked ? 1 : -1),
                }
              : post
          )
        );
      }
    });
  }

  function removePost(postId: string) {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    startTransition(async () => {
      updateOptimisticPosts({ type: "delete", id: postId });

      const formData = new FormData();
      formData.set("post_id", postId);

      const result = await deletePost(formData);

      if (!result.success) {
        setMessage(result.error || "Couldn't delete post.");
        setPosts(initialPosts);
      } else {
        setPosts((current) => current.filter((post) => post.id !== postId));
      }
    });
  }

  function sendComment(postId: string) {
    const commentText = (commentInputs[postId] || "").trim();
    if (!commentText) return;

    const temporaryComment = {
      id: `temporary-${Date.now()}`,
      content: commentText,
      user_id: currentUserId,
      authorName: "You",
    };

    startTransition(async () => {
      updateOptimisticPosts({
        type: "comment",
        id: postId,
        comment: temporaryComment,
      });

      const formData = new FormData();
      formData.set("post_id", postId);
      formData.set("content", commentText);

      const result = await addComment(formData);

      if (!result.success) {
        setMessage(result.error || "Couldn't add comment.");
        setPosts(initialPosts);
      } else {
        setPosts((current) =>
          current.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    {
                      id: result.comment.id,
                      content: result.comment.content,
                      user_id: currentUserId,
                      authorName: "You",
                    },
                  ],
                }
              : post
          )
        );
        setCommentInputs((current) => ({ ...current, [postId]: "" }));
      }
    });
  }

  function publishPost() {
    const postContent = content.trim();
    if (!postContent) return;

    startTransition(async () => {
      setMessage("Publishing...");

      const formData = new FormData();
      formData.set("content", postContent);

      const result = await createPost(formData);

      if (!result.success) {
        setMessage(result.error || "Couldn't publish post.");
        return;
      }

      setPosts((current) => [
        {
          id: result.post.id,
          content: result.post.content,
          user_id: currentUserId,
          created_at: result.post.created_at,
          authorName: "You",
          username: null,
          avatarUrl: null,
          likedByMe: false,
          likeCount: 0,
          comments: [],
        },
        ...current,
      ]);

      setContent("");
      setMessage("Post published!");
    });
  }

  const inputStyle = {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #39304F",
    background: "#090A14",
    color: "#FFFFFF",
    fontSize: "14px",
    boxSizing: "border-box" as const,
    fontFamily: "Arial, sans-serif",
  };

  const buttonStyle = {
    padding: "11px 18px",
    border: "none",
    borderRadius: "9px",
    background: "linear-gradient(90deg, #8B5CF6, #22D3EE)",
    color: "#FFFFFF",
    fontWeight: 800,
    cursor: "pointer",
  };

  return (
    <div>
      <section style={{ background: "#151629", border: "1px solid #302B4C", borderRadius: "18px", padding: "22px", marginBottom: "25px" }}>
        <h2 style={{ fontSize: "19px", marginTop: 0 }}>What's happening?</h2>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Share something with the VYBE community..."
          maxLength={2000}
          rows={4}
          style={{ ...inputStyle, resize: "vertical" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
          <span style={{ color: "#77778E", fontSize: "12px" }}>{content.length}/2000</span>
          <button type="button" disabled={pending || !content.trim()} onClick={publishPost} style={{ ...buttonStyle, opacity: pending || !content.trim() ? 0.6 : 1 }}>
            {pending ? "PLEASE WAIT..." : "PUBLISH POST"}
          </button>
        </div>
        {message && <p style={{ color: "#22D3EE", fontSize: "13px" }}>{message}</p>}
      </section>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
        <h2 style={{ fontSize: "21px" }}>Community posts</h2>
        <span style={{ color: "#77778E", fontSize: "13px" }}>{optimisticPosts.length} posts</span>
      </div>

      {optimisticPosts.length === 0 && (
        <section style={{ background: "#151629", border: "1px solid #302B4C", borderRadius: "18px", padding: "45px 25px", textAlign: "center" }}>
          <div style={{ fontSize: "42px" }}>✨</div>
          <h2>It's a little quiet here...</h2>
          <p style={{ color: "#9996B5" }}>Be the first to share something with the VYBE community.</p>
        </section>
      )}

      <div style={{ display: "grid", gap: "20px" }}>
        {optimisticPosts.map((post) => (
          <article key={post.id} style={{ background: "#151629", border: "1px solid #302B4C", borderRadius: "18px", padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ width: "43px", height: "43px", flexShrink: 0, borderRadius: "50%", background: post.avatarUrl ? `url("${post.avatarUrl}") center/cover` : "linear-gradient(135deg, #8B5CF6, #22D3EE)", border: "2px solid #8B5CF6" }} />
                <div>
                  <div style={{ fontWeight: 800 }}>{post.authorName}</div>
                  {post.username && <a href={`/u/${post.username}`} style={{ color: "#22D3EE", fontSize: "12px", textDecoration: "none" }}>@{post.username}</a>}
                </div>
              </div>
              {post.user_id === currentUserId && (
                <button type="button" onClick={() => removePost(post.id)} disabled={pending} style={{ background: "transparent", border: "1px solid #493044", color: "#FF9BAF", borderRadius: "8px", padding: "7px 11px", cursor: "pointer" }}>Delete</button>
              )}
            </div>

            <p style={{ color: "#E5E2F5", fontSize: "15px", lineHeight: 1.7, whiteSpace: "pre-wrap", overflowWrap: "anywhere", marginTop: "22px" }}>{post.content}</p>

            <div style={{ color: "#77778E", fontSize: "11px", marginTop: "15px" }}>
              {new Date(post.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
            </div>

            <div style={{ borderTop: "1px solid #302B4C", marginTop: "20px", paddingTop: "15px", display: "flex", gap: "20px", alignItems: "center" }}>
              <button type="button" onClick={() => likePost(post.id)} disabled={pending} style={{ background: "transparent", border: "none", color: post.likedByMe ? "#EC4899" : "#BDB9D3", cursor: "pointer", fontSize: "14px", fontWeight: 700 }}>
                {post.likedByMe ? "♥ Liked" : "♡ Like"} · {post.likeCount}
              </button>
              <span style={{ color: "#BDB9D3", fontSize: "14px" }}>◉ {post.comments.length} comments</span>
            </div>

            <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
              {post.comments.map((comment) => (
                <div key={comment.id} style={{ padding: "12px", background: "#090A14", borderRadius: "10px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#22D3EE", marginBottom: "6px" }}>{comment.authorName}</div>
                  <div style={{ fontSize: "13px", color: "#D0CDE2", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{comment.content}</div>
                </div>
              ))}
            </div>

            <form onSubmit={(event) => { event.preventDefault(); sendComment(post.id); }} style={{ display: "flex", gap: "9px", marginTop: "17px" }}>
              <input
                value={commentInputs[post.id] || ""}
                onChange={(event) => setCommentInputs((current) => ({ ...current, [post.id]: event.target.value }))}
                placeholder="Write a comment..."
                maxLength={1000}
                style={{ ...inputStyle, padding: "11px" }}
              />
              <button type="submit" disabled={pending || !(commentInputs[post.id] || "").trim()} style={{ ...buttonStyle, opacity: pending ? 0.6 : 1 }}>Send</button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
