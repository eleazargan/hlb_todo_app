import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";

import { createTask } from "~/models/task.server";
import { requireUserId } from "~/session.server";

export async function action({ request }) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const description = formData.get("description");

  if (typeof description !== "string" || description.length === 0) {
    return json(
      { errors: { description: "Description is required" } },
      { status: 400 }
    );
  }

  const task = await createTask({ description, userId });

  return redirect(`/tasks/${task.id}`);
}

export default function NewTaskPage() {
  const actionData = useActionData();
  const descriptionRef = React.useRef(null);

  React.useEffect(() => {
    if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Description: </span>
          <textarea
            ref={descriptionRef}
            name="description"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.description ? true : undefined}
            aria-errormessage={
              actionData?.errors?.description ? "description-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.description && (
          <div className="pt-1 text-red-700" id="description-error">
            {actionData.errors.description}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
