import { supabase } from "@/lib/supabase";
import { withErrorHandling } from "@/lib/utils/error-handler";

export const userService = {
  async getUserDepartment(userId: string) {
    return withErrorHandling(async () => {
      // First check if user is a department head
      const { data: headDept, error: headError } = await supabase
        .from("departments")
        .select("*")
        .eq("head_id", userId)
        .single();

      if (headError && headError.code !== "PGRST116") throw headError;
      if (headDept) return { ...headDept, role: "head" };

      // If not a head, check user_departments
      const { data: userDept, error: userError } = await supabase
        .from("user_departments")
        .select(
          `
          *,
          departments:department_id (*)
        `,
        )
        .eq("user_id", userId)
        .single();

      if (userError && userError.code !== "PGRST116") throw userError;
      if (!userDept) return null;

      return {
        ...userDept.departments,
        role: userDept.role,
      };
    }, "Failed to fetch user department");
  },
};
