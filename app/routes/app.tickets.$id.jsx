import {
  json,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  BlockStack,
  Card,
  Divider,
  Layout,
  Page,
  PageActions,
  TextField
} from "@shopify/polaris";
import { useState } from "react";
import prisma from "../db.server";
import { getTicket, validateTicket } from "../models/Ticket.server";
import { authenticate } from "../shopify.server";

export async function loader({ request, params }) {
  const { admin, session } = await authenticate.admin(request);

  if (params.id === "create") {
    return json({
      desc: "",
      title: "",
      shop: session.shop,
    });
  }

  return json(await getTicket(Number(params.id), admin.graphql));
}

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  /** @type {any} */
  const data = {
    ...Object.fromEntries(await request.formData()),
    shop,
  };

  if (data.action === "delete") {
    await prisma.ticket.delete({ where: { id: Number(params.id) } });
    return redirect("/app");
  }

  const errors = validateTicket(data);

  if (errors) {
    return json({ errors }, { status: 422 });
  }

  const ticket =
    params.id === "create"
      ? await prisma.ticket.create({ data })
      : await prisma.ticket.update({ where: { id: Number(params.id) }, data });

  return redirect(`/app/tickets/${ticket.id}`);
}

export default function TicketForm() {
  const errors = useActionData()?.errors || {};

  const ticket = useLoaderData();
  const [formState, setFormState] = useState(ticket);
  const [cleanFormState, setCleanFormState] = useState(ticket);
  const isDirty = JSON.stringify(formState) !== JSON.stringify(cleanFormState);

  const nav = useNavigation();
  const isSaving =
    nav.state === "submitting" && nav.formData?.get("action") !== "delete";
  const isDeleting =
    nav.state === "submitting" && nav.formData?.get("action") === "delete";

  const navigate = useNavigate();

  const submit = useSubmit();
  function handleSave() {
    const data = {
      title: formState.title,
      desc: formState.desc || "",
      shop: formState.shop || "",
    };

    setCleanFormState({ ...formState });
    submit(data, { method: "post" });
  }

  return (
    <Page>
      <TitleBar title={"/ " + (ticket.id ? "Edit Ticket" : "Create Ticket")}>
        <button variant="breadcrumb" onClick={() => navigate("/app")}>
          ZenDesk Ticket Generate
        </button>
      </TitleBar>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <TextField
                id="title"
                label="Title"
                autoComplete="off"
                value={formState.title}
                onChange={(title) => setFormState({ ...formState, title })}
                error={errors.title}
              />
              <Divider />
              <TextField
                id="desc"
                label="Description"
                autoComplete="off"
                value={formState.desc}
                multiline={12}
                onChange={(desc) => setFormState({ ...formState, desc })}
                error={errors.desc}
              />
              <Divider />
            </BlockStack>
            <PageActions
              secondaryActions={[
                {
                  content: "Delete",
                  loading: isDeleting,
                  disabled: !ticket.id || !ticket || isSaving || isDeleting,
                  destructive: true,
                  outline: true,
                  onAction: () =>
                    submit({ action: "delete" }, { method: "post" }),
                },
              ]}
              primaryAction={{
                content: "Save",
                loading: isSaving,
                disabled: !isDirty || isSaving || isDeleting,
                onAction: handleSave,
              }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
