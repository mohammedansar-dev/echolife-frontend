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
  id?: string;

  memoryId: string;

  title: string;

  message: string;

  unlockDate: string;

  isOpened?: boolean;
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
