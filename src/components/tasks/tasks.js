import React from "react";
import tasksStore from "stores/tasksStore";
import listsStore from "stores/listsStore";
import { view } from "react-easy-state";
import Task from "components/tasks/task";
import { SortableContainer } from "react-sortable-hoc";
import TaskForm from "components/tasks/taskForm";
import arrayMove from "array-move";
import styled from "styled-components";
import { ToggleLeft } from "styled-icons/feather/ToggleLeft";
import { ToggleRight } from "styled-icons/feather/ToggleRight";
import Button from "components/styled.components/button";
import Header from "components/styled.components/header";

const ListOfTasks = styled.div`
  overflow-y: auto;
  flex: 1;
`;

// const Header = styled.div`
//   flex: 0 0 80px;
//   background: #fff;
//   box-shadow: 0px 0px 1px 0px #e4e7eb;
//   padding: 12px;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   box-sizing: border-box;
// `;

const Footer = styled.div`
  flex: 0 0 32px;
  background: #fff;
  /* box-shadow: 0px -1px 0px 0px #e4e7eb; */
  border-top: 1px solid #e4e7eb;
  padding: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
`;

const MyToggle = props => {
  return (
    <div onClick={props.onClick} style={{ margin: "4px" }}>
      {props.defaultChecked ? (
        <ToggleRight size="24" style={{ verticalAlign: "middle" }} />
      ) : (
        <ToggleLeft size="24" style={{ verticalAlign: "middle" }} />
      )}
      <span
        style={{
          marginLeft: "4px",
          height: "24",
          fontSize: "12px",
          verticalAlign: "center"
        }}
      >
        {props.label}
      </span>
    </div>
  );
};

const SortableList = view(
  SortableContainer(({ tasks }) => {
    return (
      <ListOfTasks>
        {tasks.map((task, index) => (
          <Task key={task.id} index={index} task={task} />
        ))}
      </ListOfTasks>
    );
  })
);

const Tasks = () => {
  const list = listsStore.currentList;
  if (!list) return null;
  const tasks = tasksStore.currentTasks;

  const shouldCancelStart = event => {
    // Cancel sorting if the event target is an `Checkbox`
    return event.target.tagName.toLowerCase() === "button";
  };

  const moveTask = ({ oldIndex, newIndex }) => {
    const movedTask = tasks[oldIndex];
    const _tasks = arrayMove(tasks, oldIndex, newIndex);
    const siblingTaskId = newIndex > 0 ? _tasks[newIndex - 1].id : null;
    tasksStore.moveTask(movedTask, siblingTaskId);
  };

  const toggleShowHidden = () => {
    tasksStore.display.showHidden = !tasksStore.display.showHidden;
    tasksStore.listTasks(list.id);
  };

  const toggleShowDeleted = () => {
    tasksStore.display.showDeleted = !tasksStore.display.showDeleted;
    tasksStore.listTasks(list.id);
  };

  return (
    <>
      <Header.Wrapper
      // style={{ background: "#fff", boxShadow: "0px 0px 1px 0px #e4e7eb" }}
      >
        <Header.Title>{list.shortTitle}</Header.Title>
      </Header.Wrapper>

      <SortableList
        tasks={tasks}
        distance={10}
        shouldCancelStart={shouldCancelStart}
        onSortEnd={end => moveTask(end)}
      />
      <TaskForm
        saveTodo={title => tasksStore.insertTask(list.id, { title: title })}
        placeholder="Add task..."
      />
      <Footer>
        <MyToggle
          defaultChecked={tasksStore.display.showHidden}
          onClick={toggleShowHidden}
          label="Show hidden"
        />

        <MyToggle
          defaultChecked={tasksStore.display.showDeleted}
          onClick={toggleShowDeleted}
          label="Show deleted"
        />
        <div style={{ flex: "1" }} />
        <Button onClick={() => tasksStore.clearTasks()}>Clear completed</Button>
      </Footer>
    </>
  );
};

export default view(Tasks);
