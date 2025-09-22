import Dashboard from "@/sections/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
