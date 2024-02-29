import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    logout();
  };

  return (
    <button
      className="ml-auto p-2 rounded-md text-white bg-blue-800 hover:bg-cyan-900 text-sm"
      onClick={handleLogout}
    >
      Sign Out
    </button>
  );
};

export default LogoutButton;
