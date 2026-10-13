// LOCAL MOCK ONLY — stands in for AppSync (products) and S3 (photos) while
// testing the admin workspace with `npm run dev:mock`. Answers 404 in every
// other mode, including all production builds.
//
//   GET    /api/local-mock/products            list
//   POST   /api/local-mock/products            create
//   GET    /api/local-mock/products/<id>       get
//   PATCH  /api/local-mock/products/<id>       update (partial)
//   DELETE /api/local-mock/products/<id>       delete
//   PUT    /api/local-mock/files/products/<f>  upload photo (raw JPEG body)
//   GET    /api/local-mock/files/products/<f>  read photo (public, like guest S3 read)
//   DELETE /api/local-mock/files/products/<f>  delete photo
import { LOCAL_MOCK } from "@/lib/local-mock/flag";
import * as store from "@/lib/local-mock/store";

export const dynamic = "force-dynamic";

type Params = { params: { slug: string[] } };

/** Mirrors the backend rule: anyone reads, only the ADMIN group writes. */
const ADMIN_HEADER = "x-local-mock-admin";

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

async function handle(request: Request, { params }: Params) {
  if (!LOCAL_MOCK) return new Response("Not found", { status: 404 });

  const [resource, ...rest] = params.slug;
  const method = request.method;
  const write = method !== "GET";
  if (write && request.headers.get(ADMIN_HEADER) !== "1") {
    return json({ message: "Not authorized (mock: ADMIN session required)" }, 401);
  }

  try {
    if (resource === "products") {
      const id = rest.length ? decodeURIComponent(rest.join("/")) : null;
      if (!id && method === "GET") return json(await store.listProducts());
      if (!id && method === "POST") return json(await store.createProduct(await request.json()), 201);
      if (id && method === "GET") return json(await store.getProduct(id));
      if (id && method === "PATCH") return json(await store.updateProduct({ ...(await request.json()), id }));
      if (id && method === "DELETE") {
        await store.deleteProduct(id);
        return json({ id });
      }
    }

    if (resource === "files" && rest.length) {
      const key = rest.map(decodeURIComponent).join("/");
      if (method === "GET") {
        const data = await store.readImage(key);
        if (!data) return new Response("Not found", { status: 404 });
        return new Response(new Uint8Array(data), {
          headers: { "content-type": "image/jpeg", "cache-control": "no-store" },
        });
      }
      if (method === "PUT") {
        await store.saveImage(key, Buffer.from(await request.arrayBuffer()));
        return json({ path: key }, 201);
      }
      if (method === "DELETE") {
        await store.deleteImage(key);
        return json({ path: key });
      }
    }

    return json({ message: "Unknown mock route" }, 404);
  } catch (error) {
    if (error instanceof store.MockError) return json({ message: error.message }, error.status);
    console.error("[local-mock]", error);
    return json({ message: "Mock store error" }, 500);
  }
}

export { handle as GET, handle as POST, handle as PATCH, handle as PUT, handle as DELETE };
