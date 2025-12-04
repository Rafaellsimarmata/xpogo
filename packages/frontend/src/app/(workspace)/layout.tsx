import WorkspaceNav from "@/src/components/layout/WorkspaceNav";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <WorkspaceNav />
    <main>{children}</main>
  </div>
);

export default WorkspaceLayout;
