import React from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";

const Container = styled.div`
	margin: 8px;
	border: 1px solid lightgrey;
	border-radius: 2px;
	width: 400px;

	display: flex;
	flex-direction: column;

	background-color: white;
`;

const Title = styled.h3`
	padding: 8px;
`;

const TaskList = styled.div`
	padding: 8px;
	transition: background-color 0.3s ease;
	background-color: ${props => (props.isDraggingOver ? "skyblue" : "inherit")};
	flex-grow: 1;
	min-height: 100px;
`;

export default class Column extends React.PureComponent {
	render() {
		return (
			<Draggable draggableId={this.props.column.id} index={this.props.index}>
				{provided => (
					<Container {...provided.draggableProps} ref={provided.innerRef}>
						<Title {...provided.dragHandleProps}>{this.props.column.title}</Title>
						<Droppable droppableId={this.props.column.id} type="task">
							{/* Droppable uses 'render props' pattern and expects child to be a function  */}
							{(provided, snapshot) => (
								<TaskList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
									{this.props.tasks.map((task, index) => (
										<Task key={task.id} task={task} index={index} />
									))}
									{provided.placeholder}
								</TaskList>
							)}
						</Droppable>
					</Container>
				)}
			</Draggable>
		);
	}
}
