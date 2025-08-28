import * as z from "zod";

export const AddressSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required ",
  }),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number cannot exceed 12 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  zipCode: z.number().min(100000, {
    message: "Invalid zip code",
  }),
  address: z.string().min(1, {
    message: "Address is required",
  }),
  landmark: z.string().min(1, {
    message: "Landmark is required",
  }),
  town: z.string().min(1, {
    message: "Message is required",
  }),
  district: z.string(),
  state: z.string(),
  isDefault: z.boolean(),
});
