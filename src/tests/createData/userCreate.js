const User = require("../../models/User");

const userCreate = async () => {
  const userBody = {
    firstName: "Walter",
    lastName: "Medina",
    email: "walrob@gmail.com",
    password: "1234",
    phone: "902751240",
  };
  await User.create(userBody);
};

module.exports = userCreate;
