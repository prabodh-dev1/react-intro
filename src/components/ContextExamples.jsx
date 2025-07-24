import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';

function ContextExamples() {
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout, updatePreferences } = useUser();
  const [usernameInput, setUsernameInput] = useState('');
  const [favColorInput, setFavColorInput] = useState(user.preferences.favColor || '');

  const handleLogin = () => {
    if (usernameInput.trim()) {
      login(usernameInput);
      setUsernameInput('');
    }
  };

  const handleUpdateFavColor = () => {
    updatePreferences({ favColor: favColorInput });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Context API Examples</h2>
      <p className="text-gray-700 dark:text-gray-300">
        The Context API provides a way to pass data through the component tree without having to pass props down manually at every level.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Theme Context Example */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Context</CardTitle>
            <CardDescription>Global theme management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Current Theme: <span className="font-semibold capitalize">{theme}</span></p>
            <Button onClick={toggleTheme}>
              Toggle Theme to {theme === 'light' ? 'Dark' : 'Light'}
            </Button>
            <p className="text-sm text-gray-500">
              This button controls the theme for the entire application.
            </p>
          </CardContent>
        </Card>

        {/* User Context Example */}
        <Card>
          <CardHeader>
            <CardTitle>User Context</CardTitle>
            <CardDescription>Global user state and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Welcome, <span className="font-semibold">{user.name}</span>!</p>
            <p>Logged In: <span className="font-semibold">{user.isLoggedIn ? 'Yes' : 'No'}</span></p>
            {user.preferences.favColor && (
              <p>Favorite Color: <span className="font-semibold" style={{ color: user.preferences.favColor }}>{user.preferences.favColor}</span></p>
            )}

            {!user.isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
                <Button onClick={handleLogin}>Login</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label htmlFor="favColor">Favorite Color</Label>
                <Input
                  id="favColor"
                  type="text"
                  placeholder="e.g., blue, #FF0000"
                  value={favColorInput}
                  onChange={(e) => setFavColorInput(e.target.value)}
                />
                <Button onClick={handleUpdateFavColor}>Update Favorite Color</Button>
                <Button onClick={logout} variant="outline">Logout</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ContextExamples;


