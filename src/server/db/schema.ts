// to push to db: pnpm db:push

import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  numeric,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `panda_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  role: varchar("role", { length: 25 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const disposable_items = createTable("disposable_items", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  quantity: integer("quantity").default(0).notNull(),
});

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const menuItems = createTable("menu_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type").notNull(),
});

export const orders = createTable("orders", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp")
    .default(sql`now()`)
    .notNull(),
  total: numeric("total", { scale: 2 }).notNull(),
  customerId: integer("customer_id").notNull(),
});

export const sizes = createTable("sizes", {
  id: serial("id").primaryKey(),
  price: numeric("price", { scale: 2 }).notNull(),
  name: varchar("name").notNull(),
  numMains: integer("num_mains").notNull(),
  numSides: integer("num_sides").notNull(),
});

export const containers = createTable("containers", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id)
    .notNull(),
  sizeId: integer("size_id")
    .references(() => sizes.id)
    .notNull(),
});

export const containersToMenu = createTable("containers_to_menu", {
  id: serial("id").primaryKey(),
  containerId: integer("container_id")
    .references(() => containers.id)
    .notNull(),
  itemId: integer("item_id")
    .references(() => menuItems.id)
    .notNull(),
  itemType: varchar("item_type").notNull(),
});

export const employees = createTable("employees", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  role: varchar("role").notNull(),
});

export const ingredients = createTable("ingredients", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  quantity: integer("quantity").default(0).notNull(),
});

export const menuToIngredients = createTable("menu_to_ingredients", {
  id: serial("id").primaryKey(),
  menuId: integer("menu_id")
    .references(() => menuItems.id)
    .notNull(),
  ingredientId: integer("ingredient_id")
    .references(() => ingredients.id)
    .notNull(),
});

// TODO: See if it's better to merge this into the employees table so that we can have a "users" table instead
export const customers = createTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
});
