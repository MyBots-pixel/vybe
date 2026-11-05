
import AppSidebar from "../components/app-sidebar";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
background: "var(--background)",      }}
    >
      <AppSidebar />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          paddingBottom: "75px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
