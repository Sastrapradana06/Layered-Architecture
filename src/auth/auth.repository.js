const prisma = require("../db/prisma");

const findUsers = async () => {
  return await prisma.user.findMany();
};

const insertUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

module.exports = {
  insertUser,
  findUserByEmail,
  findUsers,
};
