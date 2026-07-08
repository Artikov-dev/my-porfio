import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface SEOForm {
  title_en: string;
  title_uz: string;
  title_ru: string;
  description_en: string;
  description_uz: string;
  description_ru: string;
  keywords: string;
  og_image: string;
}

export const AdminSEO = () => {
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ['admin-seo'],
    queryFn: async () => {
      const res = await api.get('/seo');
      return res.data.data;
    }
  });

  const { register, handleSubmit, reset } = useForm<SEOForm>();

  React.useEffect(() => {
    if (data) {
      reset({
        title_en: data.title.en,
        title_uz: data.title.uz,
        title_ru: data.title.ru,
        description_en: data.description.en,
        description_uz: data.description.uz,
        description_ru: data.description.ru,
        keywords: data.keywords.join(', '),
        og_image: data.og_image
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: async (formData: SEOForm) => {
      const payload = {
        title: { en: formData.title_en, uz: formData.title_uz, ru: formData.title_ru },
        description: { en: formData.description_en, uz: formData.description_uz, ru: formData.description_ru },
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
        og_image: formData.og_image
      };
      await api.put('/seo', payload);
    },
    onSuccess: () => {
      toast.success('SEO Settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-seo'] });
      queryClient.invalidateQueries({ queryKey: ['seoSettings'] });
    },
    onError: () => {
      toast.error('Failed to update SEO settings');
    }
  });

  const onSubmit = (formData: SEOForm) => {
    mutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-6"><Skeleton className="h-96 w-full rounded-2xl" /></div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Global SEO Settings</h1>
          <p className="text-foreground/60">Manage how your portfolio appears on Google and social media.</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-border">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-border pb-2">Title (Site Name)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1 text-foreground/70">English</label>
                <input {...register('title_en')} className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-foreground/70">Uzbek</label>
                <input {...register('title_uz')} className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-foreground/70">Russian</label>
                <input {...register('title_ru')} className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-semibold border-b border-border pb-2">Description (Meta Description)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1 text-foreground/70">English</label>
                <textarea {...register('description_en')} rows={3} className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary resize-none" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-foreground/70">Uzbek</label>
                <textarea {...register('description_uz')} rows={3} className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary resize-none" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-foreground/70">Russian</label>
                <textarea {...register('description_ru')} rows={3} className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary resize-none" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-semibold border-b border-border pb-2">Keywords & Social</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-foreground/70">Keywords (Comma separated)</label>
                <textarea {...register('keywords')} rows={3} placeholder="React, Node.js, Roma Artikov..." className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary resize-none" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-foreground/70">OpenGraph Image URL</label>
                <input {...register('og_image')} className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary mb-2" />
                {data?.og_image && (
                  <div className="relative w-full h-24 rounded-lg overflow-hidden border border-border">
                    <img src={data.og_image} alt="OG Preview" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <Button type="submit" variant="solid" className="flex items-center gap-2" disabled={mutation.isPending}>
              <Save size={18} />
              {mutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
