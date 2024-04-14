import bcrypt from "bcryptjs";
const users = [
  {
    name: "Admin User",
    email: "admin@email.com",
    password: bcrypt.hashSync("123456", 12),
  },
  {
    name: "Test",
    email: "test@email.com",
    password: bcrypt.hashSync("123456", 12),
  },
];

export default users;
