import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.event.create({
    data: {
      activity: "Cyclisme",
      date: new Date("2024-10-21"),
      time: new Date("2024-10-21T14:00:00"),
      type: "Entrainement",
      distanceOptions: ["40", "60", "80"],
      eventLinks: [
        "https://www.openrunner.com/route/1",
        "https://www.openrunner.com/route/2",
        "https://www.openrunner.com/route/3"
      ],
      description: "Entrainement Samedi 14h",
      location: "Lac de Saint Rémy",
      attendeesList: [],
      attendeesLimit: 0,
      attendees: 0,
      seance: "Échauffement : 15 minutes à un rythme modéré.\n\nCorps de séance :\n- 5 x 3 minutes à haute intensité (zone 4) avec 3 minutes de récupération active entre chaque.\n- 10 minutes à un rythme soutenu (zone 3).\n- 4 x 1 minute à très haute intensité (zone 5) avec 2 minutes de récupération complète entre chaque.\n\nRetour au calme : 10 minutes à un rythme facile (zone 1-2).\n\nÉtirements : 5-10 minutes pour détendre les muscles sollicités.", 
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });