export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
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
  size: string;
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
