import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const roleOptions = ["user", "premium", "admin"];

const roleBadge = {
  admin: "badge bg-error/15 text-error border-0 font-semibold text-xs",
  premium: "badge bg-amber-500/15 text-amber-600 border-0 font-semibold text-xs",
  user: "badge bg-base-content/5 border-0 font-medium text-xs text-base-content/50",
};

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [roleTarget, setRoleTarget] = useState(null);
  const [newRole, setNewRole] = useState("");

  /* ── Fetch all users ── */
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users");
      return res.data;
    },
  });

  /* ── Role update mutation ── */
  const roleMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      return axiosSecure.patch(`/admin/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setRoleTarget(null);
      setNewRole("");
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });

  const openRoleModal = (user) => {
    setRoleTarget(user);
    setNewRole(user.role || "user");
  };

  const confirmRoleUpdate = () => {
    if (roleTarget && newRole) {
      roleMutation.mutate({ userId: roleTarget._id, role: newRole });
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge bg-error/15 text-error border-0 font-bold text-xs">ADMIN</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
          Manage{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Users
          </span>
        </h1>
        <p className="text-sm text-base-content/50">
          View all registered users and update their roles.
        </p>
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-base-200/50 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* ── Empty ── */}
      {!isLoading && users.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-base-content/10 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/15 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-bold mb-1">No users found</h3>
        </div>
      )}

      {/* ── Table ── */}
      {!isLoading && users.length > 0 && (
        <div className="overflow-x-auto border border-base-content/5 rounded-2xl bg-base-100">
          <table className="table table-zebra">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-base-content/40">
                <th className="w-12">#</th>
                <th>User</th>
                <th className="hidden sm:table-cell">Email</th>
                <th>Role</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u._id} className="hover">
                  <td className="text-base-content/40 text-sm">{idx + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
                        {u.photo ? (
                          <img src={u.photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {u.name?.charAt(0) || u.email?.charAt(0) || "U"}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-sm truncate max-w-[150px]">
                        {u.name || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell text-sm text-base-content/50 truncate max-w-[200px]">
                    {u.email}
                  </td>
                  <td>
                    <span className={roleBadge[u.role] || roleBadge.user}>
                      {u.role || "user"}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => openRoleModal(u)}
                      className="btn btn-ghost btn-xs rounded-lg hover:bg-primary/10 hover:text-primary transition-all gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Change Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Role Update Modal ── */}
      {roleTarget && (
        <dialog className="modal modal-open">
          <div className="modal-box rounded-2xl max-w-sm">
            <h3 className="font-bold text-lg mb-1">Update User Role</h3>
            <p className="text-sm text-base-content/50 mb-5">
              Change the role for{" "}
              <span className="font-semibold text-base-content/80">{roleTarget.name || roleTarget.email}</span>
            </p>

            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="select select-bordered w-full mb-6 focus:border-primary"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setRoleTarget(null)} className="btn btn-ghost rounded-xl font-medium">
                Cancel
              </button>
              <button
                onClick={confirmRoleUpdate}
                disabled={roleMutation.isPending || newRole === (roleTarget.role || "user")}
                className="btn btn-primary rounded-xl font-medium"
              >
                {roleMutation.isPending ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Update Role"
                )}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setRoleTarget(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default ManageUsers;
