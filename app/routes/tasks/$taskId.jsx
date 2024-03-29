import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteTask, getTask } from "~/models/task.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }) {
  const userId = await requireUserId(request);
  invariant(params.taskId, "taskId not found");

  const task = await getTask({ userId, id: params.taskId });
  if (!task) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ task });
}

export async function action({ request, params }) {
  const userId = await requireUserId(request);
  invariant(params.taskId, "taskId not found");

  await deleteTask({ userId, id: params.taskId });

  return redirect("/tasks");
}

export default function TaskDetailsPage() {
  const data = useLoaderData();

  return (
    <div>
      <p className="py-6">{data.task.description}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Task not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
