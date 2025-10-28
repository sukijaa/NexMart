// File: components/ProductForm.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { FormState as ActionFormState } from '@/lib/actions'; // Use the type from actions.ts
import { useEffect, useActionState, useTransition } from 'react'; // Import useTransition hook // Add useTransition // UseActionState from React
import { toast } from 'sonner'; // Correct toast import

// Correct Zod schema for the client form
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB limit // 5MB limit
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ProductFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  inventory: z.coerce.number().int().min(0, 'Inventory cannot be negative'),
  image: z // Use 'image' for the File input
    .instanceof(File)
    .optional()
    .refine(
        (file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE, // Allow empty file
        `Max image size is 1MB.` // Correct message for 1MB limit // Correct message for 5MB limit
    )
    .refine(
        (file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type), // Allow empty file
        'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
});

type ProductFormValues = z.infer<typeof ProductFormSchema>;

interface ProductFormProps {
  action: (prevState: ActionFormState, formData: FormData) => Promise<ActionFormState>;
  defaultValues?: Product;
}

export default function ProductForm({
  action,
  defaultValues,
}: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); // Initialize the hook

  const initialState: ActionFormState = { message: '', success: false };
  const [state, dispatch, pending] = useActionState(action, initialState);

  // Clean up resolver type - Ensure values match Zod schema exactly
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema) as any, // Cast to any to resolve type incompatibility
    defaultValues: {
      name: defaultValues?.name ?? '', // Use ?? for nullish coalescing
      slug: defaultValues?.slug ?? '',
      description: defaultValues?.description ?? '',
      category: defaultValues?.category ?? '',
      price: defaultValues?.price ?? 0,
      inventory: defaultValues?.inventory ?? 0,
      // image (File) is not set as default
    },
  });

 useEffect(() => {
  if (state.message) {
    if (state.success) {
      toast.success('Success!', {
        description: state.message || 'Operation completed successfully.',
      });
      router.push('/admin'); // Redirect to admin page on success
    } else {
      toast.error('Error!', {
        description: state.message || 'An error occurred.',
      });
    }
  }
}, [state, router]); // Add router to dependency array

  // Handle server-side validation errors
  useEffect(() => {
     if (state.errors) {
       Object.entries(state.errors).forEach(([fieldName, errors]) => {
         // Check if fieldName is a valid key before setting error
         if (errors && errors.length > 0 && fieldName in form.getValues()) {
           form.setError(fieldName as keyof ProductFormValues, {
             type: 'server',
             message: errors.join(', '),
           });
         }
       });
     }
   }, [state.errors, form]);


  return (
    <Form {...form}>
       {/* Removed encType - React handles it with Server Actions */}
      <form
        onSubmit={form.handleSubmit((data) => { // No 'async' needed here directly
             // Create FormData manually ONLY if validation passes
             const formData = new FormData();
             Object.entries(data).forEach(([key, value]) => {
                 if (value instanceof File) {
                     formData.append(key, value);
                 } else if (value != null) {
                     formData.append(key, String(value));
                 }
             });
             // Wrap the dispatch call in startTransition
             startTransition(() => { // No need for async inside startTransition for dispatch
              dispatch(formData); // Dispatch the server action
             });
         })}
        className="space-y-6"
      >
        {/* --- Name --- */}
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Cyber-Visor X1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        {/* --- Slug --- */}
        <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="cyber-visor-x1" {...field} />
                </FormControl>
                <FormDescription>
                  Unique URL-friendly identifier.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        {/* --- Description --- */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Product description..." {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- IMAGE FIELD --- */}
        <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, value, ...rest } }) => ( // Exclude value from render props for file input
                <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    {defaultValues?.image_url && (
                        <div className="my-2">
                            <p className="text-sm font-medium text-gray-700">Current Image:</p>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={defaultValues.image_url} alt="Current product image" className="h-20 w-auto rounded border" />
                         </div>
                    )}
                    <FormControl>
                        <Input
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(',')}
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                onChange(file); // Pass the File object
                            }}
                            // Input type file doesn't use the 'value' prop in the same way
                            {...rest} // Pass ref, name etc.
                        />
                    </FormControl>
                    <FormDescription>
                        {/* Correct description for 5MB limit */}
                        Max 1MB. JPG, PNG, WEBP. {defaultValues ? 'Leave blank to keep current image.' : 'Required for new products.'}
                    </FormDescription>
                    <FormMessage /> {/* This will show the Zod error */}
                </FormItem>
            )}
         />

        {/* --- Category, Price, Inventory --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Electronics" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  {/* Ensure value is handled correctly for number input */}
                  <Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber || 0)}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inventory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inventory</FormLabel>
                <FormControl>
                  {/* Ensure value is handled correctly for number input */}
                  <Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber || 0)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending}>
+     {isPending ? 'Saving...' : (defaultValues ? 'Update Product' : 'Create Product')}
        </Button>
      </form>
    </Form>
  );
}