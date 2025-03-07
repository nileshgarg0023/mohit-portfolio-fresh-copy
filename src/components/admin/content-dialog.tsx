'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { Project, Experience, Skill } from "@/lib/supabase";

type ContentType = 'project' | 'experience' | 'skill' | 'blog';

interface ContentDialogProps {
  type: ContentType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export function ContentDialog({
  type,
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: ContentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData || getDefaultData(type));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 backdrop-blur-sm border border-cyan-400/30 sm:max-w-[800px] max-h-[90vh] shadow-[0_0_25px_rgba(0,255,255,0.1)]">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 text-xl">
            {initialData ? `Edit ${type}` : `Add New ${type}`}
          </DialogTitle>
          <DialogDescription className="text-cyan-400/70">
            {getDescription(type)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[calc(90vh-180px)] pr-4 -mr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getFormFields(type, formData, setFormData)}
          </div>
        </form>
        <DialogFooter className="mt-4">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getDefaultData(type: ContentType) {
  switch (type) {
    case 'project':
      return {
        title: '',
        description: '',
        image_url: '',
        technologies: [],
        github_url: '',
        live_url: '',
      };
    case 'experience':
      return {
        company: '',
        position: '',
        description: '',
        start_date: '',
        end_date: '',
        current: false,
      };
    case 'skill':
      return {
        name: '',
        category: '',
        proficiency: 0,
      };
    case 'blog':
      return {
        title: '',
        content: '',
        image_url: '',
        published: false,
        slug: '',
        excerpt: '',
        tags: [],
      };
    default:
      return {};
  }
}

function getDescription(type: ContentType) {
  switch (type) {
    case 'project':
      return 'Add details about your project.';
    case 'experience':
      return 'Add details about your work experience.';
    case 'skill':
      return 'Add details about your skills.';
    case 'blog':
      return 'Create or edit a blog post.';
    default:
      return '';
  }
}

function getFormFields(
  type: ContentType,
  formData: any,
  setFormData: (data: any) => void
) {
  const inputClassName = "bg-black/50 border-cyan-400/30 text-cyan-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 placeholder-cyan-400/30";
  const labelClassName = "text-cyan-400 font-medium";

  switch (type) {
    case 'project':
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="title" className={labelClassName}>Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className={inputClassName}
              placeholder="Project title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className={labelClassName}>Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className={inputClassName}
              placeholder="Project description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image_url" className={labelClassName}>Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className={inputClassName}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github_url" className={labelClassName}>GitHub URL</Label>
            <Input
              id="github_url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              className={inputClassName}
              placeholder="https://github.com/username/project"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="live_url" className={labelClassName}>Live URL</Label>
            <Input
              id="live_url"
              value={formData.live_url}
              onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
              className={inputClassName}
              placeholder="https://project-demo.com"
            />
          </div>
        </>
      );
    case 'experience':
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="company" className={labelClassName}>Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
              className={inputClassName}
              placeholder="Company name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position" className={labelClassName}>Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
              className={inputClassName}
              placeholder="Job title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className={labelClassName}>Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className={inputClassName}
              placeholder="Job description and responsibilities"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date" className={labelClassName}>Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date" className={labelClassName}>End Date</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              disabled={formData.current}
              className={`${inputClassName} disabled:opacity-50`}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="current"
              checked={formData.current}
              onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
              className="accent-cyan-400 h-4 w-4 rounded border-cyan-400/30"
            />
            <Label htmlFor="current" className={labelClassName}>Current Position</Label>
          </div>
        </>
      );
    case 'skill':
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="name" className={labelClassName}>Skill Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className={inputClassName}
              placeholder="e.g., React, Node.js, Python"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className={labelClassName}>Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className={inputClassName}
              placeholder="e.g., Frontend, Backend, DevOps"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proficiency" className={labelClassName}>Proficiency (%)</Label>
            <Input
              id="proficiency"
              type="number"
              min="0"
              max="100"
              value={formData.proficiency}
              onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
              required
              className={inputClassName}
              placeholder="Enter a number between 0 and 100"
            />
          </div>
        </>
      );
    case 'blog':
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="title" className={labelClassName}>Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className={inputClassName}
              placeholder="Blog post title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug" className={labelClassName}>URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ 
                ...formData, 
                slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
              })}
              required
              className={inputClassName}
              placeholder="url-friendly-title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt" className={labelClassName}>Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className={inputClassName}
              placeholder="Brief summary of the blog post"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content" className={labelClassName}>Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              className={`${inputClassName} min-h-[300px]`}
              placeholder="Write your blog post content here..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image_url" className={labelClassName}>Cover Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className={inputClassName}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags" className={labelClassName}>Tags</Label>
            <Input
              id="tags"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              })}
              className={inputClassName}
              placeholder="technology, programming, web-development"
            />
            <p className="text-sm text-cyan-400/50">Separate tags with commas</p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="accent-cyan-400 h-4 w-4 rounded border-cyan-400/30"
            />
            <Label htmlFor="published" className={labelClassName}>Publish this post</Label>
          </div>
        </>
      );
    default:
      return null;
  }
} 