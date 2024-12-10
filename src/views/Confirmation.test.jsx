import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import Confirmation from "./Confirmation";
import Booking from "./Booking";
import { MemoryRouter, Routes, Route } from "react-router-dom";

describe("Confirmation", () => {

    beforeAll(() => {
        global.sessionStorage = {
            setItem: vi.fn(),
            getItem: vi.fn(() => null),
            clear: vi.fn()
        }
    })

    it("navigates to confirmation when the booking is done", async () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<Booking />} />
                    <Route path="/confirmation" element={<Confirmation />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2024-12-10" } });
        fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: "12:00" } });
        fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: "1" } });
        fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), { target: { value: "1" } });

        fireEvent.click(screen.getByText("+"));
        fireEvent.click(screen.getByText(/Shoe size/i));
        fireEvent.change(screen.getByLabelText(/Size/i), { target: { value: "42" } });

        fireEvent.click(screen.getByText(/strIIIIIike!/i));

        await waitFor(() => {
            expect(screen.getByText(/see you soon/i)).toBeInTheDocument();
        })
    
    }),

    it("displays 'Ingen bokning gjord' when there is no booking in session storage ", () => {
        // empty session storage
        global.sessionStorage.getItem = vi.fn(() => null);
        // sessionStorage.clear();

        render(
            <MemoryRouter initialEntries={["/confirmation"]}>
                <Routes>
                    <Route path= "/confirmation" element={<Confirmation />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/Ingen bokning gjord/i)).toBeInTheDocument();
    }),

    it("displays booking info if there is a booking stored in session storage", () => {
        const bookingDetails = {
            when: "2024-12-14T19:00",
            people: 3,
            lanes: 1,
            price: 460,
            id: "booking123",
          };

        global.sessionStorage.getItem = vi.fn(() => JSON.stringify(bookingDetails));

        render(
            <MemoryRouter>
                <Confirmation />
            </MemoryRouter>
        );

        expect(screen.getByLabelText("When").value).toBe("2024-12-14 19:00");
        expect(screen.getByLabelText("Who").value).toBe("3");
        expect(screen.getByLabelText("Lanes").value).toBe("1");
        expect(screen.getByLabelText("Booking number").value).toBe("booking123");

        const totalPrice = screen.getByText("460 sek");
        expect(totalPrice).toBeInTheDocument();

        screen.debug();
    })
})