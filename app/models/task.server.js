import { prisma } from "~/db.server";

export function getTask({ id, userId }) {
  return prisma.task.findFirst({
    select: { id: true, description: true, checked: true },
    where: { id, userId },
  });
}

export function getTaskListItems({ userId }) {
  return prisma.task.findMany({
    where: { userId },
    select: { id: true, description: true, checked: true },
    orderBy: { id: "desc" },
  });
}

export function createTask({ description, userId }) {
  return prisma.task.create({
    data: {
      description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function checkTask({ id, userId, checked }) {
  return prisma.task.update({
    where: { id },
    data: { checked },
  });
}

export function deleteTask({ id, userId }) {
  return prisma.task.deleteMany({
    where: { id, userId },
  });
}
