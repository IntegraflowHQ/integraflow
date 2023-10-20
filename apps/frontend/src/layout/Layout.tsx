import { Link, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <main>
      <nav>
        <ul className='flex gap-2 justify-center items-center'>
          <li className='bg-slate-300 hover:bg-slate-500 hover:underline'>
            <Link to="/">Home</Link>
          </li>
          <li className='bg-slate-300 hover:bg-slate-500 hover:underline'>
            <Link to="/todos">Todos</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </main>
  )
}

export default Layout