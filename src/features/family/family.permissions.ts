import type { FamilyPermission, FamilyRole } from "./family.types";

const rolePermissions: Record<FamilyRole, FamilyPermission[]> = {
  admin: [
    "view_family",
    "view_memories",
    "add_memories",
    "edit_memories",
    "delete_memories",
    "manage_members",
    "manage_roles",
  ],

  member: ["view_family", "view_memories", "add_memories", "edit_memories"],

  viewer: ["view_family", "view_memories"],
};

export function hasPermission(
  role: FamilyRole,
  permission: FamilyPermission,
): boolean {
  return rolePermissions[role].includes(permission);
}

export function getRoleLabel(role: FamilyRole): string {
  switch (role) {
    case "admin":
      return "Administrator";

    case "member":
      return "Member";

    case "viewer":
      return "Viewer";

    default:
      return "Member";
  }
}

export function getRoleDescription(role: FamilyRole): string {
  switch (role) {
    case "admin":
      return "Full control over the family space, members, invitations, and permissions.";

    case "member":
      return "Can view family content and contribute memories.";

    case "viewer":
      return "Can view family content without editing or management access.";

    default:
      return "";
  }
}
