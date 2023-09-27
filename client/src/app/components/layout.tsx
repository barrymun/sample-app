// import useSWR from 'swr'
// import Navbar from './navbar'
// import Footer from './footer'
 
const Layout = ({ children }: { children: React.ReactNode }) => {
  console.log('layout')
  // const { data, error } = useSWR('/api/navigation', fetcher)
 
  // if (error) return <div>Failed to load</div>
  // if (!data) return <div>Loading...</div>
 
  return (
    <>
      {/* <Navbar links={data.links} /> */}
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  )
}

export { Layout };
