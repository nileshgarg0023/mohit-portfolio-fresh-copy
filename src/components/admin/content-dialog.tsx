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
import type { Project, Experience, Skill, Blog, Profile, Contact } from "@/lib/supabase";
import { FormField } from "@/components/ui/form-field";

type BaseFormData = {
  title: string;
  description: string;
  tags: string[];
  details: {
    challenge: string;
    solution: string;
    technologies: string[];
    outcome: string;
  };
  color: string;
};

type ProjectFormData = BaseFormData & {
  image_url?: string;
  github_url?: string;
  live_url?: string;
};

type ExperienceFormData = {
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  mission: string;
  achievements: string[];
};

type SkillFormData = {
  name: string;
  category: string;
  level: number;
  icon: string;
};

type BlogFormData = {
  title: string;
  content: string;
  image_url?: string;
  published: boolean;
  slug: string;
  excerpt?: string;
  tags?: string[];
};

type ProfileFormData = {
  name: string;
  title: string;
  bio: string;
  years_of_experience: string;
  companies: string;
  core_competencies: string[];
  specialized_skills: string[];
  approach_text: string;
  security_audits_count: string;
  vulnerabilities_count: string;
  architectures_count: string;
  certifications_count: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
};

type ContentType = 'project' | 'experience' | 'skill' | 'blog' | 'profile' | 'contact';

type ContentItem = ProjectFormData | ExperienceFormData | SkillFormData | BlogFormData | ProfileFormData | Contact;

type ContentDialogProps = {
  type: ContentType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ContentItem | null;
  onSubmit: (data: ProjectFormData | ExperienceFormData | SkillFormData | BlogFormData | ProfileFormData) => Promise<void>;
};

const getDefaultData = (type: ContentType): ProjectFormData | ExperienceFormData | SkillFormData | BlogFormData | ProfileFormData => {
  switch (type) {
    case 'project':
      return {
        title: '',
        description: '',
        image_url: '',
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
        start_date: '',
        end_date: '',
        current: false,
        mission: '',
        achievements: []
      };
    case 'skill':
      return {
        name: '',
        category: 'Technical Skills',
        level: 0,
        icon: ''
      };
    case 'blog':
      return {
        title: '',
        content: '',
        image_url: '',
        published: false,
        slug: '',
        excerpt: '',
        tags: []
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
      return {
        title: '',
        description: '',
        tags: [],
        details: {
          challenge: '',
          solution: '',
          technologies: [],
          outcome: ''
        },
        color: 'from-cyan-500 to-blue-600'
      };
  }
};

export function ContentDialog({
  type,
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: ContentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData | ExperienceFormData | SkillFormData | BlogFormData | ProfileFormData>(() => {
    try {
      if (initialData) {
        const data = { ...initialData };
        if (type === 'blog') {
          const blogData = data as BlogFormData;
          return {
            ...blogData,
            tags: Array.isArray(blogData.tags) ? blogData.tags : []
          };
        }
        if (type === 'project') {
          const projectData = data as ProjectFormData;
          return {
            ...projectData,
            title: projectData.title || '',
            description: projectData.description || '',
            image_url: projectData.image_url || '',
            tags: Array.isArray(projectData.tags) ? projectData.tags : [],
            details: {
              challenge: projectData.details?.challenge || '',
              solution: projectData.details?.solution || '',
              technologies: Array.isArray(projectData.details?.technologies) ? projectData.details.technologies : [],
              outcome: projectData.details?.outcome || ''
            },
            color: projectData.color || 'from-cyan-500 to-blue-600'
          };
        }
        if ('tags' in data) {
          data.tags = Array.isArray(data.tags) ? data.tags : [];
        }
        if ('achievements' in data) {
          data.achievements = Array.isArray(data.achievements) ? data.achievements : [];
        }
        if ('core_competencies' in data) {
          data.core_competencies = Array.isArray(data.core_competencies) ? data.core_competencies : [];
        }
        if ('specialized_skills' in data) {
          data.specialized_skills = Array.isArray(data.specialized_skills) ? data.specialized_skills : [];
        }
        return data as ProjectFormData | ExperienceFormData | SkillFormData | BlogFormData | ProfileFormData;
      }
      return getDefaultData(type);
    } catch (err) {
      console.error('Error initializing form data:', err);
      setError('Failed to initialize form data');
      return getDefaultData(type);
    }
  });

  useEffect(() => {
    if (initialData) {
      const data = { ...initialData };
      if (type === 'blog') {
        const blogData = data as BlogFormData;
        setFormData({
          ...blogData,
          tags: Array.isArray(blogData.tags) ? blogData.tags : []
        });
        return;
      }
      if (type === 'project') {
        const projectData = data as ProjectFormData;
        setFormData({
          ...projectData,
          title: projectData.title || '',
          description: projectData.description || '',
          image_url: projectData.image_url || '',
          tags: Array.isArray(projectData.tags) ? projectData.tags : [],
          details: {
            challenge: projectData.details?.challenge || '',
            solution: projectData.details?.solution || '',
            technologies: Array.isArray(projectData.details?.technologies) ? projectData.details.technologies : [],
            outcome: projectData.details?.outcome || ''
          },
          color: projectData.color || 'from-cyan-500 to-blue-600'
        });
        return;
      }
      if ('tags' in data) {
        data.tags = Array.isArray(data.tags) ? data.tags : [];
      }
      if ('achievements' in data) {
        data.achievements = Array.isArray(data.achievements) ? data.achievements : [];
      }
      if ('core_competencies' in data) {
        data.core_competencies = Array.isArray(data.core_competencies) ? data.core_competencies : [];
      }
      if ('specialized_skills' in data) {
        data.specialized_skills = Array.isArray(data.specialized_skills) ? data.specialized_skills : [];
      }
      setFormData(data as ProjectFormData | ExperienceFormData | SkillFormData | BlogFormData | ProfileFormData);
    } else {
      setFormData(getDefaultData(type));
    }
  }, [initialData, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const prevData = prev as unknown as { [key: string]: { [key: string]: string | string[] } };
        return {
          ...prev,
          [parent]: {
            ...prevData[parent],
            [child]: value
          }
        };
      });
    } else if (name === 'core_competencies' || name === 'specialized_skills') {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim()).filter(Boolean)
      }));
    } else if (name === 'level') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.split('\n').filter(item => item.trim() !== '')
    }));
  };

  const renderFormFields = () => {
    const inputClassName = "bg-black border-cyan-800 focus:border-cyan-500 text-white";
    const labelClassName = "text-cyan-400 font-medium";

    switch (type) {
      case 'project':
        const projectData = formData as ProjectFormData;
        return (
          <>
            <div>
              <label htmlFor="title" className={labelClassName}>Title</label>
              <Input
                id="title"
                name="title"
                value={projectData.title || ''}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className={labelClassName}>Description</label>
              <Textarea
                id="description"
                name="description"
                value={projectData.description || ''}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label htmlFor="image_url" className={labelClassName}>Image URL</label>
              <Input
                id="image_url"
                name="image_url"
                value={projectData.image_url || ''}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="tags" className={labelClassName}>Tags (one per line)</label>
              <Textarea
                id="tags"
                name="tags"
                value={Array.isArray(projectData.tags) ? projectData.tags.join('\n') : ''}
                onChange={handleArrayChange}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="details.challenge" className={labelClassName}>Challenge</label>
              <Textarea
                id="details.challenge"
                name="details.challenge"
                value={projectData.details?.challenge || ''}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label htmlFor="details.solution" className={labelClassName}>Solution</label>
              <Textarea
                id="details.solution"
                name="details.solution"
                value={projectData.details?.solution || ''}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label htmlFor="details.technologies" className={labelClassName}>Technologies (one per line)</label>
              <Textarea
                id="details.technologies"
                name="details.technologies"
                value={Array.isArray(projectData.details?.technologies) ? projectData.details.technologies.join('\n') : ''}
                onChange={handleArrayChange}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label htmlFor="details.outcome" className={labelClassName}>Outcome</label>
              <Textarea
                id="details.outcome"
                name="details.outcome"
                value={projectData.details?.outcome || ''}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>
          </>
        );
      case 'experience':
        const experienceData = formData as ExperienceFormData;
        return (
          <>
            <div>
              <label htmlFor="company" className={labelClassName}>Company</label>
              <Input
                id="company"
                name="company"
                value={experienceData.company}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label htmlFor="position" className={labelClassName}>Position</label>
              <Input
                id="position"
                name="position"
                value={experienceData.position}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label htmlFor="start_date" className={labelClassName}>Start Date</label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={experienceData.start_date}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label htmlFor="end_date" className={labelClassName}>End Date</label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={experienceData.end_date || ''}
                onChange={handleChange}
                className={inputClassName}
                disabled={experienceData.current}
                required={!experienceData.current}
              />
            </div>
            <div>
              <label htmlFor="current" className={labelClassName}>
                <input
                  type="checkbox"
                  id="current"
                  name="current"
                  checked={experienceData.current}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                Current Position
              </label>
            </div>
            <div>
              <label htmlFor="mission" className={labelClassName}>Mission</label>
              <Textarea
                id="mission"
                name="mission"
                value={experienceData.mission}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label htmlFor="achievements" className={labelClassName}>Achievements (one per line)</label>
              <Textarea
                id="achievements"
                name="achievements"
                value={Array.isArray(experienceData.achievements) ? experienceData.achievements.join('\n') : ''}
                onChange={handleArrayChange}
                className={inputClassName}
                required
              />
            </div>
          </>
        );
      case 'skill':
        const skillData = formData as SkillFormData;
        return (
          <>
            <div>
              <label htmlFor="name" className={labelClassName}>Skill Name</label>
              <Input
                id="name"
                name="name"
                value={skillData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="category" className={labelClassName}>Category</label>
              <Input
                id="category"
                name="category"
                value={skillData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="level" className={labelClassName}>Level (0-100)</label>
              <Input
                id="level"
                name="level"
                type="number"
                min="0"
                max="100"
                value={skillData.level}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="icon" className={labelClassName}>Icon</label>
              <select
                id="icon"
                name="icon"
                value={skillData.icon}
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
        const blogData = formData as BlogFormData;
        return (
          <>
            <div>
              <label htmlFor="title" className={labelClassName}>Title</label>
              <Input
                id="title"
                value={blogData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="slug" className={labelClassName}>Slug</label>
              <Input
                id="slug"
                value={blogData.slug}
                onChange={(e) => setFormData({ 
                  ...blogData,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
                })}
                required
              />
            </div>
            <div>
              <label htmlFor="excerpt" className={labelClassName}>Excerpt</label>
              <Textarea
                id="excerpt"
                value={blogData.excerpt}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="content" className={labelClassName}>Content</label>
              <Textarea
                id="content"
                value={blogData.content}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="image_url" className={labelClassName}>Image URL</label>
              <Input
                id="image_url"
                value={blogData.image_url}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="tags" className={labelClassName}>Tags (comma-separated)</label>
              <Input
                id="tags"
                value={Array.isArray(blogData.tags) ? blogData.tags.join(', ') : ''}
                onChange={(e) => setFormData({ 
                  ...blogData,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="published" className={labelClassName}>
                <input
                  type="checkbox"
                  id="published"
                  checked={blogData.published}
                  onChange={(e) => setFormData({ ...blogData, published: e.target.checked })}
                  className="accent-cyan-400 h-4 w-4 rounded border-cyan-400/30"
                />
                Published
              </label>
            </div>
          </>
        );
      case 'profile':
        const profileData = formData as ProfileFormData;
        return (
          <>
            <div>
              <label htmlFor="name" className={labelClassName}>Name</label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="title" className={labelClassName}>Title</label>
              <Input
                id="title"
                name="title"
                value={profileData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="bio" className={labelClassName}>Bio</label>
              <Textarea
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="years_of_experience" className={labelClassName}>Years of Experience</label>
              <Input
                id="years_of_experience"
                name="years_of_experience"
                value={profileData.years_of_experience}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="companies" className={labelClassName}>Companies</label>
              <Input
                id="companies"
                name="companies"
                value={profileData.companies}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="core_competencies" className={labelClassName}>Core Competencies (comma-separated)</label>
              <Input
                id="core_competencies"
                name="core_competencies"
                value={Array.isArray(profileData.core_competencies) ? profileData.core_competencies.join(', ') : ''}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="specialized_skills" className={labelClassName}>Specialized Skills (comma-separated)</label>
              <Input
                id="specialized_skills"
                name="specialized_skills"
                value={Array.isArray(profileData.specialized_skills) ? profileData.specialized_skills.join(', ') : ''}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="approach_text" className={labelClassName}>Approach Text</label>
              <Textarea
                id="approach_text"
                name="approach_text"
                value={profileData.approach_text}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="security_audits_count" className={labelClassName}>Security Audits Count</label>
              <Input
                id="security_audits_count"
                name="security_audits_count"
                value={profileData.security_audits_count}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="vulnerabilities_count" className={labelClassName}>Vulnerabilities Count</label>
              <Input
                id="vulnerabilities_count"
                name="vulnerabilities_count"
                value={profileData.vulnerabilities_count}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="architectures_count" className={labelClassName}>Architectures Count</label>
              <Input
                id="architectures_count"
                name="architectures_count"
                value={profileData.architectures_count}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="certifications_count" className={labelClassName}>Certifications Count</label>
              <Input
                id="certifications_count"
                name="certifications_count"
                value={profileData.certifications_count}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="github_url" className={labelClassName}>GitHub URL</label>
              <Input
                id="github_url"
                name="github_url"
                value={profileData.github_url || ''}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="linkedin_url" className={labelClassName}>LinkedIn URL</label>
              <Input
                id="linkedin_url"
                name="linkedin_url"
                value={profileData.linkedin_url || ''}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="twitter_url" className={labelClassName}>Twitter URL</label>
              <Input
                id="twitter_url"
                name="twitter_url"
                value={profileData.twitter_url || ''}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 backdrop-blur-sm border-cyan-500/30 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">
            {initialData ? `Edit ${type}` : `Add new ${type}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-md">
              {error}
            </div>
          )}
          {renderFormFields()}
          <DialogFooter className="sticky bottom-0 bg-black/90 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950"
              disabled={loading}
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