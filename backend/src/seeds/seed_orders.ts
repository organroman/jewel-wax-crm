import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("order_stage_statuses").del();
  await knex("orders").del();

  await knex("orders").insert([
    {
      id: 1,
      name: "Order 1",
      description: "Description for order 1",
      notes: "Some notes about order 1",
      number: "0001",
      created_by: 10,
      customer_id: 13,
      amount: 705.73,
      active_stage: "done",
      modeller_id: 11,
      modeling_cost: 81.16,
      miller_id: 10,
      milling_cost: 25.67,
      created_at: "2025-06-02T13:25:06.201402",
      updated_at: "2025-06-02T13:25:06.201413",
    },
    {
      id: 2,
      name: "Order 2",
      description: "Description for order 2",
      notes: "Some notes about order 2",
      number: "0002",
      created_by: 10,
      customer_id: 21,
      amount: 234.62,
      modeller_id: 11,
      modeling_cost: 81.16,
      active_stage: "delivery",
      created_at: "2025-06-02T13:25:06.201421",
      updated_at: "2025-06-02T13:25:06.201423",
    },
    {
      id: 3,
      name: "Order 3",
      description: "Description for order 3",
      notes: "Some notes about order 3",
      number: "0003",
      created_by: 10,
      customer_id: 13,
      amount: 974.96,
      miller_id: 10,
      milling_cost: 125.67,
      active_stage: "milling",
      created_at: "2025-06-02T13:25:06.201429",
      updated_at: "2025-06-02T13:25:06.201431",
    },
    {
      id: 4,
      name: "Order 4",
      description: "Description for order 4",
      notes: "Some notes about order 4",
      number: "0004",
      created_by: 10,
      customer_id: 21,
      amount: 911.36,
      printer_id: 10,
      printing_cost: 124.67,
      active_stage: "printing",
      created_at: "2025-06-02T13:25:06.201436",
      updated_at: "2025-06-02T13:25:06.201438",
    },
    {
      id: 5,
      name: "Order 5",
      description: "Description for order 5",
      notes: "Some notes about order 5",
      number: "0005",
      created_by: 10,
      customer_id: 13,
      amount: 605.71,
      active_stage: "modeling",
      created_at: "2025-06-02T13:25:06.201443",
      updated_at: "2025-06-02T13:25:06.201445",
    },
    {
      id: 6,
      name: "Order 6",
      description: "Description for order 6",
      notes: "Some notes about order 6",
      number: "0006",
      created_by: 10,
      customer_id: 21,
      amount: 755.42,
      active_stage: "new",
      created_at: "2025-06-02T13:25:06.201450",
      updated_at: "2025-06-02T13:25:06.201452",
    },
    {
      id: 7,
      name: "Order 7",
      description: "Description for order 7",
      notes: "Some notes about order 7",
      number: "0007",
      created_by: 10,
      customer_id: 13,
      amount: 951.1,
      active_stage: "delivery",
      created_at: "2025-06-02T13:25:06.201458",
      updated_at: "2025-06-02T13:25:06.201459",
    },
    {
      id: 8,
      name: "Order 8",
      description: "Description for order 8",
      notes: "Some notes about order 8",
      number: "0008",
      created_by: 10,
      customer_id: 21,

      amount: 968.26,
      active_stage: "done",
      created_at: "2025-06-02T13:25:06.201468",
      updated_at: "2025-06-02T13:25:06.201472",
    },
    {
      id: 9,
      name: "Order 9",
      description: "Description for order 9",
      notes: "Some notes about order 9",
      number: "0009",
      created_by: 10,
      customer_id: 13,

      amount: 956.11,
      active_stage: "milling",
      created_at: "2025-06-02T13:25:06.201481",
      updated_at: "2025-06-02T13:25:06.201484",
    },
    {
      id: 10,
      name: "Order 10",
      description: "Description for order 10",
      notes: "Some notes about order 10",
      number: "0010",
      created_by: 10,
      customer_id: 21,

      amount: 888.35,
      active_stage: "delivery",
      created_at: "2025-06-02T13:25:06.201493",
      updated_at: "2025-06-02T13:25:06.201496",
    },
  ]);
  await knex("order_stage_statuses").insert([
    {
      order_id: 1,
      stage: "modeling",
      status: "done",
      started_at: "2025-06-02T13:25:06.201729",
      completed_at: "2025-06-05T13:25:06.201729",
      created_at: "2025-06-02T13:25:06.201750",
      updated_at: "2025-06-02T13:25:06.201752",
    },
    {
      order_id: 1,
      stage: "milling",
      status: "clarification",
      started_at: "2025-05-29T13:25:06.201756",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.201760",
      updated_at: "2025-06-02T13:25:06.201762",
    },
    {
      order_id: 1,
      stage: "printing",
      status: "pending",
      started_at: "2025-05-31T13:25:06.201765",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.201769",
      updated_at: "2025-06-02T13:25:06.201771",
    },
    {
      order_id: 2,
      stage: "modeling",
      status: "in_process",
      started_at: "2025-05-30T13:25:06.201774",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.201777",
      updated_at: "2025-06-02T13:25:06.201779",
    },
    {
      order_id: 2,
      stage: "milling",
      status: "clarification",
      started_at: "2025-05-30T13:25:06.201782",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.201785",
      updated_at: "2025-06-02T13:25:06.201787",
    },
    {
      order_id: 2,
      stage: "printing",
      status: "done",
      started_at: "2025-05-28T13:25:06.201790",
      completed_at: "2025-05-30T13:25:06.201790",
      created_at: "2025-06-02T13:25:06.201796",
      updated_at: "2025-06-02T13:25:06.201798",
    },
    {
      order_id: 3,
      stage: "modeling",
      status: "done",
      started_at: "2025-05-29T13:25:06.201802",
      completed_at: "2025-05-31T13:25:06.201802",
      created_at: "2025-06-02T13:25:06.201810",
      updated_at: "2025-06-02T13:25:06.201812",
    },
    {
      order_id: 3,
      stage: "milling",
      status: "clarification",
      started_at: "2025-05-28T13:25:06.201816",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.201819",
      updated_at: "2025-06-02T13:25:06.201821",
    },
    {
      order_id: 3,
      stage: "printing",
      status: "in_process",
      started_at: "2025-05-30T13:25:06.201824",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.201828",
      updated_at: "2025-06-02T13:25:06.201830",
    },
    {
      order_id: 4,
      stage: "modeling",
      status: "in_process",
      started_at: "2025-06-02T13:25:06.201833",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.201836",
      updated_at: "2025-06-02T13:25:06.201838",
    },
    {
      order_id: 4,
      stage: "milling",
      status: "pending",
      started_at: "2025-05-30T13:25:06.201841",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.201860",
      updated_at: "2025-06-02T13:25:06.201863",
    },
    {
      order_id: 4,
      stage: "printing",
      status: "done",
      started_at: "2025-05-28T13:25:06.201868",
      completed_at: "2025-05-31T13:25:06.201868",
      created_at: "2025-06-02T13:25:06.201879",
      updated_at: "2025-06-02T13:25:06.201882",
    },
    {
      order_id: 5,
      stage: "modeling",
      status: "done",
      started_at: "2025-05-28T13:25:06.201886",
      completed_at: "2025-05-31T13:25:06.201886",
      created_at: "2025-06-02T13:25:06.201892",
      updated_at: "2025-06-02T13:25:06.201894",
    },
    {
      order_id: 5,
      stage: "milling",
      status: "clarification",
      started_at: "2025-05-29T13:25:06.201897",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.201900",
      updated_at: "2025-06-02T13:25:06.201902",
    },
    {
      order_id: 5,
      stage: "printing",
      status: "clarification",
      started_at: "2025-05-31T13:25:06.201905",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.201909",
      updated_at: "2025-06-02T13:25:06.201912",
    },
    {
      order_id: 6,
      stage: "modeling",
      status: "clarification",
      started_at: "2025-05-29T13:25:06.201916",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.201922",
      updated_at: "2025-06-02T13:25:06.201925",
    },
    {
      order_id: 6,
      stage: "milling",
      status: "done",
      started_at: "2025-06-02T13:25:06.201929",
      completed_at: "2025-06-03T13:25:06.201929",
      created_at: "2025-06-02T13:25:06.201938",
      updated_at: "2025-06-02T13:25:06.201941",
    },
    {
      order_id: 6,
      stage: "printing",
      status: "done",
      started_at: "2025-05-30T13:25:06.201945",
      completed_at: "2025-06-02T13:25:06.201945",
      created_at: "2025-06-02T13:25:06.201956",
      updated_at: "2025-06-02T13:25:06.201959",
    },
    {
      order_id: 7,
      stage: "modeling",
      status: "clarification",
      started_at: "2025-05-28T13:25:06.201963",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.201968",
      updated_at: "2025-06-02T13:25:06.201971",
    },
    {
      order_id: 7,
      stage: "milling",
      status: "done",
      started_at: "2025-06-01T13:25:06.201975",
      completed_at: "2025-06-03T13:25:06.201975",
      created_at: "2025-06-02T13:25:06.201984",
      updated_at: "2025-06-02T13:25:06.201988",
    },
    {
      order_id: 7,
      stage: "printing",
      status: "pending",
      started_at: "2025-06-01T13:25:06.201992",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.201995",
      updated_at: "2025-06-02T13:25:06.201997",
    },
    {
      order_id: 8,
      stage: "modeling",
      status: "done",
      started_at: "2025-05-30T13:25:06.202000",
      completed_at: "2025-06-01T13:25:06.202000",
      created_at: "2025-06-02T13:25:06.202006",
      updated_at: "2025-06-02T13:25:06.202008",
    },
    {
      order_id: 8,
      stage: "milling",
      status: "clarification",
      started_at: "2025-05-28T13:25:06.202010",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.202014",
      updated_at: "2025-06-02T13:25:06.202016",
    },
    {
      order_id: 8,
      stage: "printing",
      status: "negotiation",
      started_at: "2025-05-29T13:25:06.202018",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.202022",
      updated_at: "2025-06-02T13:25:06.202023",
    },
    {
      order_id: 9,
      stage: "modeling",
      status: "done",
      started_at: "2025-05-28T13:25:06.202027",
      completed_at: "2025-05-30T13:25:06.202027",
      created_at: "2025-06-02T13:25:06.202036",
      updated_at: "2025-06-02T13:25:06.202039",
    },
    {
      order_id: 9,
      stage: "milling",
      status: "clarification",
      started_at: "2025-05-31T13:25:06.202043",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.202049",
      updated_at: "2025-06-02T13:25:06.202051",
    },
    {
      order_id: 9,
      stage: "printing",
      status: "in_process",
      started_at: "2025-05-30T13:25:06.202056",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.202061",
      updated_at: "2025-06-02T13:25:06.202063",
    },
    {
      order_id: 10,
      stage: "modeling",
      status: "done",
      started_at: "2025-06-01T13:25:06.202067",
      completed_at: "2025-06-02T13:25:06.202067",
      created_at: "2025-06-02T13:25:06.202077",
      updated_at: "2025-06-02T13:25:06.202080",
    },
    {
      order_id: 10,
      stage: "milling",
      status: "pending",
      started_at: "2025-05-28T13:25:06.202084",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.202090",
      updated_at: "2025-06-02T13:25:06.202092",
    },
    {
      order_id: 10,
      stage: "printing",
      status: "pending",
      started_at: "2025-06-01T13:25:06.202097",
      completed_at: null,
      created_at: "2025-06-02T13:25:06.202102",
      updated_at: "2025-06-02T13:25:06.202104",
    },
  ]);
}
