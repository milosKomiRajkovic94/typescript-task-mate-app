import React, { useState } from 'react';
import { useCreateTaskMutation } from '../generated/graphql';

interface Props {
  onTaskCreated: () => void;
}

const CreateTaskForm: React.FC<Props> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [createTask, { loading, error }] = useCreateTaskMutation({
    onCompleted: () => {
      onTaskCreated();
      setTitle('');
    }
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loading && title) {
      createTask({
        variables: {
          input: {
            title
          }
        }
      });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="alert-error">An error occurred.</p>}
      <input
        type="text"
        name="title"
        placeholder="What would you like to get done?"
        autoComplete="off"
        className="text-input new-task-text-input"
        value={title}
        onChange={handleChange}
      />
    </form>
  );
};

export default CreateTaskForm;
