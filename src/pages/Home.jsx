import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Redirecting to the defi page...');
    navigate('/defi');
  }, []);

  return <div>Home page</div>;
}

export default Home;
