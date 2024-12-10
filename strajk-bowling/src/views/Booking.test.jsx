import { render, screen, fireEvent, waitFor, findByText, getByText } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import Booking from "./Booking";
import Confirmation from "./Confirmation";

describe("Booking", () => {
    it("should be able to choose date, time, number of players and lanes", () => {
        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        const dateInput = screen.getByLabelText(/Date/i);
        const whenInput = screen.getByLabelText(/Time/i);
        const numberOfPlayers = screen.getByLabelText(/Number of awesome bowlers/i);
        const numberOfLanes = screen.getByLabelText(/Number of lanes/i);

        fireEvent.change(dateInput, { target: { value: "2024-12-14" } });
        fireEvent.change(whenInput, { target: { value: "19:00" } });
        fireEvent.change(numberOfPlayers, { target: { value: "2" } });
        fireEvent.change(numberOfLanes, { target: { value: "1" } });

    }),

    it("should show an error message if some of the fields are missing", async () => {
        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        const submitButton = screen.getByText(/strIIIIIike!/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Alla fälten måste vara ifyllda")).toBeInTheDocument();
        })
    }),

    it("should be able to add a shoe size for each player by clicking on an add button", () => {
        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        // click add whoe button
        const addButton = screen.getByText("+");
        fireEvent.click(addButton);

        // check that there is one shoe input field
        const shoeInputFields = screen.getAllByRole('textbox');
        expect(shoeInputFields).toHaveLength(1);
    }),

    it("should be able to enter shoe size", () => {
        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        const addButton = screen.getByText("+");
        fireEvent.click(addButton);

        const shoeInputField = screen.getByRole("textbox");
        fireEvent.change(shoeInputField, { target: { value: "42" }});

        expect(shoeInputField.value).toBe("42");
    }),

    it("should show an error message if shoe size is missing for a player", async () => {
        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        const dateInput = screen.getByLabelText(/Date/i);
        const whenInput = screen.getByLabelText(/Time/i);
        const numberOfPlayers = screen.getByLabelText(/Number of awesome bowlers/i);
        const numberOfLanes = screen.getByLabelText(/Number of lanes/i);

        fireEvent.change(dateInput, { target: { value: "2024-12-14" } });
        fireEvent.change(whenInput, { target: { value: "19:00" } });
        fireEvent.change(numberOfPlayers, { target: { value: "1" } });
        fireEvent.change(numberOfLanes, { target: { value: "1" } });

        const addButton = screen.getByText("+");
        fireEvent.click(addButton);

        // submit without filling in shoe size for the player
        const submitButton = screen.getByText("strIIIIIike!");
        fireEvent.click(submitButton);

        // error message
        await waitFor(() => {
            expect(screen.getByText("Alla skor måste vara ifyllda")).toBeInTheDocument();
        })
    }),

    it("should show an error message if number of players do not match number of shoes", async () => {
        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        const dateInput = screen.getByLabelText(/Date/i);
        const whenInput = screen.getByLabelText(/Time/i);
        const numberOfPlayers = screen.getByLabelText(/Number of awesome bowlers/i);
        const numberOfLanes = screen.getByLabelText(/Number of lanes/i);

        // book for 2 players
        fireEvent.change(dateInput, { target: { value: "2024-12-14" } });
        fireEvent.change(whenInput, { target: { value: "19:00" } });
        fireEvent.change(numberOfPlayers, { target: { value: "2" } });
        fireEvent.change(numberOfLanes, { target: { value: "1" } });

        // add shoes for only one player
        const addButton = screen.getByText("+");
        fireEvent.click(addButton);

        const shoeInputField = screen.getByRole("textbox");
        fireEvent.change(shoeInputField, { target: { value: "42" }});

        const submitButton = screen.getByText("strIIIIIike!");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Antalet skor måste stämma överens med antal spelare")).toBeInTheDocument();
        });

    }),

    it("should show an overview of all player's added shoes", () => {
        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        const addShoesButton = screen.getByText("+");
        fireEvent.click(addShoesButton);

        expect(screen.getByText("Shoe size / person 1")).toBeInTheDocument();

        fireEvent.click(addShoesButton);
        expect(screen.getByText("Shoe size / person 2")).toBeInTheDocument();
    })

    
    it("should show an error message if there are not enough lanes for number of players", async () => {
        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        const dateInput = screen.getByLabelText(/Date/i);
        const whenInput = screen.getByLabelText(/Time/i);
        const numberOfPlayers = screen.getByLabelText(/Number of awesome bowlers/i);
        const numberOfLanes = screen.getByLabelText(/Number of lanes/i);

        // insert date, time, number of players and lanes
        fireEvent.change(dateInput, { target: { value: "2024-12-14" } });
        fireEvent.change(whenInput, { target: { value: "19:00" } });
        fireEvent.change(numberOfPlayers, { target: { value: "5" } });
        fireEvent.change(numberOfLanes, { target: { value: "1" } });

        // add shoes inputs for five players
        const addShoesButton = screen.getByText("+");
        for (let i = 0; i < 5; i++) {
            fireEvent.click(addShoesButton); 
        }

        const shoeInputs = screen.getAllByRole("textbox", { name: /Shoe size/});

        shoeInputs.forEach((shoeInput) => {
            fireEvent.change(shoeInput, { target: { value: "42" }});
        });

        const submitButton = screen.getByText("strIIIIIike!");

        fireEvent.click(submitButton);

        // five players and only one lane should trigger an error message
        await waitFor(() => {
            expect(screen.getByText("Det får max vara 4 spelare per bana")).toBeInTheDocument();
        })

        screen.debug();
    }),

    it("should be able to remove a shoe size input field with a button", async () => {
        render(
            <MemoryRouter>
                <Booking />
            </MemoryRouter>
        );

        const addShoeButton = screen.getByText("+");
        fireEvent.click(addShoeButton);

        await waitFor(() => {
            const removeShoeInputField = screen.getByText("-");
            expect(removeShoeInputField).toBeInTheDocument();
            fireEvent.click(removeShoeInputField);
            expect(removeShoeInputField).not.toBeInTheDocument();
        })


        screen.debug();
    }),

    it("should be able to complete a booking by clicking on a booking button and navigate to confirmation page with correct booking details (total price, booking number)", async () => {
        render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<Booking/>} />
                    <Route path="confirmation" element={<Confirmation />} />
                </Routes>
            </MemoryRouter>
        );

        // Fill in booking details
        fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2024-12-14" }});
        fireEvent.change(screen.getByLabelText("Time"), { target: { value: "18:00" } });
        fireEvent.change(screen.getByLabelText("Number of lanes"), { target: { value: "1" } });
        fireEvent.change(screen.getByLabelText("Number of awesome bowlers"), { target: { value: "3" } });

        // Add shoe sizes for 3 players
        const addShoesButton = screen.getByText("+");

        for (let i = 0; i < 3; i++) {
            fireEvent.click(addShoesButton);
        };

        const shoeInputs = screen.getAllByRole("textbox", { name: /Shoe size/});

        shoeInputs.forEach((shoeInput) => {
            fireEvent.change(shoeInput, { target: { value: "42" }});
        });

        const bookingButton = screen.getByText("strIIIIIike!");
        fireEvent.click(bookingButton);

        // navigation
        await waitFor(() => {
            expect(screen.getByText(/See you soon/i)).toBeInTheDocument();
        })

        screen.debug();

        expect(screen.getByLabelText("When").value).toBe("2024-12-14 18:00");
        expect(screen.getByLabelText("Who").value).toBe("3");
        expect(screen.getByLabelText("Lanes").value).toBe("1");
        expect(screen.getByLabelText("Booking number").value).toBe("booking123");

        // total price for 3 players and 1 lane should display 460 kr
        const totalPrice = screen.getByText("460 sek");
        expect(totalPrice).toBeInTheDocument();

    })
})