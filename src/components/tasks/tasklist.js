import React, { useState } from "react";
import styled from "styled-components";
import { view } from "react-easy-state";
import tasksStore from "stores/tasksStore";
import listsStore from "stores/listsStore";
import DeleteButton from "components/styled.components/deleteButton";
import EditButton from "components/styled.components/editButton";
import Pill from "components/styled.components/pill";
import DeleteListDialog from "components/tasks/deleteListDialog";

const ButtonGroup = styled.div`
  display: ${props => (props.hidden ? "none" : "flex")};
  align-items: center;
`;

const List = styled.div`
  margin: 0px 2px 0px 2px;
  padding: 0px 16px 0px 4px;
  line-height: 36px;
  height: 36px;
  overflow: hidden;
  white-space: nowrap;
  cursor: default;
  scroll-snap-align: start;
  :hover {
    background: ${props => props.theme.borderdark};
  }

  &:hover ${Pill} {
    display: none;
  }
  &:hover ${ButtonGroup} {
    display: flex;
  }
  background: ${props =>
    props.isSelected ? props.theme.borderdark : "transparent"};

  border-width: 0px 0px 0px 4px;
  border-style: solid;
  border-color: ${props =>
    props.isSelected ? props.theme.highlight : "transparent"};

  font-size: 14px;
  font-weight: 400;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TaskListTitle = styled.div`
  margin-top: 0px;
  margin-right: 4px;
  margin-bottom: 0px;
  margin-left: 4px;
  vertical-align: middle;
  text-overflow: ellipsis;
  overflow: hidden;
  float: left;
`;

const TaskRename = view(({ list, onClose, ...props }) => {
  const updateList = event => {
    listsStore.updateTaskList(list);
    onClose();
    event.preventDefault();
  };

  return (
    <form onSubmit={updateList}>
      <input
        type="text"
        value={list.title}
        onChange={event => {
          listsStore.setList({ ...list, title: event.target.value });
        }}
        onBlur={updateList}
      />
    </form>
  );
});

const TaskList = ({ list, isSelected }) => {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isRename, setIsRename] = useState(false);

  return (
    <List
      isSelected={isSelected}
      onClick={() => {
        listsStore.selectedListId = list.id;
        tasksStore.selectedTaskId = null;
        tasksStore.listTasks(list.id);
      }}
    >
      {isRename ? (
        <TaskRename
          list={list}
          onClose={() => {
            setIsRename(false);
          }}
        />
      ) : (
        <TaskListTitle> {list.shortTitle}</TaskListTitle>
      )}
      {/* <Pill>{tasksStore.getTasks(list.id).length}</Pill> */}
      <ButtonGroup hidden>
        <EditButton
          onClick={() => {
            setIsRename(true);
          }}
          color="#eee"
          size="24"
        />
        <DeleteButton
          onClick={() => {
            setIsOpenDeleteDialog(true);
          }}
          color="#eee"
          size="24"
        />
        <DeleteListDialog
          isOpen={isOpenDeleteDialog}
          onClose={() => setIsOpenDeleteDialog(false)}
          listTitle={list.title}
          deleteList={() => listsStore.deleteTaskList(list.id)}
        />
      </ButtonGroup>
    </List>
  );
};

export default view(TaskList);
