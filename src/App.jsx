import { useState, useEffect, Component } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx'
import { Heart, MessageCircle, Repeat2, Share, User, Calendar, AlertTriangle, RefreshCw } from 'lucide-react'
import './App.css'

// Error Boundary Class Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="w-full max-w-md border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Caught by Boundary</AlertTitle>
              <AlertDescription>
                {this.state.error && this.state.error.toString()}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            {this.props.showDetails && (
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

// HOC for Error Handling
function withErrorHandling(WrappedComponent, errorMessage = "An error occurred") {
  return function ErrorHandledComponent(props) {
    return (
      <ErrorBoundary showDetails={props.showErrorDetails}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }
}

// HOC for Loading States
function withLoading(WrappedComponent) {
  return function LoadingComponent({ isLoading, loadingMessage = "Loading...", ...props }) {
    if (isLoading) {
      return (
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">{loadingMessage}</p>
          </CardContent>
        </Card>
      )
    }
    
    return <WrappedComponent {...props} />
  }
}

// HOC for Analytics/Logging
function withAnalytics(WrappedComponent, componentName) {
  return function AnalyticsComponent(props) {
    useEffect(() => {
      console.log(`${componentName} mounted`)
      return () => {
        console.log(`${componentName} unmounted`)
      }
    }, [])

    const handleClick = (originalHandler) => {
      return (event) => {
        console.log(`Click event in ${componentName}:`, event.type)
        if (originalHandler) {
          originalHandler(event)
        }
      }
    }

    // Wrap click handlers with analytics
    const enhancedProps = {
      ...props,
      onClick: props.onClick ? handleClick(props.onClick) : undefined
    }

    return <WrappedComponent {...enhancedProps} />
  }
}

// Component that intentionally throws errors for demonstration
function BuggyComponent({ shouldThrow = false }) {
  const [count, setCount] = useState(0)

  if (shouldThrow && count > 3) {
    throw new Error("Counter exceeded maximum value!")
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Buggy Component</CardTitle>
        <CardDescription>Throws error when count exceeds 3</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-red-600">{count}</div>
          <p className="text-sm text-gray-600">Danger Count</p>
        </div>
        <Button 
          onClick={() => setCount(count + 1)}
          variant={count > 2 ? "destructive" : "default"}
          className="w-full"
        >
          {count > 2 ? "⚠️ Danger Zone!" : "Increment"}
        </Button>
        <p className="text-xs text-gray-500 text-center">
          This component will throw an error when count exceeds 3
        </p>
      </CardContent>
    </Card>
  )
}

// Enhanced components using HOCs
const BuggyComponentWithErrorHandling = withErrorHandling(BuggyComponent)
const BuggyComponentWithAnalytics = withAnalytics(withErrorHandling(BuggyComponent), "BuggyComponent")

// Async component for demonstrating loading HOC
function AsyncDataComponent({ delay = 2000 }) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, delay))
      setData({
        message: "Data loaded successfully!",
        timestamp: new Date().toLocaleTimeString(),
        items: ["React", "HOCs", "Error Boundaries", "Loading States"]
      })
      setIsLoading(false)
    }

    fetchData()
  }, [delay])

  if (!data) return null

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Async Data Component</CardTitle>
        <CardDescription>Loaded at {data.timestamp}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-3">{data.message}</p>
        <div className="space-y-1">
          {data.items.map((item, index) => (
            <Badge key={index} variant="secondary" className="mr-2">
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const AsyncDataWithLoading = withLoading(AsyncDataComponent)

// HOC Composition Example
function ComposedComponent() {
  const [shouldThrow, setShouldThrow] = useState(false)
  
  return (
    <div className="space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>HOC Composition</CardTitle>
          <CardDescription>Multiple HOCs applied to one component</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="throwError"
              checked={shouldThrow}
              onChange={(e) => setShouldThrow(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="throwError" className="text-sm">
              Enable error throwing
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Check the browser console to see analytics logging
          </p>
        </CardContent>
      </Card>
      
      <BuggyComponentWithAnalytics 
        shouldThrow={shouldThrow} 
        showErrorDetails={true}
      />
    </div>
  )
}

// Component 1: Basic Functional Component
function WelcomeMessage({ name, role }) {
  return (
    <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
      <h1 className="text-3xl font-bold mb-2">Welcome to React Components Introduction!</h1>
      <p className="text-lg">Hello {name}, you are learning as a {role}</p>
    </div>
  )
}

// Component 2: Counter with State Hook
function Counter() {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState(1)

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>State Hook Example</CardTitle>
        <CardDescription>Demonstrates useState hook with counter</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">{count}</div>
          <p className="text-sm text-gray-600">Current Count</p>
        </div>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => setCount(count - step)} variant="outline">
            - {step}
          </Button>
          <Button onClick={() => setCount(count + step)}>
            + {step}
          </Button>
        </div>
        <div className="flex gap-2 justify-center">
          <Button 
            onClick={() => setStep(1)} 
            variant={step === 1 ? "default" : "outline"}
            size="sm"
          >
            Step: 1
          </Button>
          <Button 
            onClick={() => setStep(5)} 
            variant={step === 5 ? "default" : "outline"}
            size="sm"
          >
            Step: 5
          </Button>
          <Button 
            onClick={() => setStep(10)} 
            variant={step === 10 ? "default" : "outline"}
            size="sm"
          >
            Step: 10
          </Button>
        </div>
        <Button onClick={() => setCount(0)} variant="destructive" className="w-full">
          Reset
        </Button>
      </CardContent>
    </Card>
  )
}

// Component 3: Todo List with Array State
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React Components", completed: true },
    { id: 2, text: "Understand Props and State", completed: false },
    { id: 3, text: "Master React Hooks", completed: false }
  ])
  const [newTodo, setNewTodo] = useState("")

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: newTodo, 
        completed: false 
      }])
      setNewTodo("")
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Todo List Component</CardTitle>
        <CardDescription>Demonstrates array state management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add new todo..."
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <Button onClick={addTodo}>Add</Button>
        </div>
        <div className="space-y-2">
          {todos.map(todo => (
            <div key={todo.id} className="flex items-center gap-2 p-2 border rounded">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4"
              />
              <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </span>
              <Button 
                onClick={() => deleteTodo(todo.id)} 
                variant="destructive" 
                size="sm"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          {todos.filter(t => !t.completed).length} of {todos.length} remaining
        </div>
      </CardContent>
    </Card>
  )
}

// Component 4: Twitter/X Tweet Component
function Tweet({ tweet }) {
  const [liked, setLiked] = useState(false)
  const [retweeted, setRetweeted] = useState(false)
  const [likeCount, setLikeCount] = useState(tweet.likes)
  const [retweetCount, setRetweetCount] = useState(tweet.retweets)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  const handleRetweet = () => {
    setRetweeted(!retweeted)
    setRetweetCount(retweeted ? retweetCount - 1 : retweetCount + 1)
  }

  return (
    <Card className="w-full max-w-lg hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold">{tweet.author}</span>
              <span className="text-gray-500">@{tweet.username}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500 text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {tweet.date}
              </span>
            </div>
            <p className="text-gray-800 mb-3 leading-relaxed">{tweet.content}</p>
            {tweet.image && (
              <div className="mb-3 rounded-lg overflow-hidden">
                <img 
                  src={tweet.image} 
                  alt="Tweet image" 
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
            <div className="flex items-center justify-between text-gray-500 max-w-md">
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{tweet.replies}</span>
              </button>
              <button 
                onClick={handleRetweet}
                className={`flex items-center gap-2 hover:text-green-500 transition-colors ${
                  retweeted ? 'text-green-500' : ''
                }`}
              >
                <Repeat2 className="w-4 h-4" />
                <span className="text-sm">{retweetCount}</span>
              </button>
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 hover:text-red-500 transition-colors ${
                  liked ? 'text-red-500' : ''
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm">{likeCount}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Component 5: Twitter Feed with useEffect
function TwitterFeed() {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)

  // Simulate API call with useEffect
  useEffect(() => {
    const fetchTweets = () => {
      setTimeout(() => {
        const sampleTweets = [
          {
            id: 1,
            author: "React Dev",
            username: "reactjs",
            content: "🎉 React 18 is here! Concurrent features, automatic batching, and so much more. The future of React development is exciting! #React18 #WebDev",
            date: "2h",
            likes: 1247,
            retweets: 423,
            replies: 89,
            image: null
          },
          {
            id: 2,
            author: "JavaScript Daily",
            username: "js_daily",
            content: "💡 Pro tip: Use React.memo() to prevent unnecessary re-renders in your functional components. It's like PureComponent but for function components!",
            date: "4h",
            likes: 892,
            retweets: 234,
            replies: 45,
            image: null
          },
          {
            id: 3,
            author: "Frontend Masters",
            username: "frontendmasters",
            content: "🚀 Building modern web apps with React? Don't forget these essential hooks:\n\n• useState - for state management\n• useEffect - for side effects\n• useContext - for global state\n• useMemo - for performance optimization",
            date: "6h",
            likes: 2156,
            retweets: 678,
            replies: 123,
            image: null
          },
          {
            id: 4,
            author: "Web Dev Simplified",
            username: "webdevsimplified",
            content: "The best way to learn React? Build projects! Start with a todo app, then a weather app, then something you're passionate about. Practice makes perfect! 💪",
            date: "8h",
            likes: 1543,
            retweets: 445,
            replies: 67,
            image: null
          }
        ]
        setTweets(sampleTweets)
        setLoading(false)
      }, 1500) // Simulate network delay
    }

    fetchTweets()
  }, [])

  if (loading) {
    return (
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tweets...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 w-full max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
            Twitter Feed
          </CardTitle>
          <CardDescription>useEffect hook demonstration with simulated API</CardDescription>
        </CardHeader>
      </Card>
      {tweets.map(tweet => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
    </div>
  )
}

// Component 6: Theme Toggle with Context (simplified)
function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Theme Toggle</CardTitle>
        <CardDescription>Demonstrates useEffect for DOM manipulation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <Button 
            onClick={() => setIsDark(!isDark)}
            variant={isDark ? "default" : "outline"}
          >
            {isDark ? "🌙 Dark" : "☀️ Light"}
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Current theme: {isDark ? "Dark" : "Light"}
        </p>
      </CardContent>
    </Card>
  )
}

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState("basics")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <WelcomeMessage name="Developer" role="React Enthusiast" />
        
        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="state">State</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="twitter">Twitter</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="text-2xl font-bold mb-4">React Component Basics</h2>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>What are Components?</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">
                          Components are the building blocks of React applications. They are reusable pieces of UI that can accept inputs (props) and return JSX elements.
                        </p>
                        <div className="mt-4">
                          <Badge variant="secondary">Functional Components</Badge>
                          <Badge variant="secondary" className="ml-2">Props</Badge>
                          <Badge variant="secondary" className="ml-2">JSX</Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Props Example</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          The welcome message above uses props to display dynamic content:
                        </p>
                        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
{`<WelcomeMessage 
  name="Developer" 
  role="React Enthusiast" 
/>`}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </TabsContent>
            
            <TabsContent value="state" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="text-2xl font-bold mb-4">State Management</h2>
                  <Card className="mb-4">
                    <CardHeader>
                      <CardTitle>useState Hook</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300">
                        The useState hook allows functional components to have state. It returns an array with the current state value and a function to update it.
                      </p>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm mt-3 overflow-x-auto">
{`const [count, setCount] = useState(0)
const [step, setStep] = useState(1)`}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Counter />
                  <TodoList />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="effects" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Side Effects</h2>
                  <Card>
                    <CardHeader>
                      <CardTitle>useEffect Hook</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        useEffect lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.
                      </p>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
{`useEffect(() => {
  // Side effect code
  fetchData()
  
  return () => {
    // Cleanup code
  }
}, [dependency])`}
                      </pre>
                      <div className="mt-4">
                        <Badge variant="outline">Data Fetching</Badge>
                        <Badge variant="outline" className="ml-2">DOM Updates</Badge>
                        <Badge variant="outline" className="ml-2">Cleanup</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <TwitterFeed />
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Advanced Patterns</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Higher Order Components (HOCs) and Error Boundaries for robust React applications.
                </p>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Higher Order Components</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          HOCs are functions that take a component and return a new component with enhanced functionality.
                        </p>
                        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
{`function withErrorHandling(Component) {
  return function Enhanced(props) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}`}
                        </pre>
                        <div className="mt-4">
                          <Badge variant="outline">Error Handling</Badge>
                          <Badge variant="outline" className="ml-2">Loading States</Badge>
                          <Badge variant="outline" className="ml-2">Analytics</Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Error Boundaries</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Error boundaries catch JavaScript errors in component trees and display fallback UI.
                        </p>
                        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
{`class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    // Log error and show fallback UI
  }
  
  render() {
    if (this.state.hasError) {
      return <FallbackComponent />
    }
    return this.props.children
  }
}`}
                        </pre>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>HOC Composition</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Multiple HOCs can be composed together for complex functionality:
                        </p>
                        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
{`const Enhanced = withAnalytics(
  withErrorHandling(
    withLoading(Component)
  )
)`}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-6">
                    <ComposedComponent />
                    <AsyncDataWithLoading 
                      isLoading={false} 
                      delay={1000}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="twitter" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Twitter Integration Example</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  This section demonstrates how React components can be used to build social media interfaces like Twitter. 
                  Each tweet is a component that manages its own state for interactions.
                </p>
                <TwitterFeed />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <footer className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <p>Built with React, Vite, and Tailwind CSS</p>
          <p className="text-sm mt-2">Explore the code to learn more about React components!</p>
        </footer>
      </div>
    </div>
  )
}

export default App

