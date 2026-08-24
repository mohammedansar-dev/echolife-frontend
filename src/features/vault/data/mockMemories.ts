import type { Memory } from "../memory.types";

export const mockMemories: Memory[] = [
  {
    id: "memory-001",
    title: "Family Trip to Goa",
    description:
      "A beautiful family trip filled with laughter, conversations, and unforgettable moments.",
    type: "photo",
    fileName: "family-goa.jpg",
    date: "2026-08-12",
    category: "Family",
    people: ["Ansar", "Father", "Mother"],
    size: "4.8 MB",
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: "memory-002",
    title: "Graduation Day",
    description:
      "A proud milestone marking the completion of an important chapter.",
    type: "photo",
    fileName: "graduation.jpg",
    date: "2025-06-04",
    category: "Milestones",
    people: ["Ansar", "Friends"],
    size: "3.6 MB",
    thumbnail:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: "memory-003",
    title: "Birthday Celebration",
    description:
      "A joyful birthday celebration surrounded by family and close friends.",
    type: "video",
    fileName: "birthday.mp4",
    date: "2026-05-21",
    category: "Celebrations",
    people: ["Ansar", "Family"],
    size: "18.2 MB",
    thumbnail:
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: "memory-004",
    title: "Childhood Memories",
    description:
      "A collection of moments from childhood that still bring back warm memories.",
    type: "photo",
    fileName: "childhood.jpg",
    date: "2012-07-18",
    category: "Childhood",
    people: ["Ansar", "Family"],
    size: "2.9 MB",
    thumbnail:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: "memory-005",
    title: "Father's Advice",
    description:
      "An important conversation and a piece of advice that stayed meaningful over the years.",
    type: "audio",
    fileName: "fathers-advice.mp3",
    date: "2026-07-02",
    category: "Family",
    people: ["Ansar", "Father"],
    size: "7.4 MB",
  },

  {
    id: "memory-006",
    title: "First College Project",
    description:
      "Documentation from an early project that became an important part of the journey.",
    type: "document",
    fileName: "college-project.pdf",
    date: "2024-11-16",
    category: "Milestones",
    people: ["Ansar"],
    size: "1.8 MB",
  },

  {
    id: "memory-007",
    title: "Evening with Friends",
    description:
      "A relaxed evening spent talking, laughing, and creating new memories.",
    type: "photo",
    fileName: "friends-evening.jpg",
    date: "2026-07-28",
    category: "Friends",
    people: ["Ansar", "Friends"],
    size: "5.1 MB",
    thumbnail:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: "memory-008",
    title: "A Letter to My Future Self",
    description:
      "A personal note written as a reminder of dreams, goals, and the person I want to become.",
    type: "document",
    fileName: "future-self.pdf",
    date: "2026-01-01",
    category: "Personal",
    people: ["Ansar"],
    size: "820 KB",
  },
];
