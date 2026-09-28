import { z } from "zod";
import prisma from "@/lib/prisma";
import { AdminDataError } from "@/lib/admin-api";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const reservationInputSchema = z.object({
  idKamar: z.string().trim().min(1).max(32),
  namaTamu: z.string().trim().min(2).max(160),
  noTelepon: z.string().trim().min(5).max(40),
  tanggalCheckIn: z.string().regex(datePattern),
  tanggalCheckOut: z.string().regex(datePattern),
});

export const roomUpdateSchema = z.object({
  tipeKamar: z.string().trim().min(2).max(64),
  jumlahBedKamar: z.string().trim().min(1).max(120),
  hargaKamar: z.coerce.number().int().nonnegative().max(100000000),
});

export const guestInputSchema = z.object({
  namaLengkap: z.string().trim().min(2).max(160),
  noHp: z.string().trim().min(5).max(40),
  keperluan: z.string().trim().min(2).max(255),
});

export function parseDate(value) {
  if (!datePattern.test(value)) throw new AdminDataError("Use a valid YYYY-MM-DD date.");
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new AdminDataError("Use a valid calendar date.");
  }
  return date;
}

function dateOnly(value) {
  return value.toISOString().slice(0, 10);
}

function propertyDate(value) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function legacyStatus(status) {
  return {
    BOOKED: "booking",
    CHECKED_IN: "checkin",
    CHECKED_OUT: "checkout",
    CANCELLED: "cancelled",
  }[status];
}

export function serializeReservation(reservation) {
  return {
    id: reservation.id,
    idKamar: reservation.room.code,
    tipeKamar: reservation.room.type,
    statusKamar: reservation.status === "CHECKED_IN" ? "checked" : "booked",
    namaTamu: reservation.guestName,
    noTelepon: reservation.guestPhone,
    tanggalCheckIn: dateOnly(reservation.checkIn),
    tanggalCheckOut: dateOnly(reservation.checkOut),
    harga: reservation.totalPrice,
    statusBooking: legacyStatus(reservation.status),
    status: reservation.status,
    room: {
      code: reservation.room.code,
      villa: reservation.room.villa,
      type: reservation.room.type,
      pricePerNight: reservation.room.pricePerNight,
    },
    createdAt: reservation.createdAt,
  };
}

export async function listRooms(dateValue = propertyDate(new Date())) {
  const date = parseDate(dateValue);
  const [rooms, reservations] = await Promise.all([
    prisma.room.findMany({ where: { isActive: true }, orderBy: [{ villa: "asc" }, { code: "asc" }] }),
    prisma.reservation.findMany({
      where: {
        status: { in: ["BOOKED", "CHECKED_IN"] },
        checkIn: { lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
        checkOut: { gt: date },
      },
      select: { roomId: true, status: true },
    }),
  ]);

  const byRoom = new Map(reservations.map((item) => [item.roomId, item.status]));
  const grouped = { VillaTiara1: [], VillaTiara2: [] };
  for (const room of rooms) {
    const status = byRoom.get(room.id) === "CHECKED_IN" ? "checked" : byRoom.has(room.id) ? "booked" : "kosong";
    const villaKey = room.villa.replaceAll(" ", "");
    if (!grouped[villaKey]) grouped[villaKey] = [];
    grouped[villaKey].push({
      kodeKamar: room.code,
      tipeKamar: room.type,
      jumlahBedKamar: room.bedInfo,
      hargaKamar: room.pricePerNight,
      status,
      statusKamar: status,
    });
  }
  return grouped;
}

export async function saveRoom(code, input) {
  const values = roomUpdateSchema.parse(input);
  const room = await prisma.room.update({
    where: { code },
    data: {
      type: values.tipeKamar,
      bedInfo: values.jumlahBedKamar,
      pricePerNight: values.hargaKamar,
    },
  });
  return room;
}

function reservationDates(input) {
  const checkIn = parseDate(input.tanggalCheckIn);
  const checkOut = parseDate(input.tanggalCheckOut);
  const nights = Math.round((checkOut - checkIn) / 86400000);
  if (nights < 1) throw new AdminDataError("Check-out must be at least one night after check-in.");
  return { checkIn, checkOut, nights };
}

async function lockRoom(transaction, roomId) {
  await transaction.$queryRaw`SELECT id FROM Room WHERE id = ${roomId} FOR UPDATE`;
}

async function ensureRoomAvailable(transaction, roomId, checkIn, checkOut, excludeId) {
  const room = await transaction.room.findUnique({ where: { id: roomId } });
  if (!room || !room.isActive) throw new AdminDataError("The selected room is unavailable.", 404);
  await lockRoom(transaction, roomId);

  const overlap = await transaction.reservation.findFirst({
    where: {
      roomId,
      status: { in: ["BOOKED", "CHECKED_IN"] },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });
  if (overlap) throw new AdminDataError("The room is already reserved for part of those dates.", 409);
  return room;
}

export async function createReservation(input, userId) {
  const values = reservationInputSchema.parse(input);
  const { checkIn, checkOut, nights } = reservationDates(values);

  return prisma.$transaction(async (transaction) => {
    const room = await transaction.room.findUnique({ where: { code: values.idKamar } });
    if (!room) throw new AdminDataError("The selected room does not exist.", 404);
    const lockedRoom = await ensureRoomAvailable(transaction, room.id, checkIn, checkOut);
    return transaction.reservation.create({
      data: {
        roomId: lockedRoom.id,
        guestName: values.namaTamu,
        guestPhone: values.noTelepon,
        checkIn,
        checkOut,
        nightlyRate: lockedRoom.pricePerNight,
        totalPrice: lockedRoom.pricePerNight * nights,
        createdById: userId,
      },
      include: { room: true },
    });
  }, { isolationLevel: "Serializable" });
}

export async function updateReservation(id, input) {
  const values = reservationInputSchema.parse(input);
  const { checkIn, checkOut, nights } = reservationDates(values);

  return prisma.$transaction(async (transaction) => {
    const existing = await transaction.reservation.findUnique({ where: { id } });
    if (!existing || existing.status !== "BOOKED") {
      throw new AdminDataError("Only active bookings can be edited.", 404);
    }
    const room = await transaction.room.findUnique({ where: { code: values.idKamar } });
    if (!room) throw new AdminDataError("The selected room does not exist.", 404);
    await ensureRoomAvailable(transaction, room.id, checkIn, checkOut, id);

    return transaction.reservation.update({
      where: { id },
      data: {
        roomId: room.id,
        guestName: values.namaTamu,
        guestPhone: values.noTelepon,
        checkIn,
        checkOut,
        nightlyRate: room.pricePerNight,
        totalPrice: room.pricePerNight * nights,
      },
      include: { room: true },
    });
  }, { isolationLevel: "Serializable" });
}

export async function transitionReservation(id, nextStatus, userId) {
  return prisma.$transaction(async (transaction) => {
    const reservation = await transaction.reservation.findUnique({
      where: { id },
      include: { room: true },
    });
    if (!reservation) throw new AdminDataError("Reservation not found.", 404);

    if (nextStatus === "CHECKED_IN") {
      if (reservation.status !== "BOOKED") throw new AdminDataError("This booking is not awaiting check-in.", 409);
      const today = propertyDate(new Date());
      if (dateOnly(reservation.checkIn) > today || dateOnly(reservation.checkOut) <= today) {
        throw new AdminDataError("Check-in is only available during the reserved stay dates.", 409);
      }
      await lockRoom(transaction, reservation.roomId);
      const updated = await transaction.reservation.update({
        where: { id },
        data: { status: nextStatus, checkInAt: new Date() },
        include: { room: true },
      });
      await transaction.guestLog.create({
        data: {
          reservationId: id,
          createdById: userId,
          fullName: reservation.guestName,
          phone: reservation.guestPhone,
          purpose: "Check-in",
        },
      });
      return updated;
    }

    if (nextStatus === "CHECKED_OUT") {
      if (reservation.status !== "CHECKED_IN") throw new AdminDataError("Only checked-in guests can check out.", 409);
      return transaction.reservation.update({
        where: { id },
        data: { status: nextStatus, checkOutAt: new Date() },
        include: { room: true },
      });
    }

    if (nextStatus === "CANCELLED") {
      if (reservation.status !== "BOOKED") throw new AdminDataError("Only active bookings can be cancelled.", 409);
      return transaction.reservation.update({
        where: { id },
        data: { status: nextStatus },
        include: { room: true },
      });
    }

    throw new AdminDataError("Unsupported reservation transition.");
  }, { isolationLevel: "Serializable" });
}

export async function createGuestLog(input, userId) {
  const values = guestInputSchema.parse(input);
  return prisma.guestLog.create({
    data: {
      createdById: userId,
      fullName: values.namaLengkap,
      phone: values.noHp,
      purpose: values.keperluan,
    },
  });
}

export function serializeGuest(guest) {
  return {
    id: guest.id,
    namaLengkap: guest.fullName,
    noHp: guest.phone,
    keperluan: guest.purpose,
    tanggalWaktu: guest.visitedAt.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
    timestamp: guest.visitedAt,
  };
}

export async function getDashboardData(dateValue = propertyDate(new Date())) {
  const date = parseDate(dateValue);
  const nextDate = new Date(date.getTime() + 86400000);
  const localDayStart = new Date(`${dateOnly(date)}T00:00:00+07:00`);
  const localNextDayStart = new Date(localDayStart.getTime() + 86400000);
  const [rooms, occupied, guests, revenue, recentReservations] = await Promise.all([
    prisma.room.count({ where: { isActive: true } }),
    prisma.reservation.count({
      where: {
        status: { in: ["BOOKED", "CHECKED_IN"] },
        checkIn: { lt: nextDate },
        checkOut: { gt: date },
      },
    }),
    prisma.guestLog.count({
      where: { visitedAt: { gte: localDayStart, lt: localNextDayStart } },
    }),
    prisma.reservation.aggregate({
      where: { status: "CHECKED_OUT" },
      _sum: { totalPrice: true },
    }),
    prisma.reservation.findMany({
      where: { status: { not: "CANCELLED" } },
      include: { room: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    totalRooms: rooms,
    occupiedRooms: occupied,
    availableRooms: Math.max(0, rooms - occupied),
    guestCount: guests,
    totalRevenue: revenue._sum.totalPrice || 0,
    recentReservations: recentReservations.map(serializeReservation),
  };
}