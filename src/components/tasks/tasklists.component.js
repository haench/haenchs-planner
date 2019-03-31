import React from "react";
import configStore from "stores/configStore";
import listsStore from "stores/listsStore";
import { view } from "react-easy-state";
import ListsForm from "components/tasks/listsForm.component";
import styled from "styled-components";
import Navigation from "components/navigation.component";

import TaskList from "components/tasks/tasklist.component";

const ListsPane = styled.div`
  background: ${props => props.theme.darkgrey};
  color: #fdfdfd;
  border-right: 1px solid #475760;
  flex: 0 0 256px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const GroupTitle = styled.div`
  margin: 10px 5px 5px 5px;
  font-weight: 500;
  font-size: 14px;
  scroll-snap-align: start;
`;

const ListOfGroups = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1 0;
  scroll-snap-type: y mandatory;
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.darkgrey};
  }
  ::-webkit-scrollbar-thumb {
    background: #475760;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #5e737f;
  }
`;

const ListOfTaskLists = styled.div`
  direction: ltr;
`;

const TaskLists = () => {
  const groups = [
    ...configStore.config.groups,
    configStore.config.defaultGroup
  ];
  const lists = listsStore.lists.filter(
    list => list.id !== configStore.configListId
  );
  // console.log(groups, lists, tasks);
  return (
    <ListsPane>
      <Navigation />
      <ListOfGroups>
        {groups.map(group => (
          <div key={group.id}>
            <GroupTitle>{group.name}</GroupTitle>
            <ListOfTaskLists>
              {lists
                .filter(list => list.group.id === group.id)
                .map(list => (
                  <TaskList
                    list={list}
                    key={list.id}
                    isSelected={listsStore.selectedListId === list.id}
                  />
                ))}
            </ListOfTaskLists>
          </div>
        ))}
      </ListOfGroups>
      <ListsForm
        saveTodo={title => listsStore.insertTaskList(title)}
        placeholder="Add list..."
      />
    </ListsPane>
  );
};

export default view(TaskLists);
