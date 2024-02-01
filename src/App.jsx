import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [unfollowers, setUnfollowers] = useState([]);
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchData = async (e) => {
    e.preventDefault();
    setLoading(true);
    if(userName === ""){
      alert("Username cant be empty")
      return
    }
    try {
      // Fetch followers
      let followersResult = [];
      let followersPage = 1;

      while (true) {
        const response = await axios.get(
          `https://api.github.com/users/${userName}/followers?page=${followersPage}&per_page=100`
        );

        if (response.data.length === 0) {
          break; // No more followers
        }

        followersResult = [...followersResult, ...response.data];
        followersPage++;
      }

      // Fetch following
      let followingResult = [];
      let followingPage = 1;

      while (true) {
        const response = await axios.get(
          `https://api.github.com/users/${userName}/following?page=${followingPage}&per_page=100`
        );

        if (response.data.length === 0) {
          break; // No more following
        }

        followingResult = [...followingResult, ...response.data];
        followingPage++;
      }

      setFollowers(followersResult);
      setFollowing(followingResult);
      setLoading(false);
    } catch (error) {
      alert( error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const findUnfollowers = () => {
      const unfollowersList = following.filter(
        (user) => !followers.find((follower) => follower.login === user.login)
      );
      setUnfollowers(unfollowersList);
    };

    findUnfollowers();
  }, [followers, following]);



  return (
    <>
      <h2 className='text-center text-4xl mt-3 mb-8'>Github Unfollowers</h2>
      <form onSubmit={fetchData} className='flex flex-col gap-y-5 text-center'>
        <label className='text-lg' htmlFor="name">Github Username</label>
        <input id='name' autoComplete="github-unfollowers-username" name='name' className='text-lg max-w-screen-md w-11/12 m-auto p-4 outline-none' type="text" onChange={(e) => { setUserName(e.target.value) }} placeholder='vaibhav1663' />
        <button className='m-auto bg-red-700 py-1 px-4 flex items-center' type='submit'>Get Unfollowers <svg className='ml-2' id="SvgjsSvg1001" width="30" height="30" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs"><defs id="SvgjsDefs1002"></defs><g id="SvgjsG1008"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30"><path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="m3.5 20.5 17-17M9.5 3.5h11v11" data-name="Arrow 2 Left Up" className="colorStroke303c42 svgStroke"></path></svg></g></svg></button>
      </form>
     
      {loading?
      <div className="loading max-w-screen-md w-11/12 m-auto bg-[#3b3a3a] h-2.5 mt-8 mb-2">
        <div className="loading-in bg-red-700 h-2.5 " style={{width: "35%"}}></div>
      </div> :  <div className='mt-4 flex flex-col w-11/12 max-w-screen-md m-auto '>
        {unfollowers.map((user) => (
          <div key={user.login} className='flex text-lg items-center justify-between'>
            <div className='flex items-center'>
              <img className='w-8 h-8 m-2' src={user.avatar_url} alt="" />
              <p className='truncate max-sm:max-w-[8rem]'>{user.login}</p>
              
            </div>
            <a href={user.html_url} className='text-sm px-2 py-1 bg-red-600' target='_blank'>unfollow</a>
          </div>
        ))}
      </div>}
    </>
  )
}

export default App
