export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  bannerImage: string;
  cardImage: string;
}

export interface Location {
  id: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

export enum CategoryType {
  MEN,
  WOMEN,
  UNISEX,
  BEAUTY,
}

export enum CategoryClassification {
  TOPWEAR,
  BOTTOMWEAR,
  FOOTWEAR,
  INNERWEARANDSLEEPWEAR,
  MAKEUP,
  SKINCARE,
  HAIRCARE,
  FRAGRANCES,
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  classification: CategoryClassification;
  billboardId: Billboard;
  bannerImage: string;
  slug: string;
}

export enum ProductType {
  MEN,
  WOMEN,
  KIDS,
  BEAUTY,
}

export interface Product {
  id: string;
  category: Category;
  name: string;
  price: number;
  isFeatured: boolean;
  isArchieved: boolean;
  stock: number;
  about: string;
  description: string;
  type: ProductType;
  sizeAndFit: string[];
  materialAndCare: string[];
  size: Size;
  color: Color;
  productImages: ProductImage[];
  enabledFeatures: string[];
  slug: string;
  productSpecifications: ProductSpecification[];
  variants: Variant[];
  brand: string;
  expressDelivery: boolean;
  warranty: string;
  isNewArrival: boolean;
  averageRating: number;
  subCategory: SubCategory;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  bannerImage?: string;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductSpecification {
  specificationField: {
    name: string;
    group?: {
      name: string;
    };
  };
  value: string;
}

export interface ProductImage {
  id: string;
  url: string;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface VariantImage {
  id: string;
  url: string;
}

export interface Variant {
  id: string;
  price: number;
  stock: number;
  sku?: string;
  sizeId?: string;
  colorId?: string;
  size?: { id: string; value: string };
  color?: { id: string; name: string; value: string };
  images: VariantImage[];
  mrp?: number;
  variantPrices?: { locationId: string; price: number; mrp: number }[];
}

export interface Color {
  id: string;
  name: string;
  value: string;
}

export interface CartSelectedItem {
  id: string;
  quantity: number;
  price: number;
  image: string;
  name: string;
  about: string;
  size?: string;
  color?: string;
  selectedVariant?: Variant;
  variantId: string;
  locationId?: string | null;
}

export interface PriceRange {
  id: string;
  value: string;
  name: string;
}

export type MenuItem = {
  label: string;
  href: string;
  count?: number;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
  subItems?: MenuItem[] | Record<string, MenuItem[]>;
  link: string;
  slug: string;
};

export interface ApiCategory {
  id: string;
  name: string;
  subCategories: ApiSubCategory[];
}

export interface ApiSubCategory {
  id: string;
  name: string;
  categoryId: string;
  parentId: string | null;
  productCount: number; // Assumed API includes count
}
