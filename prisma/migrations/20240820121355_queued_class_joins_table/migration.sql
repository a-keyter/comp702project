-- CreateTable
CREATE TABLE "QueuedClassJoin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "classId" TEXT,
    "raisedById" TEXT NOT NULL,

    CONSTRAINT "QueuedClassJoin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QueuedClassJoin" ADD CONSTRAINT "QueuedClassJoin_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueuedClassJoin" ADD CONSTRAINT "QueuedClassJoin_raisedById_fkey" FOREIGN KEY ("raisedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
