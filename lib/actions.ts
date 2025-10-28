// File: lib/actions.ts

'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Product } from './types'; // Assuming Product type is defined here correctly

// Define FormState type locally
export type FormState = {
  pending: boolean | undefined;
  message: string;
  errors?: Record<string, string[] | undefined>;
  success: boolean;
};

// SERVER-SIDE Zod schema including the image file
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  inventory: z.coerce.number().int().min(0, 'Inventory cannot be negative'),
  image: z // Use 'image' for the File object
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
});

// Schema for updating (image is optional)
const UpdateProductSchema = ProductSchema.extend({
  image: ProductSchema.shape.image.optional(), // Make image optional for updates
});

const generateUniqueFilename = (filename: string) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const ext = filename.split('.').pop();
    return `${timestamp}-${randomString}.${ext}`;
};

// CREATE PRODUCT ACTION
export async function createProduct(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const imageFile = formData.get('image') as File | null;
  const rawData = Object.fromEntries(formData.entries());

  // Ensure imageFile is included for validation if present
  const dataToValidate = {
    ...rawData,
    image: imageFile && imageFile.size > 0 ? imageFile : undefined,
  };

  // Validate using the schema where image IS required
  const validatedFields = ProductSchema.safeParse(dataToValidate);

  if (!validatedFields.success) {
    // If validation fails because image is missing (and it's required)
     if (!imageFile || imageFile.size === 0 && validatedFields.error.flatten().fieldErrors.image) {
       return {
         message: 'Product image is required.',
         errors: { ...validatedFields.error.flatten().fieldErrors, image: ['Product image is required.'] },
         success: false,
       };
     }
    console.error('Create Validation Error:', validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Validation failed. Please check your entries.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // At this point, validatedFields.data.image is guaranteed to be a valid File
  const { image, name, slug, description, category, price, inventory } = validatedFields.data;
  let imageUrl: string | undefined = undefined;

  // Upload image
  const uniqueFilename = generateUniqueFilename(image.name);
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(uniqueFilename, image);

  if (uploadError) {
    console.error('Create Storage Error:', uploadError);
    return { message: `Storage Error: ${uploadError.message}`, success: false };
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(uploadData.path);

  imageUrl = publicUrlData?.publicUrl;
  if (!imageUrl) {
      // Attempt cleanup on URL fetch error
       await supabase.storage.from('product-images').remove([uploadData.path]);
      return { message: 'Error getting image public URL after upload.', success: false };
  }

  // Insert product data
  const { error: insertError } = await supabase
    .from('products')
    .insert([{ name, slug, description, category, price, inventory, image_url: imageUrl }])
    .select();

  if (insertError) {
    console.error('Create Supabase Insert Error:', insertError);
    // Attempt to delete the uploaded image if insert fails
    await supabase.storage.from('product-images').remove([uploadData.path]);
    return { message: `Database error: ${insertError.message}`, success: false };
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath(`/products/${slug}`);

  // Instead of redirecting immediately, return success state
  // Let the client form handle the redirect after showing the toast
   return { message: 'Product created successfully!', success: true };
   // redirect('/admin'); // Removed redirect
}

// UPDATE PRODUCT ACTION
export async function updateProduct(
  id: string, // Keep the ID parameter
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Fetch existing product
  const { data: existingProduct, error: fetchError } = await supabase
    .from('products')
    .select('image_url, slug')
    .eq('id', id)
    .single();

  if (fetchError || !existingProduct) {
      return { message: 'Product not found or error fetching it.', success: false };
  }

  const imageFile = formData.get('image') as File | null;
  const rawData = Object.fromEntries(formData.entries());

  // Include image only if a new one was actually uploaded
  const dataToValidate = {
    ...rawData,
    image: imageFile && imageFile.size > 0 ? imageFile : undefined,
  };

  // Use the UpdateProductSchema (image optional)
  const validatedFields = UpdateProductSchema.safeParse(dataToValidate);

  if (!validatedFields.success) {
    console.error('Update Validation Error:', validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Validation failed. Please check your entries.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { image: newImageFile, name, slug, description, category, price, inventory } = validatedFields.data;
  let imageUrl: string | undefined | null = existingProduct.image_url; // Start with old URL

  // Upload *new* image if provided
  if (newImageFile) { // Check if the validated data includes a new image
      const uniqueFilename = generateUniqueFilename(newImageFile.name);
      const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(uniqueFilename, newImageFile);

      if (uploadError) {
          console.error('Update Storage Error:', uploadError);
          return { message: `Storage Error: ${uploadError.message}`, success: false };
      }

      // Get new public URL
      const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(uploadData.path);

      const newImageUrl = publicUrlData?.publicUrl;
      if (!newImageUrl) {
          // Attempt cleanup
          await supabase.storage.from('product-images').remove([uploadData.path]);
          return { message: 'Error getting new image public URL.', success: false };
      }
      imageUrl = newImageUrl; // Update to the new URL

      // Attempt to remove the old image
      if (existingProduct.image_url) {
          try {
              const oldPath = existingProduct.image_url.substring(existingProduct.image_url.lastIndexOf('/') + 1);
              // Avoid deleting if old and new paths are somehow the same (unlikely)
              if (oldPath !== uploadData.path) {
                await supabase.storage.from('product-images').remove([oldPath]);
              }
          } catch (removeError) {
              console.warn("Could not remove old image during update:", removeError);
          }
      }
  }

  // Update product data in DB
  const { error: updateError } = await supabase
      .from('products')
      .update({ name, slug, description, category, price, inventory, image_url: imageUrl })
      .eq('id', id);

  if (updateError) {
    console.error('Update Supabase Error:', updateError);
    return { message: `Database error: ${updateError.message}`, success: false };
  }

  // Revalidation
  revalidatePath('/');
  revalidatePath('/admin');
  if (existingProduct.slug && existingProduct.slug !== slug) {
    revalidatePath(`/products/${existingProduct.slug}`);
  }
  revalidatePath(`/products/${slug}`);

   // Return success state instead of redirecting
   return { message: 'Product updated successfully!', success: true };
   // redirect('/admin'); // Removed redirect
}