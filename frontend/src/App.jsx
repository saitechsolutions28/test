import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://test-project-zt4y.onrender.com")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Users</h1>

      {users.map((user) => (
        <div key={user.id}>
          {user.id} - {user.name}
        </div>
      ))}
    </div>
  );
}

export default App;
