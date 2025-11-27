const z = require("zod");

const changepwdSchema = z.object({
  password: z
    .string({ message: "Password should be string" })
    .nonempty({ message: "Password is required" })
    .trim()
    .min(8, { message: "Password is too short" })
    .max(20, { message: "Password should be less then 20 characters" }),
  newpassword: z
    .string({ message: "New password should be string" })
    .nonempty({ message: "New password is required" })
    .trim()
    .min(8, { message: "Password is too short" })
    .max(20, { message: "Password should be less then 20 characters" }),
  verifypassword: z
    .string({ message: "Verify password should be string" })
    .nonempty({ message: "Verify password is required" })
    .trim()
    .min(8, { message: "Password is too short" })
    .max(20, { message: "Password should be less then 20 characters" }),
});

module.exports = { changepwdSchema };
