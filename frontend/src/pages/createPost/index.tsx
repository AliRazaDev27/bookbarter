import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { bookConditionEnum, bookCategoryEnum, exchangeTypeEnum, currencyEnum, languageEnum } from '@/zodSchemas/post';
import axios from 'axios';

export function CreatePost(){
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    language: '',
    description: '',
    category: '',
    bookCondition: '',
    exchangeType: '',
    exchangeCondition: '',
    isPublic: true,
    price: '0',
    currency: '',
    isNegotiable: false,
    locationApproximate: '',
    tags: [] as string[],
    images: [] as File[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: checked,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prevData) => ({
      ...prevData,
      images: files,
    }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      tags: value.split(',').map(tag => tag.trim()),
    }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    const realFormData = new FormData();

    realFormData.append('title', formData.title);
    realFormData.append('author', formData.author);
    realFormData.append('language', formData.language);
    realFormData.append('description', formData.description);
    realFormData.append('category', formData.category);
    realFormData.append('bookCondition', formData.bookCondition);
    realFormData.append('exchangeType', formData.exchangeType);
    realFormData.append('exchangeCondition', formData.exchangeCondition);
    realFormData.append('isPublic', formData.isPublic.toString());
    realFormData.append('price', formData.price);
    realFormData.append('currency', formData.currency);
    realFormData.append('isNegotiable', formData.isNegotiable.toString());
    realFormData.append('locationApproximate', formData.locationApproximate);
    realFormData.append('tags', JSON.stringify(formData.tags));
    formData.images.forEach((image) => {
      realFormData.append('images', image, image.name);
    });
    
    console.log(realFormData);


    try{
      const result = await axios.post('http://localhost:3000/posts/create', realFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(result.data);
    }
    catch(err){
      console.error('Error creating post:', err);
    }

  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input type="text" id="title" value={formData.title} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="author">Author</Label>
          <Input type="text" id="author" value={formData.author} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <Select onValueChange={(value) => handleSelectChange('language', value)} value={formData.language}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languageEnum.options.map((lang) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={formData.description} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={(value) => handleSelectChange('category', value)} value={formData.category}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {bookCategoryEnum.options.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="bookCondition">Book Condition</Label>
          <Select onValueChange={(value) => handleSelectChange('bookCondition', value)} value={formData.bookCondition}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {bookConditionEnum.options.map((condition) => (
                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="exchangeType">Exchange Type</Label>
          <Select onValueChange={(value) => handleSelectChange('exchangeType', value)} value={formData.exchangeType}>
            <SelectTrigger>
              <SelectValue placeholder="Select exchange type" />
            </SelectTrigger>
            <SelectContent>
              {exchangeTypeEnum.options.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="exchangeCondition">Exchange Condition</Label>
          <Textarea id="exchangeCondition" value={formData.exchangeCondition} onChange={handleInputChange} required />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="isPublic" checked={formData.isPublic} onCheckedChange={(checked: boolean) => handleCheckboxChange('isPublic', checked)} />
          <Label htmlFor="isPublic">Is Public</Label>
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input type="text" id="price" value={formData.price} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select onValueChange={(value) => handleSelectChange('currency', value)} value={formData.currency}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyEnum.options.map((currency) => (
                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="isNegotiable" checked={formData.isNegotiable} onCheckedChange={(checked: boolean) => handleCheckboxChange('isNegotiable', checked)} />
          <Label htmlFor="isNegotiable">Is Negotiable</Label>
        </div>
        <div>
          <Label htmlFor="locationApproximate">Approximate Location</Label>
          <Input type="text" id="locationApproximate" value={formData.locationApproximate} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input type="text" id="tags" value={formData.tags.join(', ')} onChange={handleTagInputChange} />
        </div>
        <div>
          <Label htmlFor="images">Images (max 8)</Label>
          <Input type="file" id="images" name='images' multiple onChange={handleFileChange} accept="image/*" />
        </div>
        <Button type="submit">Create Post</Button>
      </form>
    </div>
  );
};