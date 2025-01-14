import { Todo } from "@/app/(tabs)";

export const getTodos = async (): Promise<Todo[] | undefined> => {
	try {
		const res = await fetch(
			"https://67656e1852b2a7619f5f8733.mockapi.io/test-api/todos"
		);
		if (typeof res === "undefined") throw new Error("No response from server");
		else {
			const result = await res.json();
			return result;
		}
	} catch (error) {
		console.log(error);
	}
};
