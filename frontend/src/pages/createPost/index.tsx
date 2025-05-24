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
import { createPost } from '@/api/post';
import { useState } from 'react';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MdOutlineCreate } from 'react-icons/md';

type PostFormValues = z.infer<typeof postZodSchema>;

export function CreatePost() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, setError, setValue, watch } = useForm<PostFormValues>({
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
      price: '0.00',
      currency: undefined,
      locationApproximate: '',
      images: undefined,
    },
  });

  const onSubmit: SubmitHandler<PostFormValues> = async (data) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('author', data.author);
    if (data?.language) formData.append('language', data.language);
    if (data?.description) formData.append('description', data.description);
    if (data?.category) formData.append('category', data.category);
    if (data?.bookCondition) formData.append('bookCondition', data.bookCondition);
    if (data?.exchangeType) formData.append('exchangeType', data.exchangeType);
    if (data?.exchangeCondition) formData.append('exchangeCondition', data.exchangeCondition);
    formData.append('isPublic', data.isPublic.toString());
    formData.append('price', data.price);
    if (data?.currency) formData.append('currency', data.currency);
    formData.append('locationApproximate', data.locationApproximate);
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append('images', data.images[i]);
      }
    }
    setLoading(true);
    const result = await createPost(formData);
    setLoading(false);
    console.log(result);
    if (result.status === 422) {
      Object.entries(result.data).forEach(([key, value]) => {
        setError(key as keyof PostFormValues, {
          type: "server",
          message: Array.isArray(value) ? value[0] : value,
        })
      })
    }
    if (result.status === 201) {
      toast({
        title: "Success",
        description: result?.message || "Post created successfully",
        duration: 2000,
        className: "bg-green-600 text-white",
      })
    }
    else {
      toast({
        title: "Error",
        description: result?.message || "An error occurred while creating the post",
        duration: 3000,
        className: "bg-red-500 text-white",
      })
    }
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black hover:bg-neutral-700 text-white font-semibold px-4 py-2 rounded-md">
          <MdOutlineCreate className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className='h-full md:h-[90svh] max-w-2xl overflow-y-auto'>
        <div>
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
              <Textarea id="description" {...register('description')} />
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
              <Textarea id="exchangeCondition" {...register('exchangeCondition')} />
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
            <div>
              <Label htmlFor="locationApproximate">Approximate Location</Label>
              <Input type="text" id="locationApproximate" {...register('locationApproximate')} required />
              {errors.locationApproximate && <span className="text-red-500 text-sm">{errors.locationApproximate.message}</span>}
            </div>
            <div>
              <Label htmlFor="images">Images (max 8)</Label>
              <Input type="file" id="images" {...register('images')} multiple accept="image/*" />
              {errors.images && <span className="text-red-500 text-sm">{errors.images.message as string}</span>}
            </div>
            <div className='flex items-center justify-between mt-4'>
              <DialogClose asChild>
                <Button className='bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md'>
                Cancel
                  </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>Create Post</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
