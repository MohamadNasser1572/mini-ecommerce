import { Prisma, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export type Db = PrismaClient | Prisma.TransactionClient;

export type Transaction = <T>(work: (tx: Prisma.TransactionClient) => Promise<T>) => Promise<T>;

export const transaction: Transaction = (work) => prisma.$transaction(work);
