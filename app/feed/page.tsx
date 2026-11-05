
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import FeedInteractions from "./feed-interactions";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
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

  const profileMap = new Map(
    [...(profiles || []), ...(commentProfiles || [])].map(
      (profile) => [profile.id, profile]
    )
  );

  const feedPosts = postList.map((post) => {
    const author = profileMap.get(post.user_id);

    const postLikes = (likes || []).filter(
      (like) => like.post_id === post.id
    );

    const postComments = (comments || [])
      .filter((comment) => comment.post_id === post.id)
      .map((comment) => {
        const commenter = profileMap.get(comment.user_id);

        return {
          id: comment.id,
          content: comment.content,
          user_id: comment.user_id,
          authorName:
            commenter?.display_name ||
            commenter?.username ||
            "VYBE member",
        };
      });

    return {
      id: post.id,
      content: post.content,
      user_id: post.user_id,
      created_at: post.created_at,
      authorName:
        author?.display_name ||
        author?.username ||
        "VYBE member",
      username: author?.username || null,
      avatarUrl: author?.avatar_url || null,
      likedByMe: postLikes.some(
        (like) => like.user_id === user.id
      ),
      likeCount: postLikes.length,
      comments: postComments,
    };
  });

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

        <FeedInteractions
          initialPosts={feedPosts}
          currentUserId={user.id}
        />
      </div>
    </main>
  );
}
