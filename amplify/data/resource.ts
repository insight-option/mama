import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * Menu catalogue. Anyone can read products (public API key, used by the
 * website); only signed-in members of the ADMIN Cognito group can create,
 * update or delete them. The product id is its URL slug, e.g. "mansaf".
 *
 * Images: `imagePath` is a static file shipped with the site (the original
 * menu photos); `imageKey` is an S3 object uploaded from the admin
 * workspace and takes precedence when set.
 */
const schema = a.schema({
  Category: a.enum(["specials", "healthy", "salads", "pasta"]),
  PricingType: a.enum(["fixed", "serving"]),

  Product: a
    .model({
      category: a.ref("Category").required(),
      nameAr: a.string().required(),
      nameEn: a.string().required(),
      ingredientsAr: a.string().array(),
      ingredientsEn: a.string().array(),

      pricingType: a.ref("PricingType").required(),
      price: a.float(), // fixed price
      priceOne: a.float(), // serving: one person
      priceTwo: a.float(), // serving: two people

      offerActive: a.boolean(),
      offerPrice: a.float(),
      offerPriceOne: a.float(),
      offerPriceTwo: a.float(),
      offerLabelAr: a.string(),
      offerLabelEn: a.string(),

      imagePath: a.string(),
      imageKey: a.string(),
      imageWidth: a.integer(),
      imageHeight: a.integer(),
      imageAltAr: a.string(),
      imageAltEn: a.string(),
      imageLowResolution: a.boolean(),

      available: a.boolean(),
      featured: a.boolean(),
      sortOrder: a.integer(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.group("ADMIN"),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // The public website reads the menu with this key. 365 days is the
    // maximum; Amplify issues a new key on a deploy after it expires.
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
