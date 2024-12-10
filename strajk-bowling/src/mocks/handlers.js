import { http, HttpResponse } from "msw";

export const handlers = [
    http.post("https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com", async ({ request }) => {
        const booking = await request.json();
        console.log("Booking post req", booking)

        // if (!when || !lanes || !people) {
        //     return HttpResponse.json({ message: "Alla fälten måste vara ifyllda" });
        // }

        const price = (booking.people * 120) + (booking.lanes * 100);

        const bookingDetails = {
            ...booking,
            id: "booking123",
            active: true,
            price
        }

        console.log("bookingDetails:", bookingDetails)

        sessionStorage.setItem(
            "confirmation",
            JSON.stringify(bookingDetails)
        );

        return HttpResponse.json(bookingDetails)
    })
]