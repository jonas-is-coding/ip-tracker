import * as z from "zod"

export const detailsSchema = z.object({
    ip: z.string(),
    city: z.string(),
    postal: z.string(),
    country: z.string(),
    longitude: z.number(),
    latitude: z.number(),
    org: z.string(),
})