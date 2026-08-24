export type FamilyRelationship =
  | "Parent"
  | "Grandparent"
  | "Spouse"
  | "Sibling"
  | "Child"
  | "Uncle/Aunt"
  | "Cousin"
  | "Other";

export interface FamilyMember {
  id: string;

  firstName: string;

  lastName: string;

  relationship: FamilyRelationship;

  email: string;

  phone: string;

  dateOfBirth: string;

  profileImage: string;

  notes: string;

  memoryIds: string[];

  createdAt: string;

  updatedAt: string;
}
