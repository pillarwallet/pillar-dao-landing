import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Chat from './pages/Chat';
import PlrDaoStaking from './pages/PlrDaoStaking';
import PlrEthereumToPolygon from './pages/PlrEthereumToPolygon';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Staking from './pages/Staking';
import Unstaking from './pages/Unstaking';
import Voting from './pages/Voting';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/plr-dao-staking" element={<PlrDaoStaking />} />
        <Route path="/plr_ethereum_to_polygon" element={<PlrEthereumToPolygon />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/staking" element={<Staking />} />
        <Route path="/unstaking-info" element={<Unstaking />} />
        <Route path="/voting" element={<Voting />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
