const z = require("zod");

const resetpwdSchema = z.object({
  newpassword: z
    .string({ message: "New passowrd should be string" })
    .nonempty({ message: "New password should not be empty" })
    .trim()
    .min(8, { message: "password is too short" })
    .max(20, { message: "password should be less then 20 characters" }),
  verifypassword: z
    .string({ message: "Verify password should be string" })
    .nonempty({ message: "Verify password should not be empty" })
    .trim()
    .min(8, { message: "password is too short" })
    .max(20, { message: "password should be less then 20 characters" }),
});

module.exports = { resetpwdSchema };
