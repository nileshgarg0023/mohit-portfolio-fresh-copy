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
  const [dialogType, setDialogType] = useState<'project' | 'experience' | 'skill' | 'blog'>('project');
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Delete confirmation states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
      }

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
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
      } else {
        setExperiences(experiencesData || []);
      }

      // Fetch skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('category');
      
      if (skillsError) {
        console.error('Error fetching skills:', skillsError);
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
      } else {
        setContacts(contactsData || []);
      }

      // Fetch blogs
      const { data: blogsData, error: blogsError } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (blogsError) {
        console.error('Error fetching blogs:', blogsError);
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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('profile')
        .update(profile)
        .eq('id', profile.id);

      if (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
      } else {
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Error updating profile');
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
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const { error } = await supabase
        .from(itemToDelete.type)
        .delete()
        .eq('id', itemToDelete.id);

      if (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item');
      } else {
        // Refresh data
        fetchData();
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Error deleting item');
    }
  };

  const handleContentSubmit = async (data: any) => {
    try {
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from(dialogType)
          .update(data)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from(dialogType)
          .insert([data]);

        if (error) throw error;
      }

      // Refresh data
      fetchData();
    } catch (err) {
      console.error('Error saving content:', err);
      alert('Error saving content');
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
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-cyan-400">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(0,255,255,0.1)_50%,transparent_52%)]"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-400 border-b border-cyan-400/30 pb-4">
            Admin Dashboard
          </h1>
          <p className="text-cyan-400/70 mt-2">Manage your portfolio content</p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-black/50 backdrop-blur-sm border border-cyan-400/30 p-1 w-full flex space-x-1">
            <TabsTrigger 
              value="profile" 
              className="flex-1 data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="flex-1 data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="experiences" 
              className="flex-1 data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            >
              Experiences
            </TabsTrigger>
            <TabsTrigger 
              value="skills" 
              className="flex-1 data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            >
              Skills
            </TabsTrigger>
            <TabsTrigger 
              value="blogs" 
              className="flex-1 data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            >
              Blogs
            </TabsTrigger>
            <TabsTrigger 
              value="contacts" 
              className="flex-1 data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            >
              Contacts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            {profile && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <form onSubmit={handleProfileUpdate} className="space-y-4 bg-black/50 backdrop-blur-sm p-6 rounded-lg border border-cyan-400/30">
                  <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
                  <div>
                    <label className="block mb-2 text-cyan-400">Name</label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="bg-black/50 border-cyan-400/30 text-cyan-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-cyan-400">Title</label>
                    <Input
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="bg-black/50 border-cyan-400/30 text-cyan-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-cyan-400">Bio</label>
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="bg-black/50 border-cyan-400/30 text-cyan-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 min-h-[200px]"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
                  >
                    Update Profile
                  </Button>
                </form>

                <div className="space-y-4">
                  <div className="bg-black/50 backdrop-blur-sm p-6 rounded-lg border border-cyan-400/30">
                    <h2 className="text-2xl font-semibold mb-4">Social Links</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-cyan-400">GitHub URL</label>
                        <Input
                          value={profile.github_url || ''}
                          onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                          className="bg-black/50 border-cyan-400/30 text-cyan-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-cyan-400">LinkedIn URL</label>
                        <Input
                          value={profile.linkedin_url || ''}
                          onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                          className="bg-black/50 border-cyan-400/30 text-cyan-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-cyan-400">Twitter URL</label>
                        <Input
                          value={profile.twitter_url || ''}
                          onChange={(e) => setProfile({ ...profile, twitter_url: e.target.value })}
                          className="bg-black/50 border-cyan-400/30 text-cyan-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                        />
                      </div>
                      <Button 
                        type="button"
                        onClick={handleProfileUpdate}
                        className="bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all w-full"
                      >
                        Update Social Links
                      </Button>
                    </div>
                  </div>

                  <div className="bg-black/50 backdrop-blur-sm p-6 rounded-lg border border-cyan-400/30">
                    <h2 className="text-2xl font-semibold mb-4">Profile Preview</h2>
                    <div className="space-y-2">
                      <p className="text-xl text-cyan-400">{profile.name}</p>
                      <p className="text-lg text-cyan-400/70">{profile.title}</p>
                      <p className="text-cyan-400/50 line-clamp-4">{profile.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Projects</h2>
                <Button 
                  onClick={() => handleAddNew('project')}
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

          <TabsContent value="experiences">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Work Experience</h2>
                <Button 
                  onClick={() => handleAddNew('experience')}
                  className="bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
                >
                  Add New Experience
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {experiences.map((experience) => (
                  <Card key={experience.id} className="bg-black/50 backdrop-blur-sm border-cyan-400/30 hover:border-cyan-400/50 transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                    <CardHeader>
                      <CardTitle className="text-cyan-400">{experience.position}</CardTitle>
                      <CardDescription className="text-cyan-400/70">
                        {experience.company}
                        <span className="block text-sm mt-1">
                          {experience.start_date} - {experience.current ? 'Present' : experience.end_date}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-cyan-400/70 whitespace-pre-wrap">{experience.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(experience, 'experience')}
                        className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete({ ...experience, type: 'experiences' })}
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

          <TabsContent value="skills">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Skills</h2>
                <Button 
                  onClick={() => handleAddNew('skill')}
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
                              <span className="text-cyan-400">{skill.name}</span>
                              <span className="text-cyan-400/70">{skill.proficiency}%</span>
                            </div>
                            <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-cyan-400/30">
                              <div 
                                className="h-full bg-cyan-400/30"
                                style={{ width: `${skill.proficiency}%` }}
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
                  onClick={() => handleAddNew('blog')}
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
          type={dialogType}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleContentSubmit}
          initialData={editingItem}
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
      </div>
    </div>
  );
} 