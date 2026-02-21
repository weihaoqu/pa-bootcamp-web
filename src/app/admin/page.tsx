import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard | PA Bootcamp",
};

export default function AdminPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        Instructor Dashboard
      </h1>
      <AdminDashboard />
    </div>
  );
}
