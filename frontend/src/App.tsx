import React from 'react';
import './styles/main.scss';
import PensumEditorView from './components/PensumEditorView';
import ErrorDisplay from './components/ErrorDisplay';
import TechnicalManual from './components/TechnicalManual';
import UserManual from './components/UserManual';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider } from './context/AppContext';

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="app-container">
        <ErrorDisplay />
        <PensumEditorView />
        <TechnicalManual />
        <UserManual />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </AppProvider>
  );
};

export default App;
