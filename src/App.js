import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

import initialData from "./initial-data";
import Column from "./Column";

import "reset-css";

const Container = styled.div`
	display: flex;
`;

class App extends React.PureComponent {
	state = initialData;

	// 'result' contains drag source and destination info.
	onDragEnd = result => {
		// Move task inside its column
		const { destination, source, draggableId, type } = result;

		const start = this.state.columns[source.droppableId];
		const finish = this.state.columns[destination.droppableId];

		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index) return;

		if (type === "column") {
			const newColumnOrder = Array.from(this.state.columnOrder);
			newColumnOrder.splice(source.index, 1);
			newColumnOrder.splice(destination.index, 0, draggableId);

			const newState = {
				...this.state,
				columnOrder: newColumnOrder
			};

			this.setState(newState);
			return;
		}

		if (start === finish) {
			const newTaskIds = Array.from(start.taskIds); // copy to avoid mutations
			newTaskIds.splice(source.index, 1);
			newTaskIds.splice(destination.index, 0, draggableId);

			const newColumn = {
				...start,
				taskIds: newTaskIds
			};

			const newState = {
				...this.state,
				columns: {
					...this.state.columns,
					[newColumn.id]: newColumn
				}
			};

			this.setState(newState);
			return;
		}

		// Moving task to another column
		const startTaskIds = Array.from(start.taskIds);
		startTaskIds.splice(source.index, 1);
		const newStart = {
			...start,
			taskIds: startTaskIds
		};

		const finishTaskIds = Array.from(finish.taskIds);
		finishTaskIds.splice(destination.index, 0, draggableId);
		const newFinish = {
			...finish,
			taskIds: finishTaskIds
		};

		const newState = {
			...this.state,
			columns: {
				...this.state.columns,
				[newStart.id]: newStart,
				[newFinish.id]: newFinish
			}
		};

		this.setState(newState);
	};

	render() {
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<Droppable droppableId="all-columns" direction="horizontal" type="column">
					{provided => (
						<Container {...provided.droppableProps} ref={provided.innerRef}>
							{this.state.columnOrder.map((columnId, index) => {
								const start = this.state.columns[columnId];
								const tasks = start.taskIds.map(taskId => this.state.tasks[taskId]);

								return <Column key={start.id} column={start} tasks={tasks} index={index} />;
							})}
							{provided.placeholder}
						</Container>
					)}
				</Droppable>
			</DragDropContext>
		);
	}
}

export default App;
