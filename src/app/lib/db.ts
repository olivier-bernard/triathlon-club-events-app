export const runtime = "nodejs";

import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();
