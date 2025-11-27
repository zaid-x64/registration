const z = require("zod");

const loginSchema = z.object({
  email: z
    .string({ message: "Email should be string" })
    .email({ message: "Invalid Email" })
    .nonempty({ message: "Email should not be empty" })
    .trim(),

  password: z
    .string({ message: "Password should be string" })
    .nonempty({ message: "Password should not be empty" })
    .trim()
    .min(8, { message: "password is too short" })
    .max(20, { message: "password should be less then 20 characters" }),
});

module.exports = { loginSchema };
