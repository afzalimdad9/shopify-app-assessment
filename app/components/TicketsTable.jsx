import { IndexTable } from "@shopify/polaris";
import { TicketsTableRow } from "./TicketsTableRow";

export default function TicketsTable({ tickets }) {
    return (
      <IndexTable
        resourceName={{
          singular: "Ticket",
          plural: "Tickets",
        }}
        itemCount={tickets?.length}
        headings={[
          { title: "No." },
          { title: "Inquiry" },
          { title: "Status" },
          { title: "Date" },
        ]}
        selectable={false}
      >
        {tickets.map((ticket) => (
          <TicketsTableRow key={ticket.id} ticket={ticket} />
        ))}
      </IndexTable>
    );
};
