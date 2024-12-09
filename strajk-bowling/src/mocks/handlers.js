import { http, HttpResponse } from "msw";

export const handlers = [
    http.post("https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com", ({ request }) => {
        const { when, lanes, people, shoes } = JSON.parse(request);

        // check if any fields are missing
        if (!when || !lanes || !people) {
            return HttpResponse.json({ message: "Alla fälten måste vara ifyllda" });
        }

        // max 4 per lane
        const maxPlayersAllowed = lanes * 4;

        if (people > maxPlayersAllowed) {
            return HttpResponse.json({ message: "Det får max vara 4 spelare per bana"});
        }

        const response = {
            when,
            lanes,
            people,
            shoes
        }
        console.log("response:", response)

        return HttpResponse.json(response)
    })
]