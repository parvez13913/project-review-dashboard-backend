import { SubmissionStatus } from "../../../generated/prisma/enums";
import prisma from "../../../lib/prisma";

const getAllSubmissions = async (query: {
  page?: number;
  limit?: number;
  status?: SubmissionStatus;
}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (query.status) {
    where.status = query.status;
  }

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      skip,
      take: limit,
      include: {
        student: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.submission.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: submissions,
  };
};

const reviewSubmission = async (
  submissionId: string,
  status: SubmissionStatus,
  reviewNote?: string,
) => {
  return await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status,
      reviewNote,
      reviewedAt: new Date(),
    },
  });
};

const getSubmissionStats = async () => {
  const [totalPending, totalApproved, totalRejected, total] = await Promise.all(
    [
      prisma.submission.count({ where: { status: SubmissionStatus.PENDING } }),
      prisma.submission.count({ where: { status: SubmissionStatus.APPROVED } }),
      prisma.submission.count({ where: { status: SubmissionStatus.REJECTED } }),
      prisma.submission.count(),
    ],
  );

  return {
    total,
    totalPending,
    totalApproved,
    totalRejected,
  };
};

export const ReviewService = {
  getAllSubmissions,
  reviewSubmission,
  getSubmissionStats,
};
