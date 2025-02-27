-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  head_id UUID NOT NULL
);

-- Create branches table
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL
);

-- Create assets table
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  tag_number TEXT NOT NULL,
  specifications TEXT,
  condition TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  branch_id UUID NOT NULL REFERENCES branches(id),
  department_id UUID NOT NULL REFERENCES departments(id)
);

-- Create asset_requests table
CREATE TABLE asset_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  asset_id UUID NOT NULL REFERENCES assets(id),
  requester_id UUID NOT NULL,
  requester_type TEXT NOT NULL,
  purpose TEXT NOT NULL,
  purpose_category TEXT NOT NULL,
  justification TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  branch_id UUID NOT NULL REFERENCES branches(id),
  department_id UUID NOT NULL REFERENCES departments(id)
);

-- Create approvals table
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  request_id UUID NOT NULL REFERENCES asset_requests(id),
  approver_id UUID NOT NULL,
  approver_role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  comments TEXT
);

-- Create security_verifications table
CREATE TABLE security_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  request_id UUID NOT NULL REFERENCES asset_requests(id),
  floor_guard_name TEXT NOT NULL,
  floor_guard_signature TEXT NOT NULL,
  gate_guard_name TEXT NOT NULL,
  gate_guard_signature TEXT NOT NULL,
  verification_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  link TEXT
);

-- Create indexes
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_asset_requests_status ON asset_requests(status);
CREATE INDEX idx_approvals_request_id ON approvals(request_id);
CREATE INDEX idx_security_verifications_request_id ON security_verifications(request_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Create RLS policies
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you'll need to adjust these based on your exact requirements)
CREATE POLICY "Enable read access for all users" ON assets FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON asset_requests FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON approvals FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON security_verifications FOR SELECT USING (true);
CREATE POLICY "Users can read their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
