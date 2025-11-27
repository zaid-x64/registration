const z = require("zod");

const usernameSchema = z.object({
  username: z
    .string({ message: "Username is required in string" })
    .trim()
    .min(3, { message: "Username should have atleast 3 characters" })
    .max(15, { message: "Username should be less than 15 characters" })
    .lowercase({ message: "Username should only contain lowercase letters" }),
});

module.exports = { usernameSchema };
