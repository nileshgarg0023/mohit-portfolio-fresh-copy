'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentDialog } from '@/components/admin/content-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Profile, Project, Experience, Skill, Contact, Blog } from '@/lib/supabase';
import ContactsTable from '@/components/admin/contacts-table'
import { toast } from "sonner";

type ContentType = 'project' | 'experience' | 'skill' | 'blog' | 'profile'

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'project' | 'experience' | 'skill' | 'blog' | 'profile'>('project');
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Delete confirmation states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [selectedContentType, setSelectedContentType] = useState<ContentType>('experience');
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setError('Error loading profile data');
      } else {
        setProfile(profileData);
      }

      // Fetch projects with technologies as array
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        setError('Error loading projects');
      } else {
        setProjects(projectsData || []);
      }

      // Fetch experiences
      const { data: experiencesData, error: experiencesError } = await supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (experiencesError) {
        console.error('Error fetching experiences:', experiencesError);
        setError('Error loading experiences');
      } else {
        setExperiences(experiencesData || []);
      }

      // Fetch skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true });
      
      if (skillsError) {
        console.error('Error fetching skills:', skillsError);
        setError('Error loading skills');
      } else {
        setSkills(skillsData || []);
      }

      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
        setError('Error loading contacts');
      } else {
        setContacts(contactsData || []);
      }

      // Fetch blogs with tags as array
      const { data: blogsData, error: blogsError } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (blogsError) {
        console.error('Error fetching blogs:', blogsError);
        setError('Error loading blogs');
      } else {
        setBlogs(blogsData || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Add real-time subscriptions for live updates
  useEffect(() => {
    const profileSubscription = supabase
      .channel('profile-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profile' }, fetchData)
      .subscribe();

    const projectsSubscription = supabase
      .channel('projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchData)
      .subscribe();

    const experiencesSubscription = supabase
      .channel('experiences-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'experiences' }, fetchData)
      .subscribe();

    const skillsSubscription = supabase
      .channel('skills-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, fetchData)
      .subscribe();

    const contactsSubscription = supabase
      .channel('contacts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, fetchData)
      .subscribe();

    const blogsSubscription = supabase
      .channel('blogs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, fetchData)
      .subscribe();

    // Initial fetch
    fetchData();

    // Cleanup subscriptions
    return () => {
      profileSubscription.unsubscribe();
      projectsSubscription.unsubscribe();
      experiencesSubscription.unsubscribe();
      skillsSubscription.unsubscribe();
      contactsSubscription.unsubscribe();
      blogsSubscription.unsubscribe();
    };
  }, []);

  const handleProfileEdit = () => {
    setDialogType('profile');
    setEditingItem(profile);
    setDialogOpen(true);
  };

  const handleContentSubmit = async (data: any) => {
    try {
      setLoading(true);
      let table = '';
      let formattedData = { ...data };
      
      switch (dialogType) {
        case 'profile':
          table = 'profile';
          // Convert comma-separated strings to arrays
          formattedData.core_competencies = data.core_competencies.split(',').map((item: string) => item.trim()).filter(Boolean);
          formattedData.specialized_skills = data.specialized_skills.split(',').map((item: string) => item.trim()).filter(Boolean);
          
          if (profile?.id) {
            const { error } = await supabase
              .from(table)
              .update({
                ...formattedData,
                updated_at: new Date().toISOString()
              })
              .eq('id', profile.id);
            if (error) throw error;
          } else {
            const { error } = await supabase
              .from(table)
              .insert([{
                ...formattedData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }]);
            if (error) throw error;
          }
          break;

        case 'project':
          table = 'projects';
          // Convert technologies to array if it's a string
          if (typeof data.technologies === 'string') {
            formattedData.technologies = data.technologies.split(',').map((tech: string) => tech.trim()).filter(Boolean);
          }
          break;

        case 'experience':
          table = 'experiences';
          // Format dates and handle current position
          if (data.current) {
            formattedData.end_date = null;
          }
          // Ensure achievements is an array
          if (typeof data.achievements === 'string') {
            formattedData.achievements = data.achievements.split('\n').map((achievement: string) => achievement.trim()).filter(Boolean);
          } else if (!Array.isArray(data.achievements)) {
            formattedData.achievements = [];
          }
          // Ensure mission is a string
          formattedData.mission = formattedData.mission || '';
          // Ensure dates are in the correct format
          if (formattedData.start_date) {
            formattedData.start_date = new Date(formattedData.start_date).toISOString();
          }
          if (formattedData.end_date && !formattedData.current) {
            formattedData.end_date = new Date(formattedData.end_date).toISOString();
          }
          break;

        case 'skill':
          table = 'skills';
          // Ensure level is a number
          formattedData.level = Number(data.level);
          // Ensure icon is set based on category if not provided
          if (!formattedData.icon) {
            formattedData.icon = 
              formattedData.category === 'Technical Skills' ? '💻' :
              formattedData.category === 'Frameworks & Standards' ? '🔧' :
              formattedData.category === 'Security Tools' ? '🛠️' :
              formattedData.category === 'Certifications' ? '🏆' : '💻';
          }
          break;

        case 'blog':
          table = 'blogs';
          // Convert tags to array if it's a string
          if (typeof data.tags === 'string') {
            formattedData.tags = data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
          }
          // Generate slug if not provided
          if (!data.slug) {
            formattedData.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          }
          break;

        default:
          throw new Error('Invalid content type');
      }

      // Handle update or insert for non-profile tables
      if (table !== 'profile') {
        if (editingItem?.id) {
          const { error } = await supabase
            .from(table)
            .update({
              ...formattedData,
              updated_at: new Date().toISOString()
            })
            .eq('id', editingItem.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from(table)
            .insert([{
              ...formattedData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);
          if (error) throw error;
        }
      }
      
      setUpdateMessage({ type: 'success', text: `${dialogType} ${editingItem ? 'updated' : 'added'} successfully!` });
      fetchData();
    } catch (error) {
      console.error(`Error ${editingItem ? 'updating' : 'adding'} ${dialogType}:`, error);
      setUpdateMessage({ type: 'error', text: `Failed to ${editingItem ? 'update' : 'add'} ${dialogType}` });
    } finally {
      setLoading(false);
      setDialogOpen(false);
      setTimeout(() => setUpdateMessage(null), 3000);
    }
  };

  const handleAddNew = (type: 'project' | 'experience' | 'skill' | 'blog') => {
    setDialogType(type);
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: any, type: 'project' | 'experience' | 'skill' | 'blog') => {
    setDialogType(type);
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = (item: any) => {
    // Determine the table name based on item properties
    const type = 
      item.type || // Use the type if it's already set
      ('company' in item ? 'experiences' :
      'level' in item ? 'skills' :
      'technologies' in item ? 'projects' :
      'slug' in item ? 'blogs' :
      'message' in item ? 'contacts' : '');

    if (!type) {
      console.error('Unknown item type:', item);
      setUpdateMessage({ type: 'error', text: 'Cannot delete item: unknown type' });
      return;
    }

    setItemToDelete({ ...item, type });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.type) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from(itemToDelete.type)
        .delete()
        .eq('id', itemToDelete.id);

      if (error) {
        console.error('Error deleting item:', error);
        setUpdateMessage({ type: 'error', text: `Error deleting ${itemToDelete.type}` });
      } else {
        setUpdateMessage({ type: 'success', text: `${itemToDelete.type} deleted successfully!` });
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      setUpdateMessage({ type: 'error', text: 'Error deleting item' });
    } finally {
      setLoading(false);
      setTimeout(() => setUpdateMessage(null), 3000);
    }
  };

  const handleAddExperience = async (data: any) => {
    try {
      console.log('Adding experience:', data);
      const { error } = await supabase
        .from('experiences')
        .insert([data]);

      if (error) {
        console.error('Error adding experience:', error);
        toast.error("Failed to add experience");
        return;
      }

      // Refresh experiences list
      const { data: experiences, error: fetchError } = await supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false });

      if (fetchError) {
        console.error('Error fetching experiences:', fetchError);
        toast.error("Failed to refresh experiences list");
        return;
      }

      setExperiences(experiences);
      toast.success("Experience added successfully");
    } catch (error) {
      console.error('Error in handleAddExperience:', error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleUpdateExperience = async (data: any) => {
    try {
      console.log('Updating experience:', data);
      const { error } = await supabase
        .from('experiences')
        .update(data)
        .eq('id', data.id);

      if (error) {
        console.error('Error updating experience:', error);
        toast.error("Failed to update experience");
        return;
      }

      // Refresh experiences list
      const { data: experiences, error: fetchError } = await supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false });

      if (fetchError) {
        console.error('Error fetching experiences:', fetchError);
        toast.error("Failed to refresh experiences list");
        return;
      }

      setExperiences(experiences);
      toast.success("Experience updated successfully");
    } catch (error) {
      console.error('Error in handleUpdateExperience:', error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      console.log('Deleting experience:', id);
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting experience:', error);
        toast.error("Failed to delete experience");
        return;
      }

      // Refresh experiences list
      const { data: experiences, error: fetchError } = await supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false });

      if (fetchError) {
        console.error('Error fetching experiences:', fetchError);
        toast.error("Failed to refresh experiences list");
        return;
      }

      setExperiences(experiences);
      toast.success("Experience deleted successfully");
    } catch (error) {
      console.error('Error in handleDeleteExperience:', error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleAddProject = async (data: any) => {
    try {
      console.log('Adding project:', data);
      const { error } = await supabase
        .from('projects')
        .insert([data]);

      if (error) {
        console.error('Error adding project:', error);
        toast.error("Failed to add project");
        return;
      }

      // Refresh projects list
      const { data: projects, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching projects:', fetchError);
        toast.error("Failed to refresh projects list");
        return;
      }

      setProjects(projects);
      toast.success("Project added successfully");
    } catch (error) {
      console.error('Error in handleAddProject:', error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleUpdateProject = async (data: any) => {
    try {
      console.log('Updating project:', data);
      const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', data.id);

      if (error) {
        console.error('Error updating project:', error);
        toast.error("Failed to update project");
        return;
      }

      // Refresh projects list
      const { data: projects, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching projects:', fetchError);
        toast.error("Failed to refresh projects list");
        return;
      }

      setProjects(projects);
      toast.success("Project updated successfully");
    } catch (error) {
      console.error('Error in handleUpdateProject:', error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleAddSkill = async (data: any) => {
    try {
      console.log('Adding skill:', data);
      const { error } = await supabase
        .from('skills')
        .insert([data]);

      if (error) {
        console.error('Error adding skill:', error);
        toast.error("Failed to add skill");
        return;
      }

      // Refresh skills list
      const { data: skills, error: fetchError } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true });

      if (fetchError) {
        console.error('Error fetching skills:', fetchError);
        toast.error("Failed to refresh skills list");
        return;
      }

      setSkills(skills);
      toast.success("Skill added successfully");
    } catch (error) {
      console.error('Error in handleAddSkill:', error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleUpdateSkill = async (data: any) => {
    try {
      console.log('Updating skill:', data);
      const { error } = await supabase
        .from('skills')
        .update(data)
        .eq('id', data.id);

      if (error) {
        console.error('Error updating skill:', error);
        toast.error("Failed to update skill");
        return;
      }

      // Refresh skills list
      const { data: skills, error: fetchError } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true });

      if (fetchError) {
        console.error('Error fetching skills:', fetchError);
        toast.error("Failed to refresh skills list");
        return;
      }

      setSkills(skills);
      toast.success("Skill updated successfully");
    } catch (error) {
      console.error('Error in handleUpdateSkill:', error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleAddBlog = async (data: any) => {
    try {
      console.log('Adding blog:', data);
      const { error } = await supabase
        .from('blogs')
        .insert([data]);

      if (error) {
        console.error('Error adding blog:', error);
        toast.error("Failed to add blog");
        return;
      }

      // Refresh blogs list
      const { data: blogs, error: fetchError } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching blogs:', fetchError);
        toast.error("Failed to refresh blogs list");
        return;
      }

      setBlogs(blogs);
      toast.success("Blog added successfully");
    } catch (error) {
      console.error('Error in handleAddBlog:', error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleUpdateBlog = async (data: any) => {
    try {
      console.log('Updating blog:', data);
      const { error } = await supabase
        .from('blogs')
        .update(data)
        .eq('id', data.id);

      if (error) {
        console.error('Error updating blog:', error);
        toast.error("Failed to update blog");
        return;
      }

      // Refresh blogs list
      const { data: blogs, error: fetchError } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching blogs:', fetchError);
        toast.error("Failed to refresh blogs list");
        return;
      }

      setBlogs(blogs);
      toast.success("Blog updated successfully");
    } catch (error) {
      console.error('Error in handleUpdateBlog:', error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleProfileUpdate = async (data: any) => {
    try {
      console.log('Updating profile:', data);
      const { error } = await supabase
        .from('profile')
        .update(data)
        .eq('id', profile?.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error("Failed to update profile");
        return;
      }

      // Refresh profile data
      const { data: profileData, error: fetchError } = await supabase
        .from('profile')
        .select('*')
        .single();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        toast.error("Failed to refresh profile data");
        return;
      }

      setProfile(profileData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error in handleProfileUpdate:', error);
      toast.error("An unexpected error occurred");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-cyan-400">
        <div className="text-xl animate-pulse">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-red-500">
        <div className="text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-cyan-400 mb-8">Admin Dashboard</h1>

      {updateMessage && (
        <div className={`p-4 rounded-lg ${
          updateMessage.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {updateMessage.text}
        </div>
      )}
      
      {/* Profile Section */}
      <Card className="bg-black/90 backdrop-blur-sm border-cyan-400/30">
        <CardHeader>
          <CardTitle className="text-cyan-400">Profile</CardTitle>
          <CardDescription className="text-cyan-400/70">
            Manage your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-cyan-400 font-medium">Name</h3>
                  <p className="text-cyan-400/70">{profile.name}</p>
                </div>
                <div>
                  <h3 className="text-cyan-400 font-medium">Title</h3>
                  <p className="text-cyan-400/70">{profile.title}</p>
                </div>
              </div>
              <div>
                <h3 className="text-cyan-400 font-medium">Bio</h3>
                <p className="text-cyan-400/70">{profile.bio}</p>
              </div>
              <Button
                onClick={handleProfileEdit}
                className="bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 border border-cyan-400/30"
              >
                Edit Profile
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleProfileEdit}
              className="bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 border border-cyan-400/30"
            >
              Add Profile
            </Button>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="bg-black/90 border-cyan-400/30">
          <TabsTrigger value="projects" className="data-[state=active]:bg-cyan-400/20">Projects</TabsTrigger>
          <TabsTrigger value="experience" className="data-[state=active]:bg-cyan-400/20">Experience</TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-cyan-400/20">Skills</TabsTrigger>
          <TabsTrigger value="blogs" className="data-[state=active]:bg-cyan-400/20">Blog Posts</TabsTrigger>
          <TabsTrigger value="contacts" className="data-[state=active]:bg-cyan-400/20">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Projects</h2>
              <Button 
                onClick={() => {
                  setSelectedContentType('project')
                  setSelectedContent(null)
                  setContentDialogOpen(true)
                }}
                className="bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
              >
                Add New Project
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="bg-black/50 backdrop-blur-sm border-cyan-400/30 hover:border-cyan-400/50 transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">{project.title}</CardTitle>
                    <CardDescription className="text-cyan-400/70">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.image_url && (
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-md border border-cyan-400/30"
                      />
                    )}
                    <div className="space-y-2">
                      {project.github_url && (
                        <p className="text-sm text-cyan-400/70">
                          GitHub: <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">{project.github_url}</a>
                        </p>
                      )}
                      {project.live_url && (
                        <p className="text-sm text-cyan-400/70">
                          Live: <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">{project.live_url}</a>
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(project, 'project')}
                      className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete({ ...project, type: 'projects' })}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:shadow-[0_0_10px_rgba(255,0,0,0.2)]"
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="experience">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Work Experience</h2>
              <Button 
                onClick={() => {
                  setSelectedContentType('experience')
                  setSelectedContent(null)
                  setContentDialogOpen(true)
                }}
                className="bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
              >
                Add New Experience
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {experiences.map((experience) => (
                <div
                  key={experience.id}
                  className="bg-black/50 border border-cyan-500/30 rounded-lg p-6 relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-purple-600/30 rounded-lg blur opacity-30 group-hover:opacity-50 transition"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-cyan-400">{experience.position}</h3>
                        <p className="text-cyan-400/70">{experience.company}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => {
                            setSelectedContentType('experience')
                            setSelectedContent(experience)
                            setContentDialogOpen(true)
                          }}
                          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteExperience(experience.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-cyan-400/70 mb-1">Duration</div>
                        <p>
                          {new Date(experience.start_date).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })}
                          {' - '}
                          {experience.current ? (
                            'Present'
                          ) : experience.end_date ? (
                            new Date(experience.end_date).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric'
                            })
                          ) : ''}
                        </p>
                      </div>

                      <div>
                        <div className="text-sm text-cyan-400/70 mb-1">Mission</div>
                        <p className="whitespace-pre-wrap">{experience.mission}</p>
                      </div>

                      <div>
                        <div className="text-sm text-cyan-400/70 mb-1">Achievements</div>
                        <ul className="list-disc list-inside space-y-1">
                          {experience.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Skills</h2>
              <Button 
                onClick={() => {
                  setSelectedContentType('skill')
                  setSelectedContent(null)
                  setContentDialogOpen(true)
                }}
                className="bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
              >
                Add New Skill
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) {
                    acc[skill.category] = [];
                  }
                  acc[skill.category].push(skill);
                  return acc;
                }, {} as Record<string, Skill[]>)
              ).map(([category, categorySkills]) => (
                <Card key={category} className="bg-black/50 backdrop-blur-sm border-cyan-400/30 hover:border-cyan-400/50 transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">{skill.icon}</span>
                              <span className="text-cyan-400">{skill.name}</span>
                            </div>
                            <span className="text-cyan-400/70">{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-cyan-400/30">
                            <div 
                              className="h-full bg-cyan-400/30"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          <div className="flex justify-end space-x-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEdit(skill, 'skill')}
                              className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDelete({ ...skill, type: 'skills' })}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:shadow-[0_0_10px_rgba(255,0,0,0.2)]"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="blogs">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Blog Posts</h2>
              <Button 
                onClick={() => {
                  setSelectedContentType('blog')
                  setSelectedContent(null)
                  setContentDialogOpen(true)
                }}
                className="bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
              >
                Add New Blog Post
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {blogs.map((blog) => (
                <Card key={blog.id} className="bg-black/50 backdrop-blur-sm border-cyan-400/30 hover:border-cyan-400/50 transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">{blog.title}</CardTitle>
                    <CardDescription className="text-cyan-400/70">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cyan-400/70 line-clamp-3">{blog.content}</p>
                    {blog.image_url && (
                      <img 
                        src={blog.image_url} 
                        alt={blog.title}
                        className="mt-4 w-full h-48 object-cover rounded-md border border-cyan-400/30"
                      />
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(blog, 'blog')}
                      className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete({ ...blog, type: 'blogs' })}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:shadow-[0_0_10px_rgba(255,0,0,0.2)]"
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Contact Form Submissions</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {contacts.map((contact) => (
                <Card key={contact.id} className="bg-black/50 backdrop-blur-sm border-cyan-400/30 hover:border-cyan-400/50 transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">{contact.name}</CardTitle>
                    <CardDescription className="text-cyan-400/70">
                      {contact.email}
                      <span className="block text-sm mt-1">
                        {new Date(contact.created_at).toLocaleString()}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cyan-400/70 whitespace-pre-wrap">{contact.message}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete({ ...contact, type: 'contacts' })}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:shadow-[0_0_10px_rgba(255,0,0,0.2)]"
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ContentDialog
        type={selectedContentType}
        open={contentDialogOpen}
        onOpenChange={setContentDialogOpen}
        initialData={selectedContent}
        onSubmit={async (data) => {
          try {
            switch (selectedContentType) {
              case 'experience':
                if (selectedContent) {
                  await handleUpdateExperience({ ...data, id: selectedContent.id });
                } else {
                  await handleAddExperience(data);
                }
                break;
              case 'project':
                if (selectedContent) {
                  await handleUpdateProject({ ...data, id: selectedContent.id });
                } else {
                  await handleAddProject(data);
                }
                break;
              case 'skill':
                if (selectedContent) {
                  await handleUpdateSkill({ ...data, id: selectedContent.id });
                } else {
                  await handleAddSkill(data);
                }
                break;
              case 'blog':
                if (selectedContent) {
                  await handleUpdateBlog({ ...data, id: selectedContent.id });
                } else {
                  await handleAddBlog(data);
                }
                break;
              case 'profile':
                await handleProfileUpdate(data);
                break;
              default:
                throw new Error('Invalid content type');
            }
            setContentDialogOpen(false);
            fetchData(); // Refresh all data after any change
          } catch (error) {
            console.error('Error in onSubmit:', error);
            toast.error(`Failed to ${selectedContent ? 'update' : 'add'} ${selectedContentType}`);
          }
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-black/90 backdrop-blur-sm border-cyan-400/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cyan-400">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-cyan-400/70">
              This action cannot be undone. This will permanently delete the item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:shadow-[0_0_10px_rgba(255,0,0,0.2)]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Contacts Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Contact Messages</h2>
        <ContactsTable />
      </section>

      {/* Experiences Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-cyan-400">Experiences</h2>
          <Button
            onClick={() => {
              setSelectedContentType('experience')
              setSelectedContent(null)
              setContentDialogOpen(true)
            }}
            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
          >
            Add Experience
          </Button>
        </div>

        <div className="grid gap-4">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              className="bg-black/50 border border-cyan-500/30 rounded-lg p-6 relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-purple-600/30 rounded-lg blur opacity-30 group-hover:opacity-50 transition"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-cyan-400">{experience.position}</h3>
                    <p className="text-cyan-400/70">{experience.company}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => {
                        setSelectedContentType('experience')
                        setSelectedContent(experience)
                        setContentDialogOpen(true)
                      }}
                      className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteExperience(experience.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-cyan-400/70 mb-1">Duration</div>
                    <p>
                      {new Date(experience.start_date).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                      {' - '}
                      {experience.current ? (
                        'Present'
                      ) : experience.end_date ? (
                        new Date(experience.end_date).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })
                      ) : ''}
                    </p>
                  </div>

                  <div>
                    <div className="text-sm text-cyan-400/70 mb-1">Mission</div>
                    <p className="whitespace-pre-wrap">{experience.mission}</p>
                  </div>

                  <div>
                    <div className="text-sm text-cyan-400/70 mb-1">Achievements</div>
                    <ul className="list-disc list-inside space-y-1">
                      {experience.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 