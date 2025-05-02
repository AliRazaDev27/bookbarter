import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { bookConditionEnum, bookCategoryEnum, exchangeTypeEnum, currencyEnum, languageEnum } from '@/zodSchemas/post';
import { postZodSchema } from '@/zodSchemas/post';
import { createPost } from '@/api/mutations/createPost';
import * as z from 'zod';

type PostFormValues = z.infer<typeof postZodSchema>;

export function CreatePost(){
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PostFormValues>({
    resolver: zodResolver(postZodSchema),
    defaultValues: {
      title: '',
      author: '',
      language: undefined,
      description: '',
      category: undefined,
      bookCondition: undefined,
      exchangeType: undefined,
      exchangeCondition: '',
      isPublic: true,
      price: '0',
      currency: undefined,
      isNegotiable: false,
      locationApproximate: '',
      tags: [],
      images: undefined,
    },
  });

  const onSubmit: SubmitHandler<PostFormValues> = async (data) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('author', data.author);
    if (data.language) formData.append('language', data.language);
    formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.bookCondition) formData.append('bookCondition', data.bookCondition);
    if (data.exchangeType) formData.append('exchangeType', data.exchangeType);
    formData.append('exchangeCondition', data.exchangeCondition);
    formData.append('isPublic', data.isPublic.toString());
    formData.append('price', data.price);
    if (data.currency) formData.append('currency', data.currency);
    formData.append('isNegotiable', data.isNegotiable.toString());
    formData.append('locationApproximate', data.locationApproximate);
    formData.append('tags', JSON.stringify(data.tags));

    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append('images', data.images[i]);
      }
    }

    const result = await createPost(formData);
    console.log(result);
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue('tags', value.split(',').map(tag => tag.trim()));
  };

  const handleLanguageChange = (value: string) => {
    setValue('language', value as PostFormValues['language']);
  };

  const handleCategoryChange = (value: string) => {
    setValue('category', value as PostFormValues['category']);
  };

  const handleBookConditionChange = (value: string) => {
    setValue('bookCondition', value as PostFormValues['bookCondition']);
  };

  const handleExchangeTypeChange = (value: string) => {
    setValue('exchangeType', value as PostFormValues['exchangeType']);
  };

  const handleCurrencyChange = (value: string) => {
    setValue('currency', value as PostFormValues['currency']);
  };


  const watchedTags = watch('tags');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input type="text" id="title" {...register('title')} required />
          {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
        </div>
        <div>
          <Label htmlFor="author">Author</Label>
          <Input type="text" id="author" {...register('author')} required />
          {errors.author && <span className="text-red-500 text-sm">{errors.author.message}</span>}
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <Select onValueChange={handleLanguageChange} value={watch('language')}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languageEnum.options.map((lang) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.language && <span className="text-red-500 text-sm">{errors.language.message}</span>}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} required />
          {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={handleCategoryChange} value={watch('category')}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {bookCategoryEnum.options.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <span className="text-red-500 text-sm">{errors.category.message}</span>}
        </div>
        <div>
          <Label htmlFor="bookCondition">Book Condition</Label>
          <Select onValueChange={handleBookConditionChange} value={watch('bookCondition')}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {bookConditionEnum.options.map((condition) => (
                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.bookCondition && <span className="text-red-500 text-sm">{errors.bookCondition.message}</span>}
        </div>
        <div>
          <Label htmlFor="exchangeType">Exchange Type</Label>
          <Select onValueChange={handleExchangeTypeChange} value={watch('exchangeType')}>
            <SelectTrigger>
              <SelectValue placeholder="Select exchange type" />
            </SelectTrigger>
            <SelectContent>
              {exchangeTypeEnum.options.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.exchangeType && <span className="text-red-500 text-sm">{errors.exchangeType.message}</span>}
        </div>
        <div>
          <Label htmlFor="exchangeCondition">Exchange Condition</Label>
          <Textarea id="exchangeCondition" {...register('exchangeCondition')} required />
          {errors.exchangeCondition && <span className="text-red-500 text-sm">{errors.exchangeCondition.message}</span>}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="isPublic" checked={watch('isPublic')} onCheckedChange={(checked: boolean) => setValue('isPublic', checked)} />
          <Label htmlFor="isPublic">Is Public</Label>
          {errors.isPublic && <span className="text-red-500 text-sm">{errors.isPublic.message}</span>}
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input type="text" id="price" {...register('price')} required />
          {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select onValueChange={handleCurrencyChange} value={watch('currency')}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyEnum.options.map((currency) => (
                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.currency && <span className="text-red-500 text-sm">{errors.currency.message}</span>}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="isNegotiable" checked={watch('isNegotiable')} onCheckedChange={(checked: boolean) => setValue('isNegotiable', checked)} />
          <Label htmlFor="isNegotiable">Is Negotiable</Label>
          {errors.isNegotiable && <span className="text-red-500 text-sm">{errors.isNegotiable.message}</span>}
        </div>
        <div>
          <Label htmlFor="locationApproximate">Approximate Location</Label>
          <Input type="text" id="locationApproximate" {...register('locationApproximate')} required />
          {errors.locationApproximate && <span className="text-red-500 text-sm">{errors.locationApproximate.message}</span>}
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input type="text" id="tags" value={watchedTags?.join(', ') || ''} onChange={handleTagInputChange} />
          {errors.tags && <span className="text-red-500 text-sm">{errors.tags.message}</span>}
        </div>
        <div>
          <Label htmlFor="images">Images (max 8)</Label>
          <Input type="file" id="images" {...register('images')} multiple accept="image/*" />
          {errors.images && <span className="text-red-500 text-sm">{errors.images.message as string}</span>}
        </div>
        <Button type="submit">Create Post</Button>
      </form>
    </div>
  );
};
