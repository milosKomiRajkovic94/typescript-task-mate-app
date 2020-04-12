import React, { useEffect, useContext } from 'react';
import Link from 'next/link';
import {
  Task,
  useDeleteTaskMutation,
  TasksQuery,
  TasksQueryVariables,
  TasksDocument,
  TaskStatus,
  useChangeStatusMutation
} from '../generated/graphql';
import {TaskFilterContext} from '../pages/[status]';

interface Props {
  task: Task;
}

const TaskListItem: React.FC<Props> = ({ task }) => {
  const {status} = useContext(TaskFilterContext)
  const [deleteTask, { loading, error }] = useDeleteTaskMutation({
    update: (cache, result) => {
      const data = cache.readQuery<TasksQuery, TasksQueryVariables>({
        query: TasksDocument,
        variables: { status: TaskStatus.Active }
      });

      if (data) {
        cache.writeQuery<TasksQuery, TasksQueryVariables>({
          query: TasksDocument,
          variables: { status: TaskStatus.Active },
          data: {
            tasks: data.tasks.filter(
              ({ id }) => id !== result.data?.deleteTask?.id
            )
          }
        });
      }
    }
  });
  const handleDeleteClick = () => {
    deleteTask({ variables: { id: task.id } });
  };

  const [changeStatus, {loading: changeStatusLoading, error: changeStatusError}] = useChangeStatusMutation();

  const handleChangeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = task.status === TaskStatus.Active ? TaskStatus.Completed : TaskStatus.Active;
    changeStatus({variables: {
      id: task.id,
      status: newStatus
    }})
  }

  useEffect(() => {
    if (error) {
      alert('An error occurred.');
    }

    if(changeStatusError){
      alert('Could not change the task status.')
    }
  }, [error, changeStatusError]);

  return (
    <li className="task-list-item" key={task.id}>
      <label className={'checkbox'}>
        <input disabled={changeStatusLoading} checked={task.status === TaskStatus.Completed} type={'checkbox'} onChange={handleChangeStatus} />
        <span className={'checkbox-mark'}>&#10003;</span>
      </label>
      <Link href="/update/[id]" as={`/update/${task.id}`}>
        <a className="task-list-item-title">{task.title}</a>
      </Link>
      <button
        disabled={loading}
        onClick={handleDeleteClick}
        className="task-list-item-delete"
      >
        &times;
      </button>
    </li>
  );
};

export default TaskListItem;
