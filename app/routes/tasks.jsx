import {json, redirect} from "@remix-run/node";
import {Form, Link, NavLink, Outlet, useLoaderData, useSubmit} from "@remix-run/react";

import {checkTask, getTaskListItems} from "~/models/task.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export async function action({ request, params }) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const taskId = formData.get("taskId");
  const checked = formData.get("checked");

  await checkTask({ id: taskId, userId, checked: !!checked });

  return redirect("/tasks");
}

export async function loader({ request }) {
  const userId = await requireUserId(request);
  const tasks = await getTaskListItems({ userId });
  return json({ tasks });
}

export default function TasksPage() {
  const submit = useSubmit();
  const data = useLoaderData();
  const user = useUser();

  function handleChange(event) {
    submit(event.currentTarget, { replace: true });
  }

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Tasks</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Task
          </Link>

          <hr />

          {data.tasks.length === 0 ? (
            <p className="p-4">No tasks yet</p>
          ) : (
            <ol>
              {data.tasks.map((task) => (
                <li key={task.id}>
                  <div className="flex w-full items-center px-3">
                    <Form method="post" onChange={handleChange}>
                      <input type="hidden" name="taskId" value={task.id}/>
                      <input type="checkbox" name="checked" value="true" checked={task.checked} defaultChecked={false}/>
                    </Form>
                    <NavLink
                      className={({ isActive }) =>
                        `border-b p-4 text-xl w-full ${isActive ? "bg-white" : ""}`
                      }
                      to={task.id}
                    >
                      {task.description}
                    </NavLink>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
