import { getTodos } from "@/api/todo";
import { useEffect, useState } from "react";
import { TextInput } from "react-native";
import { View, Text, StyleSheet, Button } from "react-native";
import { ScrollView } from "react-native";
import { DataTable } from "react-native-paper";

export interface Todo {
	id: string;
	name: string;
	description: string;
}

export default function HomeScreen() {
	const [isLoading, setLoading] = useState(true);
	const [isUpdate, setIsUpdate] = useState<boolean>(false);
	const [data, setData] = useState<Todo[]>([]);
	const [name, setName] = useState<string>("");
	const [idUpdate, setIdUpdate] = useState<string>("");
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await getTodos();
				if (typeof res !== "undefined") {
					setData(res);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleDeleteTodo = (id: string) => () => {
		//call api delete
		fetch(`https://67656e1852b2a7619f5f8733.mockapi.io/test-api/todos/${id}`, {
			method: "DELETE",
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
			})
			.then(() => {
				setData(data.filter((item) => item.id !== id));
			});
	};

	const handleAddTodo = () => {
		//call api add
		fetch("https://67656e1852b2a7619f5f8733.mockapi.io/test-api/todos", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, describe: "" }),
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
			})
			.then((res) => {
				setData([...data, res]);
			});
		setName("");
	};

	const handleTodoById = (id: string) => () => {
		//call api get by id
		setIsUpdate(true);
		fetch(`https://67656e1852b2a7619f5f8733.mockapi.io/test-api/todos/${id}`)
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
			})
			.then((res) => {
				setName(res.name);
				setIdUpdate(res.id);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleUpdateTodo = (id: string) => () => {
		//call api update
		fetch(`https://67656e1852b2a7619f5f8733.mockapi.io/test-api/todos/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, describe: "" }),
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
			})
			.then((res) => {
				setData(data.map((item) => (item.id === id ? res : item)));
			});
		setName("");
		setIsUpdate(false);
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.block_to_do_list}>
				<Text style={styles.title}>To do list</Text>
				<View
					style={{
						marginBottom: 10,
						marginTop: 10,
						display: "flex",
						width: 300,
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "flex-start",
					}}
				>
					<TextInput
						style={styles.input_todo}
						onChangeText={(text) => setName(text)}
						value={name}
					/>
					<View style={{ width: 90, marginLeft: 10 }}>
						{isUpdate ? (
							<Button title="Update" onPress={handleUpdateTodo(idUpdate)} />
						) : (
							<Button title="Add" onPress={handleAddTodo} />
						)}
					</View>
				</View>
				<View style={styles.list_to_do}>
					<DataTable>
						<DataTable.Header style={styles.tableHeader}>
							<DataTable.Title>Name</DataTable.Title>
							<DataTable.Title>Action</DataTable.Title>
						</DataTable.Header>

						{data.map((item) => (
							<DataTable.Row key={item.id} style={styles.item}>
								<DataTable.Cell>{item.name}</DataTable.Cell>
								<DataTable.Cell>
									<Button
										color={"red"}
										onPress={handleDeleteTodo(item.id)}
										title="Delete"
									/>
								</DataTable.Cell>
								<DataTable.Cell>
									<Button
										color={"green"}
										onPress={handleTodoById(item.id)}
										title="Update"
									/>
								</DataTable.Cell>
							</DataTable.Row>
						))}
					</DataTable>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 30,
		width: "100%",
		backgroundColor: "#eaeaea",
	},
	block_to_do_list: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 30,
		marginBottom: 5,
	},
	list_to_do: {
		width: 300,
		borderBlockColor: "black",
		borderStyle: "solid",
		borderWidth: 1,
	},
	sectionHeader: {
		paddingTop: 2,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 2,
		fontSize: 14,
		fontWeight: "bold",
		borderBottomColor: "black",
		borderBottomWidth: 1,
		borderStyle: "solid",
	},
	item: {
		flex: 1,
	},
	tableHeader: {
		backgroundColor: "#DCDCDC",
		flex: 1,
	},
	btn_delete: {
		color: "red",
	},
	input_todo: {
		outline: "none",
		borderColor: "black",
		borderWidth: 1,
		borderStyle: "solid",
		borderRadius: 5,
		width: 200,
		height: 40,
		fontSize: 15,
		paddingLeft: 5,
	},
	btnAdd: {
		width: 90,
	},
});
