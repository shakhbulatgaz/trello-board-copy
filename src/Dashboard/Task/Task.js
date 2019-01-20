import React from "react";
import { Draggable } from "react-beautiful-dnd";

import styles from "./task.module.css";

const Task = props => (
	<Draggable draggableId={props.task.id} index={props.index}>
		{(provided, snapshot) => (
			<div
				className={styles.container}
				{...provided.draggableProps}
				{...provided.dragHandleProps}
				ref={provided.innerRef}
				isDragging={snapshot.isDragging}
			>
				{props.task.content}
			</div>
		)}
	</Draggable>
);

export default Task;
