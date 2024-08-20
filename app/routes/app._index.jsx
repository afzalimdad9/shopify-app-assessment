import { json, Link, useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import { BlockStack, Layout, Page } from "@shopify/polaris";
import TicketsTable from "../components/TicketsTable";
import { getTickets } from "../models/Ticket.server";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const tickets = await getTickets(session.shop, admin.graphql);

  return json({
    tickets,
  });
}

export default function Index() {
  const { tickets } = useLoaderData();
  return (
    <Page>
      <TitleBar title="ZenDesk Ticket Generate">
        <Link to="/app/tickets/create">Create Ticket</Link>
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <TicketsTable tickets={tickets} />
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
