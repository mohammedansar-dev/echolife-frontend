/* =========================================================
   TIME CAPSULE TYPES
   EchoLife
========================================================= */

/* =========================================================
   TIME CAPSULE
========================================================= */

export interface TimeCapsule {
  id: string;

  memoryId: string;

  title: string;

  message: string;

  unlockDate: string;

  createdAt: string;

  updatedAt: string;

  isOpened: boolean;
}

/* =========================================================
   CREATE
========================================================= */

export interface CreateTimeCapsuleInput {
  /*
   * Optional because the frontend can generate
   * an ID when creating a capsule.
   */
  id?: string;

  memoryId: string;

  title: string;

  message: string;

  unlockDate: string;
}

/* =========================================================
   UPDATE
========================================================= */

export interface UpdateTimeCapsuleInput {
  id: string;

  memoryId: string;

  title: string;

  message: string;

  unlockDate: string;
}
