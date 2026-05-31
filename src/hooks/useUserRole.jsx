import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useUserRole = () => {
  const { user, loading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const {
    data: userRole = {},
    isPending: isRoleLoading,
  } = useQuery({
    queryKey: [user?.email, "userRole"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data;
    },
  });

  const isPremium = userRole?.role === "premium" || userRole?.role === "admin";
  const isAdmin = userRole?.role === "admin";

  return { isPremium, isAdmin, isRoleLoading, role: userRole?.role };
};

export default useUserRole;
