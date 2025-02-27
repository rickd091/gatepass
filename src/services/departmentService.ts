import { supabase } from "@/lib/supabase";
import { withErrorHandling } from "@/lib/utils/error-handler";

export const departmentService = {
  async assignUserToDepartment(
    userId: string,
    departmentId: string,
    role: string = "member",
  ) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("user_departments")
        .insert({
          user_id: userId,
          department_id: departmentId,
          role,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }, "Failed to assign user to department");
  },

  async getUserDepartments(userId: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("user_departments")
        .select(
          `
          *,
          departments:department_id (*)
        `,
        )
        .eq("user_id", userId);

      if (error) throw error;
      return data;
    }, "Failed to fetch user departments");
  },

  async removeUserFromDepartment(userId: string, departmentId: string) {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from("user_departments")
        .delete()
        .match({ user_id: userId, department_id: departmentId });

      if (error) throw error;
    }, "Failed to remove user from department");
  },

  async updateUserDepartmentRole(
    userId: string,
    departmentId: string,
    role: string,
  ) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from("user_departments")
        .update({ role })
        .match({ user_id: userId, department_id: departmentId })
        .select()
        .single();

      if (error) throw error;
      return data;
    }, "Failed to update user department role");
  },
};
