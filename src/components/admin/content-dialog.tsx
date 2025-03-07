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
import { FormField } from "@/components/ui/form-field";

type ContentType = 'project' | 'experience' | 'skill' | 'blog' | 'profile';

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
      let dataToSubmit = { ...formData };
      
      if (type === 'profile') {
        // Convert comma-separated strings to arrays
        dataToSubmit.core_competencies = formData.core_competencies.split(',').map((item: string) => item.trim()).filter(Boolean);
        dataToSubmit.specialized_skills = formData.specialized_skills.split(',').map((item: string) => item.trim()).filter(Boolean);
      } else if (type === 'blog') {
        // Handle blog tags
        dataToSubmit.tags = formData.tags?.split(',').map((tag: string) => tag.trim()).filter(Boolean) || [];
      }

      await onSubmit(dataToSubmit);
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
        image: '',
        tags: [],
        details: {
          challenge: '',
          solution: '',
          technologies: [],
          outcome: ''
        },
        color: 'from-cyan-500 to-blue-600'
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
    case 'profile':
      return {
        name: '',
        title: '',
        bio: '',
        years_of_experience: '',
        companies: '',
        core_competencies: [],
        specialized_skills: [],
        approach_text: '',
        security_audits_count: '',
        vulnerabilities_count: '',
        architectures_count: '',
        certifications_count: '',
        github_url: '',
        linkedin_url: '',
        twitter_url: ''
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
    case 'profile':
      return 'Add or edit your profile details.';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({ 
        ...formData, 
        [parent]: { 
          ...formData[parent], 
          [child]: value 
        } 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  switch (type) {
    case 'project':
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="title" className={labelClassName}>Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="Project title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className={labelClassName}>Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="Project description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image" className={labelClassName}>Image Path</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={inputClassName}
              placeholder="/images/project1.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags" className={labelClassName}>Tags</Label>
            <Input
              id="tags"
              name="tags"
              value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
              onChange={(e) => setFormData({ 
                ...formData, 
                tags: e.target.value.split(',').map((tag: string) => tag.trim()).filter(Boolean)
              })}
              required
              className={inputClassName}
              placeholder="Tag1, Tag2, Tag3"
            />
            <p className="text-sm text-cyan-400/50">Separate tags with commas</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="details.challenge" className={labelClassName}>Challenge</Label>
            <Textarea
              id="details.challenge"
              name="details.challenge"
              value={formData.details?.challenge}
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="Describe the project challenge"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="details.solution" className={labelClassName}>Solution</Label>
            <Textarea
              id="details.solution"
              name="details.solution"
              value={formData.details?.solution}
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="Describe your solution"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="details.technologies" className={labelClassName}>Technologies</Label>
            <Input
              id="details.technologies"
              name="details.technologies"
              value={Array.isArray(formData.details?.technologies) ? formData.details.technologies.join(', ') : formData.details?.technologies}
              onChange={(e) => setFormData({ 
                ...formData, 
                details: {
                  ...formData.details,
                  technologies: e.target.value.split(',').map((tech: string) => tech.trim()).filter(Boolean)
                }
              })}
              required
              className={inputClassName}
              placeholder="Tech1, Tech2, Tech3"
            />
            <p className="text-sm text-cyan-400/50">Separate technologies with commas</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="details.outcome" className={labelClassName}>Outcome</Label>
            <Textarea
              id="details.outcome"
              name="details.outcome"
              value={formData.details?.outcome}
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="Describe the project outcome"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color" className={labelClassName}>Color Scheme</Label>
            <select
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
              className={`${inputClassName} w-full`}
            >
              <option value="from-cyan-500 to-blue-600">Cyan to Blue</option>
              <option value="from-purple-500 to-indigo-600">Purple to Indigo</option>
              <option value="from-green-500 to-teal-600">Green to Teal</option>
            </select>
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
              onChange={handleChange}
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
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="Job title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mission" className={labelClassName}>Mission</Label>
            <Textarea
              id="mission"
              value={formData.mission}
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="Describe your mission and responsibilities"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="achievements" className={labelClassName}>Achievements</Label>
            <Textarea
              id="achievements"
              value={Array.isArray(formData.achievements) ? formData.achievements.join('\n') : formData.achievements}
              onChange={(e) => setFormData({ 
                ...formData, 
                achievements: e.target.value.split('\n').filter(Boolean)
              })}
              required
              className={inputClassName}
              placeholder="Enter each achievement on a new line"
            />
            <p className="text-sm text-cyan-400/50">Enter each achievement on a new line</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date" className={labelClassName}>Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
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
              onChange={handleChange}
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
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="e.g., Network Security, CISSP"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className={labelClassName}>Category</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={`${inputClassName} w-full`}
            >
              <option value="">Select a category</option>
              <option value="Technical Skills">Technical Skills</option>
              <option value="Frameworks & Standards">Frameworks & Standards</option>
              <option value="Security Tools">Security Tools</option>
              <option value="Certifications">Certifications</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="level" className={labelClassName}>Skill Level (%)</Label>
            <Input
              id="level"
              name="level"
              type="number"
              min="0"
              max="100"
              value={formData.level}
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="Enter a number between 0 and 100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon" className={labelClassName}>Icon</Label>
            <select
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              required
              className={`${inputClassName} w-full`}
            >
              <option value="">Select an icon</option>
              <option value="💻">💻 Technical</option>
              <option value="🔧">🔧 Framework</option>
              <option value="🛠️">🛠️ Tool</option>
              <option value="🏆">🏆 Certification</option>
            </select>
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
              onChange={handleChange}
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
              onChange={handleChange}
              className={inputClassName}
              placeholder="Brief summary of the blog post"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content" className={labelClassName}>Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={handleChange}
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
              onChange={handleChange}
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
    case 'profile':
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={labelClassName}>Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClassName}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className={labelClassName}>Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={inputClassName}
                placeholder="Your professional title"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className={labelClassName}>Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="Your professional bio"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="years_of_experience" className={labelClassName}>Years of Experience</Label>
              <Input
                id="years_of_experience"
                name="years_of_experience"
                value={formData.years_of_experience}
                onChange={handleChange}
                required
                className={inputClassName}
                placeholder="e.g., 6+ Years Experience"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companies" className={labelClassName}>Companies</Label>
              <Input
                id="companies"
                name="companies"
                value={formData.companies}
                onChange={handleChange}
                required
                className={inputClassName}
                placeholder="e.g., Maruti Suzuki & TCS"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="core_competencies" className={labelClassName}>Core Competencies</Label>
            <Input
              id="core_competencies"
              name="core_competencies"
              value={Array.isArray(formData.core_competencies) ? formData.core_competencies.join(', ') : formData.core_competencies}
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="Security Architecture, Penetration Testing, etc."
            />
            <p className="text-sm text-cyan-400/50">Separate competencies with commas</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialized_skills" className={labelClassName}>Specialized Skills</Label>
            <Input
              id="specialized_skills"
              name="specialized_skills"
              value={Array.isArray(formData.specialized_skills) ? formData.specialized_skills.join(', ') : formData.specialized_skills}
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="Network Security, Cloud Security, etc."
            />
            <p className="text-sm text-cyan-400/50">Separate skills with commas</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="approach_text" className={labelClassName}>Approach</Label>
            <Textarea
              id="approach_text"
              name="approach_text"
              value={formData.approach_text}
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="Your approach to cybersecurity..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="security_audits_count" className={labelClassName}>Security Audits</Label>
              <Input
                id="security_audits_count"
                name="security_audits_count"
                value={formData.security_audits_count}
                onChange={handleChange}
                required
                className={inputClassName}
                placeholder="e.g., 50+"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vulnerabilities_count" className={labelClassName}>Vulnerabilities Patched</Label>
              <Input
                id="vulnerabilities_count"
                name="vulnerabilities_count"
                value={formData.vulnerabilities_count}
                onChange={handleChange}
                required
                className={inputClassName}
                placeholder="e.g., 100+"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="architectures_count" className={labelClassName}>Security Architectures</Label>
              <Input
                id="architectures_count"
                name="architectures_count"
                value={formData.architectures_count}
                onChange={handleChange}
                required
                className={inputClassName}
                placeholder="e.g., 25+"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certifications_count" className={labelClassName}>Certifications</Label>
              <Input
                id="certifications_count"
                name="certifications_count"
                value={formData.certifications_count}
                onChange={handleChange}
                required
                className={inputClassName}
                placeholder="e.g., 10+"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github_url" className={labelClassName}>GitHub URL</Label>
              <Input
                id="github_url"
                name="github_url"
                value={formData.github_url || ''}
                onChange={handleChange}
                className={inputClassName}
                placeholder="https://github.com/yourusername"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url" className={labelClassName}>LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                name="linkedin_url"
                value={formData.linkedin_url || ''}
                onChange={handleChange}
                className={inputClassName}
                placeholder="https://linkedin.com/in/yourusername"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter_url" className={labelClassName}>Twitter URL</Label>
              <Input
                id="twitter_url"
                name="twitter_url"
                value={formData.twitter_url || ''}
                onChange={handleChange}
                className={inputClassName}
                placeholder="https://twitter.com/yourusername"
              />
            </div>
          </div>
        </>
      );
    default:
      return null;
  }
} 