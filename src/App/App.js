import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "reset-css";

import initialData from "./initial-data";
import Column from "../Dashboard/Column/Column";
import styles from "./app.module.css";

class App extends React.PureComponent {
	state = initialData;

	moveColumn = result => {
		const { source, destination, draggableId } = result;
		const newColumnOrder = Array.from(this.state.columnOrder);

		newColumnOrder.splice(source.index, 1);
		newColumnOrder.splice(destination.index, 0, draggableId);

		const newState = {
			...this.state,
			columnOrder: newColumnOrder
		};

		this.setState(newState);
		return;
	};

	moveTaskWithinColumn = (result, start) => {
		const { source, destination, draggableId } = result;
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
	};

	moveTaskToAnotherColumn = (result, start, finish) => {
		const { source, destination, draggableId } = result;
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
		return;
	};

	onDragEnd = result => {
		const { source, destination, type } = result;
		const start = this.state.columns[source.droppableId];
		const finish = this.state.columns[destination.droppableId];

		if (!destination) return; //if task is moved outside of available area
		if (destination.droppableId === source.droppableId && destination.index === source.index) return;

		if (type === "column") this.moveColumn(result);
		else if (start === finish) this.moveTaskWithinColumn(result, start);
		else this.moveTaskToAnotherColumn(result, start, finish);
	};

	render() {
		return (
			<div className={styles.app_background}>
				<DragDropContext onDragEnd={this.onDragEnd}>
					<Droppable droppableId="all-columns" direction="horizontal" type="column">
						{provided => (
							<div className={styles.container} {...provided.droppableProps} ref={provided.innerRef}>
								{this.state.columnOrder.map((columnId, index) => {
									const start = this.state.columns[columnId];
									const tasks = start.taskIds.map(taskId => this.state.tasks[taskId]);

									return <Column key={start.id} column={start} tasks={tasks} index={index} />;
								})}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		);
	}
}

export default App;
