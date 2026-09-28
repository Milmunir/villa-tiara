const { PrismaClient } = require("@prisma/client");
const roomLists = require("../data/rooms.json");

const prisma = new PrismaClient();

async function main() {
  let seededRooms = 0;

  for (const [villa, rooms] of Object.entries(roomLists)) {
    for (const room of rooms) {
      await prisma.room.upsert({
        where: { code: room.kodeKamar },
        update: {},
        create: {
          code: room.kodeKamar,
          villa: villa === "VillaTiara1" ? "Villa Tiara 1" : "Villa Tiara 2",
          type: room.tipeKamar,
          bedInfo: room.jumlahBedKamar,
          pricePerNight: room.hargaKamar,
        },
      });
      seededRooms += 1;
    }
  }

  console.info(`Room seed complete (${seededRooms} inventory records checked).`);
}

main()
  .catch((error) => {
    console.error("Database seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });