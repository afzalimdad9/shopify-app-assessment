import prisma from "../db.server";

export async function getTicket(id) {
    const ticket = await prisma.ticket.findFirst({ where: { id } });

    if (!ticket) {
        return null;
    }

    return ticket;
}

export async function getTickets(shop) {
    const tickets = await prisma.ticket.findMany({
        where: { shop },
        orderBy: { id: "desc" },
    });

    if (tickets?.length === 0) return [];

    return tickets;
}

export function validateTicket(data) {
    const errors = {};

    if (!data.title) {
        errors.title = "Title is required";
    }

    if (!data.desc) {
        errors.desc = "Description is required";
    }

    if (Object.keys(errors).length) {
        return errors;
    }
}