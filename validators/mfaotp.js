const z = require("zod");

const mfaOtpSchema = z.object({
  number: z
    .string({ message: "Phone number must be a string" })
    .trim()
    .nonempty({ message: "Phone number should not be empty" }),
  otp: z.number({
    required_error: "OTP is required",
    invalid_type_error: "OTP must be a number",
  }),
});

module.exports = { mfaOtpSchema };
