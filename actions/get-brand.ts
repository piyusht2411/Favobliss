import { Brand } from "@/types";

// export async function getBrandBySlug(
//   slug: string,
//   storeId: string
// ): Promise<Brand | null> {
//   try {
//     const brand = await db.brand.findFirst({
//       where: {
//         slug,
//         storeId,
//       },
//     });

//     if (!brand) {
//       return null;
//     }

//     return {
//       id: brand.id,
//       storeId: brand.storeId,
//       name: brand.name,
//       slug: brand.slug,
//       imageUrl: brand.imageUrl || null,
//       createdAt: brand.createdAt.toISOString(),
//       updatedAt: brand.updatedAt.toISOString(),
//     };
//   } catch (error) {
//     console.error("[GET_BRAND_BY_SLUG]", error);
//     return null;
//   }
// }

const URL = `${process.env.NEXT_PUBLIC_API_URL}/brands`;

export const getBrandBySlug = async (slug: string): Promise<Brand> => {
  const res = await fetch(`${URL}?slug=${slug}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Product not found");
  }
  return res.json();
};
