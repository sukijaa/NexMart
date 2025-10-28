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
import { FormState as ActionFormState } from '@/lib/actions';
// --- CORRECT IMPORTS for React 18 ---
import { useEffect, useTransition } from 'react';
import { useFormState } from 'react-dom'; // Use useFormState from react-dom
// --- END CORRECTION ---
import { toast } from 'sonner';

// Correct Zod schema for the client form (Using 1MB limit)
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB limit
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ProductFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  inventory: z.coerce.number().int().min(0, 'Inventory cannot be negative'),
  image: z
    .instanceof(File)
    .optional()
    .refine(
        (file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE,
        `Max image size is 1MB.`
    )
    .refine(
        (file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
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
  const [isPending, startTransition] = useTransition();
  const initialState: ActionFormState = { message: '', success: false };
  // --- CORRECT HOOK NAME for React 18 ---
  const [state, dispatch] = useFormState(action, initialState); // Use useFormState

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      slug: defaultValues?.slug ?? '',
      description: defaultValues?.description ?? '',
      category: defaultValues?.category ?? '',
      price: defaultValues?.price ?? 0,
      inventory: defaultValues?.inventory ?? 0,
      // image (File) is not set default
    },
    mode: 'onChange',
  });

  // Effect for toast and redirect
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success('Success!', { description: state.message || 'Operation successful.' });
        if (!isPending) {
           router.push('/admin');
        }
      } else {
        toast.error('Error!', { description: state.message || 'Operation failed.' });
      }
    }
  }, [state, router, isPending]);

  // Effect to set server errors back into the form
  useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([fieldName, errors]) => {
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
      <form
        onSubmit={form.handleSubmit((data) => {
             const formData = new FormData();
             Object.entries(data).forEach(([key, value]) => {
                 if (value instanceof File) {
                     formData.append(key, value);
                 } else if (value != null) {
                     formData.append(key, String(value));
                 }
             });
             startTransition(() => {
                 dispatch(formData);
             });
         })}
        className="space-y-6"
      >
        {/* --- Form Fields (Name, Slug, Desc, Image, Cat, Price, Inv) --- */}
        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input placeholder="Cyber-Visor X1" {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="slug" render={({ field }) => ( <FormItem><FormLabel>Slug</FormLabel><FormControl><Input placeholder="cyber-visor-x1" {...field} /></FormControl><FormDescription>Unique URL-friendly identifier.</FormDescription><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Product description..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="image" render={({ field: { onChange, value, ref, ...rest } }) => ( <FormItem><FormLabel>Product Image</FormLabel>{defaultValues?.image_url && ( <div className="my-2"><p className="text-sm font-medium text-gray-700">Current Image:</p><img src={defaultValues.image_url} alt="Current product image" className="h-20 w-auto rounded border" /></div> )}<FormControl><Input type="file" accept={ACCEPTED_IMAGE_TYPES.join(',')} onChange={(event) => { const file = event.target.files?.[0]; onChange(file); }} ref={ref} {...rest} /></FormControl><FormDescription>Max 1MB. JPG, PNG, WEBP. {defaultValues ? 'Leave blank to keep current image.' : 'Required for new products.'}</FormDescription><FormMessage /></FormItem> )} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <FormField control={form.control} name="category" render={({ field }) => ( <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="Electronics" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
           <FormField control={form.control} name="price" render={({ field }) => ( <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber || 0)}/></FormControl><FormMessage /></FormItem> )} />
           <FormField control={form.control} name="inventory" render={({ field }) => ( <FormItem><FormLabel>Inventory</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber || 0)} /></FormControl><FormMessage /></FormItem> )} />
        </div>

        {/* --- Submit Button --- */}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : (defaultValues ? 'Update Product' : 'Create Product')}
        </Button>
      </form>
    </Form>
  );
}