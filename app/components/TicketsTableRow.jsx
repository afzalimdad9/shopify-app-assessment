import { IndexTable, Link } from "@shopify/polaris";
import { truncate } from "../utils/truncate";

export const TicketsTableRow = ({ ticket }) => (
  <IndexTable.Row id={ticket.id} position={ticket.id}>
    <IndexTable.Cell>
      <Link removeUnderline url={`tickets/${ticket.id}`}>
        {ticket.id}
      </Link>
    </IndexTable.Cell>
    <IndexTable.Cell>
      <Link removeUnderline url={`url/${ticket.id}`}>
        {truncate(ticket.title)}
      </Link>
    </IndexTable.Cell>
    <IndexTable.Cell>{ticket.status}</IndexTable.Cell>
    <IndexTable.Cell>{new Date(ticket.date).toDateString()}</IndexTable.Cell>
  </IndexTable.Row>
);
