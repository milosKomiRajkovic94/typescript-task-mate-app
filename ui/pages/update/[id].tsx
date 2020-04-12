import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withApollo } from '../../lib/apollo';
import { useTaskQuery } from '../../generated/graphql';
import UpdateTaskForm from '../../components/UpdateTaskForm';

const UpdatePage: NextPage = () => {
  const router = useRouter();
  const id =
    typeof router.query.id === 'string' ? parseInt(router.query.id, 10) : NaN;
  const { loading, error, data } = useTaskQuery({
    variables: { id }
  });
  const task = data?.task;
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>An error occurred.</p>
      ) : task ? (
        <UpdateTaskForm initialValues={{ id: task.id, title: task.title }} />
      ) : (
        <p>Task not found.</p>
      )}
    </>
  );
};

export default withApollo(UpdatePage);
