import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: ['warn'],
  });
};

declare global {
  const prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// @ts-expect-error globalThis is not defined in typescript
const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;
// @ts-expect-error globalThis is not defined in typescript
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
