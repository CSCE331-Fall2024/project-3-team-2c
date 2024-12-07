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
 * Creates a table with a `panda_` prefix for multi-project schema support.
 * Ensures all tables are namespaced to avoid conflicts across projects.
 * 
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `panda_${name}`);

/**
 * Users Table
 * Stores information about the users in the system.
 * 
 * Fields:
 * - `id` (Primary Key): UUID identifier for the user.
 * - `name`: User's name.
 * - `email`: Email address (must be unique and not null).
 * - `emailVerified`: Timestamp of email verification, defaults to `CURRENT_TIMESTAMP`.
 * - `image`: URL to the user's profile picture.
 * - `role`: The role of the user (e.g., admin, customer, etc.).
 */
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

/**
 * Defines relationships for the Users Table.
 * - `accounts`: One user can have many linked accounts (e.g., OAuth).
 */
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

/**
 * Accounts Table
 * Stores third-party account information for user authentication.
 * 
 * Fields:
 * - `userId`: References the user linked to the account.
 * - `type`: The type of account (e.g., OAuth).
 * - `provider`: Name of the authentication provider (e.g., Google, Facebook).
 * - `providerAccountId`: Unique ID for the account in the provider's system.
 * - `refresh_token`, `access_token`, `expires_at`, etc.: OAuth-related fields.
 * 
 * Keys:
 * - Primary Key: `provider` and `providerAccountId`.
 * - Index: `userIdIdx` for efficient querying by `userId`.
 */
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

/**
 * Defines relationships for the Accounts Table.
 * - `user`: Each account is linked to one user.
 */
export const disposable_items = createTable("disposable_items", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  quantity: integer("quantity").default(0).notNull(),
});



/**
 * Defines relationships for the Accounts Table.
 * - `user`: Each account is linked to one user.
 */
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

/**
 * Sessions Table
 * Stores session data for authenticated users.
 *
 * Fields:
 * - `sessionToken`: Unique token for the session.
 * - `userId`: References the user associated with the session.
 * - `expires`: Expiry timestamp for the session.
 */
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

/**
 * Defines relationships for the Sessions Table.
 * - `user`: Each session is linked to one user.
 */
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

/**
 * Verification Tokens Table
 * Stores tokens used for verifying user actions, such as email verification or password reset.
 *
 * Fields:
 * - `identifier`: A unique identifier for the action or purpose of the token (e.g., user email).
 * - `token`: The actual token string used for verification.
 * - `expires`: The expiration timestamp for the token.
 *
 */
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

/**
 * Menu Items Table
 * Stores menu items available for orders.
 * 
 * Fields:
 * - `id` (Primary Key): Unique identifier for the menu item.
 * - `name`: Name of the menu item.
 * - `type`: Type of the menu item (e.g., entree, side, drink).
 */
export const menuItems = createTable("menu_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type").notNull(),
});


/**
 * Orders Table
 * Stores customer orders and their details.
 * 
 * Fields:
 * - `id` (Primary Key): Unique identifier for the order.
 * - `timestamp`: When the order was created, defaults to `now()`.
 * - `total`: Total price of the order.
 * - `customerId`: References the customer who placed the order.
 */
export const orders = createTable("orders", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp")
    .default(sql`now()`)
    .notNull(),
  total: numeric("total", { scale: 2 }).notNull(),
  customerId: integer("customer_id").notNull(),
});

/**
 * Sizes Table
 * Defines available sizes for menu items.
 * 
 * Fields:
 * - `id` (Primary Key): Unique identifier for the size.
 * - `price`: Price of the size.
 * - `name`: Name of the size (e.g., small, large).
 * - `numMains`: Number of mains allowed for this size.
 * - `numSides`: Number of sides allowed for this size.
 */
export const sizes = createTable("sizes", {
  id: serial("id").primaryKey(),
  price: numeric("price", { scale: 2 }).notNull(),
  name: varchar("name").notNull(),
  numMains: integer("num_mains").notNull(),
  numSides: integer("num_sides").notNull(),
});

/**
 * Containers Table
 * Tracks containers used in customer orders.
 * 
 * Fields:
 * - `id` (Primary Key): Unique identifier for the container.
 * - `orderId`: References the order this container belongs to.
 * - `sizeId`: References the size of the container.
 */
export const containers = createTable("containers", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id)
    .notNull(),
  sizeId: integer("size_id")
    .references(() => sizes.id)
    .notNull(),
});


/**
 * Containers to Menu Table
 * Tracks the relationship between containers and menu items.
 *
 * Fields:
 * - `id` (Primary Key): Unique identifier for the relationship.
 * - `containerId`: References the container containing the item.
 * - `itemId`: References the menu item included in the container.
 * - `itemType`: Specifies the type of the item (e.g., main, side).
 */
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

/**
 * Employees Table
 * Stores employee details in the system.
 *
 * Fields:
 * - `id` (Primary Key): Unique identifier for the employee.
 * - `name`: Full name of the employee.
 * - `email`: Email address of the employee.
 * - `role`: Role of the employee (e.g., cashier, manager).
 */
export const employees = createTable("employees", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  role: varchar("role").notNull(),
});

/**
 * Ingredients Table
 * Stores ingredients available in inventory.
 * 
 * Fields:
 * - `id` (Primary Key): Unique identifier for the ingredient.
 * - `name`: Name of the ingredient.
 * - `quantity`: Quantity available, defaults to 0.
 */
export const ingredients = createTable("ingredients", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  quantity: integer("quantity").default(0).notNull(),
});

/**
 * Menu to Ingredients Table
 * Tracks the relationship between menu items and their required ingredients.
 *
 * Fields:
 * - `id` (Primary Key): Unique identifier for the relationship.
 * - `menuId`: References the menu item using the ingredient.
 * - `ingredientId`: References the ingredient used in the menu item.
 */
export const menuToIngredients = createTable("menu_to_ingredients", {
  id: serial("id").primaryKey(),
  menuId: integer("menu_id")
    .references(() => menuItems.id)
    .notNull(),
  ingredientId: integer("ingredient_id")
    .references(() => ingredients.id)
    .notNull(),
});

/**
 * Customers Table
 * Stores customer details.
 *
 * Fields:
 * - `id` (Primary Key): Unique identifier for the customer.
 * - `name`: Full name of the customer.
 * - `email`: Email address of the customer.
 *
 */
// TODO: See if it's better to merge this into the employees table so that we can have a "users" table instead
export const customers = createTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
});
