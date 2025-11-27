const { z } = require("zod");

const registrationSchema = z.object({
  username: z
    .string({ message: "Username is required in string" })
    .nonempty({ message: "User name should not be empty" })
    .trim()
    .min(3, { message: "Username should have atleast 3 characters" })
    .max(15, { message: "Username should be less than 15 characters" })
    .lowercase({ message: "Username should only contain lowercase letters" }),

  email: z
    .string({ message: "Email should be string" })
    .nonempty({ message: "email should not be empty" })
    .trim()
    .email({ message: "Please enter a valid email" }),

  password: z
    .string({ message: "Password should be string" })
    .nonempty({ message: "Password should not be empty" })
    .trim()
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .min(8, { message: "Password must be 8 characters long" })
    .max(20, { message: "Password should be less than 20 characters" }),
});

module.exports = { registrationSchema };
