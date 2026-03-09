import { getSql } from "@/lib/db";
import type { Subscriber } from "@/lib/types";

type SubscriberRow = {
  id: string;
  email: string;
  verified: boolean;
  created_at: string;
};

function mapSubscriber(row: SubscriberRow): Subscriber {
  return {
    id: row.id,
    email: row.email,
    verified: row.verified,
    createdAt: row.created_at
  };
}

export async function addSubscriber(email: string) {
  const sql = getSql();
  const [row] = await sql<SubscriberRow[]>`
    insert into subscribers (email, verified)
    values (${email}, true)
    on conflict (email) do update set verified = true
    returning id, email, verified, created_at
  `;

  return mapSubscriber(row);
}

export async function removeSubscriber(email: string) {
  const sql = getSql();
  await sql`delete from subscribers where email = ${email}`;
}

export async function listSubscribers(): Promise<Subscriber[]> {
  const sql = getSql();
  const rows = await sql<SubscriberRow[]>`
    select id, email, verified, created_at
    from subscribers
    where verified = true
    order by created_at desc
  `;

  return rows.map(mapSubscriber);
}
