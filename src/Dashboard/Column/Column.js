import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "../Task/Task";

import styles from "./column.module.css";

const Column = props => (
	<Draggable draggableId={props.column.id} index={props.index}>
		{provided => (
			<div className={styles.container} {...provided.draggableProps} ref={provided.innerRef}>
				<h3 className={styles.title} {...provided.dragHandleProps}>
					{props.column.title}
				</h3>
				<Droppable droppableId={props.column.id} type="task">
					{(provided, snapshot) => (
						<div
							className={styles.tasklist}
							ref={provided.innerRef}
							{...provided.droppableProps}
							isDraggingOver={snapshot.isDraggingOver}
						>
							{props.tasks.map((task, index) => (
								<Task key={task.id} task={task} index={index} />
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</div>
		)}
	</Draggable>
);

export default Column;
