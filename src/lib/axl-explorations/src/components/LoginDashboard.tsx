import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Badge } from "./ui/badge";
import { User, LogIn, Trash2, UserPlus, Clock, Calendar } from 'lucide-react';
import { sessionManager, User as UserType } from "../utils/sessionManager";
import { sessionTelemetryManager } from "../utils/sessionTelemetryManager";

interface LoginDashboardProps {
  onLogin: (username: string) => void;
}

export const LoginDashboard = ({ onLogin }: LoginDashboardProps) => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load existing users
    setUsers(sessionManager.getUsers());
  }, []);

  const handleLogin = async (loginUsername?: string) => {
    const userToLogin = loginUsername || username.trim();
    if (!userToLogin) return;

    setIsLoading(true);
    
    // Simulate a brief loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const success = sessionManager.login(userToLogin);
    if (success) {
      // Start telemetry session
      // await sessionTelemetryManager.startUserSession(userToLogin);
      onLogin(userToLogin);
    }
    
    setIsLoading(false);
  };

  const handleQuickLogin = (user: UserType) => {
    handleLogin(user.username);
  };

  const handleDeleteUser = (username: string) => {
    const success = sessionManager.deleteUser(username);
    if (success) {
      setUsers(sessionManager.getUsers());
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome to AXL Learning
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Choose your profile to start your learning journey
          </p>
        </div>

        <div className={`grid gap-6 sm:gap-8 ${users.length > 0 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'}`}>
          {/* New User Login */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-500" />
                {users.length > 0 ? 'New User Login' : 'Get Started'}
              </CardTitle>
              <CardDescription>
                {users.length > 0 
                  ? 'Enter your username to create a new profile or login'
                  : 'Enter your username to create your profile and start learning'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="h-10 sm:h-12 text-base sm:text-lg"
                />
              </div>
              <Button
                onClick={() => handleLogin()}
                disabled={!username.trim() || isLoading}
                className="w-full h-10 sm:h-12 text-base sm:text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    {users.length > 0 ? 'Login' : 'Start Learning'}
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Users - Only show when there are users */}
          {users.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-500" />
                  Recent Profiles
                </CardTitle>
                <CardDescription>
                  Select from your recent profiles to continue learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {users.map((user, index) => (
                    <div
                      key={user.username}
                      className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-xs sm:text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 
                            className="font-semibold text-gray-900 text-sm sm:text-base break-all" 
                            title={user.username}
                          >
                            {user.username}
                          </h3>
                          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{new Date(user.loginTime).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                        <Button
                          onClick={() => handleQuickLogin(user)}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 h-8 w-8 p-0"
                          title="Login"
                        >
                          <LogIn className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                              title="Delete profile"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Profile</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the profile "{user.username}"? 
                                This action cannot be undone and will remove all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.username)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
};
