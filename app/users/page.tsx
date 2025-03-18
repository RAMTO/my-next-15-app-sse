import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  website: string;
}

export default async function Users() {
  // const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/users`
  );
  const users: User[] = await response.json();

  return (
    <div className="container my-5">
      <h1 className="mb-4">Users</h1>

      {users.length > 0 ? (
        <table className="table mb-4">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user.id}>
                <th scope="row">{user.id}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.website}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}

      <Link href="/" className="btn btn-primary">
        Back
      </Link>
    </div>
  );
}
