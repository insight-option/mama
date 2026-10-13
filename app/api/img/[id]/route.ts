import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { getUrl } from "aws-amplify/storage/server";
import outputs from "@/amplify_outputs.json";
import { getProduct } from "@/lib/catalog";
import { LOCAL_MOCK } from "@/lib/local-mock/flag";

/**
 * Stable public link to a product's photo: /api/img/<product-id>.
 * Used in WhatsApp order messages and for photos uploaded from the admin
 * workspace. Redirects to the static file, or to a short-lived signed S3
 * link for uploaded photos (read with guest access, no sign-in).
 */
const { runWithAmplifyServerContext } = createServerRunner({ config: outputs });

export const revalidate = 60;

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { item, record } = await getProduct(decodeURIComponent(params.id));

  // Before products are imported, the bundled menu is the catalogue.
  if (!record) {
    if (item?.image && !item.image.remote) {
      return Response.redirect(new URL(encodeURI(item.image.src), request.url), 302);
    }
    return new Response("Not found", { status: 404 });
  }

  if (record.imageKey && LOCAL_MOCK) {
    return Response.redirect(new URL(`/api/local-mock/files/${record.imageKey}`, request.url), 302);
  }

  if (record.imageKey) {
    try {
      const { url } = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: (context) =>
          getUrl(context, {
            path: record.imageKey!,
            options: { expiresIn: 3600, validateObjectExistence: false },
          }),
      });
      return Response.redirect(url.toString(), 302);
    } catch (error) {
      console.error("Image link failed:", error);
      return new Response("Image unavailable", { status: 502 });
    }
  }

  if (record.imagePath) {
    return Response.redirect(new URL(encodeURI(record.imagePath), request.url), 302);
  }
  return new Response("No image", { status: 404 });
}
