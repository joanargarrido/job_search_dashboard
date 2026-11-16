import {
  JobApplication,
  JobApplicationStatus,
} from "@/app/board/components/types";
import {
  type Dispatch,
  type DragEvent,
  type SetStateAction,
  useState,
} from "react";

type BoardApplicationEntry = {
  id: number;
  application: JobApplication;
};

type UseApplicationBoardProps = {
  boardApplications: BoardApplicationEntry[];
  setBoardApplications: Dispatch<SetStateAction<BoardApplicationEntry[]>>;
  setIsNewJobModalOpen: (value: boolean) => void;
};

export function useApplicationBoard({
  boardApplications,
  setBoardApplications,
  setIsNewJobModalOpen,
}: UseApplicationBoardProps) {
  const [draggedApplicationId, setDraggedApplicationId] = useState<number | null>(
    null,
  );
  const [dropTargetStatus, setDropTargetStatus] =
    useState<JobApplicationStatus | null>(null);
  const [announcement, setAnnouncement] = useState("");

  function addApplication(application: JobApplication) {
    setBoardApplications((current) => [
      ...current,
      {
        id: Math.max(-1, ...current.map((item) => item.id)) + 1,
        application,
      },
    ]);
    setAnnouncement(
      `${application.companyName} added to ${application.status}.`,
    );
    setIsNewJobModalOpen(false);
  }

  function moveApplication(id: number, status: JobApplicationStatus) {
    const entry = boardApplications.find((item) => item.id === id);
    if (!entry || entry.application.status === status) {
      return;
    }

    setBoardApplications((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, application: { ...item.application, status } }
          : item,
      ),
    );
    setAnnouncement(
      `${entry.application.companyName} moved to ${status}.`,
    );
  }

  function handleDrop(
    event: DragEvent<HTMLElement>,
    status: JobApplicationStatus,
  ) {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text/plain");
    if (draggedId) {
      const id = Number(draggedId);
      if (Number.isInteger(id)) {
        moveApplication(id, status);
      }
    }
    setDraggedApplicationId(null);
    setDropTargetStatus(null);
  }

  return {
    draggedApplicationId,
    setDraggedApplicationId,
    dropTargetStatus,
    setDropTargetStatus,
    announcement,
    handleDrop,
    addApplication,
    moveApplication,
  };
}
