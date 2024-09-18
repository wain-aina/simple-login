import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import History from './components/History';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Use element instead of component and pass the component as JSX */}
          <Route path="/login" element={<Login />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
};


export default App;
