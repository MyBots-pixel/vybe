import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import {
  createPost,
  toggleLike,
  addComment,
  deletePost,
} from "../actions/posts";

export const dynamic = "force-dynamic";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const postList = posts || [];
  const postIds = postList.map((post) => post.id);

  const userIds = [
    ...new Set([
      user.id,
      ...postList.map((post) => post.user_id),
    ]),
  ];

  const { data: profiles } = userIds.length
    ? await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .in("id", userIds)
    : { data: [] };

  const { data: likes } = postIds.length
    ? await supabase
        .from("post_likes")
        .select("id, post_id, user_id")
        .in("post_id", postIds)
    : { data: [] };

  const { data: comments } = postIds.length
    ? await supabase
        .from("post_comments")
        .select("*")
        .in("post_id", postIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  const commentUserIds = [
    ...new Set((comments || []).map((comment) => comment.user_id)),
  ];

  const missingProfileIds = commentUserIds.filter(
    (id) => !userIds.includes(id)
  );

  const { data: commentProfiles } = missingProfileIds.length
    ? await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .in("id", missingProfileIds)
    : { data: [] };

  const allProfiles = [
    ...(profiles || []),
    ...(commentProfiles || []),
  ];

  const profileMap = new Map(
    allProfiles.map((profile) => [profile.id, profile])
  );

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #39304F",
    background: "#090A14",
    color: "#FFFFFF",
    fontSize: "14px",
    boxSizing: "border-box" as const,
    fontFamily: "Arial, sans-serif",
  };

  const buttonStyle = {
    padding: "11px 20px",
    border: "none",
    borderRadius: "9px",
    background: "linear-gradient(90deg, #8B5CF6, #22D3EE)",
    color: "#FFFFFF",
    fontWeight: 800,
    cursor: "pointer",
  };

  function getInitial(name: string) {
    return name.charAt(0).toUpperCase() || "V";
  }

  function getAvatarStyle(url: string | null | undefined) {
    return {
      width: "43px",
      height: "43px",
      flexShrink: 0,
      borderRadius: "50%",
      background: url
        ? `url("${url}") center/cover`
        : "linear-gradient(135deg, #8B5CF6, #22D3EE)",
      border: "2px solid #8B5CF6",
    };
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#090A14",
        color: "#F4F4FF",
        fontFamily: "Arial, sans-serif",
        padding: "25px 5%",
      }}
    >
      <nav
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "22px",
          borderBottom: "1px solid #25243B",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#FFFFFF",
            fontSize: "30px",
            fontWeight: 900,
            textDecoration: "none",
          }}
        >
          VYBE<span style={{ color: "#22D3EE" }}>.</span>
        </Link>

        <div style={{ display: "flex", gap: "22px", alignItems: "center" }}>
          <Link
            href="/dashboard"
            style={{ color: "#B99BFF", textDecoration: "none" }}
          >
            Dashboard
          </Link>

          <Link
            href="/profile"
            style={{ color: "#B99BFF", textDecoration: "none" }}
          >
            My profile
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: "720px", margin: "40px auto" }}>
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>
            Your Feed<span style={{ color: "#22D3EE" }}>.</span>
          </h1>

          <p style={{ color: "#9996B5", margin: 0 }}>
            Your people. Your world.
          </p>
        </div>

        {params.error && (
          <div
            style={{
              padding: "14px",
              background: "#451D2B",
              color: "#FF9BAF",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {params.error}
          </div>
        )}

        {params.success && (
          <div
            style={{
              padding: "14px",
              background: "#12352D",
              color: "#75E6B7",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {params.success}
          </div>
        )}

        <section
          style={{
            background: "#151629",
            border: "1px solid #302B4C",
            borderRadius: "18px",
            padding: "22px",
            marginBottom: "25px",
          }}
        >
          <h2 style={{ fontSize: "19px", marginTop: 0 }}>
            What's happening?
          </h2>

          <form action={createPost}>
            <textarea
              name="content"
              placeholder="Share something with the VYBE community..."
              maxLength={2000}
              required
              rows={4}
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "15px",
              }}
            >
              <span style={{ color: "#77778E", fontSize: "12px" }}>
                Up to 2,000 characters
              </span>

              <button type="submit" style={buttonStyle}>
                PUBLISH POST
              </button>
            </div>
          </form>
        </section>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <h2 style={{ fontSize: "21px" }}>Community posts</h2>

          <span style={{ color: "#77778E", fontSize: "13px" }}>
            {postList.length} posts
          </span>
        </div>

        {postList.length === 0 && (
          <section
            style={{
              background: "#151629",
              border: "1px solid #302B4C",
              borderRadius: "18px",
              padding: "45px 25px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "42px", marginBottom: "15px" }}>
              ✨
            </div>

            <h2>It's a little quiet here...</h2>

            <p style={{ color: "#9996B5" }}>
              Be the first to share something with the VYBE community.
            </p>
          </section>
        )}

        <div style={{ display: "grid", gap: "20px" }}>
          {postList.map((post) => {
            const author = profileMap.get(post.user_id);
            const displayName =
              author?.display_name || author?.username || "VYBE member";

            const postLikes = (likes || []).filter(
              (like) => like.post_id === post.id
            );

            const likedByMe = postLikes.some(
              (like) => like.user_id === user.id
            );

            const postComments = (comments || []).filter(
              (comment) => comment.post_id === post.id
            );

            return (
              <article
                key={post.id}
                style={{
                  background: "#151629",
                  border: "1px solid #302B4C",
                  borderRadius: "18px",
                  padding: "22px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <div style={getAvatarStyle(author?.avatar_url)}>
                      {!author?.avatar_url && (
                        <div
                          style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 900,
                          }}
                        >
                          {getInitial(displayName)}
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={{ fontWeight: 800 }}>
                        {displayName}
                      </div>

                      {author?.username && (
                        <Link
                          href={`/u/${author.username}`}
                          style={{
                            color: "#22D3EE",
                            fontSize: "12px",
                            textDecoration: "none",
                          }}
                        >
                          @{author.username}
                        </Link>
                      )}
                    </div>
                  </div>

                  {post.user_id === user.id && (
                    <form action={deletePost}>
                      <input
                        type="hidden"
                        name="post_id"
                        value={post.id}
                      />

                      <button
                        type="submit"
                        style={{
                          background: "transparent",
                          border: "1px solid #493044",
                          color: "#FF9BAF",
                          borderRadius: "8px",
                          padding: "7px 11px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  )}
                </div>

                <p
                  style={{
                    color: "#E5E2F5",
                    fontSize: "15px",
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    marginTop: "22px",
                  }}
                >
                  {post.content}
                </p>

                <div
                  style={{
                    color: "#77778E",
                    fontSize: "11px",
                    marginTop: "15px",
                  }}
                >
                  {new Date(post.created_at).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>

                <div
                  style={{
                    borderTop: "1px solid #302B4C",
                    marginTop: "20px",
                    paddingTop: "15px",
                    display: "flex",
                    gap: "20px",
                    alignItems: "center",
                  }}
                >
                  <form action={toggleLike}>
                    <input
                      type="hidden"
                      name="post_id"
                      value={post.id}
                    />

                    <button
                      type="submit"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: likedByMe ? "#EC4899" : "#BDB9D3",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                    >
                      {likedByMe ? "♥ Liked" : "♡ Like"} ·{" "}
                      {postLikes.length}
                    </button>
                  </form>

                  <span style={{ color: "#BDB9D3", fontSize: "14px" }}>
                    ◉ {postComments.length} comments
                  </span>
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  {postComments.map((comment) => {
                    const commenter = profileMap.get(comment.user_id);
                    const commenterName =
                      commenter?.display_name ||
                      commenter?.username ||
                      "VYBE member";

                    return (
                      <div
                        key={comment.id}
                        style={{
                          padding: "12px",
                          background: "#090A14",
                          borderRadius: "10px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 800,
                            color: "#22D3EE",
                            marginBottom: "6px",
                          }}
                        >
                          {commenterName}
                        </div>

                        <div
                          style={{
                            fontSize: "13px",
                            color: "#D0CDE2",
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {comment.content}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form
                  action={addComment}
                  style={{
                    display: "flex",
                    gap: "9px",
                    marginTop: "17px",
                  }}
                >
                  <input
                    type="hidden"
                    name="post_id"
                    value={post.id}
                  />

                  <input
                    name="content"
                    placeholder="Write a comment..."
                    maxLength={1000}
                    required
                    style={{
                      ...inputStyle,
                      padding: "11px",
                    }}
                  />

                  <button type="submit" style={buttonStyle}>
                    Send
                  </button>
                </form>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
