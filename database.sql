-- Enable RLS
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- Create profile table
CREATE TABLE profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    years_of_experience VARCHAR(50) NOT NULL,
    companies TEXT NOT NULL,
    core_competencies TEXT[] NOT NULL,
    specialized_skills TEXT[] NOT NULL,
    approach_text TEXT NOT NULL,
    security_audits_count VARCHAR(20) NOT NULL,
    vulnerabilities_count VARCHAR(20) NOT NULL,
    architectures_count VARCHAR(20) NOT NULL,
    certifications_count VARCHAR(20) NOT NULL,
    github_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample profile data
INSERT INTO profile (
    name,
    title,
    bio,
    years_of_experience,
    companies,
    core_competencies,
    specialized_skills,
    approach_text,
    security_audits_count,
    vulnerabilities_count,
    architectures_count,
    certifications_count
) VALUES (
    'Mohit Gera',
    'Cybersecurity Specialist',
    'Cybersecurity professional with 6+ years of experience in protecting critical infrastructure and sensitive data. Specialized in threat detection, vulnerability assessment, and implementing robust security architectures for enterprise environments.',
    '6+ Years Experience',
    'Maruti Suzuki & TCS',
    ARRAY['Security Architecture', 'Penetration Testing', 'Threat Intelligence', 'Incident Response'],
    ARRAY['Network Security', 'Cloud Security', 'Vulnerability Assessment', 'Security Compliance'],
    'I approach cybersecurity with a proactive mindset, focusing on identifying and mitigating vulnerabilities before they can be exploited. My methodology combines technical expertise with strategic thinking to develop comprehensive security solutions that protect against evolving threats while enabling business objectives.',
    '50+',
    '100+',
    '25+',
    '10+'
);

-- Set up RLS policies
CREATE POLICY "Enable read access for all users" ON "public"."profile"
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."profile"
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON "public"."profile"
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Create experiences table
CREATE TABLE experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  mission TEXT NOT NULL,
  achievements TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample experience data
INSERT INTO experiences (
    company,
    position,
    start_date,
    end_date,
    current,
    mission,
    achievements
) VALUES (
    'Maruti Suzuki',
    'Senior Cybersecurity Specialist',
    '2020-01-01',
    NULL,
    true,
    'Leading security architecture and implementation for connected vehicle platforms. Conducting threat modeling and penetration testing for automotive systems. Developing security frameworks compliant with automotive standards.',
    ARRAY[
        'Reduced security vulnerabilities by 75% through implementation of proactive security measures',
        'Led a team of 5 security professionals in securing connected vehicle infrastructure',
        'Implemented NIST cybersecurity framework across the organization'
    ]
);

-- Enable Row Level Security (RLS)
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous read access" ON experiences
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated create access" ON experiences
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access" ON experiences
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access" ON experiences
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL,
    icon VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample skills data
INSERT INTO skills (name, category, level, icon) VALUES
-- Technical Skills
('Network Security', 'Technical Skills', 95, '💻'),
('Penetration Testing', 'Technical Skills', 90, '💻'),
('Malware Analysis', 'Technical Skills', 85, '💻'),
('Cryptography', 'Technical Skills', 80, '💻'),
('Forensic Analysis', 'Technical Skills', 85, '💻'),
('SIEM Implementation', 'Technical Skills', 90, '💻'),

-- Frameworks & Standards
('ISO 27001', 'Frameworks & Standards', 90, '🔧'),
('NIST Cybersecurity', 'Frameworks & Standards', 95, '🔧'),
('MITRE ATT&CK', 'Frameworks & Standards', 85, '🔧'),
('OWASP Top 10', 'Frameworks & Standards', 90, '🔧'),
('CIS Controls', 'Frameworks & Standards', 80, '🔧'),
('GDPR Compliance', 'Frameworks & Standards', 85, '🔧'),

-- Security Tools
('Wireshark', 'Security Tools', 95, '🛠️'),
('Metasploit', 'Security Tools', 90, '🛠️'),
('Nessus', 'Security Tools', 85, '🛠️'),
('Burp Suite', 'Security Tools', 90, '🛠️'),
('Splunk', 'Security Tools', 85, '🛠️'),
('Kali Linux', 'Security Tools', 95, '🛠️'),

-- Certifications
('Certified Ethical Hacker (CEH)', 'Certifications', 100, '🏆'),
('CISSP', 'Certifications', 100, '🏆'),
('CompTIA Security+', 'Certifications', 100, '🏆'),
('OSCP', 'Certifications', 100, '🏆'),
('AWS Security Specialty', 'Certifications', 100, '🏆'),
('CISM', 'Certifications', 100, '🏆');

-- Set up RLS policies
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON "public"."skills"
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."skills"
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON "public"."skills"
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON "public"."skills"
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255),
    tags TEXT[] NOT NULL,
    details JSONB NOT NULL,
    color VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample project data
INSERT INTO projects (title, description, image, tags, details, color) VALUES
(
    'Automotive Security Framework',
    'Developed a comprehensive security framework for connected vehicles, implementing secure boot, secure OTA updates, and intrusion detection systems.',
    '/images/project1.jpg',
    ARRAY['Automotive Security', 'IoT', 'Intrusion Detection'],
    '{
        "challenge": "Modern vehicles are increasingly connected, making them vulnerable to cyber attacks. The challenge was to develop a security framework that protects all aspects of the vehicle''s digital systems without compromising performance.",
        "solution": "Implemented a multi-layered security approach including secure boot mechanisms, encrypted communications, intrusion detection systems, and regular security assessments.",
        "technologies": ["Secure Boot", "PKI Infrastructure", "CAN Bus Monitoring", "Anomaly Detection"],
        "outcome": "The framework was implemented across multiple vehicle models, reducing security vulnerabilities by 85% and establishing a new standard for automotive cybersecurity."
    }',
    'from-cyan-500 to-blue-600'
),
(
    'Enterprise Threat Intelligence Platform',
    'Designed and implemented an AI-powered threat intelligence platform that correlates data from multiple sources to identify potential security threats.',
    '/images/project2.jpg',
    ARRAY['Threat Intelligence', 'AI/ML', 'SIEM'],
    '{
        "challenge": "Organizations face numerous cyber threats daily, making it difficult to distinguish between real threats and false positives. Manual analysis was time-consuming and often missed sophisticated attacks.",
        "solution": "Developed an AI-powered platform that aggregates and analyzes threat data from multiple sources, using machine learning to identify patterns and predict potential attacks.",
        "technologies": ["Python", "TensorFlow", "Elasticsearch", "Kibana", "MISP"],
        "outcome": "The platform reduced false positives by 60%, increased threat detection speed by 75%, and provided actionable intelligence for security teams."
    }',
    'from-purple-500 to-indigo-600'
),
(
    'Zero Trust Security Implementation',
    'Led the implementation of a zero trust security architecture for a financial institution, ensuring secure access to resources regardless of network location.',
    '/images/project3.jpg',
    ARRAY['Zero Trust', 'Identity Management', 'Network Security'],
    '{
        "challenge": "Traditional perimeter-based security was insufficient for a modern workforce with remote employees and cloud resources. The organization needed a security model that didn''t automatically trust users or devices.",
        "solution": "Implemented a zero trust architecture based on the principle of ''never trust, always verify'', with strong authentication, micro-segmentation, and continuous monitoring.",
        "technologies": ["Identity Management", "MFA", "Micro-segmentation", "Continuous Monitoring"],
        "outcome": "Successfully transitioned the organization to a zero trust model, reducing the attack surface and improving security posture while maintaining productivity."
    }',
    'from-green-500 to-teal-600'
);

-- Set up RLS policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON "public"."projects"
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."projects"
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON "public"."projects"
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON "public"."projects"
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create contacts table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous insert" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read" ON contacts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to update" ON contacts
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete" ON contacts
  FOR DELETE TO authenticated USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 