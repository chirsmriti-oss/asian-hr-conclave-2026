import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminIndex,
});

function AdminIndex() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    if (pathname === "/admin") {
      navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [navigate, pathname]);

  return <Outlet />;
}
