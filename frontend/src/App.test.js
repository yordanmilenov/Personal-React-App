
import React from "react";
import { render, screen, fireEvent, waitFor, getByRole } from "@testing-library/react";
import App from "./App";
import axios from 'axios';
import MockAdapter from "axios-mock-adapter";

const mockAxios = new MockAdapter(axios);

describe("App", () => {
    beforeEach(() => {
        mockAxios.reset();
    });

    test("renders Add Todo Item input" , () => {
        render(<App />);
        const input = screen.getByLabelText("Add Todo Item");
        expect(input).toBeInTheDocument();
    });

    test("renders Add button" , () => {
        render(<App />);
        const button = screen.getByRole("button", { name: /Add/i });
        expect(button).toBeInTheDocument();
    });

    test("renders a list of items", async () => {
        const items = [{ _id: "1", item: "test item 1" }, { _id: "2", item: "test item 2" }];
        mockAxios.onGet("http://localhost:5500/api/item/s").reply(200, items);

        render(<App />);

        await waitFor(() => expect(screen.getByText(items[0].item)).toBeInTheDocument());
        expect(screen.getByText(items[1].item)).toBeInTheDocument();
    });

    test("can add an item", async () => {
        const itemText = "New test item";
        const newItem = { _id: "3", item: itemText };
        mockAxios.onPost("http://localhost:5500/api/item").reply(200, newItem);

        render(<App />);

        const input = screen.getByLabelText("Add Todo Item");
        fireEvent.change(input, { target: { value: itemText } });

        const button = screen.getByRole("button", { name: /Add/i });
        fireEvent.click(button);

        await waitFor(() => expect(screen.getByText(itemText)).toBeInTheDocument());
    });

    test("cannot add an item with no text", async() => {
        render(<App />);

        const button = screen.getByRole("button", { name: /Add/i });
        fireEvent.click(button);

        expect(mockAxios.history.post.length).toBe(0);
        expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });

    test("cannot add an item with text longer than 40 characters", async () => {
        render(<App />);

        const input = screen.getByLabelText("Add Todo Item");
        fireEvent.change(input, { target: { value: "a".repeat(41) } });

        const button = screen.getByRole("button", { name: /Add/i });
        fireEvent.click(button);

        expect(mockAxios.history.post.length).toBe(0);
        expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });

    test("can delete an item", async () => {
        const items = [{ _id: "1", item: "test item 1" }, { _id: "2", item: "test item 2" }];
        mockAxios.onGet("http://localhost:5500/api/item/s").reply(200, items);
        mockAxios.onDelete("http://localhost:5500/api/item/1").reply(200);

        render(<App />);

        await waitFor(() => expect(screen.getByText(items[0].item)).toBeInTheDocument());
        const deleteButton = screen.getAllByRole("button", { name: /delete/i })[0];
        fireEvent.click(deleteButton);

        await waitFor(() => expect(screen.queryByText(items[0].item)).not.toBeInTheDocument());
        expect(screen.getByText(items[1].item)).toBeInTheDocument();
    });

    test("can edit an item", async () => {

        const items = [{ _id: "1", item: "test item 1" }, {_id: "2", item: "test item 2" }];
        const updatedItemText = "updated test item";
        const updatedItem = { _id: "1", item: updatedItemText };
        mockAxios.onGet("http://localhost:5500/api/item/s").reply(200, items);
        mockAxios.onPut(`http://localhost:5500/api/item/${updatedItem._id}`).reply(200, updatedItem);

        render(<App />);

        await waitFor(() => expect(screen.getByText(items[0].item)).toBeInTheDocument());
        const editButton = screen.getAllByRole("button", { name: /edit/i })[0];
        fireEvent.click(editButton);

        const input = screen.getByLabelText("Edit Todo Item");
        fireEvent.change(input, { target: { value: updatedItemText } });

        const saveButton = screen.getByRole("button", { name: /save/i });
        fireEvent.click(saveButton);

        await waitFor(() => expect(screen.getByText(updatedItemText)).toBeInTheDocument());
        expect(screen.queryByText(items[0].item)).not.toBeInTheDocument();
        expect(screen.getByText(items[1].item)).toBeInTheDocument();
    });
})

