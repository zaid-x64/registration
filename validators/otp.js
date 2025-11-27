const z = require("zod");

const otpSchema = z.object({
  otp: z.number({
    required_error: "OTP is required",
    invalid_type_error: "OTP must be a number",
  }),
});

module.exports = { otpSchema };
