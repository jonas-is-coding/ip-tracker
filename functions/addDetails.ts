"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { detailsSchema } from "@/lib/schema";

export const addDetails = async (values: z.infer<typeof detailsSchema>) => {
    try {
        const validatedFields = values;
        const { ip, city, postal, country, longitude, latitude, org } = validatedFields;

        const currentDate = new Date().toLocaleDateString('de-DE');

        await db.details.create({
            data: {
                ip,
                city,
                postal,
                country,
                latitude,
                longitude,
                org,
                date: currentDate,
            }
        });
        
        console.log("Details successfully added to the database.");
    } catch (error) {
        console.error("Error adding details to the database:", error);
        throw error;
    }
}