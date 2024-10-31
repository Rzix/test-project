
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
const Joi = require('joi');
interface Category {
  id: number;
  name: string;
}

interface Forum {
  id: number;
  name: string;
  categoryId: number;
}

interface Thread {
  id: number;
  forumId: number;
  categoryId: number;
  title: string;
  description: string;
}

interface Post {
  id: number;
  threadId: number;
  userId: number;
  content: string;
  createdAt: string;
}

interface User {
  id: number;        
  Email: string;     
  pass: string;      
}

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(4).max(20).required()
});

function App() {
  // const [categories, set] = useState<Category[]>([]);
  // const [forums, setForums] = useState<Forum[]>([]);
  // const [threads, setThreads] = useState<Thread[]>([]);
  // const [posts, setPosts] = useState<Post[]>([]);
  // const [users, setUsers] = useState<User[]>([]);
  const [data, setData] = useState({
    categories: [] as Category[],
    forums: [] as Forum[],
    threads: [] as Thread[],
    posts: [] as Post[],
    users: [] as User[]
  });
  const { categories, forums, threads, posts, users } = data;
  

  useEffect(() => {
    fetch('http://localhost:3000/data')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // console.log('Fetched data:', data);
        // const { categories, forums, threads, posts, users } = data;
        // console.log(categories,users)
        
        setData({
          categories: data.categories || [],
          forums: data.forums || [],
          threads: data.threads || [],
          posts: data.posts || [],
          users: data.users || []
        });
      })
      .catch(error => {
        console.error('Fetch error:', error);
        
      });
  }, []);
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login users={users} />} />
        <Route path="/category" element={<Categories categories={categories} />} />
        <Route path="/category/:categoryId" element={<Forums forums={forums} categories={categories} />} />
        <Route path="/forum/:forumId" element={<Threads threads={threads} forums={forums} />} />
        <Route path="/thread/:threadId" element={<Posts posts={posts} threads={threads}/>} />
      </Routes>
    </BrowserRouter>
  );
}

function Home(){
  return(
    <div className='min-h-screen w-full flex items-center justify-center'>
      <div className="flex items-center justify-between p-4">
        <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors duration-300 ease-in-out">
          Login
        </Link>
      </div>
    </div> 
  );
}


function Login({ users }: { users: User[] }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const { error: validationError } = loginSchema.validate({ email, password });
    if (validationError) {
      setError(validationError.details[0].message);
      return;
    }

    const user = users.find(user => user.Email === email && user.pass === password);
    if (user) {
      navigate('/category');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-100">
  <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
    <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Welcome Back!</h1>
    <form onSubmit={handleLogin}>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address:</label>
        <input 
          type="email" 
          id="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
          placeholder="your@email.com" 
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password:</label>
        <input 
          type="password" 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
          placeholder="Enter your password" 
        />
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <a href="#" className="text-xs text-gray-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Forgot Password?</a>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:outline-none" />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
        </div>
        <a href="#" className="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Create Account</a>
      </div>
      <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
    </form>
  </div>
</div>

    /******default style******/
  //   <div className="login-form">
  //     <h1>Login</h1>
  //     <form onSubmit={handleLogin}>
  //       <div className="input-group">
  //         <label htmlFor="email">Email:</label>
  //         <input 
  //           type="email" 
  //           id="email" 
  //           value={email} 
  //           onChange={(e) => setEmail(e.target.value)} 
  //           required 
  //         />
  //       </div>
  //       <div className="input-group">
  //         <label htmlFor="password">Password:</label>
  //         <input 
  //           type="password" 
  //           id="password" 
  //           value={password} 
  //           onChange={(e) => setPassword(e.target.value)} 
  //           required 
  //         />
  //       </div>
  //       {error && <p className="error">{error}</p>}
       
  //       <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
  //     </form>
  //   </div>
  );
}
//min-h-screen flex items-center justify-center w-full
function Categories({ categories }: { categories: Category[] }) {
  return (
    <div className='min-h-screen w-full flex items-center justify-center'>
    <div className="relative flex flex-col  text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border p-4">
      <h1 className="text-xl font-bold mb-4">Forum Categories</h1>
      <nav className="flex flex-col gap-1">
        <ul>
          {categories.map(category => (
            <li key={category.id}>
              <Link to={`/category/${category.id}`} className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
  </div>
    </div>
  );
}

function Forums({ forums, categories }: { forums: Forum[], categories: Category[] }) {
  const { categoryId } = useParams<{ categoryId: string }>();
  const filteredForums = forums.filter(forum => forum.categoryId === Number(categoryId));
  const filteredCategory = categories.find(cat => cat.id === Number(categoryId));

  return (
    <div className='min-h-screen w-full flex items-center justify-center'>
      <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border p-4">
        <h2 className="text-xl font-bold mb-4">Forums in Category {filteredCategory ? filteredCategory.name : 'Unknown Category'}</h2>
          <ul>
          {filteredForums.map(forum => (
              <li key={forum.id}>
                <Link to={`/forum/${forum.id}`} className='flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900'>{forum.name}</Link>
              </li>
            ))}
          </ul>
        <Link to="/category" className='font-medium text-blue-600 dark:text-blue-500 hover:underline p-2 m-2'>Back to Categories</Link>
      </div>
    </div>
  );
}

function Threads({ threads, forums }: { threads: Thread[], forums: Forum[] }) {
  const { forumId } = useParams<{ forumId: string }>();
  const filteredThreads = threads.filter(thread => thread.forumId === Number(forumId));
  const filteredForum = forums.find(forum => forum.id === Number(forumId));

  return (
    <div className='min-h-screen w-full flex items-center justify-center'>
      <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border p-4">
      <h3 className="text-xl font-bold mb-4">Threads in Forum {filteredForum ? filteredForum.name : 'Unknown Forum'}</h3>
        <ul>
          {filteredThreads.map(thread => (
            <li key={thread.id}>
              <Link to={`/thread/${thread.id}`} className='flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900'>{thread.title}</Link>
            </li>
          ))}
        </ul>
      <Link to="/category" className='font-medium text-blue-600 dark:text-blue-500 hover:underline p-2 m-2'>Back to Categories</Link>
    </div>
    </div>
  );
}

function Posts({ posts, threads }: { posts: Post[], threads: Thread[] }) {
  const { threadId } = useParams<{ threadId: string }>();
  const filteredPosts = posts.filter(post => post.threadId === Number(threadId));
  const filteredThread = threads.find(thread => thread.id === Number(threadId));

  return (
    <div className='min-h-screen w-full flex items-center justify-center'>
      <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border p-4">
        <h4 className="text-xl font-bold mb-4">Posts in Thread {filteredThread ? filteredThread.title : 'Unknown Thread'}</h4>
        <h5 className=" font-bold mb-4">Description: {filteredThread ? filteredThread.description : 'No Description'}</h5>
          <ul>
            {filteredPosts.map(post => (
              <div key={post.id}>
                <label><b>User: {post.userId}</b></label>
                <li className="text-red-600 shadow-lg p-4 rounded-md bg-white">{post.content} <small>({post.createdAt})</small></li>
              </div>
            ))}
          </ul>
        <Link to="/category" className='font-medium text-blue-600 dark:text-blue-500 hover:underline p-2 m-1'>Back to Categories</Link>
      </div>
    </div>
  );
}

export default App;



// interface Category {
//   id: number;
//   name: string;
// }

// interface Forum {
//   id: number;
//   name: string;
//   categoryId: number;
// }

// interface Thread {
//   id: number;
//   forumId: number;
//   title: string;
//   description: string;
// }

// function App() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [forums, setForums] = useState<Forum[]>([]);
//   const [threads, setThreads] = useState<Thread[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
//   const [selectedForum, setSelectedForum] = useState<number | null>(null);
//   const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);

//   // Fetch data from data.json
//   useEffect(() => {
//     fetch('http://localhost:3000/data')
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setCategories(data.categories);
//         setForums(data.forums);
//         setThreads(data.threads);
//       })
//       .catch((error) => {
//         console.error('Fetch error:', error);
//       });
//   }, []);
  
//   useEffect(() => {
//     if (selectedCategory !== null) {
//       fetch(`http://localhost:3001/forums?categoryId=${selectedCategory}`)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then((data) => {
//           setForums(data);
//         })
//         .catch((error) => {
//           console.error('Fetch error:', error);
//         });
//     }
//   }, [selectedCategory]);
  
  

//   // Filter threads based on selected category and forum
//   useEffect(() => {
//     if (selectedCategory !== null && selectedForum !== null) {
//       const forumIds = forums
//         .filter((forum) => forum.categoryId === selectedCategory)
//         .map((forum) => forum.id);

//       const filtered = threads.filter(
//         (thread) =>
//           forumIds.includes(thread.forumId) && thread.forumId === selectedForum
//       );
//       setFilteredThreads(filtered);
//     } else {
//       setFilteredThreads([]);
//     }
//   }, [selectedCategory, selectedForum, forums, threads]);

//   return (
    
//     <div className="App">
      
//       <header className="App-header">
//         <h1>Select a Category and Forum</h1>
        
       
//         <select
//           value={selectedCategory ?? ''}
//           onChange={(e) => setSelectedCategory(Number(e.target.value))}
//         >
//           <option value="">Select Category</option>
//           {categories.map((category) => (
//             <option key={category.id} value={category.id}>
//               {category.name}
//             </option>
//           ))}
//         </select>

        
//         <select
//           value={selectedForum ?? ''}
//           onChange={(e) => setSelectedForum(Number(e.target.value))}
//           disabled={!selectedCategory}
//         >
//           <option value="">Select Forum</option>
//           {forums
//             .filter((forum) => forum.categoryId === selectedCategory)
//             .map((forum) => (
//               <option key={forum.id} value={forum.id}>
//                 {forum.name}
//               </option>
//             ))}
//         </select>

        
//         <div className="threads">
//           <h2>Threads</h2>
//           {filteredThreads.length > 0 ? (
//             filteredThreads.map((thread) => (
//               <div key={thread.id} className="thread">
//                 <h3>{thread.title}</h3>
//                 <p>{thread.description}</p>
//               </div>
//             ))
//           ) : (
//             <p>No threads available for this selection.</p>
//           )}
//         </div>
//       </header>
//     </div>
//   );
// }

// export default App;
