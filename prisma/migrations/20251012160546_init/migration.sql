-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "distanceOptions" TEXT[],
    "eventLinks" TEXT[],
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "attendeesList" TEXT[],
    "attendeesLimit" INTEGER NOT NULL,
    "attendees" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
