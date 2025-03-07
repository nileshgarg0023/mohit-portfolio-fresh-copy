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
import { useState, useEffect } from "react";
import type { Project, Experience, Skill, Blog, Profile } from "@/lib/supabase";
import { FormField } from "@/components/ui/form-field";

type ContentType = 'project' | 'experience' | 'skill' | 'blog' | 'profile';

// Form data types that exclude auto-generated fields
type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
type ExperienceFormData = Omit<Experience, 'id' | 'created_at' | 'updated_at'>;
type SkillFormData = Omit<Skill, 'id' | 'created_at' | 'updated_at'>;
type BlogFormData = Omit<Blog, 'id' | 'created_at' | 'updated_at'>;
type ProfileFormData = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;

type FormData = {
  type: ContentType;
  data: any;
};

const getDefaultData = (type: ContentType): FormData => {
  switch (type) {
    case 'project':
      return {
        type,
        data: {
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
        }
      }
    case 'experience':
      return {
        type,
        data: {
          company: '',
          position: '',
          start_date: '',
          end_date: '',
          current: false,
          mission: '',
          achievements: []
        }
      }
    case 'skill':
      return {
        type,
        data: {
          name: '',
          category: 'Technical Skills',
          level: 0,
          icon: ''
        }
      }
    case 'blog':
      return {
        type,
        data: {
          title: '',
          content: '',
          image_url: '',
          excerpt: '',
          tags: [],
          published: false,
          slug: ''
        }
      }
    case 'profile':
      return {
        type,
        data: {
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
        }
      }
    default:
      throw new Error(`Unknown content type: ${type}`);
  }
};

export function ContentDialog({
  type,
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: {
  type: ContentType,
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSubmit: (data: any) => void,
  initialData?: any
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    if (initialData) {
      return { type, data: initialData };
    }
    return getDefaultData(type);
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ type, data: initialData });
    } else {
      setFormData(getDefaultData(type));
    }
  }, [initialData, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setLoading(true);
    try {
      // Format the data before submission
      const formattedData = { ...formData.data };
      
      // Handle arrays and dates for experience type
      if (type === 'experience') {
        console.log('Formatting experience data:', formattedData);
        // Ensure achievements is an array
        if (typeof formattedData.achievements === 'string') {
          formattedData.achievements = formattedData.achievements
            .split('\n')
            .map((achievement: string) => achievement.trim())
            .filter(Boolean);
        }
        
        // Format dates
        if (formattedData.start_date) {
          formattedData.start_date = new Date(formattedData.start_date).toISOString();
        }
        if (formattedData.end_date && !formattedData.current) {
          formattedData.end_date = new Date(formattedData.end_date).toISOString();
        }
        if (formattedData.current) {
          formattedData.end_date = null;
        }
      }

      console.log('Submitting formatted data:', formattedData);
      await onSubmit(formattedData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        data: {
          ...prev.data,
          [parent]: {
            ...prev.data[parent],
            [child]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        data: {
          ...prev.data,
          [name]: value
        }
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: checked
      }
    }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value.split('\n').filter(item => item.trim() !== '')
      }
    }));
  };

  const getFormFields = () => {
    const inputClassName = "bg-black/50 border-cyan-400/30 text-cyan-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 placeholder-cyan-400/30";
    const labelClassName = "text-cyan-400 font-medium";

    switch (type) {
      case 'project':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className={labelClassName}>Title</label>
              <Input
                id="title"
                name="title"
                value={formData.data.title || ''}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Enter project title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClassName}>Description</label>
              <Textarea
                id="description"
                name="description"
                value={formData.data.description || ''}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Enter project description"
                required
              />
            </div>

            <div>
              <label htmlFor="image" className={labelClassName}>Image URL</label>
              <Input
                id="image"
                name="image"
                value={formData.data.image || ''}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Enter image URL"
              />
            </div>

            <div>
              <label htmlFor="tags" className={labelClassName}>Tags (one per line)</label>
              <Textarea
                id="tags"
                name="tags"
                value={Array.isArray(formData.data.tags) ? formData.data.tags.join('\n') : ''}
                onChange={handleArrayChange}
                className={inputClassName}
                placeholder="Enter tags (one per line)"
              />
            </div>

            <div>
              <label htmlFor="details.challenge" className={labelClassName}>Challenge</label>
              <Textarea
                id="details.challenge"
                name="details.challenge"
                value={formData.data.details?.challenge || ''}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Enter project challenge"
                required
              />
            </div>

            <div>
              <label htmlFor="details.solution" className={labelClassName}>Solution</label>
              <Textarea
                id="details.solution"
                name="details.solution"
                value={formData.data.details?.solution || ''}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Enter project solution"
                required
              />
            </div>

            <div>
              <label htmlFor="details.technologies" className={labelClassName}>Technologies (one per line)</label>
              <Textarea
                id="details.technologies"
                name="details.technologies"
                value={Array.isArray(formData.data.details?.technologies) ? formData.data.details.technologies.join('\n') : ''}
                onChange={handleArrayChange}
                className={inputClassName}
                placeholder="Enter technologies (one per line)"
                required
              />
            </div>

            <div>
              <label htmlFor="details.outcome" className={labelClassName}>Outcome</label>
              <Textarea
                id="details.outcome"
                name="details.outcome"
                value={formData.data.details?.outcome || ''}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Enter project outcome"
                required
              />
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-1">Company</label>
              <Input
                id="company"
                name="company"
                value={formData.data.company || ''}
                onChange={handleChange}
                className="bg-black border-cyan-800 focus:border-cyan-500"
                placeholder="Enter company name"
                required
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium mb-1">Position</label>
              <Input
                id="position"
                name="position"
                value={formData.data.position || ''}
                onChange={handleChange}
                className="bg-black border-cyan-800 focus:border-cyan-500"
                placeholder="Enter position title"
                required
              />
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium mb-1">Start Date</label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.data.start_date || ''}
                onChange={handleChange}
                className="bg-black border-cyan-800 focus:border-cyan-500"
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label htmlFor="end_date" className="block text-sm font-medium mb-1">End Date</label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.data.end_date || ''}
                  onChange={handleChange}
                  className="bg-black border-cyan-800 focus:border-cyan-500"
                  disabled={formData.data.current}
                  required={!formData.data.current}
                />
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="current"
                  name="current"
                  checked={formData.data.current || false}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="current">Current Position</label>
              </div>
            </div>

            <div>
              <label htmlFor="mission" className="block text-sm font-medium mb-1">Mission/Responsibilities</label>
              <Textarea
                id="mission"
                name="mission"
                value={formData.data.mission || ''}
                onChange={handleChange}
                className="bg-black border-cyan-800 focus:border-cyan-500 min-h-[100px]"
                placeholder="Enter mission and responsibilities"
                required
              />
            </div>

            <div>
              <label htmlFor="achievements" className="block text-sm font-medium mb-1">Achievements (one per line)</label>
              <Textarea
                id="achievements"
                name="achievements"
                value={Array.isArray(formData.data.achievements) ? formData.data.achievements.join('\n') : ''}
                onChange={handleArrayChange}
                className="bg-black border-cyan-800 focus:border-cyan-500 min-h-[100px]"
                placeholder="Enter achievements (one per line)"
                required
              />
            </div>
          </div>
        );
      case 'skill':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={labelClassName}>Skill Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.data.name}
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
                value={formData.data.category}
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
                value={formData.data.level}
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
                value={formData.data.icon}
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
          </div>
        );
      case 'blog':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className={labelClassName}>Title</Label>
              <Input
                id="title"
                value={formData.data.title}
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
                value={formData.data.slug}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  data: {
                    ...formData.data,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
                  }
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
                value={formData.data.excerpt}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Brief summary of the blog post"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className={labelClassName}>Content</Label>
              <Textarea
                id="content"
                value={formData.data.content}
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
                value={formData.data.image_url}
                onChange={handleChange}
                className={inputClassName}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags" className={labelClassName}>Tags</Label>
              <Input
                id="tags"
                value={formData.data.tags?.join(', ') || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  data: {
                    ...formData.data,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  }
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
                checked={formData.data.published}
                onChange={(e) => setFormData({ ...formData, data: { ...formData.data, published: e.target.checked } })}
                className="accent-cyan-400 h-4 w-4 rounded border-cyan-400/30"
              />
              <Label htmlFor="published" className={labelClassName}>Publish this post</Label>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={labelClassName}>Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.data.name}
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
                  value={formData.data.title}
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
                value={formData.data.bio}
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
                  value={formData.data.years_of_experience}
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
                  value={formData.data.companies}
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
                value={Array.isArray(formData.data.core_competencies) ? formData.data.core_competencies.join(', ') : formData.data.core_competencies}
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
                value={Array.isArray(formData.data.specialized_skills) ? formData.data.specialized_skills.join(', ') : formData.data.specialized_skills}
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
                value={formData.data.approach_text}
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
                  value={formData.data.security_audits_count}
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
                  value={formData.data.vulnerabilities_count}
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
                  value={formData.data.architectures_count}
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
                  value={formData.data.certifications_count}
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
                  value={formData.data.github_url || ''}
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
                  value={formData.data.linkedin_url || ''}
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
                  value={formData.data.twitter_url || ''}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 backdrop-blur-sm border-cyan-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">
            {initialData ? `Edit ${type}` : `Add new ${type}`}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[calc(90vh-180px)] pr-4 -mr-4">
          {getFormFields()}
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-cyan-500 text-black hover:bg-cyan-600"
            >
              {loading ? 'Creating...' : (initialData ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 