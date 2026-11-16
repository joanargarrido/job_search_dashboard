import { PageHeader } from "@/components/page-header";
import { JobApplicationBoard } from "@/app/board/components/job-application-board";
import { mockJobApplications } from "@/lib/data/mock-job-applications";

export default function BoardPage() {
  return (
    <div>
      <PageHeader
        title="Board"
        description="Track job applications as they move from wishlist to offer."
      />
      <JobApplicationBoard applications={mockJobApplications} />
    </div>
  );
}
