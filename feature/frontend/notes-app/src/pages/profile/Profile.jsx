import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '@/utils/helper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  User, 
  Mail, 
  Calendar, 
  LogOut, 
  ArrowLeft, 
  FileText, 
  Lock,
  Shield,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalNotes: 0, pinnedNotes: 0, secretNotes: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        // Load user data
        const userData = await apiRequest('/api/me', { method: 'GET' });
        setUser(userData);
        
        // Load user statistics
        try {
          const [notes, secretNotes] = await Promise.all([
            apiRequest('/api/notes', { method: 'GET' }),
            apiRequest('/api/secret/notes', { method: 'GET' }).catch(() => [])
          ]);
          
          setStats({
            totalNotes: notes.length,
            pinnedNotes: notes.filter(n => n.isPinned).length,
            secretNotes: secretNotes.length
          });
        } catch (statsErr) {
          console.error('Failed to load stats:', statsErr);
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center">
          <div className="relative inline-flex mb-4">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center max-w-md p-8">
          <div className="rounded-full bg-red-100 p-6 inline-flex mb-4">
            <User className="h-12 w-12 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Profile</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToHome}
                className="hover:bg-purple-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  User Profile
                </h1>
                <p className="text-sm text-muted-foreground">Manage your account settings</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-2 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {getInitials(user?.name)}
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  </div>
                </div>
                <CardTitle className="text-2xl">{user?.name || 'User'}</CardTitle>
                <CardDescription className="text-base">{user?.email}</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs">Account ID</p>
                    <p className="font-mono text-xs truncate">{user?.id || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs">Email Address</p>
                    <p className="truncate">{user?.email}</p>
                  </div>
                </div>

                {user?.createdAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs">Member Since</p>
                      <p>{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</p>
                    </div>
                  </div>
                )}

                {user?.hasSecretPin && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs">Secret Safe</p>
                      <p className="text-purple-600 font-semibold">Protected with PIN</p>
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription>Total Notes</CardDescription>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    {stats.totalNotes}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Regular notes created</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription>Pinned Notes</CardDescription>
                    <FileText className="h-4 w-4 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">
                    {stats.pinnedNotes}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Important notes</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription>Secret Notes</CardDescription>
                    <Lock className="h-4 w-4 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {stats.secretNotes}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">PIN-protected notes</p>
                </CardContent>
              </Card>
            </div>

            {/* Account Information */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>Your personal details and account status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Full Name</p>
                    <p className="text-lg font-semibold">{user?.name || 'Not set'}</p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Email Address</p>
                    <p className="text-lg font-semibold truncate">{user?.email}</p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Account Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-lg font-semibold text-green-600">Active</p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Security</p>
                    <p className="text-lg font-semibold">
                      {user?.hasSecretPin ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <Shield className="h-4 w-4" />
                          PIN Enabled
                        </span>
                      ) : (
                        <span className="text-amber-600">No PIN</span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Activity Summary
                </CardTitle>
                <CardDescription>Your recent activity overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Regular Notes</p>
                        <p className="text-xs text-muted-foreground">Total created</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{stats.totalNotes}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded">
                        <Lock className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Secret Notes</p>
                        <p className="text-xs text-muted-foreground">PIN-protected</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">{stats.secretNotes}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded">
                        <FileText className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">Pinned Notes</p>
                        <p className="text-xs text-muted-foreground">Important items</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">{stats.pinnedNotes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Navigate to different sections</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onClick={handleBackToHome}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-start hover:bg-purple-50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4" />
                    <span className="font-semibold">My Notes</span>
                  </div>
                  <span className="text-xs text-muted-foreground">View all your notes</span>
                </Button>

                <Button
                  onClick={() => navigate('/secret-safe')}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-start hover:bg-purple-50"
                  disabled={!user?.hasSecretPin}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="h-4 w-4" />
                    <span className="font-semibold">Secret Safe</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {user?.hasSecretPin ? 'Access secret notes' : 'Setup PIN first'}
                  </span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
